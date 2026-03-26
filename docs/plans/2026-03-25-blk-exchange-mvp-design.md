# BLK Exchange — MVP Design (Hackenomics 2026)

**Date:** March 25, 2026
**Deadline:** March 30, 2026
**Author:** Tarik Moody + Claude

---

## 1. What we're building

A real-time cultural stock market simulator where players trade 36 fictional Black-economy companies whose prices are driven by real cultural news and AI-generated fictional events. Claude and Groq teach 23 investing concepts through gameplay — not lectures.

**Target:** Hackenomics 2026 — spread awareness about financial literacy and economics in the community.

---

## 2. What changed from the original spec

| Decision | Original | MVP |
|---|---|---|
| Classroom mode | Full teacher dashboard, Clerk Orgs, student grid | **Cut entirely** — solo + leaderboard only |
| Decision window | 60-second countdown timer, price locking | **Soft window** — prices move immediately on event fire, no timer, no lock. Rewards preparation over speed. |
| TTS scope | Market Alerts + coaching summaries + debrief narration | **Market Alerts only** — one ElevenLabs integration point |
| Concept unlocking | Event-driven (implied) | **Portfolio behavior where possible, event exposure fallback** — ~15 behavior-driven, ~8 event-driven |
| News pipeline | Firecrawl + Exa + Tavily | **Keep full 3-layer pipeline** |
| Ticker count | 36 | **Keep 36** |
| UX reference | Neobrutalism dark mode | **Yahoo Finance layout + neobrutalism dark mode styling** |

---

## 3. UX architecture — Yahoo Finance meets neobrutalism

The layout follows Yahoo Finance's information density and navigation patterns. The styling is neobrutalism dark mode: `#0e0e0e` background, white borders, offset box-shadows, Courier New monospace, hard corners everywhere.

**Mobile-first.** The primary audience is on phones. Every screen is designed at 375px first, then expanded for desktop. The mobile experience is not a degraded desktop — it's the primary product.

### 3.0 Responsive strategy

| Breakpoint | Layout |
|---|---|
| 375px–767px (mobile) | Single column. Bottom tab nav. Stacked sections. Ticker table is the hero. |
| 768px–1023px (tablet) | Two-column where useful. Side-by-side ticker + news. |
| 1024px+ (desktop) | Full Yahoo Finance density. Ticker table + news rail + portfolio sidebar. |

**Mobile navigation:** Bottom tab bar with 4 tabs — Market, Portfolio, Vault, Profile. News feed is inline on the Market tab (scrolls below ticker table). Leaderboards accessible from Profile.

### 3.1 Main market dashboard (Yahoo Finance "Markets" page)

**Desktop (1024px+):**
```
+------------------------------------------------------------------+
| BLK EXCHANGE          [BLK Index: $52.47 +1.2%]    [Portfolio] [Vault] [Boards] [Profile] |
+------------------------------------------------------------------+
| SECTOR BAR — 12 sectors, horizontal scroll, each shows sector    |
| name + daily % change. Tap to filter ticker table below.         |
+------------------------------------------------------------------+
|                                    |                              |
|  TICKER TABLE                      |  NEWS FEED                   |
|  (Yahoo Finance "Most Active"      |  (Yahoo Finance right rail)  |
|   layout)                          |                              |
|                                    |  Real headlines:             |
|  SYM  NAME        PRICE  CHG  %   |  "via AfroTech"              |
|  ──── ─────────── ────── ──── ──  |  "via Essence"               |
|  LOUD Podcast Net  $42   +1.2 +2% |                              |
|  VIZN Streaming    $78   -3.1 -4% |  Fictional headlines:        |
|  KICK Footwear    $112   +5.0 +4% |  "BLK Exchange News Desk"    |
|  ...36 rows, sortable all cols    |                              |
|                                    |  Each headline shows:        |
|  Sparkline per row (7-day)         |  - Headline text             |
|                                    |  - Affected tickers + %      |
|                                    |  - Concept taught            |
|                                    |  - Timestamp                 |
+------------------------------------------------------------------+
```

**Mobile (375px):**
```
+--------------------------------+
| BLK EXCHANGE                   |
| BLK Index: $52.47  +1.2%      |
+--------------------------------+
| MARQUEE TICKER TAPE            |
| ▲Media +2% ▼Music -1% ▲Fin.. |
+--------------------------------+
| TICKER TABLE (compact)         |
|                                |
| LOUD   $42.00        +2.8%  ▲ |
| ░░░░░░░░░ sparkline           |
| VIZN   $78.00        -3.9%  ▼ |
| ░░░░░░░░░ sparkline           |
| KICKS  $112.00       +4.5%  ▲ |
| ░░░░░░░░░ sparkline           |
| ...tap any row to open detail  |
+--------------------------------+
| NEWS FEED (scrolls below)      |
|                                |
| via AfroTech • 12m ago         |
| "STAX launches new payments    |
|  partnership with major bank"  |
| STAX +6%  VAULT +2%           |
|                                |
| BLK Exchange News Desk • 28m  |
| "CROWN Q3 earnings miss..."   |
| CROWN -11%  GLOW +4%          |
+--------------------------------+
| [Market] [Portfolio] [Vault] [Me] |
+--------------------------------+
```

