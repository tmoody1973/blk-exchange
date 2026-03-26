

**BLK Exchange**

**Claude Code Brief**

*Build instructions for Claude Code — BLK Exchange v2.0*

| Version | 2.0 |
| :---- | :---- |
| **Date** | March 2026 |
| **Author** | Tarik Moody |

# **1\. What you are building**

| One sentence BLK Exchange is a real-time cultural stock market simulator where players trade 36 fictional Black-economy stocks driven by real cultural news and AI-generated fictional events — teaching financial literacy through gameplay, powered by Claude, Groq, Convex, and Clerk. |
| :---- |

Three modes: solo player (autonomous AI market runs 24/7), classroom (teacher-facilitated sessions), and leaderboard (weekly and season competition). The full product works with only Claude \+ Groq \+ Convex \+ Clerk — no external data sources required for a working demo.

# **2\. Complete tech stack**

| New in v2 — the Groq split Groq replaces Claude for all high-volume structured tasks. Claude handles deep reasoning only. ElevenLabs handles all TTS narration with best-in-class voice quality. This split delivers 10x faster event generation on the LLM side while using the best voice platform available. |
| :---- |

| Layer | Tool \+ purpose |
| :---- | :---- |
| Framework | Next.js 14 (App Router) \+ TypeScript |
| Backend / DB / Realtime | Convex — ALL data, realtime, scheduled functions, event queue |
| Authentication | Clerk — individual auth \+ Org API for classroom sessions |
| Deep AI reasoning | Claude claude-sonnet-4-6 — portfolio coaching, professor mode Q\&A, personalized debrief. Reserved for tasks requiring genuine reasoning depth. |
| Fast structured AI | Groq llama-3.3-70b-versatile — news classification, fictional event generation, structured JSON output. 758 tokens/sec. OpenAI-compatible API. \~$0.59/1M tokens. |
| Fast commentary | Groq llama-3.1-8b-instant — 2-sentence market event commentary. Under 400ms. \~$0.06/1M tokens. |
| TTS narration | ElevenLabs TTS API — reads market alerts, coaching summaries, debrief narration. Creator plan $22/mo (100k chars). Flash model for alerts (low latency), Multilingual v2 for debrief (premium quality). 1,200+ voices. |
| Publication scraping | Firecrawl — 12 Black cultural publications every 15 minutes (Phase 3\) |
| Semantic discovery | Exa — Black cultural news beyond the curated publication list (Phase 4\) |
| Search fallback | Tavily — fast fallback, stays free at hackathon volume (Phase 4\) |
| Styling | Tailwind CSS \+ neobrutalism.dev component overrides (shadcn/ui) |
| Charts | Recharts via neobrutalism.dev chart.json component |
| Deployment | Vercel \+ Convex Cloud |

# **3\. The AI model split — right model for the right job**

| Why two AI providers Groq runs at 758 tokens/sec vs Claude at \~60 tokens/sec. For structured JSON output (news events, commentary), Groq is 10x faster and costs 80% less. Claude's depth is reserved for tasks that genuinely need reasoning: coaching, Q\&A, personalized debrief. |
| :---- |

| Task | Model \+ rationale |
| :---- | :---- |
| Fictional news generation | Groq llama-3.3-70b-versatile — structured JSON, 10+ events/session, must be fast |
| Real news classification | Groq llama-3.3-70b-versatile — same structured JSON pattern, high frequency |
| Market event commentary | Groq llama-3.1-8b-instant — 2-sentence plain explanation, target \<400ms |
| Portfolio coaching | Claude claude-sonnet-4-6 — diversification analysis, specific recommendation, fires every 3 events |
| Professor mode Q\&A | Claude claude-sonnet-4-6 — answers any question using player's actual portfolio as example |
| Session debrief | Claude claude-sonnet-4-6 — 400-word personalized narrative, most complex output |
| TTS narration | ElevenLabs TTS — eleven\_flash\_v2\_5 for market alerts, eleven\_multilingual\_v2 for debrief narration |

