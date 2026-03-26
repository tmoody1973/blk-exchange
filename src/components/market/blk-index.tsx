"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function BLKIndex() {
  const data = useQuery(api.market.getBLKIndex);

  if (data === undefined) {
    return (
      <div className="flex items-center gap-3 font-mono text-sm text-white/60">
        <span className="font-bold tracking-wide">BLK INDEX</span>
        <span>Loading...</span>
      </div>
    );
  }

  const isPositive = data.dailyChangePercent >= 0;
  const changeColor = isPositive ? "#4ade80" : "#ef4444";
  const changePrefix = isPositive ? "+" : "";

  return (
    <div className="flex items-center gap-3 font-mono text-sm">
      <span className="font-bold tracking-wide text-[#FDE047]">BLK INDEX</span>
      <span className="text-white">{formatCents(data.priceInCents)}</span>
      <span style={{ color: changeColor }}>
        {changePrefix}
        {data.dailyChangePercent.toFixed(2)}%
      </span>
    </div>
  );
}
