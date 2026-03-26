# BLK Exchange Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real-time cultural stock market simulator with 36 fictional Black-economy tickers, dual-AI event generation, and a 23-concept financial literacy curriculum — ready for Hackenomics 2026 submission by March 30.

**Architecture:** Next.js 14 App Router frontend with Convex real-time backend. Groq handles high-volume structured output (event generation, classification, commentary). Claude handles deep reasoning (coaching, professor mode, debrief). ElevenLabs handles TTS on Market Alerts only. Clerk for auth. Mobile-first Yahoo Finance layout with neobrutalism dark mode styling.

**Tech Stack:** Next.js 14, TypeScript, Convex, Clerk, Groq (llama-3.3-70b + llama-3.1-8b), Claude Sonnet 4.6, ElevenLabs, Firecrawl, Exa, Tavily, Tailwind CSS, neobrutalism.dev/shadcn-ui, Recharts

**Design doc:** `docs/plans/2026-03-25-blk-exchange-mvp-design.md`
**Original PRD:** `docs/BLK_Exchange_PRD_v3.md`
**Game mechanics:** `docs/BLK_Exchange_Game_Mechanics.md`
**Build brief:** `docs/BLK_Exchange_Claude_Code_Brief_v3.md`

---

## File Structure

### Root config
- `package.json` — dependencies
- `next.config.js` — Next.js config
- `tailwind.config.ts` — Tailwind with neobrutalism tokens
- `tsconfig.json` — TypeScript config
- `.env.local` — environment variables (not committed)

### Convex backend (`convex/`)
- `convex/schema.ts` — full database schema
- `convex/seed.ts` — seed 36 tickers + company states
- `convex/market.ts` — stock queries (getAllStocks, getStock, getStocksBySetor, getBLKIndex)
- `convex/players.ts` — player queries + mutations (getOrCreate, getPortfolio)
- `convex/trades.ts` — trade execution mutation (atomic buy/sell)
- `convex/holdings.ts` — holdings queries (getHoldings, getHoldingsByPlayer)
- `convex/events.ts` — event queries + mutations (getRecentEvents, fireEvent, getEventQueue)
- `convex/sessions.ts` — session management (startSession, endSession, getActiveSession)
- `convex/vault.ts` — Knowledge Vault queries + mutations (getVault, unlockConcept, checkBehaviorTriggers)
- `convex/leaderboards.ts` — leaderboard queries (getPortfolioBoard, getVaultBoard, etc.)
- `convex/companyStates.ts` — company state queries + mutations
- `convex/curriculumDebt.ts` — curriculum debt management
- `convex/articles.ts` — article storage + dedup
- `convex/groq/generateFictionalEvent.ts` — Groq action: generate fictional event JSON
- `convex/groq/marketCommentary.ts` — Groq action: 2-sentence commentary
- `convex/groq/classifyArticle.ts` — Groq action: classify real article
- `convex/claude/gradePortfolio.ts` — Claude action: portfolio coaching
- `convex/claude/answerQuestion.ts` — Claude action: professor mode Q&A
- `convex/claude/generateDebrief.ts` — Claude action: session debrief
- `convex/elevenlabs/generateTTS.ts` — ElevenLabs action: Market Alert TTS
- `convex/news/firecrawl.ts` — Firecrawl scraping action
- `convex/news/exa.ts` — Exa semantic discovery action
- `convex/news/tavily.ts` — Tavily fallback action
- `convex/news/scheduler.ts` — news pipeline scheduler (cron)
- `convex/eventScheduler.ts` — event queue scheduler (max 2 per 10 min)
- `convex/crons.ts` — Convex cron job definitions
- `convex/auth.config.ts` — Clerk auth config for Convex
- `convex/http.ts` — Clerk webhook endpoint

### Frontend (`src/`)
- `src/app/layout.tsx` — root layout with ConvexProviderWithClerk, global styles
- `src/app/globals.css` — neobrutalism design tokens
- `src/app/(landing)/page.tsx` — landing page (marketing)
- `src/app/(landing)/judges/page.tsx` — pitch page for judges
- `src/app/(landing)/layout.tsx` — landing page layout with marketing nav
- `src/app/(app)/market/page.tsx` — market dashboard (main app)
- `src/app/(app)/market/[symbol]/page.tsx` — ticker detail page
- `src/app/(app)/portfolio/page.tsx` — portfolio view
- `src/app/(app)/vault/page.tsx` — Knowledge Vault
- `src/app/(app)/profile/page.tsx` — profile + leaderboard access
- `src/app/(app)/layout.tsx` — app layout with bottom tabs (mobile) + sidebar (desktop)
- `src/components/market/ticker-table.tsx` — 36-row ticker table with sparklines
- `src/components/market/ticker-row.tsx` — single ticker row (mobile + desktop)
- `src/components/market/sector-marquee.tsx` — scrolling sector ticker tape
- `src/components/market/blk-index.tsx` — BLK Index composite display
- `src/components/market/price-chart.tsx` — area chart for ticker detail (Recharts)
- `src/components/market/sparkline.tsx` — mini line chart for table rows
- `src/components/market/news-feed.tsx` — news feed with real/fictional labels
- `src/components/market/news-item.tsx` — single news headline
- `src/components/market/market-alert.tsx` — Market Alert overlay + TTS trigger
- `src/components/trade/trade-modal.tsx` — buy/sell bottom sheet
- `src/components/trade/trade-preview.tsx` — trade confirmation with allocation preview
- `src/components/portfolio/portfolio-summary.tsx` — total value, day P&L, cash
- `src/components/portfolio/holdings-table.tsx` — holdings with P&L
- `src/components/portfolio/allocation-chart.tsx` — donut chart
- `src/components/portfolio/diversification-score.tsx` — score display + Claude coaching
- `src/components/vault/vault-progress.tsx` — X of 23 progress bar
- `src/components/vault/concept-card.tsx` — unlocked concept card
- `src/components/vault/locked-card.tsx` — locked placeholder
- `src/components/vault/tier-progress.tsx` — Foundation/Intermediate/Advanced/Economics bars
- `src/components/education/portfolio-coach.tsx` — Claude coaching display
- `src/components/education/professor-mode.tsx` — Q&A panel
- `src/components/education/session-debrief.tsx` — debrief narrative display
- `src/components/leaderboard/leaderboard-tabs.tsx` — 5 board tabs
- `src/components/leaderboard/board-table.tsx` — ranked player list
- `src/components/landing/hero-section.tsx` — hero with marquee + mocked tickers
- `src/components/landing/problem-section.tsx` — the problem
- `src/components/landing/how-it-works.tsx` — 3-step cards
- `src/components/landing/sectors-scroll.tsx` — 12 sector horizontal scroll
- `src/components/landing/ai-section.tsx` — AI roles explanation
- `src/components/landing/demo-video.tsx` — embedded video
- `src/components/landing/curriculum-preview.tsx` — vault preview
- `src/components/landing/cta-section.tsx` — final CTA
- `src/components/judges/criterion-section.tsx` — reusable criterion block
- `src/components/judges/criteria-nav.tsx` — sticky anchor links
- `src/components/layout/bottom-tabs.tsx` — mobile bottom navigation
- `src/components/layout/app-sidebar.tsx` — desktop sidebar (neobrutalism)
- `src/components/layout/marketing-nav.tsx` — landing page navigation
- `src/lib/constants/tickers.ts` — 36 ticker definitions (symbol, name, sector, startPrice)
- `src/lib/constants/concepts.ts` — 23 concept definitions (id, name, tier, trigger type, trigger condition)
- `src/lib/constants/sectors.ts` — 12 sector definitions
- `src/lib/constants/publications.ts` — 12 publication URLs + ticker mappings
- `src/lib/utils/format.ts` — price formatting (cents to dollars), percentage formatting
- `src/lib/utils/price.ts` — price calculation helpers
- `src/lib/hooks/use-market-alert.ts` — Market Alert state + TTS playback
- `src/lib/hooks/use-session.ts` — session timer + event counter

