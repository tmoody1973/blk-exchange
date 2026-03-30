import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playerName = (url.searchParams.get("player") ?? "Trader").slice(0, 30);
  const portfolioValue = (url.searchParams.get("value") ?? "$10,000.00").slice(0, 20);
  const change = (url.searchParams.get("change") ?? "+0.00%").slice(0, 10);
  const sectors = (url.searchParams.get("sectors") ?? "0").slice(0, 5);
  const concepts = (url.searchParams.get("concepts") ?? "0").slice(0, 5);
  const holdings = (url.searchParams.get("holdings") ?? "0").slice(0, 5);

  const isPositive = !change.startsWith("-");
  const changeColor = isPositive ? "#22c55e" : "#ef4444";

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
              color: "#7F77DD",
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
            {`${playerName}\u2019s Portfolio`}
          </span>
        </div>

        {/* Portfolio value */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: "900",
              color: "#ffffff",
              lineHeight: "1",
              letterSpacing: "-0.02em",
            }}
          >
            {portfolioValue}
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "900",
              color: changeColor,
              lineHeight: "1",
            }}
          >
            {change}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "48px",
              marginTop: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  color: "#ffffff40",
                  fontSize: "14px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Holdings
              </span>
              <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: "900" }}>
                {holdings}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  color: "#ffffff40",
                  fontSize: "14px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Sectors
              </span>
              <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: "900" }}>
                {sectors}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  color: "#ffffff40",
                  fontSize: "14px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Concepts
              </span>
              <span style={{ color: "#FDE047", fontSize: "28px", fontWeight: "900" }}>
                {concepts}/23
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
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
            Learn to Invest. Trade the Culture.
          </span>
          <span
            style={{
              color: "#7F77DD",
              fontSize: "20px",
              fontWeight: "700",
              letterSpacing: "0.1em",
            }}
          >
            blkexchange.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
