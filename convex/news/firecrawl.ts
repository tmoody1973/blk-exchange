import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const scrape = internalAction({
  handler: async (ctx) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) return { scraped: 0 };

    const publications = [
      { name: "AfroTech", url: "https://afrotech.com" },
      { name: "Essence", url: "https://essence.com" },
      { name: "Black Enterprise", url: "https://blackenterprise.com" },
      { name: "TheGrio", url: "https://thegrio.com" },
      { name: "The Root", url: "https://theroot.com" },
      { name: "Blavity", url: "https://blavity.com" },
      { name: "HBCUBuzz", url: "https://hbcubuzz.com" },
      { name: "Andscape", url: "https://andscape.com" },
      { name: "Vibe", url: "https://vibe.com" },
      { name: "Rolling Out", url: "https://rollingout.com" },
      { name: "EURweb", url: "https://eurweb.com" },
      { name: "Invest Fest", url: "https://investfest.com" },
      { name: "NBC BLK", url: "https://nbcnews.com/nbcblk" },
      { name: "Blavity U", url: "https://blavity.com/blavity-u" },
      { name: "Blavity Entertainment", url: "https://blavity.com/entertainment" },
    ];

    const results = await Promise.allSettled(
      publications.map(async (pub) => {
        // Use Firecrawl REST API directly via fetch to avoid ESM/CJS issues in Convex
        const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            url: pub.url,
            formats: ["markdown"],
            onlyMainContent: true,
          }),
        });

        if (!response.ok) return 0;
        const data = await response.json() as { data?: { markdown?: string } };

        // Extract article titles from scraped markdown
        const content = data.data?.markdown ?? "";
        const titles = extractTitles(content);

        let scraped = 0;
        for (const title of titles.slice(0, 5)) {
          // Generate URL hash for deduplication
          const urlHash = simpleHash(`${pub.url}/${title}`);

          // Check if already stored
          const existing = await ctx.runQuery(internal.articles.getByUrlHash, { urlHash });
          if (existing) continue;

          // Insert article record
          const articleId = await ctx.runMutation(internal.articles.insertArticle, {
            urlHash,
            url: pub.url,
            title,
            publication: pub.name,
            significance: 0,
            classifiedTickers: [],
            sourceLayer: "firecrawl",
            processedAsEvent: false,
          });

          // Schedule Groq classification
          await ctx.scheduler.runAfter(0, internal.groq.classifyArticle.classify, {
            articleId,
            title,
            publication: pub.name,
            url: pub.url,
          });

          scraped++;
        }
        return scraped;
      })
    );

    let totalScraped = 0;
    for (const result of results) {
      if (result.status === "fulfilled") {
        totalScraped += result.value;
      } else {
        console.error("Failed to scrape publication:", result.reason);
      }
    }

    return { scraped: totalScraped };
  },
});

function extractTitles(markdown: string): string[] {
  const lines = markdown.split("\n");
  return lines
    .map((line) => {
      let trimmed = line.trim();
      // Strip markdown heading markers
      trimmed = trimmed.replace(/^#{1,4}\s*/, "");
      // Strip markdown link syntax: [text](url) -> text
      trimmed = trimmed.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      return trimmed;
    })
    .filter((trimmed) => {
      // Must be article-headline length
      if (trimmed.length < 30 || trimmed.length > 200) return false;
      // Skip URLs
      if (trimmed.startsWith("http") || trimmed.includes("://")) return false;
      // Skip nav items, categories, and short labels
      if (trimmed.startsWith("[") || trimmed.startsWith("*") || trimmed.startsWith("-")) return false;
      // Skip common non-article patterns
      const lower = trimmed.toLowerCase();
      if (lower.includes("cookie") || lower.includes("subscribe") || lower.includes("newsletter")) return false;
      if (lower.includes("sign up") || lower.includes("log in") || lower.includes("privacy policy")) return false;
      if (lower.includes("terms of") || lower.includes("about us") || lower.includes("contact us")) return false;
      if (lower.includes("category") || lower.includes("explore") || lower.includes("see more")) return false;
      if (lower.includes("advertisement") || lower.includes("sponsored")) return false;
      // Skip lines that are just a few words (nav links)
      if (trimmed.split(/\s+/).length < 5) return false;
      // Must have at least one capital letter (headline-like)
      if (!/[A-Z]/.test(trimmed)) return false;
      return true;
    })
    .slice(0, 10);
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
