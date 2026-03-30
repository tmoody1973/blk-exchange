# BLK Exchange Demo Video Plan

## Overview
- Length: 2:30 target (2:00 min, 3:00 max)
- Tools: Remotion.dev (React video framework), ElevenLabs (voiceover)
- Purpose: Hackonomics 2026 submission demo
- Tone: Confident, warm, not salesy. Let the product speak.

---

## Video Structure (Scene by Scene)

### ACT 1: THE PROBLEM (0:00 - 0:35)

**Scene 1: The Stats** (0:00 - 0:15)
- Black screen. Numbers animate in one at a time, large white Courier New text.
- "$15 for every $100" (pause)
- "37% vs 55%" (pause)
- "Only 18% own stocks"
- VO delivers the context behind each number

**Scene 2: The Status Quo** (0:15 - 0:35)
- Split screen: left shows generic simulator (Investopedia-style with Apple/Tesla), right shows a young person scrolling EYL on their phone
- Text overlay: "The tools exist. They just weren't built for us."
- VO explains the consumption-to-action gap

### ACT 2: THE SOLUTION (0:35 - 1:30)

**Scene 3: Introducing BLK Exchange** (0:35 - 0:45)
- Logo animation: BLKX fades in on black background
- Tagline types out: "Learn to Invest. Trade the Culture."
- Landing page screenshot fades in behind it

**Scene 4: The Market** (0:45 - 1:00)
- Screen recording: scrolling through the market view
- Sector marquee moving at top
- Ticker table with prices changing
- VO names specific tickers: "CROWN, KICKS, DRIP, VIZN, VAULT"
- Text callout: "36 companies. 12 sectors. All Black economy."

**Scene 5: Making a Trade** (1:00 - 1:10)
- Screen recording: tapping a ticker, opening trade modal, executing a buy
- VO: "Start with $10,000. Buy what you believe in."

**Scene 6: The AI Event** (1:10 - 1:20)
- Screen recording: a market alert drops in real time
- News item appears in the feed
- Price changes on the ticker
- VO explains: news moves the market, AI explains why

**Scene 7: The Knowledge Vault** (1:20 - 1:30)
- Screen recording: scrolling through the vault
- A concept card unlocking (e.g., "Diversification")
- Progress bar filling
- Text callout: "23 investing concepts. Unlocked by playing, not reading."

### ACT 3: THE RESEARCH (1:30 - 1:50)

**Scene 8: Research Foundation** (1:30 - 1:50)
- Clean slide: "Built on Research, Not Assumptions"
- Three pillars animate in:
  1. "Game-Based Learning" + citation
  2. "Culturally Responsive Education" + citation
  3. "Structured Curriculum Through Play" + citation
- Text: "28 peer-reviewed studies"
- VO delivers the key finding: cultural adaptation makes financial education measurably more effective

### ACT 4: THE VISION (1:50 - 2:15)

**Scene 9: The Real Exchange** (1:50 - 2:05)
- Text: "Only 8 Black-owned companies are publicly traded."
- Show the 8 real tickers appearing next to sim tickers
- NACP ETF as capstone
- VO: "From sim to real. The education pipeline doesn't end at 'you learned something.'"

**Scene 10: Who Built This** (2:05 - 2:15)
- Photo of Tarik (or just text/graphic)
- "Tarik Moody"
- "Howard University '96 / Radio Milwaukee / Not a Developer"
- "Built in one week with Claude Code"
- VO: brief personal note about building this for his community

### ACT 5: CLOSE (2:15 - 2:30)

**Scene 11: Call to Action** (2:15 - 2:30)
- Logo: BLKX centered
- URL: blkexchange.com
- "Hackonomics 2026"
- "Black culture IS an economy. BLK Exchange treats it like one."
- Music swells, fade to black

---

## Voiceover Script (ElevenLabs)

Voice: Male, warm, confident, conversational. Not announcer-voice. Think EYL podcast energy.

ElevenLabs voice: Try "Adam" or "Antoni" or create a custom voice.

