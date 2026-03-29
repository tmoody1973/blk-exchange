import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const executeTrade = mutation({
  args: {
    playerId: v.id("players"),
    stockId: v.id("stocks"),
    type: v.union(v.literal("buy"), v.literal("sell")),
    amountInCents: v.number(), // dollar amount to trade
  },
  handler: async (ctx, args) => {
    // 1. Fetch player and stock
    const player = await ctx.db.get(args.playerId);
    if (!player) throw new Error("Player not found");

    const stock = await ctx.db.get(args.stockId);
    if (!stock) throw new Error("Stock not found");

    // 2. Calculate shares (round to 4 decimal places)
    const shares = Math.round((args.amountInCents / stock.priceInCents) * 10000) / 10000;

    if (args.type === "buy") {
      // 3a. Validate: sufficient cash
      if (args.amountInCents > player.cashInCents) {
        throw new Error("Insufficient cash");
      }

      // 3b. Validate: 25% position limit
      // Get all holdings to compute total portfolio value
      const allHoldings = await ctx.db
        .query("holdings")
        .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
        .collect();

      let totalPortfolioValue = player.cashInCents;
      for (const h of allHoldings) {
        const s = await ctx.db.get(h.stockId);
        if (s) totalPortfolioValue += Math.round(h.shares * s.priceInCents);
      }

      const maxPositionCents = Math.round(totalPortfolioValue * 0.25);

      // Check existing position + new amount
      const existingHolding = await ctx.db
        .query("holdings")
        .withIndex("by_player_stock", (q) =>
          q.eq("playerId", args.playerId).eq("stockId", args.stockId)
        )
        .first();

      const existingValueCents = existingHolding
        ? Math.round(existingHolding.shares * stock.priceInCents)
        : 0;

      if (existingValueCents + args.amountInCents > maxPositionCents) {
        throw new Error(`Position would exceed 25% limit ($${(maxPositionCents / 100).toFixed(2)})`);
      }

      // 4. Create trade record
      await ctx.db.insert("trades", {
        playerId: args.playerId,
        stockId: args.stockId,
        symbol: stock.symbol,
        type: "buy",
        amountInCents: args.amountInCents,
        priceInCents: stock.priceInCents,
        shares,
        timestamp: Date.now(),
      });

      // 5. Update or create holding
      if (existingHolding) {
        const totalShares = Math.round((existingHolding.shares + shares) * 10000) / 10000;
        const totalInvested = existingHolding.totalInvestedInCents + args.amountInCents;
        const avgCost = Math.round(totalInvested / totalShares);

        await ctx.db.patch(existingHolding._id, {
          shares: totalShares,
          avgCostInCents: avgCost,
          totalInvestedInCents: totalInvested,
        });
      } else {
        await ctx.db.insert("holdings", {
          playerId: args.playerId,
          stockId: args.stockId,
          symbol: stock.symbol,
          shares,
          avgCostInCents: stock.priceInCents,
          totalInvestedInCents: args.amountInCents,
        });
      }

      // 6. Update player cash
      await ctx.db.patch(args.playerId, {
        cashInCents: player.cashInCents - args.amountInCents,
      });
    } else {
      // SELL
      const existingHolding = await ctx.db
        .query("holdings")
        .withIndex("by_player_stock", (q) =>
          q.eq("playerId", args.playerId).eq("stockId", args.stockId)
        )
        .first();

      if (!existingHolding || existingHolding.shares < shares) {
        throw new Error("Insufficient shares");
      }

      // Create trade record
      await ctx.db.insert("trades", {
        playerId: args.playerId,
        stockId: args.stockId,
        symbol: stock.symbol,
        type: "sell",
        amountInCents: args.amountInCents,
        priceInCents: stock.priceInCents,
        shares,
        timestamp: Date.now(),
      });

      // Update holding
      const remainingShares = Math.round((existingHolding.shares - shares) * 10000) / 10000;

      if (remainingShares <= 0.0001) {
        // Delete the holding if essentially zero
        await ctx.db.delete(existingHolding._id);
      } else {
        await ctx.db.patch(existingHolding._id, {
          shares: remainingShares,
          totalInvestedInCents: Math.round(remainingShares * existingHolding.avgCostInCents),
        });
      }

      // Update player cash (add sale proceeds)
      await ctx.db.patch(args.playerId, {
        cashInCents: player.cashInCents + args.amountInCents,
      });
    }

    // Update leaderboard scores after trade
    await ctx.scheduler.runAfter(0, internal.leaderboards.updatePlayerScores, {
      playerId: args.playerId,
    });

    // Check challenge progress
    await ctx.scheduler.runAfter(0, internal.challenges.checkChallengeProgress, {
      playerId: args.playerId,
    });

    // Check achievements
    await ctx.scheduler.runAfter(0, internal.achievements.checkAchievements, {
      playerId: args.playerId,
    });

    return {
      success: true,
      symbol: stock.symbol,
      type: args.type,
      shares,
      amountInCents: args.amountInCents,
    };
  },
});
