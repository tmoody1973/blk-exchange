## Inspiration

For every $100 in wealth held by White families, Black families hold $15. Only 18% of Black households own stocks. The TIAA Institute found that Black Americans score 37% on financial literacy questions compared to 55% for White Americans, and that gap persists even when controlling for education level.

The tools that exist to teach investing trade Apple and Tesla with Bloomberg news. They assume a familiarity with the stock market that millions of Black Americans don't have. People watch Earn Your Leisure, follow finance accounts, absorb the information. But consumption doesn't translate to practice. There's nowhere to practice investing in a context that feels familiar.

I wrote a research paper with 28 peer-reviewed citations and found three things: game-based learning measurably improves financial literacy, culturally responsive education produces better outcomes for Black students, and structured curriculum through gameplay guarantees concept exposure. No existing platform combines all three. So I built one.

## What it does

BLK Exchange is a stock market simulator where players trade 36 fictional companies across 12 sectors of the Black economy: CROWN (hair care), KICKS (footwear), DRIP (streetwear), VIZN (streaming), VAULT (community bank), and 31 more. Players start with $10,000 in virtual cash.

Real cultural news from 16 Black media publications (AfroTech, Essence, Blavity, Black Enterprise, The Root, and others) moves the market. When a headline drops, stock prices change. Two AI systems work together during gameplay: Groq generates market events and classifies news to tickers at 758 tokens/sec, and Claude coaches players through portfolio decisions, answers investing questions using their actual holdings, and writes personalized session debriefs.

The Knowledge Vault tracks 23 investing concepts across 4 tiers (Foundation, Intermediate, Advanced, Economics). Concepts unlock automatically through gameplay, not reading. When a player holds 4+ sectors, the game recognizes they practiced diversification and teaches the concept. A curriculum debt queue tracks which concepts each player hasn't encountered and biases event generation toward those gaps.

Players compete on 5 leaderboards: Portfolio Value, Diversification Score, Knowledge Vault, Biggest Mover, and The Blueprint Award. 8-week seasons with weekly resets keep the competition fresh.

A feature in development called The Real Exchange will introduce the 8 real Black-owned publicly traded companies (Urban One, Carver Bancorp, Broadway Financial, Direct Digital Holdings, and others) alongside the sim tickers, trading at real market prices from Financial Modeling Prep. The capstone is the NAACP Minority Empowerment ETF, the only ETF designed with a civil rights organization.

The app includes a Parents & Educators guide with curriculum-aligned lesson plans, weekly discussion questions, a 4-week unit for classrooms, and a 3-day workshop model for community organizations.

## How we built it

I'm the Director of Strategy and Innovation at Radio Milwaukee, an NPR station. I'm a Howard University graduate (Architecture, Class of 1996). I am not a software developer.

I built the entire platform in one week using Claude Code, an AI coding tool from Anthropic. I described what I wanted and the AI wrote the code. The architecture:

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui with neobrutalism overrides
- **Backend:** Convex (real-time database + serverless functions, 17-table schema)
- **Auth:** Clerk with Google OAuth
- **AI (Deep Reasoning):** Claude Sonnet 4.6 for portfolio grading, session debriefs, and Q&A
- **AI (Fast Inference):** Groq llama-3.3-70b for event generation, article classification, and market commentary
- **News Pipeline:** Firecrawl (scraping 16 publications) + Perplexity Sonar (AI-powered discovery with 10 query categories)
- **TTS:** ElevenLabs Flash v2.5 for voice narration of market alerts
- **Hosting:** Vercel + Convex Cloud
- **PWA:** Service worker, animated splash screen, offline fallback, mobile install prompt

The demo video was built with Remotion (React-based video framework) with ElevenLabs voiceover.

## Challenges we ran into

The biggest challenge was getting Clerk authentication to work in Vercel's Edge Runtime for production. The middleware kept throwing 500 errors because `auth.protect()` behaves differently in Clerk v5 production mode than in development. Took several iterations to get the right pattern.

The news pipeline was tricky. Firecrawl scraping initially pulled navigation links and category pages instead of actual article headlines. The title extraction function needed multiple rounds of filtering to distinguish real headlines from site chrome. Firecrawl credits also ran out mid-hackathon, requiring a pivot to Perplexity as the primary news source.

Getting Claude to return clean JSON for the portfolio coach was a recurring issue. Even with explicit "no markdown, raw JSON only" instructions, the model would sometimes wrap responses in code fences. Had to add a stripping layer to clean the output before parsing.

The leaderboard system had a duplicate entry bug where each weekly reset created new rows instead of updating existing ones, causing players to appear multiple times with $0 values. Required a full data repair mutation to clean up.

## Accomplishments that we're proud of

The curriculum debt queue. No other financial literacy platform guarantees that every player encounters every concept. The system tracks what you haven't learned yet and generates events targeting those gaps. You can't finish BLK Exchange without being exposed to all 23 investing concepts, from supply and demand to generational wealth.

The research paper. 28 peer-reviewed citations across financial literacy disparities, game-based learning, and culturally responsive education. This isn't a weekend hack with a pitch deck. The design decisions are grounded in published research.

The fact that it works. A non-developer built a real-time stock market simulator with dual AI coaching, a 17-table database, a news pipeline scraping 16 publications, 5 leaderboards, a Knowledge Vault with 23 concepts, shareable OG cards, a PWA with offline support, and a Parents & Educators guide with curriculum-aligned lesson plans. In one week. With AI. The barrier between "I have an idea" and "I have a product" is gone.

## What we learned

Cultural relevance is not a design feature. It's the load-bearing wall of effective financial education for Black Americans. When the tickers are CROWN and KICKS instead of Apple and Tesla, people engage differently. The research predicted this. Seeing it work confirms it.

AI coding tools fundamentally change who can build products. I'm a 1996 Howard Architecture grad who works in public radio. A year ago I could not have built this. The engineering barrier is genuinely gone for anyone willing to sit with the tools and think clearly about what they want to build.

The hardest part of building a financial literacy tool is not the technology. It's deciding what to teach, in what order, and how to make sure the learner actually encounters it. The curriculum design took more thought than the code.

## What's next for BLK Exchange (BLKx)

**The Real Exchange:** Introducing 8 real Black-owned publicly traded companies (Urban One, Carver Bancorp, Broadway Financial, Direct Digital Holdings, and others) trading at real market prices via Financial Modeling Prep API. Each company revealed through a story-driven bridge tied to the player's most-traded sectors. The NAACP Minority Empowerment ETF as the graduation capstone.

**Investment Clubs:** 3-5 player clubs with shared portfolios and a proposal-vote-execute trading system. Members propose trades, vote, and execute together. Mirrors real-world investment clubs in the Black community.

**Shareable Cards:** Branded share cards for concept unlocks, portfolio milestones, and session debriefs using html2canvas with AI-generated card backgrounds. Every share promotes blkexchange.com.

**Guest Demo Mode:** Try BLK Exchange without signing up. One trade, one AI event, then a signup gate. The app sells itself before asking for commitment.

**HBCU Outreach:** Getting BLK Exchange into classrooms at HBCUs using the built-in Parents & Educators guide. The 4-week unit plan and semester companion model are ready.

**Media Outreach:** Press release and personalized pitch emails prepared for AfroTech, Essence, The Root, Black Enterprise, POCIT, Howard University Newsroom, and Milwaukee Journal Sentinel.
