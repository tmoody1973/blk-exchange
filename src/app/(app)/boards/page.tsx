"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { getSeasonInfo, getMsUntilNextMonday, formatCountdown } from "@/lib/constants/season";

export default function BoardsPage() {
  const { user, isLoaded } = useUser();
  const player = useQuery(
    api.players.getPlayer,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );

  const season = getSeasonInfo();
  const resetIn = formatCountdown(getMsUntilNextMonday());

  if (!isLoaded) {
    return (
      <div className="p-6">
        <div className="h-8 bg-white/10 w-1/3 mb-4" />
        <div className="h-64 bg-white/5" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-mono font-bold text-white text-2xl mb-2">
          Leaderboards
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-mono text-xs text-[#7F77DD] uppercase tracking-widest">
            {season.label}
          </span>
          <span className="font-mono text-xs text-white/40">
            Weekly boards reset in {resetIn}
          </span>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <InfoCard
          title="Weekly Boards"
          description="Portfolio Value, Diversification, Biggest Mover — reset every Monday"
          color="#7F77DD"
        />
        <InfoCard
          title="Season Boards"
          description="Knowledge Vault, Blueprint Award — cumulative across the full season"
          color="#FDE047"
        />
        <InfoCard
          title="How Scoring Works"
          description="Trade to update your scores. Every buy/sell recalculates your rank."
          color="#22c55e"
        />
      </div>

      {/* Leaderboard tabs */}
      {player ? (
        <LeaderboardTabs currentPlayerId={player._id} />
      ) : (
        <div
          className="border-2 border-white bg-[#1a1a1a] p-8 text-center"
          style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
        >
          <p className="font-mono text-white/50 text-sm">
            Sign in and make a trade to appear on the leaderboards.
          </p>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className="border-2 border-white/20 bg-[#1a1a1a] p-4"
    >
      <h3
        className="font-mono text-xs font-bold uppercase tracking-widest mb-1"
        style={{ color }}
      >
        {title}
      </h3>
      <p className="font-mono text-xs text-white/50 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
