# BLK Exchange: The Real Exchange — Refined Design

**Date:** 2026-03-30
**Status:** Design complete, ready for implementation
**Depends on:** Core sim (shipped), Finnhub API key, Perplexity API (already have)

---

## What This Is

The Real Exchange is BLK Exchange's graduation layer. Players who prove competency trading 36 sim tickers unlock a new tier featuring 8 real Black-owned publicly traded companies and the NAACP Minority Empowerment ETF.

Real tickers use real market prices from Finnhub. Real news from Perplexity. Real price movement from real markets. The player's portfolio becomes a blend of sim and real, the same way an actual investor holds a mix of positions.

The thesis: you can't teach someone to invest in companies they don't care about. But once the mechanics click through CROWN and DRIP and KICKS, you show them the real companies that look just like the ones they've been trading. Then you let them trade those too. At real prices.

---

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Pricing | Real market prices, not sim prices | Graduation means real. CARV trades at $2.84 because that's what it costs on NASDAQ. |
| Price data | Finnhub free tier, 60 calls/min | Real-time quotes every 15 min during market hours. |
| News | Perplexity daily search per ticker | Real press releases and earnings coverage. |
| Bridge pacing | Tied to player's most-traded sectors | Personal connection. You earn the real version of the sector you already care about. |
| Bridge format | One company at a time, story-driven reveal | Each company gets a dedicated reveal moment with founding story, sim connection, and lesson. |
| NACP capstone | Unlocks after exploring 5+ company cards | ETF investing is the final concept. |

---

## Unlock Conditions

Players access The Real Exchange after demonstrating competency across four dimensions:

| Requirement | Threshold | Why |
|---|---|---|
| Vault Concepts Unlocked | 15 of 23 | Proves foundational literacy |
| Diversification Score | 70+ | Shows portfolio construction skill |
| Total Trades Executed | 50+ | Demonstrates active engagement |
| Sectors Traded | 6+ of 12 | Prevents single-sector gambling |

When all four are met, the first real company reveal triggers automatically.

---

## The Bridge: How Real Companies Reveal

Real companies don't all appear at once. They unlock one at a time, tied to the player's most-traded sectors.

**Sector-to-ticker mapping:**

| Player's top sector | Real company that unlocks | Sim bridge |
|---|---|---|
| Media / Entertainment | Urban One (UONE) | LOUD |
| Real Estate | RLJ Lodging Trust (RLJ) | BLOK |
| Finance | Carver Bancorp (CARV) | VAULT |
| Finance (2nd) | Broadway Financial (BYFC) | VAULT |
| Finance (3rd) | Citizens Bancshares (CZBS)* | VAULT |
| Health / Beauty | Axsome Therapeutics (AXSM) | GLOW |
| Tech / Streaming | Direct Digital Holdings (DRCT) | VIZN |
| Health / Beauty (2nd) | American Shared Hospital (AMS) | GLOW |

*CZBS trades OTC. If Finnhub doesn't cover it, drop to 7 real tickers + NACP.

**How the reveal works:**

After unlock conditions are met, the system checks which sector the player has traded the most (by dollar volume). The corresponding real company triggers a special Market Alert:

> "You've traded Finance more than any other sector. There's a real company that looks a lot like VAULT. Meet Carver Bancorp."

The player taps the alert. A full-screen Company Card opens:

