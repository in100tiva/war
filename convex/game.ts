import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { TERRITORIES, CONTINENTS } from "./territories";

// Inicia o jogo
export const start = mutation({
  args: {
    roomId: v.id("gameRooms"),
    hostId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);

    if (!room || room.hostId !== args.hostId) {
      throw new Error("Apenas o host pode iniciar o jogo");
    }

    if (room.status !== "waiting") {
      throw new Error("Jogo ja iniciado");
    }

    // Busca jogadores
    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    if (players.length < 2) {
      throw new Error("Minimo 2 jogadores para iniciar");
    }

    // Verifica se todos estao prontos
    const allReady = players.every((p) => p.isReady || p.userId === args.hostId);
    if (!allReady) {
      throw new Error("Nem todos os jogadores estao prontos");
    }

    // Atualiza status da sala
    await ctx.db.patch(args.roomId, { status: "playing" });

    // Cria o jogo
    const gameId = await ctx.db.insert("games", {
      roomId: args.roomId,
      currentPlayerIndex: 0,
      phase: "reinforce",
      turnNumber: 1,
      reinforcementsLeft: 0,
      hasConqueredThisTurn: false,
      startedAt: Date.now(),
    });

    // Distribui territorios
    const territoryIds = Object.keys(TERRITORIES);
    shuffleArray(territoryIds);

    let playerIndex = 0;
    for (const territoryId of territoryIds) {
      await ctx.db.insert("territories", {
        gameId,
        territoryId,
        ownerId: players[playerIndex].userId,
        armies: 1,
      });
      playerIndex = (playerIndex + 1) % players.length;
    }

    // Distribui exercitos iniciais extras
    const initialArmies: Record<number, number> = {
      2: 40,
      3: 35,
      4: 30,
      5: 25,
      6: 20,
    };

    const armiesPerPlayer = initialArmies[players.length] || 30;
    const territoriesPerPlayer = Math.floor(territoryIds.length / players.length);
    const extraArmies = armiesPerPlayer - territoriesPerPlayer;

    for (const player of players) {
      const playerTerritories = await ctx.db
        .query("territories")
        .withIndex("by_game", (q) => q.eq("gameId", gameId))
        .filter((q) => q.eq(q.field("ownerId"), player.userId))
        .collect();

      // Distribui exercitos extras aleatoriamente
      for (let i = 0; i < extraArmies; i++) {
        const randomTerritory = playerTerritories[Math.floor(Math.random() * playerTerritories.length)];
        await ctx.db.patch(randomTerritory._id, {
          armies: randomTerritory.armies + 1,
        });
        randomTerritory.armies++;
      }
    }

    // Cria cartas do baralho
    const symbols: ("soldier" | "cavalry" | "cannon")[] = ["soldier", "cavalry", "cannon"];
    let symbolIndex = 0;

    for (const territoryId of territoryIds) {
      await ctx.db.insert("cards", {
        gameId,
        playerId: undefined,
        territoryId,
        symbol: symbols[symbolIndex % 3],
      });
      symbolIndex++;
    }

    // Adiciona 2 coringas
    await ctx.db.insert("cards", {
      gameId,
      playerId: undefined,
      territoryId: "joker1",
      symbol: "joker",
    });
    await ctx.db.insert("cards", {
      gameId,
      playerId: undefined,
      territoryId: "joker2",
      symbol: "joker",
    });

    // Se modo objetivos, distribui objetivos
    if (room.settings.gameMode === "objectives") {
      // TODO: Implementar distribuicao de objetivos
    }

    // Calcula reforcos do primeiro jogador
    const firstPlayerTerritories = await ctx.db
      .query("territories")
      .withIndex("by_game", (q) => q.eq("gameId", gameId))
      .filter((q) => q.eq(q.field("ownerId"), players[0].userId))
      .collect();

    const reinforcements = calculateReinforcements(firstPlayerTerritories);
    await ctx.db.patch(gameId, { reinforcementsLeft: reinforcements });

    return gameId;
  },
});

