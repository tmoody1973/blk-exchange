# BLK Exchange — Onboarding & Glossary System Implementation Spec

**Document purpose:** This is a Claude Code implementation directive. It specifies the complete onboarding flow, glossary chip component system, and Knowledge Vault integration for BLK Exchange. Follow this spec precisely when building these features.

---

## 1. DESIGN PHILOSOPHY

The onboarding system follows one rule: **teach through gameplay, never before it.**

There are three layers that work together:
1. **Layer 1 — Guided First Trade:** Drop the player into their first event within 10 seconds of arriving. No tutorial screens, no carousels, no "how to play" modals.
2. **Layer 2 — Glossary Chips:** Contextual inline term definitions that appear only on first encounter, then fade to passive references.
3. **Layer 3 — Knowledge Vault as Earned Glossary:** Every term a player learns through gameplay becomes a permanent card in their Vault, reframing "learning terminology" as game progression.

**Anti-patterns to avoid:**
- Tutorial screens or walkthrough carousels before gameplay
- Tooltips on everything simultaneously (cognitive overload)
- A separate glossary page the player has to navigate to
- Forcing players to read before they can act
- Modal dialogs that interrupt event flow

---

## 2. GUIDED FIRST TRADE FLOW

### 2.1 Flow Overview

The first-time player experience consists of 4 micro-steps that should complete in under 90 seconds:

```
STEP 1: Capital Introduction (5 sec)
  → "$10,000 — Your Starting Capital"
  → "News moves markets. Your job? Read the headlines, make the calls."
  → Single CTA: "DROP FIRST EVENT"

STEP 2: First Event (decision window: 60 sec)
  → Breaking news banner with countdown timer
  → Event card: curated first event (always the same for new players)
  → Live ticker showing price movement
  → Two actions: "I WANT TO BUY" / "SKIP THIS EVENT"

STEP 3: Trade Execution (player-paced)
  → Dollar amount input with quick-select buttons ($100, $500, $1000, $2500)
  → Position preview (shares you'd get, % of portfolio)
  → "CONFIRM BUY" button

STEP 4: Result + First Lesson (5 sec)
  → Trade confirmation with details
  → First curriculum concept delivered in context (Diversification)
  → CTA to continue to next event
```

### 2.2 First Event — Curated Seed Event

The first event every new player sees should be **hardcoded, not generated.** This ensures a consistent, optimized first impression.

**Recommended seed event:**

```typescript
const SEED_FIRST_EVENT: GameEvent = {
  id: "onboarding-001",
  type: "company_lifecycle",
  sector: "food_beverage",
  companyTicker: "SOUL",
  companyName: "SoulFood Capital",
  headline: "SoulFood Capital Lands Nationwide Grocery Deal",
  body: "SoulFood Capital (SOUL) just secured a distribution deal with a major national grocery chain. Their stock is already moving. A deal this big usually means more revenue and higher share prices.",
  sentiment: "bullish",
  priceImpact: { direction: "up", magnitude: "moderate" }, // +3-7%
  curriculumConcept: null, // first event is about action, not teaching
  glossaryTerms: ["stock", "share-price"], // terms to chip in the body text
};
```

**Why this event works:**
- Food sector is universally relatable (everyone eats)
- "Grocery deal" is immediately understandable — no financial jargon needed to grasp it
- Bullish sentiment means the "right" move is obvious (buy) — reduces decision anxiety
- SoulFood Capital as a company name is culturally resonant and memorable

### 2.3 Subsequent Events

After the first trade, the player enters the normal game loop. The **second event** should be a different sector with a bearish or neutral signal to introduce the idea that not every event is a buy signal. The **third event** should target the first curriculum concept from the debt queue.

```
Event 1: Hardcoded bullish → teaches "buying"
Event 2: Generated neutral/bearish → teaches "sometimes you skip"
Event 3: Curriculum-targeted → first formal concept delivery
```

### 2.4 Onboarding State Machine

```typescript
type OnboardingState =
  | "new_player"           // never completed a trade
  | "first_event_seen"     // saw first event, hasn't traded
  | "first_trade_complete" // completed first trade
  | "onboarding_complete"; // completed 3 events (enters normal loop)

// Convex schema addition
const onboardingStatus = defineTable({
  userId: v.id("users"),
  state: v.union(
    v.literal("new_player"),
    v.literal("first_event_seen"),
    v.literal("first_trade_complete"),
    v.literal("onboarding_complete")
  ),
  firstTradeTimestamp: v.optional(v.number()),
  eventsCompleted: v.number(), // 0-3 during onboarding
  seedEventId: v.string(),
});
```