```
┌─────────────────────────────────────────────┐
│  ★ REAL COMPANY                             │
│                                             │
│  CARVER BANCORP (CARV)                      │
│  NASDAQ · Founded 1948 · Harlem, NY         │
│                                             │
│  THE STORY:                                 │
│  Carver Federal Savings Bank was founded     │
│  in 1948 to serve the Harlem community      │
│  when mainstream banks wouldn't. It is the  │
│  oldest Black-managed bank in America.      │
│  Today it serves over 90,000 accounts.      │
│                                             │
│  THE CONNECTION:                            │
│  You traded VAULT, a fictional community    │
│  bank. Carver Bancorp is the real one.      │
│  Same sector. Same mission. Real stock.     │
│                                             │
│  THE LESSON:                                │
│  Community banking isn't just local. It's   │
│  publicly traded. You can own a piece of    │
│  the institution that serves your community.│
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  TRADE CARV · $2.84                  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

The "TRADE CARV" button opens the trade modal at the current real market price. Zero friction between learning the story and acting on it.

**Subsequent reveals:** Each time the player completes a session after the first reveal, the next real company unlocks based on their second-most-traded sector, then third, and so on. A player who trades broadly across sectors sees all 8 companies faster.

---

## The Nine Real Tickers

| Ticker | Company | Exchange | Sector | Sim Bridge | Why it's here |
|---|---|---|---|---|---|
| UONE | Urban One | NASDAQ | Entertainment | LOUD | Largest Black-owned media company |
| RLJ | RLJ Lodging Trust | NYSE | Real Estate | BLOK | Black-founded hospitality REIT |
| CARV | Carver Bancorp | NASDAQ | Banking | VAULT | Oldest Black-managed bank in America |
| BYFC | Broadway Financial | NASDAQ | Banking | VAULT | Community development bank, LA |
| CZBS | Citizens Bancshares | OTC* | Banking | VAULT | Parent of Citizens Trust Bank, Atlanta |
| AXSM | Axsome Therapeutics | NASDAQ | Health | GLOW | Black-founded biotech (high volatility teaching) |
| DRCT | Direct Digital Holdings | NASDAQ | Technology | VIZN | Black-founded digital advertising |
| AMS | American Shared Hospital | NYSE American | Health | GLOW | Healthcare services company |
| NACP | NAACP Minority Empowerment ETF | NYSE Arca | CAPSTONE | — | The graduation moment |

*CZBS: Verify Finnhub coverage. If unavailable, drop to 7 + NACP.

---

## Real Ticker Detail Page

When a player taps a real ticker from the market list, the detail page shows four layers: live market data, the company story, financials for education, and real news.

```
┌──────────────────────────────────────────────┐
│  ★ CARV · Carver Bancorp · NASDAQ            │
│  CEO: Michael T. Pugh · Founded: 1948        │
│                                              │
│  $2.84  +3.2%                                │
│  Last updated 2:15pm ET · 15-min delay       │
│                                              │
│  [Price chart — real data, 1W/1M/3M/1Y]      │
│                                              │
│  YOUR POSITION                               │
│  1,200 shares · $3,408 invested              │
│  P&L: +$72.00 (+2.2%)                       │
│  [BUY]  [SELL]                               │
│                                              │
│  ─────────────────────────────────────────    │
│                                              │
│  THE STORY                                   │
│  Founded 1948 in Harlem. Oldest Black-       │
│  managed bank in America. 90,000+ accounts.  │
│  SIM BRIDGE: You traded VAULT. This is       │
│  the real version.                           │
│                                              │
│  ─────────────────────────────────────────    │
│                                              │
│  LEARN THE FUNDAMENTALS                      │
│                                              │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ MARKET CAP   │  │ P/E RATIO    │          │
│  │ $28M         │  │ 12.4         │          │
│  │ What investors│  │ Investors pay│          │
│  │ think the    │  │ $12.40 for   │          │
│  │ whole company│  │ every $1 of  │          │
│  │ is worth.    │  │ profit.      │          │
│  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ REVENUE      │  │ NET INCOME   │          │
│  │ $4.8M/yr     │  │ $1.2M/yr     │          │
│  │ Total money  │  │ Profit after │          │
│  │ coming in    │  │ all expenses.│          │
│  │ the door.    │  │ The real     │          │
│  │              │  │ bottom line. │          │
│  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ TOTAL ASSETS │  │ BOOK VALUE   │          │
│  │ $725M        │  │ $8.42/share  │          │
│  │ Everything   │  │ What each    │          │
│  │ the company  │  │ share is     │          │
│  │ owns.        │  │ worth on     │          │
│  │              │  │ paper.       │          │
│  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ EMPLOYEES    │  │ DIVIDEND     │          │
│  │ ~85          │  │ 0.0%         │          │
│  │ People who   │  │ Cash paid to │          │
│  │ work there.  │  │ shareholders │          │
│  │              │  │ each quarter.│          │
│  └──────────────┘  └──────────────┘          │
│                                              │
│  AI COACH:                                   │
│  "CARV's P/E ratio is 12.4. Remember when   │
│  you learned about P/E Ratio trading VAULT?  │
│  A P/E of 12 means investors pay $12 for     │
│  every $1 of profit. Lower P/E can mean      │
│  the stock is undervalued, or that investors  │
│  expect slower growth."                      │
│                                              │
│  ─────────────────────────────────────────    │
│                                              │
│  NEWS                                        │
│  ┌──────────────────────────────────────┐    │
│  │ Carver Bancorp Reports Q4 Net Income │    │
│  │ of $1.2M, Up 18% YoY                │    │
│  │ BusinessWire · 2 days ago            │    │
│  └──────────────────────────────────────┘    │
│  ┌──────────────────────────────────────┐    │
│  │ Black-Owned Banks See Deposit Surge  │    │
│  │ Reuters · 1 week ago                 │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ─────────────────────────────────────────    │
│  52-Week Range: $1.80 — $4.20                │
│  Volume: 12,400 · Debt/Equity: 0.8           │
│  carverbancorp.com                           │
└──────────────────────────────────────────────┘
```

**The "Learn the Fundamentals" section is the educational breakthrough.** Every metric card has the number AND a plain-English explanation. This is where vault concepts come alive with real data. The player learned "P/E Ratio" as an abstract concept in the sim. Now they see CARV's actual P/E ratio on NASDAQ and the AI coach ties it back to what they already know.

### Glossary Chips on Every Metric

Every metric label in the fundamentals section is wrapped in the existing `GlossaryChip` component. The label "P/E RATIO" is tappable. It opens the glossary popover (desktop) or bottom sheet (mobile) with:

- The concept name ("P/E Ratio")
- The glossary term
- A short definition
- "Adding to Knowledge Vault..." if the player hasn't seen this term before

This means the Real Exchange detail page is itself a teaching surface. A player browsing CARV's fundamentals and tapping "MARKET CAP" for the first time adds that glossary term to their profile. The financial data IS the lesson.

**Glossary term mapping for fundamentals:**

| Metric | Glossary termId | Vault concept |
|--------|----------------|---------------|
| Market Cap | `market-cap` | Portfolio Value / Market Cap |
| P/E Ratio | `pe-ratio` | P/E Ratio |
| Revenue | `revenue` | Profit & Loss |
| Net Income | `net-income` | Profit & Loss |
| Total Assets | `total-assets` | Portfolio Value |
| Book Value | `book-value` | Risk-Adjusted Return |
| Employees | (no glossary, plain text) | — |
| Dividend Yield | `dividend-yield` | Dividend Investing |
| Debt/Equity | `debt-equity` | Risk-Adjusted Return |
| 52-Week Range | `52-week-range` | Bull & Bear Markets |
| Volume | `volume` | Supply & Demand |
| EPS | `eps` | P/E Ratio |

New glossary terms may need to be seeded for metrics not already in the glossary (revenue, net-income, total-assets, book-value, debt-equity, eps, 52-week-range, volume, dividend-yield). These are one-time seeds in the `glossaryTerms` table.

**Example interaction:**

Player taps "P/E RATIO" on the CARV detail page:

```
┌─────────────────────────────────────┐
│  P/E RATIO                          │
│  Price-to-Earnings Ratio            │
│                                     │
│  How much investors pay for every   │
│  dollar of a company's profit.      │
│  A P/E of 12 means $12 per $1 of   │
│  earnings. Lower can mean           │
│  undervalued. Higher can mean       │
│  investors expect growth.           │
│                                     │
│  ✦ Adding to Knowledge Vault...     │
└─────────────────────────────────────┘
```

The same chip that teaches vocabulary in the sim now teaches real financial data on real companies. The learning loop is continuous.

**Key difference from sim ticker pages:** Real price, real financials, real news, real metrics with glossary chips and educational explanations. The AI coach references vault concepts the player already unlocked.

---

## Data Pipeline (Financial Modeling Prep)

**Source:** Financial Modeling Prep (financialmodelingprep.com). 250 API calls/day. Real-time quotes (15-min delay), financial statements, company profiles, key metrics, news.

**Why FMP over Finnhub:** One API gives you prices AND educational data. Income statements, balance sheets, P/E ratios, company profiles, earnings. Each data point maps to a vault concept the player already learned. Finnhub has more calls/day but only gives you quotes.

**API key:** `FMP_API_KEY` set in Convex env.
**Auth:** Append `?apikey=KEY` to every request.
**Base URL:** `https://financialmodelingprep.com/api/v3/`

