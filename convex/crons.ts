import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Fire events every 5 minutes
crons.interval(
  "fire events",
  { minutes: 5 },
  internal.eventScheduler.fireNextEvent
);

// Firecrawl every 15 minutes — scrape 12 Black publications
crons.interval(
  "scrape publications",
  { minutes: 15 },
  internal.news.firecrawl.scrape
);

// Perplexity every 30 minutes — AI-powered news discovery
crons.interval(
  "perplexity discovery",
  { minutes: 30 },
  internal.news.perplexity.discover
);

// Full pipeline every 30 minutes — Firecrawl + Perplexity
crons.interval(
  "news pipeline",
  { minutes: 30 },
  internal.news.scheduler.runPipeline
);

export default crons;
