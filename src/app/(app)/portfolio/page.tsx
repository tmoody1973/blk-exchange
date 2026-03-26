"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { AllocationChart } from "@/components/portfolio/allocation-chart";
import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { DiversificationScore } from "@/components/portfolio/diversification-score";

export default function PortfolioPage() {
  const { user, isLoaded } = useUser();

  const player = useQuery(
    api.players.getPlayer,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );

  const holdings = useQuery(
    api.holdings.getHoldings,
    player ? { playerId: player._id } : "skip"
  );

  // Loading state
  if (!isLoaded || player === undefined || holdings === undefined) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="font-mono text-white/50 text-sm">Loading portfolio...</p>
      </div>
    );
  }

  // No player record yet
  if (player === null) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="font-mono text-white/30 text-sm">Player not found.</p>
      </div>
    );
  }

  const holdingsValueInCents = holdings.reduce(
    (sum, h) => sum + h.currentValueInCents,
    0
  );
  const totalValueInCents = player.cashInCents + holdingsValueInCents;

  // Day P&L: sum of pnl across all holdings (unrealized)
  const dayPnlInCents = holdings.reduce((sum, h) => sum + h.pnlInCents, 0);
  const dayPnlPercent =
    holdingsValueInCents > 0
      ? (dayPnlInCents / (holdingsValueInCents - dayPnlInCents)) * 100
      : 0;

  const isEmpty = holdings.length === 0;

  return (
    <div className="min-h-screen bg-[#0e0e0e] p-4 lg:p-6 pb-24 lg:pb-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-mono font-bold text-2xl text-white tracking-widest uppercase">
          Portfolio
        </h1>
        <p className="font-mono text-white/40 text-sm mt-1">
          {player.name}
        </p>
      </div>

      {/* Layout: single column on mobile, two columns on desktop */}
      <div className="flex flex-col gap-6">
        {/* Summary card — full width */}
        <PortfolioSummary
          totalValueInCents={totalValueInCents}
          dayPnlInCents={dayPnlInCents}
          dayPnlPercent={dayPnlPercent}
          cashInCents={player.cashInCents}
        />

        {/* Middle row: allocation chart + diversification score side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[60%]">
            {isEmpty ? (
              <div
                className="border-2 border-[#ffffff] bg-[#1a1a1a] p-6 text-center"
                style={{ boxShadow: "4px 4px 0px 0px #ffffff", minHeight: 220 }}
              >
                <p className="font-mono text-white/30 text-sm">
                  No holdings yet. Buy stocks on the market to see your allocation.
                </p>
              </div>
            ) : (
              <AllocationChart
                holdings={holdings}
                totalValueInCents={holdingsValueInCents}
              />
            )}
          </div>

          <div className="w-full lg:w-[40%]">
            <DiversificationScore holdings={holdings} />
          </div>
        </div>

        {/* Holdings table — full width */}
        <HoldingsTable
          holdings={holdings}
          totalHoldingsValueInCents={holdingsValueInCents}
        />
      </div>
    </div>
  );
}
