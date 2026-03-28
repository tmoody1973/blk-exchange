import { query, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Get recent FIRED events (last 20, sorted by firedAt desc) — what players see in news feed
export const getRecentEvents = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_timestamp")
      .order("desc")
      .filter((q) => q.eq(q.field("fired"), true))
      .take(20);
  },
});

// Get fired events only (alias)
export const getFiredEvents = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_timestamp")
      .order("desc")
      .filter((q) => q.eq(q.field("fired"), true))
      .take(20);
  },
});

// Get a single event by ID (internal — used by market commentary action)
export const getEventById = internalQuery({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.eventId);
  },
});

// Get events for a specific stock
export const getEventsBySymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_symbol", (q) => q.eq("primarySymbol", args.symbol))
      .order("desc")
      .take(10);
  },
});

// Get the most recently fired event (for market alert polling)
export const getLatestFiredEvent = query({
  handler: async (ctx) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_timestamp")
      .order("desc")
      .filter((q) => q.eq(q.field("fired"), true))
      .first();
    return event ?? null;
  },
});