Mobile ticker table shows: symbol, price, % change, mini sparkline. Company name hidden to save space — visible on tap (detail panel). Rows are taller with more tap target area (44px minimum).

### 3.2 Ticker detail panel (Yahoo Finance stock page)

On desktop: slides in from right as a panel. On mobile: full-screen page push (like tapping a stock in Robinhood or Yahoo Finance app).

**Desktop:**
```
+------------------------------------------------------------------+
| ← Back to Market                                                  |
|                                                                    |
| CROWN — Natural Hair Care Brand         Beauty & Wellness Sector   |
| $47.00  +$2.10 (+4.68%)                                          |
|                                                                    |
| [30-day area chart — interactive, neobrutalism styled]             |
|                                                                    |
| Company Profile          | Recent Events                          |
| Natural hair care brand  | "CROWN Q3 earnings beat..." (2h ago)  |
| Revenue: Growing         | "New product line..." (1d ago)         |
| Position: Leader         | "Partnership with..." (3d ago)         |
| Rivals: GLOW, SHEEN      |                                        |
|                                                                    |
| [  BUY  ]  [  SELL  ]   | Your Position: 50 shares ($2,350)      |
|  Enter $ amount          | P&L: +$150 (+6.8%)                     |
+------------------------------------------------------------------+
```

**Mobile:**
```
+--------------------------------+
| ← Market          Beauty      |
+--------------------------------+
| CROWN                          |
| Natural Hair Care Brand        |
| $47.00  +$2.10 (+4.68%)      |
+--------------------------------+
| [30-day area chart]            |
| ░░░░░░▓▓▓▓░░░░▓▓▓▓▓▓▓▓░░    |
| [1D] [1W] [1M] [ALL]          |
+--------------------------------+
| YOUR POSITION                  |
| 50 shares • $2,350 • +$150    |
+--------------------------------+
| COMPANY PROFILE                |
| Revenue: Growing               |
| Position: Leader               |
| Rivals: GLOW, SHEEN            |
+--------------------------------+
| RECENT EVENTS                  |
| "Q3 earnings beat..." (2h)    |
| "New product line..." (1d)    |
+--------------------------------+
| [    BUY    ] [    SELL    ]  |
+--------------------------------+
```

Buy/sell buttons are sticky at bottom on mobile — always visible, thumb-reachable. Trade modal slides up as a bottom sheet.

### 3.3 Portfolio view (Yahoo Finance "My Portfolio")

**Desktop:**
```
+------------------------------------------------------------------+
| MY PORTFOLIO                                                       |
|                                                                    |
| Total Value: $11,240    Day: +$340 (+3.1%)    Cash: $4,200        |
|                                                                    |
| [Allocation donut chart — sectors color-coded]                     |
|                                                                    |
| HOLDINGS TABLE                                                     |
| SYM   SHARES  AVG COST  CURRENT  P&L      %ALLOC                 |
| CROWN  50     $44.00    $47.00   +$150    21%                     |
| KICKS  20     $108.00   $112.00  +$80     20%                     |
| VAULT  40     $50.00    $52.00   +$80     19%                     |
| ...                                                                |
|                                                                    |
| Diversification Score: 72/100                                      |
| "Good sector spread. Consider adding Media exposure." — Claude     |
+------------------------------------------------------------------+
```

**Mobile:**
```
+--------------------------------+
| MY PORTFOLIO                   |
+--------------------------------+
| $11,240                        |
| +$340 (+3.1%) today           |
| Cash: $4,200                   |
+--------------------------------+
| [Donut chart — compact]        |
| Diversification: 72/100        |
+--------------------------------+
| HOLDINGS                       |
|                                |
| CROWN        $2,350    +$150  |
|  50 shares    21%       +6.8% |
|                                |
| KICKS        $2,240    +$80   |
|  20 shares    20%       +3.7% |
|                                |
| VAULT        $2,080    +$80   |
|  40 shares    19%       +4.0% |
+--------------------------------+
| Claude's Take:                 |
| "Good sector spread. Consider  |
|  adding Media exposure."       |
+--------------------------------+
| [Market] [Portfolio] [Vault] [Me] |
+--------------------------------+
```

Mobile holdings show: symbol, total value, P&L in dollars + percentage. Tap any holding to jump to ticker detail with BUY/SELL.

### 3.4 Market Alert overlay

