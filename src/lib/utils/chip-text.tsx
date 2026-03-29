"use client";

import React from "react";
import { GlossaryChip } from "@/components/glossary/glossary-chip";
import { Id } from "../../../convex/_generated/dataModel";

// Map of trigger phrases to term IDs.
// Longer phrases appear first after sorting, enabling greedy matching.
const CHIP_TRIGGERS: Record<string, string> = {
  "share price": "share-price",
  "share prices": "share-price",
  "market order": "market-order",
  "market orders": "market-order",
  "bull market": "bull-market",
  "bear market": "bear-market",
  "return on investment": "roi",
  "market cap": "market-cap",
  "cost basis": "cost-basis",
  "position cap": "position-cap",
  "unrealized gains": "unrealized-gains",
  "unrealized gain": "unrealized-gains",
  "realized gains": "realized-gains",
  "realized gain": "realized-gains",
  "fractional shares": "fractional-shares",
  "fractional share": "fractional-shares",
  "diversification": "diversification",
  "diversify": "diversification",
  "diversified": "diversification",
  "correlation": "correlation",
  "benchmark": "benchmark",
  "sentiment": "sentiment",
  "volatility": "volatility",
  "portfolio": "portfolio",
  "portfolios": "portfolio",
  "catalyst": "catalyst",
  "position": "position",
  "volume": "volume",
  "sector": "sector",
  "sectors": "sector",
  "stocks": "stock",
  "stock": "stock",
  "ROI": "roi",
};

// Sorted triggers: longest first for greedy matching
const SORTED_TRIGGERS = Object.entries(CHIP_TRIGGERS).sort(
  ([a], [b]) => b.length - a.length
);

/**
 * Scans text for trigger phrases and wraps first occurrences (up to maxChips)
 * in GlossaryChip components. Returns an array of React nodes.
 */
export function chipEventText(
  text: string,
  playerId: Id<"players">,
  maxChips: number = 3,
  eventId?: string
): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let remaining = text;
  let chipCount = 0;
  const usedTermIds = new Set<string>();

  while (remaining.length > 0 && chipCount < maxChips) {
    let earliestMatch: {
      index: number;
      trigger: string;
      termId: string;
      matchedText: string;
    } | null = null;

    for (const [trigger, termId] of SORTED_TRIGGERS) {
      if (usedTermIds.has(termId)) continue;
      const idx = remaining.toLowerCase().indexOf(trigger.toLowerCase());
      if (idx !== -1 && (!earliestMatch || idx < earliestMatch.index)) {
        // Capture actual casing from the original text
        const matchedText = remaining.slice(idx, idx + trigger.length);
        earliestMatch = { index: idx, trigger, termId, matchedText };
      }
    }

    if (!earliestMatch) {
      result.push(remaining);
      break;
    }

    // Text before the match
    if (earliestMatch.index > 0) {
      result.push(remaining.slice(0, earliestMatch.index));
    }

    // Chipped term
    result.push(
      <GlossaryChip
        key={`${earliestMatch.termId}-${chipCount}`}
        termId={earliestMatch.termId}
        playerId={playerId}
        eventId={eventId}
      >
        {earliestMatch.matchedText}
      </GlossaryChip>
    );

    usedTermIds.add(earliestMatch.termId);
    chipCount++;
    remaining = remaining.slice(
      earliestMatch.index + earliestMatch.trigger.length
    );
  }

  // Append any remaining text
  if (remaining.length > 0) {
    result.push(remaining);
  }

  return result;
}
