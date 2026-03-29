import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Get all unlocked concepts for a player
export const getVault = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vault")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();
  },
});

// Unlock a concept (idempotent — returns existing if already unlocked)
export const unlockConcept = mutation({
  args: {
    playerId: v.id("players"),
    conceptId: v.string(),
    conceptName: v.string(),
    tier: v.union(
      v.literal("foundation"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("economics")
    ),
    triggerType: v.union(v.literal("behavior"), v.literal("event")),
    triggerEventHeadline: v.optional(v.string()),
    definition: v.string(),
    realWorldExample: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already unlocked
    const existing = await ctx.db
      .query("vault")
      .withIndex("by_player_concept", (q) =>
        q.eq("playerId", args.playerId).eq("conceptId", args.conceptId)
      )
      .first();
    if (existing) return existing;

    // Get portfolio value at unlock time
    const player = await ctx.db.get(args.playerId);
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();
    let portfolioValue = player?.cashInCents ?? 0;
    for (const h of holdings) {
      const stock = await ctx.db.get(h.stockId);
      if (stock) portfolioValue += Math.round(h.shares * stock.priceInCents);
    }

    const id = await ctx.db.insert("vault", {
      playerId: args.playerId,
      conceptId: args.conceptId,
      conceptName: args.conceptName,
      tier: args.tier,
      unlockedAt: Date.now(),
      triggerType: args.triggerType,
      triggerEventHeadline: args.triggerEventHeadline,
      portfolioValueAtUnlock: portfolioValue,
      definition: args.definition,
      realWorldExample: args.realWorldExample,
    });

    // Update knowledge-vault leaderboard
    const totalUnlocked = await ctx.db
      .query("vault")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    await ctx.scheduler.runAfter(0, internal.leaderboards.updateScore, {
      playerId: args.playerId,
      playerName: player?.name ?? "Player",
      board: "knowledge-vault" as const,
      score: totalUnlocked.length,
      period: "season-1",
    });

    return await ctx.db.get(id);
  },
});

// ─── Behavior-based triggers (checked after every trade) ─────────────────────
// Returns list of conceptIds newly eligible to unlock.

const CONSUMER_SECTORS = ["beauty", "fashion", "sportswear"];

export const checkBehaviorTriggers = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const vault = await ctx.db
      .query("vault")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();
    const unlockedIds = new Set(vault.map((v) => v.conceptId));

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    const trades = await ctx.db
      .query("trades")
      .withIndex("by_player", (q) => q.eq("playerId", args.playerId))
      .collect();

    const player = await ctx.db.get(args.playerId);
    if (!player) return [];

    // Enrich holdings with stock data
    const enrichedHoldings = await Promise.all(
      holdings.map(async (h) => {
        const stock = await ctx.db.get(h.stockId);
        return {
          ...h,
          sector: stock?.sector ?? "",
          currentPrice: stock?.priceInCents ?? 0,
          dailyChangePercent: stock?.dailyChangePercent ?? 0,
        };
      })
    );

    // Compute portfolio value
    let portfolioValue = player.cashInCents;
    for (const h of enrichedHoldings) {
      portfolioValue += Math.round(h.shares * h.currentPrice);
    }

    // Get recent events for event-context triggers
    const recentEvents = await ctx.db
      .query("events")
      .withIndex("by_timestamp")
      .order("desc")
      .filter((q) => q.eq(q.field("fired"), true))
      .take(10);

    const newUnlocks: string[] = [];

    // ─── FOUNDATION ─────────────────────────────────────────────────────

    // buy-sell-basics: has at least 1 buy AND 1 sell
    if (!unlockedIds.has("buy-sell-basics")) {
      const hasBuy = trades.some((t) => t.type === "buy");
      const hasSell = trades.some((t) => t.type === "sell");
      if (hasBuy && hasSell) newUnlocks.push("buy-sell-basics");
    }

    // profit-loss: has sold something
    if (!unlockedIds.has("profit-loss")) {
      if (trades.some((t) => t.type === "sell")) newUnlocks.push("profit-loss");
    }

    // portfolio-value: portfolio differs from $10K by 10%+
    if (!unlockedIds.has("portfolio-value")) {
      const diff = Math.abs(portfolioValue - 1_000_000) / 1_000_000;
      if (diff >= 0.1) newUnlocks.push("portfolio-value");
    }

    // supply-demand: held a stock that rose 5%+ after a positive event
    if (!unlockedIds.has("supply-demand")) {
      for (const h of enrichedHoldings) {
        if (h.dailyChangePercent >= 5) {
          newUnlocks.push("supply-demand");
          break;
        }
      }
    }

    // bull-bear: portfolio experienced both a positive and negative holding
    if (!unlockedIds.has("bull-bear")) {
      const hasUp = enrichedHoldings.some(
        (h) => h.currentPrice > h.avgCostInCents
      );
      const hasDown = enrichedHoldings.some(
        (h) => h.currentPrice < h.avgCostInCents
      );
      if (hasUp && hasDown) newUnlocks.push("bull-bear");
    }

    // ─── INTERMEDIATE ───────────────────────────────────────────────────

    // diversification: hold positions in 4+ sectors
    if (!unlockedIds.has("diversification")) {
      const sectors = new Set(enrichedHoldings.map((h) => h.sector));
      if (sectors.size >= 4) newUnlocks.push("diversification");
    }

    // sector-correlation: hold 2+ stocks in the same sector
    if (!unlockedIds.has("sector-correlation")) {
      const sectorCounts = new Map<string, number>();
      for (const h of enrichedHoldings) {
        sectorCounts.set(h.sector, (sectorCounts.get(h.sector) ?? 0) + 1);
      }
      for (const count of sectorCounts.values()) {
        if (count >= 2) {
          newUnlocks.push("sector-correlation");
          break;
        }
      }
    }

    // emotional-investing: made a trade within 5 min of an event AND that trade lost money
    if (!unlockedIds.has("emotional-investing")) {
      for (const trade of trades.slice(-10)) {
        // Check if any event fired within 5 min before this trade
        const tradeTime = trade.timestamp;
        const nearbyEvent = recentEvents.find(
          (e) =>
            e.firedAt &&
            Math.abs(tradeTime - e.firedAt) < 5 * 60 * 1000
        );
        if (nearbyEvent) {
          // Check if the trade lost money (current price < trade price for buys)
          const holding = enrichedHoldings.find(
            (h) => h.symbol === trade.symbol
          );
          if (
            trade.type === "buy" &&
            holding &&
            holding.currentPrice < trade.priceInCents
          ) {
            newUnlocks.push("emotional-investing");
            break;
          }
        }
      }
    }

    // consumer-spending: held a consumer sector stock (beauty, fashion, sportswear)
    if (!unlockedIds.has("consumer-spending")) {
      const hasConsumer = enrichedHoldings.some((h) =>
        CONSUMER_SECTORS.includes(h.sector)
      );
      if (hasConsumer) newUnlocks.push("consumer-spending");
    }

    // competitive-displacement: held a stock that dropped while a same-sector rival rose
    if (!unlockedIds.has("competitive-displacement")) {
      for (const h of enrichedHoldings) {
        if (h.dailyChangePercent < 0) {
          // Find a same-sector stock that went up
          const rival = enrichedHoldings.find(
            (r) =>
              r.sector === h.sector &&
              r.symbol !== h.symbol &&
              r.dailyChangePercent > 0
          );
          if (rival) {
            newUnlocks.push("competitive-displacement");
            break;
          }
        }
      }
    }

    // halo-effect: held a stock that rose due to a partnership/celebrity event
    if (!unlockedIds.has("halo-effect")) {
      for (const h of enrichedHoldings) {
        if (h.dailyChangePercent > 3) {
          // Check if there was a recent partnership event for this stock
          const partnershipEvent = recentEvents.find(
            (e) =>
              e.affectedStocks.some((s) => s.symbol === h.symbol) &&
              (e.headline.toLowerCase().includes("partnership") ||
                e.headline.toLowerCase().includes("collab") ||
                e.headline.toLowerCase().includes("celebrity") ||
                e.headline.toLowerCase().includes("deal"))
          );
          if (partnershipEvent) {
            newUnlocks.push("halo-effect");
            break;
          }
        }
      }
    }

    // ─── ADVANCED ───────────────────────────────────────────────────────

    // dollar-cost-avg: bought same stock 3+ times at different prices
    if (!unlockedIds.has("dollar-cost-avg")) {
      const buysBySymbol = new Map<string, Set<number>>();
      for (const t of trades) {
        if (t.type === "buy") {
          if (!buysBySymbol.has(t.symbol))
            buysBySymbol.set(t.symbol, new Set());
          buysBySymbol.get(t.symbol)!.add(t.priceInCents);
        }
      }
      for (const prices of buysBySymbol.values()) {
        if (prices.size >= 3) {
          newUnlocks.push("dollar-cost-avg");
          break;
        }
      }
    }

    // portfolio-rebalancing: sold a position >30% of portfolio
    if (!unlockedIds.has("portfolio-rebalancing")) {
      const recentSells = trades.filter((t) => t.type === "sell").slice(-5);
      for (const sell of recentSells) {
        if (sell.amountInCents > portfolioValue * 0.3) {
          newUnlocks.push("portfolio-rebalancing");
          break;
        }
      }
    }

    // risk-adjusted-return: profitable AND diversification 60+
    if (!unlockedIds.has("risk-adjusted-return")) {
      const sectors = new Set(enrichedHoldings.map((h) => h.sector));
      const divScore = Math.round((sectors.size / 12) * 100);
      if (portfolioValue > 1_000_000 && divScore >= 60) {
        newUnlocks.push("risk-adjusted-return");
      }
    }

    // ─── ECONOMICS ──────────────────────────────────────────────────────

    // black-dollar: hold 5+ stocks across 3+ sectors
    if (!unlockedIds.has("black-dollar")) {
      const sectors = new Set(enrichedHoldings.map((h) => h.sector));
      if (enrichedHoldings.length >= 5 && sectors.size >= 3) {
        newUnlocks.push("black-dollar");
      }
    }

    return newUnlocks;
  },
});

