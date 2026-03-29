import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Period helpers ────────────────────────────────────────────────────────────

export function getCurrentWeek(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7
  );
  return `${now.getFullYear()}-W${week.toString().padStart(2, "0")}`;
}

export function getCurrentSeason(): string {
  return "season-1"; // MVP: single season
}

// ─── Board type union (reused across queries) ─────────────────────────────────

const boardArg = v.union(
  v.literal("portfolio-value"),
  v.literal("knowledge-vault"),
  v.literal("diversification"),
  v.literal("biggest-mover"),
  v.literal("blueprint-award")
);

// ─── getBoard ─────────────────────────────────────────────────────────────────

export const getBoard = query({
  args: {
    board: boardArg,
    period: v.string(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("leaderboards")
      .withIndex("by_board_period", (q) =>
        q.eq("board", args.board).eq("period", args.period)
      )
      .collect();

    return entries.sort((a, b) => b.score - a.score).slice(0, 50);
  },
});

// ─── getPlayerRank ─────────────────────────────────────────────────────────────

export const getPlayerRank = query({
  args: {
    playerId: v.id("players"),
    board: boardArg,
    period: v.string(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("leaderboards")
      .withIndex("by_board_period", (q) =>
        q.eq("board", args.board).eq("period", args.period)
      )
      .collect();

    const sorted = entries.sort((a, b) => b.score - a.score);
    const rank = sorted.findIndex((e) => e.playerId === args.playerId) + 1;
    const playerEntry = sorted.find((e) => e.playerId === args.playerId);

    return {
      rank: rank > 0 ? rank : null,
      score: playerEntry?.score ?? 0,
      total: sorted.length,
    };
  },
});

// ─── updateScore (upsert) ─────────────────────────────────────────────────────

export const updateScore = internalMutation({
  args: {
    playerId: v.id("players"),
    playerName: v.string(),
    board: boardArg,
    score: v.number(),
    period: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("leaderboards")
      .withIndex("by_player_board", (q) =>
        q.eq("playerId", args.playerId).eq("board", args.board)
      )
      .first();

    if (existing && existing.period === args.period) {
      await ctx.db.patch(existing._id, {
        score: args.score,
        playerName: args.playerName,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("leaderboards", {
        board: args.board,
        playerId: args.playerId,
        playerName: args.playerName,
        score: args.score,
        period: args.period,
        updatedAt: Date.now(),
      });
    }
  },
});

// ─── updateBiggestMover: called after events fire ────────────────────────────
// Finds players holding the most-moved stock and updates their biggest-mover score

export const updateBiggestMover = internalMutation({
  args: {
    affectedStocks: v.array(v.object({ symbol: v.string(), changePercent: v.number() })),
  },
  handler: async (ctx, args) => {
    if (args.affectedStocks.length === 0) return;

    // Find the biggest move
    const biggestMove = args.affectedStocks.reduce((best, s) =>
      Math.abs(s.changePercent) > Math.abs(best.changePercent) ? s : best
    );

    // Find all holdings of this stock
    const stock = await ctx.db
      .query("stocks")
      .withIndex("by_symbol", (q) => q.eq("symbol", biggestMove.symbol))
      .first();
    if (!stock) return;

    // TODO: Add by_stock index for performance at scale. For MVP, full scan is acceptable.
    const allHoldings = await ctx.db.query("holdings").collect();
    const holdings = allHoldings.filter((h) => h.stockId === stock._id);

    const week = getCurrentWeek();
    for (const holding of holdings) {
      const gainCents = Math.round(
        holding.shares * stock.priceInCents * (Math.abs(biggestMove.changePercent) / 100)
      );
      const player = await ctx.db.get(holding.playerId);
      if (!player) continue;

      // Get existing score, keep the max
      const existing = await ctx.db
        .query("leaderboards")
        .withIndex("by_player_board", (q) =>
          q.eq("playerId", holding.playerId).eq("board", "biggest-mover")
        )
        .first();

      const currentBest = existing?.score ?? 0;
      if (gainCents > currentBest) {
        if (existing && existing.period === week) {
          await ctx.db.patch(existing._id, {
            score: gainCents,
            updatedAt: Date.now(),
          });
        } else {
          await ctx.db.insert("leaderboards", {
            board: "biggest-mover",
            playerId: holding.playerId,
            playerName: player.name,
            score: gainCents,
            period: week,
            updatedAt: Date.now(),
          });
        }
      }
    }
  },
});

// ─── updatePlayerScores: called after trades ─────────────────────────────────
// Updates portfolio-value and diversification leaderboards for a player

export const updatePlayerScores = internalMutation({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) return;

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    // Compute portfolio value
    let totalValue = player.cashInCents;
    const sectors = new Set<string>();
    for (const h of holdings) {
      const stock = await ctx.db.get(h.stockId);
      if (stock) {
        totalValue += Math.round(h.shares * stock.priceInCents);
        sectors.add(stock.sector);
      }
    }

    const week = getCurrentWeek();
    const name = player.name;

    // Portfolio value board (weekly)
    const pvExisting = await ctx.db
      .query("leaderboards")
      .withIndex("by_player_board", (q) =>
        q.eq("playerId", args.playerId).eq("board", "portfolio-value")
      )
      .first();

    if (pvExisting && pvExisting.period === week) {
      await ctx.db.patch(pvExisting._id, {
        score: totalValue,
        playerName: name,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("leaderboards", {
        board: "portfolio-value",
        playerId: args.playerId,
        playerName: name,
        score: totalValue,
        period: week,
        updatedAt: Date.now(),
      });
    }

    // Diversification board (weekly)
    const divScore = Math.round((sectors.size / 12) * 100);
    const divExisting = await ctx.db
      .query("leaderboards")
      .withIndex("by_player_board", (q) =>
        q.eq("playerId", args.playerId).eq("board", "diversification")
      )
      .first();

    if (divExisting && divExisting.period === week) {
      await ctx.db.patch(divExisting._id, {
        score: divScore,
        playerName: name,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("leaderboards", {
        board: "diversification",
        playerId: args.playerId,
        playerName: name,
        score: divScore,
        period: week,
        updatedAt: Date.now(),
      });
    }
  },
});
