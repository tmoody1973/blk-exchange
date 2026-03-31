"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const ETF_NAMES: Record<string, string> = {
  XLF: "Financials (XLF)",
  XLC: "Comm. Services (XLC)",
  XLY: "Consumer Disc. (XLY)",
  XLP: "Consumer Staples (XLP)",
  VNQ: "Real Estate (VNQ)",
  HERO: "Gaming & Esports (HERO)",
  MUSQ: "Music Industry (MUSQ)",
  NERD: "Streaming (NERD)",
  PEJ: "Entertainment (PEJ)",
  KLXY: "Global Luxury (KLXY)",
  FANZ: "Pro Sports (FANZ)",
};

const SECTOR_EXPLANATIONS: Record<string, string> = {
  media: "Companies in podcasting, newsletters, and digital media. In the real market, these fall under Communication Services (XLC) alongside companies like Meta and Disney.",
  streaming: "Streaming platforms and digital entertainment. The real equivalent is the NERD ETF, which holds companies like Netflix, Roku, and Roblox.",
  music: "Music streaming, labels, and discovery. MUSQ is the only ETF dedicated entirely to music. It holds Spotify, Universal Music, and Live Nation.",
  gaming: "Game studios, mobile gaming, and esports. HERO tracks companies like Nintendo, Electronic Arts, and Roblox. Gaming is a $260 billion industry.",
  sportswear: "Athletic footwear and apparel. In the real market, companies like Nike and Under Armour trade in the Consumer Discretionary sector (XLY).",
  fashion: "Streetwear, luxury, and creator merch. KLXY tracks global luxury brands like LVMH, Hermes, and Kering.",
  publishing: "Book publishing and literary platforms. No ETF exists just for publishing. It falls under Communication Services (XLC) in real markets.",
  beauty: "Hair care, skincare, and salon chains. In real markets, beauty companies like Estee Lauder and Ulta trade under Consumer Staples (XLP).",
  finance: "Community banking, fintech, and lending. XLF is the Financials ETF, holding JPMorgan, Goldman Sachs, and Berkshire Hathaway.",
  realestate: "REITs, construction, and housing. VNQ is the largest real estate ETF, holding companies that own apartments, offices, and data centers.",
  sports: "Athlete agencies, venues, and analytics. FANZ tracks official corporate sponsors of major American sports leagues.",
  entertainment: "Film production, live events, and gaming companies. PEJ tracks leisure and entertainment companies like Disney, Booking Holdings, and Marriott.",
};

const SECTOR_TICKERS: Record<string, string[]> = {
  media: ["LOUD", "SCROLL", "VERSE"],
  streaming: ["VIZN", "NETFLO", "LIVE"],
  music: ["RYTHM", "BLOC", "CRATE"],
  gaming: ["PIXL", "MOBILE", "SQUAD"],
  sportswear: ["KICKS", "FLEX", "COURT"],
  fashion: ["DRIP", "RARE", "THREAD"],
  publishing: ["INK", "READS", "PRESS"],
  beauty: ["CROWN", "GLOW", "SHEEN"],
  finance: ["VAULT", "STAX", "GROW"],
  realestate: ["BLOK", "BUILD", "HOOD"],
  sports: ["DRAFT", "ARENA", "STATS"],
  entertainment: ["SCREEN", "STAGE", "GAME"],
};

