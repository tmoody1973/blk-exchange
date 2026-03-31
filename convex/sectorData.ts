import { query, internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Sector performance data — both simulated (BLK Exchange) and real (S&P 500 ETFs).
 *
 * BLK Exchange sectors map to real sector ETFs:
 *   Media, Streaming, Music, Publishing → XLC (Communication Services)
 *   Gaming, Sportswear, Fashion, Sports → XLY (Consumer Discretionary)
 *   Beauty → XLP (Consumer Staples)
 *   Finance → XLF (Financials)
 *   Real Estate → XLRE (Real Estate)
 *   Entertainment → XLC (Communication Services)
 */

// ─── Sim sector performance (computed from stock data) ──────────────────────

const SYMBOL_SECTORS: Record<string, string> = {
  LOUD: "media", SCROLL: "media", VERSE: "media",
  VIZN: "streaming", NETFLO: "streaming", LIVE: "streaming",
  RYTHM: "music", BLOC: "music", CRATE: "music",
  PIXL: "gaming", MOBILE: "gaming", SQUAD: "gaming",
  KICKS: "sportswear", FLEX: "sportswear", COURT: "sportswear",
  DRIP: "fashion", RARE: "fashion", THREAD: "fashion",
  INK: "publishing", READS: "publishing", PRESS: "publishing",
  CROWN: "beauty", GLOW: "beauty", SHEEN: "beauty",
  VAULT: "finance", STAX: "finance", GROW: "finance",
  BLOK: "realestate", BUILD: "realestate", HOOD: "realestate",
  DRAFT: "sports", ARENA: "sports", STATS: "sports",
  SCREEN: "entertainment", STAGE: "entertainment", GAME: "entertainment",
};

const SECTOR_NAMES: Record<string, string> = {
  media: "Media & Content",
  streaming: "Streaming",
  music: "Music",
  gaming: "Gaming",
  sportswear: "Sportswear",
  fashion: "Fashion",
  publishing: "Publishing",
  beauty: "Beauty",
  finance: "Finance",
  realestate: "Real Estate",
  sports: "Sports",
  entertainment: "Entertainment",
};

// Map BLK Exchange sectors to real ETFs
const SECTOR_TO_ETF: Record<string, string> = {
  media: "XLC",
  streaming: "NERD",
  music: "MUSQ",
  gaming: "HERO",
  sportswear: "XLY",
  fashion: "KLXY",
  publishing: "XLC",
  beauty: "XLP",
  finance: "XLF",
  realestate: "VNQ",
  sports: "FANZ",
  entertainment: "PEJ",
};

export const getSimSectorPerformance = query({
  handler: async (ctx) => {
    const stocks = await ctx.db.query("stocks").collect();

    const sectors = new Map<string, { totalPct: number; count: number }>();

    for (const stock of stocks) {
      const sectorId = SYMBOL_SECTORS[stock.symbol];
      if (!sectorId) continue;
      const existing = sectors.get(sectorId) ?? { totalPct: 0, count: 0 };
      existing.totalPct += stock.dailyChangePercent;
      existing.count += 1;
      sectors.set(sectorId, existing);
    }

    return Array.from(sectors.entries())
      .map(([id, data]) => ({
        id,
        name: SECTOR_NAMES[id] ?? id,
        changePercent: Math.round((data.totalPct / data.count) * 100) / 100,
        realEtf: SECTOR_TO_ETF[id] ?? null,
      }))
      .sort((a, b) => b.changePercent - a.changePercent);
  },
});

// Per-stock data for sector dropdown detail view
export const getStocksBySector = query({
  args: { sector: v.string() },
  handler: async (ctx, args) => {
    const stocks = await ctx.db
      .query("stocks")
      .withIndex("by_sector", (q) => q.eq("sector", args.sector))
      .collect();

    return stocks.map((s) => ({
      symbol: s.symbol,
      name: s.name,
      priceInCents: s.priceInCents,
      dailyChangePercent: s.dailyChangePercent,
      dailyChangeInCents: s.dailyChangeInCents,
    }));
  },
});

// ─── Real sector ETF data (fetched from Finnhub) ───────────────────────────

export const getRealSectorData = query({
  handler: async (ctx) => {
    return await ctx.db.query("realSectorEtfs").collect();
  },
});

export const upsertRealSectorEtf = internalMutation({
  args: {
    symbol: v.string(),
    name: v.string(),
    price: v.number(),
    changePercent: v.number(),
    lastUpdated: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("realSectorEtfs")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        price: args.price,
        changePercent: args.changePercent,
        lastUpdated: args.lastUpdated,
      });
    } else {
      await ctx.db.insert("realSectorEtfs", args);
    }
  },
});

export const fetchRealSectorData = internalAction({
  handler: async (ctx) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) return;

    const etfs = [
      { symbol: "XLF", name: "Financials" },
      { symbol: "XLC", name: "Comm. Services" },
      { symbol: "XLY", name: "Consumer Disc." },
      { symbol: "XLP", name: "Consumer Staples" },
      { symbol: "VNQ", name: "Real Estate" },
      { symbol: "HERO", name: "Gaming & Esports" },
      { symbol: "MUSQ", name: "Music Industry" },
      { symbol: "NERD", name: "Streaming & Digital" },
      { symbol: "PEJ", name: "Leisure & Entertainment" },
      { symbol: "KLXY", name: "Global Luxury" },
      { symbol: "FANZ", name: "Pro Sports" },
    ];

    for (const etf of etfs) {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${etf.symbol}&token=${apiKey}`
        );
        if (!response.ok) continue;

        const data = (await response.json()) as {
          c: number; // current price
          d: number; // change
          dp: number; // change percent
        };

        await ctx.runMutation(internal.sectorData.upsertRealSectorEtf, {
          symbol: etf.symbol,
          name: etf.name,
          price: data.c,
          changePercent: Math.round(data.dp * 100) / 100,
          lastUpdated: Date.now(),
        });
      } catch (err) {
        console.error(`Failed to fetch ${etf.symbol}:`, err);
      }
    }
  },
});
