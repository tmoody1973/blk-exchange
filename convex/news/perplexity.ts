import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

/**
 * Perplexity Search API — structured news discovery.
 *
 * Uses the /search endpoint instead of chat completions.
 * Returns real URLs (no hallucination), structured results,
 * domain filtering, and batch queries (5 per call).
 */
export const discover = internalAction({
  handler: async (ctx) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) return { discovered: 0 };

    // Three batched calls of 5 queries each, covering all 12 BLK Exchange sectors
    const TARGETED_PUBLICATIONS = [
      "afrotech.com",
      "essence.com",
      "blackenterprise.com",
      "thegrio.com",
      "theroot.com",
      "blavity.com",
      "capitalbnews.org",
      "nbcnews.com",
      "andscape.com",
      "hbcubuzz.com",
      "hbcuweeknow.com",
      "shadowandact.com",
      "peopleofcolorintech.com",
      "rollingout.com",
      "eurweb.com",
      "vibe.com",
    ];

    const batch1 = {
      query: [
        "Black business funding startup news today",
        "HBCU investment endowment education finance news",
        "Black entertainment music media streaming deals this week",
        "Black tech fintech venture capital startup news",
        "Black real estate banking community development wealth news",
      ],
      search_domain_filter: TARGETED_PUBLICATIONS,
      max_results: 15,
    };

    const batch2 = {
      query: [
        "Black fashion beauty skincare hair care brand launch partnership",
        "Black sports athlete business esports media deals",
        "Urban One Carver Bancorp Broadway Financial Direct Digital stock news",
        "Black financial literacy investing education economic empowerment",
        "Black owned public company stock market minority business news",
      ],
      max_results: 20,
      search_domain_filter: ["-youtube.com"],
    };

    const batch3 = {
      query: [
        "Black gaming esports game studio indie developer news",
        "Black sportswear athletic footwear sneaker brand news",
        "Black publishing book author literary magazine news",
        "Black film production studio movie TV show entertainment news",
        "Black podcast creator digital content newsletter media news",
      ],
      max_results: 15,
      search_domain_filter: ["-youtube.com"],
    };

    const batches = [batch1, batch2, batch3];
    let totalDiscovered = 0;

    // Process batches in parallel for faster discovery
    const batchResults = await Promise.allSettled(
      batches.map(async (batch) => {
        let discovered = 0;
        try {
        const response = await fetch("https://api.perplexity.ai/search", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batch),
        });

        if (!response.ok) {
          console.error(
            `Perplexity Search API error (${response.status}):`,
            await response.text()
          );
          return 0;
        }

        const data = (await response.json()) as {
          results?: Array<{
            title: string;
            url: string;
            snippet: string;
            date?: string;
            last_updated?: string;
          }>;
        };

        if (!data.results || !Array.isArray(data.results)) return 0;

        for (const result of data.results) {
          if (!result.title || !result.url) continue;

          // Validate URL
          let hostname: string;
          try {
            const parsed = new URL(result.url);
            hostname = parsed.hostname;
            if (
              hostname === "example.com" ||
              hostname === "localhost" ||
              hostname === "youtube.com" ||
              hostname === "www.youtube.com" ||
              hostname.endsWith(".test") ||
              !hostname.includes(".")
            ) continue;
            // Skip category/landing pages (not real articles)
            const path = parsed.pathname;
            if (
              path === "/" ||
              path.endsWith("-channel/") ||
              path.startsWith("/category/") ||
              path.startsWith("/tag/") ||
              path.startsWith("/topics/") ||
              path.split("/").filter(Boolean).length < 2
            ) continue;
          } catch {
            continue;
          }

          // Skip articles older than 7 days if date is available
          if (result.date) {
            const articleDate = new Date(result.date).getTime();
            const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            if (articleDate < sevenDaysAgo) continue;
          }

          // Dedup
          const urlHash = simpleHash(result.url);
          const existing = await ctx.runQuery(
            internal.articles.getByUrlHash,
            { urlHash }
          );
          if (existing) continue;

          // Map hostname to human-readable publication name
          const PUBLICATION_NAMES: Record<string, string> = {
            "afrotech.com": "AfroTech",
            "www.afrotech.com": "AfroTech",
            "essence.com": "Essence",
            "www.essence.com": "Essence",
            "blackenterprise.com": "Black Enterprise",
            "www.blackenterprise.com": "Black Enterprise",
            "thegrio.com": "TheGrio",
            "www.thegrio.com": "TheGrio",
            "theroot.com": "The Root",
            "www.theroot.com": "The Root",
            "blavity.com": "Blavity",
            "www.blavity.com": "Blavity",
            "capitalbnews.org": "Capital B News",
            "www.capitalbnews.org": "Capital B News",
            "nbcnews.com": "NBC BLK",
            "www.nbcnews.com": "NBC BLK",
            "andscape.com": "Andscape",
            "www.andscape.com": "Andscape",
            "hbcubuzz.com": "HBCUBuzz",
            "www.hbcubuzz.com": "HBCUBuzz",
            "hbcuweeknow.com": "HBCU We Know",
            "www.hbcuweeknow.com": "HBCU We Know",
            "shadowandact.com": "Shadow and Act",
            "www.shadowandact.com": "Shadow and Act",
            "peopleofcolorintech.com": "POCIT",
            "www.peopleofcolorintech.com": "POCIT",
            "rollingout.com": "Rolling Out",
            "www.rollingout.com": "Rolling Out",
            "eurweb.com": "EURweb",
            "www.eurweb.com": "EURweb",
            "vibe.com": "Vibe",
            "www.vibe.com": "Vibe",
          };
          const publication = PUBLICATION_NAMES[hostname] ??
            hostname.replace("www.", "").split(".")[0].charAt(0).toUpperCase() +
            hostname.replace("www.", "").split(".")[0].slice(1);

          const articleId = await ctx.runMutation(
            internal.articles.insertArticle,
            {
              urlHash,
              url: result.url,
              title: result.title,
              publication,
              summary: result.snippet?.slice(0, 500),
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
              title: result.title,
              summary: result.snippet?.slice(0, 500),
              publication,
              url: result.url,
            }
          );

          discovered++;
        }
        return discovered;
      } catch (err) {
        console.error("Perplexity Search batch failed:", err);
        return 0;
      }
      })
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        totalDiscovered += result.value;
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
