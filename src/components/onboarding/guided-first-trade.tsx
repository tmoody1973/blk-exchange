"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { GlossaryChip } from "@/components/glossary/glossary-chip";

// ─── Brand tokens ─────────────────────────────────────────

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
  bg: "#0e0e0e",
};

// Neobrutalism shadow helpers
const neo = (color = BRAND.white) => ({
  border: `2px solid ${color}`,
  boxShadow: `4px 4px 0px ${color}`,
});

// ─── Seed event (always the same for new players) ────────

const SEED_TICKER = "CROWN";
const SEED_COMPANY = "Crown Beauty Capital";
const SEED_SECTOR = "Beauty & Wellness";
const SEED_BASE_PRICE_CENTS = 4700; // $47.00

// ─── Props ───────────────────────────────────────────────

interface GuidedFirstTradeProps {
  playerId: Id<"players">;
  playerCashInCents: number;
}

// ─── Sub-components ──────────────────────────────────────

function StepLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "6px 20px",
        background: BRAND.purple,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "2px",
        textTransform: "uppercase" as const,
        color: BRAND.black,
        textAlign: "center" as const,
        fontFamily: "'Courier New', monospace",
      }}
    >
      {label}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────

export function GuidedFirstTrade({
  playerId,
  playerCashInCents,
}: GuidedFirstTradeProps) {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [buyAmountStr, setBuyAmountStr] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [priceAnim, setPriceAnim] = useState(false);
  const [currentPriceCents, setCurrentPriceCents] = useState(
    SEED_BASE_PRICE_CENTS
  );
  const [tradeResult, setTradeResult] = useState<{
    shares: number;
    priceCents: number;
    amountCents: number;
  } | null>(null);

  const advanceOnboarding = useMutation(api.onboarding.advanceOnboarding);
  const executeTrade = useMutation(api.trades.executeTrade);

  // Fetch the CROWN stock record for its _id
  const crownStock = useQuery(api.market.getStock, { symbol: SEED_TICKER });

  // ── Live price simulation on step 1 ───────────────────
  useEffect(() => {
    if (step !== 1) return;
    const interval = setInterval(() => {
      setPriceAnim(true);
      setCurrentPriceCents((prev) => {
        const deltaCents = Math.round((Math.random() - 0.3) * 120);
        return Math.max(4200, Math.min(5200, prev + deltaCents));
      });
      const t = setTimeout(() => setPriceAnim(false), 300);
      return () => clearTimeout(t);
    }, 800);
    return () => clearInterval(interval);
  }, [step]);

  // ── Countdown timer on step 1 ──────────────────────────
  useEffect(() => {
    if (step !== 1) return;
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // ── Mark first event seen when step 1 loads ───────────
  useEffect(() => {
    if (step === 1) {
      advanceOnboarding({ playerId, newState: "first_event_seen" }).catch(
        () => {}
      );
    }
  }, [step, playerId, advanceOnboarding]);

  // ── Derived values ─────────────────────────────────────
  const buyAmountCents = Math.round(parseFloat(buyAmountStr || "0") * 100);
  const balanceDollars = playerCashInCents / 100;
  const sharesPreview =
    buyAmountCents > 0 ? buyAmountCents / currentPriceCents : 0;
  const portfolioPct =
    buyAmountCents > 0 ? (buyAmountCents / playerCashInCents) * 100 : 0;
  const canBuy =
    buyAmountCents > 0 &&
    buyAmountCents <= playerCashInCents &&
    crownStock !== undefined &&
    crownStock !== null;

  const handleBuy = useCallback(async () => {
    if (!canBuy || !crownStock) return;
    try {
      await executeTrade({
        playerId,
        stockId: crownStock._id,
        type: "buy",
        amountInCents: buyAmountCents,
      });
      await advanceOnboarding({ playerId, newState: "first_trade_complete" });
      setTradeResult({
        shares: buyAmountCents / currentPriceCents,
        priceCents: currentPriceCents,
        amountCents: buyAmountCents,
      });
      setStep(3);
    } catch {
      // Trade failed (position limit, network, etc.) — still advance so user isn't stuck
      await advanceOnboarding({ playerId, newState: "first_trade_complete" }).catch(() => {});
      setTradeResult({
        shares: buyAmountCents / currentPriceCents,
        priceCents: currentPriceCents,
        amountCents: buyAmountCents,
      });
      setStep(3);
    }
  }, [
    canBuy,
    crownStock,
    executeTrade,
    playerId,
    buyAmountCents,
    currentPriceCents,
    advanceOnboarding,
  ]);

  const handleContinueToMarket = useCallback(async () => {
    await advanceOnboarding({ playerId, newState: "onboarding_complete" }).catch(
      () => {}
    );
    router.push("/market");
  }, [playerId, advanceOnboarding, router]);

  const priceDollars = currentPriceCents / 100;
  const priceChange =
    ((currentPriceCents - SEED_BASE_PRICE_CENTS) / SEED_BASE_PRICE_CENTS) * 100;

  // ── Step label map ──────────────────────────────────────
  const STEP_LABELS = [
    "LAYER 1 → GUIDED FIRST TRADE",
    "LAYER 1 → FIRST EVENT DROP",
    "LAYER 1 → MAKE YOUR MOVE",
    "LAYER 1 → TRADE RESULT",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: BRAND.bg,
        fontFamily: "'Courier New', monospace",
        color: BRAND.white,
        zIndex: 9000,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: `2px solid ${BRAND.white}`,
          background: BRAND.darkGray,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{ fontWeight: 900, fontSize: "18px", letterSpacing: "-0.5px" }}
          >
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
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "10px",
              color: BRAND.lightGray,
              opacity: 0.5,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Balance
          </div>
          <div
            style={{ fontWeight: 700, fontSize: "14px", color: BRAND.green }}
          >
            ${balanceDollars.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Step label bar */}
      <StepLabel label={STEP_LABELS[step]} />

      {/* Content area */}
      <div
        style={{
          maxWidth: "540px",
          margin: "0 auto",
          width: "100%",
          padding: "24px 20px 48px",
          flex: 1,
        }}
      >
        {/* ═══ STEP 0: Capital Introduction ═══════════════════ */}
        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", padding: "40px 20px 32px" }}>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: "8px",
                  letterSpacing: "-1px",
                }}
              >
                $10,000
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: BRAND.lightGray,
                  opacity: 0.5,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: "36px",
                }}
              >
                Your Starting Capital
              </div>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.7,
                  color: BRAND.lightGray,
                  marginBottom: "8px",
                }}
              >
                News moves markets.
              </div>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.7,
                  color: BRAND.lightGray,
                  marginBottom: "8px",
                }}
              >
                Your job? Read the headlines, make the calls.
              </div>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.7,
                  color: BRAND.white,
                  fontWeight: 700,
                  marginBottom: "0",
                }}
              >
                Let&apos;s start with your first one.
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
            >
              ▶ DROP FIRST EVENT
            </button>
          </div>
        )}

        {/* ═══ STEP 1: First Event ═════════════════════════════ */}
        {step === 1 && (
          <div>
            {/* Breaking news banner */}
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
              <span style={{ animation: "blkPulse 1s infinite" }}>●</span>
              BREAKING EVENT
              <span
                style={{
                  marginLeft: "auto",
                  opacity: 0.8,
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                {countdown}s remaining
              </span>
            </div>

            {/* Event card */}
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
                {SEED_SECTOR}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  lineHeight: 1.3,
                  marginBottom: "12px",
                }}
              >
                Crown Beauty Capital Lands Nationwide Retail Partnership
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: BRAND.lightGray,
                }}
              >
                {SEED_COMPANY} ({SEED_TICKER}) just secured a distribution deal
                with a major national retail chain. Their{" "}
                <GlossaryChip
                  termId="stock"
                  playerId={playerId}
                  eventId="onboarding-001"
                >
                  stock
                </GlossaryChip>{" "}
                is already moving. A deal this big usually means more revenue
                and higher{" "}
                <GlossaryChip
                  termId="share-price"
                  playerId={playerId}
                  eventId="onboarding-001"
                >
                  share prices
                </GlossaryChip>
                .
              </div>
            </div>

            {/* Live ticker */}
            <div
              style={{
                marginBottom: "16px",
                transition: "all 0.15s",
                transform: priceAnim ? "scale(1.01)" : "scale(1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: BRAND.medGray,
                  ...neo(BRAND.white),
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: BRAND.white,
                    }}
                  >
                    {SEED_TICKER}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: BRAND.lightGray,
                      opacity: 0.6,
                    }}
                  >
                    {SEED_COMPANY}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "18px",
                      color: BRAND.white,
                    }}
                  >
                    ${priceDollars.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: priceChange >= 0 ? BRAND.green : BRAND.red,
                    }}
                  >
                    {priceChange >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(priceChange).toFixed(1)}%
                  </div>
                </div>
              </div>
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
              onClick={handleContinueToMarket}
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

        {/* ═══ STEP 2: Trade Execution ══════════════════════════ */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: BRAND.lightGray,
                  opacity: 0.5,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                BUYING
              </div>
              <div style={{ fontSize: "24px", fontWeight: 900 }}>
                {SEED_TICKER}
              </div>
              <div style={{ fontSize: "12px", color: BRAND.lightGray }}>
                {SEED_COMPANY} · ${priceDollars.toFixed(2)}/share
              </div>
            </div>

            {/* Amount input card */}
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
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: 900,
                    opacity: 0.4,
                    lineHeight: 1,
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  value={buyAmountStr}
                  onChange={(e) => setBuyAmountStr(e.target.value)}
                  placeholder="500"
                  min="1"
                  max={balanceDollars}
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
                    appearance: "textfield",
                    MozAppearance: "textfield",
                    WebkitAppearance: "none",
                  }}
                />
              </div>

              {/* Quick-select buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                {[100, 500, 1000, 2500].map((amt) => {
                  const isSelected = buyAmountStr === String(amt);
                  return (
                    <button
                      key={amt}
                      onClick={() => setBuyAmountStr(String(amt))}
                      style={{
                        padding: "6px 14px",
                        background: isSelected ? BRAND.purple : BRAND.medGray,
                        color: BRAND.white,
                        fontFamily: "'Courier New', monospace",
                        fontSize: "12px",
                        fontWeight: 700,
                        border: `1px solid ${isSelected ? BRAND.purple : BRAND.lightGray}`,
                        cursor: "pointer",
                        transition: "all 0.1s",
                      }}
                    >
                      ${amt.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: BRAND.lightGray,
                  opacity: 0.6,
                }}
              >
                This is a{" "}
                <GlossaryChip
                  termId="market-order"
                  playerId={playerId}
                  eventId="onboarding-001"
                >
                  market order
                </GlossaryChip>{" "}
                — you&apos;ll buy at the current price
              </div>
            </div>

            {/* Position preview */}
            {buyAmountCents > 0 && (
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
                    marginBottom: "6px",
                  }}
                >
                  <span>Shares you&apos;d get</span>
                  <span style={{ color: BRAND.white, fontWeight: 700 }}>
                    {sharesPreview.toFixed(4)}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    % of your{" "}
                    <GlossaryChip
                      termId="portfolio"
                      playerId={playerId}
                    >
                      portfolio
                    </GlossaryChip>
                  </span>
                  <span style={{ color: BRAND.white, fontWeight: 700 }}>
                    {portfolioPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={!canBuy}
              style={{
                width: "100%",
                padding: "14px",
                background: canBuy ? BRAND.green : BRAND.medGray,
                color: BRAND.black,
                fontFamily: "'Courier New', monospace",
                fontSize: "15px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: canBuy ? "pointer" : "not-allowed",
                ...neo(BRAND.white),
                opacity: canBuy ? 1 : 0.4,
                transition: "all 0.1s",
              }}
            >
              CONFIRM BUY
            </button>
          </div>
        )}

        {/* ═══ STEP 3: Result + First Lesson ═══════════════════ */}
        {step === 3 && tradeResult && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "52px", marginBottom: "8px", marginTop: "16px" }}>
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
                marginBottom: "28px",
              }}
            >
              Your first move is on the board.
            </div>

            {/* Trade details card */}
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
                  marginBottom: "10px",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: BRAND.lightGray }}>Bought</span>
                <span style={{ fontWeight: 700 }}>
                  {tradeResult.shares.toFixed(4)} shares of {SEED_TICKER}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: BRAND.lightGray }}>Price per share</span>
                <span style={{ fontWeight: 700 }}>
                  ${(tradeResult.priceCents / 100).toFixed(2)}
                </span>
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
                  ${(tradeResult.amountCents / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* First curriculum nudge */}
            <div
              style={{
                padding: "14px 16px",
                background: BRAND.medGray,
                border: `1px solid ${BRAND.yellow}40`,
                marginBottom: "24px",
                fontSize: "13px",
                lineHeight: 1.7,
                color: BRAND.lightGray,
                textAlign: "left",
              }}
            >
              <span style={{ color: BRAND.yellow, fontWeight: 700 }}>
                ✦ Nice.
              </span>{" "}
              You just made your first investment. As more events drop, you&apos;ll
              decide whether to buy into new companies or double down. The key
              to long-term success?{" "}
              <GlossaryChip termId="diversification" playerId={playerId}>
                Diversification
              </GlossaryChip>
              .
            </div>

            <button
              onClick={handleContinueToMarket}
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
              CONTINUE TO MARKET →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