### Data files (`src/data/`)
- `src/data/seed-stocks.ts` — 36 stock seed data objects
- `src/data/seed-company-states.ts` — 36 company state seed data objects
- `src/data/concepts.ts` — 23 concept card content (definition, real-world example)

---

## Phase 1 — Static Trading Floor (Day 1)

### Task 1: Project scaffold + Convex + Clerk

**Files:**
- Create: `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json`
- Create: `convex/auth.config.ts`, `convex/http.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`

- [ ] **Step 1: Create Next.js project with TypeScript + Tailwind**

```bash
pnpm create next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

- [ ] **Step 2: Install Convex + Clerk**

```bash
pnpm add convex @clerk/nextjs @clerk/clerk-react
pnpm dlx convex dev --once
```

- [ ] **Step 3: Install all neobrutalism components**

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add \
  https://neobrutalism.dev/r/chart.json \
  https://neobrutalism.dev/r/marquee.json \
  https://neobrutalism.dev/r/sidebar.json \
  https://neobrutalism.dev/r/table.json \
  https://neobrutalism.dev/r/tabs.json \
  https://neobrutalism.dev/r/button.json \
  https://neobrutalism.dev/r/card.json \
  https://neobrutalism.dev/r/badge.json \
  https://neobrutalism.dev/r/input.json \
  https://neobrutalism.dev/r/dialog.json \
  https://neobrutalism.dev/r/progress.json
```

- [ ] **Step 4: Install Recharts for charts**

```bash
pnpm add recharts
```

- [ ] **Step 5: Set up globals.css with neobrutalism tokens**

Create `src/app/globals.css` with:
- `--background: 7 7% 6%` → `#0e0e0e`
- `--card: 0 0% 10%` → `#1a1a1a`
- `--primary: 244 62% 67%` → `#7F77DD`
- `--accent: 52 98% 64%` → `#FDE047`
- `--border: 0 0% 100%` → `#ffffff`
- `--radius: 0rem`
- `--blk-shadow: 4px 4px 0px 0px #ffffff`
- `--blk-font: 'Courier New', monospace`
- Global: `* { border-radius: 0 !important }` and `body { font-family: 'Courier New', monospace }`
- Hover: `transform: translate(2px,2px)` + shadow reduces to 2px

- [ ] **Step 6: Set up root layout with ConvexProviderWithClerk**

Create `src/app/layout.tsx` wrapping children with:
- `ClerkProvider`
- `ConvexProviderWithClerk` using `useAuth` from `@clerk/nextjs`

- [ ] **Step 7: Configure Convex auth**

Create `convex/auth.config.ts` — configure Clerk JWT issuer domain.
Create `convex/http.ts` — Clerk webhook handler for user sync.

- [ ] **Step 8: Create .env.local with placeholder values**

```
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=
```

- [ ] **Step 9: Verify dev server starts**

```bash
pnpm dev
```

Expected: Next.js dev server running at localhost:3000, Convex dashboard accessible.

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: project scaffold — Next.js 14 + Convex + Clerk + neobrutalism components"
```

---

### Task 2: Convex schema

**Files:**
- Create: `convex/schema.ts`

- [ ] **Step 1: Define full Convex schema**

Create `convex/schema.ts` with these tables:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stocks: defineTable({
    symbol: v.string(),
    name: v.string(),
    description: v.string(),
    sector: v.string(),
    priceInCents: v.number(),
    previousCloseInCents: v.number(),
    dailyChangeInCents: v.number(),
    dailyChangePercent: v.number(),
    marketCapInCents: v.number(),
    priceHistory: v.array(v.object({
      timestamp: v.number(),
      priceInCents: v.number(),
    })),
  }).index("by_symbol", ["symbol"])
    .index("by_sector", ["sector"]),

  players: defineTable({
    clerkId: v.string(),
    name: v.string(),
    cashInCents: v.number(),
    portfolioValueInCents: v.number(),
    totalEventsExperienced: v.number(),
    seasonResetUsed: v.boolean(),
    streakDays: v.number(),
    lastPlayedDate: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  holdings: defineTable({
    playerId: v.id("players"),
    stockId: v.id("stocks"),
    symbol: v.string(),
    shares: v.number(), // stored as fractional (float)
    avgCostInCents: v.number(),
    totalInvestedInCents: v.number(),
  }).index("by_player", ["playerId"])
    .index("by_player_stock", ["playerId", "stockId"]),

  trades: defineTable({
    playerId: v.id("players"),
    stockId: v.id("stocks"),
    symbol: v.string(),
    type: v.union(v.literal("buy"), v.literal("sell")),
    amountInCents: v.number(),
    priceInCents: v.number(),
    shares: v.number(),
    timestamp: v.number(),
  }).index("by_player", ["playerId"])
    .index("by_player_time", ["playerId", "timestamp"]),

  events: defineTable({
    headline: v.string(),
    source: v.string(), // "BLK Exchange News Desk" or publication name
    sourceType: v.union(v.literal("fictional"), v.literal("real")),
    eventType: v.union(
      v.literal("concept-targeted"),
      v.literal("company-lifecycle"),
      v.literal("cultural-calendar"),
      v.literal("real-news")
    ),
    primarySymbol: v.string(), // denormalized: first/main affected stock, enables efficient queries
    affectedStocks: v.array(v.object({
      symbol: v.string(),
      changePercent: v.number(),
    })),
    conceptTaught: v.optional(v.string()),
    commentary: v.optional(v.string()),
    timestamp: v.number(),
    fired: v.boolean(),
    firedAt: v.optional(v.number()),
  }).index("by_fired", ["fired"])
    .index("by_timestamp", ["timestamp"])
    .index("by_symbol", ["primarySymbol", "timestamp"]),

  articles: defineTable({
    urlHash: v.string(),
    url: v.string(),
    title: v.string(),
    publication: v.string(),
    summary: v.optional(v.string()),
    significance: v.number(),
    classifiedTickers: v.array(v.string()),
    classifiedConcept: v.optional(v.string()),
    sourceLayer: v.union(
      v.literal("firecrawl"),
      v.literal("exa"),
      v.literal("tavily")
    ),
    createdAt: v.number(),
    processedAsEvent: v.boolean(),
  }).index("by_urlHash", ["urlHash"])
    .index("by_publication", ["publication"]),

  companyStates: defineTable({
    symbol: v.string(),
    revenueTrend: v.union(
      v.literal("growing"),
      v.literal("stable"),
      v.literal("declining")
    ),
    recentEvents: v.array(v.string()), // last 3 event titles
    marketPosition: v.union(
      v.literal("leader"),
      v.literal("challenger"),
      v.literal("niche")
    ),
    competitiveExposure: v.array(v.string()), // rival ticker symbols
    lastEventType: v.union(
      v.literal("earnings"),
      v.literal("product"),
      v.literal("partnership"),
      v.literal("personnel"),
      v.literal("macro")
    ),
    seasonalContext: v.string(),
  }).index("by_symbol", ["symbol"]),

  sessions: defineTable({
    playerId: v.id("players"),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    eventsExperienced: v.number(),
    conceptsUnlocked: v.array(v.string()),
    portfolioStartValueInCents: v.number(),
    portfolioEndValueInCents: v.optional(v.number()),
    debriefText: v.optional(v.string()),
    active: v.boolean(),
  }).index("by_player", ["playerId"])
    .index("by_active", ["playerId", "active"]),

  vault: defineTable({
    playerId: v.id("players"),
    conceptId: v.string(),
    conceptName: v.string(),
    tier: v.union(
      v.literal("foundation"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("economics")
    ),
    unlockedAt: v.number(),
    triggerType: v.union(v.literal("behavior"), v.literal("event")),
    triggerEventHeadline: v.optional(v.string()),
    portfolioValueAtUnlock: v.number(),
    definition: v.string(),
    realWorldExample: v.string(),
  }).index("by_player", ["playerId"])
    .index("by_player_concept", ["playerId", "conceptId"]),

  curriculumDebt: defineTable({
    playerId: v.id("players"),
    missingConcepts: v.array(v.string()),
    updatedAt: v.number(),
  }).index("by_player", ["playerId"]),

  leaderboards: defineTable({
    board: v.union(
      v.literal("portfolio-value"),
      v.literal("knowledge-vault"),
      v.literal("diversification"),
      v.literal("biggest-mover"),
      v.literal("blueprint-award")
    ),
    playerId: v.id("players"),
    playerName: v.string(),
    score: v.number(),
    period: v.string(), // "2026-W13" or "season-1"
    updatedAt: v.number(),
  }).index("by_board_period", ["board", "period"])
    .index("by_player_board", ["playerId", "board"]),
});
```

