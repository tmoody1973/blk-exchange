import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Fire events every 5 minutes
crons.interval(
  "fire events",
  { minutes: 5 },
  internal.eventScheduler.fireNextEvent
);

// Perplexity news discovery every 15 minutes (free/cheap)
crons.interval(
  "perplexity news",
  { minutes: 15 },
  internal.news.perplexity.discover
);

// Firecrawl publication scraping 3x/day (conserves 3,000 monthly credits)
// 16 publications x 3/day = 48 scrapes/day x 30 = 1,440/month (within budget)
crons.interval(
  "firecrawl scrape",
  { hours: 8 },
  internal.news.firecrawl.scrape
);

// Fictional company news 3x/day (every 8 hours)
crons.interval(
  "fictional company news",
  { hours: 8 },
  internal.groq.generateFictionalEvent.generate
);

// Daily price reset at midnight ET (5:00 UTC)
crons.cron(
  "daily price reset",
  "0 5 * * *",
  internal.market.dailyReset,
  {}
);

// Weekly leaderboard reset — Monday midnight ET (5:00 UTC Monday)
crons.cron(
  "weekly leaderboard reset",
  "0 5 * * 1",
  internal.leaderboards.weeklyReset,
  {}
);

// Generate weekly challenge — Monday 1am ET (6:00 UTC Monday)
crons.cron(
  "generate weekly challenge",
  "0 6 * * 1",
  internal.challenges.generateChallenge,
  {}
);

export default crons;
