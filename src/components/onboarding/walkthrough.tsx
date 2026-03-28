"use client";

import { useState, useEffect } from "react";
import type { CallBackProps, Step } from "react-joyride";

const WALKTHROUGH_KEY = "blk-exchange-walkthrough-completed";

const STEPS: Step[] = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    title: "Welcome to BLK Exchange",
    content:
      "You just got $10,000 in virtual capital. Trade 36 Black-economy companies, learn 23 investing concepts, and compete on the leaderboard. Let's show you around.",
  },
  {
    target: '[data-tour="marquee"]',
    title: "Sector Ticker Tape",
    content:
      "This scrolling bar shows how each sector is performing. Green means up, red means down. Watch it to spot trends.",
  },
  {
    target: '[data-tour="blk-index"]',
    title: "BLK Index",
    content:
      "This is the overall market index — the average of all 36 stocks. Think of it like the S&P 500 for the Black economy.",
  },
  {
    target: '[data-tour="ticker-table"]',
    title: "The Market",
    content:
      "All 36 companies across 12 sectors. Tap any stock to see its detail page, chart, and buy/sell buttons. Sort by clicking column headers.",
  },
  {
    target: '[data-tour="news-feed"]',
    title: "Market News",
    content:
      "Real news from Black publications and AI-generated market events appear here. Each event moves stock prices and teaches an investing concept.",
  },
  {
    target: '[data-tour="nav-portfolio"]',
    title: "Your Portfolio",
    content:
      "Track your holdings, P&L, and diversification score. Claude AI coaches you on your portfolio after every 3 events.",
  },
  {
    target: '[data-tour="nav-vault"]',
    title: "Knowledge Vault",
    content:
      "23 investing concepts to unlock — not by reading, but by demonstrating them through your trades. Diversify your portfolio? You unlock 'Diversification.'",
  },
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    title: "You're Ready to Trade",
    content:
      "Start by browsing the market, pick a stock, and make your first trade. Events fire every few minutes — watch for Market Alerts. Good luck!",
  },
];

const joyrideStyles = {
  options: {
    arrowColor: "#1a1a1a",
    backgroundColor: "#1a1a1a",
    overlayColor: "rgba(0, 0, 0, 0.75)",
    primaryColor: "#7F77DD",
    textColor: "#ffffff",
    zIndex: 10000,
  },
  tooltip: {
    borderRadius: 0,
    border: "2px solid #ffffff",
    boxShadow: "4px 4px 0px 0px #ffffff",
    fontFamily: "'Courier New', monospace",
  },
  tooltipTitle: {
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    fontSize: "16px",
  },
  tooltipContent: {
    fontFamily: "'Courier New', monospace",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  buttonNext: {
    borderRadius: 0,
    backgroundColor: "#7F77DD",
    border: "2px solid #ffffff",
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
  },
  buttonBack: {
    borderRadius: 0,
    color: "#ffffff",
    fontFamily: "'Courier New', monospace",
  },
  buttonSkip: {
    borderRadius: 0,
    color: "#ffffff80",
    fontFamily: "'Courier New', monospace",
  },
};

export function Walkthrough() {
  const [run, setRun] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [JoyrideComponent, setJoyrideComponent] = useState<any>(null);

  useEffect(() => {
    // Check if walkthrough already completed
    const completed = localStorage.getItem(WALKTHROUGH_KEY);
    if (completed) return;

    // Dynamically import react-joyride on client only
    import("react-joyride").then((mod) => {
      setJoyrideComponent(() => mod.default);
      // Delay to let the page render first
      setTimeout(() => setRun(true), 1500);
    });
  }, []);

  if (!JoyrideComponent) return null;

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      localStorage.setItem(WALKTHROUGH_KEY, "true");
      setRun(false);
    }
  };

  return (
    <JoyrideComponent
      steps={STEPS}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      callback={handleCallback}
      styles={joyrideStyles}
      locale={{
        back: "Back",
        close: "Close",
        last: "Start Trading",
        next: "Next",
        skip: "Skip Tour",
      }}
    />
  );
}
