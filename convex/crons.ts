import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Fire events every 5 minutes
crons.interval(
  "fire events",
  { minutes: 5 },
  internal.eventScheduler.fireNextEvent
);

// News pipeline every 15 minutes — Firecrawl + Perplexity (single pipeline, no duplicates)
crons.interval(
  "news pipeline",
  { minutes: 15 },
  internal.news.scheduler.runPipeline
);

// Fictional company news 3x/day (every 8 hours)
crons.interval(
  "fictional company news",
  { hours: 8 },
  internal.groq.generateFictionalEvent.generate
);

// Daily price reset at midnight ET — prevents compounding inflation
crons.daily(
  "daily price reset",
  { hourUTC: 5, minuteUTC: 0 },
  internal.market.dailyReset
);

export default crons;
