

**BLK Exchange**

**Product Requirements Document**

*BLK Exchange v2.0 — Feature Specification*

| Version | 2.0 |
| :---- | :---- |
| **Date** | March 2026 |
| **Author** | Tarik Moody |

# **1\. Executive summary**

| What we are building BLK Exchange is a real-time cultural stock market simulator where players trade 36 fictional Black-economy companies whose prices are driven by real cultural news and AI-generated fictional events. Claude and Groq together teach 23 investing concepts through gameplay, not lectures. Target: Hackonomics 2026 — spread awareness about financial literacy and economics in the community. |
| :---- |

| Attribute | Value |
| :---- | :---- |
| Hackathon | Hackonomics 2026 (Sept 2025 – March 2026\) |
| Primary audience | African-American community, Black wealth-building and financial literacy audience |
| Secondary audience | High school and college educators and students |
| AI stack | Claude claude-sonnet-4-6 (reasoning) \+ Groq llama-3.3-70b-versatile (structured output) \+ ElevenLabs (TTS) |
| Infrastructure | Next.js 14, Convex, Clerk, Firecrawl, Exa, Tavily |
| Market | 36 tickers, 12 sectors, 3 per sector |
| Curriculum | 23 concepts across 4 tiers: Foundation, Intermediate, Advanced, Economics |
| Design system | Neobrutalism dark mode (neobrutalism.dev \+ shadcn/ui) |
| MVP deadline | March 30, 2026 |

# **2\. Problem statement**

## **2.1 The financial literacy gap**

Financial literacy remains inaccessible for millions of Black Americans. Existing platforms are generic, culturally detached, and text-heavy. The Black financial literacy movement has demonstrated massive demand for investing education in culturally resonant language — but the interactive, experiential layer that makes learning stick is missing.

## **2.2 The simulation gap**

The best financial simulators (TickerSphere, Investopedia) use real tickers and culturally neutral contexts. A Black teenager learning about the stock market on these platforms never sees the companies and cultural moments they know reflected in the data. The investing concepts are abstract because the examples are abstract.

## **2.3 The news dependency problem — why fictional events solve it**

Real cultural news is sparse, unpredictable, and sometimes inappropriate for educational gameplay. Long quiet periods create dead markets. Some financial concepts may never appear naturally in real news. Groq and Claude generating fictional news for fictional companies solves this: the market is always live, every concept is deliverable on demand, and the pedagogy is designed rather than discovered.

| The core insight Black culture IS an economy. Boycotts, album drops, HBCU endowments, celebrity brand launches — these are market events. A simulator that treats Black cultural moments as financial data teaches two things: how markets work AND why Black economic solidarity matters. The fictional companies keep the lessons clean; the real cultural context makes them resonate. |
| :---- |

# **3\. Target users**

## **3.1 Primary: The community investor (18-35)**

Engages with Black financial literacy content, follows Black business media, and wants to invest but hasn't started. Learns best through experience and competition. Trusts culturally specific content over generic financial advice. Will play solo on weekends and share Knowledge Vault progress on social.

## **3.2 Secondary: The classroom student (14-22)**

Little to no investing experience. Engages with gaming mechanics and competition. Will learn financial concepts through BLK Exchange that their school curriculum never covered. Needs the experience to feel safe (fictional money) but real (actual cultural news, real concepts).

## **3.3 Tertiary: The educator**

A teacher or community educator who wants to bring financial literacy to students without being a finance expert. Claude and Groq are the experts in the room. Needs 5-minute session creation, teacher dashboard, and clear learning outcome reports per student.

# **4\. The AI architecture**

| Right model for the right job Claude handles deep reasoning. Groq handles speed and structured output. ElevenLabs handles voice with best-in-class naturalness. This split delivers better quality at lower cost than using Claude for everything. |
| :---- |