- [ ] **Step 2: Push schema to Convex**

```bash
pnpm dlx convex dev --once
```

Expected: Schema deployed, tables created in Convex dashboard.

- [ ] **Step 3: Commit**

```bash
git add convex/schema.ts && git commit -m "feat: Convex schema — stocks, players, holdings, trades, events, vault, leaderboards"
```

---

### Task 3: Constants + seed data

**Files:**
- Create: `src/lib/constants/tickers.ts`
- Create: `src/lib/constants/sectors.ts`
- Create: `src/lib/constants/concepts.ts`
- Create: `src/lib/constants/publications.ts`
- Create: `src/lib/utils/format.ts`
- Create: `src/data/seed-stocks.ts`
- Create: `src/data/seed-company-states.ts`
- Create: `src/data/concepts.ts`
- Create: `convex/seed.ts`

- [ ] **Step 1: Create sector constants**

Create `src/lib/constants/sectors.ts` — 12 sectors with display name and color:

```typescript
export const SECTORS = [
  { id: "media", name: "Media & Content", color: "#FF6B6B" },
  { id: "streaming", name: "Streaming", color: "#4ECDC4" },
  { id: "music", name: "Music", color: "#45B7D1" },
  { id: "gaming", name: "Gaming", color: "#96CEB4" },
  { id: "sportswear", name: "Sportswear", color: "#FFEAA7" },
  { id: "fashion", name: "Streetwear & Fashion", color: "#DDA0DD" },
  { id: "publishing", name: "Publishing", color: "#98D8C8" },
  { id: "beauty", name: "Beauty & Wellness", color: "#F7DC6F" },
  { id: "finance", name: "Finance & Banking", color: "#82E0AA" },
  { id: "realestate", name: "Real Estate", color: "#F0B27A" },
  { id: "sports", name: "Sports & Athletics", color: "#85C1E9" },
  { id: "entertainment", name: "Entertainment", color: "#C39BD3" },
] as const;
```

- [ ] **Step 2: Create ticker constants**

Create `src/lib/constants/tickers.ts` — all 36 tickers with symbol, name, sector, startPriceInCents. Reference the design doc Section 7 of the Claude Code Brief for exact data.

- [ ] **Step 3: Create seed data files**

Create `src/data/seed-stocks.ts` — 36 stock objects ready for Convex insertion.
Create `src/data/seed-company-states.ts` — 36 company state objects with initial revenueTrend, marketPosition, competitiveExposure, etc.

- [ ] **Step 4: Create concept definitions**

Create `src/lib/constants/concepts.ts` — 23 concepts with id, name, tier, triggerType ("behavior" | "event"), and triggerDescription.
Create `src/data/concepts.ts` — full concept card content (definition, realWorldExample).

- [ ] **Step 5: Create publication constants**

Create `src/lib/constants/publications.ts` — 12 publications with name, URL, and primary ticker mappings.

- [ ] **Step 6: Create formatting utilities**

Create `src/lib/utils/format.ts`:
- `formatPrice(cents: number): string` — cents to `$XX.XX`
- `formatChange(cents: number): string` — `+$X.XX` or `-$X.XX`
- `formatPercent(pct: number): string` — `+X.XX%` or `-X.XX%`

- [ ] **Step 6b: Create price utilities**

Create `src/lib/utils/price.ts`:
- `applyPriceChange(priceInCents: number, changePercent: number): number` — apply % change, return new price in cents (rounded to whole cents)
- `computePortfolioValue(holdings: Array<{shares: number, priceInCents: number}>, cashInCents: number): number` — total portfolio value in cents
- `roundShares(shares: number): number` — round to 4 decimal places to avoid floating-point artifacts
- `computeDiversificationScore(sectorCount: number, totalSectors: number): number` — simple score 0-100

- [ ] **Step 7: Create Convex seed function**

Create `convex/seed.ts` — a Convex mutation that:
1. Checks if stocks table is empty
2. If empty, inserts all 36 stocks and 36 company states
3. Returns count of inserted records

```typescript
import { mutation } from "./_generated/server";
// Import seed data...

export const seedDatabase = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("stocks").first();
    if (existing) return { seeded: false, message: "Already seeded" };

    for (const stock of SEED_STOCKS) {
      await ctx.db.insert("stocks", stock);
    }
    for (const state of SEED_COMPANY_STATES) {
      await ctx.db.insert("companyStates", state);
    }
    return { seeded: true, count: SEED_STOCKS.length };
  },
});
```

- [ ] **Step 8: Run seed**

```bash
pnpm dlx convex run seed:seedDatabase
```

Expected: 36 stocks and 36 company states inserted.

- [ ] **Step 9: Commit**

```bash
git add src/lib/constants/ src/data/ src/lib/utils/format.ts convex/seed.ts && git commit -m "feat: seed data — 36 tickers, 12 sectors, 23 concepts, company states"
```

---

### Task 4: Market queries + player mutations

> **Must come before UI components** — the layout and dashboard depend on these Convex queries.

**Files:**
- Create: `convex/market.ts`
- Create: `convex/players.ts`
- Create: `convex/holdings.ts`

- [ ] **Step 1: Create market queries**

Create `convex/market.ts`:
- `getAllStocks` — query returning all 36 stocks sorted by symbol
- `getStock` — query by symbol
- `getStocksBySector` — query by sector
- `getBLKIndex` — compute weighted average price + daily change

- [ ] **Step 2: Create player queries + mutations**

Create `convex/players.ts`:
- `getOrCreate` — mutation: takes clerkId + name, creates player with $10,000 (1_000_000 cents) if not exists, returns player
- `getPlayer` — query by clerkId
- `getPortfolioValue` — compute total value from holdings + cash

- [ ] **Step 3: Create holdings queries**

Create `convex/holdings.ts`:
- `getHoldings` — query all holdings for a player, joined with current stock price
- `getHoldingForStock` — query specific holding for player + stock

- [ ] **Step 4: Test queries in Convex dashboard**

Open Convex dashboard, run `market:getAllStocks` — should return 36 stocks.
Run `players:getOrCreate` with test data — should create player.

- [ ] **Step 5: Commit**

```bash
git add convex/market.ts convex/players.ts convex/holdings.ts && git commit -m "feat: Convex queries — market, players, holdings"
```