### 2.5 UI States During Onboarding

**Capital Introduction Screen:**
- Full-screen centered layout
- Large "$10,000" number as hero element
- Minimal copy: 2-3 lines max
- Single purple CTA button with neobrutalism shadow
- No navigation, no menu, no distractions

**Event Card During Onboarding:**
- Identical to normal event card (no special "tutorial" styling)
- Breaking news banner at top with red background and pulse animation
- Countdown timer in banner (60 seconds)
- Glossary chips active on terms in the event body
- Buy button is prominent green; Skip is de-emphasized (transparent bg, low opacity)

**Trade Execution Screen:**
- Large dollar input field, centered
- Quick-select amount buttons in a row
- Real-time position preview showing shares and portfolio percentage
- Confirm button only activates when amount > 0 and ≤ balance
- Subtle glossary chip on "market order" below the input

**Result Screen:**
- Checkmark icon + "TRADE EXECUTED" in green
- Trade details in a bordered card (shares, price, total)
- First curriculum nudge delivered as a casual inline message, not a modal
- Uses glossary chip on the curriculum term (e.g., "Diversification")
- CTA to continue

---

## 3. GLOSSARY CHIP COMPONENT

### 3.1 Component Specification

The `GlossaryChip` is an inline component that wraps financial terms in event text, trade screens, and result messages. It has two visual states based on whether the player has previously encountered the term.

```typescript
interface GlossaryChipProps {
  termId: string;           // key into the glossary data store
  children: React.ReactNode; // the display text (may differ from term name)
}
```

### 3.2 Visual States

**State A: UNSEEN (first encounter)**
```
Appearance:
  - Background: #2A2A2A (medGray)
  - Border: 2px solid #FDE047 (yellow)
  - Box-shadow: 2px 2px 0px #FDE047
  - Text color: #FDE047 (yellow)
  - Font: Courier New, monospace, bold, inherit size from parent
  - Padding: 1px 8px
  - Trailing "?" indicator (10px, 70% opacity)
  - Cursor: pointer

Behavior:
  - Tappable/clickable
  - On tap: opens definition popover above the chip
  - After 1.5 seconds of popover being open: marks term as "seen"
  - Term gets added to Knowledge Vault
```

**State B: SEEN (already learned)**
```
Appearance:
  - Background: transparent
  - Border: none
  - Box-shadow: none
  - Text color: #E5E5E5 (lightGray)
  - Text decoration: underline dotted
  - Underline offset: 3px
  - No "?" indicator
  - Cursor: pointer

Behavior:
  - Still tappable (reference lookup)
  - On tap: opens same definition popover
  - Does NOT re-add to vault or re-trigger vault animation
```

### 3.3 Definition Popover

```
Position: absolute, above the chip (bottom: calc(100% + 8px))
Width: 280px
Background: #1A1A1A (darkGray)
Border: 2px solid #7F77DD (purple)
Box-shadow: 4px 4px 0px #7F77DD
Padding: 12px 14px
Font: Courier New, monospace, 13px
Z-index: 100

Content layout:
  [CONCEPT CATEGORY]    — 10px, uppercase, 1.5px letter-spacing, purple
  [TERM NAME]           — 14px, bold, white, 6px margin-bottom
  [SHORT DEFINITION]    — 13px, 1.5 line-height, lightGray
  [VAULT STATUS]        — 10px, yellow, only shown on first encounter
                          "✦ Adding to Knowledge Vault..."
```

### 3.4 Glossary Data Store

```typescript
// Convex schema
const glossaryTerms = defineTable({
  termId: v.string(),        // e.g., "market-order"
  term: v.string(),          // e.g., "Market Order"
  concept: v.string(),       // curriculum concept name, e.g., "Order Types"
  conceptId: v.string(),     // links to curriculum concept
  shortDef: v.string(),      // 1-2 sentence definition (max 120 chars)
  longDef: v.optional(v.string()), // expanded definition for Vault card view
});

// Player's seen terms (per-user state)
const playerGlossary = defineTable({
  userId: v.id("users"),
  termId: v.string(),
  firstSeenAt: v.number(),   // timestamp
  firstSeenInEvent: v.optional(v.string()), // event ID where they first saw it
  seenCount: v.number(),     // how many times they've tapped the chip
}).index("by_user", ["userId"]);
```

