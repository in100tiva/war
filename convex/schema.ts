import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Usuarios registrados
  users: defineTable({
    name: v.string(),
    visitorId: v.optional(v.string()), // Para usuarios anonimos
    clerkId: v.optional(v.string()), // Para autenticacao futura
    isAI: v.optional(v.boolean()), // Se e um jogador de IA
    aiDifficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
    gamesPlayed: v.number(),
    gamesWon: v.number(),
    createdAt: v.number(),
  }).index("by_visitorId", ["visitorId"]),

  // Salas de jogo (lobbies)
  gameRooms: defineTable({
    code: v.string(), // Codigo da sala (ex: "ABC123")
    hostId: v.id("users"),
    status: v.union(
      v.literal("waiting"),
      v.literal("starting"),
      v.literal("playing"),
      v.literal("finished")
    ),
    maxPlayers: v.number(),
    settings: v.object({
      gameMode: v.union(v.literal("domination"), v.literal("objectives")),
      turnTimeLimit: v.optional(v.number()), // Em segundos
      allowSpectators: v.boolean(),
    }),
    createdAt: v.number(),
  }).index("by_code", ["code"]),

  // Jogadores em uma sala
  gamePlayers: defineTable({
    roomId: v.id("gameRooms"),
    userId: v.id("users"),
    color: v.string(),
    colorName: v.string(),
    isReady: v.boolean(),
    isConnected: v.boolean(),
    joinedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"]),

  // Estado do jogo (partida em andamento)
  games: defineTable({
    roomId: v.id("gameRooms"),
    currentPlayerIndex: v.number(),
    phase: v.union(
      v.literal("reinforce"),
      v.literal("attack"),
      v.literal("fortify")
    ),
    turnNumber: v.number(),
    reinforcementsLeft: v.number(),
    hasConqueredThisTurn: v.boolean(),
    cardTradeCount: v.optional(v.number()), // Contador de trocas de cartas (para bonus progressivo)
    winnerId: v.optional(v.id("users")),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
  }).index("by_room", ["roomId"]),

  // Estado dos territorios
  territories: defineTable({
    gameId: v.id("games"),
    territoryId: v.string(), // ID do territorio no mapa (ex: "brasil")
    ownerId: v.optional(v.id("users")),
    armies: v.number(),
  })
    .index("by_game", ["gameId"])
    .index("by_game_territory", ["gameId", "territoryId"]),

  // Cartas do jogo
  cards: defineTable({
    gameId: v.id("games"),
    playerId: v.optional(v.id("users")), // null = no baralho
    territoryId: v.string(),
    symbol: v.union(
      v.literal("soldier"),
      v.literal("cavalry"),
      v.literal("cannon"),
      v.literal("joker")
    ),
  })
    .index("by_game", ["gameId"])
    .index("by_player", ["playerId"]),

  // Objetivos secretos
  objectives: defineTable({
    gameId: v.id("games"),
    playerId: v.id("users"),
    type: v.string(),
    description: v.string(),
    isCompleted: v.boolean(),
    targetPlayerId: v.optional(v.id("users")), // Para objetivos de eliminar jogador
    targetContinents: v.optional(v.array(v.string())), // Para objetivos de conquistar continentes
    targetTerritoryCount: v.optional(v.number()), // Para objetivos de conquistar X territorios
  })
    .index("by_game", ["gameId"])
    .index("by_player", ["playerId"]),

  // Historico de acoes (para replay e log)
  gameActions: defineTable({
    gameId: v.id("games"),
    playerId: v.id("users"),
    actionType: v.string(),
    data: v.any(),
    timestamp: v.number(),
  }).index("by_game", ["gameId"]),

  // Mensagens do chat
  chatMessages: defineTable({
    roomId: v.id("gameRooms"),
    userId: v.id("users"),
    message: v.string(),
    timestamp: v.number(),
  }).index("by_room", ["roomId"]),
});