Groq is OpenAI-compatible. Use the openai npm package with base URL https://api.groq.com/openai/v1 and GROQ\_API\_KEY. No new SDK needed. response\_format: { type: 'json\_object' } works exactly like OpenAI. The ELEVENLABS\_API\_KEY is separate from GROQ\_API\_KEY — ElevenLabs has its own SDK.

# **4\. Build phases — strict order**

| Discipline Each phase produces a demonstrable product. Complete Phase 2 beats broken Phase 4\. Do not skip. |
| :---- |

## **Phase 1 — Static trading floor (Days 1-2)**

Goal: Working neobrutalism dark interface with seeded data. 36 tickers live. Trades execute. Portfolio updates in real time.

1. Next.js \+ Convex \+ Clerk setup with ConvexProviderWithClerk

2. Define full Convex schema: stocks, players, holdings, trades, events, articles, companyStates, sessions, curriculumDebt

3. Seed all 36 tickers — initial prices, sector, company description, starting companyState document

4. Build market dashboard: sector bar (12 sectors), ticker table with sparklines, portfolio sidebar — full neobrutalism dark mode

5. Build trade execution: buy/sell modal, market order logic, atomic Convex mutation (validate capital → create trade → update holding → update balance)

6. Real-time P\&L via useQuery(api.market.getAllStocks) — never store prices in React state

7. Player onboarding: Clerk sign-up, $10,000 starting capital, first-time tutorial overlay

## **Phase 2 — Groq news engine \+ education layer (Days 3-4)**

Goal: Groq generates fictional events. ElevenLabs reads them aloud. Claude explains them deeply. Knowledge Vault tracks learning.

8. Build convex/groq/generateFictionalEvent.ts — llama-3.3-70b generates event JSON, reads all 36 company states for coherence, returns conceptTaught \+ plainExplanation

9. Build convex/groq/marketCommentary.ts — llama-3.1-8b generates 2-sentence commentary per event in \<400ms

10. Build Convex event scheduler: max 2 events per 10-min window, fictional fill when real queue is empty

11. Build Market Alert component: slides in (neobrutalism style), shows headline \+ movers \+ commentary, ElevenLabs reads it aloud — use eleven\_flash\_v2\_5, voice 'Rachel' or 'Charlie'

12. Build convex/claude/gradePortfolio.ts — Claude fires after every 3 events per player, returns diversification score \+ specific recommendation

13. Build convex/claude/answerQuestion.ts — professor mode, Claude answers using player's actual holdings as example

14. Build Knowledge Vault: 23 concept cards, unlock on gameplay trigger, progress bar home screen

15. Build company state system: companyStates table in Convex, Groq reads all states before generating events

16. Build curriculum debt queue: after each session, check vault vs 23 concepts, weight next generated events toward gaps

## **Phase 3 — Real news pipeline (Days 5-6)**

Goal: Real headlines from 12 Black cultural publications feed into the market. Players see both real and fictional news, labeled differently.

17. Install Firecrawl, Convex scheduled action every 15 minutes scraping all 12 publications

18. URL hash fingerprinting — new articles only, no duplicates

19. Build convex/groq/classifyArticle.ts — Groq classifies every new article: significance 1-10, tickers, concept, explanation

20. Articles scoring 6+ enter the event queue alongside fictional events

21. News feed sidebar: real headlines labeled with publication name, fictional labeled 'BLK Exchange News Desk'

22. Market Alert shows source attribution — players always know real vs generated

## **Phase 4 — Classroom \+ debrief \+ advanced news (Day 7\)**

23. Clerk Orgs for classroom: teacher creates org, students join via 6-digit code

24. Teacher dashboard: event library, manual trigger, market pause/resume, student grid

25. Build convex/claude/generateDebrief.ts — session end triggers personalized 400-word Claude narrative, ElevenLabs reads opening paragraph using eleven\_multilingual\_v2 for premium voice quality