Desktop: slides in from the right. Mobile: slides up from the bottom as a sheet (like a push notification expanding). ElevenLabs auto-reads it. Tap outside or swipe down to dismiss.

**Desktop:**
```
+--------------------------------------+
| MARKET ALERT                    [×]  |
|                                      |
| BLK Exchange News Desk               |
| "CROWN announces Q3 earnings         |
|  miss — competitive pressure          |
|  from new entrant"                    |
|                                      |
| CROWN  -11%  |  GLOW  +4%           |
| SHEEN  -3%   |  RARE  +2%           |
|                                      |
| "CROWN lost market share to a        |
|  competitor. That's competitive       |
|  displacement — when one company's   |
|  loss directly benefits rivals."      |
|                                      |
| Concept: Competitive Displacement     |
+--------------------------------------+
```

**Mobile:**
```
+--------------------------------+
| ─── (drag handle)              |
| MARKET ALERT                   |
+--------------------------------+
| BLK Exchange News Desk         |
|                                |
| "CROWN announces Q3 earnings   |
|  miss — competitive pressure   |
|  from new entrant"             |
+--------------------------------+
| CROWN  -11%    GLOW   +4%     |
| SHEEN  -3%     RARE   +2%     |
+--------------------------------+
| "CROWN lost market share to a  |
|  competitor. That's competitive |
|  displacement — when one        |
|  company's loss directly        |
|  benefits rivals."              |
|                                |
| Concept: Competitive           |
|          Displacement          |
+--------------------------------+
```

Mobile alert covers bottom ~60% of screen. Ticker table still visible behind it at top — player can see prices changing in real time while reading the alert.

### 3.5 Knowledge Vault

**Desktop:**
```
+------------------------------------------------------------------+
| KNOWLEDGE VAULT                    8 of 23 concepts unlocked       |
| [████████░░░░░░░░░░░░░░░]                                         |
|                                                                    |
| FOUNDATION ✓✓✓✓✓     INTERMEDIATE ✓✓✓░░░░░                       |
| ADVANCED ░░░░░░░      ECONOMICS ░░░                               |
|                                                                    |
| [Unlocked cards — tap to expand]                                   |
|                                                                    |
| ┌─────────────────────────────┐                                   |
| │ COMPETITIVE DISPLACEMENT    │                                   |
| │                             │                                   |
| │ When one company's loss     │                                   |
| │ directly benefits its       │                                   |
| │ rivals in the same sector.  │                                   |
| │                             │                                   |
| │ You learned this when:      │                                   |
| │ CROWN dropped 11% and GLOW │                                   |
| │ gained 4% on the same day. │                                   |
| │                             │                                   |
| │ Real world: When Nike stumbles,│                                |
| │ Adidas and New Balance gain. │                                  |
| │                             │                                   |
| │ [Share this concept]        │                                   |
| └─────────────────────────────┘                                   |
|                                                                    |
| [Locked cards — greyed out, name hidden]                           |
+------------------------------------------------------------------+
```

**Mobile:**
```
+--------------------------------+
| KNOWLEDGE VAULT                |
| 8 of 23 concepts               |
| [████████░░░░░░░░░░░░░░░]      |
+--------------------------------+
| FOUNDATION         5/5  ████  |
| INTERMEDIATE       3/8  ███░  |
| ADVANCED           0/7  ░░░░  |
| ECONOMICS          0/3  ░░░░  |
+--------------------------------+
| UNLOCKED                       |
|                                |
| ┌────────────────────────────┐ |
| │ COMPETITIVE DISPLACEMENT   │ |
| │                            │ |
| │ When one company's loss    │ |
| │ directly benefits its      │ |
| │ rivals in the same sector. │ |
| │                            │ |
| │ You learned this when:     │ |
| │ CROWN -11%, GLOW +4%      │ |
| │                            │ |
| │ Real world: When Nike      │ |
| │ stumbles, Adidas gains.    │ |
| │                            │ |
| │ [Share]                    │ |
| └────────────────────────────┘ |
|                                |
| ┌────────────────────────────┐ |
| │ ░░░░░░░░░░ LOCKED ░░░░░░░ │ |
| └────────────────────────────┘ |
+--------------------------------+
| [Market] [Portfolio] [Vault] [Me] |
+--------------------------------+
```

Cards stack vertically on mobile — one per row, full width. Tier progress bars at top give instant overview. Locked cards show as greyed-out placeholders to create anticipation.

---

## 4. Core architecture

