"use client";

import type { ConceptTier } from "@/lib/constants/concepts";

interface LockedCardProps {
  tier: ConceptTier;
}

const TIER_COLORS: Record<ConceptTier, string> = {
  foundation: "#22c55e",
  intermediate: "#7F77DD",
  advanced: "#FDE047",
  economics: "#ef4444",
};

export function LockedCard({ tier }: LockedCardProps) {
  const accentColor = TIER_COLORS[tier];

  return (
    <div
      className="border-2 p-4 flex items-center gap-3"
      style={{
        borderColor: "#333",
        backgroundColor: "#111",
        borderLeft: `4px solid ${accentColor}30`,
      }}
    >
      <div
        className="flex h-8 w-8 items-center justify-center border-2 text-sm font-mono font-bold flex-shrink-0"
        style={{ borderColor: "#333", color: "#333" }}
      >
        ?
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-xs font-bold" style={{ color: "#444" }}>
          ???
        </span>
        <span className="font-mono text-xs" style={{ color: "#333" }}>
          Keep trading to unlock
        </span>
      </div>
    </div>
  );
}