// Busca estado do jogo
export const getState = query({
  args: { roomId: v.id("gameRooms") },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query("games")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first();

    if (!game) return null;

    const territories = await ctx.db
      .query("territories")
      .withIndex("by_game", (q) => q.eq("gameId", game._id))
      .collect();

    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    const playersWithUsers = await Promise.all(
      players.map(async (player) => {
        const user = await ctx.db.get(player.userId);
        const playerTerritories = territories.filter((t) => t.ownerId === player.userId);
        return {
          ...player,
          user,
          isAI: user?.isAI || false,
          aiDifficulty: user?.aiDifficulty || null,
          territoryCount: playerTerritories.length,
          armyCount: playerTerritories.reduce((sum, t) => sum + t.armies, 0),
        };
      })
    );

    const currentPlayer = playersWithUsers[game.currentPlayerIndex];

    return {
      game,
      territories,
      players: playersWithUsers,
      currentPlayer,
      isCurrentPlayerAI: currentPlayer?.isAI || false,
    };
  },
});

// Adiciona reforco a um territorio
export const reinforce = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.id("users"),
    territoryId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Jogo nao encontrado");

    if (game.phase !== "reinforce") {
      throw new Error("Nao e fase de reforcos");
    }

    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", game.roomId))
      .collect();

    const currentPlayer = players[game.currentPlayerIndex];
    if (currentPlayer.userId !== args.userId) {
      throw new Error("Nao e seu turno");
    }

    if (args.amount > game.reinforcementsLeft) {
      throw new Error("Reforcos insuficientes");
    }

    const territory = await ctx.db
      .query("territories")
      .withIndex("by_game_territory", (q) =>
        q.eq("gameId", args.gameId).eq("territoryId", args.territoryId)
      )
      .first();

    if (!territory) throw new Error("Territorio nao encontrado");

    if (territory.ownerId !== args.userId) {
      throw new Error("Este territorio nao e seu");
    }

    // Adiciona reforcos
    await ctx.db.patch(territory._id, {
      armies: territory.armies + args.amount,
    });

    await ctx.db.patch(args.gameId, {
      reinforcementsLeft: game.reinforcementsLeft - args.amount,
    });

    // Registra acao
    await ctx.db.insert("gameActions", {
      gameId: args.gameId,
      playerId: args.userId,
      actionType: "reinforce",
      data: { territoryId: args.territoryId, amount: args.amount },
      timestamp: Date.now(),
    });
  },
});

// Avanca para proxima fase
export const nextPhase = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Jogo nao encontrado");

    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", game.roomId))
      .collect();

    const currentPlayer = players[game.currentPlayerIndex];
    if (currentPlayer.userId !== args.userId) {
      throw new Error("Nao e seu turno");
    }

    let newPhase = game.phase;

    if (game.phase === "reinforce") {
      newPhase = "attack";
    } else if (game.phase === "attack") {
      newPhase = "fortify";
    }

    await ctx.db.patch(args.gameId, { phase: newPhase });
  },
});

// Finaliza turno
export const endTurn = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Jogo nao encontrado");

    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", game.roomId))
      .collect();

    const activePlayers = await Promise.all(
      players.map(async (p) => {
        const territories = await ctx.db
          .query("territories")
          .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
          .filter((q) => q.eq(q.field("ownerId"), p.userId))
          .collect();
        return { ...p, territories };
      })
    ).then((ps) => ps.filter((p) => p.territories.length > 0));

    const currentPlayer = players[game.currentPlayerIndex];
    if (currentPlayer.userId !== args.userId) {
      throw new Error("Nao e seu turno");
    }

    // Se conquistou territorio, da uma carta
    if (game.hasConqueredThisTurn) {
      const availableCards = await ctx.db
        .query("cards")
        .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
        .filter((q) => q.eq(q.field("playerId"), undefined))
        .collect();

      if (availableCards.length > 0) {
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        await ctx.db.patch(randomCard._id, { playerId: args.userId });
      }
    }

    // Proximo jogador (pula eliminados)
    let nextPlayerIndex = (game.currentPlayerIndex + 1) % players.length;
    while (activePlayers.find((p) => p.userId === players[nextPlayerIndex].userId) === undefined) {
      nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
    }

    // Calcula reforcos do proximo jogador
    const nextPlayer = players[nextPlayerIndex];
    const nextPlayerTerritories = await ctx.db
      .query("territories")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("ownerId"), nextPlayer.userId))
      .collect();

    const reinforcements = calculateReinforcements(nextPlayerTerritories);

    await ctx.db.patch(args.gameId, {
      currentPlayerIndex: nextPlayerIndex,
      phase: "reinforce",
      turnNumber: game.turnNumber + 1,
      reinforcementsLeft: reinforcements,
      hasConqueredThisTurn: false,
    });
  },
});