// ─── Event-driven concept unlocks ────────────────────────────────────────────
// Called from eventScheduler after an event fires. Checks all active players
// and unlocks event-type concepts when the event matches.

const EVENT_CONCEPT_MAP: Record<
  string,
  { keywords: string[]; conceptId: string }
> = {
  "economic-multiplier": {
    keywords: ["ripple", "multiplier", "chain reaction", "downstream", "supply chain"],
    conceptId: "economic-multiplier",
  },
  "dividend-investing": {
    keywords: ["dividend", "payout", "distribution", "yield", "shareholder return"],
    conceptId: "dividend-investing",
  },
  "pe-ratio": {
    keywords: ["earnings", "revenue", "quarterly", "profit margin", "EPS"],
    conceptId: "pe-ratio",
  },
  "economic-moat": {
    keywords: ["moat", "competitive advantage", "market leader", "dominance", "barrier"],
    conceptId: "economic-moat",
  },
  "acquisition-economics": {
    keywords: ["acquisition", "acquire", "merger", "buyout", "takeover"],
    conceptId: "acquisition-economics",
  },
  "vc-dilution": {
    keywords: ["funding", "venture", "Series A", "Series B", "investment round", "valuation"],
    conceptId: "vc-dilution",
  },
  "inflation": {
    keywords: ["inflation", "price increase", "cost of living", "purchasing power"],
    conceptId: "inflation",
  },
  "consumer-confidence": {
    keywords: ["consumer confidence", "spending", "retail", "consumer sentiment"],
    conceptId: "consumer-confidence",
  },
};

