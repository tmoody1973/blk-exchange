"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatChange, formatPercent } from "@/lib/utils/format";

type PortfolioSummaryProps = {
  totalValueInCents: number;
  dayPnlInCents: number;
  dayPnlPercent: number;
  cashInCents: number;
};

export function PortfolioSummary({
  totalValueInCents,
  dayPnlInCents,
  dayPnlPercent,
  cashInCents,
}: PortfolioSummaryProps) {
  const isPnlPositive = dayPnlInCents >= 0;
  const pnlColor = isPnlPositive ? "#22c55e" : "#ef4444";

  return (
    <Card
      className="border-2 border-[#ffffff] bg-[#1a1a1a] rounded-none"
      style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Total portfolio value */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-white/40 uppercase tracking-wider">
              Portfolio Value
            </span>
            <span className="font-mono font-bold text-4xl text-white tracking-tight">
              {formatPrice(totalValueInCents)}
            </span>
          </div>

          {/* Day P&L */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-white/40 uppercase tracking-wider">
              Day P&amp;L
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className="font-mono font-bold text-2xl"
                style={{ color: pnlColor }}
              >
                {formatChange(dayPnlInCents)}
              </span>
              <span
                className="font-mono font-bold text-base"
                style={{ color: pnlColor }}
              >
                ({formatPercent(dayPnlPercent)})
              </span>
            </div>
          </div>

          {/* Cash remaining */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-white/40 uppercase tracking-wider">
              Cash Available
            </span>
            <span className="font-mono font-bold text-2xl text-white">
              {formatPrice(cashInCents)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
