import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stocks: defineTable({
    symbol: v.string(),
    name: v.string(),
    description: v.string(),
    sector: v.string(),
    priceInCents: v.number(),
    previousCloseInCents: v.number(),
    dailyChangeInCents: v.number(),
    dailyChangePercent: v.number(),
    marketCapInCents: v.number(),
    priceHistory: v.array(
      v.object({
        timestamp: v.number(),
        priceInCents: v.number(),
      })
    ),
  })
    .index("by_symbol", ["symbol"])
    .index("by_sector", ["sector"]),

  players: defineTable({
    clerkId: v.string(),
    name: v.string(),
    cashInCents: v.number(),
    portfolioValueInCents: v.number(),
    totalEventsExperienced: v.number(),
    seasonResetUsed: v.boolean(),
    streakDays: v.number(),
    lastPlayedDate: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  holdings: defineTable({
    playerId: v.id("players"),
    stockId: v.id("stocks"),
    symbol: v.string(),
    shares: v.number(),
    avgCostInCents: v.number(),
    totalInvestedInCents: v.number(),
  })
    .index("by_player", ["playerId"])
    .index("by_player_stock", ["playerId", "stockId"]),

  trades: defineTable({
    playerId: v.id("players"),
    stockId: v.id("stocks"),
    symbol: v.string(),
    type: v.union(v.literal("buy"), v.literal("sell")),
    amountInCents: v.number(),
    priceInCents: v.number(),
    shares: v.number(),
    timestamp: v.number(),
  })
    .index("by_player", ["playerId"])
    .index("by_player_time", ["playerId", "timestamp"]),

  events: defineTable({
    headline: v.string(),
    source: v.string(),
    sourceType: v.union(v.literal("fictional"), v.literal("real")),
    eventType: v.union(
      v.literal("concept-targeted"),
      v.literal("company-lifecycle"),
      v.literal("cultural-calendar"),
      v.literal("real-news")
    ),
    primarySymbol: v.string(),
    affectedStocks: v.array(
      v.object({
        symbol: v.string(),
        changePercent: v.number(),
      })
    ),
    conceptTaught: v.optional(v.string()),
    commentary: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    timestamp: v.number(),
    fired: v.boolean(),
    firedAt: v.optional(v.number()),
  })
    .index("by_fired", ["fired"])
    .index("by_timestamp", ["timestamp"])
    .index("by_symbol", ["primarySymbol", "timestamp"]),

  articles: defineTable({
    urlHash: v.string(),
    url: v.string(),
    title: v.string(),
    publication: v.string(),
    summary: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    significance: v.number(),
    classifiedTickers: v.array(v.string()),
    classifiedConcept: v.optional(v.string()),
    sourceLayer: v.union(
      v.literal("firecrawl"),
      v.literal("perplexity")
    ),
    createdAt: v.number(),
    processedAsEvent: v.boolean(),
    // News queue: articles are stored first, then drip-fed to the feed
    publishedToFeed: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),
  })
    .index("by_urlHash", ["urlHash"])
    .index("by_publication", ["publication"])
    .index("by_published", ["publishedToFeed"]),

  companyStates: defineTable({
    symbol: v.string(),
    revenueTrend: v.union(
      v.literal("growing"),
      v.literal("stable"),
      v.literal("declining")
    ),
    recentEvents: v.array(v.string()),
    marketPosition: v.union(
      v.literal("leader"),
      v.literal("challenger"),
      v.literal("niche")
    ),
    competitiveExposure: v.array(v.string()),
    lastEventType: v.union(
      v.literal("earnings"),
      v.literal("product"),
      v.literal("partnership"),
      v.literal("personnel"),
      v.literal("macro")
    ),
    seasonalContext: v.string(),
  }).index("by_symbol", ["symbol"]),

  sessions: defineTable({
    playerId: v.id("players"),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    eventsExperienced: v.number(),
    conceptsUnlocked: v.array(v.string()),
    portfolioStartValueInCents: v.number(),
    portfolioEndValueInCents: v.optional(v.number()),
    debriefText: v.optional(v.string()),
    active: v.boolean(),
  })
    .index("by_player", ["playerId"])
    .index("by_active", ["playerId", "active"]),

  vault: defineTable({
    playerId: v.id("players"),
    conceptId: v.string(),
    conceptName: v.string(),
    tier: v.union(
      v.literal("foundation"),
      v.literal("intermediate"),
      v.literal("advanced"),
      v.literal("economics")
    ),
    unlockedAt: v.number(),
    triggerType: v.union(v.literal("behavior"), v.literal("event")),
    triggerEventHeadline: v.optional(v.string()),
    portfolioValueAtUnlock: v.number(),
    definition: v.string(),
    realWorldExample: v.string(),
  })
    .index("by_player", ["playerId"])
    .index("by_player_concept", ["playerId", "conceptId"]),

  curriculumDebt: defineTable({
    playerId: v.id("players"),
    missingConcepts: v.array(v.string()),
    updatedAt: v.number(),
  }).index("by_player", ["playerId"]),

  leaderboards: defineTable({
    board: v.union(
      v.literal("portfolio-value"),
      v.literal("knowledge-vault"),
      v.literal("diversification"),
      v.literal("biggest-mover"),
      v.literal("blueprint-award")
    ),
    playerId: v.id("players"),
    playerName: v.string(),
    score: v.number(),
    period: v.string(),
    updatedAt: v.number(),
  })
    .index("by_board_period", ["board", "period"])
    .index("by_player_board", ["playerId", "board"]),

  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    conceptTaught: v.string(),
    targetType: v.union(
      v.literal("sectors_held"),
      v.literal("trades_count"),
      v.literal("portfolio_value")
    ),
    targetValue: v.number(),
    weekStart: v.number(),
    weekEnd: v.number(),
    active: v.boolean(),
  }).index("by_active", ["active"]),

  challengeProgress: defineTable({
    playerId: v.id("players"),
    challengeId: v.id("challenges"),
    currentValue: v.number(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_player", ["playerId"])
    .index("by_player_challenge", ["playerId", "challengeId"]),

  playerAchievements: defineTable({
    playerId: v.id("players"),
    achievementId: v.string(),
    unlockedAt: v.number(),
  })
    .index("by_player", ["playerId"])
    .index("by_player_achievement", ["playerId", "achievementId"]),

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
    playerId: v.id("players"),
    termId: v.string(),
    firstSeenAt: v.number(),
    firstSeenInEvent: v.optional(v.string()),
    seenCount: v.number(),
  })
    .index("by_player", ["playerId"])
    .index("by_player_term", ["playerId", "termId"]),

  realSectorEtfs: defineTable({
    symbol: v.string(),
    name: v.string(),
    price: v.number(),
    changePercent: v.number(),
    lastUpdated: v.number(),
  }).index("by_symbol", ["symbol"]),

  onboardingStatus: defineTable({
    playerId: v.id("players"),
    state: v.union(
      v.literal("new_player"),
      v.literal("first_event_seen"),
      v.literal("first_trade_complete"),
      v.literal("onboarding_complete")
    ),
    firstTradeTimestamp: v.optional(v.number()),
    eventsCompleted: v.number(),
    seedEventId: v.string(),
  }).index("by_player", ["playerId"]),
});
