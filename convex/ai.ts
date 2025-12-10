import { mutation, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { TERRITORIES, CONTINENTS, areNeighbors, getNeighbors } from "./territories";

// Tipos de estrategia de IA
type AIStrategy = "aggressive" | "defensive" | "balanced";

// Interface para territorio com dados calculados
interface TerritoryState {
  territoryId: string;
  ownerId: string | null;
  armies: number;
  continent: string;
  neighbors: string[];
}

// Cria um jogador de IA
export const createAIPlayer = mutation({
  args: {
    roomId: v.id("gameRooms"),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    aiName: v.string(),
  },
  handler: async (ctx, args) => {
    // Cria um usuario de IA
    const aiUserId = await ctx.db.insert("users", {
      name: args.aiName,
      visitorId: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gamesPlayed: 0,
      gamesWon: 0,
      createdAt: Date.now(),
    });

    // Cores disponiveis
    const colors = [
      { color: "#e74c3c", name: "Vermelho" },
      { color: "#3498db", name: "Azul" },
      { color: "#2ecc71", name: "Verde" },
      { color: "#f39c12", name: "Laranja" },
      { color: "#9b59b6", name: "Roxo" },
      { color: "#1abc9c", name: "Turquesa" },
    ];

    // Busca jogadores existentes para determinar cor
    const existingPlayers = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    const usedColors = existingPlayers.map((p) => p.color);
    const availableColor = colors.find((c) => !usedColors.includes(c.color)) || colors[0];

    // Adiciona como jogador
    await ctx.db.insert("gamePlayers", {
      roomId: args.roomId,
      userId: aiUserId,
      color: availableColor.color,
      colorName: availableColor.name,
      isReady: true,
      isConnected: true,
      joinedAt: Date.now(),
    });

    // Armazena configuracao da IA (usando gameActions como metadata)
    // Poderiamos criar uma tabela separada, mas isso funciona para MVP

    return { aiUserId, difficulty: args.difficulty };
  },
});

// Executa turno da IA (chamado quando e a vez de uma IA)
export const executeAITurn = action({
  args: {
    gameId: v.id("games"),
    aiUserId: v.id("users"),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  },
  handler: async (ctx, args) => {
    // Delay baseado na dificuldade para parecer mais natural
    const delays = { easy: 1500, medium: 1000, hard: 500 };
    const baseDelay = delays[args.difficulty];

    // Fase de reforcos
    await new Promise((r) => setTimeout(r, baseDelay));
    await ctx.runMutation(internal.ai.aiReinforce, {
      gameId: args.gameId,
      aiUserId: args.aiUserId,
      difficulty: args.difficulty,
    });

    // Fase de ataque
    await new Promise((r) => setTimeout(r, baseDelay));
    await ctx.runMutation(internal.ai.aiAttack, {
      gameId: args.gameId,
      aiUserId: args.aiUserId,
      difficulty: args.difficulty,
    });

    // Fase de fortificacao
    await new Promise((r) => setTimeout(r, baseDelay));
    await ctx.runMutation(internal.ai.aiFortify, {
      gameId: args.gameId,
      aiUserId: args.aiUserId,
      difficulty: args.difficulty,
    });

    // Finaliza turno
    await new Promise((r) => setTimeout(r, baseDelay / 2));
    await ctx.runMutation(internal.ai.aiEndTurn, {
      gameId: args.gameId,
      aiUserId: args.aiUserId,
    });
  },
});

// IA: Fase de reforcos
export const aiReinforce = internalMutation({
  args: {
    gameId: v.id("games"),
    aiUserId: v.id("users"),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || game.phase !== "reinforce") return;

    // Primeiro, verifica se tem cartas para trocar
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .filter((q) => q.eq(q.field("playerId"), args.aiUserId))
      .collect();

    // IA troca cartas se tiver 5+ ou se a combinacao for muito boa
    if (cards.length >= 5 || (cards.length >= 3 && args.difficulty !== "easy")) {
      const validCombination = findValidCardCombination(cards);
      if (validCombination) {
        for (const cardId of validCombination) {
          await ctx.db.patch(cardId, { playerId: undefined });
        }
        const cardTradeCount = game.cardTradeCount || 0;
        const bonus = calculateCardBonus(cardTradeCount);
        await ctx.db.patch(args.gameId, {
          reinforcementsLeft: game.reinforcementsLeft + bonus,
          cardTradeCount: cardTradeCount + 1,
        });
      }
    }

    // Busca territorios da IA
    const territories = await ctx.db
      .query("territories")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    const aiTerritories = territories.filter((t) => t.ownerId === args.aiUserId);
    if (aiTerritories.length === 0) return;

    // Busca game atualizado
    const updatedGame = await ctx.db.get(args.gameId);
    if (!updatedGame) return;
    let reinforcementsLeft = updatedGame.reinforcementsLeft;

    // Estrategia de distribuicao baseada na dificuldade
    const strategy = getStrategy(args.difficulty);

    while (reinforcementsLeft > 0) {
      const targetTerritory = selectReinforcementTarget(aiTerritories, territories, strategy, args.difficulty);
      if (!targetTerritory) break;

      const amount = args.difficulty === "easy" ? 1 : Math.min(reinforcementsLeft, Math.ceil(reinforcementsLeft / 3));

      await ctx.db.patch(targetTerritory._id, {
        armies: targetTerritory.armies + amount,
      });
      targetTerritory.armies += amount;
      reinforcementsLeft -= amount;
    }

    // Atualiza game e avanca fase
    await ctx.db.patch(args.gameId, {
      reinforcementsLeft: 0,
      phase: "attack",
    });
  },
});