26. Add Exa semantic discovery (every 30 min) as Layer 2 news source

27. Add Tavily fallback (fires when layers 1+2 yield \<3 articles in 30 min)

## **Phase 5 — Polish, leaderboards, demo (Day 8\)**

28. Build all 5 leaderboards: Portfolio Value, Knowledge Vault, Diversification Score, Biggest Mover, The Blueprint Award (season)

29. Build season arc: 8-week themed seasons, season championship

30. Build shareable Vault cards: concept \+ gain when learned \+ one-line insight — designed for social

31. Performance audit: Convex subscriptions scoped correctly, no unnecessary re-renders

32. Full 90-second demo run-through — verify every beat of the video script works

# **5\. Groq — exact integration patterns**

### **LLM calls (OpenAI-compatible)**

* Install: npm install openai (already in package.json if using Claude)

* base\_url: https://api.groq.com/openai/v1

* api\_key: process.env.GROQ\_API\_KEY (set in Convex environment variables)

* model for events: 'llama-3.3-70b-versatile' — best quality \+ speed balance

* model for commentary: 'llama-3.1-8b-instant' — fastest, cheapest, sufficient for 2 sentences

* response\_format: { type: 'json\_object' } for all structured output calls

* temperature: 0.8 for event generation (variety), 0.5 for classification (consistency)

* Free tier: 14,400 requests/day on Llama models — covers entire hackathon development period

### **ElevenLabs TTS integration**

* Install: npm install elevenlabs — official Node SDK

* Market alerts: use model eleven\_flash\_v2\_5 — lowest latency, 0.5 credits/char, target \<500ms first byte

* Debrief narration: use model eleven\_multilingual\_v2 — highest quality, 1 credit/char, emotionally rich

* Voice selection: 'Charlie' (confident, warm) for market alerts; 'Rachel' (clear, measured) for debrief — both free built-in voices

* Streaming: use elevenlabs.generate() with stream:true — pipe to browser Audio API for real-time playback

* TTS auto-plays for Market Alerts only; all other narration is player opt-in (accessible toggle in settings)

* Cache generated audio blobs in Convex file storage — concept explanations are static and reusable across all players

# **6\. The fictional news engine**

| Why fictional news is the right call Real news is sparse, unpredictable, and sometimes inappropriate for educational gameplay. Groq generating fictional news for fictional companies is pedagogically designed, culturally authentic, legally clean, and available 24/7. The fictional companies need fictional news — they have no real existence. |
| :---- |

## **6.1 Three event types**

| Type | Trigger \+ design intent |
| :---- | :---- |
| Concept-targeted | Fires from curriculum debt queue. Groq given a specific unlearned concept and asked to generate a fictional event that teaches it. Guarantees curriculum completion. |
| Company lifecycle | Groq reads all 36 company states and generates the next plausible business event for a given ticker. Follows revenue trend, recent events, competitive position. Coherent, not random. |
| Cultural calendar | Timed to real cultural moments: BHM campaigns (February), HBCU homecoming (October), summer festival season (July). Culturally authentic because it's correctly timed. |

## **6.2 Company state fields (companyStates table in Convex)**

| Field | Type \+ purpose |
| :---- | :---- |
| sym | string — ticker symbol, indexed |
| revenueTrend | 'growing' | 'stable' | 'declining' |
| recentEvents | array of last 3 event titles — prevents contradictory headlines |
| marketPosition | 'leader' | 'challenger' | 'niche' |
| competitiveExposure | array of ticker symbols that are direct rivals |
| lastEventType | 'earnings' | 'product' | 'partnership' | 'personnel' | 'macro' — prevents repetition |
| seasonalContext | current cultural calendar period |

## **6.3 Curriculum debt queue**

