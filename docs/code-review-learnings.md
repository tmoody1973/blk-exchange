# BLK Exchange — Code Review Learnings

Everything that was caught, why it matters, and how it was fixed. Written so you can learn from each issue and apply the thinking to future projects.

---

## Round 1: Initial Build Review (26 tasks)

### Critical #1: Missing Convex Auth Files

**What happened:** We built the entire app but never created `convex/auth.config.ts` or `convex/http.ts`. Without these, Convex has no way to verify that a user is actually logged in via Clerk. Every query that depends on knowing who the user is would fail.

**Why it matters:** Authentication is the foundation of any app with user accounts. If Convex can't verify Clerk's JWT tokens, the app is basically open to anyone — or worse, completely broken.

**The fix:** Created `convex/auth.config.ts` with the Clerk JWT issuer domain, and `convex/http.ts` as the HTTP router for webhooks.

**Lesson:** Auth setup is easy to forget when you're focused on features. Always verify auth works end-to-end before building anything else.

---

### Critical #2: Prices Changed at the Wrong Time

**What happened:** When Groq generated a fictional event, the code immediately changed stock prices — even though the event was queued (not yet "fired"). Players would see prices move before the Market Alert appeared, which makes no sense.

**Why it matters:** The design says "prices move at the moment the alert shows." If prices change 5 minutes before the alert, the player sees outdated price movements and the game feels broken. It also breaks the educational premise — the event is supposed to cause the price move, not happen after it.

**The fix:** Moved the price-change logic from the event generation step (`applyEvent`) to the event firing step (`fireNextEvent`). Now prices only change when the event actually fires and the Market Alert appears.

**Lesson:** Think about WHEN side effects happen, not just WHAT they do. In a real-time system, timing is part of the correctness.

---

### Critical #3: Real News Events Never Moved Prices

**What happened:** When a real news article from AfroTech or Essence was classified by Groq and turned into a market event, it was inserted into the queue — but the `fireNextEvent` function only flipped `fired: true`. It didn't apply the price changes. So real news events would show up as alerts, but the stock prices wouldn't actually move.

**Why it matters:** The whole point of the real news pipeline is that real cultural events move the market. If prices don't move, the game is lying to the player.

**The fix:** Same fix as #2 — the `fireNextEvent` function now applies price changes for ALL events (fictional and real) at fire time.

**Lesson:** When you have two paths that create the same type of data (fictional events and real events), make sure both paths go through the same processing pipeline. Don't assume one path handles something that only the other path does.

---

### Critical #4: Next.js 14 vs 15 API Mismatch

**What happened:** The ticker detail page used `use(params)` to unwrap route parameters. This is the Next.js 15 pattern. But we're on Next.js 14, where `params` is a plain object — not a Promise. Calling `use()` on a non-Promise crashes the page.

**Why it matters:** This would crash every single stock detail page. Players tap a stock, page breaks. Game over.

**The fix:** Changed from `const { symbol } = use(params)` to `const { symbol } = params`. Removed the `use` import.

**Lesson:** Always check which version of a framework you're using. API patterns change between versions. The AI that wrote the code was trained on Next.js 15 docs but the project uses 14.

---

## Round 2: Game Mechanics Review

### Critical #5: Leaderboard Scores Never Updated

**What happened:** The `updateScore` function existed in `convex/leaderboards.ts`, but nothing in the entire codebase ever called it. The leaderboard tables would always be empty. Players visit the profile page, see blank leaderboards, think the game is broken.

**Why it matters:** Leaderboards are one of the 5 pillars of the game. If they're empty, there's no competition, no reason to come back.

**The fix:** Wired `updatePlayerScores` to run after every trade (for portfolio-value and diversification boards), `updateScore` after every concept unlock (for knowledge-vault), and `updateBiggestMover` after every event fires.

**Lesson:** Building a function is only half the job. You also have to wire it into the flow that triggers it. Always trace the full path: "Where does this get called? What triggers it? Will it actually run?"

---

### Critical #6: Session Events Always Showed Zero

**What happened:** The `incrementEventsExperienced` mutation existed but was never called from the client. So every session would report "0 events experienced" and "0 concepts unlocked" — even if the player traded for an hour and saw 10 events. The Claude debrief would then generate a generic narrative based on no data.

