import { query } from "./_generated/server";
import { v } from "convex/values";

// Get recent events (last 20, sorted by timestamp desc)
export const getRecentEvents = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_timestamp")
      .order("desc")
      .take(20);
  },
});

// Get fired events only
export const getFiredEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_timestamp")
      .order("desc")
      .take(20);
    return events.filter((e) => e.fired);
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
