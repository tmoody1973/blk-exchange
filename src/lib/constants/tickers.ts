export const TICKERS = [
  // Media & Content
  { symbol: "LOUD", name: "Podcast & media network", sector: "media", startPriceInCents: 4200 },
  { symbol: "SCROLL", name: "Digital media & newsletter platform", sector: "media", startPriceInCents: 2800 },
  { symbol: "VERSE", name: "Literary & spoken word platform", sector: "media", startPriceInCents: 1900 },
  // Streaming
  { symbol: "VIZN", name: "Black-owned streaming platform", sector: "streaming", startPriceInCents: 7800 },
  { symbol: "NETFLO", name: "Corporate mega-streaming platform", sector: "streaming", startPriceInCents: 14200 },
  { symbol: "LIVE", name: "Live event streaming platform", sector: "streaming", startPriceInCents: 3100 },
  // Music
  { symbol: "RYTHM", name: "Music streaming & distribution", sector: "music", startPriceInCents: 6100 },
  { symbol: "BLOC", name: "Independent record label", sector: "music", startPriceInCents: 3400 },
  { symbol: "CRATE", name: "Music discovery platform", sector: "music", startPriceInCents: 1800 },
  // Gaming
  { symbol: "PIXL", name: "Black-owned game studio", sector: "gaming", startPriceInCents: 8800 },
  { symbol: "MOBILE", name: "Mobile gaming platform", sector: "gaming", startPriceInCents: 4400 },
  { symbol: "SQUAD", name: "Esports org & content platform", sector: "gaming", startPriceInCents: 5600 },
  // Sportswear
  { symbol: "KICKS", name: "Performance athletic footwear brand", sector: "sportswear", startPriceInCents: 11200 },
  { symbol: "FLEX", name: "Athletic apparel line", sector: "sportswear", startPriceInCents: 4700 },
  { symbol: "COURT", name: "Sports equipment & training brand", sector: "sportswear", startPriceInCents: 3300 },
  // Fashion
  { symbol: "DRIP", name: "Established streetwear brand", sector: "fashion", startPriceInCents: 6500 },
  { symbol: "RARE", name: "Limited-drop hype brand", sector: "fashion", startPriceInCents: 9400 },
  { symbol: "THREAD", name: "Custom apparel & creator merch", sector: "fashion", startPriceInCents: 2200 },
  // Publishing
  { symbol: "INK", name: "Black book publishing house", sector: "publishing", startPriceInCents: 3800 },
  { symbol: "READS", name: "Digital reading & audio platform", sector: "publishing", startPriceInCents: 5100 },
  { symbol: "PRESS", name: "Independent press & literary network", sector: "publishing", startPriceInCents: 1700 },
  // Beauty
  { symbol: "CROWN", name: "Natural hair care brand", sector: "beauty", startPriceInCents: 4700 },
  { symbol: "GLOW", name: "Skincare & wellness brand", sector: "beauty", startPriceInCents: 3100 },
  { symbol: "SHEEN", name: "Black salon chain", sector: "beauty", startPriceInCents: 2400 },
  // Finance
  { symbol: "VAULT", name: "Black community bank", sector: "finance", startPriceInCents: 5200 },
  { symbol: "STAX", name: "Black fintech & payments app", sector: "finance", startPriceInCents: 6800 },
  { symbol: "GROW", name: "CDFI & community lending fund", sector: "finance", startPriceInCents: 2900 },
  // Real Estate
  { symbol: "BLOK", name: "Real estate investment trust", sector: "realestate", startPriceInCents: 9400 },
  { symbol: "BUILD", name: "Infrastructure & construction co", sector: "realestate", startPriceInCents: 6700 },
  { symbol: "HOOD", name: "Affordable housing developer", sector: "realestate", startPriceInCents: 3300 },
  // Sports
  { symbol: "DRAFT", name: "Athlete representation agency", sector: "sports", startPriceInCents: 5800 },
  { symbol: "ARENA", name: "Sports venue & events company", sector: "sports", startPriceInCents: 7100 },
  { symbol: "STATS", name: "Sports analytics & media platform", sector: "sports", startPriceInCents: 4400 },
  // Entertainment
  { symbol: "SCREEN", name: "Black film production studio", sector: "entertainment", startPriceInCents: 8300 },
  { symbol: "STAGE", name: "Live events & venue company", sector: "entertainment", startPriceInCents: 4900 },
  { symbol: "GAME", name: "Gaming & esports company", sector: "entertainment", startPriceInCents: 3700 },
] as const;

export type TickerSymbol = typeof TICKERS[number]["symbol"];
