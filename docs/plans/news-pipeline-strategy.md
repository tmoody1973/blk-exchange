# BLK Exchange News Pipeline Strategy

## The Problem

A financial literacy simulator needs a steady stream of real cultural news to feel alive. But news APIs return the same results for the same queries, and after a few hours the pipeline runs dry. Players log in and see stale content.

## The Solution: Backlog Queue + Rotating Discovery + Drip Feed

Three components work together to keep the news feed fresh 24/7.

---

## Component 1: Backfill (Seeds the Queue)

**When it runs:** Manually or once per day.

**What it does:** Fires 31 individual search queries to the Perplexity Search API, each with `max_results: 20`. That is up to 620 potential articles per run. After deduplication and filtering, a typical backfill produces 60-70 unique articles.

**Query categories:**
- Black business and startup funding (4 variations)
- HBCU investment and education finance (3 variations)
- Entertainment, film, music, streaming (4 variations)
- Tech and fintech startups (3 variations)
- Finance, banking, community development (3 variations)
- Fashion and beauty brands (3 variations)
- Sports and gaming business (3 variations)
- Real Black-owned public company stocks: UONE, CARV, BYFC, DRCT (2 variations)
- Real ETF company news: Nike, Spotify, Netflix, JPMorgan, LVMH (2 variations)
- Publishing and literary culture (2 variations)
- General economic empowerment and wealth gap (2 variations)

**Execution:** Queries run in parallel batches of 5 to respect rate limits. Each query runs individually (not batched as an array) to maximize unique results.

**Storage:** Articles are inserted with `publishedToFeed: undefined` (queued, not yet shown). Fresh articles from today get `publishedToFeed: true` immediately.

**How to run:**
```bash
npx convex run news/perplexity:backfill
```

---

## Component 2: Discover (Finds Fresh Articles)

**When it runs:** Every 15 minutes via Convex cron.

**What it does:** Fires 13 individual search queries (one per category), each with `max_results: 20`. Queries rotate every 15 minutes using the hour and quarter-hour as a seed. This means every run uses different phrasings from the same category, which returns different results from Perplexity.

**Query rotation system:** 13 categories with 4 variations each. The variation is selected using:
```
seed = (UTC hour * 4) + (minute / 15)
variation = seed % number_of_variations_in_category
```

This cycles through all variations over 4-16 hours depending on the category, ensuring maximum coverage over time.

**Today's date is appended to every query** to bias Perplexity toward current content. Without the date, the search engine returns the same top results repeatedly.

**Domain targeting:** Half the queries target 24 specific Black media publications. The other half search broadly (excluding YouTube).

**Priority system:**
- Articles from today: published to the feed immediately
- Older articles (within 7 days): stored in the backlog queue
- Articles older than 7 days: filtered out entirely

**Typical output:** 0-5 new articles per run. Most results are already in the database from previous runs or the backfill. When 0 new articles are found, the drip feed activates.

---

## Component 3: Drip Feed (Keeps the Feed Alive)

**When it activates:** When the discover function finds 0 new articles.

**What it does:** Publishes 2 articles from the unpublished backlog queue. These articles were previously stored by the backfill or by earlier discover runs but not yet shown to users.

**How it works:**
```
Query articles where publishedToFeed = false
Take 2
Set publishedToFeed = true, publishedAt = now
```

**Result:** Even on slow news days when Perplexity returns nothing new, the feed still gets 2 articles every 15 minutes from the backlog.

---

## Targeted Publications (24 sources)

The pipeline searches these publications specifically when using the targeted domain filter:

| Source | Focus |
|---|---|
| AfroTech | Black tech and startups |
| Essence | Black culture, business, lifestyle |
| Black Enterprise | Black business and wealth |
| TheGrio | Black news and politics |
| The Root | Black culture and commentary |
| Blavity | Black millennial news |
| Capital B News | Black civic journalism |
| NBC BLK | NBC's Black news vertical |
| Andscape | ESPN's Black culture platform |
| HBCUBuzz | HBCU news and culture |
| HBCU We Know | HBCU news |
| Shadow and Act | Black entertainment |
| POCIT | People of Color in Tech |
| Rolling Out | Black entertainment and lifestyle |
| EURweb | Black entertainment news |
| Vibe | Black music and culture |
| Black Film | Black cinema |
| Amsterdam News | New York Black newspaper |
| Washington Informer | DC Black newspaper |
| Chicago Defender | Chicago Black newspaper |
| Philadelphia Tribune | Philadelphia Black newspaper |
| Business Insider | Business and tech news |
| Fast Company | Innovation and business |
| Wired | Technology and culture |

---

## Article Classification

After an article is stored, Groq (llama-3.3-70b) classifies it:
- Maps the article to specific BLK Exchange ticker symbols (e.g., an article about streaming deals maps to VIZN, NETFLO, LIVE)
- Identifies which investing concept the article relates to
- Assigns a significance score

Classified articles appear on individual stock detail pages in the "News & Events" accordion.

---

## Daily Content Budget

| Source | Articles per day | Notes |
|---|---|---|
| Backfill | 60-70 (one-time seed) | Run manually or schedule daily at midnight |
| Discover (fresh) | 10-30 | 96 runs/day x 0-5 per run |
| Drip feed (backlog) | 20-40 | Fills gaps when discover returns 0 |
| Firecrawl | 10-20 | Scrapes publication homepages 3x/day |
| **Total per day** | **40-100 articles** | Steady stream throughout the day |

---

## API Costs

| Service | Usage | Cost |
|---|---|---|
| Perplexity Search API | ~100 search requests/day (discover) + ~31 (backfill) | Per-request pricing, no token cost |
| Perplexity Search API | Backfill runs only when triggered | One-time cost per backfill |
| Groq | 1 classification call per article | Minimal (llama-3.3-70b is fast and cheap) |
| Firecrawl | ~48 scrapes/day (16 publications x 3/day) | Within 3,000 monthly credit budget |

---

## How to Refill the Queue

When the backlog runs low (e.g., after several days without a backfill), run:

```bash
npx convex run news/perplexity:backfill
```

This adds 60-70 fresh articles to the queue. You can also schedule this as a daily cron at midnight to keep the queue permanently full.

---

## Deduplication

Articles are deduped by URL hash. The `simpleHash` function generates a hash of the article URL. Before inserting any article, the pipeline checks if that hash already exists in the `articles` table. This prevents the same article from appearing twice regardless of which query found it.

---

## Schema

```
articles {
  urlHash: string              // Dedup key
  url: string                  // Article URL
  title: string                // Headline
  publication: string          // Source name
  summary: string              // Snippet from search
  classifiedTickers: string[]  // Which BLK Exchange stocks this relates to
  classifiedConcept: string    // Which investing concept
  sourceLayer: "perplexity" | "firecrawl"
  createdAt: number            // When discovered
  publishedToFeed: boolean     // Whether shown to users yet
  publishedAt: number          // When published to the feed
  processedAsEvent: boolean    // Whether converted to a market event
}
```

Index: `by_published` on `publishedToFeed` for efficient backlog queries.
