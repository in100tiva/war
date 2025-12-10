import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Envia uma mensagem no chat
export const send = mutation({
  args: {
    roomId: v.id("gameRooms"),
    userId: v.id("users"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Valida mensagem
    const trimmedMessage = args.message.trim();
    if (!trimmedMessage || trimmedMessage.length > 500) {
      throw new Error("Mensagem invalida");
    }

    // Verifica se usuario esta na sala
    const player = await ctx.db
      .query("gamePlayers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!player) {
      throw new Error("Voce nao esta nesta sala");
    }

    // Insere mensagem
    const messageId = await ctx.db.insert("chatMessages", {
      roomId: args.roomId,
      userId: args.userId,
      message: trimmedMessage,
      timestamp: Date.now(),
    });

    return messageId;
  },
});

// Busca mensagens do chat
export const getMessages = query({
  args: {
    roomId: v.id("gameRooms"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(limit);

    // Busca dados dos usuarios
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.userId);
        const player = await ctx.db
          .query("gamePlayers")
          .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
          .filter((q) => q.eq(q.field("userId"), message.userId))
          .first();

        return {
          _id: message._id,
          message: message.message,
          timestamp: message.timestamp,
          user: user ? { name: user.name, isAI: user.isAI } : null,
          playerColor: player?.color || "#666",
        };
      })
    );

    // Retorna em ordem cronologica (mais antigas primeiro)
    return messagesWithUsers.reverse();
  },
});
