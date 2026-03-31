"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const ETF_NAMES: Record<string, string> = {
  XLF: "Financials",
  XLC: "Comm. Services",
  XLY: "Consumer Disc.",
  XLP: "Consumer Staples",
  XLRE: "Real Estate",
};

export function SectorPerformance() {
  const simSectors = useQuery(api.sectorData.getSimSectorPerformance);
  const realSectors = useQuery(api.sectorData.getRealSectorData);

  if (simSectors === undefined) {
    return (
      <div
        className="border-2 border-white bg-[#1a1a1a] p-4"
        style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
      >
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
          Sector Performance
        </h2>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Build real ETF lookup
  const realEtfMap = new Map<string, { changePercent: number; price: number }>();
  if (realSectors) {
    for (const etf of realSectors) {
      realEtfMap.set(etf.symbol, {
        changePercent: etf.changePercent,
        price: etf.price,
      });
    }
  }

  const maxAbsChange = Math.max(
    ...simSectors.map((s) => Math.abs(s.changePercent)),
    1
  );

  return (
    <div
      className="border-2 border-white bg-[#1a1a1a] p-4"
      style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/50 mb-4 border-b border-white/10 pb-2">
        Sector Performance
      </h2>

      <div className="space-y-1.5">
        {simSectors.map((sector) => {
          const isPositive = sector.changePercent >= 0;
          const barColor = isPositive ? "#22c55e" : "#ef4444";
          const barWidth = Math.min(
            Math.abs(sector.changePercent) / maxAbsChange * 100,
            100
          );
          const realEtf = sector.realEtf ? realEtfMap.get(sector.realEtf) : null;

          return (
            <div key={sector.id}>
              {/* Sector bar */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-white/60 w-24 flex-shrink-0 truncate">
                  {sector.name}
                </span>

                {/* Bar container */}
                <div className="flex-1 h-5 relative bg-white/5">
                  {/* Center line */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-white/20"
                    style={{ left: "50%" }}
                  />
                  {/* Bar */}
                  <div
                    className="absolute top-0 bottom-0 transition-all duration-700"
                    style={{
                      backgroundColor: barColor,
                      width: `${barWidth / 2}%`,
                      ...(isPositive
                        ? { left: "50%" }
                        : { right: "50%" }),
                    }}
                  />
                </div>

                <span
                  className="font-mono text-[11px] font-bold w-14 text-right flex-shrink-0"
                  style={{ color: barColor }}
                >
                  {isPositive ? "+" : ""}{sector.changePercent.toFixed(1)}%
                </span>
              </div>

              {/* Real ETF comparison (if available) */}
              {realEtf && (
                <div className="flex items-center gap-2 ml-[104px]">
                  <span className="font-mono text-[9px] text-white/25 uppercase tracking-wider">
                    Real {ETF_NAMES[sector.realEtf!] ?? sector.realEtf}:
                  </span>
                  <span
                    className="font-mono text-[9px] font-bold"
                    style={{
                      color: realEtf.changePercent >= 0 ? "#22c55e80" : "#ef444480",
                    }}
                  >
                    {realEtf.changePercent >= 0 ? "+" : ""}{realEtf.changePercent.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {realEtfMap.size > 0 && (
        <div className="mt-3 pt-2 border-t border-white/10">
          <p className="font-mono text-[9px] text-white/20 leading-relaxed">
            Real market data from S&P 500 sector ETFs via Finnhub. Compare how your sim sectors move relative to real markets.
          </p>
        </div>
      )}
    </div>
  );
}