### 4.1 Tech stack (unchanged)

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Backend / DB / Realtime | Convex |
| Auth | Clerk (individual accounts only — no Orgs) |
| Deep reasoning | Claude Sonnet 4.6 — portfolio coaching, professor mode, debrief |
| Fast structured output | Groq llama-3.3-70b-versatile — event generation, news classification |
| Fast commentary | Groq llama-3.1-8b-instant — 2-sentence event explanations |
| TTS | ElevenLabs — Market Alerts only, eleven_flash_v2_5, voice 'Charlie' |
| Scraping | Firecrawl — 12 publications every 15 min |
| Semantic discovery | Exa — every 30 min |
| Search fallback | Tavily — when layers 1+2 yield <3 articles in 30 min |
| Styling | Tailwind + neobrutalism.dev shadcn/ui overrides |
| Charts | Recharts via neobrutalism.dev chart.json — all variants included |

### Chart component mapping

| UI element | Neobrutalism chart | Notes |
|---|---|---|
| Ticker table sparklines | Line Chart (minimal, no axes/labels) | 7-day trend, compact row height |
| Ticker detail price history | Area Chart - Interactive | 30-day, hover for price, time range tabs [1D/1W/1M/ALL] |
| Portfolio allocation donut | Pie Chart - Donut with Text | Center shows total value, segments are sectors |
| Sector performance bar | Bar Chart - Negative | +/- daily % per sector, green/red coloring |
| Leaderboard rankings | Bar Chart - Horizontal | Ranked players with value bars |

### Marquee ticker tape

The sector bar at the top of every screen uses the neobrutalism Marquee component — a continuous scrolling ticker showing all 12 sectors + BLK Index with real-time % changes. Looks like the stock ticker on CNBC / top of Yahoo Finance.

```
| ▲ Media +2.1%  ▼ Music -0.8%  ▲ Sportswear +3.4%  ▼ Beauty -1.2%  ▲ Finance +1.7% ... (scrolling) |
```

On mobile, the marquee replaces the static sector bar — it's more space-efficient and adds motion to the dashboard.

### Complete neobrutalism component inventory

All components from neobrutalism.dev — bold 2px borders, hard corners, offset box-shadows, high contrast hover states.

| Component | Install URL | Used for |
|---|---|---|
| Chart | `neobrutalism.dev/r/chart.json` | All charts (sparklines, area, donut, bar) — Recharts-based |
| Marquee | `neobrutalism.dev/r/marquee.json` | Sector ticker tape at top of every screen |
| Sidebar | `neobrutalism.dev/r/sidebar.json` | Desktop: collapsible portfolio/news sidebar. Mobile: off-canvas drawer |
| Table | `neobrutalism.dev/r/table.json` | Ticker table (36 rows), holdings table, leaderboard tables |
| Tabs | `neobrutalism.dev/r/tabs.json` | Ticker detail time ranges [1D/1W/1M/ALL], vault tier tabs, leaderboard tabs |
| Button | `neobrutalism.dev/r/button.json` | BUY/SELL, navigation, share actions |
| Card | `neobrutalism.dev/r/card.json` | Knowledge Vault concept cards, Market Alert, portfolio summary |
| Badge | `neobrutalism.dev/r/badge.json` | Sector tags, concept tier labels, +/- % indicators |
| Input | `neobrutalism.dev/r/input.json` | Trade amount input, professor mode question input |
| Dialog | `neobrutalism.dev/r/dialog.json` | Trade confirmation modal, professor mode Q&A panel |
| Progress | `neobrutalism.dev/r/progress.json` | Knowledge Vault progress bar (X of 23 concepts) |

**Sidebar behavior:**
- Desktop: fixed sidebar with portfolio summary + news feed, collapsible to icon-only mode (Ctrl+B)
- Mobile: off-canvas drawer, triggered by hamburger or swipe — contains portfolio summary
- The sidebar replaces the separate "portfolio sidebar" from the original wireframes — it IS the portfolio view on desktop

Install all at once:
```bash
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

| Deployment | Vercel + Convex Cloud |

### 4.2 AI model responsibilities

| Task | Model | Why this model |
|---|---|---|
| Fictional event generation | Groq 70b | Structured JSON, 10+ events/session, speed matters |
| Real news classification | Groq 70b | Same JSON pattern, high frequency, consistency |
| Market commentary | Groq 8b | 2 sentences, <400ms, cheapest |
| Portfolio coaching | Claude Sonnet | Genuine reasoning about player's actual holdings |
| Professor mode Q&A | Claude Sonnet | Open-ended questions need depth |
| Session debrief | Claude Sonnet | 400-word personalized narrative, most complex output |
| TTS — Market Alerts | ElevenLabs Flash | Low latency, auto-plays on event fire |

### 4.3 Data flow

```
Real news pipeline:
  Firecrawl (15 min) → Groq classifies → score 6+ → event queue
  Exa (30 min) → Groq classifies → score 6+ → event queue
  Tavily (fallback) → Groq classifies → score 6+ → event queue

Fictional news engine:
  Convex scheduler → reads 36 company states → Groq generates event → event queue

Event queue:
  Max 2 events per 10-min window
  Event fires → prices update → Market Alert + TTS → concept check

