"use client";

import { useState, useCallback } from "react";

interface SharePortfolioButtonProps {
  totalValueInCents: number;
  dayPnlPercent: number;
  holdingsCount: number;
  sectorCount: number;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function SharePortfolioButton({
  totalValueInCents,
  dayPnlPercent,
  holdingsCount,
  sectorCount,
}: SharePortfolioButtonProps) {
  const [copied, setCopied] = useState(false);

  const portfolioValue = formatCents(totalValueInCents);
  const changePrefix = dayPnlPercent >= 0 ? "+" : "";
  const changeStr = `${changePrefix}${dayPnlPercent.toFixed(2)}%`;

  const shareText = `My BLK Exchange portfolio: ${portfolioValue} (${changeStr}). ${holdingsCount} holdings across ${sectorCount} sectors.\n\nhttps://blkexchange.com #BLKExchange #FinancialLiteracy`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  const handleCopy = useCallback(async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        className="flex-1 border-2 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-all"
        style={{
          borderColor: copied ? "#FDE047" : "#ffffff30",
          color: copied ? "#0e0e0e" : "#ffffff80",
          backgroundColor: copied ? "#FDE047" : "transparent",
          boxShadow: copied ? "3px 3px 0px 0px #000000" : "none",
        }}
      >
        {copied ? "Copied!" : "Share Portfolio"}
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border-2 py-2 px-4 font-mono text-xs font-bold uppercase tracking-widest transition-all"
        style={{
          borderColor: "#ffffff30",
          color: "#ffffff80",
          backgroundColor: "transparent",
        }}
      >
        Post to X
      </a>
    </div>
  );
}
