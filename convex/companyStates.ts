import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllStates = query({
  handler: async (ctx) => {
    return await ctx.db.query("companyStates").collect();
  },
});

export const getState = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("companyStates")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();
  },
});

export const updateState = internalMutation({
  args: {
    symbol: v.string(),
    recentEvents: v.optional(v.array(v.string())),
    lastEventType: v.optional(
      v.union(
        v.literal("earnings"),
        v.literal("product"),
        v.literal("partnership"),
        v.literal("personnel"),
        v.literal("macro")
      )
    ),
    revenueTrend: v.optional(
      v.union(
        v.literal("growing"),
        v.literal("stable"),
        v.literal("declining")
      )
    ),
  },
  handler: async (ctx, args) => {
    const state = await ctx.db
      .query("companyStates")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();

    if (!state) return;

    const updates: Record<string, unknown> = {};
    if (args.recentEvents !== undefined) updates.recentEvents = args.recentEvents;
    if (args.lastEventType !== undefined) updates.lastEventType = args.lastEventType;
    if (args.revenueTrend !== undefined) updates.revenueTrend = args.revenueTrend;

    await ctx.db.patch(state._id, updates);
  },
});
