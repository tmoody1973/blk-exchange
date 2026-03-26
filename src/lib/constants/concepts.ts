export type ConceptTier = "foundation" | "intermediate" | "advanced" | "economics";
export type TriggerType = "behavior" | "event";

export interface Concept {
  id: string;
  name: string;
  tier: ConceptTier;
  triggerType: TriggerType;
  triggerDescription: string;
}

export const CONCEPTS: Concept[] = [
  // Foundation (5)
  {
    id: "supply-demand",
    name: "Supply and Demand",
    tier: "foundation",
    triggerType: "behavior",
    triggerDescription: "Held a stock that rose 5%+ after a positive event",
  },
  {
    id: "bull-bear",
    name: "Bull and Bear Markets",
    tier: "foundation",
    triggerType: "behavior",
    triggerDescription: "Portfolio experienced both a +5% day and a -5% day",
  },
  {
    id: "buy-sell-basics",
    name: "Buying and Selling Basics",
    tier: "foundation",
    triggerType: "behavior",
    triggerDescription: "Executed at least 1 buy AND 1 sell",
  },
  {
    id: "profit-loss",
    name: "Profit and Loss",
    tier: "foundation",
    triggerType: "behavior",
    triggerDescription: "Closed a position (sold something you held)",
  },
  {
    id: "portfolio-value",
    name: "Portfolio Value and Net Worth",
    tier: "foundation",
    triggerType: "behavior",
    triggerDescription: "Portfolio value differs from $10,000 by 10%+",
  },
  // Intermediate (8)
  {
    id: "diversification",
    name: "Diversification",
    tier: "intermediate",
    triggerType: "behavior",
    triggerDescription: "Hold positions in 4+ different sectors",
  },
  {
    id: "sector-correlation",
    name: "Sector Correlation",
    tier: "intermediate",
    triggerType: "behavior",
    triggerDescription: "Hold 2+ stocks in same sector when a sector event fires",
  },
  {
    id: "emotional-investing",
    name: "Emotional vs Disciplined Investing",
    tier: "intermediate",
    triggerType: "behavior",
    triggerDescription: "Made a trade within 30s of an event AND that trade lost money",
  },
  {
    id: "consumer-spending",
    name: "Consumer Spending Power",
    tier: "intermediate",
    triggerType: "behavior",
    triggerDescription: "Held a consumer sector stock during a spending event",
  },
  {
    id: "economic-multiplier",
    name: "Economic Multiplier Effect",
    tier: "intermediate",
    triggerType: "event",
    triggerDescription: "Active during a session where a multiplier event fires",
  },
  {
    id: "dividend-investing",
    name: "Dividend Investing",
    tier: "intermediate",
    triggerType: "event",
    triggerDescription: "Active during a session where a dividend event fires",
  },
  {
    id: "halo-effect",
    name: "Halo Effect and Brand Association",
    tier: "intermediate",
    triggerType: "behavior",
    triggerDescription: "Held a stock that rose due to a partnership/celebrity event",
  },
  {
    id: "competitive-displacement",
    name: "Competitive Displacement",
    tier: "intermediate",
    triggerType: "behavior",
    triggerDescription: "Held a stock that dropped while a same-sector rival rose",
  },
  // Advanced (7)
  {
    id: "pe-ratio",
    name: "Price-to-Earnings Ratio",
    tier: "advanced",
    triggerType: "event",
    triggerDescription: "Active during a session where an earnings event fires",
  },
  {
    id: "economic-moat",
    name: "Economic Moat",
    tier: "advanced",
    triggerType: "event",
    triggerDescription: "Active during a session where a moat-related event fires",
  },
  {
    id: "risk-adjusted-return",
    name: "Risk-Adjusted Return",
    tier: "advanced",
    triggerType: "behavior",
    triggerDescription: "Portfolio is profitable AND diversification score is 60+",
  },
  {
    id: "dollar-cost-avg",
    name: "Dollar Cost Averaging",
    tier: "advanced",
    triggerType: "behavior",
    triggerDescription: "Bought the same stock 3+ separate times at different prices",
  },
  {
    id: "acquisition-economics",
    name: "Acquisition Economics",
    tier: "advanced",
    triggerType: "event",
    triggerDescription: "Active during a session where an acquisition event fires",
  },
  {
    id: "vc-dilution",
    name: "Venture Capital and Dilution",
    tier: "advanced",
    triggerType: "event",
    triggerDescription: "Active during a session where a funding round event fires",
  },
  {
    id: "portfolio-rebalancing",
    name: "Portfolio Rebalancing",
    tier: "advanced",
    triggerType: "behavior",
    triggerDescription: "Sold a position >30% of portfolio to buy a different sector",
  },
  // Economics (3)
  {
    id: "inflation",
    name: "Macroeconomics: Inflation",
    tier: "economics",
    triggerType: "event",
    triggerDescription: "Active when inflation event fires and BLK Index drops",
  },
  {
    id: "consumer-confidence",
    name: "Macroeconomics: Consumer Confidence",
    tier: "economics",
    triggerType: "event",
    triggerDescription: "Active when confidence event fires across consumer sectors",
  },
  {
    id: "black-dollar",
    name: "Community Economics: The Black Dollar",
    tier: "economics",
    triggerType: "behavior",
    triggerDescription: "Hold 5+ stocks across 3+ sectors simultaneously",
  },
];
