"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { TickerTable } from "@/components/market/ticker-table";

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
        <h1 className="font-mono font-bold text-2xl text-white tracking-widest uppercase">
          BLK EXCHANGE
        </h1>
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

        {/* News feed — 35% on desktop, below table on mobile */}
        <div className="w-full lg:w-[35%]">
          <div
            className="border-2 border-[#ffffff] bg-[#1a1a1a] p-4"
            style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
          >
            <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider mb-4 border-b-2 border-[#ffffff] pb-2">
              Market News
            </h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b border-white/10 pb-3 last:border-0">
                  <div className="h-3 bg-white/10 rounded-none mb-2 w-full" />
                  <div className="h-3 bg-white/10 rounded-none mb-2 w-4/5" />
                  <div className="h-2 bg-white/5 rounded-none w-1/3" />
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs text-white/30 text-center">
              News feed coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