// IA: Fase de ataque
export const aiAttack = internalMutation({
  args: {
    gameId: v.id("games"),
    aiUserId: v.id("users"),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || game.phase !== "attack") return;

    const territories = await ctx.db
      .query("territories")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    // Numero de ataques baseado na dificuldade
    const maxAttacks = { easy: 2, medium: 5, hard: 10 };
    let attackCount = 0;
    let hasConquered = false;

    while (attackCount < maxAttacks[args.difficulty]) {
      // Encontra melhor ataque
      const attackOption = findBestAttack(territories, args.aiUserId, args.difficulty);
      if (!attackOption) break;

      const { attacker, defender } = attackOption;

      // Executa ataque
      const attackDice = Math.min(3, attacker.armies - 1);
      const defendDice = Math.min(2, defender.armies);

      const attackRolls = rollDice(attackDice);
      const defendRolls = rollDice(defendDice);

      attackRolls.sort((a, b) => b - a);
      defendRolls.sort((a, b) => b - a);

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
      const newAttackerArmies = attacker.armies - attackerLosses;
      const newDefenderArmies = defender.armies - defenderLosses;

      await ctx.db.patch(attacker._id, { armies: newAttackerArmies });

      if (newDefenderArmies <= 0) {
        // Conquista
        const armiesToMove = attackDice;
        await ctx.db.patch(defender._id, {
          ownerId: args.aiUserId,
          armies: armiesToMove,
        });
        await ctx.db.patch(attacker._id, {
          armies: newAttackerArmies - armiesToMove,
        });

        // Atualiza cache local
        attacker.armies = newAttackerArmies - armiesToMove;
        defender.armies = armiesToMove;
        defender.ownerId = args.aiUserId;
        hasConquered = true;
      } else {
        await ctx.db.patch(defender._id, { armies: newDefenderArmies });
        attacker.armies = newAttackerArmies;
        defender.armies = newDefenderArmies;
      }

      attackCount++;
    }

    // Atualiza flag de conquista e avanca fase
    await ctx.db.patch(args.gameId, {
      hasConqueredThisTurn: game.hasConqueredThisTurn || hasConquered,
      phase: "fortify",
    });
  },
});