Education layer:
  Every 3 events → Claude grades portfolio → coaching recommendation
  Player taps anything → Claude professor mode (actual holdings as context)
  Session end → Claude debrief (400 words) → vault check → curriculum debt update
```

---

## 5. Concept unlocking — hybrid system

### 5.1 Portfolio behavior-driven (~15 concepts)

These unlock when the player's portfolio STATE demonstrates the concept:

**Foundation:**
| Concept | Trigger |
|---|---|
| Supply and demand | Held a stock that rose 5%+ after a positive event |
| Bull and bear markets | Portfolio experienced both a +5% day and a -5% day |
| Buying and selling basics | Executed at least 1 buy AND 1 sell |
| Profit and loss | Closed a position (sold something you held) |
| Portfolio value and net worth | Portfolio value differs from $10,000 by 10%+ |

**Intermediate:**
| Concept | Trigger |
|---|---|
| Diversification | Hold positions in 4+ different sectors |
| Sector correlation | Hold 2+ stocks in the same sector when a sector event fires |
| Emotional vs disciplined investing | Made a trade within 30 seconds of an event AND that trade lost money |
| Consumer spending power | Held a consumer sector stock (Beauty, Fashion, Sportswear) during a spending event |
| Competitive displacement | Held a stock that dropped while a same-sector rival rose on the same event |
| Halo effect and brand association | Held a stock that rose due to a partnership/celebrity event |

**Advanced:**
| Concept | Trigger |
|---|---|
| Dollar cost averaging | Bought the same stock 3+ separate times at different prices |
| Portfolio rebalancing | Sold a position that was >30% of portfolio to buy a different sector |
| Risk-adjusted return | Portfolio is profitable AND diversification score is 60+ |

**Economics:**
| Concept | Trigger |
|---|---|
| Community economics: the Black dollar | Hold 5+ stocks across 3+ sectors simultaneously (investing broadly in the Black economy) |

### 5.2 Event exposure-driven (~8 concepts)

These unlock when the player is active during a session where the event fires:

| Concept | Why event-driven |
|---|---|
| Economic multiplier effect | Hard to demonstrate via portfolio — concept is about ripple effects |
| Dividend investing | No dividend mechanic in v1 — taught via event narrative |
| Price-to-earnings ratio | No P/E data in v1 — taught via earnings event narrative |
| Economic moat | Abstract concept — taught when Groq generates a moat-related event |
| Acquisition economics | No M&A mechanic — taught via fictional acquisition event |
| Venture capital and dilution | No equity mechanic — taught via fictional funding round event |
| Macroeconomics: inflation | Macro concept — taught when inflation event fires and BLK Index drops |
| Macroeconomics: consumer confidence | Macro concept — taught when confidence event fires across consumer sectors |

---

## 6. Soft window — how trading works without a timer

### The rhythm

```
Calm period → player studies tickers, reads company profiles, checks news
  ↓
EVENT FIRES → prices move immediately to new levels
  ↓
Market Alert slides in → ElevenLabs reads headline
  ↓
Player decides: trade or hold (no countdown, no pressure)
  ↓