### 3.5 Initial Glossary Dataset

Here are the terms that should ship with the MVP, mapped to the 23 curriculum concepts:

```typescript
const GLOSSARY_TERMS = [
  // Core Trading
  { termId: "stock", term: "Stock", concept: "Equity Ownership", shortDef: "A share of ownership in a company. Own stock = own a piece." },
  { termId: "share-price", term: "Share Price", concept: "Market Pricing", shortDef: "What one share costs right now. It moves based on news and demand." },
  { termId: "market-order", term: "Market Order", concept: "Order Types", shortDef: "Buy or sell immediately at the current price. No waiting." },
  { termId: "portfolio", term: "Portfolio", concept: "Portfolio Management", shortDef: "Your collection of all investments. Think of it as your financial lineup." },
  { termId: "position", term: "Position", concept: "Position Sizing", shortDef: "How much of one stock you hold. A bigger position = more riding on it." },
  { termId: "fractional-shares", term: "Fractional Shares", concept: "Fractional Investing", shortDef: "Buying a piece of a share instead of a whole one. Invest any dollar amount." },

  // Risk & Strategy
  { termId: "diversification", term: "Diversification", concept: "Risk Management", shortDef: "Don't put all your eggs in one basket. Spread investments across sectors." },
  { termId: "volatility", term: "Volatility", concept: "Risk Assessment", shortDef: "How wildly a price swings. High volatility = big moves, big risk." },
  { termId: "sector", term: "Sector", concept: "Market Structure", shortDef: "A category of businesses. Tech, food, media — each is a sector." },
  { termId: "bull-market", term: "Bull Market", concept: "Market Cycles", shortDef: "When prices are rising and optimism is high. Bulls charge upward." },
  { termId: "bear-market", term: "Bear Market", concept: "Market Cycles", shortDef: "When prices are falling and fear takes over. Bears swipe downward." },
  { termId: "roi", term: "Return on Investment", concept: "Investment Returns", shortDef: "How much profit (or loss) you made relative to what you put in." },

  // Portfolio Concepts
  { termId: "unrealized-gains", term: "Unrealized Gains", concept: "Gains & Losses", shortDef: "Profit that exists on paper but you haven't locked in by selling yet." },
  { termId: "realized-gains", term: "Realized Gains", concept: "Gains & Losses", shortDef: "Profit you've actually locked in by selling a stock." },
  { termId: "cost-basis", term: "Cost Basis", concept: "Investment Accounting", shortDef: "The original price you paid. Used to calculate your profit or loss." },
  { termId: "position-cap", term: "Position Cap", concept: "Risk Limits", shortDef: "A maximum % of your portfolio in one stock. Here it's 25%." },
  { termId: "bankruptcy", term: "Bankruptcy", concept: "Capital Preservation", shortDef: "When your portfolio drops to 10% of starting capital. Game over — but you learn." },

  // Market Mechanics
  { termId: "market-cap", term: "Market Cap", concept: "Company Valuation", shortDef: "A company's total value = share price × total shares. Bigger = more established." },
  { termId: "volume", term: "Trading Volume", concept: "Market Activity", shortDef: "How many shares are being bought and sold. High volume = lots of action." },
  { termId: "sentiment", term: "Market Sentiment", concept: "Behavioral Finance", shortDef: "The overall mood of investors. Are people feeling confident or scared?" },
  { termId: "catalyst", term: "Catalyst", concept: "Price Drivers", shortDef: "A news event that causes a stock to move. The 'why' behind the price change." },

  // Advanced
  { termId: "correlation", term: "Correlation", concept: "Portfolio Theory", shortDef: "When two stocks move together (or opposite). Helps you diversify smarter." },
  { termId: "benchmark", term: "Benchmark", concept: "Performance Measurement", shortDef: "A standard to compare your returns against. Did you beat the market?" },
];
```

### 3.6 Term Placement Rules

