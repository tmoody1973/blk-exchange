// Seed data for stocks and company states.
// Defined here (within the convex/ directory) so convex/seed.ts can import it
// without needing @/ path aliases, which are not supported in Convex functions.

const SEED_TIMESTAMP = 1711324800000; // fixed reference timestamp for reproducible seeds

export const SEED_STOCKS = [
  // Media & Content
  { symbol: "LOUD", name: "Podcast & media network", description: "Podcast & media network", sector: "media", priceInCents: 4200, previousCloseInCents: 4200, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 4200 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 4200 }] },
  { symbol: "SCROLL", name: "Digital media & newsletter platform", description: "Digital media & newsletter platform", sector: "media", priceInCents: 2800, previousCloseInCents: 2800, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 2800 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 2800 }] },
  { symbol: "VERSE", name: "Literary & spoken word platform", description: "Literary & spoken word platform", sector: "media", priceInCents: 1900, previousCloseInCents: 1900, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 1900 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 1900 }] },
  // Streaming
  { symbol: "VIZN", name: "Black-owned streaming platform", description: "Black-owned streaming platform", sector: "streaming", priceInCents: 7800, previousCloseInCents: 7800, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 7800 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 7800 }] },
  { symbol: "NETFLO", name: "Corporate mega-streaming platform", description: "Corporate mega-streaming platform", sector: "streaming", priceInCents: 14200, previousCloseInCents: 14200, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 14200 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 14200 }] },
  { symbol: "LIVE", name: "Live event streaming platform", description: "Live event streaming platform", sector: "streaming", priceInCents: 3100, previousCloseInCents: 3100, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 3100 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 3100 }] },
  // Music
  { symbol: "RYTHM", name: "Music streaming & distribution", description: "Music streaming & distribution", sector: "music", priceInCents: 6100, previousCloseInCents: 6100, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 6100 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 6100 }] },
  { symbol: "BLOC", name: "Independent record label", description: "Independent record label", sector: "music", priceInCents: 3400, previousCloseInCents: 3400, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 3400 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 3400 }] },
  { symbol: "CRATE", name: "Music discovery platform", description: "Music discovery platform", sector: "music", priceInCents: 1800, previousCloseInCents: 1800, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 1800 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 1800 }] },
  // Gaming
  { symbol: "PIXL", name: "Black-owned game studio", description: "Black-owned game studio", sector: "gaming", priceInCents: 8800, previousCloseInCents: 8800, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 8800 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 8800 }] },
  { symbol: "MOBILE", name: "Mobile gaming platform", description: "Mobile gaming platform", sector: "gaming", priceInCents: 4400, previousCloseInCents: 4400, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 4400 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 4400 }] },
  { symbol: "SQUAD", name: "Esports org & content platform", description: "Esports org & content platform", sector: "gaming", priceInCents: 5600, previousCloseInCents: 5600, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 5600 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 5600 }] },
  // Sportswear
  { symbol: "KICKS", name: "Performance athletic footwear brand", description: "Performance athletic footwear brand", sector: "sportswear", priceInCents: 11200, previousCloseInCents: 11200, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 11200 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 11200 }] },
  { symbol: "FLEX", name: "Athletic apparel line", description: "Athletic apparel line", sector: "sportswear", priceInCents: 4700, previousCloseInCents: 4700, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 4700 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 4700 }] },
  { symbol: "COURT", name: "Sports equipment & training brand", description: "Sports equipment & training brand", sector: "sportswear", priceInCents: 3300, previousCloseInCents: 3300, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 3300 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 3300 }] },
  // Fashion
  { symbol: "DRIP", name: "Established streetwear brand", description: "Established streetwear brand", sector: "fashion", priceInCents: 6500, previousCloseInCents: 6500, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 6500 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 6500 }] },
  { symbol: "RARE", name: "Limited-drop hype brand", description: "Limited-drop hype brand", sector: "fashion", priceInCents: 9400, previousCloseInCents: 9400, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 9400 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 9400 }] },
  { symbol: "THREAD", name: "Custom apparel & creator merch", description: "Custom apparel & creator merch", sector: "fashion", priceInCents: 2200, previousCloseInCents: 2200, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 2200 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 2200 }] },
  // Publishing
  { symbol: "INK", name: "Black book publishing house", description: "Black book publishing house", sector: "publishing", priceInCents: 3800, previousCloseInCents: 3800, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 3800 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 3800 }] },
  { symbol: "READS", name: "Digital reading & audio platform", description: "Digital reading & audio platform", sector: "publishing", priceInCents: 5100, previousCloseInCents: 5100, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 5100 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 5100 }] },
  { symbol: "PRESS", name: "Independent press & literary network", description: "Independent press & literary network", sector: "publishing", priceInCents: 1700, previousCloseInCents: 1700, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 1700 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 1700 }] },
  // Beauty
  { symbol: "CROWN", name: "Natural hair care brand", description: "Natural hair care brand", sector: "beauty", priceInCents: 4700, previousCloseInCents: 4700, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 4700 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 4700 }] },
  { symbol: "GLOW", name: "Skincare & wellness brand", description: "Skincare & wellness brand", sector: "beauty", priceInCents: 3100, previousCloseInCents: 3100, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 3100 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 3100 }] },
  { symbol: "SHEEN", name: "Black salon chain", description: "Black salon chain", sector: "beauty", priceInCents: 2400, previousCloseInCents: 2400, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 2400 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 2400 }] },
  // Finance
  { symbol: "VAULT", name: "Black community bank", description: "Black community bank", sector: "finance", priceInCents: 5200, previousCloseInCents: 5200, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 5200 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 5200 }] },
  { symbol: "STAX", name: "Black fintech & payments app", description: "Black fintech & payments app", sector: "finance", priceInCents: 6800, previousCloseInCents: 6800, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 6800 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 6800 }] },
  { symbol: "GROW", name: "CDFI & community lending fund", description: "CDFI & community lending fund", sector: "finance", priceInCents: 2900, previousCloseInCents: 2900, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 2900 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 2900 }] },
  // Real Estate
  { symbol: "BLOK", name: "Real estate investment trust", description: "Real estate investment trust", sector: "realestate", priceInCents: 9400, previousCloseInCents: 9400, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 9400 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 9400 }] },
  { symbol: "BUILD", name: "Infrastructure & construction co", description: "Infrastructure & construction co", sector: "realestate", priceInCents: 6700, previousCloseInCents: 6700, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 6700 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 6700 }] },
  { symbol: "HOOD", name: "Affordable housing developer", description: "Affordable housing developer", sector: "realestate", priceInCents: 3300, previousCloseInCents: 3300, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 3300 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 3300 }] },
  // Sports
  { symbol: "DRAFT", name: "Athlete representation agency", description: "Athlete representation agency", sector: "sports", priceInCents: 5800, previousCloseInCents: 5800, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 5800 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 5800 }] },
  { symbol: "ARENA", name: "Sports venue & events company", description: "Sports venue & events company", sector: "sports", priceInCents: 7100, previousCloseInCents: 7100, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 7100 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 7100 }] },
  { symbol: "STATS", name: "Sports analytics & media platform", description: "Sports analytics & media platform", sector: "sports", priceInCents: 4400, previousCloseInCents: 4400, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 4400 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 4400 }] },
  // Entertainment
  { symbol: "SCREEN", name: "Black film production studio", description: "Black film production studio", sector: "entertainment", priceInCents: 8300, previousCloseInCents: 8300, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 8300 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 8300 }] },
  { symbol: "STAGE", name: "Live events & venue company", description: "Live events & venue company", sector: "entertainment", priceInCents: 4900, previousCloseInCents: 4900, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 4900 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 4900 }] },
  { symbol: "GAME", name: "Gaming & esports company", description: "Gaming & esports company", sector: "entertainment", priceInCents: 3700, previousCloseInCents: 3700, dailyChangeInCents: 0, dailyChangePercent: 0, marketCapInCents: 3700 * 1_000_000, priceHistory: [{ timestamp: SEED_TIMESTAMP, priceInCents: 3700 }] },
] as const;

