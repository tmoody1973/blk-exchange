import { query, mutation, internalMutation } from "./_generated/server";
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

// Delete a player and all their data (holdings, trades, sessions, vault, leaderboard entries)
export const deletePlayer = internalMutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    // Delete holdings
    const holdings = await ctx.db.query("holdings").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const h of holdings) await ctx.db.delete(h._id);

    // Delete trades
    const trades = await ctx.db.query("trades").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const t of trades) await ctx.db.delete(t._id);

    // Delete sessions
    const sessions = await ctx.db.query("sessions").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const s of sessions) await ctx.db.delete(s._id);

    // Delete vault entries
    const vault = await ctx.db.query("vault").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const v2 of vault) await ctx.db.delete(v2._id);

    // Delete leaderboard entries
    const lb = await ctx.db.query("leaderboards").collect();
    for (const entry of lb) {
      if (entry.playerId === args.playerId) await ctx.db.delete(entry._id);
    }

    // Delete onboarding status
    const onboarding = await ctx.db.query("onboardingStatus").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const o of onboarding) await ctx.db.delete(o._id);

    // Delete curriculum debt
    const debt = await ctx.db.query("curriculumDebt").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const d of debt) await ctx.db.delete(d._id);

    // Delete player glossary
    const glossary = await ctx.db.query("playerGlossary").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const g of glossary) await ctx.db.delete(g._id);

    // Delete achievements
    const achievements = await ctx.db.query("playerAchievements").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const a of achievements) await ctx.db.delete(a._id);

    // Delete challenge progress
    const challenges = await ctx.db.query("challengeProgress").withIndex("by_player", q => q.eq("playerId", args.playerId)).collect();
    for (const c of challenges) await ctx.db.delete(c._id);

    // Delete the player
    await ctx.db.delete(args.playerId);

    return { deleted: true };
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