After every session: Convex mutation checks player's Knowledge Vault against all 23 concept IDs. Any concept not yet unlocked enters curriculumDebt array. Next 1-3 generated events weighted to clear oldest debt. No player completes a season with gaps in their financial literacy education. This is the guarantee that makes BLK Exchange a learning product, not just a game.

# **7\. Complete 36-ticker universe**

All companies are fictional archetypes grounded in Black cultural reality. Prices stored in cents internally. Starting price shown in dollars.

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| LOUD | Podcast & media network | Media / $42 |
| SCROLL | Digital media & newsletter platform | Media / $28 |
| VERSE | Literary & spoken word platform | Media / $19 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| VIZN | Black-owned streaming platform | Streaming / $78 |
| NETFLO | Corporate mega-streaming platform | Streaming / $142 |
| LIVE | Live event streaming platform | Streaming / $31 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| RYTHM | Music streaming & distribution | Music / $61 |
| BLOC | Independent record label | Music / $34 |
| CRATE | Music discovery platform | Music / $18 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| PIXL | Black-owned game studio | Gaming / $88 |
| MOBILE | Mobile gaming platform | Gaming / $44 |
| SQUAD | Esports org & content platform | Gaming / $56 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| KICKS | Performance athletic footwear brand | Sportswear / $112 |
| FLEX | Athletic apparel line | Sportswear / $47 |
| COURT | Sports equipment & training brand | Sportswear / $33 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| DRIP | Established streetwear brand | Fashion / $65 |
| RARE | Limited-drop hype brand | Fashion / $94 |
| THREAD | Custom apparel & creator merch | Fashion / $22 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| INK | Black book publishing house | Publishing / $38 |
| READS | Digital reading & audio platform | Publishing / $51 |
| PRESS | Independent press & literary network | Publishing / $17 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| CROWN | Natural hair care brand | Beauty / $47 |
| GLOW | Skincare & wellness brand | Beauty / $31 |
| SHEEN | Black salon chain | Beauty / $24 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| VAULT | Black community bank | Finance / $52 |
| STAX | Black fintech & payments app | Finance / $68 |
| GROW | CDFI & community lending fund | Finance / $29 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| BLOK | Real estate investment trust | Real Estate / $94 |
| BUILD | Infrastructure & construction co | Real Estate / $67 |
| HOOD | Affordable housing developer | Real Estate / $33 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| DRAFT | Athlete representation agency | Sports / $58 |
| ARENA | Sports venue & events company | Sports / $71 |
| STATS | Sports analytics & media platform | Sports / $44 |

| Ticker | Company archetype | Sector / Starting price |
| :---- | :---- | :---- |
| SCREEN | Black film production studio | Entertainment / $83 |
| STAGE | Live events & venue company | Entertainment / $49 |
| GAME | Gaming & esports company | Entertainment / $37 |

# **8\. Publications for real news pipeline**

| Publication | URL \+ primary tickers triggered |
| :---- | :---- |
| AfroTech | afrotech.com — CTRL, STAX, VAULT, MOVE, PIXL |
| Essence | essence.com — CROWN, GLOW, LUXE, RYTHM, DRIP, RARE |
| Black Enterprise | blackenterprise.com — VAULT, BLOK, CTRL, BUILD, GROW |
| TheGrio | thegrio.com — LOUD, VIZN, RYTHM, BLOC, SCREEN, DRAFT |
| The Root | theroot.com — VAULT, SOULFOOD, GRND, CROWN, GROW |
| Blavity | blavity.com — CTRL, MOVE, LOUD, BLOC, STAX |
| HBCUBuzz | hbcubuzz.com — VAULT, BLOK, BUILD, INK, ARENA, DRAFT |
| Andscape | andscape.com — RYTHM, SCREEN, SQUAD, STATS, DRAFT |
| Vibe | vibe.com — RYTHM, BLOC, RARE, DRIP, GAME, PIXL |
| Rolling Out | rollingout.com — CROWN, GLOW, SHEEN, GRND, SOULFOOD |
| EURweb | eurweb.com — SCREEN, STAGE, VIZN, LOUD, SCROLL |
| Invest Fest / Black events | investfest.com — FEAST, GRND, LOUD, VIZN, STAGE, SCROLL |