Glossary chips should appear in these contexts:
1. **Event body text** — chip terms mentioned in the event description
2. **Trade execution screen** — chip "market order" on the order type indicator
3. **Position preview** — chip "portfolio" and "position" as relevant
4. **Result/debrief messages** — chip curriculum concepts being taught
5. **Market commentary** — chip terms in AI-generated commentary

**Placement rules:**
- Maximum 3 chips per event card (more = visual noise)
- Never chip a term that is the event headline itself
- Never chip proper nouns (company names, ticker symbols)
- If a term appears multiple times in one text block, only chip the first occurrence
- Chips inherit font size from parent — never force a specific size

### 3.7 React Component Implementation

```tsx
// components/GlossaryChip.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface GlossaryChipProps {
  termId: string;
  children: React.ReactNode;
}

export function GlossaryChip({ termId, children }: GlossaryChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const chipRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLSpanElement>(null);

  // Convex queries and mutations
  const termData = useQuery(api.glossary.getTerm, { termId });
  const isSeen = useQuery(api.glossary.isTermSeen, { termId });
  const markAsSeen = useMutation(api.glossary.markTermSeen);

  // Auto-mark as seen after popover is open for 1.5s
  useEffect(() => {
    if (isOpen && !isSeen) {
      const timer = setTimeout(() => {
        markAsSeen({ termId });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSeen, termId, markAsSeen]);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        chipRef.current &&
        !chipRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!termData) return <span>{children}</span>;

  return (
    <span style={{ position: "relative", display: "inline" }} ref={chipRef}>
      <span
        onClick={() => setIsOpen(!isOpen)}
        className={isSeen ? "glossary-chip-seen" : "glossary-chip-unseen"}
        role="button"
        tabIndex={0}
        aria-label={`Define: ${termData.term}`}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
      >
        {children}
        {!isSeen && <span className="glossary-chip-indicator">?</span>}
      </span>

      {isOpen && (
        <span ref={popoverRef} className="glossary-popover">
          <span className="glossary-popover-concept">{termData.concept}</span>
          <span className="glossary-popover-term">{termData.term}</span>
          <span className="glossary-popover-def">{termData.shortDef}</span>
          {!isSeen && (
            <span className="glossary-popover-vault">
              ✦ Adding to Knowledge Vault...
            </span>
          )}
        </span>
      )}
    </span>
  );
}
```

### 3.8 CSS Classes (Neobrutalism)

```css
/* Unseen chip — demands attention */
.glossary-chip-unseen {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: inherit;
  color: #FDE047;
  background: #2A2A2A;
  border: 2px solid #FDE047;
  box-shadow: 2px 2px 0px #FDE047;
  cursor: pointer;
  transition: all 0.15s ease;
}

.glossary-chip-unseen:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px #FDE047;
}

.glossary-chip-unseen:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #FDE047;
}

.glossary-chip-indicator {
  font-size: 10px;
  opacity: 0.7;
}

/* Seen chip — passive reference */
.glossary-chip-seen {
  display: inline;
  color: #E5E5E5;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 3px;
  cursor: pointer;
  font-weight: inherit;
  font-size: inherit;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.glossary-chip-seen:hover {
  color: #FFFFFF;
}

/* Popover */
.glossary-popover {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  width: 280px;
  padding: 12px 14px;
  background: #1A1A1A;
  border: 2px solid #7F77DD;
  box-shadow: 4px 4px 0px #7F77DD;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #E5E5E5;
  z-index: 100;
}

.glossary-popover-concept {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #7F77DD;
  margin-bottom: 4px;
}

.glossary-popover-term {
  display: block;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 6px;
  font-size: 14px;
}

.glossary-popover-def {
  display: block;
}

.glossary-popover-vault {
  display: block;
  margin-top: 8px;
  font-size: 10px;
  color: #FDE047;
  opacity: 0.8;
  animation: vaultPulse 2s ease-in-out;
}

@keyframes vaultPulse {
  0% { opacity: 0; transform: translateY(4px); }
  30% { opacity: 0.8; transform: translateY(0); }
  100% { opacity: 0.8; }
}
```

---

## 4. KNOWLEDGE VAULT INTEGRATION

### 4.1 Vault Counter (Header Bar)

The header bar should always show the player's vault progress:

```
[✦ 7/23 VAULT]
```

- Yellow star icon (✦)
- Current count / 23 total concepts
- Yellow text for count, muted gray for "VAULT" label
- Background: medGray with 1px yellow border
- Font: 12px Courier New, bold