export const SEED_COMPANY_STATES = [
  // Media & Content (LOUD leader, SCROLL challenger, VERSE niche)
  { symbol: "LOUD", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["SCROLL", "VERSE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "SCROLL", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["LOUD", "VERSE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "VERSE", revenueTrend: "declining" as const, marketPosition: "niche" as const, competitiveExposure: ["LOUD", "SCROLL"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Streaming (NETFLO leader, VIZN challenger, LIVE niche)
  { symbol: "NETFLO", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["VIZN", "LIVE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "VIZN", revenueTrend: "growing" as const, marketPosition: "challenger" as const, competitiveExposure: ["NETFLO", "LIVE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "LIVE", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["NETFLO", "VIZN"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Music (RYTHM leader, BLOC challenger, CRATE niche)
  { symbol: "RYTHM", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["BLOC", "CRATE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "BLOC", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["RYTHM", "CRATE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "CRATE", revenueTrend: "declining" as const, marketPosition: "niche" as const, competitiveExposure: ["RYTHM", "BLOC"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Gaming (PIXL leader, SQUAD challenger, MOBILE niche)
  { symbol: "PIXL", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["SQUAD", "MOBILE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "SQUAD", revenueTrend: "growing" as const, marketPosition: "challenger" as const, competitiveExposure: ["PIXL", "MOBILE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "MOBILE", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["PIXL", "SQUAD"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Sportswear (KICKS leader, FLEX challenger, COURT niche)
  { symbol: "KICKS", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["FLEX", "COURT"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "FLEX", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["KICKS", "COURT"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "COURT", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["KICKS", "FLEX"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Fashion (RARE leader, DRIP challenger, THREAD niche)
  { symbol: "RARE", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["DRIP", "THREAD"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "DRIP", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["RARE", "THREAD"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "THREAD", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["RARE", "DRIP"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Publishing (READS leader, INK challenger, PRESS niche)
  { symbol: "READS", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["INK", "PRESS"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "INK", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["READS", "PRESS"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "PRESS", revenueTrend: "declining" as const, marketPosition: "niche" as const, competitiveExposure: ["READS", "INK"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Beauty (CROWN leader, GLOW challenger, SHEEN niche)
  { symbol: "CROWN", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["GLOW", "SHEEN"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "GLOW", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["CROWN", "SHEEN"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "SHEEN", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["CROWN", "GLOW"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Finance (STAX leader, VAULT challenger, GROW niche)
  { symbol: "STAX", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["VAULT", "GROW"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "VAULT", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["STAX", "GROW"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "GROW", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["STAX", "VAULT"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Real Estate (BLOK leader, BUILD challenger, HOOD niche)
  { symbol: "BLOK", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["BUILD", "HOOD"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "BUILD", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["BLOK", "HOOD"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "HOOD", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["BLOK", "BUILD"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Sports (ARENA leader, DRAFT challenger, STATS niche)
  { symbol: "ARENA", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["DRAFT", "STATS"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "DRAFT", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["ARENA", "STATS"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "STATS", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["ARENA", "DRAFT"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  // Entertainment (SCREEN leader, STAGE challenger, GAME niche)
  { symbol: "SCREEN", revenueTrend: "growing" as const, marketPosition: "leader" as const, competitiveExposure: ["STAGE", "GAME"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "STAGE", revenueTrend: "stable" as const, marketPosition: "challenger" as const, competitiveExposure: ["SCREEN", "GAME"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
  { symbol: "GAME", revenueTrend: "stable" as const, marketPosition: "niche" as const, competitiveExposure: ["SCREEN", "STAGE"], recentEvents: [] as string[], lastEventType: "earnings" as const, seasonalContext: "standard" },
];