// Ataque
export const attack = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.id("users"),
    fromTerritoryId: v.string(),
    toTerritoryId: v.string(),
    attackDice: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Jogo nao encontrado");

    if (game.phase !== "attack") {
      throw new Error("Nao e fase de ataque");
    }

    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", game.roomId))
      .collect();

    const currentPlayer = players[game.currentPlayerIndex];
    if (currentPlayer.userId !== args.userId) {
      throw new Error("Nao e seu turno");
    }

    const fromTerritory = await ctx.db
      .query("territories")
      .withIndex("by_game_territory", (q) =>
        q.eq("gameId", args.gameId).eq("territoryId", args.fromTerritoryId)
      )
      .first();

    const toTerritory = await ctx.db
      .query("territories")
      .withIndex("by_game_territory", (q) =>
        q.eq("gameId", args.gameId).eq("territoryId", args.toTerritoryId)
      )
      .first();

    if (!fromTerritory || !toTerritory) {
      throw new Error("Territorio nao encontrado");
    }

    if (fromTerritory.ownerId !== args.userId) {
      throw new Error("Voce nao controla o territorio de origem");
    }

    if (toTerritory.ownerId === args.userId) {
      throw new Error("Voce nao pode atacar seu proprio territorio");
    }

    // Verifica vizinhanca
    const fromTerritoryData = TERRITORIES[args.fromTerritoryId];
    if (!fromTerritoryData.neighbors.includes(args.toTerritoryId)) {
      throw new Error("Territorios nao sao vizinhos");
    }

    // Verifica dados de ataque
    const maxAttackDice = Math.min(3, fromTerritory.armies - 1);
    if (args.attackDice > maxAttackDice || args.attackDice < 1) {
      throw new Error("Numero invalido de dados de ataque");
    }

    // Rola dados
    const attackRolls = rollDice(args.attackDice);
    const defendDice = Math.min(2, toTerritory.armies);
    const defendRolls = rollDice(defendDice);

    // Ordena
    attackRolls.sort((a, b) => b - a);
    defendRolls.sort((a, b) => b - a);

    // Compara
    let attackerLosses = 0;
    let defenderLosses = 0;
    const comparisons = Math.min(attackRolls.length, defendRolls.length);

    for (let i = 0; i < comparisons; i++) {
      if (attackRolls[i] > defendRolls[i]) {
        defenderLosses++;
      } else {
        attackerLosses++;
      }
    }

    // Aplica perdas
    await ctx.db.patch(fromTerritory._id, {
      armies: fromTerritory.armies - attackerLosses,
    });

    const newDefenderArmies = toTerritory.armies - defenderLosses;
    await ctx.db.patch(toTerritory._id, {
      armies: newDefenderArmies,
    });

    let conquered = false;
    let eliminatedPlayer = null;

    // Verifica conquista
    if (newDefenderArmies <= 0) {
      conquered = true;
      const previousOwner = toTerritory.ownerId;

      await ctx.db.patch(toTerritory._id, {
        ownerId: args.userId,
        armies: args.attackDice, // Move os dados usados
      });

      await ctx.db.patch(fromTerritory._id, {
        armies: fromTerritory.armies - attackerLosses - args.attackDice,
      });

      await ctx.db.patch(args.gameId, {
        hasConqueredThisTurn: true,
      });

      // Verifica se eliminou jogador
      if (previousOwner) {
        const remainingTerritories = await ctx.db
          .query("territories")
          .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
          .filter((q) => q.eq(q.field("ownerId"), previousOwner))
          .collect();

        if (remainingTerritories.length === 0) {
          eliminatedPlayer = previousOwner;

          // Transfere cartas do jogador eliminado
          const eliminatedCards = await ctx.db
            .query("cards")
            .withIndex("by_player", (q) => q.eq("playerId", previousOwner))
            .collect();

          for (const card of eliminatedCards) {
            await ctx.db.patch(card._id, { playerId: args.userId });
          }
        }
      }

      // Verifica vitoria
      const allTerritories = await ctx.db
        .query("territories")
        .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
        .collect();

      const userTerritories = allTerritories.filter((t) => t.ownerId === args.userId);
      if (userTerritories.length === allTerritories.length) {
        await ctx.db.patch(args.gameId, {
          winnerId: args.userId,
        });

        const room = await ctx.db.get(game.roomId);
        if (room) {
          await ctx.db.patch(game.roomId, { status: "finished" });
        }
      }
    }

    // Registra acao
    await ctx.db.insert("gameActions", {
      gameId: args.gameId,
      playerId: args.userId,
      actionType: "attack",
      data: {
        from: args.fromTerritoryId,
        to: args.toTerritoryId,
        attackRolls,
        defendRolls,
        attackerLosses,
        defenderLosses,
        conquered,
        eliminatedPlayer,
      },
      timestamp: Date.now(),
    });

    return {
      attackRolls,
      defendRolls,
      attackerLosses,
      defenderLosses,
      conquered,
      eliminatedPlayer,
    };
  },
});