### Endpoints Used

| Endpoint | URL | Calls/day | Purpose |
|----------|-----|-----------|---------|
| Quote | `/quote/CARV` | 36 (4x/day x 9 tickers) | Real-time price |
| Company Profile | `/profile/CARV` | 9 (once daily) | Description, CEO, employees, sector, market cap |
| Income Statement | `/income-statement/CARV?limit=1` | 9 (once daily) | Revenue, net income, EPS |
| Balance Sheet | `/balance-sheet-statement/CARV?limit=1` | 9 (once daily) | Total assets, equity, debt |
| Key Metrics | `/key-metrics/CARV?limit=1` | 9 (once daily) | P/E, EPS, dividend yield, book value |
| Historical Price | `/historical-price-full/CARV?timeseries=365` | 9 (once weekly) | Chart data 1W/1M/3M/1Y |
| Stock News | `/stock_news?tickers=CARV&limit=5` | 9 (once daily) | Real press releases, earnings coverage |
| **Total** | | **~99/day** | Well within 250 limit |

### Cron Schedule

```
Mon-Fri:
  10:00am ET — Quote fetch for all 9 tickers (9 calls)
  12:00pm ET — Quote fetch (9 calls)
  2:00pm ET  — Quote fetch (9 calls)
  4:30pm ET  — Quote fetch + closing snapshot (9 calls)
  8:00am ET  — Daily refresh: profile, income, balance, metrics, news (45 calls)

Sunday 6:00am ET:
  Weekly historical price refresh (9 calls)

Total weekday: ~90 calls. Total weekend: 9 calls.
Max daily: ~99 calls out of 250 allowed.
```

