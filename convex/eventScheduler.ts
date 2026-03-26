import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const TEN_MINUTES_MS = 10 * 60 * 1000;
const MAX_EVENTS_PER_WINDOW = 2;

export const fireNextEvent = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const windowStart = now - TEN_MINUTES_MS;

    // 1. Count events fired in the last 10 minutes
    const recentFired = await ctx.db
      .query("events")
      .withIndex("by_fired", (q) => q.eq("fired", true))
      .collect();

    const recentCount = recentFired.filter(
      (e) => e.firedAt !== undefined && e.firedAt >= windowStart
    ).length;

    if (recentCount >= MAX_EVENTS_PER_WINDOW) {
      // Rate limit: too many events in the window, skip this tick
      return;
    }

    // 2. Look for an unfired event already in the queue
    const nextEvent = await ctx.db
      .query("events")
      .withIndex("by_fired", (q) => q.eq("fired", false))
      .order("asc")
      .first();

    if (!nextEvent) {
      // 3. Queue is empty — ask Groq to generate a new event
      await ctx.scheduler.runAfter(
        0,
        internal.groq.generateFictionalEvent.generate,
        {}
      );
      return;
    }

    // 4. Fire the event
    await ctx.db.patch(nextEvent._id, {
      fired: true,
      firedAt: now,
    });

    // 5. Schedule market commentary for this event
    await ctx.scheduler.runAfter(
      0,
      internal.groq.marketCommentary.generate,
      { eventId: nextEvent._id }
    );
  },
});
