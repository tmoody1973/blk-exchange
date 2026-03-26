import { query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Check if article exists by URL hash (dedup)
export const getByUrlHash = internalQuery({
  args: { urlHash: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_urlHash", (q) => q.eq("urlHash", args.urlHash))
      .first();
  },
});

// Insert new article
export const insertArticle = internalMutation({
  args: {
    urlHash: v.string(),
    url: v.string(),
    title: v.string(),
    publication: v.string(),
    summary: v.optional(v.string()),
    significance: v.number(),
    classifiedTickers: v.array(v.string()),
    classifiedConcept: v.optional(v.string()),
    sourceLayer: v.union(v.literal("firecrawl"), v.literal("exa"), v.literal("tavily")),
    processedAsEvent: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("articles", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Update article with Groq classification results
export const updateClassification = internalMutation({
  args: {
    articleId: v.id("articles"),
    significance: v.number(),
    classifiedTickers: v.array(v.string()),
    classifiedConcept: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.articleId, {
      significance: args.significance,
      classifiedTickers: args.classifiedTickers,
      classifiedConcept: args.classifiedConcept,
    });
  },
});

// Count recent articles (for Tavily fallback trigger)
export const countRecentArticles = internalQuery({
  args: { sinceTimestamp: v.number() },
  handler: async (ctx, args) => {
    const articles = await ctx.db.query("articles").collect();
    return articles.filter((a) => a.createdAt > args.sinceTimestamp).length;
  },
});

// Mark article as processed into event
export const markProcessed = internalMutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.articleId, { processedAsEvent: true });
  },
});
