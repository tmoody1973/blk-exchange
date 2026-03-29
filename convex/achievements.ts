import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get all unlocked achievements for a player
export const getPlayerAchievements = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playerAchievements")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();
  },
});

// Check all achievement conditions and unlock any newly earned ones.
// Idempotent — safe to call after every trade or session end.
export const checkAchievements = internalMutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args): Promise<string[]> => {
    const { playerId } = args;

    // Pre-load data shared across multiple checks
    const player = await ctx.db.get(playerId);
    if (!player) return [];

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", playerId))
      .collect();

    const trades = await ctx.db
      .query("trades")
      .withIndex("by_player", (q) => q.eq("playerId", playerId))
      .collect();

    const vaultEntries = await ctx.db
      .query("vault")
      .withIndex("by_player", (q) => q.eq("playerId", playerId))
      .collect();

    // Active session (for day-trader check)
    const activeSession = await ctx.db
      .query("sessions")
      .withIndex("by_active", (q) =>
        q.eq("playerId", playerId).eq("active", true)
      )
      .first();

    // Pre-fetch all stocks for holdings in a single pass
    const stockMap = new Map<string, any>();
    {
      const stocks = await Promise.all(holdings.map((h) => ctx.db.get(h.stockId)));
      for (let i = 0; i < holdings.length; i++) {
        const stock = stocks[i];
        if (stock) stockMap.set(holdings[i].stockId, stock);
      }
    }

    // Already unlocked achievement IDs
    const existingUnlocks = await ctx.db
      .query("playerAchievements")
      .withIndex("by_player", (q) => q.eq("playerId", playerId))
      .collect();
    const unlockedSet = new Set(existingUnlocks.map((u) => u.achievementId));

    // Helper — unlock if not already done
    const newlyUnlocked: string[] = [];
    async function unlock(achievementId: string) {
      if (unlockedSet.has(achievementId)) return;
      await ctx.db.insert("playerAchievements", {
        playerId,
        achievementId,
        unlockedAt: Date.now(),
      });
      unlockedSet.add(achievementId);
      newlyUnlocked.push(achievementId);
    }

    // ── first-trade ──────────────────────────────────────────────────────────
    if (trades.length >= 1) {
      await unlock("first-trade");
    }

    // ── first-1k-profit ──────────────────────────────────────────────────────
    // Portfolio value > $11,000 (1_100_000 cents)
    {
      let totalValue = player.cashInCents;
      for (const h of holdings) {
        const stock = stockMap.get(h.stockId);
        if (stock) totalValue += Math.round(h.shares * stock.priceInCents);
      }
      if (totalValue > 1_100_000) {
        await unlock("first-1k-profit");
      }
    }

    // ── survived-bear ────────────────────────────────────────────────────────
    // Any held stock has dailyChangePercent <= -10 AND player didn't sell today
    {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayStartMs = todayStart.getTime();

      const soldTodaySymbols = new Set(
        trades
          .filter((t) => t.type === "sell" && t.timestamp >= todayStartMs)
          .map((t) => t.symbol)
      );

      for (const h of holdings) {
        const stock = stockMap.get(h.stockId);
        if (
          stock &&
          stock.dailyChangePercent <= -10 &&
          !soldTodaySymbols.has(stock.symbol)
        ) {
          await unlock("survived-bear");
          break;
        }
      }
    }

    // ── day-trader ───────────────────────────────────────────────────────────
    // 10+ trades in the current active session
    if (activeSession) {
      const sessionTrades = trades.filter(
        (t) => t.timestamp >= activeSession.startedAt
      );
      if (sessionTrades.length >= 10) {
        await unlock("day-trader");
      }
    }

    // ── patient-investor ─────────────────────────────────────────────────────
    // Any holding where the original buy trade is 24+ hours old
    {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      for (const h of holdings) {
        // Find the earliest buy trade for this stock
        const buyTrades = trades.filter(
          (t) => t.stockId === h.stockId && t.type === "buy"
        );
        const earliest = buyTrades.reduce(
          (min, t) => (t.timestamp < min ? t.timestamp : min),
          Infinity
        );
        if (earliest <= cutoff) {
          await unlock("patient-investor");
          break;
        }
      }
    }

    // ── diversification achievements ─────────────────────────────────────────
    {
      const sectorCounts = new Map<string, number>();
      for (const h of holdings) {
        const stock = stockMap.get(h.stockId);
        if (stock) {
          sectorCounts.set(stock.sector, (sectorCounts.get(stock.sector) ?? 0) + 1);
        }
      }
      const uniqueSectors = sectorCounts.size;

      if (uniqueSectors >= 6) await unlock("six-sector-club");
      if (uniqueSectors >= 12) await unlock("full-spectrum");

      // sector-specialist: any sector with 3+ distinct holdings
      for (const count of sectorCounts.values()) {
        if (count >= 3) {
          await unlock("sector-specialist");
          break;
        }
      }
    }

    // ── vault achievements ───────────────────────────────────────────────────
    {
      const vaultCount = vaultEntries.length;
      if (vaultCount >= 5) await unlock("vault-rookie");
      if (vaultCount >= 15) await unlock("vault-pro");
      if (vaultCount >= 23) await unlock("vault-master");
    }

    // ── professors-favorite ──────────────────────────────────────────────────
    // Skipped — requires question count tracking not yet implemented

    // ── streak-master ────────────────────────────────────────────────────────
    if (player.streakDays >= 7) {
      await unlock("streak-master");
    }

    return newlyUnlocked;
  },
});
