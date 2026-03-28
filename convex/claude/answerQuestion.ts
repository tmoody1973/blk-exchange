import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

type EnrichedHolding = {
  symbol: string;
  shares: number;
  currentValueInCents: number;
  pnlPercent: number;
  sector: string;
};

// ─── answerQuestion (public action — called from client) ──────────────────────

export const answerQuestion = action({
  args: {
    question: v.string(),
    playerId: v.id("players"),
    stockSymbol: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    const question = args.question.trim();
    if (!question) {
      throw new Error("Question cannot be empty");
    }

    // Fetch player context
    const player = await ctx.runQuery(
      internal.claude.gradePortfolio.getPlayerForGrading,
      { playerId: args.playerId }
    );

    // Fetch holdings for personalized context
    const holdings = (await ctx.runQuery(
      internal.claude.gradePortfolio.getHoldingsForGrading,
      { playerId: args.playerId }
    )) as EnrichedHolding[];

    // Build portfolio context for the prompt
    let portfolioContext = "";
    if (holdings.length > 0) {
      const totalValue = holdings.reduce((s, h) => s + h.currentValueInCents, 0);
      const summary = holdings
        .slice(0, 8) // keep prompt concise
        .map((h) => {
          const pct =
            totalValue > 0
              ? ((h.currentValueInCents / totalValue) * 100).toFixed(1)
              : "0.0";
          const pnlSign = h.pnlPercent >= 0 ? "+" : "";
          return `${h.symbol} (${h.sector}, ${pct}% of portfolio, P&L: ${pnlSign}${h.pnlPercent.toFixed(1)}%)`;
        })
        .join(", ");

      portfolioContext = `
The player currently holds: ${summary}.
Cash available: $${((player?.cashInCents ?? 0) / 100).toFixed(2)}.
`.trim();
    } else {
      portfolioContext = "The player has no holdings yet — they are just getting started.";
    }

    const stockContext = args.stockSymbol
      ? `The player is viewing the ${args.stockSymbol} stock page when asking this question.`
      : "";

    const userMessage = [
      portfolioContext,
      stockContext,
      "",
      `Player question: "${question}"`,
    ]
      .filter(Boolean)
      .join("\n");

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: `You are Professor BLK, a financial literacy professor inside BLK Exchange — a cultural stock market simulator. You teach investing concepts using culturally relevant examples from music, fashion, sports, entertainment, and Black culture.

Rules:
- Answer in 2-4 paragraphs max
- Use the player's actual portfolio holdings as concrete examples when relevant
- Explain concepts clearly without jargon — or define jargon when you use it
- Be encouraging, direct, and culturally fluent
- Do NOT give financial advice about real markets — this is a simulation`,
      messages: [{ role: "user", content: userMessage }],
    });

    const answer =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "I couldn't generate an answer. Please try again.";

    return { answer };
  },
});

// ─── gradePortfolioPublic (public action — called from client) ────────────────

export const gradePortfolioPublic = action({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, args): Promise<unknown> => {
    return await ctx.runAction(internal.claude.gradePortfolio.gradePortfolio, {
      playerId: args.playerId,
    });
  },
});
