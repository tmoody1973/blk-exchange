import { internalAction, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import OpenAI from "openai";

export const classify = internalAction({
  args: {
    articleId: v.id("articles"),
    title: v.string(),
    summary: v.optional(v.string()),
    publication: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return;

    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey,
    });

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a news classifier for BLK Exchange, a Black cultural stock market simulator with 36 fictional companies. Classify this real news article and determine its market impact.

Return JSON with:
- significance: number 1-10 (how market-moving is this?)
- affectedTickers: array of ticker symbols from our 36 companies that would be affected
- primarySymbol: the most affected ticker
- changePercents: object mapping each affected ticker to a percent change (-15 to +15)
- conceptTaught: one of the 23 financial literacy concepts this demonstrates, or null
- headline: a rewritten headline suitable for the BLK Exchange market (1-2 sentences)

Our tickers by sector:
Media: LOUD, SCROLL, VERSE | Streaming: VIZN, NETFLO, LIVE | Music: RYTHM, BLOC, CRATE
Gaming: PIXL, MOBILE, SQUAD | Sportswear: KICKS, FLEX, COURT | Fashion: DRIP, RARE, THREAD
Publishing: INK, READS, PRESS | Beauty: CROWN, GLOW, SHEEN | Finance: VAULT, STAX, GROW
Real Estate: BLOK, BUILD, HOOD | Sports: DRAFT, ARENA, STATS | Entertainment: SCREEN, STAGE, GAME`,
        },
        {
          role: "user",
          content: `Article from ${args.publication}:\nTitle: ${args.title}\n${args.summary ? `Summary: ${args.summary}` : ""}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return;

    let result: {
      significance?: number;
      affectedTickers?: string[];
      primarySymbol?: string;
      changePercents?: Record<string, number>;
      conceptTaught?: string | null;
      headline?: string;
    };

    try {
      result = JSON.parse(content);
    } catch {
      console.error("Failed to parse Groq response:", content);
      return;
    }

    // Update article with classification
    await ctx.runMutation(internal.articles.updateClassification, {
      articleId: args.articleId,
      significance: result.significance ?? 5,
      classifiedTickers: result.affectedTickers ?? [],
      classifiedConcept: result.conceptTaught ?? undefined,
    });

    // If significant enough (6+), create an event
    if ((result.significance ?? 0) >= 6) {
      const affectedStocks = (result.affectedTickers ?? []).map((symbol: string) => ({
        symbol,
        changePercent: result.changePercents?.[symbol] ?? 0,
      }));

      await ctx.runMutation(internal.groq.classifyArticle.createEventFromArticle, {
        headline: result.headline ?? args.title,
        source: args.publication,
        primarySymbol: result.primarySymbol ?? affectedStocks[0]?.symbol ?? "LOUD",
        affectedStocks,
        conceptTaught: result.conceptTaught ?? undefined,
        articleId: args.articleId,
      });
    }
  },
});

// Mutation to insert a market event derived from a real article
export const createEventFromArticle = internalMutation({
  args: {
    headline: v.string(),
    source: v.string(),
    primarySymbol: v.string(),
    affectedStocks: v.array(v.object({ symbol: v.string(), changePercent: v.number() })),
    conceptTaught: v.optional(v.string()),
    articleId: v.id("articles"),
  },
  handler: async (ctx, args) => {
    // Insert event
    await ctx.db.insert("events", {
      headline: args.headline,
      source: `via ${args.source}`,
      sourceType: "real",
      eventType: "real-news",
      primarySymbol: args.primarySymbol,
      affectedStocks: args.affectedStocks,
      conceptTaught: args.conceptTaught,
      timestamp: Date.now(),
      fired: false,
    });

    // Mark article as processed
    await ctx.db.patch(args.articleId, { processedAsEvent: true });
  },
});
