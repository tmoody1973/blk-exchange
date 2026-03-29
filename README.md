# BLK Exchange

> A real-time cultural stock market simulator teaching financial literacy through gameplay.

**Hackenomics 2026 Submission** | Deadline: March 30, 2026

## Overview

BLK Exchange is a stock market simulator where players trade 36 fictional Black-economy companies whose prices are driven by real cultural news and AI-generated events. Claude and Groq teach 23 investing concepts through gameplay -- not lectures.

Players start with $10,000 in virtual capital, trade across 12 sectors, and unlock financial literacy concepts by demonstrating them through portfolio behavior. Every event teaches. Every trade is a decision. Every session ends with a personalized AI debrief.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Backend / DB / Realtime | Convex |
| Auth | Clerk |
| Deep AI Reasoning | Claude Sonnet 4.6 (coaching, professor mode, debrief) |
| Fast Structured AI | Groq llama-3.3-70b-versatile (event generation, classification) |
| Fast Commentary | Groq llama-3.1-8b-instant (2-sentence explanations) |
| TTS | ElevenLabs (Market Alerts only, eleven_flash_v2_5) |
| News Scraping | Firecrawl (12 publications every 15 min) |
| Semantic Discovery | Exa (neural search every 30 min) |
| Search Fallback | Tavily (when other layers yield <3 articles) |
| Styling | Tailwind CSS + neobrutalism.dev (shadcn/ui overrides) |
| Charts | Recharts |
| Deployment | Vercel + Convex Cloud |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Convex account
- Clerk account

### Installation

```bash
git clone https://github.com/tmoody1973/blk-exchange.git
cd blk-exchange
pnpm install
```

### Environment Variables

Copy `.env.local` and fill in your keys:

| Variable | Description | Required | Phase |
|----------|-------------|----------|-------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Yes | 1 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes | 1 |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes | 1 |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk JWT issuer for Convex | Yes | 1 |
| `ANTHROPIC_API_KEY` | Claude API key (Convex env) | Yes | 2 |
| `GROQ_API_KEY` | Groq API key (Convex env) | Yes | 2 |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | Yes | 2 |
| `FIRECRAWL_API_KEY` | Firecrawl API key (Convex env) | No | 3 |
| `EXA_API_KEY` | Exa API key (Convex env) | No | 3 |
| `TAVILY_API_KEY` | Tavily API key (Convex env) | No | 3 |

AI keys (Anthropic, Groq, ElevenLabs, Firecrawl, Exa, Tavily) must be set as **Convex environment variables**, not in `.env.local`:

```bash
npx convex env set GROQ_API_KEY <your-key>
npx convex env set ANTHROPIC_API_KEY <your-key>
npx convex env set ELEVENLABS_API_KEY <your-key>
```

### Development

```bash
# Start Convex dev server (in one terminal)
npx convex dev

# Start Next.js dev server (in another terminal)
pnpm dev
```

### Seed the Database

```bash
npx convex run seed:seedDatabase
```

This inserts all 36 tickers and 36 company states.

## Project Structure

```
blk-exchange/
├── convex/                    # Convex backend
│   ├── schema.ts              # Database schema (14 tables)
│   ├── market.ts              # Stock queries
│   ├── players.ts             # Player management
│   ├── trades.ts              # Atomic trade execution
│   ├── holdings.ts            # Holdings with P&L
│   ├── events.ts              # Event queries
│   ├── vault.ts               # Knowledge Vault + concept unlocking
│   ├── sessions.ts            # Session lifecycle
│   ├── leaderboards.ts        # 5 leaderboards
│   ├── curriculumDebt.ts      # Curriculum gap tracking
│   ├── eventScheduler.ts      # Max 2 events per 10-min window
│   ├── crons.ts               # Scheduled jobs
│   ├── groq/                  # Groq AI actions
│   │   ├── generateFictionalEvent.ts
│   │   ├── marketCommentary.ts
│   │   └── classifyArticle.ts
│   ├── claude/                # Claude AI actions
│   │   ├── gradePortfolio.ts
│   │   ├── answerQuestion.ts
│   │   └── generateDebrief.ts
│   └── news/                  # News pipeline
│       ├── firecrawl.ts       # Article scraping
│       ├── perplexity.ts      # Research layer
│       └── scheduler.ts       # Pipeline orchestration
├── src/
│   ├── app/
│   │   ├── (landing)/         # Public pages
│   │   │   ├── page.tsx       # Landing page (7 sections)
│   │   │   └── judges/        # Hackathon pitch page
│   │   ├── (app)/             # Authenticated app
│   │   │   ├── market/        # Dashboard + ticker detail
│   │   │   ├── portfolio/     # Portfolio view
│   │   │   ├── vault/         # Knowledge Vault
│   │   │   └── profile/       # Profile + leaderboards
│   │   ├── offline/           # PWA offline fallback
│   │   └── api/
│   │       ├── tts/           # ElevenLabs TTS endpoint
│   │       └── og/            # OG image generation
│   ├── components/
│   │   ├── market/            # Ticker table, sparklines, news feed, alerts
│   │   ├── trade/             # Trade modal + preview
│   │   ├── portfolio/         # Summary, holdings, donut chart
│   │   ├── vault/             # Concept cards, progress bars
│   │   ├── education/         # Coach, professor mode, debrief
│   │   ├── leaderboard/       # Board tables + tabs
│   │   ├── landing/           # Marketing page sections
│   │   ├── judges/            # Pitch page components
│   │   ├── splash/            # Animated PWA splash screen
│   │   ├── onboarding/        # New player onboarding flow
│   │   ├── glossary/          # Financial glossary UI
│   │   ├── game/              # Achievements, status bar, debrief
│   │   ├── layout/            # Bottom tabs, sidebar, nav
│   │   └── ui/                # neobrutalism shadcn components
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── icons/                 # PWA icons (192, 512, maskable)
│   └── splash/                # iOS splash screens
└── docs/
    ├── BLK_Exchange_PRD_v3.md
    ├── BLK_Exchange_Game_Mechanics.md
    ├── BLK_Exchange_Claude_Code_Brief_v3.md
    └── plans/                 # Design + implementation plans
```

