import { internalAction, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

// ─── generateDebrief (internalAction) ─────────────────────────────────────────

export const generateDebrief = internalAction({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args): Promise<{ debriefText: string }> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    // Fetch session data
    const session: any = await ctx.runQuery(internal.claude.generateDebrief.getSessionForDebrief, {
      sessionId: args.sessionId,
    });

    if (!session) {
      throw new Error(`Session ${args.sessionId} not found`);
    }

    // Fetch player
    const player: any = await ctx.runQuery(internal.claude.generateDebrief.getPlayerForDebrief, {
      playerId: session.playerId,
    });

    if (!player) {
      throw new Error(`Player ${session.playerId} not found`);
    }

    // Fetch current holdings
    const holdings: any[] = await ctx.runQuery(
      internal.claude.generateDebrief.getHoldingsForDebrief,
      { playerId: session.playerId }
    );

    // Fetch trades during session window
    const trades: any[] = await ctx.runQuery(
      internal.claude.generateDebrief.getTradesForDebrief,
      {
        playerId: session.playerId,
        startedAt: session.startedAt,
        endedAt: session.endedAt ?? Date.now(),
      }
    );

    // Fetch vault concepts
    const vault: any[] = await ctx.runQuery(
      internal.claude.generateDebrief.getVaultForDebrief,
      { playerId: session.playerId }
    );

    // ─── Build session context ─────────────────────────────────────────────

    const durationMs = (session.endedAt ?? Date.now()) - session.startedAt;
    const durationMins = Math.round(durationMs / 60_000);

    const startValue = session.portfolioStartValueInCents;
    const endValue = session.portfolioEndValueInCents ?? startValue;
    const pnlCents = endValue - startValue;
    const pnlPercent = startValue > 0 ? ((pnlCents / startValue) * 100).toFixed(2) : "0.00";
    const pnlSign = pnlCents >= 0 ? "+" : "";

    const holdingsSummary = holdings.length > 0
      ? holdings
          .map((h: any) => {
            const pnlSign2 = h.pnlInCents >= 0 ? "+" : "-";
            return `  - ${h.symbol} | ${h.shares.toFixed(4)} shares | Value: $${(h.currentValueInCents / 100).toFixed(2)} | P&L: ${pnlSign2}$${(Math.abs(h.pnlInCents) / 100).toFixed(2)} (${pnlSign2}${Math.abs(h.pnlPercent).toFixed(2)}%) | Sector: ${h.sector}`;
          })
          .join("\n")
      : "  No holdings.";

    const tradesSummary = trades.length > 0
      ? trades
          .map((t: any) => {
            const ts = new Date(t.timestamp).toLocaleTimeString();
            return `  - [${ts}] ${t.type.toUpperCase()} ${t.shares.toFixed(4)} shares of ${t.symbol} @ $${(t.priceInCents / 100).toFixed(2)} | Total: $${(t.amountInCents / 100).toFixed(2)}`;
          })
          .join("\n")
      : "  No trades this session.";

    const sessionConcepts = session.conceptsUnlocked;
    const vaultConcepts = vault.filter((v: any) => sessionConcepts.includes(v.conceptId));
    const conceptsSummary = vaultConcepts.length > 0
      ? vaultConcepts.map((c: any) => `  - ${c.conceptName} (${c.tier}): ${c.definition}`).join("\n")
      : "  No new concepts unlocked this session.";

    const totalVaultConcepts: number = vault.length;

    const userMessage: string = `
Session Data for Debrief:

Player: ${player.name}
Session Duration: ${durationMins} minutes
Events Experienced: ${session.eventsExperienced}
New Concepts Unlocked This Session: ${sessionConcepts.length}
Total Concepts Unlocked (All Time): ${totalVaultConcepts}
Portfolio Streak: ${player.streakDays} days

Portfolio Performance:
  Start Value: $${(startValue / 100).toFixed(2)}
  End Value: $${(endValue / 100).toFixed(2)}
  Session P&L: ${pnlSign}$${(Math.abs(pnlCents) / 100).toFixed(2)} (${pnlSign}${pnlPercent}%)
  Cash on Hand: $${(player.cashInCents / 100).toFixed(2)}

Trades Made This Session (${trades.length} total):
${tradesSummary}

Current Holdings (${holdings.length} positions):
${holdingsSummary}

Concepts Unlocked This Session:
${conceptsSummary}

Please write a 400-word personalized session debrief narrative for this player. Be specific — use their actual trade tickers, gains, losses, and concepts. Celebrate wins. Frame losses as learning moments. Name specific tickers and investing concepts they experienced.

Then provide these structured sections (use these EXACT section headers):

WHAT YOU DID WELL:
[2-3 specific things they did right, referencing actual trades or behavior]

WHAT COST YOU MONEY:
[1-2 honest observations about losses or missed opportunities, with specific tickers if applicable]

CONCEPTS YOU EXPERIENCED:
[List exactly 3 concepts from their session — if fewer than 3 were unlocked, pick concepts relevant to their trades. Format each as: CONCEPT NAME: one sentence explanation of how it showed up in their session]

LEADERBOARD TRAJECTORY:
[One sentence about where they stand — rising, holding steady, or have work to do — based on their P&L and vault progress]

FOCUS FOR NEXT SESSION:
[One specific, actionable goal for their next session — name a ticker, sector, or strategy]
`.trim();

    const client = new Anthropic({ apiKey });

    const response: Awaited<ReturnType<typeof client.messages.create>> = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      system:
        "You are the session debrief narrator for BLK Exchange, a cultural stock market simulator that teaches financial literacy to Black and urban communities. Write a 400-word personalized narrative about the player's session. Be specific — use their actual trades, holdings, gains and losses. Celebrate wins, explain losses as learning moments. Name specific tickers and concepts. Be encouraging, real, and direct — like a great coach or a knowledgeable friend. Write for someone learning investing for the first time. After the narrative, provide the structured sections exactly as requested.",
      messages: [{ role: "user", content: userMessage }],
    });

    const debriefText: string =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "Session complete. Keep building your portfolio and unlocking concepts.";

    // Store debrief text on the session record
    await ctx.runMutation(internal.claude.generateDebrief.saveDebriefText, {
      sessionId: args.sessionId,
      debriefText,
    });

    return { debriefText };
  },
});