### Convex Tables

```
realStocks {
  ticker: string
  company: string
  exchange: string
  priceInCents: number
  previousCloseInCents: number
  dailyChangeInCents: number
  dailyChangePercent: number
  highInCents: number
  lowInCents: number
  openInCents: number
  volume: number
  marketCapInCents: number
  lastUpdated: number
  marketOpen: boolean
  // Company profile
  ceo: string
  description: string
  employees: number
  founded: string
  sector: string
  website: string
  logoUrl: string
  // Key metrics (educational)
  peRatio: number | null
  eps: number | null
  dividendYield: number | null
  bookValue: number | null
  debtToEquity: number | null
  // Financials (simplified for education)
  revenueInCents: number | null
  netIncomeInCents: number | null
  totalAssetsInCents: number | null
  totalEquityInCents: number | null
}
  .index("by_ticker", ["ticker"])

realPriceHistory {
  ticker: string
  date: string
  closeInCents: number
}
  .index("by_ticker_date", ["ticker", "date"])
```

### After-hours Display

```
CARV  $2.84  +3.2%
Market closed · Opens Mon 9:30am ET
```

**Fallback:** If FMP is unreachable, keep last known price. Show "Price as of [time]" label.

**Environment variable:** `FMP_API_KEY` in Convex env.

---

## News Pipeline for Real Tickers

**Primary source:** FMP Stock News endpoint (included in free tier, counted in the 250/day budget above).

**Endpoint:** `https://financialmodelingprep.com/api/v3/stock_news?tickers=CARV&limit=5&apikey=KEY`

Returns title, URL, source (publication name), published date, image URL, and text snippet. One call per ticker, 9 calls/day.

**Fallback source:** Perplexity API (already integrated for sim news). If FMP returns zero articles for a ticker (common for micro-caps), Perplexity fills the gap with a broader search.

**Convex table:**

