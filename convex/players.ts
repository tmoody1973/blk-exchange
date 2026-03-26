import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const STARTING_CAPITAL_CENTS = 1_000_000; // $10,000

// Get or create player (called on first app load)
export const getOrCreate = mutation({
  args: { clerkId: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("players")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) return existing;

    const playerId = await ctx.db.insert("players", {
      clerkId: args.clerkId,
      name: args.name,
      cashInCents: STARTING_CAPITAL_CENTS,
      portfolioValueInCents: STARTING_CAPITAL_CENTS,
      totalEventsExperienced: 0,
      seasonResetUsed: false,
      streakDays: 0,
    });

    return await ctx.db.get(playerId);
  },
});

// Get player by Clerk ID
export const getPlayer = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("players")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Compute portfolio value (cash + holdings at current prices)
export const getPortfolioValue = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) return null;

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    let holdingsValue = 0;
    for (const holding of holdings) {
      const stock = await ctx.db.get(holding.stockId);
      if (stock) {
        holdingsValue += Math.round(holding.shares * stock.priceInCents);
      }
    }

    return {
      cashInCents: player.cashInCents,
      holdingsValueInCents: holdingsValue,
      totalValueInCents: player.cashInCents + holdingsValue,
    };
  },
});
