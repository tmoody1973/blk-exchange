import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all holdings for a player, enriched with current stock data
export const getHoldings = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    const enriched = await Promise.all(
      holdings.map(async (h) => {
        const stock = await ctx.db.get(h.stockId);
        return {
          ...h,
          currentPriceInCents: stock?.priceInCents ?? 0,
          currentValueInCents: Math.round(h.shares * (stock?.priceInCents ?? 0)),
          pnlInCents: Math.round(h.shares * ((stock?.priceInCents ?? 0) - h.avgCostInCents)),
          pnlPercent:
            h.avgCostInCents > 0
              ? Math.round(
                  (((stock?.priceInCents ?? 0) - h.avgCostInCents) / h.avgCostInCents) * 10000
                ) / 100
              : 0,
          sector: stock?.sector ?? "",
        };
      })
    );

    return enriched;
  },
});

// Get a specific holding for a player + stock
export const getHoldingForStock = query({
  args: { playerId: v.id("players"), stockId: v.id("stocks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("holdings")
      .withIndex("by_player_stock", (q) =>
        q.eq("playerId", args.playerId).eq("stockId", args.stockId)
      )
      .first();
  },
});