**Why it matters:** The session debrief is supposed to be personalized. "You experienced 6 events, unlocked Diversification, and your DRIP trade gained 12%" is way more engaging than "Session complete."

**The fix:** Added `incrementEventsExperienced` call to the `useMarketAlert` hook — every time a new Market Alert appears, the session counter increments. Added `addConceptToSession` call to the trade modal after concept unlocks.

**Lesson:** Backend functions mean nothing if the frontend doesn't call them. Always trace data from the UI event → API call → database write → query → UI display.

---

### Critical #7: 15 of 23 Concepts Could Never Unlock

**What happened:** The `checkBehaviorTriggers` function only implemented 8 of the 15 behavior-driven concept triggers. Seven were missing (supply-demand, bull-bear, sector-correlation, emotional-investing, consumer-spending, competitive-displacement, halo-effect). Plus, all 8 event-driven concepts had no trigger system at all.

**Why it matters:** If players can only unlock 8 out of 23 concepts, the vault will feel empty. The curriculum debt system — which is the core educational innovation — can never clear. Players will get frustrated.

**The fix:** Added the 7 missing behavior triggers with concrete portfolio-state checks. Created a `checkEventTriggers` system that scans fired event headlines for keywords matching the 8 event-driven concepts and unlocks them for all active players.

**Lesson:** When a design doc says "23 concepts," make sure all 23 actually work. Count them. Test them. Don't assume partial implementation is "good enough."

---

## Round 3: Price Inflation Bug

### Critical #8: BLK Index Reached $48,708 (Should Be ~$53)

**What happened:** Events had been firing for 2 days, each applying percentage price changes. But the `previousCloseInCents` field (used to calculate daily change) never reset. So each event's price change compounded on top of yesterday's changes, and yesterday's changes compounded on the day before. After 200+ events, prices inflated by 115,000%.

**Why it matters:** If CROWN shows $4,700 instead of $47, the game looks absurd. No student would take it seriously.

**The fix:** Three things: (1) Added a daily reset cron at midnight ET that sets `previousCloseInCents = priceInCents` and zeros out daily changes. (2) Capped individual event price changes to ±15% with a $1.00 floor. (3) Created an emergency `resetPrices` function to restore all stocks to starting prices (and used it).

**Lesson:** Any system that compounds values over time needs a reset mechanism. This applies to financial calculations, counters, cache sizes, log files — anything that grows unboundedly will eventually break.

---

## Round 4: Security Issues

### Important #1: Public Mutations That Should Be Internal

**What happened:** `resetPrices`, `triggerFire`, and `triggerFictional` were all exported as public `mutation` functions. Any user could open browser dev tools and call them directly. A malicious user could reset all stock prices, spam events, or manipulate the market.

**Why it matters:** Public mutations are accessible from the client. If a function should only be called by server-side code (crons, other mutations), it should be `internalMutation`.

**The fix:** Changed all three to `internalMutation`.

**Lesson:** Always ask: "Who should be able to call this?" If the answer is "only the server," use `internalMutation`. If users can call it, add validation and authorization.

---

### Important #2: Leaderboard Score Tampering

**What happened:** `updateScore` was a public `mutation`. Any authenticated user could call it with their own player ID and an arbitrary score — literally setting themselves to #1 on any leaderboard.

**The fix:** Changed to `internalMutation`. Now only server-side code can update scores.

**Lesson:** Never trust the client. Any function that affects competitive state (scores, rankings, rewards) must be server-only.

---

### Important #3: TTS Endpoint Had No Auth

**What happened:** The `/api/tts` route (which calls ElevenLabs to generate speech) had no authentication check. Anyone with the URL could spam it and burn through the ElevenLabs API budget.

**The fix:** Added Clerk auth check — only logged-in users can call the TTS endpoint.

**Lesson:** Every API endpoint that calls a paid external service needs authentication AND ideally rate limiting.

---

## Round 5: Runtime/Build Issues

### Build Blocker: CSS `@apply border-border` Doesn't Exist

**What happened:** The `globals.css` file used `@apply border-border` inside a `@layer base` block. But `border-border` is a Tailwind utility class that wasn't available at that point in the CSS cascade with the shadcn v2 setup.

**The fix:** Replaced `@apply border-border` with plain CSS: `border-color: var(--border)`.

