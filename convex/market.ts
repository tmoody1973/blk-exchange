import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all 36 stocks sorted by symbol
export const getAllStocks = query({
  handler: async (ctx) => {
    return await ctx.db.query("stocks").collect();
  },
});

// Get a single stock by symbol
export const getStock = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stocks")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();
  },
});

// Get stocks by sector
export const getStocksBySector = query({
  args: { sector: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stocks")
      .withIndex("by_sector", (q) => q.eq("sector", args.sector))
      .collect();
  },
});

// Compute BLK Index (weighted average of all stocks)
export const getBLKIndex = query({
  handler: async (ctx) => {
    const stocks = await ctx.db.query("stocks").collect();
    if (stocks.length === 0) return { priceInCents: 0, dailyChangePercent: 0 };

    const totalPrice = stocks.reduce((sum, s) => sum + s.priceInCents, 0);
    const avgPrice = Math.round(totalPrice / stocks.length);

    const totalChange = stocks.reduce((sum, s) => sum + s.dailyChangePercent, 0);
    const avgChange = totalChange / stocks.length;

    return {
      priceInCents: avgPrice,
      dailyChangePercent: Math.round(avgChange * 100) / 100,
    };
  },
});