// IA: Fase de fortificacao
export const aiFortify = internalMutation({
  args: {
    gameId: v.id("games"),
    aiUserId: v.id("users"),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || game.phase !== "fortify") return;

    if (args.difficulty === "easy") {
      // IA facil nao fortifica
      return;
    }

    const territories = await ctx.db
      .query("territories")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    const aiTerritories = territories.filter((t) => t.ownerId === args.aiUserId);

    // Encontra territorio com mais exercitos sem vizinhos inimigos
    const safeWithArmies = aiTerritories
      .filter((t) => {
        const neighbors = getNeighbors(t.territoryId);
        const hasEnemyNeighbor = neighbors.some((n) => {
          const neighbor = territories.find((nt) => nt.territoryId === n);
          return neighbor && neighbor.ownerId !== args.aiUserId;
        });
        return !hasEnemyNeighbor && t.armies > 1;
      })
      .sort((a, b) => b.armies - a.armies);

    if (safeWithArmies.length === 0) return;

    const source = safeWithArmies[0];

    // Encontra vizinho na fronteira
    const neighbors = getNeighbors(source.territoryId);
    const friendlyNeighbors = neighbors
      .map((n) => territories.find((t) => t.territoryId === n))
      .filter((t) => t && t.ownerId === args.aiUserId) as typeof territories;

    const frontierNeighbor = friendlyNeighbors.find((t) => {
      const itsNeighbors = getNeighbors(t.territoryId);
      return itsNeighbors.some((n) => {
        const neighbor = territories.find((nt) => nt.territoryId === n);
        return neighbor && neighbor.ownerId !== args.aiUserId;
      });
    });

    if (frontierNeighbor) {
      const amount = source.armies - 1;
      await ctx.db.patch(source._id, { armies: 1 });
      await ctx.db.patch(frontierNeighbor._id, {
        armies: frontierNeighbor.armies + amount,
      });
    }
  },
});

// IA: Finaliza turno
export const aiEndTurn = internalMutation({
  args: {
    gameId: v.id("games"),
    aiUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return;

    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", game.roomId))
      .collect();

    // Verifica jogadores ativos
    const territories = await ctx.db
      .query("territories")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();

    const activePlayers = players.filter((p) => {
      const playerTerritories = territories.filter((t) => t.ownerId === p.userId);
      return playerTerritories.length > 0;
    });

    // Da carta se conquistou territorio
    if (game.hasConqueredThisTurn) {
      const availableCards = await ctx.db
        .query("cards")
        .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
        .filter((q) => q.eq(q.field("playerId"), undefined))
        .collect();

      if (availableCards.length > 0) {
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        await ctx.db.patch(randomCard._id, { playerId: args.aiUserId });
      }
    }

    // Proximo jogador
    let nextPlayerIndex = (game.currentPlayerIndex + 1) % players.length;
    while (!activePlayers.find((p) => p.userId === players[nextPlayerIndex].userId)) {
      nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
    }

    // Calcula reforcos do proximo jogador
    const nextPlayer = players[nextPlayerIndex];
    const nextPlayerTerritories = territories.filter((t) => t.ownerId === nextPlayer.userId);
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

// Funcoes auxiliares

function getStrategy(difficulty: string): AIStrategy {
  if (difficulty === "easy") return "defensive";
  if (difficulty === "hard") return "aggressive";
  return "balanced";
}

function selectReinforcementTarget(
  aiTerritories: any[],
  allTerritories: any[],
  strategy: AIStrategy,
  difficulty: string
): any | null {
  if (difficulty === "easy") {
    // IA facil escolhe aleatoriamente
    return aiTerritories[Math.floor(Math.random() * aiTerritories.length)];
  }

  // Prioriza territorios na fronteira
  const frontierTerritories = aiTerritories.filter((t) => {
    const neighbors = getNeighbors(t.territoryId);
    return neighbors.some((n) => {
      const neighbor = allTerritories.find((nt) => nt.territoryId === n);
      return neighbor && neighbor.ownerId !== t.ownerId;
    });
  });

  if (frontierTerritories.length === 0) {
    return aiTerritories[0];
  }

  if (strategy === "aggressive") {
    // Prioriza territorios com vantagem para atacar
    return frontierTerritories.reduce((best, current) => {
      const bestNeighbors = getNeighbors(best.territoryId);
      const currentNeighbors = getNeighbors(current.territoryId);

      const bestEnemyWeakest = Math.min(
        ...bestNeighbors
          .map((n) => allTerritories.find((t) => t.territoryId === n))
          .filter((t) => t && t.ownerId !== best.ownerId)
          .map((t) => t?.armies || 999)
      );

      const currentEnemyWeakest = Math.min(
        ...currentNeighbors
          .map((n) => allTerritories.find((t) => t.territoryId === n))
          .filter((t) => t && t.ownerId !== current.ownerId)
          .map((t) => t?.armies || 999)
      );

      return currentEnemyWeakest < bestEnemyWeakest ? current : best;
    });
  }

  // Balanceado ou defensivo: reforça territorios mais fracos na fronteira
  return frontierTerritories.reduce((weakest, current) =>
    current.armies < weakest.armies ? current : weakest
  );
}

function findBestAttack(
  territories: any[],
  aiUserId: string,
  difficulty: string
): { attacker: any; defender: any } | null {
  const aiTerritories = territories.filter(
    (t) => t.ownerId === aiUserId && t.armies > 1
  );

  let bestAttack: { attacker: any; defender: any; score: number } | null = null;

  for (const attacker of aiTerritories) {
    const neighbors = getNeighbors(attacker.territoryId);

    for (const neighborId of neighbors) {
      const defender = territories.find((t) => t.territoryId === neighborId);

      if (!defender || defender.ownerId === aiUserId) continue;

      // Calcula score do ataque
      const armyAdvantage = attacker.armies - defender.armies;

      // Minimo de vantagem baseado na dificuldade
      const minAdvantage = { easy: 3, medium: 1, hard: 0 };

      if (armyAdvantage < minAdvantage[difficulty as keyof typeof minAdvantage]) continue;

      const score = armyAdvantage + (attacker.armies > 3 ? 2 : 0);

      if (!bestAttack || score > bestAttack.score) {
        bestAttack = { attacker, defender, score };
      }
    }
  }

  return bestAttack ? { attacker: bestAttack.attacker, defender: bestAttack.defender } : null;
}

function rollDice(count: number): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1);
  }
  return rolls;
}