---

### Task 5: App layout + bottom tabs + sidebar

> **Depends on Task 4** — uses `useQuery(api.market.getAllStocks)` and `api.players.getOrCreate`.

**Files:**
- Create: `src/app/(app)/layout.tsx`
- Create: `src/components/layout/bottom-tabs.tsx`
- Create: `src/components/layout/app-sidebar.tsx`
- Create: `src/components/market/sector-marquee.tsx`
- Create: `src/components/market/blk-index.tsx`

- [ ] **Step 1: Create bottom tabs component**

Create `src/components/layout/bottom-tabs.tsx` — mobile bottom navigation with 4 tabs: Market, Portfolio, Vault, Me. Uses neobrutalism styling. Only visible below `md` breakpoint.

- [ ] **Step 2: Create app sidebar component**

Create `src/components/layout/app-sidebar.tsx` — desktop sidebar using neobrutalism Sidebar component. Shows portfolio summary. Collapsible. Only visible at `lg+` breakpoint.

- [ ] **Step 3: Create sector marquee component**

Create `src/components/market/sector-marquee.tsx` — uses neobrutalism Marquee component. Fetches all stocks via `useQuery(api.market.getAllStocks)`, computes sector averages, renders scrolling ticker tape showing sector name + daily % with green/red color.

- [ ] **Step 4: Create BLK Index component**

Create `src/components/market/blk-index.tsx` — weighted average of all 36 stock prices. Displays as `BLK Index: $XX.XX +X.X%` in header.

- [ ] **Step 5: Create app layout**

Create `src/app/(app)/layout.tsx` — wraps app pages with:
- Sector marquee at top (always visible)
- Desktop: sidebar on left, content in main area
- Mobile: content full-width, bottom tabs fixed at bottom
- Auth guard: redirect to sign-in if not authenticated
- On first load, call `api.players.getOrCreate` to ensure player record exists with $10,000
- Global error boundary + loading skeleton for Convex query states

- [ ] **Step 6: Verify layout renders**

Navigate to `/market` — should see marquee (with seed data), sidebar (desktop), bottom tabs (mobile).

- [ ] **Step 7: Commit**

```bash
git add src/app/\(app\)/ src/components/layout/ src/components/market/sector-marquee.tsx src/components/market/blk-index.tsx && git commit -m "feat: app layout — bottom tabs, sidebar, sector marquee, BLK Index"
```

---

### Task 6: Market dashboard page

**Files:**
- Create: `src/app/(app)/market/page.tsx`
- Create: `src/components/market/ticker-table.tsx`
- Create: `src/components/market/ticker-row.tsx`
- Create: `src/components/market/sparkline.tsx`

- [ ] **Step 1: Create sparkline component**

Create `src/components/market/sparkline.tsx` — minimal Recharts LineChart, no axes, no labels. Takes `priceHistory` array, renders 7-day trend. Height: 32px on mobile, 24px on desktop.

- [ ] **Step 2: Create ticker row component**

Create `src/components/market/ticker-row.tsx`:
- Desktop: symbol, company name, sector badge, price, daily change ($), daily change (%), sparkline
- Mobile: symbol, price, daily change (%), sparkline. Company name hidden.
- Green text for positive change, red for negative
- Row tap navigates to `/market/[symbol]`
- Min height 44px for tap targets

- [ ] **Step 3: Create ticker table component**

Create `src/components/market/ticker-table.tsx` — uses neobrutalism Table. Renders 36 ticker rows via `useQuery(api.market.getAllStocks)`. Sortable by all columns (symbol, price, change, sector). Default sort: by sector.

- [ ] **Step 4: Create market dashboard page**

Create `src/app/(app)/market/page.tsx`:
- Desktop: two-column layout — ticker table (left), news feed placeholder (right)
- Mobile: single column — ticker table, then news feed below
- Uses real-time Convex subscriptions

- [ ] **Step 5: Verify dashboard renders with 36 tickers**

Navigate to `/market` — should see all 36 stocks with prices, changes, sparklines. Verify mobile layout at 375px.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(app\)/market/ src/components/market/ticker-table.tsx src/components/market/ticker-row.tsx src/components/market/sparkline.tsx && git commit -m "feat: market dashboard — 36 tickers with sparklines, sortable table"
```

---

### Task 7: Ticker detail page

**Files:**
- Create: `src/app/(app)/market/[symbol]/page.tsx`
- Create: `src/components/market/price-chart.tsx`

- [ ] **Step 1: Create price chart component**

Create `src/components/market/price-chart.tsx` — Recharts AreaChart (Interactive variant). Neobrutalism styled. Time range tabs: 1D, 1W, 1M, ALL using neobrutalism Tabs. Hover shows price tooltip.

- [ ] **Step 2: Create ticker detail page**

Create `src/app/(app)/market/[symbol]/page.tsx`:
- Header: symbol, company name, sector badge, current price, daily change
- Price chart with time range tabs
- Company profile: description, revenue trend, market position, rivals (from companyStates)
- Recent events (from events table, filtered by symbol)
- Your position: shares, value, P&L (if holding exists)
- BUY / SELL buttons — sticky at bottom on mobile

- [ ] **Step 3: Verify detail page renders**

Navigate to `/market/CROWN` — should show CROWN detail with chart, profile, buy/sell buttons.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(app\)/market/\[symbol\]/ src/components/market/price-chart.tsx && git commit -m "feat: ticker detail page — price chart, company profile, buy/sell"
```

---

### Task 8: Trade execution

**Files:**
- Create: `convex/trades.ts`
- Create: `src/components/trade/trade-modal.tsx`
- Create: `src/components/trade/trade-preview.tsx`

- [ ] **Step 1: Create trade mutation**

Create `convex/trades.ts` — atomic mutation `executeTrade`:
1. Validate player has sufficient cash (buy) or shares (sell)
2. Validate 25% position limit (25% of total portfolio value = cash + holdings, NOT a flat $2,500 cap)
3. Calculate shares from dollar amount at current price (use `roundShares()` from `price.ts` — 4 decimal places to avoid float artifacts)
4. Create trade record
5. Update or create holding (update avgCost on buy, reduce shares on sell, delete holding if 0 shares)
6. Update player cash balance
7. Return trade result with new portfolio snapshot

All in one atomic Convex mutation — no partial state.

- [ ] **Step 2: Create trade preview component**

Create `src/components/trade/trade-preview.tsx` — shows before executing:
- Shares to buy/sell
- Execution price
- New portfolio allocation %
- New cash balance
- Position limit warning if >25%

- [ ] **Step 3: Create trade modal component**

Create `src/components/trade/trade-modal.tsx`:
- Desktop: neobrutalism Dialog
- Mobile: bottom sheet (Dialog positioned at bottom)
- BUY / SELL toggle
- Dollar amount input (neobrutalism Input)
- Quick amount buttons: $100, $500, $1000, $2500
- Trade preview component
- Confirm button
- Calls `useMutation(api.trades.executeTrade)`

- [ ] **Step 4: Wire trade modal to ticker detail page**

Update `src/app/(app)/market/[symbol]/page.tsx` — BUY/SELL buttons open trade modal with pre-selected stock.

- [ ] **Step 5: Test trade flow**

1. Navigate to `/market/KICKS`
2. Tap BUY
3. Enter $500
4. Preview shows ~4.46 shares at $112
5. Confirm
6. Cash drops from $10,000 to $9,500
7. Holding appears

- [ ] **Step 6: Commit**

```bash
git add convex/trades.ts src/components/trade/ && git commit -m "feat: trade execution — atomic buy/sell with 25% position limit"
```

