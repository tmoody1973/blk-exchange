import { useState, useEffect, useRef } from "react";

const BRAND = {
  purple: "#7F77DD",
  yellow: "#FDE047",
  black: "#0A0A0A",
  darkGray: "#1A1A1A",
  medGray: "#2A2A2A",
  lightGray: "#E5E5E5",
  white: "#FFFFFF",
  green: "#4ADE80",
  red: "#EF4444",
};

const neo = (color = BRAND.white) => ({
  border: `2px solid ${color}`,
  boxShadow: `4px 4px 0px ${color}`,
});

const neoPressed = (color = BRAND.white) => ({
  border: `2px solid ${color}`,
  boxShadow: `1px 1px 0px ${color}`,
  transform: "translate(3px, 3px)",
});

// --- GLOSSARY DATA ---
const GLOSSARY = {
  stock: {
    term: "Stock",
    short: "A share of ownership in a company. Own stock = own a piece.",
    concept: "Equity Ownership",
  },
  "market-order": {
    term: "Market Order",
    short: "Buy or sell immediately at the current price. No waiting.",
    concept: "Order Types",
  },
  portfolio: {
    term: "Portfolio",
    short: "Your collection of all investments. Think of it as your financial lineup.",
    concept: "Portfolio Management",
  },
  diversification: {
    term: "Diversification",
    short: "Don't put all your eggs in one basket. Spread investments across sectors.",
    concept: "Risk Management",
  },
  "share-price": {
    term: "Share Price",
    short: "What one share costs right now. It moves based on news and demand.",
    concept: "Market Pricing",
  },
  sector: {
    term: "Sector",
    short: "A category of businesses. Tech, food, media — each is a sector.",
    concept: "Market Structure",
  },
  volatility: {
    term: "Volatility",
    short: "How wildly a price swings. High volatility = big moves, big risk.",
    concept: "Risk Assessment",
  },
};

// --- GLOSSARY CHIP COMPONENT ---
function GlossaryChip({ id, children, seen, onSee }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const data = GLOSSARY[id];
  if (!data) return <span>{children}</span>;
  const alreadySeen = seen.includes(id);

  useEffect(() => {
    if (open && !alreadySeen) {
      const t = setTimeout(() => onSee(id), 1500);
      return () => clearTimeout(t);
    }
  }, [open, alreadySeen, id, onSee]);

  return (
    <span style={{ position: "relative", display: "inline" }} ref={ref}>
      <span
        onClick={() => setOpen(!open)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "1px 8px",
          fontFamily: "'Courier New', monospace",
          fontSize: "inherit",
          fontWeight: 700,
          color: alreadySeen ? BRAND.lightGray : BRAND.yellow,
          background: alreadySeen ? "transparent" : BRAND.medGray,
          border: alreadySeen ? "none" : `2px solid ${BRAND.yellow}`,
          boxShadow: alreadySeen ? "none" : `2px 2px 0px ${BRAND.yellow}`,
          cursor: "pointer",
          transition: "all 0.2s",
          textDecoration: alreadySeen ? "underline" : "none",
          textDecorationStyle: alreadySeen ? "dotted" : undefined,
          textUnderlineOffset: "3px",
        }}
      >
        {children}
        {!alreadySeen && (
          <span style={{ fontSize: "10px", opacity: 0.7 }}>?</span>
        )}
      </span>
      {open && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "0",
            width: "280px",
            padding: "12px 14px",
            background: BRAND.darkGray,
            ...neo(BRAND.purple),
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            lineHeight: "1.5",
            color: BRAND.lightGray,
            zIndex: 100,
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: BRAND.purple,
              marginBottom: "4px",
            }}
          >
            {data.concept}
          </span>
          <span
            style={{
              display: "block",
              fontWeight: 700,
              color: BRAND.white,
              marginBottom: "6px",
              fontSize: "14px",
            }}
          >
            {data.term}
          </span>
          <span style={{ display: "block" }}>{data.short}</span>
          {!alreadySeen && (
            <span
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "10px",
                color: BRAND.yellow,
                opacity: 0.8,
              }}
            >
              ✦ Adding to Knowledge Vault...
            </span>
          )}
        </span>
      )}
    </span>
  );
}

