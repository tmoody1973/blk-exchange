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

    // Sector rotation by time of day (ET = UTC-5)
    const hourET = (new Date().getUTCHours() - 5 + 24) % 24;
    const SECTOR_SCHEDULE: Record<string, string[]> = {
      morning: ["finance", "realestate", "publishing"], // 6am-12pm
      afternoon: ["sportswear", "fashion", "beauty"],   // 12pm-6pm
      evening: ["media", "streaming", "music"],         // 6pm-12am
      night: ["gaming", "entertainment", "sports"],     // 12am-6am
    };
    const timeSlot = hourET < 6 ? "night" : hourET < 12 ? "morning" : hourET < 18 ? "afternoon" : "evening";
    const prioritySectors = SECTOR_SCHEDULE[timeSlot];

    // Map symbols to sectors
    const SYMBOL_SECTORS: Record<string, string> = {
      LOUD:"media",SCROLL:"media",VERSE:"media",VIZN:"streaming",NETFLO:"streaming",LIVE:"streaming",
      RYTHM:"music",BLOC:"music",CRATE:"music",PIXL:"gaming",MOBILE:"gaming",SQUAD:"gaming",
      KICKS:"sportswear",FLEX:"sportswear",COURT:"sportswear",DRIP:"fashion",RARE:"fashion",THREAD:"fashion",
      INK:"publishing",READS:"publishing",PRESS:"publishing",CROWN:"beauty",GLOW:"beauty",SHEEN:"beauty",
      VAULT:"finance",STAX:"finance",GROW:"finance",BLOK:"realestate",BUILD:"realestate",HOOD:"realestate",
      DRAFT:"sports",ARENA:"sports",STATS:"sports",SCREEN:"entertainment",STAGE:"entertainment",GAME:"entertainment",
    };

    // Find stocks with 0 recent events (underserved), preferring current time slot sectors
    const underserved = ALL_SYMBOLS.filter(s => !recentSymbolCounts.has(s));
    const priorityUnderserved = underserved.filter(s => prioritySectors.includes(SYMBOL_SECTORS[s]));
    const otherUnderserved = underserved.filter(s => !prioritySectors.includes(SYMBOL_SECTORS[s]));

    // Combine: priority sectors first, then others, shuffled within each group
    const shuffledPriority = priorityUnderserved.sort(() => Math.random() - 0.5);
    const shuffledOther = otherUnderserved.sort(() => Math.random() - 0.5);
    const suggestedSymbols = [...shuffledPriority, ...shuffledOther].slice(0, 5);
    // Also note which stocks had too many events (overserved)
    const overserved = [...recentSymbolCounts.entries()]
      .filter(([, count]) => count >= 3)
      .map(([sym]) => sym);

    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey,
    });

    // Balance sentiment: target ~60% positive, ~40% negative
    const recentPositive = recentEvents.filter(e =>
      e.affectedStocks.length > 0 && e.affectedStocks[0].changePercent > 0
    ).length;
    const recentNegative = recentEvents.filter(e =>
      e.affectedStocks.length > 0 && e.affectedStocks[0].changePercent < 0
    ).length;
    // Events with changePercent === 0 are intentionally excluded from ratio
    const total = recentPositive + recentNegative;
    const positiveRatio = total > 0 ? recentPositive / total : 0.5;

    let sentimentInstruction: string;
    // Only apply forced sentiment when we have enough data (5+ events)
    if (total < 5) {
      sentimentInstruction = `\n\nSENTIMENT: Generate a realistic mix of positive and negative events. About 60% should be good news (partnerships, revenue beats, launches) and 40% bad news (misses, delays, departures).`;
    } else if (positiveRatio > 0.7) {
      // Too positive — force a negative event
      sentimentInstruction = `\n\nCRITICAL: The market has been too positive lately (${recentPositive} positive vs ${recentNegative} negative). You MUST generate a NEGATIVE event. Earnings miss, product recall, executive departure, or competitive loss. The primary stock MUST go DOWN (changePercent between -2 and -8).`;
    } else if (positiveRatio < 0.4) {
      // Too negative — force a positive event
      sentimentInstruction = `\n\nCRITICAL: The market has been too negative lately (${recentPositive} positive vs ${recentNegative} negative). You MUST generate a POSITIVE event. New partnership, revenue beat, product launch, or expansion announcement. The primary stock MUST go UP (changePercent between +2 and +8).`;
    } else {
      // Balanced — let the model decide naturally
      sentimentInstruction = `\n\nSENTIMENT: The market is currently balanced. Generate whatever event feels most realistic for the chosen company. Real markets have a mix of good and bad days.`;
    }

    const systemPrompt = `You are the BLK Exchange News Desk, generating fictional business news for a Black cultural stock market simulator. Generate a realistic business news event for one of the 36 fictional Black-economy companies.

IMPORTANT ROTATION RULE: You MUST pick from these underserved stocks that haven't had events recently: ${suggestedSymbols.join(", ")}. Do NOT generate events for: ${overserved.join(", ")} — they already had too many recent events.
${sentimentInstruction}

You must return valid JSON with these fields:
- headline: string (1-2 sentence business headline)
- primarySymbol: string (MUST be one of: ${suggestedSymbols.join(", ")})
- affectedStocks: array of {symbol: string, changePercent: number} (the primary stock + 1-3 related stocks in the SAME SECTOR affected, changePercent between -8 and +8)
- eventType: "earnings" | "product" | "partnership" | "personnel" | "macro"
- conceptTaught: string (one of the 23 financial literacy concepts this event demonstrates, or null)
- commentary: null (will be filled by commentary model)

NEGATIVE EVENT EXAMPLES (use these as inspiration when generating bad news):
- "[TICKER] Reports Q4 Revenue Miss, Down 12% Year-Over-Year"
- "[TICKER] Loses Key Executive as Chief Revenue Officer Departs"
- "[TICKER] Faces Regulatory Scrutiny Over Data Practices"
- "[TICKER] Product Launch Delayed to Q3, Citing Supply Chain Issues"
- "[TICKER] Loses Major Distribution Deal to Competitor"
- "Sector Downturn Hits [SECTOR] Stocks as Consumer Spending Slows"

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
