import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const search = internalAction({
  handler: async (ctx) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) return { found: 0 };

    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query: "Black business news economy latest",
          max_results: 5,
          include_answer: false,
          include_raw_content: false,
        }),
      });

      if (!response.ok) return { found: 0 };
      const data = await response.json() as {
        results?: Array<{ url: string; title?: string; content?: string }>;
      };

      let found = 0;
      for (const result of data.results ?? []) {
        const urlHash = simpleHash(result.url);
        const existing = await ctx.runQuery(internal.articles.getByUrlHash, { urlHash });
        if (existing) continue;

        const hostname = new URL(result.url).hostname;
        const title = result.title ?? "Untitled";
        const summary = result.content?.slice(0, 500);

        const articleId = await ctx.runMutation(internal.articles.insertArticle, {
          urlHash,
          url: result.url,
          title,
          publication: hostname,
          summary,
          significance: 0,
          classifiedTickers: [],
          sourceLayer: "tavily",
          processedAsEvent: false,
        });

        await ctx.scheduler.runAfter(0, internal.groq.classifyArticle.classify, {
          articleId,
          title,
          summary,
          publication: hostname,
          url: result.url,
        });

        found++;
      }
      return { found };
    } catch (error) {
      console.error("Tavily search failed:", error);
      return { found: 0 };
    }
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