```
realArticles {
  ticker: string
  title: string
  url: string
  source: string
  summary: string
  imageUrl: string | null
  publishedAt: number
  fetchedAt: number
}
  .index("by_ticker", ["ticker"])
  .index("by_ticker_date", ["ticker", "publishedAt"])
```

Keep last 10 articles per ticker. 80 articles max in the table at any time.

**Display:** 3-5 most recent articles per company on the ticker detail page. Title, source, date, 2-line summary. Tap to open full article in browser.

---

## Portfolio Integration

**Unified portfolio.** Real and sim holdings live in one view. No separate accounts.

The existing `holdings` table works for both. Add a `isReal: boolean` field (or determine from a `realStocks` lookup). Portfolio value = sim holdings + real holdings + cash.

**The Diversification Score counts both.** A player holding VAULT (sim) and CARV (real) in the same sector doesn't get double credit. Same sector, same bucket. This teaches that diversification is about sectors, not the number of tickers.

**AI coach adapts to real tickers:**

For sim tickers, the coach explains AI-generated events. For real tickers, the coach explains real market movement:

> "CARV dropped 4% today. Carver Bancorp reported lower deposit growth this quarter. In the sim, you learned that earnings reports move prices. Now you're seeing it happen on a real exchange."

**Share count lesson:** A player might hold 2 shares of AXSM ($85 each) and 1,500 shares of BYFC ($1.20 each). Both positions worth about the same. The AI coach can call this out:

> "You own 1,500 shares of BYFC and 2 shares of AXSM, but they're worth about the same in your portfolio. Share count is not the same as investment value."

---

## The NACP Capstone

The NAACP Minority Empowerment ETF unlocks after the player has explored 5+ real company cards.

NACP teaches three concepts at once:
- ETFs: buying the basket, not the individual stock
- Index investing: passive vs. active strategies
- Social screening: encoding values into investment methodology

When a player buys NACP, their Diversification Score gets a +10 bonus. One ETF holding 200+ companies instantly improves portfolio balance more than any single stock pick. The game mechanic teaches a real concept.

**The graduation message:**

> "You've unlocked the capstone. Individual stocks teach you how companies work. ETFs teach you how markets work. The NAACP Minority Empowerment Fund taught you that values and investing don't have to be separate. One trade. 200+ companies. Purpose-driven. Welcome to the real exchange."

### NACP Detail Page: Learn What an ETF Actually Is

The NACP page is different from the other 8 real ticker pages. It's an ETF education experience. The player doesn't just see a price and a story. They see what's INSIDE the fund.

**FMP endpoint:** `/stable/etf/holdings?symbol=NACP&apikey=KEY`

Returns the full list of companies held inside NACP with weights and share counts.

**Page layout:**

