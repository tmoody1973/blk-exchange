import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

/**
 * 2-layer news pipeline orchestrator:
 * Layer 1: Firecrawl — scrapes 12 specific Black publications
 * Layer 2: Perplexity Sonar — AI-powered news discovery across the web
 *
 * Perplexity replaces both Exa (semantic search) and Tavily (fallback).
 * It searches + synthesizes in one call, returning sourced summaries.
 */
export const runPipeline = internalAction({
  handler: async (ctx) => {
    // Layer 1: Firecrawl — targeted scraping of known publications
    await ctx.runAction(internal.news.firecrawl.scrape);

    // Layer 2: Perplexity Sonar — broad AI-powered news discovery
    await ctx.runAction(internal.news.perplexity.discover);
  },
});
