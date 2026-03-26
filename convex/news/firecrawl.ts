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
    ];

    let totalScraped = 0;

    for (const pub of publications) {
      try {
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

        if (!response.ok) continue;
        const data = await response.json() as { data?: { markdown?: string } };

        // Extract article titles from scraped markdown
        const content = data.data?.markdown ?? "";
        const titles = extractTitles(content);

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

          totalScraped++;
        }
      } catch (error) {
        // Skip failed publications, continue with others
        console.error(`Failed to scrape ${pub.name}:`, error);
      }
    }

    return { scraped: totalScraped };
  },
});

function extractTitles(markdown: string): string[] {
  const lines = markdown.split("\n");
  return lines
    .filter((line) => {
      const trimmed = line.trim();
      // Headlines are typically 20-200 chars, not too short or long
      return (
        trimmed.length >= 20 &&
        trimmed.length <= 200 &&
        !trimmed.startsWith("http") &&
        !trimmed.startsWith("[") &&
        !trimmed.startsWith("*") &&
        !trimmed.includes("cookie") &&
        !trimmed.includes("subscribe")
      );
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