---

### Task 9: Portfolio page

**Files:**
- Create: `src/app/(app)/portfolio/page.tsx`
- Create: `src/components/portfolio/portfolio-summary.tsx`
- Create: `src/components/portfolio/holdings-table.tsx`
- Create: `src/components/portfolio/allocation-chart.tsx`
- Create: `src/components/portfolio/diversification-score.tsx`

- [ ] **Step 1: Create portfolio summary component**

Create `src/components/portfolio/portfolio-summary.tsx` — total portfolio value, day P&L ($ and %), cash remaining. Neobrutalism Card.

- [ ] **Step 2: Create allocation chart component**

Create `src/components/portfolio/allocation-chart.tsx` — Recharts PieChart (Donut with Text variant). Center shows total value. Segments colored by sector. Neobrutalism styled.

- [ ] **Step 3: Create holdings table component**

Create `src/components/portfolio/holdings-table.tsx`:
- Desktop: symbol, shares, avg cost, current price, P&L, % allocation
- Mobile: symbol, total value, P&L ($), P&L (%), allocation
- Tap row navigates to ticker detail

- [ ] **Step 4: Create diversification score component**

Create `src/components/portfolio/diversification-score.tsx` — shows score 0-100 (placeholder calculation: sectors held / 12 * 100). Claude coaching text placeholder.

- [ ] **Step 5: Create portfolio page**

Create `src/app/(app)/portfolio/page.tsx` — assembles summary, donut chart, holdings table, diversification score. Mobile-first layout.

- [ ] **Step 6: Test portfolio page**

Execute a few trades, navigate to `/portfolio` — should show holdings with P&L, donut chart with sector allocation.

- [ ] **Step 7: Commit**

```bash
git add src/app/\(app\)/portfolio/ src/components/portfolio/ && git commit -m "feat: portfolio page — holdings, allocation donut, diversification score"
```

---

### Task 10: News feed (static structure)

**Files:**
- Create: `src/components/market/news-feed.tsx`
- Create: `src/components/market/news-item.tsx`
- Create: `convex/events.ts`

- [ ] **Step 1: Create events queries**

Create `convex/events.ts`:
- `getRecentEvents` — query last 20 events, sorted by timestamp descending
- `getFiredEvents` — query events where `fired === true`
- `getEventQueue` — query unfired events

- [ ] **Step 2: Create news item component**

Create `src/components/market/news-item.tsx` — single news headline:
- Source label ("via AfroTech" or "BLK Exchange News Desk")
- Headline text
- Affected tickers with % change badges
- Concept taught (if any)
- Timestamp relative ("12m ago")

- [ ] **Step 3: Create news feed component**

Create `src/components/market/news-feed.tsx` — scrollable list of news items. Uses `useQuery(api.events.getRecentEvents)`. Shows "Market is quiet..." if no events.

- [ ] **Step 4: Wire news feed into market dashboard**

Update `src/app/(app)/market/page.tsx` — add news feed to right column (desktop) or below ticker table (mobile).

- [ ] **Step 5: Commit**

```bash
git add src/components/market/news-feed.tsx src/components/market/news-item.tsx convex/events.ts && git commit -m "feat: news feed — event display with source labels"
```

---

## Phase 2 — AI Engines (Days 2-3)

### Task 11: Groq fictional event generation

**Files:**
- Create: `convex/groq/generateFictionalEvent.ts`
- Create: `convex/companyStates.ts`

- [ ] **Step 1: Install OpenAI SDK (Groq-compatible)**

```bash
pnpm add openai
```

- [ ] **Step 2: Create company state queries**

Create `convex/companyStates.ts`:
- `getAllStates` — query all 36 company states
- `getState` — query by symbol
- `updateState` — mutation to update after event fires

- [ ] **Step 3: Create fictional event generator**

Create `convex/groq/generateFictionalEvent.ts` — split into action + internal mutation:

**Action** (`generate`): Convex action (can call external APIs but NOT write to DB directly):
1. Fetch all 36 company states via `ctx.runQuery`
2. Fetch curriculum debt via `ctx.runQuery`
3. Pick event type: concept-targeted (if debt), company-lifecycle, or cultural-calendar
4. Call Groq `llama-3.3-70b-versatile` with:
   - System prompt: "You are BLK Exchange News Desk..."
   - All 36 company states as context
   - Event type instruction
   - `response_format: { type: 'json_object' }`
   - `temperature: 0.8`
5. Parse response: headline, affectedStocks (symbol + changePercent), conceptTaught, eventType
6. Call `ctx.runMutation(internal.groq.generateFictionalEvent.applyEvent, parsedData)` to write to DB

**Internal mutation** (`applyEvent`): writes to DB atomically:
1. Insert event into events table
2. Apply price changes to affected stocks (use `applyPriceChange` from `src/lib/utils/price.ts` logic)
3. Update company state for primary affected stock
4. Round all prices to whole cents

**Important Convex pattern:** Actions call external APIs. Mutations write to DB. Actions trigger mutations via `ctx.runMutation`. This pattern applies to ALL Groq/Claude/ElevenLabs integrations.

- [ ] **Step 4: Test event generation**

```bash
pnpm dlx convex run groq/generateFictionalEvent:generate
```

Expected: New event in events table, affected stock prices updated.

- [ ] **Step 5: Commit**

```bash
git add convex/groq/generateFictionalEvent.ts convex/companyStates.ts && git commit -m "feat: Groq fictional event generation — reads company states, generates coherent events"
```

---

### Task 12: Groq market commentary

**Files:**
- Create: `convex/groq/marketCommentary.ts`

- [ ] **Step 1: Create commentary generator**

Create `convex/groq/marketCommentary.ts` — Convex action:
1. Takes event headline + affected stocks as input
2. Calls Groq `llama-3.1-8b-instant` with:
   - System prompt: "Write a 2-sentence plain-language explanation..."
   - `response_format: { type: 'json_object' }`
   - `temperature: 0.5`
   - Target: <400ms
3. Returns commentary string
4. Updates event record with commentary

- [ ] **Step 2: Test commentary generation**

Generate an event, then run commentary — should return 2 sentences explaining the event in plain language.

- [ ] **Step 3: Commit**

```bash
git add convex/groq/marketCommentary.ts && git commit -m "feat: Groq market commentary — 2-sentence explanations via 8b model"
```

---

### Task 13: Event scheduler

**Files:**
- Create: `convex/eventScheduler.ts`
- Create: `convex/crons.ts`

- [ ] **Step 1: Create event scheduler**

Create `convex/eventScheduler.ts` — Convex mutation:
1. Check: how many events fired in last 10 minutes?
2. If < 2: pick next event from queue (or generate fictional)
3. Fire the event: set `fired: true`, `firedAt: Date.now()`
4. Apply price changes to stocks
5. Schedule market commentary generation

- [ ] **Step 2: Create cron jobs**

