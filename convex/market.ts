import { query, internalMutation, mutation } from "./_generated/server";
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

// ─── Daily reset: sets previousClose = current price, zeros daily change ─────
// Run at midnight via cron to prevent compounding inflation
export const dailyReset = internalMutation({
  handler: async (ctx) => {
    const stocks = await ctx.db.query("stocks").collect();
    for (const stock of stocks) {
      await ctx.db.patch(stock._id, {
        previousCloseInCents: stock.priceInCents,
        dailyChangeInCents: 0,
        dailyChangePercent: 0,
      });
    }
    console.log(`[dailyReset] Reset ${stocks.length} stocks`);
  },
});

// ─── Emergency price reset: restores all stocks to starting prices ───────────
// Call via: npx convex run market:resetPrices
export const resetPrices = mutation({
  handler: async (ctx) => {
    const STARTING_PRICES: Record<string, number> = {
      LOUD: 4200, SCROLL: 2800, VERSE: 1900,
      VIZN: 7800, NETFLO: 14200, LIVE: 3100,
      RYTHM: 6100, BLOC: 3400, CRATE: 1800,
      PIXL: 8800, MOBILE: 4400, SQUAD: 5600,
      KICKS: 11200, FLEX: 4700, COURT: 3300,
      DRIP: 6500, RARE: 9400, THREAD: 2200,
      INK: 3800, READS: 5100, PRESS: 1700,
      CROWN: 4700, GLOW: 3100, SHEEN: 2400,
      VAULT: 5200, STAX: 6800, GROW: 2900,
      BLOK: 9400, BUILD: 6700, HOOD: 3300,
      DRAFT: 5800, ARENA: 7100, STATS: 4400,
      SCREEN: 8300, STAGE: 4900, GAME: 3700,
    };

    const stocks = await ctx.db.query("stocks").collect();
    let resetCount = 0;

    for (const stock of stocks) {
      const startPrice = STARTING_PRICES[stock.symbol];
      if (!startPrice) continue;

      await ctx.db.patch(stock._id, {
        priceInCents: startPrice,
        previousCloseInCents: startPrice,
        dailyChangeInCents: 0,
        dailyChangePercent: 0,
        marketCapInCents: startPrice * 1_000_000,
        priceHistory: [{ timestamp: Date.now(), priceInCents: startPrice }],
      });
      resetCount++;
    }

    return { reset: resetCount };
  },
});
