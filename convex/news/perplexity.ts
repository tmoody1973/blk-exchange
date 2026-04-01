import { internalAction, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

/**
 * Smart news pipeline with backlog + drip feed.
 *
 * 1. Backfill: pulls 7 days of articles across all sectors (runs once or daily)
 * 2. Discover: searches for today's fresh articles with rotating query variations
 * 3. Drip feed: publishes 1-2 queued articles every 15 minutes
 *
 * Articles are stored immediately but only shown on the feed when "published."
 * Fresh discoveries publish instantly. Backlog fills gaps.
 */

const TARGETED_PUBLICATIONS = [
  "afrotech.com", "essence.com", "blackenterprise.com", "thegrio.com",
  "theroot.com", "blavity.com", "capitalbnews.org", "nbcnews.com",
  "andscape.com", "hbcubuzz.com", "hbcuweeknow.com", "shadowandact.com",
  "peopleofcolorintech.com", "rollingout.com", "eurweb.com", "vibe.com",
  "blackfilm.com", "amsterdamnews.com", "washingtoninformer.com",
  "chicagodefender.com", "philadelphiatribune.com",
  "businessinsider.com", "fastcompany.com", "wired.com",
];

// Rotate query phrasings so each run gets different results
const QUERY_VARIATIONS = {
  business: [
    "Black business funding startup news",
    "African American entrepreneurship venture capital",
    "Black owned company launch partnership deal",
    "minority business grant funding announcement",
  ],
  hbcu: [
    "HBCU investment endowment education finance",
    "historically Black college university news funding",
    "HBCU campus expansion research grant",
    "Black college university partnership announcement",
  ],
  entertainment: [
    "Black entertainment music media streaming deals",
    "African American film TV show production news",
    "Black celebrity business venture media deal",
    "Black music industry label streaming platform",
  ],
  tech: [
    "Black tech fintech venture capital startup",
    "African American technology company funding",
    "Black founder tech startup raise investment",
    "minority tech startup AI digital innovation",
  ],
  finance: [
    "Black real estate banking community development",
    "Black community bank CDFI lending wealth",
    "African American fintech payment platform",
    "Black Wall Street economic empowerment investing",
  ],
  fashion: [
    "Black fashion beauty skincare brand launch",
    "African American designer luxury streetwear",
    "Black beauty hair care cosmetics partnership",
    "Black owned fashion brand collaboration",
  ],
  sports: [
    "Black sports athlete business venture deal",
    "African American sports media esports",
    "Black athlete investment business ownership",
    "minority sports business franchise deal",
  ],
  gaming: [
    "Black gaming esports game studio developer",
    "African American video game indie studio",
    "Black game developer studio funding",
    "minority gaming esports tournament league",
  ],
  publishing: [
    "Black publishing book author literary news",
    "African American author book deal publisher",
    "Black literary magazine digital platform",
    "Black writer publishing house announcement",
  ],
  realestate: [
    "Black real estate development housing REIT",
    "African American property developer project",
    "Black owned real estate investment community",
    "minority housing affordable development project",
  ],
  stocks: [
    "Urban One Carver Bancorp Broadway Financial Direct Digital stock",
    "Black owned publicly traded company stock news",
    "UONE CARV BYFC DRCT stock earnings news",
    "minority owned public company stock market",
  ],
  etfCompanies: [
    "Nike Spotify Netflix Disney DraftKings stock news today",
    "JPMorgan Goldman Sachs Visa Mastercard financial sector news",
    "LVMH Hermes luxury fashion brand market news",
    "Procter Gamble Estee Lauder beauty consumer staples news",
  ],
  general: [
    "Black financial literacy investing education",
    "African American wealth building economic empowerment",
    "Black economic news today",
    "Black community business news this week",
  ],
};

function getRotatedQueries(date: string): string[] {
  // Use the date + hour + minute as seeds to rotate which variations we use
  // Each 15-min run gets a different set of queries
  const hour = new Date().getUTCHours();
  const quarter = Math.floor(new Date().getUTCMinutes() / 15);
  const seed = hour * 4 + quarter; // 0-95, changes every 15 min

  const categories = Object.entries(QUERY_VARIATIONS);
  const queries: string[] = [];

  // Pick one query from each category, rotating the variation
  for (const [, variations] of categories) {
    const varIndex = seed % variations.length;
    queries.push(`${variations[varIndex]} ${date}`);
  }

  return queries; // 13 individual queries (one per category)
}

// ─── Main discover function (runs every 15 min) ─────────────────────────────

export const discover = internalAction({
  handler: async (ctx) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) return { discovered: 0 };

    const today = new Date().toISOString().slice(0, 10);
    const queries = getRotatedQueries(today);

    let totalDiscovered = 0;

    // Run queries in parallel batches of 5
    for (let i = 0; i < queries.length; i += 5) {
      const batch = queries.slice(i, i + 5);

      const results = await Promise.allSettled(
        batch.map(async (query) => {
          let discovered = 0;
          try {
            // Alternate: half targeted publications, half broad
            const isTargeted = Math.random() > 0.5;
            const response = await fetch("https://api.perplexity.ai/search", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query,
                search_domain_filter: isTargeted ? TARGETED_PUBLICATIONS : ["-youtube.com"],
                max_results: 20,
              }),
            });

            if (!response.ok) return 0;

            const data = (await response.json()) as {
              results?: Array<{
                title: string;
                url: string;
                snippet: string;
                date?: string;
              }>;
            };

            if (!data.results || !Array.isArray(data.results)) return 0;

          for (const result of data.results) {
            if (!result.title || !result.url) continue;

            let hostname: string;
            try {
              const parsed = new URL(result.url);
              hostname = parsed.hostname;
              if (
                hostname === "example.com" || hostname === "localhost" ||
                hostname === "youtube.com" || hostname === "www.youtube.com" ||
                hostname.endsWith(".test") || !hostname.includes(".")
              ) continue;
              const path = parsed.pathname;
              if (path === "/" || path.startsWith("/category/") || path.startsWith("/tag/") || path === "/latest" || path === "/news") continue;
            } catch { continue; }

            // Skip articles older than 7 days
            if (result.date) {
              const articleDate = new Date(result.date).getTime();
              const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
              if (articleDate < sevenDaysAgo) continue;
            }

            const urlHash = simpleHash(result.url);
            const existing = await ctx.runQuery(internal.articles.getByUrlHash, { urlHash });
            if (existing) continue;

            const PUBLICATION_NAMES: Record<string, string> = {
              "afrotech.com": "AfroTech", "www.afrotech.com": "AfroTech",
              "essence.com": "Essence", "www.essence.com": "Essence",
              "blackenterprise.com": "Black Enterprise", "www.blackenterprise.com": "Black Enterprise",
              "thegrio.com": "TheGrio", "www.thegrio.com": "TheGrio",
              "theroot.com": "The Root", "www.theroot.com": "The Root",
              "blavity.com": "Blavity", "www.blavity.com": "Blavity",
              "capitalbnews.org": "Capital B News", "www.capitalbnews.org": "Capital B News",
              "nbcnews.com": "NBC BLK", "www.nbcnews.com": "NBC BLK",
              "andscape.com": "Andscape", "www.andscape.com": "Andscape",
              "hbcubuzz.com": "HBCUBuzz", "www.hbcubuzz.com": "HBCUBuzz",
              "hbcuweeknow.com": "HBCU We Know", "www.hbcuweeknow.com": "HBCU We Know",
              "shadowandact.com": "Shadow and Act", "www.shadowandact.com": "Shadow and Act",
              "peopleofcolorintech.com": "POCIT", "www.peopleofcolorintech.com": "POCIT",
              "rollingout.com": "Rolling Out", "www.rollingout.com": "Rolling Out",
              "eurweb.com": "EURweb", "www.eurweb.com": "EURweb",
              "vibe.com": "Vibe", "www.vibe.com": "Vibe",
            };
            const publication = PUBLICATION_NAMES[hostname] ??
              hostname.replace("www.", "").split(".")[0].charAt(0).toUpperCase() +
              hostname.replace("www.", "").split(".")[0].slice(1);

            // Fresh articles (from today) publish immediately
            // Older articles go to the backlog queue
            const isToday = result.date === today;

            const articleId = await ctx.runMutation(internal.articles.insertArticle, {
              urlHash,
              url: result.url,
              title: result.title,
              publication,
              summary: result.snippet?.slice(0, 500),
              significance: 0,
              classifiedTickers: [],
              sourceLayer: "perplexity",
              processedAsEvent: false,
            });

            // Mark fresh articles as published, backlog as queued
            if (isToday) {
              await ctx.runMutation(internal.news.perplexity.markPublished, { articleId });
            }

            // Schedule Groq classification
            await ctx.scheduler.runAfter(0, internal.groq.classifyArticle.classify, {
              articleId,
              title: result.title,
              summary: result.snippet?.slice(0, 500),
              publication,
              url: result.url,
            });

            discovered++;
          }
          return discovered;
        } catch (err) {
          console.error("Perplexity Search query failed:", err);
          return 0;
        }
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled") totalDiscovered += r.value;
      }
    }

    // Drip feed: if no fresh articles found, publish 2 from the backlog
    if (totalDiscovered === 0) {
      await ctx.runMutation(internal.news.perplexity.publishFromBacklog);
    }

    return { discovered: totalDiscovered };
  },
});