Create `convex/crons.ts`:
- Event scheduler: runs every 5 minutes
- (Phase 3 will add news pipeline crons)

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval("fire events", { minutes: 5 }, internal.eventScheduler.fireNextEvent);
export default crons;
```

- [ ] **Step 3: Verify events fire on schedule**

Watch Convex dashboard — events should fire every 5 minutes, max 2 per 10-minute window.

- [ ] **Step 4: Commit**

```bash
git add convex/eventScheduler.ts convex/crons.ts && git commit -m "feat: event scheduler — max 2 events per 10-min window, cron-driven"
```

---

### Task 14: Market Alert component + ElevenLabs TTS

**Files:**
- Create: `src/components/market/market-alert.tsx`
- Create: `src/lib/hooks/use-market-alert.ts`
- Create: `convex/elevenlabs/generateTTS.ts`

- [ ] **Step 1: Install ElevenLabs SDK**

```bash
pnpm add elevenlabs
```

- [ ] **Step 2: Create TTS generator**

Create `convex/elevenlabs/generateTTS.ts` — Convex action:
1. Takes headline text as input
2. Calls ElevenLabs API with `eleven_flash_v2_5` model, voice 'Charlie'
3. Returns audio URL (or stores audio blob in Convex file storage)

- [ ] **Step 3: Create market alert hook**

Create `src/lib/hooks/use-market-alert.ts`:
- Subscribes to latest fired event via `useQuery`
- When new event fires: sets alert visible, triggers TTS playback
- Auto-dismiss after 15 seconds or on tap
- Manages audio playback state

- [ ] **Step 4: Create market alert component**

Create `src/components/market/market-alert.tsx`:
- Desktop: slides in from right using neobrutalism Card
- Mobile: slides up from bottom as bottom sheet
- Shows: headline, source label, affected tickers with % changes, commentary, concept taught
- Close button + swipe/tap to dismiss
- Audio plays automatically on appearance

- [ ] **Step 5: Wire alert into app layout**

Add `MarketAlert` to `src/app/(app)/layout.tsx` — renders on top of all pages.

- [ ] **Step 6: Test full alert flow**

Trigger an event via scheduler → Market Alert slides in → ElevenLabs reads headline → dismiss.

- [ ] **Step 7: Commit**

```bash
git add src/components/market/market-alert.tsx src/lib/hooks/use-market-alert.ts convex/elevenlabs/ && git commit -m "feat: Market Alert with ElevenLabs TTS — slides in on event fire"
```

---

### Task 15: Claude portfolio coaching

**Files:**
- Create: `convex/claude/gradePortfolio.ts`
- Create: `src/components/education/portfolio-coach.tsx`

- [ ] **Step 1: Install Anthropic SDK**

```bash
pnpm add @anthropic-ai/sdk
```

- [ ] **Step 2: Create portfolio grading action**

Create `convex/claude/gradePortfolio.ts` — Convex action:
1. Fetch player's holdings + current stock prices
2. Calculate: sector distribution, concentration %, total P&L
3. Call Claude Sonnet with:
   - System: "You are a portfolio coach for BLK Exchange..."
   - Player's actual holdings as context
   - Ask for: diversification score (0-100), concentration warnings, one specific recommendation with named ticker
4. Return: score, warnings, recommendation text

- [ ] **Step 3: Create portfolio coach component**

Create `src/components/education/portfolio-coach.tsx`:
- Displays Claude's coaching after every 3 events
- Shows diversification score, warnings, recommendation
- Neobrutalism Card with primary border

- [ ] **Step 4: Wire coaching into session flow**

After every 3rd event (tracked via session eventsExperienced counter), trigger `gradePortfolio` and show result in portfolio coach component.

- [ ] **Step 5: Commit**

```bash
git add convex/claude/gradePortfolio.ts src/components/education/portfolio-coach.tsx && git commit -m "feat: Claude portfolio coaching — grades diversification, recommends specific tickers"
```

---

### Task 16: Claude professor mode

**Files:**
- Create: `convex/claude/answerQuestion.ts`
- Create: `src/components/education/professor-mode.tsx`

- [ ] **Step 1: Create professor mode action**

Create `convex/claude/answerQuestion.ts` — Convex action:
1. Takes: player's question, player's holdings, current stock data, vault progress
2. Calls Claude Sonnet with context of player's actual portfolio
3. Returns answer using their holdings as teaching examples

- [ ] **Step 2: Create professor mode component**

Create `src/components/education/professor-mode.tsx`:
- Expandable panel triggered by tapping any stock, concept, or alert
- Text input for questions (neobrutalism Input)
- Claude's response in a styled card
- Loading state while Claude thinks

- [ ] **Step 3: Wire into ticker detail + vault**

Add professor mode trigger to ticker detail page and vault concept cards.

- [ ] **Step 4: Commit**

```bash
git add convex/claude/answerQuestion.ts src/components/education/professor-mode.tsx && git commit -m "feat: Claude professor mode — Q&A using player's actual portfolio"
```

---

### Task 17: Knowledge Vault + concept unlocking

**Files:**
- Create: `convex/vault.ts`
- Create: `src/app/(app)/vault/page.tsx`
- Create: `src/components/vault/vault-progress.tsx`
- Create: `src/components/vault/concept-card.tsx`
- Create: `src/components/vault/locked-card.tsx`
- Create: `src/components/vault/tier-progress.tsx`

- [ ] **Step 1: Create vault queries + mutations**

Create `convex/vault.ts`:
- `getVault` — query all unlocked concepts for a player
- `unlockConcept` — mutation: insert vault record with concept details, trigger headline, portfolio value
- `checkBehaviorTriggers` — mutation: runs after every trade + event, checks all 15 behavior-driven triggers against current portfolio state. Returns newly unlocked concepts (if any).

Behavior trigger implementations (from design doc Section 5.1):
- `buying-selling-basics`: player has ≥1 buy trade AND ≥1 sell trade
- `supply-and-demand`: player holds stock that rose 5%+ after latest event
- `diversification`: player holds stocks in 4+ sectors
- `dollar-cost-averaging`: player has 3+ buy trades for same stock at different prices
- (etc. for all 15)

- [ ] **Step 2: Create vault page**

Create `src/app/(app)/vault/page.tsx`:
- Progress bar (X of 23) using neobrutalism Progress
- Tier progress bars (Foundation 5/5, Intermediate 3/8, etc.)
- Unlocked concept cards
- Locked card placeholders

- [ ] **Step 3: Create vault components**

- `vault-progress.tsx` — progress bar with count
- `concept-card.tsx` — expanded concept card with definition, trigger moment, real-world example, share button
- `locked-card.tsx` — greyed out placeholder
- `tier-progress.tsx` — tier name + filled/empty dots

- [ ] **Step 4: Wire behavior checks into trade flow**

After every successful trade in `convex/trades.ts`, call `vault.checkBehaviorTriggers` for the trading player. The "check for all active players after event fire" wiring happens in Task 18 after sessions exist — for now, only wire the per-trade trigger.

- [ ] **Step 5: Test concept unlocking**

1. Execute 1 buy + 1 sell → "Buying and Selling Basics" should unlock
2. Buy stocks in 4 sectors → "Diversification" should unlock

- [ ] **Step 6: Commit**

```bash
git add convex/vault.ts src/app/\(app\)/vault/ src/components/vault/ && git commit -m "feat: Knowledge Vault — hybrid concept unlocking, behavior + event triggers"
```

---

### Task 18: Curriculum debt queue

**Files:**
- Create: `convex/curriculumDebt.ts`
- Create: `convex/sessions.ts`
- Create: `src/lib/hooks/use-session.ts`

- [ ] **Step 1: Create session management**

Create `convex/sessions.ts`:
- `startSession` — mutation: create session record, record starting portfolio value
- `endSession` — mutation: mark session ended, record final portfolio value, trigger debrief
- `getActiveSession` — query active session for player

- [ ] **Step 2: Create curriculum debt management**

Create `convex/curriculumDebt.ts`:
- `updateDebt` — mutation: compare player's vault against all 23 concepts, store missing concept IDs
- `getDebt` — query: return missing concepts for player
- Called at session end (after endSession)
- Used by fictional event generator to weight concept-targeted events

- [ ] **Step 3: Create session hook**

Create `src/lib/hooks/use-session.ts`:
- Tracks session state (active/inactive)
- Counts events experienced in current session
- Triggers portfolio coaching every 3 events
- Handles session start/end

- [ ] **Step 4: Commit**

```bash
git add convex/curriculumDebt.ts convex/sessions.ts src/lib/hooks/use-session.ts && git commit -m "feat: session management + curriculum debt queue"
```

---

## Phase 3 — Real News Pipeline (Day 4)

### Task 19: Firecrawl scraping

**Files:**
- Create: `convex/news/firecrawl.ts`
- Create: `convex/articles.ts`

- [ ] **Step 1: Install Firecrawl**

```bash
pnpm add @mendable/firecrawl-js
```

- [ ] **Step 2: Create articles table queries**

Create `convex/articles.ts`:
- `getByUrlHash` — check if article already exists (dedup)
- `insertArticle` — insert new article
- `getUnprocessed` — get articles not yet converted to events

- [ ] **Step 3: Create Firecrawl scraper action**

Create `convex/news/firecrawl.ts` — Convex action:
1. For each of 12 publications: scrape latest articles via Firecrawl
2. Generate URL hash for each article
3. Check against articles table — skip duplicates
4. Insert new articles
5. For each new article: call Groq classification

- [ ] **Step 4: Add Firecrawl cron**

Update `convex/crons.ts` — add 15-minute interval for Firecrawl scraping.

- [ ] **Step 5: Commit**

```bash
git add convex/news/firecrawl.ts convex/articles.ts && git commit -m "feat: Firecrawl scraping — 12 publications every 15 minutes"
```

---

### Task 20: Groq article classification

**Files:**
- Create: `convex/groq/classifyArticle.ts`

- [ ] **Step 1: Create article classifier**

Create `convex/groq/classifyArticle.ts` — Convex action:
1. Takes article title + summary
2. Calls Groq `llama-3.3-70b-versatile` with:
   - Classify significance 1-10
   - Identify affected tickers (from our 36)
   - Identify concept taught
   - Generate headline
   - `response_format: { type: 'json_object' }`
   - `temperature: 0.5`
3. If significance ≥ 6: create event in events table from this article
4. Update article record: `processedAsEvent: true`

- [ ] **Step 2: Wire into Firecrawl pipeline**

After Firecrawl inserts new articles, automatically classify each one.

- [ ] **Step 3: Commit**

```bash
git add convex/groq/classifyArticle.ts && git commit -m "feat: Groq article classification — significance scoring, ticker mapping"
```

---

### Task 21: Exa + Tavily news layers

**Files:**
- Create: `convex/news/exa.ts`
- Create: `convex/news/tavily.ts`
- Create: `convex/news/scheduler.ts`

- [ ] **Step 1: Install Exa + Tavily SDKs**

```bash
pnpm add exa-js tavily
```

- [ ] **Step 2: Create Exa discovery action**

Create `convex/news/exa.ts` — Convex action:
1. Six cultural queries for Black business news
2. Neural search via Exa API
3. Dedup against articles table
4. Insert new articles → classify via Groq

- [ ] **Step 3: Create Tavily fallback action**

Create `convex/news/tavily.ts` — Convex action:
1. Triggers when Firecrawl + Exa yield <3 articles in 30 min
2. Search + summary via Tavily
3. Dedup, insert, classify

- [ ] **Step 4: Create news scheduler**

Create `convex/news/scheduler.ts` — orchestrates the 3-layer pipeline:
1. Firecrawl every 15 min
2. Exa every 30 min
3. Check article count after each run — if <3 in 30 min, trigger Tavily

- [ ] **Step 5: Update crons**

Update `convex/crons.ts` — add Exa (30 min) and news scheduler crons.

- [ ] **Step 6: Test full pipeline**

Verify: Firecrawl scrapes → Groq classifies → significant articles become events → events fire via scheduler → Market Alert appears.

- [ ] **Step 7: Commit**

```bash
git add convex/news/ && git commit -m "feat: 3-layer news pipeline — Firecrawl + Exa + Tavily with Groq classification"
```

---

## Phase 4 — Polish + Pages (Day 5)

### Task 22: Claude session debrief

**Files:**
- Create: `convex/claude/generateDebrief.ts`
- Create: `src/components/education/session-debrief.tsx`

- [ ] **Step 1: Create debrief generator**

Create `convex/claude/generateDebrief.ts` — Convex action:
1. Fetch: session data, all trades in session, events experienced, vault progress, portfolio state
2. Call Claude Sonnet with full session context
3. Generate 400-word personalized narrative:
   - What player did well
   - What cost them money and why
   - 3 concepts experienced this session
   - Leaderboard position
   - One focus for next session
4. Store debrief in session record

- [ ] **Step 2: Create debrief component**

Create `src/components/education/session-debrief.tsx` — full-screen debrief view. Neobrutalism Card. Shows narrative text. Session stats summary at top.

- [ ] **Step 3: Wire into session end flow**

When `endSession` is called, trigger debrief generation. Show debrief component.

- [ ] **Step 4: Commit**

```bash
git add convex/claude/generateDebrief.ts src/components/education/session-debrief.tsx && git commit -m "feat: Claude session debrief — 400-word personalized narrative"
```

---

### Task 23: Leaderboards

**Files:**
- Create: `convex/leaderboards.ts`
- Create: `src/app/(app)/profile/page.tsx`
- Create: `src/components/leaderboard/leaderboard-tabs.tsx`
- Create: `src/components/leaderboard/board-table.tsx`

- [ ] **Step 1: Create leaderboard queries + mutations**

Create `convex/leaderboards.ts`:
- `updateScore` — mutation: upsert player's score on a board for current period
- `getBoard` — query: top 50 players for a board + period, sorted by score descending
- `getPlayerRank` — query: player's rank on each board
- Period calculation: weekly for portfolio/diversification, seasonal for vault/blueprint

- [ ] **Step 2: Create leaderboard components**

- `leaderboard-tabs.tsx` — neobrutalism Tabs for 5 boards
- `board-table.tsx` — neobrutalism Table showing rank, player name, score. Highlight current player. Bar Chart - Horizontal for visual.

- [ ] **Step 3: Create profile page**

Create `src/app/(app)/profile/page.tsx`:
- Player info (from Clerk)
- Leaderboard tabs with all 5 boards
- Season info + streak

- [ ] **Step 4: Wire leaderboard updates**

After each trade: update portfolio-value and diversification boards.
After each concept unlock: update knowledge-vault board.
After each event: update biggest-mover board.

- [ ] **Step 5: Commit**

```bash
git add convex/leaderboards.ts src/app/\(app\)/profile/ src/components/leaderboard/ && git commit -m "feat: 5 leaderboards — portfolio, vault, diversification, mover, blueprint"
```

---

### Task 24: Landing page

**Files:**
- Create: `src/app/(landing)/page.tsx`
- Create: `src/app/(landing)/layout.tsx`
- Create: `src/components/landing/hero-section.tsx`
- Create: `src/components/landing/problem-section.tsx`
- Create: `src/components/landing/how-it-works.tsx`
- Create: `src/components/landing/sectors-scroll.tsx`
- Create: `src/components/landing/ai-section.tsx`
- Create: `src/components/landing/demo-video.tsx`
- Create: `src/components/landing/curriculum-preview.tsx`
- Create: `src/components/landing/cta-section.tsx`
- Create: `src/components/layout/marketing-nav.tsx`

- [ ] **Step 1: Create marketing nav**

Create `src/components/layout/marketing-nav.tsx`:
- Logo: "BLK EXCHANGE" in Courier New
- Links: Market, How It Works, The AI, For Judges
- CTA button: "Start Trading" → Clerk sign-up
- Mobile: hamburger menu

- [ ] **Step 2: Create landing layout**

Create `src/app/(landing)/layout.tsx` — marketing nav + footer, no app sidebar/tabs.

- [ ] **Step 3: Create hero section**

Create `src/components/landing/hero-section.tsx`:
- Marquee ticker tape at top (hardcoded sample sector data — NOT live Convex queries, since landing page is public/unauthenticated. Deliberate design decision.)
- Mocked ticker table rows animating behind at 40% opacity
- Headline: "LEARN TO INVEST. TRADE THE CULTURE."
- Subhead: "Trade 36 Black-economy companies. Real cultural news moves the market. AI teaches you why."
- Two CTAs: "START TRADING" + "Watch Demo ↓"

- [ ] **Step 4: Create remaining sections**

Build each section component per the design doc:
- `problem-section.tsx` — the financial literacy gap
- `how-it-works.tsx` — 3 neobrutalism Cards (Trade, Learn, Compete)
- `sectors-scroll.tsx` — horizontal scroll of 12 sector cards
- `ai-section.tsx` — Groq + Claude + ElevenLabs roles
- `demo-video.tsx` — embedded video placeholder
- `curriculum-preview.tsx` — vault progress preview with tier breakdown
- `cta-section.tsx` — final CTA with "READY TO TRADE THE CULTURE?"

- [ ] **Step 5: Assemble landing page**

Create `src/app/(landing)/page.tsx` — compose all sections in order.

- [ ] **Step 6: Verify mobile + desktop**

Test at 375px and 1024px — all sections responsive, marquee scrolls, sectors horizontal scroll works.

- [ ] **Step 7: Commit**

```bash
git add src/app/\(landing\)/ src/components/landing/ src/components/layout/marketing-nav.tsx && git commit -m "feat: landing page — hero with marquee, 7 marketing sections"
```

---

### Task 25: Pitch page for judges

**Files:**
- Create: `src/app/(landing)/judges/page.tsx`
- Create: `src/components/judges/criterion-section.tsx`
- Create: `src/components/judges/criteria-nav.tsx`

- [ ] **Step 1: Create criterion section component**

Create `src/components/judges/criterion-section.tsx` — reusable block:
- Criterion name + score (e.g., "RELEVANCY 5/5")
- Bullet points of evidence
- Anchor ID for jump links
- Neobrutalism Card with primary border

- [ ] **Step 2: Create criteria nav**

Create `src/components/judges/criteria-nav.tsx`:
- Desktop: horizontal anchor links below hero
- Mobile: sticky horizontal scroll bar at top
- Links: Relevancy, Technical, Presentation, Impact, Innovation

- [ ] **Step 3: Create pitch page**

Create `src/app/(landing)/judges/page.tsx`:
- Hero: "FOR HACKENOMICS JUDGES" + subtitle + criteria nav
- Narrative intro: 2-3 paragraphs (problem, insight, solution)
- 5 criterion sections with content from design doc Section 14
- CTA: "TRY BLK EXCHANGE" + "WATCH THE DEMO"

- [ ] **Step 4: Verify mobile + desktop**

Test at 375px — sticky criteria nav scrolls horizontally. Test at 1024px — full-width sections.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(landing\)/judges/ src/components/judges/ && git commit -m "feat: pitch page — 5 judging criteria with anchor nav"
```

