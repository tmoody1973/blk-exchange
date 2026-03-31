import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import OpenAI from "openai";

/**
 * Layer 2: Perplexity Sonar — AI-powered news discovery.
 * Replaces both Exa (semantic search) and Tavily (fallback search).
 * Uses OpenAI-compatible API with model "sonar".
 *
 * Perplexity searches the web, synthesizes results with citations,
 * and returns sourced summaries in a single API call.
 */
export const discover = internalAction({
  handler: async (ctx) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) return { discovered: 0 };

    const client = new OpenAI({
      baseURL: "https://api.perplexity.ai",
      apiKey,
    });

    const queries = [
      "Latest Black-owned business news, funding announcements, and startup launches from the past 24 hours",
      "Recent HBCU news, investments, endowments, and Black education finance from the past 48 hours",
      "Black entertainment, music, streaming, and media industry deals and launches this week",
      "African American tech startups, fintech, digital media, and venture capital news today",
      "Black real estate development, community banking, CDFI lending, and wealth building news this week",
      "Black fashion brands, beauty companies, hair care, skincare launches and partnerships recently",
      "Black sports business, athlete ventures, esports, and sports media deals this week",
      "Latest news from AfroTech, Blavity, Black Enterprise, Essence, The Root, and Capital B News about Black business and culture",
      "Black-owned public companies stock news: Urban One UONE, Carver Bancorp CARV, Broadway Financial BYFC, Direct Digital DRCT",
      "Recent Black Wall Street, financial literacy, investing education, and economic empowerment news",
    ];

    const results = await Promise.allSettled(
      queries.map(async (query) => {
        const response = await client.chat.completions.create({
          model: "sonar",
          // @ts-expect-error - return_images is a Perplexity extension not in OpenAI types
          return_images: true,
          messages: [
            {
              role: "system",
              content:
                "You are a news aggregator focused on Black business, culture, and economic news. Return exactly 3-5 recent news items as a JSON array. Each item must have: title (string), url (string), summary (1-2 sentence string), source (publication name string). CRITICAL: Only include news published within the last 48 hours. Do NOT include old news, historical events, or articles older than 2 days. Return ONLY the JSON array, no other text.",
            },
            {
              role: "user",
              content: query,
            },
          ],
        });

        // Extract images and citations from Perplexity response
        const imageMap = new Map<string, string>();
        const rawResponse = response as unknown as {
          images?: Array<{ image_url: string; origin_url: string }>;
          citations?: string[];
        };
        if (rawResponse.images) {
          for (const img of rawResponse.images) {
            if (img.origin_url && img.image_url) {
              imageMap.set(img.origin_url, img.image_url);
            }
          }
        }

        // Real URLs come from citations, not the generated text
        const citations = rawResponse.citations ?? [];

        const content = response.choices[0]?.message?.content;
        if (!content) return 0;

        // Parse the JSON array from the response
        let articles: Array<{
          title: string;
          url: string;
          summary: string;
          source: string;
        }>;

        try {
          // Try to extract JSON from the response (may be wrapped in markdown code blocks)
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (!jsonMatch) return 0;
          articles = JSON.parse(jsonMatch[0]);
        } catch {
          return 0;
        }

        if (!Array.isArray(articles)) return 0;

        let discovered = 0;
        for (const article of articles.slice(0, 5)) {
          if (!article.title) continue;

          // Perplexity often hallucinates URLs in the text.
          // Use the citation URL if available, otherwise validate the generated URL.
          let articleUrl = article.url;

          // Try to find a matching citation URL
          if (citations.length > 0) {
            // Match by checking if any citation contains keywords from the title
            // Require 3+ matching title words to avoid false positives
            const titleWords = article.title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
            const matchingCitation = citations.find(c => {
              const cLower = c.toLowerCase();
              const matchCount = titleWords.filter(w => cLower.includes(w)).length;
              return matchCount >= 3;
            });
            if (matchingCitation) {
              articleUrl = matchingCitation;
            }
          }

          // Skip if URL is still fake/invalid
          try {
            const parsedUrl = new URL(articleUrl);
            if (
              parsedUrl.hostname === "example.com" ||
              parsedUrl.hostname === "localhost" ||
              parsedUrl.hostname.endsWith(".test") ||
              !parsedUrl.hostname.includes(".")
            ) continue;
          } catch {
            continue;
          }

          const urlHash = simpleHash(articleUrl);
          const existing = await ctx.runQuery(
            internal.articles.getByUrlHash,
            { urlHash }
          );
          if (existing) continue;

          let hostname: string;
          try {
            hostname = new URL(articleUrl).hostname;
          } catch {
            hostname = article.source || "unknown";
          }

          // Try to find an image for this article
          const articleImage = imageMap.get(articleUrl) ?? imageMap.get(article.url) ?? undefined;

          const articleId = await ctx.runMutation(
            internal.articles.insertArticle,
            {
              urlHash,
              url: articleUrl,
              title: article.title,
              publication: article.source || hostname,
              summary: article.summary?.slice(0, 500),
              imageUrl: articleImage,
              significance: 0,
              classifiedTickers: [],
              sourceLayer: "perplexity",
              processedAsEvent: false,
            }
          );

          // Schedule Groq classification
          await ctx.scheduler.runAfter(
            0,
            internal.groq.classifyArticle.classify,
            {
              articleId,
              title: article.title,
              summary: article.summary?.slice(0, 500),
              publication: article.source || hostname,
              url: article.url,
            }
          );

          discovered++;
        }
        return discovered;
      })
    );

    let totalDiscovered = 0;
    for (const result of results) {
      if (result.status === "fulfilled") {
        totalDiscovered += result.value;
      } else {
        console.error("Perplexity query failed:", result.reason);
      }
    }

    return { discovered: totalDiscovered };
  },
});

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