```
For every hundred dollars a White family holds in wealth, a Black family holds fifteen.

Black Americans score 37% on financial literacy questions. White Americans score 55%. And here's what makes it worse: even with a college degree, the gap doesn't close.

The tools that exist to teach investing? They trade Apple and Tesla with Bloomberg news. They assume you already care about the S&P 500. They assume a context that most young Black investors just don't have.

People watch Earn Your Leisure. They follow finance accounts. They absorb the information. But watching isn't practice. And there's nowhere to practice in a context that actually feels familiar.

Until now.

This is BLK Exchange. A stock market simulator where Black culture is the economy.

36 fictional companies across 12 sectors. CROWN, a natural hair care brand. KICKS, athletic footwear. DRIP, streetwear. VIZN, a Black-owned streaming platform. VAULT, a community bank.

You start with ten thousand dollars in virtual cash. You trade what you know.

Real cultural news from Black media publications moves the market. When a headline drops, prices change. And when they change, AI explains what just happened and what you just learned.

The Knowledge Vault tracks your progress. 23 investing concepts, from supply and demand to generational wealth. You don't unlock them by reading a textbook. You unlock them by trading.

This isn't a guess. BLK Exchange is built on research.

Three evidence-backed pillars. Game-based learning improves financial literacy. Culturally responsive education produces better outcomes for Black students. And structured curriculum through gameplay guarantees every player encounters every concept. 28 peer-reviewed studies back this approach.

And here's where it gets real. Only 8 Black-owned companies are publicly traded on major U.S. exchanges. Eight. A feature in development called The Real Exchange will introduce those companies alongside the sim. Urban One. Carver Bancorp. Broadway Financial. And the NAACP Minority Empowerment ETF.

From simulation to reality. The education pipeline doesn't end at "you learned something." It ends at "you're actually investing."

I'm Tarik Moody. Howard University, Class of '96. Director of Strategy and Innovation at Radio Milwaukee. I'm not a software developer. I built this in one week using Claude Code. Because I couldn't find the financial literacy tool I wanted for my own community. So I built it.

Black culture is an economy. BLK Exchange treats it like one.

blkexchange.com
```

Word count: ~340 words. At conversational pace (~140 words/min), this runs about 2:25.

---

## Asset List for Remotion

### Screenshots / Screen Recordings (capture these first)

| # | Asset | Source | Format | Notes |
|---|-------|--------|--------|-------|
| 1 | Landing page hero | blkexchange.com | PNG 1920x1080 | Clean, no install prompt |
| 2 | Market view scrolling | /market (logged in) | MP4 screen recording | 10-15 sec, show ticker prices moving |
| 3 | Sector marquee close-up | /market top bar | MP4 screen recording | 5 sec loop |
| 4 | Trade modal execution | /market, tap any ticker | MP4 screen recording | Show the full buy flow |
| 5 | Market alert dropping | /market, wait for event | MP4 screen recording | Or trigger manually in dev |
| 6 | News feed with articles | /market news section | MP4 screen recording | Scroll through |
| 7 | Knowledge Vault overview | /vault | PNG 1920x1080 | Show progress + concept tiers |
| 8 | Concept card unlocking | /vault | MP4 screen recording | If possible, show one unlocking |
| 9 | Portfolio coach output | /portfolio | PNG 1920x1080 | Show the AI coaching card |
| 10 | Session debrief | /profile | PNG 1920x1080 | Show AI-generated debrief text |
| 11 | Leaderboard | /boards | PNG 1920x1080 | Show competition |

### Static Graphics (create in Figma, Canva, or generate with code)

| # | Asset | Description | Format |
|---|-------|------------|--------|
| 12 | BLKX logo | Already exists at public/icons/icon-512.png | PNG |
| 13 | Stats slide: "$15 / $100" | Large white text on black, Courier New | PNG or Remotion component |
| 14 | Stats slide: "37% vs 55%" | Same style | PNG or Remotion component |
| 15 | Stats slide: "Only 18%" | Same style | PNG or Remotion component |
| 16 | "The Problem" title card | Black bg, white text | PNG or Remotion component |
| 17 | Research pillars slide | Three columns with pillar names | PNG or Remotion component |
| 18 | "28 peer-reviewed studies" callout | Accent color (purple or yellow) | PNG or Remotion component |
| 19 | Real tickers slide | 8 company names + NACP | PNG or Remotion component |
| 20 | Tarik bio card | Name, Howard '96, Radio Milwaukee | PNG or Remotion component |
| 21 | Final CTA card | BLKX logo + blkexchange.com + Hackonomics 2026 | PNG or Remotion component |
| 22 | Generic simulator mockup | Investopedia/MarketWatch style (for comparison) | PNG |

### Audio

| # | Asset | Source | Format |
|---|-------|--------|--------|
| 23 | Voiceover | ElevenLabs, script above | MP3/WAV |
| 24 | Background music | Royalty-free, subtle beat, not distracting. Try: Epidemic Sound, Artlist, or YouTube Audio Library. Something with a calm hip-hop/lo-fi feel. | MP3 |
| 25 | Transition sound | Subtle whoosh or click for scene changes | MP3 |