## Features

### The Market
- **36 fictional companies** across 12 sectors (Media, Streaming, Music, Gaming, Sportswear, Fashion, Publishing, Beauty, Finance, Real Estate, Sports, Entertainment)
- **Real-time prices** via Convex subscriptions -- all players see the same prices
- **Sector marquee** scrolling ticker tape at the top of every screen
- **Yahoo Finance-style layout** with neobrutalism dark mode styling

### Trading
- **Market orders** by dollar amount (fractional shares)
- **25% dynamic position limit** prevents over-concentration
- **Atomic execution** -- trades are all-or-nothing Convex mutations
- **$10,000 starting capital** with weekly resets

### AI-Powered Education
- **Groq event generation** -- fictional business news from 36 company states at 758 tok/sec
- **3-layer real news pipeline** -- Firecrawl + Exa + Tavily scraping Black cultural publications
- **Claude portfolio coaching** -- grades diversification, recommends specific tickers
- **Claude professor mode** -- answers any question using your actual holdings as examples
- **Claude session debrief** -- personalized 400-word narrative at session end
- **ElevenLabs TTS** -- Market Alerts read aloud automatically

### Knowledge Vault
- **23 financial literacy concepts** across 4 tiers (Foundation, Intermediate, Advanced, Economics)
- **Hybrid unlocking** -- ~15 behavior-driven (portfolio state proves the concept) + ~8 event-driven
- **Curriculum debt queue** -- AI generates events targeting unlearned concepts
- **Shareable cards** -- share your learning on social media with OG images

### Progressive Web App
- **Installable** on mobile home screens (Android + iOS)
- **Animated splash screen** with 8-phase timeline on launch
- **Service worker** with network-first navigation, cache-first static assets
- **Offline fallback** page when connectivity is lost
- **Install prompt** with native beforeinstallprompt + iOS Safari instructions

### Competition
- **5 leaderboards**: Portfolio Value, Knowledge Vault, Diversification Score, Biggest Mover, The Blueprint Award
- **8-week seasons** with themed weeks and championship
- **Daily streaks** with capital bonuses

## The 36 Tickers

| Sector | Tickers |
|--------|---------|
| Media & Content | LOUD, SCROLL, VERSE |
| Streaming | VIZN, NETFLO, LIVE |
| Music | RYTHM, BLOC, CRATE |
| Gaming | PIXL, MOBILE, SQUAD |
| Sportswear | KICKS, FLEX, COURT |
| Streetwear & Fashion | DRIP, RARE, THREAD |
| Publishing | INK, READS, PRESS |
| Beauty & Wellness | CROWN, GLOW, SHEEN |
| Finance & Banking | VAULT, STAX, GROW |
| Real Estate | BLOK, BUILD, HOOD |
| Sports & Athletics | DRAFT, ARENA, STATS |
| Entertainment | SCREEN, STAGE, GAME |

## Design System

**UX Reference:** Yahoo Finance layout with neobrutalism dark mode styling from [neobrutalism.dev](https://neobrutalism.dev).

| Token | Value |
|-------|-------|
| Background | `#0e0e0e` |
| Card | `#1a1a1a` |
| Primary | `#7F77DD` (brand purple) |
| Accent | `#FDE047` (Knowledge Vault yellow) |
| Border | `#ffffff` (all borders white) |
| Radius | `0rem` (hard corners) |
| Shadow | `4px 4px 0px 0px #ffffff` |
| Font | `Courier New, monospace` |

## Cost Estimate (Hackathon Scale)

| Service | Monthly |
|---------|---------|
| Groq LLM | ~$8-15 |
| ElevenLabs TTS | ~$22 |
| Claude | ~$20-40 |
| Convex | Free tier |
| Clerk | Free tier |
| Firecrawl | ~$16 |
| Exa | ~$7 |
| Tavily | Free tier |
| Vercel | Free tier |
| **Total** | **~$56-88/mo** |

## Deploy

```bash
# Deploy Convex to production
npx convex deploy

# Deploy to Vercel
vercel --prod
```

Set Vercel environment variables: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `ELEVENLABS_API_KEY`.

## Author

**Tarik Moody** -- Built for Hackenomics 2026

## License

All rights reserved. This project was built for the Hackenomics 2026 hackathon.

---

*BLK Exchange is a financial literacy education tool. All companies, prices, and market events are fictional. No real money is involved.*