// Fortificar
export const fortify = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.id("users"),
    fromTerritoryId: v.string(),
    toTerritoryId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Jogo nao encontrado");

    if (game.phase !== "fortify") {
      throw new Error("Nao e fase de fortificacao");
    }

    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", game.roomId))
      .collect();

    const currentPlayer = players[game.currentPlayerIndex];
    if (currentPlayer.userId !== args.userId) {
      throw new Error("Nao e seu turno");
    }

    const fromTerritory = await ctx.db
      .query("territories")
      .withIndex("by_game_territory", (q) =>
        q.eq("gameId", args.gameId).eq("territoryId", args.fromTerritoryId)
      )
      .first();

    const toTerritory = await ctx.db
      .query("territories")
      .withIndex("by_game_territory", (q) =>
        q.eq("gameId", args.gameId).eq("territoryId", args.toTerritoryId)
      )
      .first();

    if (!fromTerritory || !toTerritory) {
      throw new Error("Territorio nao encontrado");
    }

    if (fromTerritory.ownerId !== args.userId || toTerritory.ownerId !== args.userId) {
      throw new Error("Voce deve controlar ambos os territorios");
    }

    // Verifica vizinhanca
    const fromTerritoryData = TERRITORIES[args.fromTerritoryId];
    if (!fromTerritoryData.neighbors.includes(args.toTerritoryId)) {
      throw new Error("Territorios nao sao vizinhos");
    }

    if (args.amount >= fromTerritory.armies) {
      throw new Error("Voce deve deixar pelo menos 1 exercito no territorio");
    }

    // Move exercitos
    await ctx.db.patch(fromTerritory._id, {
      armies: fromTerritory.armies - args.amount,
    });

    await ctx.db.patch(toTerritory._id, {
      armies: toTerritory.armies + args.amount,
    });

    // Registra acao
    await ctx.db.insert("gameActions", {
      gameId: args.gameId,
      playerId: args.userId,
      actionType: "fortify",
      data: {
        from: args.fromTerritoryId,
        to: args.toTerritoryId,
        amount: args.amount,
      },
      timestamp: Date.now(),
    });
  },
});

// Busca cartas do jogador
export const getPlayerCards = query({
  args: {
    gameId: v.id("games"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("playerId"), args.userId))
      .collect();

    return cards.map((card) => ({
      _id: card._id,
      territoryId: card.territoryId,
      symbol: card.symbol,
      territoryName: TERRITORIES[card.territoryId]?.name || card.territoryId,
    }));
  },
});

