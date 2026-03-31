"use client";

import { useState } from "react";
import type { ConceptTier } from "@/lib/constants/concepts";

type ShareState = "idle" | "copied" | "shared";

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

function buildShareUrl(conceptId: string): string {
  return `https://blkexchange.com/share/concept/${conceptId}`;
}

function buildShareText(
  conceptId: string,
  conceptName: string,
  portfolioValueAtUnlock: number,
  definition: string
): string {
  const oneLiner = definition.split(".")[0].trim() + ".";
  const portfolioFormatted = formatCents(portfolioValueAtUnlock);
  const shareUrl = buildShareUrl(conceptId);
  return `I just learned about ${conceptName} on BLK Exchange! My portfolio was at ${portfolioFormatted} when I unlocked it. ${oneLiner}\n\n${shareUrl} #BLKExchange #FinancialLiteracy`;
}

export function ConceptCard({
  conceptId,
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
  const [shareState, setShareState] = useState<ShareState>("idle");
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

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const shareText = buildShareText(conceptId, conceptName, portfolioValueAtUnlock, definition);

    let didAct = false;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: shareText });
        setShareState("shared");
        didAct = true;
      } catch {
        // User cancelled — do nothing
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setShareState("copied");
      didAct = true;
    }

    if (didAct) {
      setTimeout(() => setShareState("idle"), 2000);
    }
  }

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

          {/* Share buttons */}
          <div className="flex gap-2">
            <button
              className="flex-1 border-2 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-all"
              style={{
                borderColor: shareState !== "idle" ? "#FDE047" : "#ffffff30",
                color: shareState !== "idle" ? "#0e0e0e" : "#ffffff80",
                backgroundColor: shareState !== "idle" ? "#FDE047" : "transparent",
                boxShadow: shareState !== "idle" ? "3px 3px 0px 0px #000000" : "none",
              }}
              onClick={handleShare}
            >
              {shareState === "copied"
                ? "Copied!"
                : shareState === "shared"
                ? "Shared!"
                : "Share Knowledge"}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                buildShareText(conceptId, conceptName, portfolioValueAtUnlock, definition)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 py-2 px-4 font-mono text-xs font-bold uppercase tracking-widest transition-all"
              style={{
                borderColor: "#ffffff30",
                color: "#ffffff80",
                backgroundColor: "transparent",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Post to X
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
