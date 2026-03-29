import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOnboardingState = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, { playerId }) => {
    const status = await ctx.db
      .query("onboardingStatus")
      .withIndex("by_player", (q) => q.eq("playerId", playerId))
      .first();

    if (!status) {
      // Check if player has any trades — if so, they're not actually new
      const hasTrades = await ctx.db
        .query("trades")
        .withIndex("by_player", (q) => q.eq("playerId", playerId))
        .first();
      if (hasTrades) {
        return { state: "onboarding_complete" as const, eventsCompleted: 3 };
      }
      return { state: "new_player" as const, eventsCompleted: 0 };
    }
    return status;
  },
});

export const advanceOnboarding = mutation({
  args: {
    playerId: v.id("players"),
    newState: v.union(
      v.literal("first_event_seen"),
      v.literal("first_trade_complete"),
      v.literal("onboarding_complete")
    ),
  },
  handler: async (ctx, { playerId, newState }) => {
    const existing = await ctx.db
      .query("onboardingStatus")
      .withIndex("by_player", (q) => q.eq("playerId", playerId))
      .first();

    if (existing) {
      const updates: Record<string, unknown> = { state: newState };
      if (newState === "first_trade_complete") {
        updates.firstTradeTimestamp = Date.now();
      }
      updates.eventsCompleted = (existing.eventsCompleted || 0) + 1;
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("onboardingStatus", {
        playerId,
        state: newState,
        eventsCompleted: 1,
        seedEventId: "onboarding-001",
      });
    }
  },
});