Next event fires in 5-10 minutes (max 2 per 10-min window)
```

### Why this is better

The original 60-second timer rewarded speed. The soft window rewards **preparation**. The player who studied company states and understood sector dynamics before the event fires makes a better decision than the player who just reacts to the headline.

This aligns with the core educational thesis: disciplined investors study before the moment, not during it.

### Trade execution

- All trades are market orders at current price
- No price locking — prices are stable between events and move instantly on event fire
- Fractional shares by dollar amount ($500 into KICKS, not 4.46 shares)
- 25% max position limit enforced at trade time
- Atomic Convex mutation: validate capital → create trade → update holding → update balance

---

## 7. Session structure (revised)

| Time | What happens |
|---|---|
| 0:00 | Market opens. Prices stable. News feed shows recent headlines. |
| 0:30–2:00 | Study phase. Browse tickers, read profiles, check company states. |
| ~2:00 | First event fires. Prices move. Market Alert + TTS. |
| 2:00–5:00 | Player trades or holds. No timer pressure. |
| 5:00–25:00 | Events 2–5 fire, paced at max 2 per 10-min window. After event 3, Claude grades portfolio. |
| 25:00–35:00 | Market winds down. Review portfolio, check leaderboard, browse vault. |
| 35:00–45:00 | Session ends. Claude generates debrief. Leaderboard updates. |

---

## 8. What's cut from MVP

| Feature | Why cut | Post-hackathon? |
|---|---|---|
| Classroom mode | Full sub-product, Clerk Orgs complexity | Yes — strong v2 feature |
| TTS on coaching + debrief | Diminishing returns, triple integration | Yes — easy to add |
| 60-second countdown timer | Rewards speed over preparation | Reconsider based on playtesting |
| Teacher dashboard | Cut with classroom mode | Yes |
| Homework mode | Cut with classroom mode | Yes |
| Teacher annotations | Cut with classroom mode | Yes |

---

## 9. Leaderboards (5, unchanged)

1. **Portfolio Value** — total vs $10,000, resets weekly
2. **Knowledge Vault** — most concepts unlocked, resets per season
3. **Diversification Score** — Claude-graded 0-100, resets weekly
4. **Biggest Mover** — largest single-event gain, resets after major events
5. **The Blueprint Award** — 8-week season championship, composite score

---

## 10. Build phases (revised for 5 days)

### Phase 1 — Static trading floor (Day 1)

- Next.js + Convex + Clerk setup
- Full Convex schema (minus classroom tables)
- Seed 36 tickers with starting prices and company states
- Yahoo Finance-style market dashboard in neobrutalism dark mode
- Trade execution: buy/sell modal, atomic Convex mutation
- Real-time portfolio sidebar

### Phase 2 — AI engines (Days 2-3)

- Groq fictional event generation (reads company states)
- Groq market commentary (8b model)
- Convex event scheduler (max 2 per 10-min window)
- Market Alert component + ElevenLabs TTS (Flash model, alerts only)
- Claude portfolio coaching (fires every 3 events)
- Claude professor mode Q&A
- Knowledge Vault with hybrid unlock system
- Company state system
- Curriculum debt queue

### Phase 3 — Real news pipeline (Day 4)

- Firecrawl scraping 12 publications
- URL hash deduplication
- Groq article classification
- Exa semantic discovery
- Tavily fallback
- News feed with real vs fictional labeling

### Phase 4 — Polish + pages (Day 5)

- Claude session debrief (400-word narrative)
- 5 leaderboards
- Season arc structure
- Shareable vault cards
- Landing page (/) — hero with live marquee + mocked ticker table, 7 sections, CTA
- Pitch page (/judges) — narrative flow + 5 judging criteria sections with anchor links
- Navigation: landing page links to app + pitch page

### Phase 5 — Demo + deploy (Day 5 evening)

- Performance audit
- Mobile responsiveness pass on all screens
- 90-second demo run-through
- Deploy to Vercel
- Final submission

---

## 11. Design system

**UX model:** Yahoo Finance layout — dense ticker table, integrated news feed, familiar stock page drill-down.

**Visual style:** Neobrutalism dark mode via neobrutalism.dev + shadcn/ui.

| Token | Value |
|---|---|
| `--background` | `#0e0e0e` |
| `--card` | `#1a1a1a` |
| `--primary` | `#7F77DD` (brand purple) |
| `--accent` | `#FDE047` (Knowledge Vault only) |
| `--border` | `#ffffff` (all borders white) |
| `--radius` | `0rem` (hard corners, non-negotiable) |
| `--blk-shadow` | `4px 4px 0px 0px #ffffff` |
| `--blk-font` | `'Courier New', monospace` (all typography) |
| Hover | `translate(2px,2px)` + shadow reduces to 2px |

---

## 12. Environment variables

| Variable | Source | Phase |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex dashboard | 1 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard | 1 |
| `CLERK_SECRET_KEY` | Clerk dashboard | 1 |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk JWT template | 1 |
| `ANTHROPIC_API_KEY` | Anthropic console | 2 |
| `GROQ_API_KEY` | console.groq.com | 2 |
| `ELEVENLABS_API_KEY` | elevenlabs.io | 2 |
| `FIRECRAWL_API_KEY` | Firecrawl dashboard | 3 |
| `EXA_API_KEY` | exa.ai | 3 |
| `TAVILY_API_KEY` | tavily.com | 3 |

---

## 13. Landing page — marketing (/)

### Purpose
Convert players. Anyone who lands here should understand what BLK Exchange is and sign up within 30 seconds.

### Hero section
Live market preview behind the headline. The marquee ticker tape scrolls across the top with real sector data. Below it, a mocked snippet of the ticker table (5-6 rows, animated price changes) runs in the background at reduced opacity. The headline and CTA sit on top.

```
+------------------------------------------------------------------+
| ▲ Media +2.1%  ▼ Music -0.8%  ▲ Sportswear +3.4%  ▼ Beauty ... | ← marquee
+------------------------------------------------------------------+
|                                                                    |
|  (mocked ticker table rows animating behind, 40% opacity)          |
|                                                                    |
|        LEARN TO INVEST.                                            |
|        TRADE THE CULTURE.                                          |
|                                                                    |
|        Trade 36 Black-economy companies.                           |
|        Real cultural news moves the market.                        |
|        AI teaches you why.                                         |
|                                                                    |
|        [  START TRADING  ]        [  Watch Demo ↓  ]              |
|                                                                    |
+------------------------------------------------------------------+
```