export const checkEventTriggers = internalMutation({
  args: {
    eventHeadline: v.string(),
    eventConceptTaught: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const headline = args.eventHeadline.toLowerCase();

    // Find which event-driven concepts this headline matches
    const matchedConcepts: string[] = [];
    for (const [, config] of Object.entries(EVENT_CONCEPT_MAP)) {
      if (config.keywords.some((kw) => headline.includes(kw))) {
        matchedConcepts.push(config.conceptId);
      }
    }

    // Also check if the event's conceptTaught directly matches
    if (args.eventConceptTaught) {
      const taught = args.eventConceptTaught.toLowerCase();
      for (const [, config] of Object.entries(EVENT_CONCEPT_MAP)) {
        if (taught.includes(config.conceptId.replace(/-/g, " "))) {
          if (!matchedConcepts.includes(config.conceptId)) {
            matchedConcepts.push(config.conceptId);
          }
        }
      }
    }

    if (matchedConcepts.length === 0) return;

    // Get all active sessions (all players currently playing)
    const activeSessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // For each active player, unlock matched concepts
    for (const session of activeSessions) {
      const vault = await ctx.db
        .query("vault")
        .withIndex("by_player", (q) => q.eq("playerId", session.playerId))
        .collect();
      const unlockedIds = new Set(vault.map((v) => v.conceptId));

      for (const conceptId of matchedConcepts) {
        if (unlockedIds.has(conceptId)) continue;

        // Look up concept metadata
        const conceptMeta = CONCEPT_DEFINITIONS[conceptId];
        if (!conceptMeta) continue;

        await ctx.db.insert("vault", {
          playerId: session.playerId,
          conceptId,
          conceptName: conceptMeta.name,
          tier: conceptMeta.tier as "foundation" | "intermediate" | "advanced" | "economics",
          unlockedAt: Date.now(),
          triggerType: "event",
          triggerEventHeadline: args.eventHeadline,
          portfolioValueAtUnlock: 0, // not computed for event triggers
          definition: conceptMeta.definition,
          realWorldExample: conceptMeta.realWorldExample,
        });

        // Track in session
        const concepts = session.conceptsUnlocked ?? [];
        if (!concepts.includes(conceptId)) {
          await ctx.db.patch(session._id, {
            conceptsUnlocked: [...concepts, conceptId],
          });
        }
      }
    }
  },
});

