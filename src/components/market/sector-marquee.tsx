"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SECTORS } from "@/lib/constants/sectors";

type SectorAverage = {
  id: string;
  name: string;
  avgChangePercent: number;
};

function computeSectorAverages(
  stocks: Array<{ sector: string; dailyChangePercent: number }>
): SectorAverage[] {
  const sectorMap = new Map<string, { total: number; count: number }>();

  for (const stock of stocks) {
    const existing = sectorMap.get(stock.sector);
    if (existing) {
      sectorMap.set(stock.sector, {
        total: existing.total + stock.dailyChangePercent,
        count: existing.count + 1,
      });
    } else {
      sectorMap.set(stock.sector, {
        total: stock.dailyChangePercent,
        count: 1,
      });
    }
  }

  return SECTORS.map((sector) => {
    const data = sectorMap.get(sector.id);
    const avgChangePercent = data ? data.total / data.count : 0;
    return {
      id: sector.id,
      name: sector.name,
      avgChangePercent: Math.round(avgChangePercent * 100) / 100,
    };
  });
}

function SectorTickerItem({ sector }: { sector: SectorAverage }) {
  const isPositive = sector.avgChangePercent >= 0;
  const color = isPositive ? "#4ade80" : "#ef4444";
  const arrow = isPositive ? "▲" : "▼";
  const prefix = isPositive ? "+" : "";

  return (
    <span className="mx-6 inline-flex items-center gap-1 text-sm font-mono">
      <span style={{ color }}>{arrow}</span>
      <span className="text-white">{sector.name}</span>
      <span style={{ color }}>
        {prefix}
        {sector.avgChangePercent.toFixed(1)}%
      </span>
    </span>
  );
}

export function SectorMarquee() {
  const stocks = useQuery(api.market.getAllStocks);
  const sectorAverages = computeSectorAverages(stocks ?? []);

  return (
    <div className="relative flex w-full overflow-x-hidden border-b-2 border-border bg-[#1a1a1a]">
      <div className="animate-marquee whitespace-nowrap py-2">
        {sectorAverages.map((sector) => (
          <SectorTickerItem key={sector.id} sector={sector} />
        ))}
        <span className="mx-6 text-[#FDE047] font-mono text-sm">•</span>
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-2">
        {sectorAverages.map((sector) => (
          <SectorTickerItem key={`dup-${sector.id}`} sector={sector} />
        ))}
        <span className="mx-6 text-[#FDE047] font-mono text-sm">•</span>
      </div>
    </div>
  );
}
