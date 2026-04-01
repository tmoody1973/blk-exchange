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
    imageUrl: v.optional(v.string()),
    significance: v.number(),
    classifiedTickers: v.array(v.string()),
    classifiedConcept: v.optional(v.string()),
    sourceLayer: v.union(v.literal("firecrawl"), v.literal("perplexity")),
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

// Count recent articles (for monitoring)
export const countRecentArticles = internalQuery({
  args: { sinceTimestamp: v.number() },
  handler: async (ctx, args) => {
    // Safety cap to avoid collecting unbounded data
    const articles = await ctx.db.query("articles").order("desc").take(1000);
    return articles.filter((a) => a.createdAt > args.sinceTimestamp).length;
  },
});

// Get articles classified to a specific ticker
export const getArticlesByTicker = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    // No array-contains index in Convex, so scan recent articles and filter in JS.
    // Increased to 500 to catch classified articles for niche tickers.
    // TODO: Consider articleTickers join table with symbol index for scale.
    const allArticles = await ctx.db
      .query("articles")
      .order("desc")
      .take(500);

    return allArticles
      .filter((a) => a.classifiedTickers.includes(args.symbol))
      .slice(0, 10);
  },
});

// Get all recent articles for the news feed page
export const getRecentArticles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("articles")
      .order("desc")
      .take(50);
  },
});

// Mark article as processed into event
export const markProcessed = internalMutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.articleId, { processedAsEvent: true });
  },
});

// Cleanup: delete articles older than 7 days based on title/URL patterns
export const cleanupOldArticles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allArticles = await ctx.db.query("articles").collect();
    let deleted = 0;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const article of allArticles) {
      // Delete articles created more than 14 days ago (stale backlog)
      if (article.createdAt < sevenDaysAgo) {
        await ctx.db.delete(article._id);
        deleted++;
        continue;
      }

      // Delete articles with year patterns in URL suggesting old content
      const url = article.url.toLowerCase();
      if (
        url.includes("/2017/") || url.includes("/2018/") || url.includes("/2019/") ||
        url.includes("/2020/") || url.includes("/2021/") || url.includes("/2022/") ||
        url.includes("/2023/") || url.includes("/2024/")
      ) {
        await ctx.db.delete(article._id);
        deleted++;
      }
    }

    return { deleted, total: allArticles.length };
  },
});

// One-time cleanup: delete articles with fake/hallucinated URLs
export const cleanupBadUrls = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allArticles = await ctx.db.query("articles").collect();
    let deleted = 0;

    for (const article of allArticles) {
      try {
        const u = new URL(article.url);
        if (
          u.hostname === "example.com" ||
          u.hostname === "localhost" ||
          u.hostname.endsWith(".test") ||
          !u.hostname.includes(".")
        ) {
          await ctx.db.delete(article._id);
          deleted++;
        }
      } catch {
        await ctx.db.delete(article._id);
        deleted++;
      }
    }

    return { deleted, total: allArticles.length };
  },
});

// One-time cleanup: delete junk articles (nav links, browser warnings, donation forms)
export const cleanupJunkArticles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allArticles = await ctx.db.query("articles").collect();
    let deleted = 0;

    for (const article of allArticles) {
      const title = article.title.toLowerCase();
      const isJunk =
        // Markdown link syntax still in title
        article.title.includes("](http") ||
        article.title.includes("[") ||
        // Browser warnings
        title.includes("ie 11") ||
        title.includes("not supported") ||
        title.includes("optimal experience") ||
        // Site chrome / nav
        title.includes("cookie") ||
        title.includes("subscribe") ||
        title.includes("newsletter") ||
        title.includes("sign up") ||
        title.includes("log in") ||
        title.includes("donation amount") ||
        title.includes("stay informed") ||
        title.includes("privacy") ||
        title.includes("terms of") ||
        // Too short to be a real headline
        article.title.split(/\s+/).length < 5 ||
        // Starts with markdown
        article.title.startsWith("##") ||
        article.title.startsWith("**") ||
        article.title.startsWith("- ");

      if (isJunk) {
        await ctx.db.delete(article._id);
        deleted++;
      }
    }

    return { deleted, total: allArticles.length };
  },
});
