import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const runPipeline = internalAction({
  handler: async (ctx) => {
    // Layer 1: Firecrawl — scrape known Black publications
    await ctx.runAction(internal.news.firecrawl.scrape);

    // Layer 2: Exa — semantic discovery of recent relevant articles
    await ctx.runAction(internal.news.exa.discover);

    // Check how many articles have come in over the last 30 minutes
    const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
    const recentCount = await ctx.runQuery(internal.articles.countRecentArticles, {
      sinceTimestamp: thirtyMinAgo,
    });

    // Layer 3: Tavily fallback — only if pipeline yielded fewer than 3 articles
    if (recentCount < 3) {
      await ctx.runAction(internal.news.tavily.search);
    }
  },
});