### Fonts

| # | Asset | Notes |
|---|-------|-------|
| 26 | Courier New Bold | Main brand font, already in the app |
| 27 | Inter or system sans-serif | For smaller body text if needed |

---

## Remotion Project Structure

```
demo-video/
├── src/
│   ├── Root.tsx                    # Video composition definition
│   ├── Video.tsx                   # Main sequence
│   ├── scenes/
│   │   ├── StatsScene.tsx          # Animated stat numbers
│   │   ├── StatusQuoScene.tsx      # Generic vs BLK comparison
│   │   ├── IntroScene.tsx          # Logo + tagline animation
│   │   ├── MarketScene.tsx         # Screen recording overlay
│   │   ├── TradeScene.tsx          # Trade execution recording
│   │   ├── EventScene.tsx          # AI event dropping
│   │   ├── VaultScene.tsx          # Knowledge Vault recording
│   │   ├── ResearchScene.tsx       # Three pillars + citations
│   │   ├── RealExchangeScene.tsx   # 8 real companies
│   │   ├── BuilderScene.tsx        # Tarik bio
│   │   └── CTAScene.tsx            # Final card
│   ├── components/
│   │   ├── AnimatedText.tsx        # Typewriter / fade-in text
│   │   ├── StatNumber.tsx          # Animated counter
│   │   ├── ScreenRecording.tsx     # Video overlay with device frame
│   │   └── BrandFrame.tsx         # Consistent border/bg treatment
│   └── assets/
│       ├── screenshots/            # PNGs from above
│       ├── recordings/             # MP4s from above
│       ├── audio/
│       │   ├── voiceover.mp3
│       │   └── background.mp3
│       └── logo.png
├── package.json
└── remotion.config.ts
```

---

## Production Checklist

### Step 1: Capture screen recordings
- [ ] Log into blkexchange.com on desktop (1920x1080)
- [ ] Use QuickTime or OBS to record each screen flow
- [ ] Record mobile view too (iPhone frame) for at least one scene
- [ ] Make sure there's activity in the market (events firing, prices moving)

### Step 2: Generate voiceover
- [ ] Go to elevenlabs.io
- [ ] Paste the script above
- [ ] Choose a voice (try "Adam" for warm male, or clone your own)
- [ ] Generate, download MP3
- [ ] Time it: should be ~2:20-2:30

### Step 3: Find background music
- [ ] YouTube Audio Library (free): search "lo-fi hip hop" or "chill beat"
- [ ] Keep it subtle, lower volume than voiceover
- [ ] Download MP3

### Step 4: Set up Remotion project
- [ ] npx create-video@latest demo-video
- [ ] Configure 1920x1080, 30fps
- [ ] Build each scene as a React component
- [ ] Sync scenes to voiceover timing

### Step 5: Render and export
- [ ] npx remotion render src/index.ts Video out/blk-exchange-demo.mp4
- [ ] Review for timing, pacing, audio sync
- [ ] Upload to YouTube (unlisted) or Devpost

---

## Timing Guide (voiceover sync)

| Time | Scene | VO Line (first words) |
|------|-------|-----------------------|
| 0:00 | Stats | "For every hundred dollars..." |
| 0:15 | Status Quo | "The tools that exist..." |
| 0:35 | Intro | "Until now. This is BLK Exchange." |
| 0:45 | Market | "36 fictional companies..." |
| 1:00 | Trade | "You start with ten thousand..." |
| 1:10 | AI Event | "Real cultural news..." |
| 1:20 | Vault | "The Knowledge Vault tracks..." |
| 1:30 | Research | "This isn't a guess..." |
| 1:50 | Real Exchange | "And here's where it gets real..." |
| 2:05 | Builder | "I'm Tarik Moody..." |
| 2:15 | CTA | "Black culture is an economy..." |
| 2:25 | End | Fade to black |

---

## Tips

- **Screen recordings are the hardest part.** Do these first. Everything else can be built around them.
- **Remotion tip:** Use `<Sequence from={frame}>` to offset each scene. Use `<Audio src={voiceover}/>` at the root level for the voiceover track.
- **Don't over-animate.** The product IS the visual. Let the screen recordings breathe. Text animations should be simple: fade in, slide up, typewriter.
- **The research section should feel different.** Slow down. Use a cleaner layout. This is where you earn credibility. Don't rush it.
- **End strong.** The last thing judges see is "Black culture IS an economy. BLK Exchange treats it like one." Make it linger for 3 seconds on screen.
 