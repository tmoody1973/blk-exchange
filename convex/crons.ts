import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Fire events every 5 minutes
crons.interval(
  "fire events",
  { minutes: 5 },
  internal.eventScheduler.fireNextEvent
);

// Firecrawl every 15 minutes — scrape known Black publications
crons.interval(
  "scrape publications",
  { minutes: 15 },
  internal.news.firecrawl.scrape
);

// Exa every 30 minutes — semantic discovery
crons.interval(
  "exa discovery",
  { minutes: 30 },
  internal.news.exa.discover
);

// Full pipeline every 30 minutes — includes Tavily fallback when needed
crons.interval(
  "news pipeline",
  { minutes: 30 },
  internal.news.scheduler.runPipeline
);

export default crons;
