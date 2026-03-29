export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "trading" | "diversification" | "learning" | "social";
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Trading milestones
  {
    id: "first-trade",
    name: "First Trade",
    description: "Execute your first buy order",
    category: "trading",
    icon: "🎯",
  },
  {
    id: "first-1k-profit",
    name: "First $1K Profit",
    description: "Portfolio hits $11,000+",
    category: "trading",
    icon: "💰",
  },
  {
    id: "survived-bear",
    name: "Survived a Bear Market",
    description: "Hold through a -10%+ daily drop without selling",
    category: "trading",
    icon: "🐻",
  },
  {
    id: "day-trader",
    name: "Day Trader",
    description: "Execute 10+ trades in one session",
    category: "trading",
    icon: "⚡",
  },
  {
    id: "patient-investor",
    name: "Patient Investor",
    description: "Hold a position for 24+ hours",
    category: "trading",
    icon: "🕰️",
  },

  // Diversification
  {
    id: "six-sector-club",
    name: "6-Sector Club",
    description: "Hold stocks in 6+ sectors",
    category: "diversification",
    icon: "🌐",
  },
  {
    id: "full-spectrum",
    name: "Full Spectrum",
    description: "Hold at least 1 stock in all 12 sectors",
    category: "diversification",
    icon: "🌈",
  },
  {
    id: "sector-specialist",
    name: "Sector Specialist",
    description: "Hold 3 stocks in one sector",
    category: "diversification",
    icon: "🎓",
  },

  // Learning
  {
    id: "vault-rookie",
    name: "Vault Rookie",
    description: "Unlock 5 investing concepts",
    category: "learning",
    icon: "📘",
  },
  {
    id: "vault-pro",
    name: "Vault Pro",
    description: "Unlock 15 investing concepts",
    category: "learning",
    icon: "📗",
  },
  {
    id: "vault-master",
    name: "Vault Master",
    description: "Unlock all 23 concepts",
    category: "learning",
    icon: "📕",
  },
  {
    id: "professors-favorite",
    name: "Professor's Favorite",
    description: "Ask Professor BLK 10 questions",
    category: "learning",
    icon: "🎓",
  },

  // Social
  {
    id: "streak-master",
    name: "Streak Master",
    description: "7-day login streak",
    category: "social",
    icon: "🔥",
  },
];
