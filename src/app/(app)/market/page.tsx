"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { TickerTable } from "@/components/market/ticker-table";
import { NewsFeed } from "@/components/market/news-feed";
import { SupportButton } from "@/components/support-button";
import { SectorPerformance } from "@/components/market/sector-performance";

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function MarketPage() {
  const blkIndex = useQuery(api.market.getBLKIndex);

  const isPositive =
    blkIndex !== undefined && blkIndex.dailyChangePercent >= 0;
  const changeColor = isPositive ? "#22c55e" : "#ef4444";
  const changePrefix = isPositive ? "+" : "";

  return (
    <div className="min-h-screen bg-[#0e0e0e] p-4 lg:p-6">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <h1 className="font-mono font-bold text-2xl text-white tracking-widest uppercase">
            BLK EXCHANGE
          </h1>
          <SupportButton />
        </div>
        {blkIndex !== undefined ? (
          <div className="mt-1 flex items-center gap-3 font-mono text-sm">
            <span className="text-white/50">BLK INDEX</span>
            <span className="text-white font-bold">
              {formatCents(blkIndex.priceInCents)}
            </span>
            <span style={{ color: changeColor }}>
              {changePrefix}
              {blkIndex.dailyChangePercent.toFixed(2)}%
            </span>
          </div>
        ) : (
          <div className="mt-1 font-mono text-sm text-white/30">
            Loading index...
          </div>
        )}
      </div>

      {/* Two-column layout on desktop, single column on mobile */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ticker table — 65% on desktop */}
        <div className="w-full lg:w-[65%]">
          <TickerTable />
        </div>

        {/* Right column — 35% on desktop */}
        <div className="w-full lg:w-[35%] space-y-6">
          <SectorPerformance />
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}