**Mobile hero:**
```
+--------------------------------+
| ▲Media +2% ▼Music -1% ▲Fin.. | ← marquee
+--------------------------------+
|                                |
| LEARN TO INVEST.               |
| TRADE THE CULTURE.             |
|                                |
| Trade 36 Black-economy         |
| companies. Real cultural news  |
| moves the market. AI teaches   |
| you why.                       |
|                                |
| [    START TRADING    ]        |
| [    Watch Demo ↓     ]        |
+--------------------------------+
```

### Section flow (scroll down)

**Section 1: The Problem**
```
+------------------------------------------------------------------+
| THE PROBLEM                                                        |
|                                                                    |
| Financial literacy platforms are generic, culturally detached,     |
| and boring. The best stock simulators use real tickers and         |
| culturally neutral contexts. A Black teenager learning to invest   |
| never sees the companies and cultural moments they know.           |
|                                                                    |
| Black culture IS an economy. BLK Exchange treats it like one.      |
+------------------------------------------------------------------+
```

**Section 2: How It Works (3 steps)**
```
+------------------------------------------------------------------+
| HOW IT WORKS                                                       |
|                                                                    |
| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               |
| │ 1. TRADE     │ │ 2. LEARN     │ │ 3. COMPETE   │               |
| │              │ │              │ │              │               |
| │ 36 fictional │ │ Every event  │ │ 5 leaderboards│              |
| │ companies    │ │ teaches a    │ │ reward skill, │              |
| │ across 12    │ │ named        │ │ not luck.     │              |
| │ sectors.     │ │ investing    │ │ The Blueprint  │              |
| │ Buy and sell │ │ concept.     │ │ Award crowns   │              |
| │ with $10K    │ │ 23 total.    │ │ the season     │              |
| │ virtual      │ │ AI coaches   │ │ champion.      │              |
| │ capital.     │ │ you through  │ │               │              |
| │              │ │ each one.    │ │               │              |
| └──────────────┘ └──────────────┘ └──────────────┘               |
+------------------------------------------------------------------+
```

Mobile: 3 cards stack vertically, full width.

**Section 3: The 12 Sectors**
Horizontal scroll of 12 sector cards, each showing sector name + 3 ticker symbols + representative icon. Gives a taste of the market universe.

```
+------------------------------------------------------------------+
| THE MARKET — 36 COMPANIES, 12 SECTORS                              |
|                                                                    |
| [Media]  [Streaming]  [Music]  [Gaming]  [Sportswear] ...  →     |
|  LOUD     VIZN         RYTHM    PIXL      KICKS                   |
|  SCROLL   NETFLO       BLOC     MOBILE    FLEX                    |
|  VERSE    LIVE         CRATE    SQUAD     COURT                   |
+------------------------------------------------------------------+
```

Mobile: horizontal scroll with snap, 1.5 cards visible at a time.

**Section 4: The AI**
Split layout — left side shows the three AI roles (Groq for news, Claude for coaching, ElevenLabs for voice), right side shows a mocked Market Alert or coaching snippet.

**Section 5: Demo Video**
Embedded 90-second demo video. Full width. This is where the "Watch Demo" button from the hero scrolls to.

**Section 6: The Curriculum**
Knowledge Vault preview — show the 4 tiers (Foundation, Intermediate, Advanced, Economics) with a few example concept cards. Progress bar showing "0 of 23 concepts."

**Section 7: CTA**
```
+------------------------------------------------------------------+
|                                                                    |
|        READY TO TRADE THE CULTURE?                                 |
|                                                                    |
|        $10,000 virtual capital. 36 companies.                      |
|        23 investing concepts. Free forever.                        |
|                                                                    |
|        [  START TRADING  ]                                         |
|                                                                    |
+------------------------------------------------------------------+
```

### Navigation bar

```
| BLK EXCHANGE     [Market]  [How It Works]  [The AI]  [For Judges]  [Start Trading] |
```

"For Judges" links to the pitch page. "Start Trading" is the Clerk sign-up CTA.

Mobile: hamburger menu with the same links.

---

## 14. Pitch page — for judges (/judges)

### Purpose
Help Hackenomics judges score BLK Exchange. Narrative flow that tells the story AND maps explicitly to the 5 judging criteria with anchor links.

### Structure

**Hero:**
```
+------------------------------------------------------------------+
| FOR HACKENOMICS JUDGES                                             |
|                                                                    |
| BLK Exchange — A Cultural Stock Market Simulator                   |
| Teaching Financial Literacy Through Gameplay                        |
|                                                                    |
| Jump to: [Relevancy] [Technical] [Presentation] [Impact] [Innovation] |
+------------------------------------------------------------------+
```

**Narrative intro (the story):**
2-3 paragraphs. The financial literacy gap. Why existing simulators fail the Black community. The core insight: Black culture IS an economy. Sets up why this product exists before the rubric sections.

