"use client";

import { useState, useCallback } from "react";
import { ShareCardRenderer } from "@/components/share-card-renderer";

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

  // Build share URL that serves the dynamic OG card
  const shareParams = new URLSearchParams({
    value: portfolioValue,
    change: changeStr,
    holdings: String(holdingsCount),
    sectors: String(sectorCount),
  });
  const shareUrl = `https://blkexchange.com/share/portfolio?${shareParams.toString()}`;

  const shareText = `My BLK Exchange portfolio: ${portfolioValue} (${changeStr}). ${holdingsCount} holdings across ${sectorCount} sectors.\n\n${shareUrl} #BLKExchange #FinancialLiteracy`;

  // twitterUrl removed — sharing now handled by ShareCardRenderer

  const handleCopy = useCallback(async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  return (
    <div className="flex gap-2">
      <ShareCardRenderer
        type="portfolio"
        data={{
          value: portfolioValue,
          change: changeStr,
          holdings: String(holdingsCount),
          sectors: String(sectorCount),
          concepts: "0",
          shareText,
        }}
      >
        <button
          className="flex-1 border-2 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-all w-full"
          style={{
            borderColor: "#7F77DD",
            color: "#7F77DD",
            backgroundColor: "transparent",
          }}
        >
          Share Card
        </button>
      </ShareCardRenderer>
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
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