When a new term is learned (chip transitions from unseen to seen), the vault counter should:
1. Increment the number
2. Flash the yellow border briefly (200ms pulse)
3. Optional: play a subtle audio cue via ElevenLabs `eleven_flash_v2_5`

### 4.2 Vault Panel

The Knowledge Vault panel is accessible from the main navigation. It displays all learned concepts as cards.

**Card layout per learned term:**
```
┌──────────────────────────────────────────┐
│ ✦  [Term Name]                           │
│     [Short definition]                    │
│     ─────                                │
│     Concept: [Curriculum Concept Name]    │
│     Learned: [relative timestamp]         │
│     First seen in: [Event headline]       │
└──────────────────────────────────────────┘
```

**Locked card placeholder:**
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  🔒  Keep playing to unlock
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

**Styling:**
- Learned card: medGray background, 1px solid `#FDE047` at 25% opacity border
- Locked card: medGray background, 1px dashed border at 12% opacity, 30% overall opacity
- Progress bar at top: 8px height, yellow fill, animated width transition
- Yellow neobrutalism border + shadow on the panel container itself

### 4.3 Vault Data Model

The Vault state is derived from two sources:
1. `playerGlossary` table — which terms this player has seen
2. `curriculumProgress` table (already designed) — which concepts are completed

A term being "seen" via glossary chip is a **lightweight** curriculum interaction. The full concept is only marked as "completed" in the curriculum system when the player encounters the concept through an event's targeted teaching moment + the professor Q&A.

```typescript
// Vault progress query
const vaultProgress = useQuery(api.glossary.getVaultProgress);
// Returns: { seen: TermData[], total: 23, percentage: number }
```

---

## 5. CONVEX FUNCTIONS

### 5.1 Glossary Queries

```typescript
// convex/glossary.ts

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get a single glossary term
export const getTerm = query({
  args: { termId: v.string() },
  handler: async (ctx, { termId }) => {
    return await ctx.db
      .query("glossaryTerms")
      .withIndex("by_termId", (q) => q.eq("termId", termId))
      .first();
  },
});

// Check if current user has seen a term
export const isTermSeen = query({
  args: { termId: v.string() },
  handler: async (ctx, { termId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const record = await ctx.db
      .query("playerGlossary")
      .withIndex("by_user_term", (q) =>
        q.eq("userId", identity.subject).eq("termId", termId)
      )
      .first();

    return !!record;
  },
});

// Mark a term as seen
export const markTermSeen = mutation({
  args: {
    termId: v.string(),
    eventId: v.optional(v.string()),
  },
  handler: async (ctx, { termId, eventId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if already seen
    const existing = await ctx.db
      .query("playerGlossary")
      .withIndex("by_user_term", (q) =>
        q.eq("userId", identity.subject).eq("termId", termId)
      )
      .first();

    if (existing) {
      // Increment seen count
      await ctx.db.patch(existing._id, {
        seenCount: existing.seenCount + 1,
      });
    } else {
      // First time seeing this term
      await ctx.db.insert("playerGlossary", {
        userId: identity.subject,
        termId,
        firstSeenAt: Date.now(),
        firstSeenInEvent: eventId,
        seenCount: 1,
      });
    }
  },
});

// Get vault progress for current user
export const getVaultProgress = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { seen: [], total: 23, percentage: 0 };

    const seenTerms = await ctx.db
      .query("playerGlossary")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    const termIds = seenTerms.map((t) => t.termId);
    const termData = await Promise.all(
      termIds.map((id) =>
        ctx.db
          .query("glossaryTerms")
          .withIndex("by_termId", (q) => q.eq("termId", id))
          .first()
      )
    );

    return {
      seen: termData.filter(Boolean),
      total: 23,
      percentage: Math.round((seenTerms.length / 23) * 100),
    };
  },
});
```

### 5.2 Onboarding Queries

