// Market position is determined by price rank within sector:
// highest price = "leader", middle = "challenger", lowest = "niche"
// competitiveExposure lists the other 2 symbols in the same sector

export const SEED_COMPANY_STATES = [
  // --- Media & Content ---
  // LOUD $42 (leader), SCROLL $28 (challenger), VERSE $19 (niche)
  {
    symbol: "LOUD",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["SCROLL", "VERSE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "SCROLL",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["LOUD", "VERSE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "VERSE",
    revenueTrend: "declining" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["LOUD", "SCROLL"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Streaming ---
  // NETFLO $142 (leader), VIZN $78 (challenger), LIVE $31 (niche)
  {
    symbol: "NETFLO",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["VIZN", "LIVE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "VIZN",
    revenueTrend: "growing" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["NETFLO", "LIVE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "LIVE",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["NETFLO", "VIZN"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Music ---
  // RYTHM $61 (leader), BLOC $34 (challenger), CRATE $18 (niche)
  {
    symbol: "RYTHM",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["BLOC", "CRATE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "BLOC",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["RYTHM", "CRATE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "CRATE",
    revenueTrend: "declining" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["RYTHM", "BLOC"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Gaming ---
  // PIXL $88 (leader), SQUAD $56 (challenger), MOBILE $44 (niche)
  {
    symbol: "PIXL",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["SQUAD", "MOBILE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "SQUAD",
    revenueTrend: "growing" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["PIXL", "MOBILE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "MOBILE",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["PIXL", "SQUAD"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Sportswear ---
  // KICKS $112 (leader), FLEX $47 (challenger), COURT $33 (niche)
  {
    symbol: "KICKS",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["FLEX", "COURT"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "FLEX",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["KICKS", "COURT"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "COURT",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["KICKS", "FLEX"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Fashion ---
  // RARE $94 (leader), DRIP $65 (challenger), THREAD $22 (niche)
  {
    symbol: "RARE",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["DRIP", "THREAD"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "DRIP",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["RARE", "THREAD"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "THREAD",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["RARE", "DRIP"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Publishing ---
  // READS $51 (leader), INK $38 (challenger), PRESS $17 (niche)
  {
    symbol: "READS",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["INK", "PRESS"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "INK",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["READS", "PRESS"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "PRESS",
    revenueTrend: "declining" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["READS", "INK"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Beauty ---
  // CROWN $47 (leader), GLOW $31 (challenger), SHEEN $24 (niche)
  {
    symbol: "CROWN",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["GLOW", "SHEEN"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "GLOW",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["CROWN", "SHEEN"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "SHEEN",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["CROWN", "GLOW"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Finance ---
  // STAX $68 (leader), VAULT $52 (challenger), GROW $29 (niche)
  {
    symbol: "STAX",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["VAULT", "GROW"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "VAULT",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["STAX", "GROW"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "GROW",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["STAX", "VAULT"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Real Estate ---
  // BLOK $94 (leader), BUILD $67 (challenger), HOOD $33 (niche)
  {
    symbol: "BLOK",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["BUILD", "HOOD"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "BUILD",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["BLOK", "HOOD"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "HOOD",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["BLOK", "BUILD"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Sports ---
  // ARENA $71 (leader), DRAFT $58 (challenger), STATS $44 (niche)
  {
    symbol: "ARENA",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["DRAFT", "STATS"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "DRAFT",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["ARENA", "STATS"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "STATS",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["ARENA", "DRAFT"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },

  // --- Entertainment ---
  // SCREEN $83 (leader), STAGE $49 (challenger), GAME $37 (niche)
  {
    symbol: "SCREEN",
    revenueTrend: "growing" as const,
    marketPosition: "leader" as const,
    competitiveExposure: ["STAGE", "GAME"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "STAGE",
    revenueTrend: "stable" as const,
    marketPosition: "challenger" as const,
    competitiveExposure: ["SCREEN", "GAME"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
  {
    symbol: "GAME",
    revenueTrend: "stable" as const,
    marketPosition: "niche" as const,
    competitiveExposure: ["SCREEN", "STAGE"],
    recentEvents: [],
    lastEventType: "earnings" as const,
    seasonalContext: "standard",
  },
] as const;
