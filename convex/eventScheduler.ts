import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Internal wrappers for testing — call via `npx convex run eventScheduler:triggerFire`
export const triggerFire = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, internal.eventScheduler.fireNextEvent, {});
    return { scheduled: true };
  },
});

export const triggerFictional = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, internal.groq.generateFictionalEvent.generate, {});
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


    if (recentCount >= MAX_EVENTS_PER_WINDOW) {
      return;
    }

    // 2. Smart balance: alternate between real and fictional events
    // Target: ~40% real, ~60% fictional (real news is more impactful when scarce)
    const last10 = recentFired
      .filter((e) => e.firedAt !== undefined)
      .sort((a, b) => (b.firedAt ?? 0) - (a.firedAt ?? 0))
      .slice(0, 10);
    const recentRealCount = last10.filter((e) => e.sourceType === "real").length;
    const preferReal = recentRealCount < 4; // if less than 40% real, prefer real next

    // Look for queued events, preferring real or fictional based on balance
    const allQueued = await ctx.db
      .query("events")
      .withIndex("by_fired", (q) => q.eq("fired", false))
      .order("asc")
      .take(20);

    let nextEvent = null;
    if (preferReal) {
      // Try to find a real event first
      nextEvent = allQueued.find((e) => e.sourceType === "real") ?? allQueued[0] ?? null;
    } else {
      // Try to find a fictional event first
      nextEvent = allQueued.find((e) => e.sourceType === "fictional") ?? allQueued[0] ?? null;
    }

    if (!nextEvent) {
      // 3. Queue is empty — generate a fictional event
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
    await Promise.all(
      nextEvent.affectedStocks.map(async (affected) => {
        const stock = await ctx.db
          .query("stocks")
          .withIndex("by_symbol", (q) => q.eq("symbol", affected.symbol))
          .first();

        if (!stock) return;

        // Cap individual event impact to ±15%
        const clampedPercent = Math.max(-15, Math.min(15, affected.changePercent));

        // Daily circuit breaker: cap total daily movement to ±30%
        const currentDailyPct = stock.previousCloseInCents > 0
          ? ((stock.priceInCents - stock.previousCloseInCents) / stock.previousCloseInCents * 100)
          : 0;
        const remainingRoom = 30 - Math.abs(currentDailyPct);
        if (remainingRoom <= 0) return; // stock hit daily limit

        // Clamp this event's impact to remaining room
        const effectivePercent = Math.max(-remainingRoom, Math.min(remainingRoom, clampedPercent));
        const changeFraction = effectivePercent / 100;
        const changeInCents = Math.round(stock.priceInCents * changeFraction);
        const newPriceInCents = Math.max(100, stock.priceInCents + changeInCents); // min $1.00

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
      })
    );

    // 6. Schedule market commentary for this event
    await ctx.scheduler.runAfter(
      0,
      internal.groq.marketCommentary.generate,
      { eventId: nextEvent._id }
    );

    // 7. Check event-driven concept unlocks for all active players
    await ctx.scheduler.runAfter(0, internal.vault.checkEventTriggers, {
      eventHeadline: nextEvent.headline,
      eventConceptTaught: nextEvent.conceptTaught,
    });

    // 8. Update biggest-mover leaderboard for affected stocks
    // (track which player benefited most from this event)
    await ctx.scheduler.runAfter(0, internal.leaderboards.updateBiggestMover, {
      affectedStocks: nextEvent.affectedStocks,
    });
  },
});
