# BLK Exchange — Project Checklist

**Status:** Live at https://blkexchange.com
**Repo:** https://github.com/tmoody1973/blk-exchange
**Stats:** 58 commits, ~15,900 lines of code, 120+ files

---

## Core Platform

- [x] Next.js 14 + TypeScript + Tailwind CSS
- [x] Convex real-time backend (15 tables)
- [x] Clerk authentication (sign-in, sign-up, sign-out)
- [x] Neobrutalism dark mode design system (11 shadcn/ui components)
- [x] Mobile-first responsive layout (bottom tabs, top nav)
- [x] Vercel production deployment
- [x] Social sharing card (OG + Twitter meta tags)

## Market & Trading

- [x] 36 fictional tickers across 12 sectors
- [x] Market dashboard with sortable ticker table + sparklines
- [x] Sector marquee ticker tape (scrolling)
- [x] BLK Index (composite weighted average)
- [x] Ticker detail page with interactive Recharts area chart
- [x] Company backstories (36 Bloomberg-style profiles)
- [x] Previous close display on ticker detail
- [x] Atomic trade execution (buy/sell mutations)
- [x] 25% dynamic position limit
- [x] Fractional shares by dollar amount
- [x] Trade modal (bottom sheet mobile, dialog desktop)
- [x] Trade preview with allocation %

## AI Features

- [x] Groq fictional event generation (llama-3.3-70b-versatile)
- [x] Groq market commentary (llama-3.1-8b-instant, <400ms)
- [x] Groq article classification (significance scoring)
- [x] Groq weekly challenge generation
- [x] Claude portfolio coaching (Haiku 4.5)
- [x] Claude professor mode Q&A (with 36-ticker reference + sector education)
- [x] Claude session debrief (400-word personalized narrative)
- [x] ElevenLabs TTS on Market Alerts (voice ID 6lbtrJXRylVZ6EqIQQPT)
- [x] AI guardrails (10-point system prompt, topic restriction, anti-jailbreak)
- [x] Follow-up questions on every professor response

## News Pipeline

- [x] Firecrawl scraping (12 Black publications every 15 min)
- [x] Perplexity Sonar discovery (6 cultural queries, 48-hour recency filter)
- [x] Groq article classification → events (significance 6+)
- [x] URL hash deduplication across sources
- [x] Smart 40/60 real/fictional event balance
- [x] Source links (clickable ↗ to original articles)
- [x] Rich preview modal for real news (no iframe — card with "Read Full Article")
- [x] News feed filter tabs (All / Real News / BLK News Desk)

## Event System

- [x] Event scheduler cron (every 5 min, max 2 per 10-min window)
- [x] Fictional company news cron (3x/day, every 8 hours)
- [x] Event rotation (underserved stocks get priority, overserved blocked)
- [x] Sector rotation by time of day (morning/afternoon/evening/night)
- [x] Prices applied at fire time (not generation time)
- [x] ±15% per-event cap
- [x] 30% daily circuit breaker (caps total daily movement, no overshoot)
- [x] Daily price reset cron (midnight ET)
- [x] Market Alert overlay (slides in, auto-dismiss 15s)
- [x] Commentary in news feed (Groq plain-language explanations)

## Knowledge & Education

- [x] 23 financial literacy concepts across 4 tiers
- [x] 15 behavior-driven concept triggers (checked after every trade)
- [x] 8 event-driven concept triggers (keyword matching on fired events)
- [x] Knowledge Vault page with progress bars + concept cards
- [x] Shareable vault cards (Web Share API + clipboard + OG images)
- [x] Curriculum debt queue (tracks gaps, weights event generation)
- [x] 22 glossary terms seeded with definitions
- [x] GlossaryChip component (unseen/seen states, definition popover)
- [x] chipEventText utility (auto-chips terms in event text)

## Onboarding

- [x] Guided First Trade flow (replaces tutorial walkthrough)
  - [x] Step 1: "$10,000 — Your Starting Capital"
  - [x] Step 2: Breaking news event with live price + glossary chips
  - [x] Step 3: Trade execution with dollar input + position preview
  - [x] Step 4: Result + first curriculum nudge (Diversification)
