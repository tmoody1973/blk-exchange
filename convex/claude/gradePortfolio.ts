import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

// ─── Types ────────────────────────────────────────────────────────────────────

type EnrichedHolding = {
  symbol: string;
  shares: number;
  avgCostInCents: number;
  totalInvestedInCents: number;
  currentPriceInCents: number;
  currentValueInCents: number;
  pnlInCents: number;
  pnlPercent: number;
  sector: string;
};

// ─── gradePortfolio (internalAction) ─────────────────────────────────────────

export const gradePortfolio = internalAction({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    // Fetch player + holdings
    const player = await ctx.runQuery(internal.claude.gradePortfolio.getPlayerForGrading, {
      playerId: args.playerId,
    });

    if (!player) {
      throw new Error(`Player ${args.playerId} not found`);
    }

    const holdings = (await ctx.runQuery(
      internal.claude.gradePortfolio.getHoldingsForGrading,
      { playerId: args.playerId }
    )) as EnrichedHolding[];

    if (holdings.length === 0) {
      return {
        diversificationScore: 0,
        concentrationWarnings: [],
        recommendation: "Build your first position to get coaching feedback.",
        rawResponse: "",
      };
    }

    // Compute portfolio metrics
    const totalHoldingsValue = holdings.reduce(
      (sum, h) => sum + h.currentValueInCents,
      0
    );
    const totalValue = totalHoldingsValue + player.cashInCents;
    const cashPercent = totalValue > 0 ? (player.cashInCents / totalValue) * 100 : 0;

    // Sector distribution
    const sectorMap: Record<string, number> = {};
    for (const h of holdings) {
      const sector = h.sector || "Unknown";
      sectorMap[sector] = (sectorMap[sector] ?? 0) + h.currentValueInCents;
    }

    const sectorBreakdown = Object.entries(sectorMap)
      .map(([sector, value]) => ({
        sector,
        value,
        percent: totalValue > 0 ? (value / totalValue) * 100 : 0,
      }))
      .sort((a, b) => b.percent - a.percent);

    // Concentration: flag positions > 25% of portfolio
    const concentrationWarnings: string[] = [];
    for (const h of holdings) {
      const positionPercent =
        totalValue > 0 ? (h.currentValueInCents / totalValue) * 100 : 0;
      if (positionPercent > 25) {
        concentrationWarnings.push(
          `${h.symbol} (${positionPercent.toFixed(1)}% of portfolio)`
        );
      }
    }

    // Build prompt
    const holdingsSummary = holdings
      .map((h) => {
        const pnlSign = h.pnlInCents >= 0 ? "+" : "";
        const value = (h.currentValueInCents / 100).toFixed(2);
        const pnl = (Math.abs(h.pnlInCents) / 100).toFixed(2);
        const pct = h.pnlPercent.toFixed(2);
        const positionPct = totalValue > 0
          ? ((h.currentValueInCents / totalValue) * 100).toFixed(1)
          : "0.0";
        return `  - ${h.symbol} | Sector: ${h.sector} | Shares: ${h.shares.toFixed(4)} | Value: $${value} (${positionPct}% of portfolio) | P&L: ${pnlSign}$${pnl} (${pnlSign}${pct}%)`;
      })
      .join("\n");

    const sectorSummary = sectorBreakdown
      .map((s) => `  - ${s.sector}: ${s.percent.toFixed(1)}%`)
      .join("\n");

    const userMessage = `
Player Portfolio Analysis:

Holdings (${holdings.length} positions):
${holdingsSummary}

Sector Allocation:
${sectorSummary}

Cash: $${(player.cashInCents / 100).toFixed(2)} (${cashPercent.toFixed(1)}% of total)
Total Portfolio Value: $${(totalValue / 100).toFixed(2)}

Please grade this portfolio and provide:
1. A diversification score (0-100, where 100 = perfectly diversified)
2. Any concentration warnings (positions or sectors that are too large)
3. One specific, actionable recommendation naming a real ticker they should consider

Respond in this exact JSON format (no markdown, raw JSON only):
{
  "diversificationScore": <number 0-100>,
  "concentrationWarnings": [<string>, ...],
  "recommendation": "<one specific sentence naming a ticker>",
  "summary": "<2-3 sentences of honest, encouraging coaching>"
}
`.trim();

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system:
        "You are a portfolio coach for BLK Exchange, a cultural stock market simulator teaching financial literacy. Grade this player's portfolio and give specific, actionable advice. Use their actual holdings as examples. Be encouraging but honest. Always respond with valid JSON only — no markdown, no explanation outside the JSON.",
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    // Parse Claude's JSON response
    let parsed: {
      diversificationScore: number;
      concentrationWarnings: string[];
      recommendation: string;
      summary: string;
    };

    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Fallback if JSON parse fails
      parsed = {
        diversificationScore: 50,
        concentrationWarnings: concentrationWarnings,
        recommendation: "Consider diversifying across more sectors.",
        summary: rawText.slice(0, 300),
      };
    }

    return {
      diversificationScore: Math.max(0, Math.min(100, parsed.diversificationScore ?? 50)),
      concentrationWarnings: parsed.concentrationWarnings ?? concentrationWarnings,
      recommendation: parsed.recommendation ?? "Keep building your portfolio.",
      summary: parsed.summary ?? "",
    };
  },
});

// ─── Internal queries used by the action ─────────────────────────────────────

import { internalQuery } from "../_generated/server";

export const getPlayerForGrading = internalQuery({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId);
  },
});

export const getHoldingsForGrading = internalQuery({
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
          sector: stock?.sector ?? "",
        };
      })
    );

    return enriched;
  },
});