---

### Task 26: Shareable vault cards

**Files:**
- Modify: `src/components/vault/concept-card.tsx`

- [ ] **Step 1: Add share functionality**

Update `src/components/vault/concept-card.tsx`:
- "Share" button generates a shareable card image (or URL with OG tags)
- Card shows: concept name, portfolio P&L when learned, one-line insight
- Uses Web Share API on mobile, copy-to-clipboard on desktop

- [ ] **Step 2: Create OG image route (optional)**

```bash
pnpm add @vercel/og
```

Create `src/app/api/og/[conceptId]/route.tsx` — generates OG image for shared vault cards using `@vercel/og`.

- [ ] **Step 3: Commit**

```bash
git add src/components/vault/concept-card.tsx && git commit -m "feat: shareable vault cards — social sharing format"
```

---

## Phase 5 — Demo + Deploy (Day 5 Evening)

### Task 27: Performance audit

- [ ] **Step 1: Audit Convex subscriptions**

Verify each `useQuery` is scoped correctly — no over-fetching. Ensure ticker table doesn't re-render all 36 rows when one price changes (use individual row subscriptions or memo).

- [ ] **Step 2: Audit bundle size**

```bash
pnpm build
```

Check for large imports. Ensure Recharts is only imported in chart components (dynamic import if needed).

