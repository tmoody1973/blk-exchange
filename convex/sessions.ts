import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const startSession = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    // End any existing active session first
    const active = await ctx.db
      .query("sessions")
      .withIndex("by_active", (q) =>
        q.eq("playerId", args.playerId).eq("active", true)
      )
      .first();

    if (active) {
      await ctx.db.patch(active._id, { active: false, endedAt: Date.now() });
    }

    // Compute current portfolio value
    const player = await ctx.db.get(args.playerId);
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    let value = player?.cashInCents ?? 0;
    for (const h of holdings) {
      const s = await ctx.db.get(h.stockId);
      if (s) value += Math.round(h.shares * s.priceInCents);
    }

    // Update streak
    if (player) {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const lastPlayed = player.lastPlayedDate;

      if (lastPlayed !== today) {
        // Check if yesterday was the last played date (streak continues)
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .slice(0, 10);
        const newStreak =
          lastPlayed === yesterday ? player.streakDays + 1 : 1;

        await ctx.db.patch(args.playerId, {
          streakDays: newStreak,
          lastPlayedDate: today,
        });
      }
    }

    return await ctx.db.insert("sessions", {
      playerId: args.playerId,
      startedAt: Date.now(),
      eventsExperienced: 0,
      conceptsUnlocked: [],
      portfolioStartValueInCents: value,
      active: true,
    });
  },
});

export const endSession = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_active", (q) =>
        q.eq("playerId", args.playerId).eq("active", true)
      )
      .first();

    if (!session) return null;

    // Compute portfolio value at session end
    const player = await ctx.db.get(args.playerId);
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    let value = player?.cashInCents ?? 0;
    for (const h of holdings) {
      const s = await ctx.db.get(h.stockId);
      if (s) value += Math.round(h.shares * s.priceInCents);
    }

    const sessionId = session._id;

    await ctx.db.patch(sessionId, {
      active: false,
      endedAt: Date.now(),
      portfolioEndValueInCents: value,
    });

    // Kick off Claude debrief generation asynchronously
    await ctx.scheduler.runAfter(0, internal.claude.generateDebrief.generateDebrief, {
      sessionId,
    });

    // Check achievements at session end
    await ctx.scheduler.runAfter(0, internal.achievements.checkAchievements, {
      playerId: args.playerId,
    });

    return sessionId;
  },
});

export const getSessionById = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const getActiveSession = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_active", (q) =>
        q.eq("playerId", args.playerId).eq("active", true)
      )
      .first();
  },
});

export const incrementEventsExperienced = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (session) {
      await ctx.db.patch(args.sessionId, {
        eventsExperienced: session.eventsExperienced + 1,
      });
    }
  },
});

export const addConceptToSession = mutation({
  args: { sessionId: v.id("sessions"), conceptId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return;

    const already = session.conceptsUnlocked.includes(args.conceptId);
    if (!already) {
      await ctx.db.patch(args.sessionId, {
        conceptsUnlocked: [...session.conceptsUnlocked, args.conceptId],
      });
    }
  },
});

export const getRecentSessions = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .order("desc")
      .take(10);
  },
});
