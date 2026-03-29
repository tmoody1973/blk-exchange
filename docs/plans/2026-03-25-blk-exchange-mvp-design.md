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
| SECTOR BAR — horizontal scroll |
| [Media +2%] [Music -1%] [►]   |
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
| Charts | Recharts via neobrutalism.dev chart component |
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

### Phase 4 — Polish + demo (Day 5)

- Claude session debrief (400-word narrative)
- 5 leaderboards
- Season arc structure
- Shareable vault cards
- Performance audit
- 90-second demo run-through

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

## 13. Demo script — 90 seconds

1. **Open dashboard** — Yahoo Finance-style layout, neobrutalism dark, 36 tickers with sparklines
2. **Groq generates event** — "BLK Exchange News Desk: CROWN Q3 earnings miss"
3. **Prices move** — CROWN -11%, GLOW +4%, SHEEN -3%, RARE +2% — all live
4. **Market Alert slides in** — ElevenLabs reads it aloud
5. **Knowledge Vault** — "Competitive Displacement" unlocks (because player held CROWN and GLOW)
6. **Execute trade** — buy GLOW after the CROWN miss, portfolio goes green
7. **Portfolio Coach** — Claude: "You're 65% Beauty. That worked today. Here's why it's a risk."
8. **Session debrief** — Claude's 400-word narrative on screen

Under 90 seconds. No dead air. The product speaks.
	