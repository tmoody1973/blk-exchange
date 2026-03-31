import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Realistic market simulation engine.
 *
 * Adds four layers of realism to the BLK Exchange price engine:
 * 1. Background noise: small random fluctuations every 30 min
 * 2. Sector rotation: hot sectors cool down, cold sectors warm up
 * 3. Mean reversion: stocks drift back toward seed price over time
 * 4. Correlation: stocks in the same sector move together slightly
 *
 * This runs on a 30-minute cron, independent of the event system.
 * Events still drive large price moves. This engine handles the
 * "between events" reality that makes a market feel alive.
 */

const SEED_PRICES: Record<string, number> = {
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

// Seeded random that's deterministic per tick but different each run
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export const simulateMarket = internalMutation({
  args: {},
  handler: async (ctx) => {
    const stocks = await ctx.db.query("stocks").collect();
    if (stocks.length === 0) return;

    const now = Date.now();
    const random = seededRandom(now);

    // Calculate sector performance (average daily change % per sector)
    const sectorPerformance = new Map<string, { totalPct: number; count: number }>();
    for (const stock of stocks) {
      const sector = SYMBOL_SECTORS[stock.symbol];
      if (!sector) continue;
      const existing = sectorPerformance.get(sector) ?? { totalPct: 0, count: 0 };
      existing.totalPct += stock.dailyChangePercent;
      existing.count += 1;
      sectorPerformance.set(sector, existing);
    }

    // Generate sector drift: hot sectors get negative pressure, cold sectors get positive
    const sectorDrift = new Map<string, number>();
    for (const [sector, perf] of sectorPerformance) {
      const avgPct = perf.totalPct / perf.count;
      // If sector is up > 3%, apply downward pressure (-0.1 to -0.3%)
      // If sector is down > 3%, apply upward pressure (+0.1 to +0.3%)
      // Otherwise, neutral
      if (avgPct > 3) {
        sectorDrift.set(sector, -0.1 - random() * 0.2);
      } else if (avgPct < -3) {
        sectorDrift.set(sector, 0.1 + random() * 0.2);
      } else {
        sectorDrift.set(sector, (random() - 0.5) * 0.1); // tiny neutral noise
      }
    }

    for (const stock of stocks) {
      const sector = SYMBOL_SECTORS[stock.symbol];
      const seedPrice = SEED_PRICES[stock.symbol];
      if (!sector || !seedPrice) continue;

      // Layer 1: Random noise with stock-specific volatility
      // Higher-priced stocks are more stable, lower-priced are more volatile
      // This mimics real markets where penny stocks swing harder than blue chips
      const volatility = seedPrice < 3000 ? 1.2 : seedPrice < 6000 ? 0.8 : 0.5;
      const noise = (random() - 0.5) * volatility;

      // Layer 2: Sector rotation pressure
      const sectorPressure = sectorDrift.get(sector) ?? 0;

      // Layer 3: Mean reversion (pull toward seed price)
      // Only activates meaningfully when price is >10% from seed
      const deviation = (stock.priceInCents - seedPrice) / seedPrice;
      // Gentle below 10% deviation, stronger above
      const absDeviation = Math.abs(deviation);
      const reversionStrength = absDeviation > 0.2 ? 2 : absDeviation > 0.1 ? 1 : 0.3;
      const meanReversion = -deviation * reversionStrength;
      // Cap mean reversion to ±1% per tick
      const clampedReversion = Math.max(-1, Math.min(1, meanReversion));

      // No artificial bias. Groq's bidirectional sentiment balancer handles
      // the positive/negative event ratio. The market engine stays neutral.
      const totalPctChange = noise + sectorPressure + clampedReversion;

      // Apply change
      const changeFraction = totalPctChange / 100;
      const changeInCents = Math.round(stock.priceInCents * changeFraction);
      const newPrice = Math.max(100, stock.priceInCents + changeInCents); // min $1.00

      // Update daily tracking
      const newDailyChangeInCents = stock.dailyChangeInCents + changeInCents;
      const newDailyChangePercent = stock.previousCloseInCents > 0
        ? Math.round(((newPrice - stock.previousCloseInCents) / stock.previousCloseInCents) * 10000) / 100
        : 0;

      // Add to price history (cap at 200 entries)
      const newHistory = [
        ...stock.priceHistory.slice(-199),
        { timestamp: now, priceInCents: newPrice },
      ];

      await ctx.db.patch(stock._id, {
        priceInCents: newPrice,
        dailyChangeInCents: newDailyChangeInCents,
        dailyChangePercent: newDailyChangePercent,
        marketCapInCents: newPrice * 1_000_000,
        priceHistory: newHistory,
      });
    }

    // Recalculate leaderboard portfolio values for all players
    // so the leaderboard reflects current market prices, not just trade-time prices
    const allPlayers = await ctx.db.query("players").collect();
    for (const player of allPlayers) {
      await ctx.scheduler.runAfter(0, internal.leaderboards.updatePlayerScores, {
        playerId: player._id,
      });
    }
  },
});