```
┌──────────────────────────────────────────────┐
│  ★ NACP · NAACP Minority Empowerment ETF     │
│  NYSE Arca · The Capstone                    │
│                                              │
│  $32.14  +0.3%                               │
│  Last updated 2:15pm ET                      │
│                                              │
│  [Price chart — 1W/1M/3M/1Y]                 │
│                                              │
│  YOUR POSITION                               │
│  5 shares · $160.70 invested                 │
│  Diversification Bonus: +10                  │
│  [BUY]  [SELL]                               │
│                                              │
│  ─────────────────────────────────────────    │
│                                              │
│  WHAT'S INSIDE THIS ETF?                     │
│                                              │
│  When you buy 1 share of NACP, you own a     │
│  piece of all of these companies at once.    │
│  That's what an ETF is. One purchase.        │
│  Instant diversification.                    │
│                                              │
│  213 COMPANIES · TOP 10 HOLDINGS:            │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  MSFT  Microsoft        4.2%        │    │
│  │  AAPL  Apple            3.8%        │    │
│  │  NVDA  NVIDIA           3.1%        │    │
│  │  AMZN  Amazon           2.9%        │    │
│  │  JPM   JPMorgan Chase   2.4%        │    │
│  │  GOOGL Alphabet         2.2%        │    │
│  │  UNH   UnitedHealth     1.9%        │    │
│  │  V     Visa             1.7%        │    │
│  │  PG    Procter & Gamble 1.5%        │    │
│  │  HD    Home Depot       1.4%        │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  [See all 213 holdings]                      │
│                                              │
│  ─────────────────────────────────────────    │
│                                              │
│  HOW IS THIS DIFFERENT FROM PICKING STOCKS?  │
│                                              │
│  You traded CARV, UONE, and DRCT as          │
│  individual picks. If one company has a       │
│  bad quarter, your portfolio feels it.       │
│                                              │
│  NACP holds 213 companies. If one drops,     │
│  the others absorb it. That's why your       │
│  Diversification Score jumped +10 when you   │
│  bought it.                                  │
│                                              │
│  ─────────────────────────────────────────    │
│                                              │
│  WHY "MINORITY EMPOWERMENT"?                 │
│                                              │
│  NACP screens companies based on racial      │
│  and social justice criteria set by the       │
│  NAACP. It's the only ETF designed in        │
│  partnership with a civil rights              │
│  organization. Your money goes to            │
│  companies that meet empowerment standards.  │
│                                              │
│  That's social screening. You're encoding    │
│  your values into your investments.          │
│                                              │
│  GLOSSARY: [ETF] [Diversification]           │
│  [Social Screening] [Index Investing]        │
│                                              │
│  ─────────────────────────────────────────    │
│                                              │
│  NEWS                                        │
│  (real articles from FMP)                    │
│                                              │
│  KEY METRICS                                 │
│  Expense Ratio: 0.49%                        │
│  Dividend Yield: 1.5%                        │
│  Holdings: 213 companies                     │
│  Inception: 2018                             │
└──────────────────────────────────────────────┘
```

**Glossary chips at the bottom:** ETF, Diversification, Social Screening, and Index Investing are all tappable glossary terms. Four concepts taught on one page.

**Educational sections explain in plain English:**
- "What's inside this ETF?" shows the actual holdings from FMP data
- "How is this different from picking stocks?" ties back to the player's own real ticker holdings
- "Why Minority Empowerment?" teaches social screening as an investing concept

**FMP data used:**
- ETF holdings endpoint (1 call, cached weekly): full list of companies inside NACP with weights
- Quote endpoint (included in 4x/day price refresh): current price
- ETF info/expense ratio (1 call, cached monthly): expense ratio, inception date, dividend yield

This adds 2-3 calls per week to the FMP budget. Negligible.

---

## Company Stories (Content for Each Reveal Card)

### UONE — Urban One
Founded by Cathy Hughes in 1980 as a single AM radio station in Washington, D.C. Today Urban One is the largest Black-owned media company in America, reaching over 80% of the African American population through radio, cable television (TV One), and digital platforms. Hughes bought the station with a small business loan after being rejected by 32 banks.

### RLJ — RLJ Lodging Trust
Founded by Robert L. Johnson, who also created BET. RLJ Lodging Trust is a real estate investment trust that owns premium hotels across the U.S. Johnson became the first Black American billionaire when he sold BET to Viacom in 2001. RLJ represents Black ownership in commercial real estate at scale.

### CARV — Carver Bancorp
Founded in 1948 to serve the Harlem community when mainstream banks would not. Carver Federal Savings Bank is the oldest Black-managed bank in America. It has survived recessions, redlining, and the 2008 financial crisis. Today it serves over 90,000 accounts and remains committed to community reinvestment.

### BYFC — Broadway Financial
A community development bank headquartered in Los Angeles, serving predominantly minority and low-to-moderate income communities since 1946. Broadway Financial merged with City First Banc in 2021 to form the largest Black-led bank in America by assets. It provides affordable mortgages and small business loans.

### CZBS — Citizens Bancshares
Parent company of Citizens Trust Bank, founded in 1921 in Atlanta. One of the oldest and largest Black-owned banks in the United States. Citizens Trust was founded during a period when Black Americans were systematically excluded from the financial system. It has been a pillar of Black wealth-building in the South for over a century.

