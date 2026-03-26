"use client";

import { useState } from "react";
import type { ConceptTier } from "@/lib/constants/concepts";

interface ConceptCardProps {
  conceptId: string;
  conceptName: string;
  tier: ConceptTier;
  definition: string;
  realWorldExample: string;
  triggerType: "behavior" | "event";
  triggerEventHeadline?: string;
  portfolioValueAtUnlock: number;
  unlockedAt: number;
}

const TIER_COLORS: Record<ConceptTier, string> = {
  foundation: "#22c55e",
  intermediate: "#7F77DD",
  advanced: "#FDE047",
  economics: "#ef4444",
};

const TIER_LABELS: Record<ConceptTier, string> = {
  foundation: "Foundation",
  intermediate: "Intermediate",
  advanced: "Advanced",
  economics: "Economics",
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ConceptCard({
  conceptName,
  tier,
  definition,
  realWorldExample,
  triggerType,
  triggerEventHeadline,
  portfolioValueAtUnlock,
  unlockedAt,
}: ConceptCardProps) {
  const [expanded, setExpanded] = useState(false);
  const accentColor = TIER_COLORS[tier];
  const tierLabel = TIER_LABELS[tier];

  const portfolioAtUnlock = formatCents(portfolioValueAtUnlock);
  const unlockedDate = formatDate(unlockedAt);
  const triggerLabel =
    triggerType === "event" && triggerEventHeadline
      ? triggerEventHeadline
      : triggerType === "behavior"
      ? "Your trading behavior"
      : "A market event";

  return (
    <div
      className="border-2 border-[#ffffff] transition-all"
      style={{
        backgroundColor: "#1a1a1a",
        borderLeft: `4px solid ${accentColor}`,
        boxShadow: expanded ? `4px 4px 0px 0px ${accentColor}` : "none",
      }}
    >
      {/* Header — always visible, click to expand */}
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-1">
          <span
            className="font-mono text-xs font-bold uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            {tierLabel}
          </span>
          <span className="font-mono text-sm font-bold text-white">
            {conceptName}
          </span>
        </div>

        <span
          className="font-mono text-lg font-bold ml-2 flex-shrink-0"
          style={{ color: accentColor }}
        >
          {expanded ? "−" : "+"}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t-2 border-[#ffffff30] px-4 pb-4 pt-3 space-y-4">
          {/* Definition */}
          <div className="space-y-1">
            <span
              className="font-mono text-xs font-bold uppercase tracking-widest"
              style={{ color: "#ffffff60" }}
            >
              Definition
            </span>
            <p className="font-mono text-xs leading-relaxed text-white/80">
              {definition}
            </p>
          </div>

          {/* Real world */}
          <div className="space-y-1">
            <span
              className="font-mono text-xs font-bold uppercase tracking-widest"
              style={{ color: "#FDE047" }}
            >
              Real world:
            </span>
            <p className="font-mono text-xs leading-relaxed text-white/70">
              {realWorldExample}
            </p>
          </div>

          {/* Unlock context */}
          <div
            className="border-2 p-3 space-y-2"
            style={{ borderColor: "#ffffff20", backgroundColor: "#0e0e0e" }}
          >
            <div className="space-y-0.5">
              <span
                className="font-mono text-xs font-bold uppercase tracking-widest"
                style={{ color: "#ffffff40" }}
              >
                You learned this when:
              </span>
              <p className="font-mono text-xs text-white/60">{triggerLabel}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span
                  className="font-mono text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#ffffff40" }}
                >
                  Portfolio at unlock
                </span>
                <p className="font-mono text-xs font-bold text-white">
                  {portfolioAtUnlock}
                </p>
              </div>
              <p
                className="font-mono text-xs"
                style={{ color: "#ffffff40" }}
              >
                {unlockedDate}
              </p>
            </div>
          </div>

          {/* Share button — placeholder */}
          <button
            className="w-full border-2 border-[#ffffff30] py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:border-[#FDE047] hover:text-[#FDE047]"
            style={{ color: "#ffffff40", backgroundColor: "transparent" }}
            onClick={(e) => {
              e.stopPropagation();
              // Placeholder — share functionality TBD
            }}
          >
            Share Knowledge
          </button>
        </div>
      )}
    </div>
  );
}