```typescript
// convex/onboarding.ts

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOnboardingState = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const status = await ctx.db
      .query("onboardingStatus")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (!status) return { state: "new_player", eventsCompleted: 0 };
    return status;
  },
});

export const advanceOnboarding = mutation({
  args: {
    newState: v.union(
      v.literal("first_event_seen"),
      v.literal("first_trade_complete"),
      v.literal("onboarding_complete")
    ),
  },
  handler: async (ctx, { newState }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("onboardingStatus")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) {
      const updates: Record<string, unknown> = { state: newState };
      if (newState === "first_trade_complete") {
        updates.firstTradeTimestamp = Date.now();
      }
      if (newState !== "new_player") {
        updates.eventsCompleted = (existing.eventsCompleted || 0) + 1;
      }
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("onboardingStatus", {
        userId: identity.subject,
        state: newState,
        eventsCompleted: newState === "new_player" ? 0 : 1,
        seedEventId: "onboarding-001",
      });
    }
  },
});
```

---

## 6. SCHEMA ADDITIONS

Add these tables to the Convex schema:

```typescript
// convex/schema.ts — additions

glossaryTerms: defineTable({
  termId: v.string(),
  term: v.string(),
  concept: v.string(),
  conceptId: v.string(),
  shortDef: v.string(),
  longDef: v.optional(v.string()),
})
  .index("by_termId", ["termId"])
  .index("by_concept", ["conceptId"]),

playerGlossary: defineTable({
  userId: v.string(),
  termId: v.string(),
  firstSeenAt: v.number(),
  firstSeenInEvent: v.optional(v.string()),
  seenCount: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_term", ["userId", "termId"]),

onboardingStatus: defineTable({
  userId: v.string(),
  state: v.string(),
  firstTradeTimestamp: v.optional(v.number()),
  eventsCompleted: v.number(),
  seedEventId: v.string(),
})
  .index("by_user", ["userId"]),
```

---

## 7. EVENT TEXT CHIPPING SYSTEM

### 7.1 How Terms Get Chipped in Event Text

Events from the fictional news engine (Groq) and real news (Perplexity Sonar) return plain text. The chipping system processes this text client-side to insert `<GlossaryChip>` components.

```typescript
// utils/chipText.tsx

import { GlossaryChip } from "@/components/GlossaryChip";

// Map of trigger phrases to term IDs
const CHIP_TRIGGERS: Record<string, string> = {
  "stock": "stock",
  "stocks": "stock",
  "share price": "share-price",
  "share prices": "share-price",
  "market order": "market-order",
  "portfolio": "portfolio",
  "portfolios": "portfolio",
  "diversif": "diversification", // prefix match
  "volatil": "volatility",       // prefix match
  "sector": "sector",
  "sectors": "sector",
  "bull market": "bull-market",
  "bear market": "bear-market",
  "return on investment": "roi",
  "ROI": "roi",
  "market cap": "market-cap",
  "volume": "volume",
  "sentiment": "sentiment",
  "catalyst": "catalyst",
  "cost basis": "cost-basis",
  "position cap": "position-cap",
  "bankruptcy": "bankruptcy",
  "unrealized": "unrealized-gains",
  "realized gain": "realized-gains",
  "fractional": "fractional-shares",
  "benchmark": "benchmark",
  "correlation": "correlation",
};

export function chipEventText(
  text: string,
  maxChips: number = 3
): React.ReactNode[] {
  // Implementation: scan text for trigger phrases,
  // replace first occurrence of up to maxChips terms
  // with <GlossaryChip> wrappers, return array of
  // string segments and React elements.

  const result: React.ReactNode[] = [];
  let remaining = text;
  let chipCount = 0;
  const usedTerms = new Set<string>();

  // Sort triggers by length (longest first) for greedy matching
  const sortedTriggers = Object.entries(CHIP_TRIGGERS)
    .sort(([a], [b]) => b.length - a.length);

  // Simple approach: process text left-to-right
  while (remaining.length > 0 && chipCount < maxChips) {
    let earliestMatch: { index: number; trigger: string; termId: string } | null = null;

    for (const [trigger, termId] of sortedTriggers) {
      if (usedTerms.has(termId)) continue;
      const idx = remaining.toLowerCase().indexOf(trigger.toLowerCase());
      if (idx !== -1 && (!earliestMatch || idx < earliestMatch.index)) {
        earliestMatch = { index: idx, trigger, termId };
      }
    }

    if (!earliestMatch) {
      result.push(remaining);
      break;
    }

    // Add text before match
    if (earliestMatch.index > 0) {
      result.push(remaining.slice(0, earliestMatch.index));
    }

    // Add chipped term
    const matchedText = remaining.slice(
      earliestMatch.index,
      earliestMatch.index + earliestMatch.trigger.length
    );
    result.push(
      <GlossaryChip key={earliestMatch.termId} termId={earliestMatch.termId}>
        {matchedText}
      </GlossaryChip>
    );

    usedTerms.add(earliestMatch.termId);
    chipCount++;
    remaining = remaining.slice(earliestMatch.index + earliestMatch.trigger.length);
  }

  if (remaining.length > 0) {
    result.push(remaining);
  }

  return result;
}
```

