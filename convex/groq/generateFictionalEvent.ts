import { internalAction, internalMutation } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";
import OpenAI from "openai";

// ─── Types ────────────────────────────────────────────────────────────────────

type AffectedStock = {
  symbol: string;
  changePercent: number;
};

type GroqEventResponse = {
  headline: string;
  primarySymbol: string;
  affectedStocks: AffectedStock[];
  eventType: "earnings" | "product" | "partnership" | "personnel" | "macro";
  conceptTaught: string | null;
  commentary: null;
};

// ─── generate (internalAction) ────────────────────────────────────────────────

export const generate = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }

    // Fetch all company states so Groq has full context
    const companyStates = await ctx.runQuery(
      api.companyStates.getAllStates
    );

    // Fetch recent events to find which stocks are OVERDUE for action
    const recentEvents = await ctx.runQuery(
      api.events.getRecentEvents
    );

    // Count recent events per symbol to find underserved stocks
    const recentSymbolCounts = new Map<string, number>();
    for (const e of recentEvents) {
      const sym = e.primarySymbol;
      recentSymbolCounts.set(sym, (recentSymbolCounts.get(sym) ?? 0) + 1);
    }

    // All 36 tickers
    const ALL_SYMBOLS = [
      "LOUD","SCROLL","VERSE","VIZN","NETFLO","LIVE",
      "RYTHM","BLOC","CRATE","PIXL","MOBILE","SQUAD",
      "KICKS","FLEX","COURT","DRIP","RARE","THREAD",
      "INK","READS","PRESS","CROWN","GLOW","SHEEN",
      "VAULT","STAX","GROW","BLOK","BUILD","HOOD",
      "DRAFT","ARENA","STATS","SCREEN","STAGE","GAME",
    ];

    // Find stocks with 0 recent events (underserved)
    const underserved = ALL_SYMBOLS.filter(s => !recentSymbolCounts.has(s));
    // Pick 3-5 random underserved symbols to suggest
    const shuffled = underserved.sort(() => Math.random() - 0.5);
    const suggestedSymbols = shuffled.slice(0, 5);
    // Also note which stocks had too many events (overserved)
    const overserved = [...recentSymbolCounts.entries()]
      .filter(([, count]) => count >= 3)
      .map(([sym]) => sym);

    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey,
    });

    const systemPrompt = `You are the BLK Exchange News Desk, generating fictional business news for a Black cultural stock market simulator. Generate a realistic business news event for one of the 36 fictional Black-economy companies.

IMPORTANT ROTATION RULE: You MUST pick from these underserved stocks that haven't had events recently: ${suggestedSymbols.join(", ")}. Do NOT generate events for: ${overserved.join(", ")} — they already had too many recent events.

You must return valid JSON with these fields:
- headline: string (1-2 sentence business headline)
- primarySymbol: string (MUST be one of: ${suggestedSymbols.join(", ")})
- affectedStocks: array of {symbol: string, changePercent: number} (the primary stock + 1-3 related stocks in the SAME SECTOR affected, changePercent between -8 and +8)
- eventType: "earnings" | "product" | "partnership" | "personnel" | "macro"
- conceptTaught: string (one of the 23 financial literacy concepts this event demonstrates, or null)
- commentary: null (will be filled by commentary model)

The event should feel like real business news from AfroTech or Black Enterprise. Keep price moves realistic: most are 2-5%, significant events 5-8%. Do NOT exceed 10%.`;

    const userMessage = `Current company states:\n${JSON.stringify(companyStates, null, 2)}\n\nGenerate one new fictional business event. Pick from the underserved stocks listed in the system prompt.`;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Groq returned an empty response");
    }

    const parsed: GroqEventResponse = JSON.parse(raw);

    // Hand off to mutation for DB writes
    await ctx.runMutation(internal.groq.generateFictionalEvent.applyEvent, {
      headline: parsed.headline,
      primarySymbol: parsed.primarySymbol,
      affectedStocks: parsed.affectedStocks,
      eventType: parsed.eventType,
      conceptTaught: parsed.conceptTaught ?? undefined,
    });
  },
});

// ─── applyEvent (internalMutation) ────────────────────────────────────────────

export const applyEvent = internalMutation({
  args: {
    headline: v.string(),
    primarySymbol: v.string(),
    affectedStocks: v.array(
      v.object({
        symbol: v.string(),
        changePercent: v.number(),
      })
    ),
    eventType: v.union(
      v.literal("earnings"),
      v.literal("product"),
      v.literal("partnership"),
      v.literal("personnel"),
      v.literal("macro")
    ),
    conceptTaught: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // 1. Insert the event into the events table (unfired, awaiting scheduler)
    await ctx.db.insert("events", {
      headline: args.headline,
      source: "BLK Exchange News Desk (Groq)",
      sourceType: "fictional",
      eventType: "company-lifecycle",
      primarySymbol: args.primarySymbol,
      affectedStocks: args.affectedStocks,
      conceptTaught: args.conceptTaught,
      commentary: undefined,
      timestamp: now,
      fired: false,
    });

    // 2. Price changes are NOT applied here — they are applied when the
    // event fires via eventScheduler.fireNextEvent. This ensures prices
    // move at the moment the Market Alert appears to players.

    // 3. Update company state for the primary symbol
    const companyState = await ctx.db
      .query("companyStates")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.primarySymbol))
      .first();

    if (companyState) {
      // Keep only the 5 most recent events in the state history
      const updatedRecentEvents = [
        args.headline,
        ...companyState.recentEvents,
      ].slice(0, 5);

      await ctx.db.patch(companyState._id, {
        recentEvents: updatedRecentEvents,
        lastEventType: args.eventType,
      });
    }
  },
});
