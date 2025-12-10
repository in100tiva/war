import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Cores disponiveis para jogadores
const PLAYER_COLORS = [
  { color: "#e74c3c", name: "Vermelho" },
  { color: "#3498db", name: "Azul" },
  { color: "#2ecc71", name: "Verde" },
  { color: "#f39c12", name: "Laranja" },
  { color: "#9b59b6", name: "Roxo" },
  { color: "#1abc9c", name: "Turquesa" },
];

// Gera codigo de sala aleatorio
function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Cria uma nova sala
export const create = mutation({
  args: {
    hostId: v.id("users"),
    maxPlayers: v.optional(v.number()),
    gameMode: v.optional(v.union(v.literal("domination"), v.literal("objectives"))),
  },
  handler: async (ctx, args) => {
    // Gera codigo unico
    let code = generateRoomCode();
    let existing = await ctx.db
      .query("gameRooms")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    while (existing) {
      code = generateRoomCode();
      existing = await ctx.db
        .query("gameRooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .first();
    }

    // Cria a sala
    const roomId = await ctx.db.insert("gameRooms", {
      code,
      hostId: args.hostId,
      status: "waiting",
      maxPlayers: args.maxPlayers ?? 6,
      settings: {
        gameMode: args.gameMode ?? "domination",
        allowSpectators: false,
      },
      createdAt: Date.now(),
    });

    // Adiciona o host como primeiro jogador
    await ctx.db.insert("gamePlayers", {
      roomId,
      userId: args.hostId,
      color: PLAYER_COLORS[0].color,
      colorName: PLAYER_COLORS[0].name,
      isReady: false,
      isConnected: true,
      joinedAt: Date.now(),
    });

    return { roomId, code };
  },
});

// Entra em uma sala por codigo
export const join = mutation({
  args: {
    code: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("gameRooms")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!room) {
      throw new Error("Sala nao encontrada");
    }

    if (room.status !== "waiting") {
      throw new Error("Esta sala ja esta em jogo");
    }

    // Verifica se jogador ja esta na sala
    const existingPlayer = await ctx.db
      .query("gamePlayers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("roomId"), room._id))
      .first();

    if (existingPlayer) {
      // Reconecta o jogador
      await ctx.db.patch(existingPlayer._id, { isConnected: true });
      return { roomId: room._id, playerId: existingPlayer._id };
    }

    // Conta jogadores atuais
    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    if (players.length >= room.maxPlayers) {
      throw new Error("Sala cheia");
    }

    // Pega a proxima cor disponivel
    const usedColors = players.map((p) => p.color);
    const availableColor = PLAYER_COLORS.find((c) => !usedColors.includes(c.color));

    if (!availableColor) {
      throw new Error("Sem cores disponiveis");
    }

    // Adiciona jogador
    const playerId = await ctx.db.insert("gamePlayers", {
      roomId: room._id,
      userId: args.userId,
      color: availableColor.color,
      colorName: availableColor.name,
      isReady: false,
      isConnected: true,
      joinedAt: Date.now(),
    });

    return { roomId: room._id, playerId };
  },
});

// Busca sala por codigo
export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gameRooms")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();
  },
});

// Busca sala por ID
export const get = query({
  args: { roomId: v.id("gameRooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

// Lista jogadores de uma sala
export const getPlayers = query({
  args: { roomId: v.id("gameRooms") },
  handler: async (ctx, args) => {
    const players = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    // Busca dados dos usuarios
    const playersWithUsers = await Promise.all(
      players.map(async (player) => {
        const user = await ctx.db.get(player.userId);
        return { ...player, user };
      })
    );

    return playersWithUsers;
  },
});

// Marca jogador como pronto
export const setReady = mutation({
  args: {
    playerId: v.id("gamePlayers"),
    isReady: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, { isReady: args.isReady });
  },
});

// Sai da sala
export const leave = mutation({
  args: {
    roomId: v.id("gameRooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("gamePlayers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (player) {
      await ctx.db.delete(player._id);
    }

    // Se era o host, deleta a sala
    const room = await ctx.db.get(args.roomId);
    if (room && room.hostId === args.userId) {
      // Remove todos os jogadores
      const players = await ctx.db
        .query("gamePlayers")
        .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
        .collect();

      for (const p of players) {
        await ctx.db.delete(p._id);
      }

      await ctx.db.delete(args.roomId);
    }
  },
});

// Cria jogo solo contra IA
export const createSoloGame = mutation({
  args: {
    userId: v.id("users"),
    aiCount: v.number(), // 1-5 IAs
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  },
  handler: async (ctx, args) => {
    if (args.aiCount < 1 || args.aiCount > 5) {
      throw new Error("Numero de IAs deve ser entre 1 e 5");
    }

    // Gera codigo unico
    let code = generateRoomCode();
    let existing = await ctx.db
      .query("gameRooms")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    while (existing) {
      code = generateRoomCode();
      existing = await ctx.db
        .query("gameRooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .first();
    }

    // Cria a sala
    const roomId = await ctx.db.insert("gameRooms", {
      code,
      hostId: args.userId,
      status: "waiting",
      maxPlayers: args.aiCount + 1,
      settings: {
        gameMode: "domination",
        allowSpectators: false,
      },
      createdAt: Date.now(),
    });

    // Adiciona o jogador humano
    await ctx.db.insert("gamePlayers", {
      roomId,
      userId: args.userId,
      color: PLAYER_COLORS[0].color,
      colorName: PLAYER_COLORS[0].name,
      isReady: true,
      isConnected: true,
      joinedAt: Date.now(),
    });

    // Nomes para IAs
    const aiNames = [
      "General Bot",
      "Comandante IA",
      "Estrategista Virtual",
      "Almirante Digital",
      "Marechal Cyber",
    ];

    // Cria jogadores de IA
    const aiPlayerIds: string[] = [];
    for (let i = 0; i < args.aiCount; i++) {
      const aiUserId = await ctx.db.insert("users", {
        name: aiNames[i],
        visitorId: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isAI: true,
        aiDifficulty: args.difficulty,
        gamesPlayed: 0,
        gamesWon: 0,
        createdAt: Date.now(),
      });

      await ctx.db.insert("gamePlayers", {
        roomId,
        userId: aiUserId,
        color: PLAYER_COLORS[i + 1].color,
        colorName: PLAYER_COLORS[i + 1].name,
        isReady: true,
        isConnected: true,
        joinedAt: Date.now(),
      });

      aiPlayerIds.push(aiUserId);
    }

    return { roomId, code, aiPlayerIds, difficulty: args.difficulty };
  },
});

// Atualiza configuracoes da sala
export const updateSettings = mutation({
  args: {
    roomId: v.id("gameRooms"),
    hostId: v.id("users"),
    settings: v.object({
      gameMode: v.optional(v.union(v.literal("domination"), v.literal("objectives"))),
      turnTimeLimit: v.optional(v.number()),
      allowSpectators: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);

    if (!room || room.hostId !== args.hostId) {
      throw new Error("Apenas o host pode alterar configuracoes");
    }

    const newSettings = { ...room.settings, ...args.settings };
    await ctx.db.patch(args.roomId, { settings: newSettings });
  },
});
