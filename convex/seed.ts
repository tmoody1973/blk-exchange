import { mutation } from "./_generated/server";
import { SEED_STOCKS, SEED_COMPANY_STATES } from "./seedData";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("stocks").first();
    if (existing) {
      return { seeded: false, message: "Already seeded" };
    }

    for (const stock of SEED_STOCKS) {
      await ctx.db.insert("stocks", {
        symbol: stock.symbol,
        name: stock.name,
        description: stock.description,
        sector: stock.sector,
        priceInCents: stock.priceInCents,
        previousCloseInCents: stock.previousCloseInCents,
        dailyChangeInCents: stock.dailyChangeInCents,
        dailyChangePercent: stock.dailyChangePercent,
        marketCapInCents: stock.marketCapInCents,
        priceHistory: stock.priceHistory as unknown as Array<{ timestamp: number; priceInCents: number }>,
      });
    }

    for (const state of SEED_COMPANY_STATES) {
      await ctx.db.insert("companyStates", {
        symbol: state.symbol,
        revenueTrend: state.revenueTrend,
        marketPosition: state.marketPosition,
        competitiveExposure: [...state.competitiveExposure],
        recentEvents: [...state.recentEvents],
        lastEventType: state.lastEventType,
        seasonalContext: state.seasonalContext,
      });
    }

    return { seeded: true, stockCount: SEED_STOCKS.length, stateCount: SEED_COMPANY_STATES.length };
  },
});
