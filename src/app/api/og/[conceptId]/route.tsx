import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// Inline concept data for edge compatibility
const CONCEPT_MAP: Record<string, { name: string; oneLiner: string }> = {
  "supply-demand": {
    name: "Supply & Demand",
    oneLiner: "When demand is high and supply is low, prices go up.",
  },
  "bull-bear": {
    name: "Bull & Bear Markets",
    oneLiner: "Bull markets rise, bear markets fall — both are part of the cycle.",
  },
  "buy-sell-basics": {
    name: "Buy & Sell Basics",
    oneLiner: "Buy low, sell high — the fundamental goal of every trade.",
  },
  "profit-loss": {
    name: "Profit & Loss",
    oneLiner: "Profit is what's left after subtracting what you paid from what you earned.",
  },
  "portfolio-value": {
    name: "Portfolio Value",
    oneLiner: "Your portfolio value is the total worth of your cash plus all your holdings.",
  },
  diversification: {
    name: "Diversification",
    oneLiner: "Spread your money across assets so one bad day doesn't wipe you out.",
  },
  "sector-correlation": {
    name: "Sector Correlation",
    oneLiner: "Stocks in the same sector tend to move together.",
  },
  "emotional-investing": {
    name: "Emotional Investing",
    oneLiner: "Trading on fear or hype instead of data leads to buying high and selling low.",
  },
  "consumer-spending": {
    name: "Consumer Spending Power",
    oneLiner: "When people have more money to spend, consumer-facing companies grow.",
  },
  "economic-multiplier": {
    name: "Economic Multiplier",
    oneLiner: "One dollar spent in the right place generates far more than a dollar of activity.",
  },
  "dividend-investing": {
    name: "Dividend Investing",
    oneLiner: "Dividends give you regular cash payments just for holding a stock.",
  },
  "halo-effect": {
    name: "Halo Effect",
    oneLiner: "One positive association can make an entire brand look better to investors.",
  },
  "competitive-displacement": {
    name: "Competitive Displacement",
    oneLiner: "When one company wins market share at the direct expense of a rival.",
  },
  "pe-ratio": {
    name: "P/E Ratio",
    oneLiner: "How much investors pay per dollar of a company's profit.",
  },
  "economic-moat": {
    name: "Economic Moat",
    oneLiner: "A company's ability to protect its market position from competitors.",
  },
  "risk-adjusted-return": {
    name: "Risk-Adjusted Return",
    oneLiner: "How much profit you made relative to the risk you took.",
  },
  "dollar-cost-avg": {
    name: "Dollar Cost Averaging",
    oneLiner: "Invest a fixed amount regularly to smooth out market volatility.",
  },
  "acquisition-economics": {
    name: "Acquisition Economics",
    oneLiner: "Buying another company can create value — or destroy it if you overpay.",
  },
  "vc-dilution": {
    name: "VC Dilution",
    oneLiner: "Raising venture capital creates new shares, shrinking every existing owner's slice.",
  },
  "portfolio-rebalancing": {
    name: "Portfolio Rebalancing",
    oneLiner: "Selling winners and buying laggards to restore your target allocation.",
  },
  inflation: {
    name: "Inflation",
    oneLiner: "When prices rise, your money buys less — and growth stocks can suffer.",
  },
  "consumer-confidence": {
    name: "Consumer Confidence",
    oneLiner: "When people feel financially secure, they spend more — and markets respond.",
  },
  "black-dollar": {
    name: "The Black Dollar",
    oneLiner: "The collective $1.6 trillion annual purchasing power of Black Americans.",
  },
};

export async function GET(
  _request: Request,
  { params }: { params: { conceptId: string } }
) {
  const concept = CONCEPT_MAP[params.conceptId];

  const name = concept?.name ?? "Financial Concept";
  const oneLiner = concept?.oneLiner ?? "Learn to build wealth on BLK Exchange.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#0e0e0e",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          fontFamily: "'Courier New', Courier, monospace",
          border: "4px solid #ffffff",
          boxSizing: "border-box",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #ffffff30",
            paddingBottom: "24px",
          }}
        >
          <span
            style={{
              color: "#FDE047",
              fontSize: "22px",
              fontWeight: "700",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            BLK EXCHANGE
          </span>
          <span
            style={{
              color: "#ffffff40",
              fontSize: "16px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Vault Concept
          </span>
        </div>

        {/* Concept name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "900",
              color: "#ffffff",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </div>

          {/* One-liner box */}
          <div
            style={{
              borderLeft: "4px solid #FDE047",
              paddingLeft: "24px",
              display: "flex",
            }}
          >
            <span
              style={{
                fontSize: "26px",
                color: "#ffffff99",
                lineHeight: "1.5",
                maxWidth: "900px",
              }}
            >
              {oneLiner}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #ffffff30",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              color: "#ffffff40",
              fontSize: "18px",
              letterSpacing: "0.1em",
            }}
          >
            #BLKExchange · #FinancialLiteracy
          </span>
          <div
            style={{
              backgroundColor: "#FDE047",
              color: "#0e0e0e",
              fontSize: "16px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "10px 20px",
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px 0px #000000",
            }}
          >
            Unlock Your Knowledge
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
