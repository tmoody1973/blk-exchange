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
