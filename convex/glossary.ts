import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get a single glossary term by ID
export const getTerm = query({
  args: { termId: v.string() },
  handler: async (ctx, { termId }) => {
    return await ctx.db
      .query("glossaryTerms")
      .withIndex("by_termId", (q) => q.eq("termId", termId))
      .first();
  },
});

// Check if a player has seen a term
export const isTermSeen = query({
  args: { playerId: v.id("players"), termId: v.string() },
  handler: async (ctx, { playerId, termId }) => {
    const record = await ctx.db
      .query("playerGlossary")
      .withIndex("by_player_term", (q) =>
        q.eq("playerId", playerId).eq("termId", termId)
      )
      .first();
    return !!record;
  },
});

// Get all seen terms for a player (for batch checking)
export const getSeenTerms = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, { playerId }) => {
    const records = await ctx.db
      .query("playerGlossary")
      .withIndex("by_player", (q) => q.eq("playerId", playerId))
      .collect();
    return records.map((r) => r.termId);
  },
});

// Mark a term as seen
export const markTermSeen = mutation({
  args: {
    playerId: v.id("players"),
    termId: v.string(),
    eventId: v.optional(v.string()),
  },
  handler: async (ctx, { playerId, termId, eventId }) => {
    const existing = await ctx.db
      .query("playerGlossary")
      .withIndex("by_player_term", (q) =>
        q.eq("playerId", playerId).eq("termId", termId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        seenCount: existing.seenCount + 1,
      });
    } else {
      await ctx.db.insert("playerGlossary", {
        playerId,
        termId,
        firstSeenAt: Date.now(),
        firstSeenInEvent: eventId,
        seenCount: 1,
      });
    }
  },
});

// Get vault progress for a player
export const getVaultProgress = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, { playerId }) => {
    const seenRecords = await ctx.db
      .query("playerGlossary")
      .withIndex("by_player", (q) => q.eq("playerId", playerId))
      .collect();

    const termData = await Promise.all(
      seenRecords.map((r) =>
        ctx.db
          .query("glossaryTerms")
          .withIndex("by_termId", (q) => q.eq("termId", r.termId))
          .first()
      )
    );

    return {
      seen: termData.filter(Boolean),
      seenCount: seenRecords.length,
      total: 22,
      percentage: Math.round((seenRecords.length / 22) * 100),
    };
  },
});

// Seed glossary terms
export const seedGlossary = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("glossaryTerms")
      .withIndex("by_termId", (q) => q.eq("termId", "stock"))
      .first();
    if (existing) return { seeded: false, message: "Already seeded" };

    const terms = [
      { termId: "stock", term: "Stock", concept: "Equity Ownership", conceptId: "supply-demand", shortDef: "A share of ownership in a company. Own stock = own a piece." },
      { termId: "share-price", term: "Share Price", concept: "Market Pricing", conceptId: "supply-demand", shortDef: "What one share costs right now. It moves based on news and demand." },
      { termId: "market-order", term: "Market Order", concept: "Order Types", conceptId: "buy-sell-basics", shortDef: "Buy or sell immediately at the current price. No waiting." },
      { termId: "portfolio", term: "Portfolio", concept: "Portfolio Management", conceptId: "portfolio-value", shortDef: "Your collection of all investments. Think of it as your financial lineup." },
      { termId: "position", term: "Position", concept: "Position Sizing", conceptId: "portfolio-value", shortDef: "How much of one stock you hold. A bigger position = more riding on it." },
      { termId: "fractional-shares", term: "Fractional Shares", concept: "Fractional Investing", conceptId: "buy-sell-basics", shortDef: "Buying a piece of a share instead of a whole one. Invest any dollar amount." },
      { termId: "diversification", term: "Diversification", concept: "Risk Management", conceptId: "diversification", shortDef: "Don't put all your eggs in one basket. Spread investments across sectors." },
      { termId: "volatility", term: "Volatility", concept: "Risk Assessment", conceptId: "bull-bear", shortDef: "How wildly a price swings. High volatility = big moves, big risk." },
      { termId: "sector", term: "Sector", concept: "Market Structure", conceptId: "sector-correlation", shortDef: "A category of businesses. Tech, food, media — each is a sector." },
      { termId: "bull-market", term: "Bull Market", concept: "Market Cycles", conceptId: "bull-bear", shortDef: "When prices are rising and optimism is high. Bulls charge upward." },
      { termId: "bear-market", term: "Bear Market", concept: "Market Cycles", conceptId: "bull-bear", shortDef: "When prices are falling and fear takes over. Bears swipe downward." },
      { termId: "roi", term: "Return on Investment", concept: "Investment Returns", conceptId: "profit-loss", shortDef: "How much profit (or loss) you made relative to what you put in." },
      { termId: "unrealized-gains", term: "Unrealized Gains", concept: "Gains & Losses", conceptId: "profit-loss", shortDef: "Profit that exists on paper but you haven't locked in by selling yet." },
      { termId: "realized-gains", term: "Realized Gains", concept: "Gains & Losses", conceptId: "profit-loss", shortDef: "Profit you've actually locked in by selling a stock." },
      { termId: "cost-basis", term: "Cost Basis", concept: "Investment Accounting", conceptId: "dollar-cost-avg", shortDef: "The original price you paid. Used to calculate your profit or loss." },
      { termId: "position-cap", term: "Position Cap", concept: "Risk Limits", conceptId: "portfolio-rebalancing", shortDef: "A maximum % of your portfolio in one stock. Here it's 25%." },
      { termId: "market-cap", term: "Market Cap", concept: "Company Valuation", conceptId: "pe-ratio", shortDef: "A company's total value = share price × total shares. Bigger = more established." },
      { termId: "volume", term: "Trading Volume", concept: "Market Activity", conceptId: "supply-demand", shortDef: "How many shares are being bought and sold. High volume = lots of action." },
      { termId: "sentiment", term: "Market Sentiment", concept: "Behavioral Finance", conceptId: "emotional-investing", shortDef: "The overall mood of investors. Are people feeling confident or scared?" },
      { termId: "catalyst", term: "Catalyst", concept: "Price Drivers", conceptId: "supply-demand", shortDef: "A news event that causes a stock to move. The 'why' behind the price change." },
      { termId: "correlation", term: "Correlation", concept: "Portfolio Theory", conceptId: "sector-correlation", shortDef: "When two stocks move together (or opposite). Helps you diversify smarter." },
      { termId: "benchmark", term: "Benchmark", concept: "Performance Measurement", conceptId: "risk-adjusted-return", shortDef: "A standard to compare your returns against. Did you beat the market?" },
    ];

    for (const term of terms) {
      await ctx.db.insert("glossaryTerms", term);
    }

    return { seeded: true, count: terms.length };
  },
});