// Troca cartas por reforcos
export const tradeCards = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.id("users"),
    cardIds: v.array(v.id("cards")),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Jogo nao encontrado");

    if (game.phase !== "reinforce") {
      throw new Error("Voce so pode trocar cartas na fase de reforcos");
    }

    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", game.roomId))
      .collect();

    const currentPlayer = players[game.currentPlayerIndex];
    if (currentPlayer.userId !== args.userId) {
      throw new Error("Nao e seu turno");
    }

    if (args.cardIds.length !== 3) {
      throw new Error("Voce deve trocar exatamente 3 cartas");
    }

    // Busca as cartas
    const cards = await Promise.all(args.cardIds.map((id) => ctx.db.get(id)));

    // Verifica se todas as cartas pertencem ao jogador
    for (const card of cards) {
      if (!card || card.playerId !== args.userId) {
        throw new Error("Carta invalida ou nao pertence a voce");
      }
    }

    // Verifica se e uma combinacao valida
    const symbols = cards.map((c) => c!.symbol);
    const isValid = isValidCardCombination(symbols);

    if (!isValid) {
      throw new Error("Combinacao de cartas invalida");
    }

    // Calcula bonus (progressivo)
    const cardTradeCount = game.cardTradeCount || 0;
    const bonus = calculateCardBonus(cardTradeCount);

    // Bonus extra por territorio (se jogador controla um territorio de uma carta)
    let territorryBonus = 0;
    const playerTerritories = await ctx.db
      .query("territories")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("ownerId"), args.userId))
      .collect();

    const playerTerritoryIds = playerTerritories.map((t) => t.territoryId);
    for (const card of cards) {
      if (card && playerTerritoryIds.includes(card.territoryId) && card.symbol !== "joker") {
        territorryBonus += 2;
      }
    }

    // Retorna cartas ao baralho
    for (const cardId of args.cardIds) {
      await ctx.db.patch(cardId, { playerId: undefined });
    }

    // Adiciona reforcos
    await ctx.db.patch(args.gameId, {
      reinforcementsLeft: game.reinforcementsLeft + bonus + territorryBonus,
      cardTradeCount: cardTradeCount + 1,
    });

    // Registra acao
    await ctx.db.insert("gameActions", {
      gameId: args.gameId,
      playerId: args.userId,
      actionType: "tradeCards",
      data: {
        cardIds: args.cardIds,
        bonus,
        territorryBonus,
        totalBonus: bonus + territorryBonus,
      },
      timestamp: Date.now(),
    });

    return {
      bonus,
      territorryBonus,
      totalBonus: bonus + territorryBonus,
    };
  },
});

// Verifica combinacao de cartas valida
function isValidCardCombination(symbols: string[]): boolean {
  const counts: Record<string, number> = {};
  let jokers = 0;

  for (const symbol of symbols) {
    if (symbol === "joker") {
      jokers++;
    } else {
      counts[symbol] = (counts[symbol] || 0) + 1;
    }
  }

  // 3 iguais
  if (Object.values(counts).some((c) => c + jokers >= 3)) {
    return true;
  }

  // 3 diferentes (1 de cada)
  const uniqueSymbols = Object.keys(counts);
  if (uniqueSymbols.length === 3) {
    return true;
  }

  // 2 diferentes + 1 coringa
  if (uniqueSymbols.length === 2 && jokers >= 1) {
    return true;
  }

  // 1 + 2 coringas
  if (uniqueSymbols.length === 1 && jokers >= 2) {
    return true;
  }

  return false;
}

// Calcula bonus de troca de cartas (progressivo)
function calculateCardBonus(tradeCount: number): number {
  // Sistema progressivo classico do War
  const bonuses = [4, 6, 8, 10, 12, 15];
  if (tradeCount < bonuses.length) {
    return bonuses[tradeCount];
  }
  // Apos a 6a troca, incrementa de 5 em 5
  return 15 + (tradeCount - 5) * 5;
}

// Funcoes auxiliares
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function rollDice(count: number): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1);
  }
  return rolls;
}

function calculateReinforcements(territories: { territoryId: string }[]): number {
  // Base: territorios / 3 (minimo 3)
  let reinforcements = Math.max(3, Math.floor(territories.length / 3));

  // Bonus por continentes
  const territoryIds = territories.map((t) => t.territoryId);

  for (const [continentId, continent] of Object.entries(CONTINENTS)) {
    const ownsAll = continent.territories.every((t) => territoryIds.includes(t));
    if (ownsAll) {
      reinforcements += continent.bonus;
    }
  }

  return reinforcements;
}