// ─── Internal queries and mutations ───────────────────────────────────────────

export const getSessionForDebrief = internalQuery({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const getPlayerForDebrief = internalQuery({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId);
  },
});

export const getHoldingsForDebrief = internalQuery({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    const enriched = await Promise.all(
      holdings.map(async (h) => {
        const stock = await ctx.db.get(h.stockId);
        return {
          ...h,
          currentPriceInCents: stock?.priceInCents ?? 0,
          currentValueInCents: Math.round(h.shares * (stock?.priceInCents ?? 0)),
          pnlInCents: Math.round(
            h.shares * ((stock?.priceInCents ?? 0) - h.avgCostInCents)
          ),
          pnlPercent:
            h.avgCostInCents > 0
              ? Math.round(
                  (((stock?.priceInCents ?? 0) - h.avgCostInCents) /
                    h.avgCostInCents) *
                    10000
                ) / 100
              : 0,
          sector: stock?.sector ?? "Unknown",
        };
      })
    );

    return enriched;
  },
});

export const getTradesForDebrief = internalQuery({
  args: {
    playerId: v.id("players"),
    startedAt: v.number(),
    endedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trades")
      .withIndex("by_player_time", (q) =>
        q.eq("playerId", args.playerId)
          .gte("timestamp", args.startedAt)
      )
      .filter((q) => q.lte(q.field("timestamp"), args.endedAt))
      .collect();
  },
});

export const getVaultForDebrief = internalQuery({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vault")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();
  },
});

export const saveDebriefText = internalMutation({
  args: {
    sessionId: v.id("sessions"),
    debriefText: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      debriefText: args.debriefText,
    });
  },
});