- [ ] **Step 3: Mobile responsiveness pass**

Check every page at 375px:
- Market dashboard: ticker table compact, news below
- Ticker detail: chart, sticky buy/sell
- Portfolio: donut compact, holdings stacked
- Vault: tier bars, cards stacked
- Landing page: all sections stack, hero readable
- Pitch page: criteria nav scrolls

- [ ] **Step 4: Commit any fixes**

```bash
git add -A && git commit -m "perf: audit — scoped subscriptions, bundle optimization, mobile fixes"
```

---

### Task 28: Deploy

- [ ] **Step 1: Set Convex environment variables**

```bash
pnpm dlx convex env set GROQ_API_KEY <key>
pnpm dlx convex env set ANTHROPIC_API_KEY <key>
pnpm dlx convex env set ELEVENLABS_API_KEY <key>
pnpm dlx convex env set FIRECRAWL_API_KEY <key>
pnpm dlx convex env set EXA_API_KEY <key>
pnpm dlx convex env set TAVILY_API_KEY <key>
```

- [ ] **Step 2: Deploy Convex to production**

```bash
pnpm dlx convex deploy
```

- [ ] **Step 3: Deploy to Vercel**

```bash
pnpm dlx vercel --prod
```

Set Vercel environment variables: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.

- [ ] **Step 4: Verify production**

Open production URL. Test: sign up, see 36 tickers, execute a trade, see Market Alert fire, check vault.

- [ ] **Step 5: Run seed on production**

```bash
pnpm dlx convex run seed:seedDatabase --prod
```

- [ ] **Step 6: Commit deploy config**

```bash
git add -A && git commit -m "chore: deploy config — Vercel + Convex production"
```

---

### Task 29: Demo run-through

- [ ] **Step 1: Walk through 90-second demo script**

1. Open dashboard — verify 36 tickers, marquee, neobrutalism dark mode
2. Wait for Groq event — "BLK Exchange News Desk: CROWN Q3 earnings miss"
3. Watch prices move — CROWN down, GLOW up
4. Market Alert slides in — ElevenLabs reads it
5. Check vault — concept unlocks if behavior trigger met
6. Execute trade — buy GLOW, portfolio goes green
7. Portfolio Coach — Claude grades diversification
8. Session debrief — Claude narrative

- [ ] **Step 2: Fix any demo flow issues**

Address any timing, display, or flow issues found during run-through.

- [ ] **Step 3: Final commit**

```bash
git add -A && git commit -m "chore: final demo polish"
git push origin main
```

---

## Summary

| Phase | Tasks | Day |
|---|---|---|
| Phase 1: Static Trading Floor | Tasks 1-10 | Day 1 |
| Phase 2: AI Engines | Tasks 11-18 | Days 2-3 |
| Phase 3: Real News Pipeline | Tasks 19-21 | Day 4 |
| Phase 4: Polish + Pages | Tasks 22-26 | Day 5 |
| Phase 5: Demo + Deploy | Tasks 27-29 | Day 5 evening |

**Total: 29 tasks, 5 days, March 30 deadline.**