# **9\. Design system — neobrutalism dark mode**

| Reference neobrutalism.dev — shadcn/ui component overrides. Visit https://www.neobrutalism.dev. The \--radius: 0rem and white border/shadow system gives BLK Exchange a visual identity unlike any other Hackonomics entry. |
| :---- |

### **Install commands**

* pnpm dlx shadcn@latest init — CSS variables, dark theme

* Replace globals.css with BLK Exchange tokens

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/button.json

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/card.json

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/badge.json

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/table.json

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/tabs.json

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/chart.json

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/input.json

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/dialog.json

* pnpm dlx shadcn@latest add https://neobrutalism.dev/r/progress.json

### **Critical globals.css rules**

* \--background: 7 7% 6% → \#0e0e0e

* \--card: 0 0% 10% → \#1a1a1a

* \--primary: 244 62% 67% → \#7F77DD (brand purple)

* \--accent: 52 98% 64% → \#FDE047 (Knowledge Vault ONLY)

* \--border: 0 0% 100% → \#ffffff (ALL borders are white)

* \--radius: 0rem — HARD CORNERS everywhere, non-negotiable

* \--blk-shadow: 4px 4px 0px 0px \#ffffff — the neobrutalism signature

* \--blk-font: 'Courier New', monospace — ALL typography, not just prices

* Global rule: \* { border-radius: 0 \!important }

* Global rule: body { font-family: 'Courier New', monospace }

* Interactive hover: transform: translate(2px,2px) \+ shadow reduces from 4px to 2px

# **10\. Environment variables**

| Variable | Source |
| :---- | :---- |
| NEXT\_PUBLIC\_CONVEX\_URL | Convex dashboard |
| NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY | Clerk dashboard |
| CLERK\_SECRET\_KEY | Clerk dashboard |
| CLERK\_JWT\_ISSUER\_DOMAIN | Clerk JWT template for Convex |
| ANTHROPIC\_API\_KEY | Anthropic console — Convex actions only, never client-side |
| GROQ\_API\_KEY | console.groq.com — LLM only (event generation, classification, commentary). Convex actions only. |
| ELEVENLABS\_API\_KEY | elevenlabs.io — TTS only. Convex actions only, never client-side. Creator plan recommended for hackathon. |
| FIRECRAWL\_API\_KEY | Firecrawl dashboard — Phase 3 |
| EXA\_API\_KEY | exa.ai dashboard — Phase 4 |
| TAVILY\_API\_KEY | tavily.com — Phase 4, free tier sufficient |

# **11\. Demo script — 90-second hackathon video**

| The video is the submission Hackonomics judges score the 1-2 minute demo video. Every second must show something working and impressive. |
| :---- |

33. Open the dashboard — neobrutalism dark interface: 12-sector bar, 36 tickers with sparklines, portfolio sidebar

34. Show Groq generating a fictional event: 'BLK Exchange News Desk: CROWN announces Q3 earnings miss — competitive pressure from new entrant'

35. Watch 5 stocks move simultaneously — CROWN \-11%, GLOW \+4%, SHEEN \-3%, RARE \+2%

36. Market Alert slides in — ElevenLabs reads it aloud: 'CROWN missed earnings because a competitor took market share. That's competitive displacement.'

37. Show Knowledge Vault: 'Competitive displacement' badge unlocks, vault counter ticks from 7 to 8

38. Execute a trade: buy GLOW after the CROWN miss — portfolio P\&L goes green

39. Open Portfolio Coach: 'You are 65% Beauty sector. That worked today. Here's why it's a risk next session.' — Claude, not Groq

40. Show session debrief: Claude's narrative, ElevenLabs reads the opening paragraph

Total: under 90 seconds. No dead air. The product speaks.