// Concept definitions for event-driven unlocks
const CONCEPT_DEFINITIONS: Record<
  string,
  { name: string; tier: string; definition: string; realWorldExample: string }
> = {
  "economic-multiplier": {
    name: "Economic Multiplier Effect",
    tier: "intermediate",
    definition:
      "When money spent in one area creates a ripple effect of additional economic activity. One dollar spent at a Black-owned business can generate several more dollars of economic impact in the community.",
    realWorldExample:
      "When a new Black-owned restaurant opens, it hires local staff, buys from local suppliers, and attracts foot traffic to neighboring businesses — multiplying the original investment.",
  },
  "dividend-investing": {
    name: "Dividend Investing",
    tier: "intermediate",
    definition:
      "Earning regular income from stocks through dividend payments. Companies share a portion of their profits with shareholders, providing passive income on top of price appreciation.",
    realWorldExample:
      "If you own shares in a company like Johnson & Johnson, they pay you a dividend every quarter just for holding the stock — like getting rent from a property you own.",
  },
  "pe-ratio": {
    name: "Price-to-Earnings Ratio",
    tier: "advanced",
    definition:
      "A valuation metric that compares a company's stock price to its earnings per share. A high P/E means investors expect high future growth; a low P/E might mean the stock is undervalued or the company is struggling.",
    realWorldExample:
      "Tesla trades at a P/E of 60+ because investors bet on future growth. A traditional automaker might trade at P/E 8. Neither is 'right' — it depends on growth expectations.",
  },
  "economic-moat": {
    name: "Economic Moat",
    tier: "advanced",
    definition:
      "A durable competitive advantage that protects a company from competitors, like a moat protects a castle. Moats come from brand loyalty, network effects, cost advantages, or switching costs.",
    realWorldExample:
      "Apple has a massive moat: once you own an iPhone, MacBook, and AirPods, switching to Android means losing your entire ecosystem. That's a switching cost moat.",
  },
  "acquisition-economics": {
    name: "Acquisition Economics",
    tier: "advanced",
    definition:
      "When one company buys another to gain market share, technology, talent, or eliminate a competitor. Acquisitions can boost value or destroy it depending on the price paid and integration success.",
    realWorldExample:
      "When Disney bought Marvel for $4 billion in 2009, people thought they overpaid. Marvel has since generated over $30 billion in revenue. That's acquisition economics done right.",
  },
  "vc-dilution": {
    name: "Venture Capital and Dilution",
    tier: "advanced",
    definition:
      "When a company raises money from investors, it creates new shares — diluting existing shareholders' ownership percentage. More funding means more growth potential but less ownership per share.",
    realWorldExample:
      "If you own 10% of a startup and it raises a new funding round, your 10% might become 7%. You own less of the company, but ideally the company is now worth much more.",
  },
  inflation: {
    name: "Macroeconomics: Inflation",
    tier: "economics",
    definition:
      "When the general price of goods and services rises over time, reducing the purchasing power of money. Moderate inflation is normal; high inflation erodes savings and investments.",
    realWorldExample:
      "In 2022, inflation hit 9.1% in the US. A $100 grocery bill became $109. Wages didn't keep up, so people could buy less with the same paycheck. Investing helps beat inflation.",
  },
  "consumer-confidence": {
    name: "Macroeconomics: Consumer Confidence",
    tier: "economics",
    definition:
      "A measure of how optimistic consumers feel about the economy. When confidence is high, people spend more — boosting stocks. When it drops, spending slows and markets can fall.",
    realWorldExample:
      "During the 2020 lockdowns, consumer confidence plummeted and retail stocks dropped. When vaccines rolled out and confidence returned, consumer stocks rallied strongly.",
  },
};
