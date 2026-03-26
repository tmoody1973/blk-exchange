const TIERS = [
  {
    name: "Foundation",
    count: 5,
    color: "#22c55e",
    concepts: ["Supply & Demand", "Buy vs. Sell", "Portfolio Basics", "Market Cap", "Price Movement"],
  },
  {
    name: "Intermediate",
    count: 8,
    color: "#7F77DD",
    concepts: ["Diversification", "Sector Correlation", "P/E Ratio", "Earnings Reports", "Analyst Ratings", "Short Selling", "Volume & Liquidity", "News Sentiment"],
  },
  {
    name: "Advanced",
    count: 7,
    color: "#FDE047",
    concepts: ["Beta & Volatility", "Dollar-Cost Averaging", "Rebalancing", "Risk-Adjusted Returns", "Portfolio Concentration", "Momentum Trading", "Contrarian Strategy"],
  },
  {
    name: "Economics",
    count: 3,
    color: "#ef4444",
    concepts: ["The Black Dollar", "Community Capital", "Generational Wealth"],
  },
];

const TOTAL = 23;

export function CurriculumPreview() {
  return (
    <section className="bg-[#0e0e0e] border-t-2 border-white py-20 px-4" id="curriculum">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h2
            className="text-2xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            THE KNOWLEDGE VAULT
          </h2>
          <p className="text-[#a0a0a0] text-base max-w-xl">
            Every concept unlocks through gameplay, not lectures. Trade your
            way through 23 investing concepts across 4 tiers.
          </p>
        </div>

        {/* Progress bar */}
        <div className="border-2 border-white bg-[#1a1a1a] p-6 shadow-[4px_4px_0px_0px_#ffffff] mb-8">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              KNOWLEDGE PROGRESS
            </span>
            <span
              className="text-sm font-bold text-[#a0a0a0]"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              0 of {TOTAL} concepts
            </span>
          </div>
          <div className="h-3 w-full border-2 border-white bg-[#0e0e0e]">
            <div className="h-full w-0 bg-[#7F77DD]" />
          </div>
          <p className="text-xs text-[#a0a0a0] mt-2">
            Start trading to unlock your first concept.
          </p>
        </div>

        {/* Tier bars */}
        <div className="flex flex-col gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="border-2 border-white bg-[#1a1a1a] p-5 shadow-[4px_4px_0px_0px_#ffffff]"
              style={{ borderLeftColor: tier.color, borderLeftWidth: "4px" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-sm font-bold"
                  style={{ color: tier.color, fontFamily: "Courier New, monospace" }}
                >
                  {tier.name.toUpperCase()}
                </span>
                <span
                  className="text-xs text-[#a0a0a0]"
                  style={{ fontFamily: "Courier New, monospace" }}
                >
                  {tier.count} concepts
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tier.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="text-xs border border-white/20 bg-[#0e0e0e] px-2 py-0.5 text-[#a0a0a0]"
                    style={{ fontFamily: "Courier New, monospace" }}
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