**Criterion 1: Relevancy (5/5)**
```
+------------------------------------------------------------------+
| RELEVANCY                                                 5/5      |
|                                                                    |
| Financial literacy and economics IS the product.                   |
|                                                                    |
| • 23-concept curriculum with guaranteed delivery via curriculum    |
|   debt system — no player finishes a season with gaps              |
| • Every game mechanic teaches a named concept                      |
| • Portfolio behavior-driven unlocks — you don't read about         |
|   diversification, your portfolio demonstrates it                  |
| • Concepts: supply/demand, diversification, sector correlation,    |
|   P/E ratio, economic moat, the Black dollar, and 17 more          |
+------------------------------------------------------------------+
```

**Criterion 2: Technical Execution (5/5)**
```
+------------------------------------------------------------------+
| TECHNICAL EXECUTION                                       5/5      |
|                                                                    |
| Dual-AI architecture with real-time market engine.                 |
|                                                                    |
| • Claude Sonnet 4.6 — portfolio coaching, professor mode, debrief |
| • Groq llama-3.3-70b — fictional event generation at 758 tok/sec  |
| • ElevenLabs Flash — voice narration on market alerts              |
| • Convex — real-time database, all 36 tickers update in <500ms    |
| • 3-layer news pipeline: Firecrawl + Exa + Tavily                 |
| • Company state system: Groq reads all 36 states for coherence    |
| • Curriculum debt queue: AI-driven concept delivery guarantee      |
+------------------------------------------------------------------+
```

**Criterion 3: Presentation (5/5)**
```
+------------------------------------------------------------------+
| PRESENTATION                                              5/5      |
|                                                                    |
| Yahoo Finance UX + neobrutalism dark mode.                         |
|                                                                    |
| • Dense, information-rich layout familiar to investors             |
| • Neobrutalism styling: #0e0e0e background, white borders,        |
|   offset box-shadows, Courier New monospace throughout             |
| • Mobile-first — primary audience is on phones                     |
| • Marquee ticker tape, interactive charts, bottom-sheet alerts     |
| • Looks like nothing else in the competition                       |
|                                                                    |
| [Embedded screenshots or live preview]                              |
+------------------------------------------------------------------+
```

**Criterion 4: Impact (5/5)**
```
+------------------------------------------------------------------+
| IMPACT                                                    5/5      |
|                                                                    |
| A genuine community educational tool, not a demo.                  |
|                                                                    |
| • Solo mode free 24/7 — anyone can learn to invest                 |
| • 12 Black media publications credited as news sources             |
| • 36 fictional companies reflect real Black economic archetypes    |
| • Curriculum guarantee: every player learns all 23 concepts        |
| • Season structure keeps players returning for 8 weeks             |
| • Shareable vault cards spread financial literacy peer-to-peer     |
+------------------------------------------------------------------+
```

**Criterion 5: Innovation (5/5)**
```
+------------------------------------------------------------------+
| INNOVATION                                                5/5      |
|                                                                    |
| Things no other simulator does:                                    |
|                                                                    |
| • Black cultural news as market-moving events                      |
| • AI-generated fictional events with curriculum debt guarantees    |
| • Portfolio behavior-driven concept unlocking                      |
| • Dual-AI: Groq for speed + Claude for depth                      |
| • Voice narration on market events via ElevenLabs                  |
| • Company state system for narrative coherence across events       |
| • The first financial literacy platform where the learning is      |
|   inside the gameplay, not alongside it                            |
+------------------------------------------------------------------+
```

**CTA at bottom:**
```
+------------------------------------------------------------------+
|                                                                    |
|        [  TRY BLK EXCHANGE  ]     [  WATCH THE DEMO  ]           |
|                                                                    |
+------------------------------------------------------------------+
```

### Mobile layout
All sections stack vertically. Criterion anchor links become a sticky horizontal scroll bar at the top so judges can jump between criteria on mobile.

---

## 15. Demo script — 90 seconds

1. **Open dashboard** — Yahoo Finance-style layout, neobrutalism dark, 36 tickers with sparklines
2. **Groq generates event** — "BLK Exchange News Desk: CROWN Q3 earnings miss"
3. **Prices move** — CROWN -11%, GLOW +4%, SHEEN -3%, RARE +2% — all live
4. **Market Alert slides in** — ElevenLabs reads it aloud
5. **Knowledge Vault** — "Competitive Displacement" unlocks (because player held CROWN and GLOW)
6. **Execute trade** — buy GLOW after the CROWN miss, portfolio goes green
7. **Portfolio Coach** — Claude: "You're 65% Beauty. That worked today. Here's why it's a risk."
8. **Session debrief** — Claude's 400-word narrative on screen

Under 90 seconds. No dead air. The product speaks.
