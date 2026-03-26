import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const ALL_CONCEPT_IDS = [
  "supply-demand",
  "bull-bear",
  "buy-sell-basics",
  "profit-loss",
  "portfolio-value",
  "diversification",
  "sector-correlation",
  "emotional-investing",
  "consumer-spending",
  "economic-multiplier",
  "dividend-investing",
  "halo-effect",
  "competitive-displacement",
  "pe-ratio",
  "economic-moat",
  "risk-adjusted-return",
  "dollar-cost-avg",
  "acquisition-economics",
  "vc-dilution",
  "portfolio-rebalancing",
  "inflation",
  "consumer-confidence",
  "black-dollar",
];

// Recompute which concepts are still missing and persist the result
export const updateDebt = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const vault = await ctx.db
      .query("vault")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    const unlockedIds = new Set(vault.map((v) => v.conceptId));
    const missing = ALL_CONCEPT_IDS.filter((id) => !unlockedIds.has(id));

    const existing = await ctx.db
      .query("curriculumDebt")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        missingConcepts: missing,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("curriculumDebt", {
        playerId: args.playerId,
        missingConcepts: missing,
        updatedAt: Date.now(),
      });
    }

    return missing;
  },
});

export const getDebt = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("curriculumDebt")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .first();
  },
});
