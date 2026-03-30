# Real Exchange Build Guide

## How to start the session

Tell Claude:

> "Read the Real Exchange design doc at `docs/plans/2026-03-30-real-exchange-design.md` and the CEO plan at `~/.gstack/projects/tmoody1973-blk-exchange/ceo-plans/2026-03-29-post-hackathon-launch.md`. Build Phase 4: The Real Exchange with FMP data."

## Prerequisites (already done)

- FMP API key set in Convex env (`FMP_API_KEY`)
- Perplexity API key set in Convex env (fallback news)
- Design doc fully refined with all decisions locked in
- Glossary chip component exists and works
- OG share card pattern exists and works
- Trade modal reusable for real tickers

## Build order

| # | Step | CC time | Notes |
|---|------|---------|-------|
| 1 | Schema + seed data | ~30 min | New tables: realStocks, realPriceHistory, realArticles, realCompanyCards. Seed 9 company stories. Add realExchangeUnlocked + realTickersRevealed to players table. |
| 2 | FMP price fetch cron | ~30 min | Fetch quotes for 9 tickers 4x/day during market hours. Store in realStocks. |
| 3 | FMP fundamentals + news cron | ~30 min | Daily refresh: company profile, income statement, balance sheet, key metrics, stock news. |
| 4 | Unlock condition checker | ~30 min | After each session/trade, check: 15+ concepts, 70+ diversification, 50+ trades, 6+ sectors. Trigger first reveal. |
| 5 | Company reveal flow (the bridge) | ~1 hour | Sector-ranked reveal. Market Alert. Full-screen Company Card with story, sim connection, lesson, trade button. |
| 6 | Real tickers in market list | ~30 min | Gold star badge, gold left border, "REAL" tag. Interleaved with sim tickers by sector. |
| 7 | Real ticker detail page | ~1.5 hours | Live price, chart, your position, the story, "Learn the Fundamentals" with glossary chips on every metric, AI coach commentary, news feed, key metrics. |
| 8 | NACP capstone page | ~1 hour | ETF holdings from FMP. "What's inside this ETF?" explorer. "How is this different from picking stocks?" education. Social screening explanation. 4 glossary chips. Graduation message. |
| 9 | Portfolio integration | ~30 min | Unified portfolio view (sim + real). Diversification score counts both. +10 bonus for NACP. |
| **Total** | | **~6.5 hours** | |

## Key design decisions (already made)

- Real market prices, not sim prices
- FMP as sole data source (quotes + financials + profiles + news + ETF holdings)
- Story-driven reveal, one company at a time, tied to player's most-traded sectors
- Glossary chips on every financial metric
- NACP unlocks after 5+ company cards explored
- Trading anytime at last known price (not restricted to market hours)
- 9 new glossary terms to seed (revenue, net-income, total-assets, book-value, debt-equity, eps, 52-week-range, volume, dividend-yield)

## Files to reference during build

- `docs/plans/2026-03-30-real-exchange-design.md` — full design with page layouts, schema, cron schedules, company stories, glossary mappings
- `convex/schema.ts` — current 17-table schema to extend
- `convex/crons.ts` — add FMP fetch crons here
- `src/components/glossary/glossary-chip.tsx` — reuse for fundamentals section
- `src/app/api/og/[conceptId]/route.tsx` — OG card pattern to extend for real tickers
- `convex/seedData.ts` — pattern for seeding company stories

## Verify before starting

- [ ] FMP API key works: `curl "https://financialmodelingprep.com/api/v3/quote/CARV?apikey=YrIXrxBFK7VlVsDqZniRwmdxlbzuI63a"`
- [ ] CZBS (OTC) covered by FMP: `curl "https://financialmodelingprep.com/api/v3/quote/CZBS?apikey=YrIXrxBFK7VlVsDqZniRwmdxlbzuI63a"` — if empty, drop to 7 + NACP
- [ ] NACP ETF holdings available: `curl "https://financialmodelingprep.com/api/v3/etf-holder/NACP?apikey=YrIXrxBFK7VlVsDqZniRwmdxlbzuI63a"`
