"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { SECTORS } from "@/lib/constants/sectors";
import { formatPrice } from "@/lib/utils/format";

type EnrichedHolding = {
  symbol: string;
  sector: string;
  currentValueInCents: number;
};

type AllocationChartProps = {
  holdings: EnrichedHolding[];
  totalValueInCents: number;
};

function getSectorColor(sectorId: string): string {
  const sector = SECTORS.find((s) => s.id === sectorId);
  return sector?.color ?? "#7F77DD";
}

function getSectorName(sectorId: string): string {
  const sector = SECTORS.find((s) => s.id === sectorId);
  return sector?.name ?? sectorId;
}

type SectorAllocation = {
  sectorId: string;
  sectorName: string;
  valueInCents: number;
  color: string;
};

function buildSectorAllocations(holdings: EnrichedHolding[]): SectorAllocation[] {
  const map = new Map<string, number>();
  for (const h of holdings) {
    const existing = map.get(h.sector) ?? 0;
    map.set(h.sector, existing + h.currentValueInCents);
  }
  return Array.from(map.entries()).map(([sectorId, valueInCents]) => ({
    sectorId,
    sectorName: getSectorName(sectorId),
    valueInCents,
    color: getSectorColor(sectorId),
  }));
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: SectorAllocation }>;
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div
      className="border-2 border-[#ffffff] bg-[#1a1a1a] px-3 py-2"
      style={{ boxShadow: "2px 2px 0px 0px #ffffff" }}
    >
      <p
        className="font-mono font-bold text-sm"
        style={{ color: item.color }}
      >
        {item.sectorName}
      </p>
      <p className="font-mono text-white text-xs">
        {formatPrice(item.valueInCents)}
      </p>
    </div>
  );
}

export function AllocationChart({ holdings, totalValueInCents }: AllocationChartProps) {
  const data = buildSectorAllocations(holdings);

  if (data.length === 0) {
    return (
      <div
        className="border-2 border-[#ffffff] bg-[#1a1a1a] p-6 flex items-center justify-center"
        style={{ boxShadow: "4px 4px 0px 0px #ffffff", minHeight: 220 }}
      >
        <p className="font-mono text-white/30 text-sm">No holdings to chart</p>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-[#ffffff] bg-[#1a1a1a] p-4"
      style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider mb-4 border-b-2 border-[#ffffff] pb-2">
        Sector Allocation
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-[200px] h-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="valueInCents"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.sectorId} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-mono text-xs text-white/40 uppercase tracking-wider">
              Total
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {formatPrice(totalValueInCents)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {data.map((entry) => {
            const pct =
              totalValueInCents > 0
                ? ((entry.valueInCents / totalValueInCents) * 100).toFixed(1)
                : "0.0";
            return (
              <div key={entry.sectorId} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 shrink-0 border-2 border-[#ffffff]"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-mono text-white/70 text-xs truncate flex-1">
                  {entry.sectorName}
                </span>
                <span className="font-mono text-white text-xs font-bold shrink-0">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