### 7.2 Usage in Event Card

```tsx
// In the EventCard component
<p className="event-body">
  {chipEventText(event.body, 3)}
</p>
```

---

## 8. ACCESSIBILITY

- All glossary chips must have `role="button"` and `tabIndex={0}`
- Chips must be keyboard-navigable (Enter/Space to toggle popover)
- Popover must have `role="tooltip"` with `aria-describedby` linking to the chip
- Escape key closes any open popover
- Focus trap inside popover when opened via keyboard
- Color contrast: yellow (#FDE047) on medGray (#2A2A2A) meets WCAG AA for large text
- Screen reader: chip should announce "Define: [term name]" on focus

---

## 9. MOBILE CONSIDERATIONS

- Popover positioning: on mobile (< 640px), popover should appear as a **bottom sheet** instead of a positioned popover. Slides up from bottom, 100% width, with a drag handle to dismiss.
- Touch targets: chip minimum tap area should be 44x44px (achieved via padding)
- Event countdown timer: larger on mobile (the urgency mechanic matters more on small screens)
- Quick-select amount buttons: full-width row, equal sizing, at least 48px tall

---

## 10. IMPLEMENTATION ORDER

Build these features in this sequence:

```
PHASE 1: Data Layer
  1. Add schema tables (glossaryTerms, playerGlossary, onboardingStatus)
  2. Seed glossaryTerms with initial 22-term dataset
  3. Implement Convex queries and mutations

PHASE 2: GlossaryChip Component
  4. Build GlossaryChip component with both visual states
  5. Build definition popover with positioning logic
  6. Add mobile bottom-sheet variant
  7. Connect to Convex (seen state, markAsSeen mutation)

PHASE 3: Text Chipping
  8. Implement chipEventText utility
  9. Integrate into EventCard component
  10. Test with sample events across all sectors

PHASE 4: Onboarding Flow
  11. Build seed event (hardcoded first event)
  12. Build capital introduction screen
  13. Build guided first-trade flow (buy screen with amount input)
  14. Build trade result screen with first curriculum nudge
  15. Implement onboarding state machine

PHASE 5: Knowledge Vault Panel
  16. Build vault counter in header bar
  17. Build vault panel with card list and progress bar
  18. Add vault counter animation on new term learned
  19. Connect vault to curriculum progress system

PHASE 6: Polish
  20. Add transitions and animations (chip state changes, popover entry)
  21. Add optional audio cue integration (ElevenLabs)
  22. Mobile testing and bottom-sheet refinement
  23. Accessibility audit
```

---

## 11. DESIGN TOKENS REFERENCE

All values from the established BLK Exchange neobrutalism system:

```typescript
const DESIGN_TOKENS = {
  colors: {
    purple: "#7F77DD",       // brand primary, borders, accents
    yellow: "#FDE047",       // EXCLUSIVELY for Knowledge Vault moments
    black: "#0A0A0A",        // page background
    darkGray: "#1A1A1A",     // card backgrounds
    medGray: "#2A2A2A",      // secondary backgrounds, input fields
    lightGray: "#E5E5E5",    // body text, secondary text
    white: "#FFFFFF",        // headings, borders, primary text
    green: "#4ADE80",        // buy actions, positive changes
    red: "#EF4444",          // breaking alerts, negative changes
  },
  typography: {
    fontFamily: "'Courier New', monospace",
    // No other fonts. Courier New only.
  },
  borders: {
    radius: "0rem",          // hard corners, always
    standard: "2px solid #FFFFFF",
    shadow: "4px 4px 0px",   // neobrutalism offset shadow
    shadowPressed: "1px 1px 0px",
  },
  spacing: {
    chipPadding: "1px 8px",
    cardPadding: "20px",
    sectionGap: "16px",
  },
};
```