export function SectorPerformance() {
  const simSectors = useQuery(api.sectorData.getSimSectorPerformance);
  const realSectors = useQuery(api.sectorData.getRealSectorData);
  const [expandedSector, setExpandedSector] = useState<string | null>(null);
  const [showExplainer, setShowExplainer] = useState(false);

  if (simSectors === undefined) {
    return (
      <div className="border-2 border-white bg-[#1a1a1a] p-4" style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}>
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Sector Performance</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-white/5 animate-pulse" />)}
        </div>
      </div>
    );
  }

  const realEtfMap = new Map<string, { changePercent: number; price: number }>();
  if (realSectors) {
    for (const etf of realSectors) {
      realEtfMap.set(etf.symbol, { changePercent: etf.changePercent, price: etf.price });
    }
  }

  return (
    <div className="border-2 border-white bg-[#1a1a1a] p-4" style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/50">
          Sector Performance
        </h2>
        <button
          onClick={() => setShowExplainer(!showExplainer)}
          className="font-mono text-[10px] text-[#7F77DD] hover:text-white transition-colors"
        >
          {showExplainer ? "Hide guide" : "What is this?"}
        </button>
      </div>

      {/* Explainer */}
      {showExplainer && (
        <div className="mb-4 p-3 border-l-4 border-[#7F77DD] bg-[#0e0e0e]">
          <p className="font-mono text-[11px] text-white/70 leading-relaxed mb-2">
            <strong className="text-white">Why sectors matter:</strong> The stock market is organized into sectors, groups of companies in the same industry. When one sneaker company does well, other sneaker companies often follow. That pattern is called <strong className="text-[#FDE047]">sector correlation</strong>.
          </p>
          <p className="font-mono text-[11px] text-white/70 leading-relaxed mb-2">
            <strong className="text-white">How to read this:</strong> Green means the sector is up today. Red means down. A smart investor spreads money across multiple sectors so one bad day in Fashion does not sink their whole portfolio. That is <strong className="text-[#FDE047]">diversification</strong>.
          </p>
          <p className="font-mono text-[11px] text-white/70 leading-relaxed mb-2">
            <strong className="text-white">What is an ETF?</strong> An ETF (Exchange-Traded Fund) is a basket of stocks you can buy with one purchase. Instead of picking individual companies, you buy one share of an ETF and instantly own a piece of every company inside it. For example, buying one share of HERO (the gaming ETF) gives you exposure to Nintendo, EA, and Roblox all at once.
          </p>
          <p className="font-mono text-[11px] text-white/70 leading-relaxed">
            <strong className="text-white">Real vs Sim:</strong> Each BLK Exchange sector is matched to a real ETF on Wall Street. Tap any sector to see the real-world equivalent and how it compares. When your sim sector moves in the same direction as the real ETF, you are seeing <strong className="text-[#FDE047]">sector correlation</strong> in action.
          </p>
        </div>
      )}

      {/* Sector list */}
      <div className="space-y-0 border-t border-white/10 pt-2">
        {simSectors.map((sector) => {
          const isPositive = sector.changePercent >= 0;
          const color = isPositive ? "#22c55e" : "#ef4444";
          const realEtf = sector.realEtf ? realEtfMap.get(sector.realEtf) : null;
          const isExpanded = expandedSector === sector.id;
          const tickers = SECTOR_TICKERS[sector.id] ?? [];

          return (
            <div key={sector.id} className="border-b border-white/5 last:border-b-0">
              {/* Sector row */}
              <button
                onClick={() => setExpandedSector(isExpanded ? null : sector.id)}
                className="w-full flex items-center gap-2 py-2.5 hover:bg-white/[0.02] transition-colors text-left"
              >
                {/* Color bar */}
                <div className="w-1 h-8 flex-shrink-0" style={{ backgroundColor: color }} />

                {/* Name + arrow */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-bold text-white">
                    {sector.name}
                    <span
                      className="ml-1.5 text-white/30 text-xs transition-transform inline-block"
                      style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                    >
                      ▸
                    </span>
                  </p>
                  {/* Tickers preview */}
                  <p className="font-mono text-[10px] text-white/40 mt-0.5">
                    {tickers.join(" · ")}
                  </p>
                </div>

                {/* Sim change */}
                <div
                  className="flex-shrink-0 font-mono text-sm font-bold px-3 py-1 min-w-[64px] text-center"
                  style={{
                    color,
                    backgroundColor: `${color}10`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {isPositive ? "+" : ""}{sector.changePercent.toFixed(1)}%
                </div>
              </button>

              {/* Expanded dropdown */}
              {isExpanded && (
                <SectorDetail
                  sectorId={sector.id}
                  realEtf={realEtf ?? null}
                  realEtfSymbol={sector.realEtf}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <p className="font-mono text-[9px] text-white/20 leading-relaxed">
          Each sector is mapped to a real ETF on Wall Street. Tap any sector to see the connection and learn what it means.
        </p>
      </div>
    </div>
  );
}

// ─── Sector Detail Dropdown ─────────────────────────────────────────────────

function SectorDetail({
  sectorId,
  realEtf,
  realEtfSymbol,
}: {
  sectorId: string;
  realEtf: { changePercent: number; price: number } | null;
  realEtfSymbol: string | null;
}) {
  const stocks = useQuery(api.sectorData.getStocksBySector, { sector: sectorId });

  return (
    <div className="pb-4 pl-2 pr-1">
      {/* Individual stocks in this sector */}
      <div className="mb-3">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
          BLK Exchange Tickers
        </p>
        <div className="space-y-1">
          {stocks === undefined ? (
            <div className="h-16 bg-white/5 animate-pulse" />
          ) : (
            stocks.map((stock) => {
              const stockPositive = stock.dailyChangePercent >= 0;
              const stockColor = stockPositive ? "#22c55e" : "#ef4444";
              return (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between py-1.5 px-2 bg-[#0e0e0e] border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">
                      {stock.symbol}
                    </span>
                    <span className="font-mono text-[10px] text-white/30 hidden sm:inline">
                      {stock.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white/60">
                      ${(stock.priceInCents / 100).toFixed(2)}
                    </span>
                    <span
                      className="font-mono text-xs font-bold min-w-[50px] text-right"
                      style={{ color: stockColor }}
                    >
                      {stockPositive ? "+" : ""}{stock.dailyChangePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Real ETF comparison */}
      {realEtf && realEtfSymbol && (
        <div className="mb-3">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
            Real Market Equivalent
          </p>
          <div className="p-3 bg-[#0e0e0e] border border-[#7F77DD]/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-mono text-sm font-bold text-white">
                  {realEtfSymbol}
                </span>
                <span className="font-mono text-xs text-white/40 ml-2">
                  {ETF_NAMES[realEtfSymbol] ?? ""}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-white">
                  ${realEtf.price.toFixed(2)}
                </span>
                <span
                  className="font-mono text-xs font-bold ml-2"
                  style={{ color: realEtf.changePercent >= 0 ? "#22c55e" : "#ef4444" }}
                >
                  {realEtf.changePercent >= 0 ? "+" : ""}{realEtf.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            <p className="font-mono text-[10px] text-white/30 leading-relaxed">
              This real ETF tracks companies similar to the ones in your BLK Exchange {SECTOR_NAMES_MAP[sectorId] ?? sectorId} sector. When both move in the same direction, that is sector correlation.
            </p>
          </div>
        </div>
      )}

      {/* Educational explanation */}
      <p className="font-mono text-xs text-white/50 leading-relaxed">
        {SECTOR_EXPLANATIONS[sectorId] ?? ""}
      </p>
    </div>
  );
}

const SECTOR_NAMES_MAP: Record<string, string> = {
  media: "Media & Content",
  streaming: "Streaming",
  music: "Music",
  gaming: "Gaming",
  sportswear: "Sportswear",
  fashion: "Fashion",
  publishing: "Publishing",
  beauty: "Beauty",
  finance: "Finance",
  realestate: "Real Estate",
  sports: "Sports",
  entertainment: "Entertainment",
};