- [x] Onboarding state machine (new_player → first_trade_complete → onboarding_complete)
- [x] How to Play page (6-section static guide)
- [x] Take Tour button on profile page

## Game Meta-Layer

- [x] Game status bar (season, session timer, events count, vault progress, P&L)
- [x] Season system (8 weeks, Week X of 8, end date)
- [x] Session debrief auto-prompt (45 min or 5+ events)
- [x] Debrief → redirect to profile with auto-show
- [x] Weekly leaderboard reset cron (Monday midnight ET)
- [x] Challenge of the week (Groq-generated, 3 target types)
- [x] Challenge progress tracking after every trade
- [x] 13 achievements across 4 categories (hardcoded constants)
- [x] Achievement checking after trades + session end
- [x] Achievements panel on profile page

## Leaderboards

- [x] 5 boards: Portfolio Value, Knowledge Vault, Diversification, Biggest Mover, Blueprint Award
- [x] Dedicated /boards page with info cards
- [x] Boards tab in bottom nav + desktop nav
- [x] Auto-scoring after trades (portfolio-value, diversification)
- [x] Auto-scoring after concept unlocks (knowledge-vault)
- [x] Auto-scoring after events (biggest-mover)
- [x] Weekly boards reset, season boards persist

## Performance

- [x] Promise.all for parallel Convex queries (generateDebrief, firecrawl, perplexity)
- [x] Promise.all for parallel DB patches (dailyReset, resetPrices, eventScheduler)
- [x] Dynamic imports for Recharts components (PriceChart, AllocationChart)
- [x] Dynamic imports for overlays (MarketAlert, DebriefPrompt)
- [x] Stock cache Map in checkAchievements (eliminates N×3 DB reads)
- [x] Price history capped at 200 entries
- [x] Weekly leaderboard reset capped at 500 entries per board

## Security

- [x] All AI API keys in Convex environment (never client-side)
- [x] Leaderboard updateScore is internalMutation (no score tampering)
- [x] resetPrices, triggerFire, triggerFictional are internalMutation
- [x] TTS endpoint requires Clerk auth
- [x] Clerk middleware (clerkMiddleware)
- [x] forceRedirectUrl to /market after sign-in

## Pages & Routes

- [x] `/` — Landing page (7 marketing sections)
- [x] `/judges` — Hackathon pitch page (5 judging criteria)
- [x] `/sign-in` — Clerk sign-in
- [x] `/sign-up` — Clerk sign-up
- [x] `/market` — Market dashboard
- [x] `/market/[symbol]` — Ticker detail
- [x] `/portfolio` — Portfolio view
- [x] `/vault` — Knowledge Vault
- [x] `/boards` — Leaderboards
- [x] `/profile` — Profile + achievements + sessions
- [x] `/how-to-play` — Game guide
- [x] `/api/tts` — ElevenLabs TTS endpoint
- [x] `/api/og/[conceptId]` — OG image generation

## Code Quality

- [x] 5 code reviews completed (initial build, game mechanics, meta-game, performance, final)
- [x] Vercel React best practices audit (8 critical/high fixes)
- [x] Code review learnings documented (docs/code-review-learnings.md)
- [x] No console.log in production Convex code
- [x] Convex crons use crons.cron() syntax (not deprecated helpers)
- [x] All Convex mutations have args validators

---

## Not Yet Built (Post-Hackathon)

- [ ] Squad mode (2-3 friends compete together)
- [ ] Head-to-head portfolio duels
- [ ] Scenario/challenge drops ("BET Awards week")
- [ ] Daily login streak tracking (streakDays field exists, no increment logic)
- [ ] "Diamond Hands" achievement (cross-session hold tracking)
- [ ] "Shared Knowledge" achievement (needs share tracking)
- [ ] "Professor's Favorite" achievement (needs question count)
- [ ] Classroom mode (teacher dashboard, Clerk Orgs)
- [ ] Full test suite (no test framework set up)
- [ ] Sector filter on marquee tap
- [ ] Session auto-end timer (45 min)
- [ ] App context for shared player/session state (eliminates duplicate queries)
- [ ] by_stock index on holdings table (for scale)
