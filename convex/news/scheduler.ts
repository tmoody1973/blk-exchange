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
// Legacy pipeline runner — kept for manual invocation
// In production, Firecrawl and Perplexity run on separate crons
// to conserve Firecrawl credits (3,000/month)
export const runPipeline = internalAction({
  handler: async (ctx) => {
    await ctx.runAction(internal.news.perplexity.discover);
  },
});
