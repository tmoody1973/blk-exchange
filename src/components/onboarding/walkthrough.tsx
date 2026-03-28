"use client";

import { useState, useEffect } from "react";

const WALKTHROUGH_KEY = "blk-exchange-walkthrough-completed";

const STEPS = [
  {
    title: "Welcome to BLK Exchange",
    content:
      "You just got $10,000 in virtual capital. Trade 36 Black-economy companies, learn 23 investing concepts, and compete on the leaderboard.",
  },
  {
    title: "The Market",
    content:
      "The ticker table shows all 36 companies across 12 sectors. Tap any stock to see its chart, company profile, and buy/sell buttons. The scrolling bar at top shows sector performance.",
  },
  {
    title: "Market News & Alerts",
    content:
      "Real news from Black publications and AI-generated events move stock prices. When an event fires, a Market Alert slides in and reads the headline aloud.",
  },
  {
    title: "Trading",
    content:
      "Tap any stock, then hit BUY or SELL. Enter a dollar amount — you'll see a preview before confirming. There's a 25% position limit to teach diversification.",
  },
  {
    title: "Knowledge Vault",
    content:
      "23 investing concepts unlock through your actions — not lectures. Diversify your portfolio? You unlock 'Diversification.' Sell at a loss? You unlock 'Profit and Loss.'",
  },
  {
    title: "AI Coach & Professor",
    content:
      "Claude AI grades your portfolio and recommends tickers. Ask Professor BLK any investing question — it uses your actual holdings to teach concepts.",
  },
  {
    title: "You're Ready!",
    content:
      "Browse the market, pick a stock, and make your first trade. Events fire every few minutes. Watch for Market Alerts. Good luck!",
  },
];

export function Walkthrough() {
  const [step, setStep] = useState(-1); // -1 = not showing

  useEffect(() => {
    const completed = localStorage.getItem(WALKTHROUGH_KEY);
    if (!completed) {
      const timer = setTimeout(() => setStep(0), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (step < 0) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem(WALKTHROUGH_KEY, "true");
      setStep(-1);
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(WALKTHROUGH_KEY, "true");
    setStep(-1);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={handleSkip} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md border-2 border-white bg-[#1a1a1a] p-6"
        style={{ boxShadow: "6px 6px 0px 0px #7F77DD" }}
      >
        {/* Step counter */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-[#7F77DD] uppercase tracking-widest">
            Step {step + 1} of {STEPS.length}
          </span>
          <button
            onClick={handleSkip}
            className="font-mono text-xs text-white/40 hover:text-white transition-colors"
          >
            Skip Tour
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 mb-5">
          <div
            className="h-1 bg-[#7F77DD] transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Title */}
        <h2 className="font-mono font-bold text-white text-lg mb-3">
          {current.title}
        </h2>

        {/* Content */}
        <p className="font-mono text-white/80 text-sm leading-relaxed mb-6">
          {current.content}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="font-mono text-sm text-white/60 hover:text-white transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            className="font-mono text-sm font-bold px-6 py-2 border-2 border-white bg-[#7F77DD] text-white hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
            style={{ boxShadow: "3px 3px 0px 0px #ffffff" }}
          >
            {isLast ? "Start Trading" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function resetWalkthrough() {
  localStorage.removeItem(WALKTHROUGH_KEY);
}
