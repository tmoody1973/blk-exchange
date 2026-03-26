import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const discover = internalAction({
  handler: async (ctx) => {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) return { discovered: 0 };

    const queries = [
      "Black-owned business news",
      "Black entrepreneur funding startup",
      "HBCU investment endowment",
      "Black tech company launch",
      "African American wealth building finance",
      "Black entertainment media deal",
    ];

    let totalDiscovered = 0;

    for (const query of queries) {
      try {
        const response = await fetch("https://api.exa.ai/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            query,
            numResults: 5,
            useAutoprompt: true,
            type: "neural",
            startPublishedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          }),
        });

        if (!response.ok) continue;
        const data = await response.json() as {
          results?: Array<{ url: string; title?: string; text?: string }>;
        };

        for (const result of data.results ?? []) {
          const urlHash = simpleHash(result.url);
          const existing = await ctx.runQuery(internal.articles.getByUrlHash, { urlHash });
          if (existing) continue;

          const hostname = new URL(result.url).hostname;
          const title = result.title ?? "Untitled";
          const summary = result.text?.slice(0, 500);

          const articleId = await ctx.runMutation(internal.articles.insertArticle, {
            urlHash,
            url: result.url,
            title,
            publication: hostname,
            summary,
            significance: 0,
            classifiedTickers: [],
            sourceLayer: "exa",
            processedAsEvent: false,
          });

          await ctx.scheduler.runAfter(0, internal.groq.classifyArticle.classify, {
            articleId,
            title,
            summary,
            publication: hostname,
            url: result.url,
          });

          totalDiscovered++;
        }
      } catch (error) {
        console.error(`Exa query failed: ${query}`, error);
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