**Lesson:** `@apply` is convenient but fragile — it depends on the utility class existing in the right layer at the right time. When it breaks, plain CSS always works.

---

### Build Blocker: `@import "shadcn/tailwind.css"` Doesn't Exist

**What happened:** The shadcn CLI generated a CSS import that references a file (`shadcn/tailwind.css`) that doesn't exist as a package export. The PostCSS build failed silently.

**The fix:** Removed the import entirely.

**Lesson:** Auto-generated code isn't always correct. Verify that imports actually resolve.

---

### Build Blocker: Missing Tailwind Theme Config

**What happened:** The neobrutalism UI components use custom Tailwind classes like `bg-main`, `rounded-base`, `shadow-shadow`, `translate-x-boxShadowX`. None of these were defined in `tailwind.config.ts`. Every single UI component rendered with broken styles.

**The fix:** Added the full neobrutalism theme extension (colors, border-radius, box-shadow, translate, font-family) to the Tailwind config.

**Lesson:** Third-party component libraries assume a specific Tailwind config. Always check what custom theme values they expect and add them before using the components.

---

## Round 6: Meta-Game Review

### Critical #9: Convex Cron Helpers Forbidden

**What happened:** We used `crons.daily()` and `crons.weekly()` — but the Convex guidelines explicitly say to only use `crons.interval()` or `crons.cron()`. The helper methods may be unreliable or deprecated.

**The fix:** Replaced with `crons.cron("0 5 * * *", ...)` (cron expression syntax).

**Lesson:** Read the framework's guidelines, not just its TypeScript types. A function can exist in the SDK and still be discouraged or unreliable.

---

### Important #4: Debrief Prompt Never Fired at 45 Minutes

**What happened:** The debrief prompt was inside a `useEffect` that only re-evaluated when `sessionStartedAt`, `eventsExperienced`, or `sessionId` changed. If a player traded quietly for 45 minutes without any events firing, no dependency would change, so the effect would never re-run, and the prompt would never appear.

**The fix:** Added a periodic timer (`setInterval` every 60 seconds) that increments a `tick` counter included in the effect's dependency array. Now the prompt re-evaluates every minute.

**Lesson:** React `useEffect` only runs when its dependencies change. If you need time-based behavior, you need a timer to force re-evaluation. Dependencies are triggers, not clocks.

---

### Important #5: Full Table Scan for Challenge Progress

**What happened:** The challenge progress checker for `trades_count` collected ALL trades a player ever made, then filtered by timestamp in JavaScript. The database index `by_player_time` was designed exactly for this query but wasn't being used.

**The fix:** Changed from `.withIndex("by_player")` + `.filter()` to `.withIndex("by_player_time", q => q.eq(...).gte("timestamp", weekStart))`.

**Lesson:** If you built an index, use it. Collecting everything and filtering in JS defeats the purpose of having a database.

---

### Important #6: Groq Could Hallucinate Invalid Challenge Types

**What happened:** When Groq generated a weekly challenge, it could return any string for `targetType`. The code did `result.targetType ?? "trades_count"` — which only handles null/undefined, not invalid strings like "revenue_growth" that Groq might invent. The `insertChallenge` mutation would then fail Convex's validator.

**The fix:** Added validation: check if the value is in the allowed enum array, fall back to "trades_count" if not.

**Lesson:** Never trust AI output to match your schema. Always validate LLM responses against your expected types before inserting into the database.

---

## Key Patterns to Remember

1. **Trace the full path.** Function exists ≠ function gets called. Always follow: UI event → API → database → query → UI.

2. **Public vs internal.** If only the server should call it, make it `internalMutation`. If users can call it, validate and authorize.

3. **Time is a dependency.** React effects need timers for time-based behavior. Database fields that compound need resets.

4. **Validate external data.** AI output, API responses, user input — always validate against your schema before writing to the database.

5. **Use your indexes.** If you created a database index, use it in your queries. Full table scans are a code smell.

6. **Count your features.** If the spec says 23 concepts, verify all 23 are implemented. Partial implementation creates a broken user experience.

7. **Framework versions matter.** Next.js 14 ≠ Next.js 15. Clerk v5 ≠ Clerk v7. Always check which version you're on before using an API pattern.

8. **Auth is infrastructure, not a feature.** Set it up first, test it works, then build everything else on top of it.