// --- TICKER DISPLAY ---
function Ticker({ symbol, name, price, change, small }) {
  const isUp = change >= 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: small ? "8px 12px" : "12px 16px",
        background: BRAND.medGray,
        ...neo(BRAND.white),
        fontFamily: "'Courier New', monospace",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: small ? "14px" : "16px",
            color: BRAND.white,
          }}
        >
          {symbol}
        </div>
        <div style={{ fontSize: "11px", color: BRAND.lightGray, opacity: 0.6 }}>
          {name}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: small ? "14px" : "18px",
            color: BRAND.white,
          }}
        >
          ${price.toFixed(2)}
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: isUp ? BRAND.green : BRAND.red,
          }}
        >
          {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP ---
export default function App() {
  const [step, setStep] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [holdings, setHoldings] = useState({});
  const [seenTerms, setSeenTerms] = useState([]);
  const [vaultCount, setVaultCount] = useState(0);
  const [buyAmount, setBuyAmount] = useState("");
  const [showResult, setShowResult] = useState(null);
  const [priceAnim, setPriceAnim] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(42.5);
  const [showPhaseLabel, setShowPhaseLabel] = useState(true);

  const markSeen = (id) => {
    if (!seenTerms.includes(id)) {
      setSeenTerms((p) => [...p, id]);
      setVaultCount((p) => p + 1);
    }
  };

  // Phase labels
  const phases = [
    "LAYER 1 → GUIDED FIRST TRADE",
    "LAYER 1 → FIRST EVENT DROP",
    "LAYER 1 → MAKE YOUR MOVE",
    "LAYER 1 → TRADE RESULT",
    "LAYER 2 → GLOSSARY CHIPS IN CONTEXT",
    "LAYER 3 → KNOWLEDGE VAULT PROGRESSION",
  ];

  useEffect(() => {
    setShowPhaseLabel(true);
    const t = setTimeout(() => setShowPhaseLabel(false), 2500);
    return () => clearTimeout(t);
  }, [step]);

  // Step 2: animate price
  useEffect(() => {
    if (step === 1) {
      const interval = setInterval(() => {
        setPriceAnim(true);
        setCurrentPrice((p) => {
          const delta = (Math.random() - 0.3) * 1.2;
          return Math.max(38, Math.min(48, p + delta));
        });
        setTimeout(() => setPriceAnim(false), 300);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleBuy = () => {
    const amount = parseFloat(buyAmount);
    if (!amount || amount <= 0 || amount > balance) return;
    const shares = amount / currentPrice;
    setBalance((b) => b - amount);
    setHoldings({ SOUL: (holdings.SOUL || 0) + shares });
    setShowResult({
      shares: shares.toFixed(4),
      price: currentPrice.toFixed(2),
      amount: amount.toFixed(2),
    });
    setStep(3);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BRAND.black,
        fontFamily: "'Courier New', monospace",
        color: BRAND.white,
        padding: "0",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: `2px solid ${BRAND.white}`,
          background: BRAND.darkGray,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 900, fontSize: "18px", letterSpacing: "-0.5px" }}>
            BLK<span style={{ color: BRAND.purple }}>X</span>
          </span>
          <span
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: BRAND.purple,
              opacity: 0.8,
            }}
          >
            Exchange
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: BRAND.medGray,
              border: `1px solid ${BRAND.yellow}`,
              fontSize: "12px",
            }}
          >
            <span style={{ color: BRAND.yellow }}>✦</span>
            <span style={{ color: BRAND.yellow, fontWeight: 700 }}>
              {vaultCount}/23
            </span>
            <span style={{ color: BRAND.lightGray, opacity: 0.5, fontSize: "10px" }}>
              VAULT
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: BRAND.lightGray, opacity: 0.5 }}>
              BALANCE
            </div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: BRAND.green }}>
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* PHASE INDICATOR */}
      <div
        style={{
          padding: "8px 20px",
          background: BRAND.purple,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: BRAND.black,
          textAlign: "center",
          transition: "opacity 0.5s",
          opacity: showPhaseLabel ? 1 : 0.3,
        }}
      >
        {phases[step] || phases[phases.length - 1]}
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "540px", margin: "0 auto", padding: "24px 20px" }}>
        {/* ===== STEP 0: WELCOME / DROP IN ===== */}
        {step === 0 && (
          <div>
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px 32px",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                $10,000
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: BRAND.lightGray,
                  opacity: 0.6,
                  marginBottom: "32px",
                }}
              >
                YOUR STARTING CAPITAL
              </div>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: BRAND.lightGray,
                  marginBottom: "8px",
                }}
              >
                News moves markets.
              </div>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: BRAND.lightGray,
                  marginBottom: "8px",
                }}
              >
                Your job? Read the headlines, make the calls.
              </div>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: BRAND.white,
                  fontWeight: 700,
                }}
              >
                Let's start with your first one.
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              style={{
                width: "100%",
                padding: "16px",
                background: BRAND.purple,
                color: BRAND.white,
                fontFamily: "'Courier New', monospace",
                fontSize: "16px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "2px",
                cursor: "pointer",
                ...neo(BRAND.white),
                transition: "all 0.1s",
              }}
              onMouseDown={(e) => Object.assign(e.target.style, neoPressed())}
              onMouseUp={(e) => Object.assign(e.target.style, neo())}
            >
              ▶ DROP FIRST EVENT
            </button>
          </div>
        )}

        {/* ===== STEP 1: EVENT DROP ===== */}
        {step === 1 && (
          <div>
            {/* Breaking News Banner */}
            <div
              style={{
                padding: "8px 12px",
                background: BRAND.red,
                color: BRAND.white,
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ animation: "pulse 1s infinite" }}>●</span>
              BREAKING EVENT
              <span style={{ marginLeft: "auto", opacity: 0.7, fontSize: "10px" }}>
                0:47 remaining
              </span>
            </div>

            {/* Event Card */}
            <div
              style={{
                padding: "20px",
                background: BRAND.darkGray,
                ...neo(BRAND.white),
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: BRAND.purple,
                  marginBottom: "8px",
                }}
              >
                FOOD & BEVERAGE SECTOR
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  lineHeight: 1.3,
                  marginBottom: "12px",
                }}
              >
                SoulFood Capital Lands Nationwide Grocery Deal
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: BRAND.lightGray,
                }}
              >
                SoulFood Capital (SOUL) just secured a distribution deal with a
                major national grocery chain. Their{" "}
                <GlossaryChip id="stock" seen={seenTerms} onSee={markSeen}>
                  stock
                </GlossaryChip>{" "}
                is already moving. A deal this big usually means more revenue
                and higher{" "}
                <GlossaryChip id="share-price" seen={seenTerms} onSee={markSeen}>
                  share prices
                </GlossaryChip>
                .
              </div>
            </div>

            {/* Ticker */}
            <div
              style={{
                marginBottom: "16px",
                transition: "all 0.15s",
                transform: priceAnim ? "scale(1.01)" : "scale(1)",
              }}
            >
              <Ticker
                symbol="SOUL"
                name="SoulFood Capital"
                price={currentPrice}
                change={((currentPrice - 42.5) / 42.5) * 100}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                padding: "14px",
                background: BRAND.green,
                color: BRAND.black,
                fontFamily: "'Courier New', monospace",
                fontSize: "15px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                ...neo(BRAND.white),
                marginBottom: "8px",
              }}
            >
              I WANT TO BUY →
            </button>
            <button
              onClick={() => setStep(4)}
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                color: BRAND.lightGray,
                fontFamily: "'Courier New', monospace",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                border: `1px solid ${BRAND.medGray}`,
                opacity: 0.6,
              }}
            >
              SKIP THIS EVENT
            </button>
          </div>
        )}

        {/* ===== STEP 2: BUY SCREEN ===== */}
        {step === 2 && (
          <div>
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "11px", color: BRAND.lightGray, opacity: 0.5 }}>
                BUYING
              </div>
              <div style={{ fontSize: "24px", fontWeight: 900 }}>SOUL</div>
              <div style={{ fontSize: "12px", color: BRAND.lightGray }}>
                SoulFood Capital · ${currentPrice.toFixed(2)}/share
              </div>
            </div>

            {/* Amount Input */}
            <div
              style={{
                padding: "20px",
                background: BRAND.darkGray,
                ...neo(BRAND.white),
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: BRAND.lightGray,
                  opacity: 0.5,
                  marginBottom: "12px",
                }}
              >
                HOW MUCH DO YOU WANT TO INVEST?
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "32px", fontWeight: 900, opacity: 0.4 }}>
                  $
                </span>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="500"
                  style={{
                    width: "160px",
                    fontSize: "32px",
                    fontWeight: 900,
                    fontFamily: "'Courier New', monospace",
                    background: "transparent",
                    border: "none",
                    borderBottom: `3px solid ${BRAND.purple}`,
                    color: BRAND.white,
                    textAlign: "center",
                    outline: "none",
                  }}
                />
              </div>

              {/* Quick Amount Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                {[100, 500, 1000, 2500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBuyAmount(String(amt))}
                    style={{
                      padding: "6px 14px",
                      background:
                        buyAmount === String(amt) ? BRAND.purple : BRAND.medGray,
                      color: BRAND.white,
                      fontFamily: "'Courier New', monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: `1px solid ${buyAmount === String(amt) ? BRAND.purple : BRAND.lightGray}`,
                      cursor: "pointer",
                    }}
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <div
                style={{ fontSize: "12px", color: BRAND.lightGray, opacity: 0.5 }}
              >
                This is a{" "}
                <GlossaryChip
                  id="market-order"
                  seen={seenTerms}
                  onSee={markSeen}
                >
                  market order
                </GlossaryChip>{" "}
                — you'll buy at the current price
              </div>
            </div>

            {/* Position Preview */}
            {buyAmount && parseFloat(buyAmount) > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  background: BRAND.medGray,
                  border: `1px solid ${BRAND.purple}40`,
                  marginBottom: "16px",
                  fontSize: "12px",
                  color: BRAND.lightGray,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>Shares you'd get</span>
                  <span style={{ color: BRAND.white, fontWeight: 700 }}>
                    {(parseFloat(buyAmount) / currentPrice).toFixed(4)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    % of your{" "}
                    <GlossaryChip
                      id="portfolio"
                      seen={seenTerms}
                      onSee={markSeen}
                    >
                      portfolio
                    </GlossaryChip>
                  </span>
                  <span style={{ color: BRAND.white, fontWeight: 700 }}>
                    {((parseFloat(buyAmount) / balance) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={
                !buyAmount || parseFloat(buyAmount) <= 0 || parseFloat(buyAmount) > balance
              }
              style={{
                width: "100%",
                padding: "14px",
                background:
                  buyAmount && parseFloat(buyAmount) > 0
                    ? BRAND.green
                    : BRAND.medGray,
                color: BRAND.black,
                fontFamily: "'Courier New', monospace",
                fontSize: "15px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor:
                  buyAmount && parseFloat(buyAmount) > 0
                    ? "pointer"
                    : "not-allowed",
                ...neo(BRAND.white),
                opacity: buyAmount && parseFloat(buyAmount) > 0 ? 1 : 0.4,
              }}
            >
              CONFIRM BUY
            </button>
          </div>
        )}

        {/* ===== STEP 3: RESULT ===== */}
        {step === 3 && showResult && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "8px",
                marginTop: "20px",
              }}
            >
              ✓
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 900,
                marginBottom: "4px",
                color: BRAND.green,
              }}
            >
              TRADE EXECUTED
            </div>
            <div
              style={{
                fontSize: "13px",
                color: BRAND.lightGray,
                marginBottom: "24px",
              }}
            >
              Your first move is on the board.
            </div>

            <div
              style={{
                padding: "20px",
                background: BRAND.darkGray,
                ...neo(BRAND.green),
                textAlign: "left",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: BRAND.lightGray }}>Bought</span>
                <span style={{ fontWeight: 700 }}>
                  {showResult.shares} shares of SOUL
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: BRAND.lightGray }}>Price per share</span>
                <span style={{ fontWeight: 700 }}>${showResult.price}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: BRAND.lightGray }}>Total invested</span>
                <span style={{ fontWeight: 700, color: BRAND.green }}>
                  ${showResult.amount}
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "14px 16px",
                background: BRAND.medGray,
                border: `1px solid ${BRAND.yellow}40`,
                marginBottom: "20px",
                fontSize: "13px",
                lineHeight: 1.6,
                color: BRAND.lightGray,
                textAlign: "left",
              }}
            >
              <span style={{ color: BRAND.yellow, fontWeight: 700 }}>
                ✦ Nice.
              </span>{" "}
              You just made your first investment. As more events drop,
              you'll decide whether to buy into new companies or double down.
              The key to long-term success?{" "}
              <GlossaryChip
                id="diversification"
                seen={seenTerms}
                onSee={markSeen}
              >
                Diversification
              </GlossaryChip>
              .
            </div>

            <button
              onClick={() => setStep(4)}
              style={{
                width: "100%",
                padding: "14px",
                background: BRAND.purple,
                color: BRAND.white,
                fontFamily: "'Courier New', monospace",
                fontSize: "15px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                ...neo(BRAND.white),
              }}
            >
              SEE HOW CHIPS WORK →
            </button>
          </div>
        )}

        {/* ===== STEP 4: GLOSSARY CHIP SHOWCASE ===== */}
        {step === 4 && (
          <div>
            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: BRAND.purple,
                marginBottom: "16px",
              }}
            >
              GLOSSARY CHIP BEHAVIOR
            </div>
            <div
              style={{
                padding: "20px",
                background: BRAND.darkGray,
                ...neo(BRAND.white),
                marginBottom: "16px",
                fontSize: "14px",
                lineHeight: 1.8,
              }}
            >
              <p style={{ marginTop: 0, marginBottom: "16px" }}>
                During gameplay, financial terms appear as{" "}
                <strong style={{ color: BRAND.yellow }}>tappable chips</strong>{" "}
                the first time you encounter them. Tap any highlighted term to
                learn what it means:
              </p>
              <p style={{ marginBottom: "16px" }}>
                Your{" "}
                <GlossaryChip id="portfolio" seen={seenTerms} onSee={markSeen}>
                  portfolio
                </GlossaryChip>{" "}
                grows as you invest across different{" "}
                <GlossaryChip id="sector" seen={seenTerms} onSee={markSeen}>
                  sectors
                </GlossaryChip>
                . Higher{" "}
                <GlossaryChip id="volatility" seen={seenTerms} onSee={markSeen}>
                  volatility
                </GlossaryChip>{" "}
                means bigger potential gains — but also bigger risk.
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: BRAND.lightGray, opacity: 0.6 }}>
                ↑ Tap the highlighted terms above. Once learned, they fade to
                dotted underlines — still tappable but no longer calling for
                attention.
              </p>
            </div>

            <button
              onClick={() => setStep(5)}
              style={{
                width: "100%",
                padding: "14px",
                background: BRAND.purple,
                color: BRAND.white,
                fontFamily: "'Courier New', monospace",
                fontSize: "15px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                ...neo(BRAND.white),
              }}
            >
              SEE KNOWLEDGE VAULT →
            </button>
          </div>
        )}

        {/* ===== STEP 5: VAULT SHOWCASE ===== */}
        {step === 5 && (
          <div>
            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: BRAND.yellow,
                marginBottom: "16px",
              }}
            >
              ✦ KNOWLEDGE VAULT — YOUR EARNED GLOSSARY
            </div>

            <div
              style={{
                padding: "16px",
                background: BRAND.darkGray,
                border: `2px solid ${BRAND.yellow}`,
                boxShadow: `4px 4px 0px ${BRAND.yellow}`,
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontWeight: 900, fontSize: "16px" }}>
                  VAULT CARDS
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: BRAND.yellow,
                    fontWeight: 700,
                  }}
                >
                  {seenTerms.length} / 23 concepts
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: "8px",
                  background: BRAND.medGray,
                  border: `1px solid ${BRAND.yellow}40`,
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(seenTerms.length / 23) * 100}%`,
                    background: BRAND.yellow,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>

              {/* Unlocked cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {seenTerms.map((id) => {
                  const g = GLOSSARY[id];
                  if (!g) return null;
                  return (
                    <div
                      key={id}
                      style={{
                        padding: "10px 14px",
                        background: BRAND.medGray,
                        border: `1px solid ${BRAND.yellow}40`,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <span style={{ color: BRAND.yellow, fontSize: "14px" }}>
                        ✦
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px" }}>
                          {g.term}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: BRAND.lightGray,
                            opacity: 0.7,
                            marginTop: "2px",
                          }}
                        >
                          {g.short}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Locked placeholders */}
                {Array.from({ length: Math.min(3, 23 - seenTerms.length) }).map(
                  (_, i) => (
                    <div
                      key={`locked-${i}`}
                      style={{
                        padding: "10px 14px",
                        background: BRAND.medGray,
                        border: `1px dashed ${BRAND.lightGray}20`,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        opacity: 0.3,
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>🔒</span>
                      <span style={{ fontSize: "12px" }}>
                        Keep playing to unlock
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div
              style={{
                padding: "14px 16px",
                background: BRAND.medGray,
                fontSize: "12px",
                lineHeight: 1.7,
                color: BRAND.lightGray,
                marginBottom: "20px",
              }}
            >
              <strong style={{ color: BRAND.white }}>The loop:</strong> Events
              drop → you trade → glossary chips teach terms in context → terms
              unlock in the Vault → Vault progress tracks your financial
              literacy journey. No tutorials. No homework. Just play.
            </div>

            <button
              onClick={() => {
                setStep(0);
                setBalance(10000);
                setHoldings({});
                setSeenTerms([]);
                setVaultCount(0);
                setBuyAmount("");
                setShowResult(null);
                setCurrentPrice(42.5);
              }}
              style={{
                width: "100%",
                padding: "14px",
                background: "transparent",
                color: BRAND.lightGray,
                fontFamily: "'Courier New', monospace",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                border: `2px solid ${BRAND.lightGray}40`,
              }}
            >
              ↻ RESTART DEMO
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
        input[type=number] { -moz-appearance: textfield; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
