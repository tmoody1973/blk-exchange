import { query, internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import OpenAI from "openai";

// Get the current active challenge
export const getActiveChallenge = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("challenges")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();
  },
});

// Get player's progress on the active challenge
export const getChallengeProgress = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const challenge = await ctx.db
      .query("challenges")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();
    if (!challenge) return null;

    return await ctx.db
      .query("challengeProgress")
      .withIndex("by_player_challenge", (q) =>
        q.eq("playerId", args.playerId).eq("challengeId", challenge._id)
      )
      .first();
  },
});

// Check and update challenge progress — called after every trade
export const checkChallengeProgress = internalMutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const challenge = await ctx.db
      .query("challenges")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();
    if (!challenge) return;

    // Get or create progress record
    let progress = await ctx.db
      .query("challengeProgress")
      .withIndex("by_player_challenge", (q) =>
        q.eq("playerId", args.playerId).eq("challengeId", challenge._id)
      )
      .first();

    if (!progress) {
      const id = await ctx.db.insert("challengeProgress", {
        playerId: args.playerId,
        challengeId: challenge._id,
        currentValue: 0,
        completed: false,
      });
      progress = await ctx.db.get(id);
    }

    if (!progress || progress.completed) return;

    // Evaluate based on target type
    let currentValue = 0;

    if (challenge.targetType === "sectors_held") {
      const holdings = await ctx.db
        .query("holdings")
        .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
        .collect();
      const sectors = new Set<string>();
      for (const h of holdings) {
        const stock = await ctx.db.get(h.stockId);
        if (stock) sectors.add(stock.sector);
      }
      currentValue = sectors.size;
    } else if (challenge.targetType === "trades_count") {
      const weekStart = challenge.weekStart;
      const trades = await ctx.db
        .query("trades")
        .withIndex("by_player_time", (q) =>
          q.eq("playerId", args.playerId).gte("timestamp", weekStart)
        )
        .collect();
      currentValue = trades.length;
    } else if (challenge.targetType === "portfolio_value") {
      const player = await ctx.db.get(args.playerId);
      const holdings = await ctx.db
        .query("holdings")
        .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
        .collect();
      let totalValue = player?.cashInCents ?? 0;
      for (const h of holdings) {
        const stock = await ctx.db.get(h.stockId);
        if (stock) totalValue += Math.round(h.shares * stock.priceInCents);
      }
      currentValue = totalValue;
    }

    const completed = currentValue >= challenge.targetValue;

    await ctx.db.patch(progress._id, {
      currentValue,
      completed,
      completedAt:
        completed && !progress.completed ? Date.now() : progress.completedAt,
    });
  },
});

// Generate a new challenge via Groq — runs Monday morning via cron
export const generateChallenge = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return;

    // Deactivate old challenges
    await ctx.runMutation(internal.challenges.deactivateOldChallenges, {});

    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey,
    });

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Generate a weekly trading challenge for BLK Exchange, a Black cultural stock market simulator. The challenge should teach a financial concept through gameplay.

Return JSON with:
- title: string (short, action-oriented, e.g. "Diversify into 6 sectors")
- description: string (1-2 sentences explaining the challenge and what you'll learn)
- conceptTaught: string (the financial literacy concept this teaches)
- targetType: one of "sectors_held", "trades_count", "portfolio_value"
- targetValue: number (the target to hit — e.g. 6 for sectors, 10 for trades, 1200000 for $12K portfolio in cents)

Make it achievable in a week but not trivially easy. Vary the type each week.`,
        },
        {
          role: "user",
          content: "Generate this week's challenge.",
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return;

    try {
      const result = JSON.parse(content);
      const now = Date.now();
      const weekEnd = now + 7 * 24 * 60 * 60 * 1000;

      await ctx.runMutation(internal.challenges.insertChallenge, {
        title: result.title ?? "Weekly Challenge",
        description: result.description ?? "Complete this week's challenge!",
        conceptTaught: result.conceptTaught ?? "Trading",
        targetType: (["sectors_held", "trades_count", "portfolio_value"].includes(result.targetType) ? result.targetType : "trades_count") as "sectors_held" | "trades_count" | "portfolio_value",
        targetValue: result.targetValue ?? 5,
        weekStart: now,
        weekEnd,
      });
    } catch {
      // Fallback challenge
      const now = Date.now();
      await ctx.runMutation(internal.challenges.insertChallenge, {
        title: "Diversify Your Portfolio",
        description:
          "Hold stocks in at least 4 different sectors by the end of the week.",
        conceptTaught: "Diversification",
        targetType: "sectors_held",
        targetValue: 4,
        weekStart: now,
        weekEnd: now + 7 * 24 * 60 * 60 * 1000,
      });
    }
  },
});

export const deactivateOldChallenges = internalMutation({
  args: {},
  handler: async (ctx) => {
    const active = await ctx.db
      .query("challenges")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
    for (const c of active) {
      await ctx.db.patch(c._id, { active: false });
    }
  },
});

export const insertChallenge = internalMutation({
  args: {
    title: v.string(),
    description: v.string(),
    conceptTaught: v.string(),
    targetType: v.union(
      v.literal("sectors_held"),
      v.literal("trades_count"),
      v.literal("portfolio_value")
    ),
    targetValue: v.number(),
    weekStart: v.number(),
    weekEnd: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("challenges", {
      ...args,
      active: true,
    });
  },
});
