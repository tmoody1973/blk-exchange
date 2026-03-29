"use client";

import { useState, useEffect, useCallback } from "react";

interface AnimatedSplashProps {
  isReady: boolean;
  onComplete: () => void;
}

const TICKERS = [
  { sym: "SOUL", price: "42.50", chg: "+3.2%", up: true },
  { sym: "MELN", price: "78.30", chg: "-1.1%", up: false },
  { sym: "CRWN", price: "156.00", chg: "+0.8%", up: true },
  { sym: "DAPS", price: "23.40", chg: "+5.7%", up: true },
  { sym: "RSTV", price: "91.20", chg: "-2.3%", up: false },
  { sym: "HRLM", price: "45.60", chg: "+1.9%", up: true },
  { sym: "BKST", price: "34.80", chg: "+4.1%", up: true },
  { sym: "FLVR", price: "67.90", chg: "-0.5%", up: false },
];

function TickerContent() {
  return (
    <div className="ticker-content">
      {TICKERS.map((t, i) => (
        <span key={i} className="ticker-item">
          <span className="ticker-sym">{t.sym}</span>
          <span className="ticker-price">${t.price}</span>
          <span className={t.up ? "ticker-chg-up" : "ticker-chg-down"}>
            {t.chg}
          </span>
        </span>
      ))}
    </div>
  );
}

export function AnimatedSplash({ isReady, onComplete }: AnimatedSplashProps) {
  const [phase, setPhase] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);

  // Phase timeline — runs once on mount
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),   // corner brackets draw
      setTimeout(() => setPhase(2), 1000),  // BLK text springs in
      setTimeout(() => setPhase(3), 1400),  // X scales in with glow
      setTimeout(() => setPhase(4), 1800),  // EXCHANGE types out
      setTimeout(() => setPhase(5), 2400),  // tagline fades in
      setTimeout(() => setPhase(6), 3200),  // ticker tape scrolls
      setTimeout(() => setPhase(7), 4200),  // connection indicator
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Trigger wipe-out when animation reaches phase 7 AND Convex is ready
  const handleExit = useCallback(() => {
    const exitTimer = setTimeout(() => setPhase(8), 400);
    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
      onComplete();
    }, 1000);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase >= 7 && isReady) {
      return handleExit();
    }
    // If not ready yet, keep polling — the phase 7 check will re-run
    // whenever isReady flips to true
  }, [phase, isReady, handleExit]);

  if (!shouldRender) return null;

  return (
    <div
      className="splash-container"
      style={{
        clipPath:
          phase >= 8 ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)",
      }}
    >
      {/* CRT scan lines */}
      <div className="splash-scanlines" />

      {/* Corner brackets */}
      <div className="splash-corners" data-visible={String(phase >= 1)}>
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />
      </div>

      {/* Logo */}
      <div className="splash-logo">
        {"BLK".split("").map((char, i) => (
          <span
            key={char}
            className="splash-letter"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${i * 80}ms`,
            }}
          >
            {char}
          </span>
        ))}

        <span
          className="splash-x"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "scale(1)" : "scale(2)",
          }}
        >
          X
        </span>
      </div>

      {/* EXCHANGE typewriter */}
      <div className="splash-subtitle">
        {"EXCHANGE".split("").map((char, i) => (
          <span
            key={i}
            style={{
              opacity: phase >= 4 ? 1 : 0,
              transitionDelay: `${i * 40}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <div
        className="splash-tagline"
        style={{ opacity: phase >= 5 ? 0.5 : 0 }}
      >
        News Moves Markets
      </div>

      {/* Ticker tape */}
      <div
        className="splash-ticker"
        style={{ opacity: phase >= 6 ? 1 : 0 }}
      >
        <div className="splash-ticker-track">
          <TickerContent />
          <TickerContent />
        </div>
      </div>

      {/* Connection status */}
      <div
        className="splash-status"
        style={{ opacity: phase >= 7 ? 1 : 0 }}
      >
        <div className="splash-status-dot" />
        <span>{isReady ? "CONNECTED" : "CONNECTING TO MARKET..."}</span>
      </div>

      {/* Version stamp */}
      <div className="splash-version">v1.0.0 · HACKONOMICS 2026</div>
    </div>
  );
}
