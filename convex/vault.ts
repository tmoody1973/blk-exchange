import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all unlocked concepts for a player
export const getVault = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vault")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();
  },
});

// Unlock a concept (idempotent — returns existing if already unlocked)
export const unlockConcept = mutation({
  args: {
    playerId: v.id("players"),
    conceptId: v.string(),
    conceptName: v.string(),
    tier: v.union(
      v.literal("foundation"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("economics")
    ),
    triggerType: v.union(v.literal("behavior"), v.literal("event")),
    triggerEventHeadline: v.optional(v.string()),
    definition: v.string(),
    realWorldExample: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already unlocked
    const existing = await ctx.db
      .query("vault")
      .withIndex("by_player_concept", (q) =>
        q.eq("playerId", args.playerId).eq("conceptId", args.conceptId)
      )
      .first();
    if (existing) return existing;

    // Compute portfolio value at unlock time
    const player = await ctx.db.get(args.playerId);
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    let portfolioValue = player?.cashInCents ?? 0;
    for (const h of holdings) {
      const stock = await ctx.db.get(h.stockId);
      if (stock) portfolioValue += Math.round(h.shares * stock.priceInCents);
    }

    const id = await ctx.db.insert("vault", {
      playerId: args.playerId,
      conceptId: args.conceptId,
      conceptName: args.conceptName,
      tier: args.tier,
      unlockedAt: Date.now(),
      triggerType: args.triggerType,
      triggerEventHeadline: args.triggerEventHeadline,
      portfolioValueAtUnlock: portfolioValue,
      definition: args.definition,
      realWorldExample: args.realWorldExample,
    });

    return await ctx.db.get(id);
  },
});

// Check behavior-based triggers after a trade or portfolio state change.
// Returns a list of conceptIds newly eligible to unlock.
// The caller is responsible for calling unlockConcept for each returned id.
export const checkBehaviorTriggers = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const vault = await ctx.db
      .query("vault")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();
    const unlockedIds = new Set(vault.map((v) => v.conceptId));

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    const trades = await ctx.db
      .query("trades")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    const player = await ctx.db.get(args.playerId);
    if (!player) return [];

    // Enrich holdings with stock sector and current price
    const enrichedHoldings = await Promise.all(
      holdings.map(async (h) => {
        const stock = await ctx.db.get(h.stockId);
        return {
          ...h,
          sector: stock?.sector ?? "",
          currentPrice: stock?.priceInCents ?? 0,
        };
      })
    );

    // Compute total portfolio value
    let portfolioValue = player.cashInCents;
    for (const h of enrichedHoldings) {
      portfolioValue += Math.round(h.shares * h.currentPrice);
    }

    const newUnlocks: string[] = [];

    // buy-sell-basics: has at least 1 buy AND 1 sell
    if (!unlockedIds.has("buy-sell-basics")) {
      const hasBuy = trades.some((t) => t.type === "buy");
      const hasSell = trades.some((t) => t.type === "sell");
      if (hasBuy && hasSell) newUnlocks.push("buy-sell-basics");
    }

    // profit-loss: has sold something
    if (!unlockedIds.has("profit-loss")) {
      if (trades.some((t) => t.type === "sell")) newUnlocks.push("profit-loss");
    }

    // portfolio-value: portfolio differs from $10K starting value by 10%+
    if (!unlockedIds.has("portfolio-value")) {
      const diff = Math.abs(portfolioValue - 1_000_000) / 1_000_000;
      if (diff >= 0.1) newUnlocks.push("portfolio-value");
    }

    // diversification: hold positions in 4+ different sectors
    if (!unlockedIds.has("diversification")) {
      const sectors = new Set(enrichedHoldings.map((h) => h.sector));
      if (sectors.size >= 4) newUnlocks.push("diversification");
    }

    // dollar-cost-avg: bought same stock 3+ times at different prices
    if (!unlockedIds.has("dollar-cost-avg")) {
      const buysBySymbol = new Map<string, Set<number>>();
      for (const t of trades) {
        if (t.type === "buy") {
          if (!buysBySymbol.has(t.symbol)) buysBySymbol.set(t.symbol, new Set());
          buysBySymbol.get(t.symbol)!.add(t.priceInCents);
        }
      }
      for (const prices of buysBySymbol.values()) {
        if (prices.size >= 3) {
          newUnlocks.push("dollar-cost-avg");
          break;
        }
      }
    }

    // portfolio-rebalancing: sold a position that was >25% of portfolio value
    if (!unlockedIds.has("portfolio-rebalancing")) {
      const recentSells = trades.filter((t) => t.type === "sell").slice(-5);
      for (const sell of recentSells) {
        if (sell.amountInCents > portfolioValue * 0.25) {
          newUnlocks.push("portfolio-rebalancing");
          break;
        }
      }
    }

    // risk-adjusted-return: portfolio is profitable AND diversification score is 60+
    if (!unlockedIds.has("risk-adjusted-return")) {
      const sectors = new Set(enrichedHoldings.map((h) => h.sector));
      const divScore = Math.round((sectors.size / 12) * 100);
      if (portfolioValue > 1_000_000 && divScore >= 60) {
        newUnlocks.push("risk-adjusted-return");
      }
    }

    // black-dollar: hold 5+ stocks across 3+ sectors simultaneously
    if (!unlockedIds.has("black-dollar")) {
      const sectors = new Set(enrichedHoldings.map((h) => h.sector));
      if (enrichedHoldings.length >= 5 && sectors.size >= 3) {
        newUnlocks.push("black-dollar");
      }
    }

    return newUnlocks;
  },
});