// ─── Backfill: pull 7 days of articles (run manually or daily) ──────────────

export const backfill = internalAction({
  handler: async (ctx) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) return { discovered: 0 };

    const today = new Date().toISOString().slice(0, 10);

    // Run MANY individual queries with max_results: 20 each
    // Each query is different to maximize unique results
    const queries = [
      // Business & funding
      `Black business startup funding news ${today}`,
      "African American entrepreneur venture capital raise 2026",
      "Black owned company funding round announcement this week",
      "minority business grant award partnership deal",
      // HBCU
      `HBCU investment endowment news ${today}`,
      "historically Black college university campus expansion 2026",
      "HBCU research grant partnership announcement",
      // Entertainment & media
      `Black entertainment film music news ${today}`,
      "African American TV show movie production deal 2026",
      "Black streaming platform content deal announcement",
      "Black podcast media company news this week",
      // Tech
      `Black tech fintech startup news ${today}`,
      "African American technology AI startup funding 2026",
      "Black founder tech company launch product",
      // Finance & real estate
      `Black banking community development finance news ${today}`,
      "African American real estate REIT development project 2026",
      "Black Wall Street economic empowerment investing news",
      // Fashion & beauty
      `Black fashion beauty brand news ${today}`,
      "African American designer skincare hair care launch 2026",
      "Black owned luxury streetwear brand collaboration",
      // Sports & gaming
      `Black athlete business venture sports news ${today}`,
      "African American esports gaming studio news 2026",
      "Black sports media deal franchise ownership",
      // Real companies & ETFs
      "Urban One UONE earnings revenue news 2026",
      "Carver Bancorp CARV Broadway Financial BYFC stock news",
      "Nike DraftKings Spotify Netflix stock sector news today",
      "JPMorgan Goldman Sachs financial sector earnings news",
      // Publishing & culture
      "Black author book deal publishing news 2026",
      "African American literary magazine cultural platform",
      // General
      "Black economic news wealth gap financial literacy 2026",
      "African American community business growth investment",
    ];

    let totalDiscovered = 0;

    // Run each query individually with max_results: 20
    // Process in parallel batches of 5 to respect rate limits
    for (let i = 0; i < queries.length; i += 5) {
      const batch = queries.slice(i, i + 5);

      const results = await Promise.allSettled(
        batch.map(async (query) => {
          let found = 0;
          try {
            const response = await fetch("https://api.perplexity.ai/search", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query,
                max_results: 20,
                search_domain_filter: ["-youtube.com"],
              }),
            });

            if (!response.ok) return 0;

            const data = (await response.json()) as {
              results?: Array<{ title: string; url: string; snippet: string; date?: string }>;
            };

            if (!data.results) return 0;

            for (const result of data.results) {
              if (!result.title || !result.url) continue;

              try {
                const parsed = new URL(result.url);
                const h = parsed.hostname;
                if (h === "example.com" || h === "youtube.com" || h === "www.youtube.com") continue;
                if (parsed.pathname === "/" || parsed.pathname.startsWith("/category/") || parsed.pathname.startsWith("/tag/")) continue;
              } catch { continue; }

              if (result.date) {
                const d = new Date(result.date).getTime();
                if (d < Date.now() - 7 * 24 * 60 * 60 * 1000) continue;
              }

              const urlHash = simpleHash(result.url);
              const existing = await ctx.runQuery(internal.articles.getByUrlHash, { urlHash });
              if (existing) continue;

              let hostname: string;
              try { hostname = new URL(result.url).hostname; } catch { continue; }

              const PUBLICATION_NAMES: Record<string, string> = {
                "afrotech.com": "AfroTech", "www.afrotech.com": "AfroTech",
                "essence.com": "Essence", "www.essence.com": "Essence",
                "blackenterprise.com": "Black Enterprise", "www.blackenterprise.com": "Black Enterprise",
                "thegrio.com": "TheGrio", "www.thegrio.com": "TheGrio",
                "theroot.com": "The Root", "www.theroot.com": "The Root",
                "blavity.com": "Blavity", "www.blavity.com": "Blavity",
                "businessinsider.com": "Business Insider", "www.businessinsider.com": "Business Insider",
                "fastcompany.com": "Fast Company", "www.fastcompany.com": "Fast Company",
                "wired.com": "Wired", "www.wired.com": "Wired",
              };
              const pubName = PUBLICATION_NAMES[hostname] ??
                hostname.replace("www.", "").split(".")[0].charAt(0).toUpperCase() +
                hostname.replace("www.", "").split(".")[0].slice(1);

              const articleId = await ctx.runMutation(internal.articles.insertArticle, {
                urlHash,
                url: result.url,
                title: result.title,
                publication: pubName,
                summary: result.snippet?.slice(0, 500),
                significance: 0,
                classifiedTickers: [],
                sourceLayer: "perplexity",
                processedAsEvent: false,
              });

              // Schedule Groq classification
              await ctx.scheduler.runAfter(0, internal.groq.classifyArticle.classify, {
                articleId,
                title: result.title,
                summary: result.snippet?.slice(0, 500),
                publication: pubName,
                url: result.url,
              });

              found++;
            }
          } catch (err) {
            console.error("Backfill query failed:", err);
          }
          return found;
        })
      );

      for (const r of results) {
        if (r.status === "fulfilled") totalDiscovered += r.value;
      }
    }

    return { discovered: totalDiscovered };
  },
});

// ─── Mutations ──────────────────────────────────────────────────────────────

export const markPublished = internalMutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.articleId, {
      publishedToFeed: true,
      publishedAt: Date.now(),
    });
  },
});

export const publishFromBacklog = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Find unpublished articles and publish 2
    const unpublished = await ctx.db
      .query("articles")
      .withIndex("by_published", (q) => q.eq("publishedToFeed", false))
      .take(2);

    for (const article of unpublished) {
      await ctx.db.patch(article._id, {
        publishedToFeed: true,
        publishedAt: Date.now(),
      });
    }

    return { published: unpublished.length };
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
