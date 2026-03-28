import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Public wrapper for testing — call via `npx convex run eventScheduler:triggerFire`
export const triggerFire = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, internal.eventScheduler.fireNextEvent, {});
    return { scheduled: true };
  },
});

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

    console.log(`[fireNextEvent] recentFired: ${recentFired.length}, recentInWindow: ${recentCount}`);

    if (recentCount >= MAX_EVENTS_PER_WINDOW) {
      console.log("[fireNextEvent] Rate limited, skipping");
      return;
    }

    // 2. Look for an unfired event already in the queue
    const nextEvent = await ctx.db
      .query("events")
      .withIndex("by_fired", (q) => q.eq("fired", false))
      .order("asc")
      .first();

    console.log(`[fireNextEvent] Next event in queue: ${nextEvent ? nextEvent.headline.slice(0, 50) : "NONE"}`);

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

    // 5. Apply price changes NOW — prices move at the moment the alert shows
    for (const affected of nextEvent.affectedStocks) {
      const stock = await ctx.db
        .query("stocks")
        .withIndex("by_symbol", (q) => q.eq("symbol", affected.symbol))
        .first();

      if (!stock) continue;

      const changeFraction = affected.changePercent / 100;
      const changeInCents = Math.round(stock.priceInCents * changeFraction);
      const newPriceInCents = Math.max(1, stock.priceInCents + changeInCents);

      const newDailyChangeInCents = stock.dailyChangeInCents + changeInCents;
      const newDailyChangePercent =
        Math.round(
          ((newPriceInCents - stock.previousCloseInCents) /
            stock.previousCloseInCents) *
            10000
        ) / 100;

      const newPriceHistory = [
        ...stock.priceHistory.slice(-199), // cap at 200 entries
        { timestamp: now, priceInCents: newPriceInCents },
      ];

      await ctx.db.patch(stock._id, {
        priceInCents: newPriceInCents,
        dailyChangeInCents: newDailyChangeInCents,
        dailyChangePercent: newDailyChangePercent,
        priceHistory: newPriceHistory,
      });
    }

    // 6. Schedule market commentary for this event
    await ctx.scheduler.runAfter(
      0,
      internal.groq.marketCommentary.generate,
      { eventId: nextEvent._id }
    );
  },
});