function findValidCardCombination(cards: any[]): string[] | null {
  if (cards.length < 3) return null;

  // Tenta encontrar 3 iguais
  const bySymbol: Record<string, any[]> = {};
  for (const card of cards) {
    if (!bySymbol[card.symbol]) bySymbol[card.symbol] = [];
    bySymbol[card.symbol].push(card);
  }

  for (const symbol in bySymbol) {
    if (bySymbol[symbol].length >= 3) {
      return bySymbol[symbol].slice(0, 3).map((c) => c._id);
    }
  }

  // Tenta 3 diferentes
  const symbols = ["soldier", "cavalry", "cannon"];
  const different: any[] = [];
  for (const symbol of symbols) {
    const card = cards.find((c) => c.symbol === symbol && !different.includes(c));
    if (card) different.push(card);
  }
  if (different.length === 3) {
    return different.map((c) => c._id);
  }

  // Tenta com coringa
  const jokers = cards.filter((c) => c.symbol === "joker");
  if (jokers.length >= 1 && different.length >= 2) {
    return [...different.slice(0, 2), jokers[0]].map((c) => c._id);
  }

  return null;
}

function calculateCardBonus(tradeCount: number): number {
  const bonuses = [4, 6, 8, 10, 12, 15];
  if (tradeCount < bonuses.length) {
    return bonuses[tradeCount];
  }
  return 15 + (tradeCount - 5) * 5;
}

function calculateReinforcements(territories: { territoryId: string }[]): number {
  let reinforcements = Math.max(3, Math.floor(territories.length / 3));

  const territoryIds = territories.map((t) => t.territoryId);

  for (const [, continent] of Object.entries(CONTINENTS)) {
    const ownsAll = continent.territories.every((t) => territoryIds.includes(t));
    if (ownsAll) {
      reinforcements += continent.bonus;
    }
  }

  return reinforcements;
}