### AXSM — Axsome Therapeutics
A biopharmaceutical company developing therapies for central nervous system disorders. Founded by Herriot Tabuteau, a Haitian-American physician and entrepreneur. AXSM teaches high-volatility investing because biotech stocks swing dramatically on FDA decisions. A single approval can move the stock 40% in a day.

### DRCT — Direct Digital Holdings
Founded by Mark Walker, Direct Digital is a Black-founded digital advertising technology company. It connects advertisers with audiences across multicultural and diverse communities through programmatic ad buying. DRCT represents Black ownership in the advertising infrastructure that powers the internet.

### AMS — American Shared Hospital Services
A healthcare services company providing radiosurgery and radiation therapy equipment to hospitals. AMS demonstrates how healthcare companies can be publicly traded and how medical technology creates investment opportunities in underserved communities.

### NACP — NAACP Minority Empowerment ETF
Created by Impact Shares in partnership with the NAACP. NACP is the only ETF designed in collaboration with a civil rights organization. It screens companies based on racial and social justice criteria. Buying NACP means your investment portfolio reflects your values. $32 buys a share of over 200 companies that meet the NAACP's empowerment criteria.

---

## Market List Integration

After unlock, real tickers appear interleaved with sim tickers in the market view, grouped by sector.

**Visual differentiation:**
- Gold star badge (★) before the ticker symbol
- Subtle gold left border on the ticker row
- "REAL" tag next to the exchange name
- No animation or glow. Confident and quiet.

**Sector marquee** includes real tickers after unlock:
```
★UONE +2.3%  LOUD +1.1%  ★RLJ -0.5%  BLOK +0.8%
```

---

## Schema Changes Summary

New tables:

| Table | Purpose | Rows (steady state) |
|---|---|---|
| `realStocks` | Live price data for 9 tickers | 9 |
| `realPriceHistory` | Daily closing prices for charts | ~3,300/year |
| `realArticles` | News articles per real ticker | ~80 max |
| `realCompanyCards` | Company stories + reveal state per player | 9 per player |

Modified tables:

| Table | Change |
|---|---|
| `players` | Add `realExchangeUnlocked: boolean`, `realTickersRevealed: string[]` |
| `holdings` | Works as-is. Real holdings distinguished by ticker lookup against `realStocks` |

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `FMP_API_KEY` | Convex env | Real-time quotes, financials, company profiles, news |
| `PERPLEXITY_API_KEY` | Convex env (already set) | Fallback news search for tickers with sparse FMP coverage |

---

## Implementation Phases

**Phase 1: Foundation (CC: ~3 hours)**
- Add schema tables (`realStocks`, `realPriceHistory`, `realArticles`, `realCompanyCards`)
- Add `realExchangeUnlocked` and `realTickersRevealed` to players
- Build Finnhub price fetch cron
- Build Perplexity real news cron
- Seed the 9 real company stories

**Phase 2: The Bridge (CC: ~2 hours)**
- Unlock condition checker (runs after each session/trade)
- Sector-ranked reveal logic
- Company Card reveal UI (full-screen story card)
- Market Alert for first reveal

**Phase 3: Trading (CC: ~2 hours)**
- Real ticker rows in market list (gold star, gold border)
- Real ticker detail page (live price, chart, news, story, trade button)
- Trading at real prices (reuse trade modal, source price from `realStocks`)
- Portfolio integration (unified view, diversification score counts both)

**Phase 4: Capstone (CC: ~1 hour)**
- NACP unlock after 5 company cards explored
- +10 diversification bonus on NACP purchase
- Graduation message from AI coach
- Share card for graduation moment

**Total: ~8 hours CC time**

---

## Open Questions

1. **CZBS (OTC):** Does Finnhub cover OTC tickers on the free tier? Test before building. If not, drop to 7 + NACP.
2. **Trading hours UX:** Real tickers tradeable anytime at last known price, or only during market hours? Current decision: anytime at last known price. Revisit if players find this confusing.
3. **Acorns integration:** The Acorns graduation CTA is designed but not included in this build. Phase 5, after proving the Real Exchange works with real users.
4. **24th vault concept:** The original design adds "Micro-Investing & Automation" as a 24th concept triggered by the Acorns CTA. Defer until Acorns partnership is signed.