| Function | AI model \+ rationale |
| :---- | :---- |
| Fictional news generation | Groq llama-3.3-70b-versatile — structured JSON, 10+ events/session, must be fast. $0.59/1M tokens. |
| Real news classification | Groq llama-3.3-70b-versatile — same JSON pattern, high frequency, consistency important. |
| Market commentary | Groq llama-3.1-8b-instant — 2-sentence explanation per event, \<400ms. $0.06/1M tokens. |
| Portfolio coaching | Claude claude-sonnet-4-6 — genuine reasoning about diversification, concentration risk, recommendation. |
| Professor mode Q\&A | Claude claude-sonnet-4-6 — player asks anything, Claude answers using their actual portfolio as example. |
| Session debrief | Claude claude-sonnet-4-6 — 400-word personalized narrative, most complex output in the product. |
| TTS narration | ElevenLabs TTS — eleven\_flash\_v2\_5 for market alerts, eleven\_multilingual\_v2 for debrief narration. $22/1M chars. |

# **5\. The news engine — real \+ fictional**

## **5.1 Real news pipeline (three layers)**

Layer 1: Firecrawl scrapes 12 Black cultural publications every 15 minutes. New articles fingerprinted by URL hash, classified by Groq. Articles scoring 6+ enter the event queue.

Layer 2: Exa semantic discovery every 30 minutes. Six cultural queries find Black business news outside the curated publication list. Neural search catches stories before they hit the major publications.

Layer 3: Tavily fallback triggers when layers 1 and 2 yield fewer than 3 classifiable articles in 30 minutes. All-in-one search \+ clean summary. Stays within free tier at hackathon volume.

## **5.2 Fictional news engine (always-on)**

Groq generates fictional events continuously from three sources: concept-targeted (clears curriculum debt), company lifecycle (reads company state for coherence), cultural calendar (timed to real cultural rhythms). Events fire at max 2 per 10-minute window. Synthetic quarterly earnings fire for every ticker on schedule.

## **5.3 Transparency — real vs fictional labeling**

Real events: labeled with source publication name ('via AfroTech', 'via Essence'). Fictional events: labeled 'BLK Exchange News Desk'. Players always know which is which. Transparency is itself a financial literacy lesson: know where your information comes from and whether it's primary source or synthesized.

# **6\. Features — functional requirements**

## **FR-01: Market dashboard**

* Neobrutalism dark mode: \#0e0e0e background, white borders, offset box-shadows, Courier New monospace throughout

* 12-sector index bar \+ BLK Index composite, all updating via Convex real-time subscriptions

* 36-ticker table: symbol, company, sector tag, price, daily %, sparkline, market cap — sortable by all columns

* Ticker detail panel: 30-day price history (Area Chart \- Interactive), company profile, recent events, buy/sell action

* Portfolio sidebar: total value, day gain/loss, positions with per-holding P\&L, allocation donut chart (Pie Chart \- Donut with Text)

* Live news feed: real headlines with publication attribution \+ fictional labeled 'BLK Exchange News Desk'

* Market Alert: slides in on event fire, headline \+ affected stocks, Groq commentary, ElevenLabs TTS auto-plays

## **FR-02: Dual news engine**

* Groq generates fictional events from three types: concept-targeted, company lifecycle, cultural calendar

* Firecrawl scrapes 12 publications every 15 minutes; Groq classifies each new article

* Exa semantic discovery every 30 minutes; Tavily fallback when queues are thin

* All events (real and fictional) share the same event queue, max 2 events per 10-minute window

* Company state system: 36 companyState documents in Convex, Groq reads all before generating

* Curriculum debt queue: tracks unlearned concepts, weights generated events toward gaps

## **FR-03: Claude education layer**

* Portfolio Coach: fires after every 3 events per player. Claude grades diversification 0-100, flags concentration, gives specific recommendation with named tickers.

* Professor Mode: player taps any stock, concept, or Market Alert — Claude answers using their actual portfolio as the teaching example.

* Session Debrief: session end triggers Claude 400-word personalized narrative. What worked, what cost them, 3 concepts named, specific focus for next session.

* ElevenLabs TTS: auto-plays Market Alert (Flash model), portfolio coach summary on tap, debrief opening paragraph on session end (Multilingual v2)

## **FR-04: Knowledge Vault**

* 23 concept cards across 4 tiers: Foundation, Intermediate, Advanced, Economics

* Cards unlock through gameplay experience only — never on demand

* Each card: concept definition, game moment that taught it, real-world example, source attribution for real-news-triggered concepts

