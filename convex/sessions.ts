import { query, mutation } from "./_generated/server";
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

    await ctx.db.patch(session._id, {
      active: false,
      endedAt: Date.now(),
      portfolioEndValueInCents: value,
    });

    return session._id;
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
