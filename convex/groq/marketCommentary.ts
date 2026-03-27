import { internalAction, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import OpenAI from "openai";

// ─── updateCommentary (internalMutation) ─────────────────────────────────────

export const updateCommentary = internalMutation({
  args: {
    eventId: v.id("events"),
    commentary: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, { commentary: args.commentary });
  },
});

// ─── generate (internalAction) ────────────────────────────────────────────────

export const generate = internalAction({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }

    // Fetch the event to build context for the commentary prompt
    const event = await ctx.runQuery(internal.events.getEventById, {
      eventId: args.eventId,
    });

    if (!event) {
      throw new Error(`Event not found: ${args.eventId}`);
    }

    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey,
    });

    const affectedSummary = event.affectedStocks
      .map(
        (s: { symbol: string; changePercent: number }) =>
          `${s.symbol} ${s.changePercent >= 0 ? "+" : ""}${s.changePercent}%`
      )
      .join(", ");

    const userMessage = `Event headline: ${event.headline}\nAffected stocks: ${affectedSummary}${event.conceptTaught ? `\nFinancial concept: ${event.conceptTaught}` : ""}`;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "Write a 2-sentence plain-language explanation of this market event for someone learning about investing. Be specific about what happened and why it matters.",
        },
        { role: "user", content: userMessage },
      ],
    });

    const commentary = completion.choices[0]?.message?.content?.trim();
    if (!commentary) {
      throw new Error("Groq returned empty commentary");
    }

    // Write commentary back to the event record
    await ctx.runMutation(internal.groq.marketCommentary.updateCommentary, {
      eventId: args.eventId,
      commentary,
    });
  },
});