* Progress bar on home screen: 'X of 23 investing concepts'

* Curriculum debt system: Claude checks vault after each session, weights next events to clear gaps

* Shareable card: concept name \+ portfolio gain when learned \+ one-line insight — social sharing format

## **FR-05: Five leaderboards (Convex real-time)**

* Portfolio Value — total vs $10,000 start, resets weekly

* Knowledge Vault — most concepts unlocked, resets each 8-week season

* Diversification Score — Claude-graded portfolio balance 0-100, resets weekly

* Biggest Mover — largest single-event gain, resets after every major event

* The Blueprint Award — 8-week season championship, composite score (P\&L \+ vault \+ diversification)

## **FR-06: Classroom mode**

* Teacher creates Clerk Org, generates 6-digit student join code

* Teacher dashboard: event library, manual trigger, market pause/resume, live student performance grid

* Teacher annotations: discussion prompts visible on all student screens

* Session debrief: class-level summary (top 3 concepts, class median P\&L) \+ each student's individual Claude report

* Homework mode: teacher assigns a solo session, Convex tracks completion

# **7\. Non-functional requirements**

| Requirement | Specification |
| :---- | :---- |
| Event generation speed | Groq generates fictional event JSON in \<500ms. Commentary in \<400ms. Market Alert visible within 1 second of event firing. |
| TTS latency | ElevenLabs Flash model first audio byte within 500ms of event fire. Market Alert auto-plays; other TTS opt-in. |
| Real-time price sync | All connected players see same price update within 500ms via Convex reactive queries. |
| News pipeline uptime | Firecrawl fails → Exa. Both fail → Tavily. All three fail → fictional events fill. Market never stops. |
| Mobile responsive | Full functionality at 375px+. Target audience primarily on mobile. |
| Session recovery | Full portfolio state recovery on browser re-open — all data in Convex. |
| Accessibility | WCAG AA — color contrast, keyboard navigation, screen reader labels. ElevenLabs TTS benefits users with reading difficulties — 1,200+ voices including warm, accessible tones. |

# **8\. Cost model at hackathon scale**

| Service | Monthly cost estimate |
| :---- | :---- |
| Groq LLM (news gen \+ classification \+ commentary) | \~$8-15 — \~50k requests, mostly llama-3.1-8b at $0.06/1M tokens |
| ElevenLabs TTS | \~$22/mo — Creator plan, 100k characters/month. Flash for alerts (0.5 credits/char), Multilingual v2 for debrief (1 credit/char). |
| Claude (coaching \+ debrief \+ professor) | \~$20-40 — lower volume, higher-value calls only |
| Convex | $0 — free tier covers hackathon volume |
| Clerk | $0 — free tier covers hackathon volume |
| Firecrawl | \~$16 — Starter plan |
| Exa | \~$7 — pay-per-use at hackathon volume |
| Tavily | $0 — free tier: 1,000 credits/month covers fallback |
| Vercel | $0 — free tier |
| Total monthly estimate | \~$56-88 — well within hackathon development budget |

# **9\. Hackonomics 2026 judging criteria**

| Criterion | How BLK Exchange scores |
| :---- | :---- |
| Relevancy (5/5) | Financial literacy and economics IS the product. 23-concept curriculum with guaranteed delivery via curriculum debt system. Every mechanic teaches a named concept. |
| Technical execution (5/5) | Convex real-time market engine, dual-AI pipeline (Claude \+ Groq), three-layer news pipeline, ElevenLabs TTS, fictional news engine with company state system. Demonstrably sophisticated. |
| Presentation (5/5) | Neobrutalism dark mode — looks like nothing else in the competition. Yahoo Finance familiarity meets Black cultural aesthetic. Courier New monospace makes it feel like a real trading terminal. |
| Impact (5/5) | Classroom mode deployable today. Solo mode free 24/7. Real Black media publications credited. Curriculum guarantee: every player learns all 23 concepts. Genuine community educational tool. |
| Innovation (5/5) | No existing simulator uses Black cultural news as market events. No existing financial literacy platform uses AI fictional news with curriculum debt guarantees and TTS narration. Genuinely new. |

