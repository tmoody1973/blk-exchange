"use client";

import type { ConceptTier } from "@/lib/constants/concepts";

interface TierProgressProps {
  tier: ConceptTier;
  unlocked: number;
  total: number;
}

const TIER_LABELS: Record<ConceptTier, string> = {
  foundation: "Foundation",
  intermediate: "Intermediate",
  advanced: "Advanced",
  economics: "Economics",
};

const TIER_COLORS: Record<ConceptTier, string> = {
  foundation: "#22c55e",
  intermediate: "#7F77DD",
  advanced: "#FDE047",
  economics: "#ef4444",
};

export function TierProgress({ tier, unlocked, total }: TierProgressProps) {
  const color = TIER_COLORS[tier];
  const label = TIER_LABELS[tier];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
        <span className="font-mono text-xs" style={{ color: "#ffffff60" }}>
          {unlocked}/{total}
        </span>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-none border"
            style={{
              backgroundColor: i < unlocked ? color : "transparent",
              borderColor: i < unlocked ? color : "#ffffff30",
            }}
          />
        ))}
      </div>
    </div>
  );
}
