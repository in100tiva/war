import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Cria ou retorna usuario existente por visitorId
export const getOrCreate = mutation({
  args: {
    name: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verifica se ja existe
    const existing = await ctx.db
      .query("users")
      .withIndex("by_visitorId", (q) => q.eq("visitorId", args.visitorId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Cria novo usuario
    const userId = await ctx.db.insert("users", {
      name: args.name,
      visitorId: args.visitorId,
      gamesPlayed: 0,
      gamesWon: 0,
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Atualiza nome do usuario
export const updateName = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { name: args.name });
  },
});

// Busca usuario por ID
export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Atualiza estatisticas do usuario
export const updateStats = mutation({
  args: {
    userId: v.id("users"),
    won: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;

    await ctx.db.patch(args.userId, {
      gamesPlayed: user.gamesPlayed + 1,
      gamesWon: user.gamesWon + (args.won ? 1 : 0),
    });
  },
});
