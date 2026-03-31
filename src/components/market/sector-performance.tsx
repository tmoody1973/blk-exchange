"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const ETF_INFO: Record<string, { name: string; fullName: string; description: string; topHoldings: string[] }> = {
  XLF: {
    name: "XLF",
    fullName: "Financial Select Sector SPDR",
    description: "This ETF holds the biggest banks and financial companies in America. When you trade VAULT, STAX, and GROW in the sim, you are practicing the same decisions real investors make with companies like JPMorgan and Goldman Sachs.",
    topHoldings: ["JPMorgan Chase", "Berkshire Hathaway", "Visa", "Mastercard", "Bank of America"],
  },
  XLC: {
    name: "XLC",
    fullName: "Communication Services SPDR",
    description: "This ETF holds companies that create and distribute content, from social media to streaming to news. Your sim tickers LOUD, SCROLL, and VERSE mirror this sector.",
    topHoldings: ["Meta (Facebook)", "Alphabet (Google)", "Netflix", "Walt Disney", "Comcast"],
  },
  XLY: {
    name: "XLY",
    fullName: "Consumer Discretionary SPDR",
    description: "This ETF holds companies that sell things people want but do not need. Sneakers, clothes, entertainment. Your sim tickers KICKS, FLEX, and COURT live in this world.",
    topHoldings: ["Amazon", "Tesla", "Nike", "McDonald's", "Starbucks"],
  },
  XLP: {
    name: "XLP",
    fullName: "Consumer Staples SPDR",
    description: "This ETF holds companies that sell everyday essentials. Skincare, personal care, household goods. Your sim tickers CROWN, GLOW, and SHEEN are the cultural version of this sector.",
    topHoldings: ["Procter & Gamble", "Costco", "Coca-Cola", "Walmart", "Colgate"],
  },
  VNQ: {
    name: "VNQ",
    fullName: "Vanguard Real Estate ETF",
    description: "This ETF holds REITs, companies that own buildings and collect rent. Your sim tickers BLOK, BUILD, and HOOD represent the same idea: making money from property.",
    topHoldings: ["Prologis", "American Tower", "Equinix", "Simon Property", "Public Storage"],
  },
  HERO: {
    name: "HERO",
    fullName: "Global X Video Games & Esports ETF",
    description: "This ETF holds the companies that make the games people play. Your sim tickers PIXL, MOBILE, and SQUAD represent Black-owned versions of this $260 billion industry.",
    topHoldings: ["Nintendo", "Electronic Arts", "Roblox", "NetEase", "Take-Two"],
  },
  MUSQ: {
    name: "MUSQ",
    fullName: "MUSQ Global Music Industry ETF",
    description: "The only ETF dedicated entirely to the music industry. It holds the companies that make, distribute, and perform music. Your sim tickers RYTHM, BLOC, and CRATE are the cultural mirror.",
    topHoldings: ["Universal Music", "Spotify", "Live Nation", "Warner Music", "HYBE"],
  },
  NERD: {
    name: "NERD",
    fullName: "Roundhill Streaming & Digital Entertainment ETF",
    description: "This ETF holds streaming platforms and digital entertainment companies. Your sim tickers VIZN, NETFLO, and LIVE represent the same business models.",
    topHoldings: ["Netflix", "Roku", "Roblox", "Spotify", "Warner Bros Discovery"],
  },
  PEJ: {
    name: "PEJ",
    fullName: "Invesco Leisure & Entertainment ETF",
    description: "This ETF holds companies in live events, travel, and entertainment. Your sim tickers SCREEN, STAGE, and GAME represent the cultural versions of these businesses.",
    topHoldings: ["Booking Holdings", "Airbnb", "Marriott", "Live Nation", "Disney"],
  },
  KLXY: {
    name: "KLXY",
    fullName: "KraneShares Global Luxury ETF",
    description: "This ETF holds luxury fashion and lifestyle brands. Your sim tickers DRIP, RARE, and THREAD represent Black streetwear and fashion in the same market space.",
    topHoldings: ["LVMH", "Hermes", "Richemont", "Kering", "Ferrari"],
  },
  FANZ: {
    name: "FANZ",
    fullName: "ProSports Sponsors ETF",
    description: "This ETF holds the official corporate sponsors of major American sports leagues. Your sim tickers DRAFT, ARENA, and STATS represent the business side of sports.",
    topHoldings: ["Nike", "PepsiCo", "Anheuser-Busch", "Toyota", "AT&T"],
  },
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
  const [showGuide, setShowGuide] = useState(false);

  if (simSectors === undefined) {
    return (
      <div className="border-2 border-white bg-[#1a1a1a] p-4" style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}>
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-white mb-3">Sector Performance</h2>
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
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-white">
          Sector Performance
        </h2>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="font-mono text-xs text-[#7F77DD] hover:text-white transition-colors"
        >
          {showGuide ? "Hide guide" : "What is this?"}
        </button>
      </div>

      {showGuide && (
        <div className="mb-4 p-4 border-l-4 border-[#7F77DD] bg-[#0e0e0e]">
          <p className="font-mono text-sm text-white/80 leading-relaxed mb-3">
            <strong className="text-white">Sectors</strong> are groups of companies in the same industry.
            When one sneaker company does well, others usually follow. That is sector correlation.
          </p>
          <p className="font-mono text-sm text-white/80 leading-relaxed mb-3">
            <strong className="text-white">ETFs</strong> (Exchange-Traded Funds) let you buy a basket of stocks
            with one purchase. Instead of picking one company, you own a piece of every company in the basket.
          </p>
          <p className="font-mono text-sm text-white/80 leading-relaxed">
            <strong className="text-white">Tap any sector</strong> to see the individual stocks, the real ETF
            equivalent, and how they compare.
          </p>
        </div>
      )}

      <div className="space-y-0">
        {simSectors.map((sector) => {
          const isPositive = sector.changePercent >= 0;
          const color = isPositive ? "#22c55e" : "#ef4444";
          const realEtf = sector.realEtf ? realEtfMap.get(sector.realEtf) ?? null : null;
          const isExpanded = expandedSector === sector.id;
          const tickers = SECTOR_TICKERS[sector.id] ?? [];

          return (
            <div key={sector.id} className="border-b border-white/10 last:border-b-0">
              <button
                onClick={() => setExpandedSector(isExpanded ? null : sector.id)}
                className="w-full flex items-center gap-3 py-3 hover:bg-white/[0.03] transition-colors text-left"
              >
                <div className="w-1.5 h-10 flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-bold text-white">
                    {sector.name}
                    <span className="ml-2 text-white/40 text-xs">{isExpanded ? "▾" : "▸"}</span>
                  </p>
                  <p className="font-mono text-xs text-white/50 mt-0.5">{tickers.join(" · ")}</p>
                </div>
                <div
                  className="flex-shrink-0 font-mono text-sm font-bold px-3 py-1 min-w-[64px] text-center"
                  style={{ color, backgroundColor: `${color}10`, border: `1px solid ${color}30` }}
                >
                  {isPositive ? "+" : ""}{sector.changePercent.toFixed(1)}%
                </div>
              </button>

              {isExpanded && (
                <SectorDetail
                  sectorId={sector.id}
                  sectorName={sector.name}
                  realEtf={realEtf}
                  realEtfSymbol={sector.realEtf}
                  simChangePercent={sector.changePercent}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectorDetail({
  sectorId,
  sectorName,
  realEtf,
  realEtfSymbol,
  simChangePercent,
}: {
  sectorId: string;
  sectorName: string;
  realEtf: { changePercent: number; price: number } | null;
  realEtfSymbol: string | null;
  simChangePercent: number;
}) {
  const stocks = useQuery(api.sectorData.getStocksBySector, { sector: sectorId });
  const etfInfo = realEtfSymbol ? ETF_INFO[realEtfSymbol] ?? null : null;

  return (
    <div className="pb-5 px-2 space-y-4">
      {/* Sim stocks */}
      <div>
        <p className="font-mono text-xs text-[#7F77DD] uppercase tracking-widest font-bold mb-2">
          BLK Exchange {sectorName}
        </p>
        <div className="space-y-1">
          {stocks === undefined ? (
            <div className="h-20 bg-white/5 animate-pulse" />
          ) : (
            stocks.map((stock) => {
              const pos = stock.dailyChangePercent >= 0;
              const c = pos ? "#22c55e" : "#ef4444";
              return (
                <div key={stock.symbol} className="flex items-center justify-between py-2 px-3 bg-[#0e0e0e] border border-white/10">
                  <div>
                    <span className="font-mono text-sm font-bold text-white">{stock.symbol}</span>
                    <span className="font-mono text-xs text-white/50 ml-2">{stock.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-white/80">${(stock.priceInCents / 100).toFixed(2)}</span>
                    <span className="font-mono text-sm font-bold min-w-[55px] text-right" style={{ color: c }}>
                      {pos ? "+" : ""}{stock.dailyChangePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Real ETF section */}
      {etfInfo && realEtf && (
        <div>
          <p className="font-mono text-xs text-[#FDE047] uppercase tracking-widest font-bold mb-2">
            Real Market: {etfInfo.name}
          </p>
          <div className="p-4 bg-[#0e0e0e] border border-[#FDE047]/20 space-y-4">
            {/* ETF header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-base font-bold text-white">{etfInfo.fullName}</p>
                <p className="font-mono text-xs text-white/50">{etfInfo.name} on NYSE</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-base font-bold text-white">${realEtf.price.toFixed(2)}</p>
                <p className="font-mono text-sm font-bold" style={{ color: realEtf.changePercent >= 0 ? "#22c55e" : "#ef4444" }}>
                  {realEtf.changePercent >= 0 ? "+" : ""}{realEtf.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Visual comparison */}
            <div className="space-y-1">
              <p className="font-mono text-xs text-white/50 mb-1">Sim vs Real Today</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white/60 w-10">Sim</span>
                <div className="flex-1 h-7 bg-white/5 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: "50%" }} />
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      backgroundColor: simChangePercent >= 0 ? "#22c55e" : "#ef4444",
                      width: `${Math.min(Math.abs(simChangePercent) * 8, 50)}%`,
                      ...(simChangePercent >= 0 ? { left: "50%" } : { right: "50%" }),
                    }}
                  />
                </div>
                <span className="font-mono text-sm font-bold w-16 text-right" style={{ color: simChangePercent >= 0 ? "#22c55e" : "#ef4444" }}>
                  {simChangePercent >= 0 ? "+" : ""}{simChangePercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white/60 w-10">Real</span>
                <div className="flex-1 h-7 bg-white/5 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: "50%" }} />
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      backgroundColor: realEtf.changePercent >= 0 ? "#22c55e80" : "#ef444480",
                      width: `${Math.min(Math.abs(realEtf.changePercent) * 8, 50)}%`,
                      ...(realEtf.changePercent >= 0 ? { left: "50%" } : { right: "50%" }),
                    }}
                  />
                </div>
                <span className="font-mono text-sm font-bold w-16 text-right" style={{ color: realEtf.changePercent >= 0 ? "#22c55e" : "#ef4444" }}>
                  {realEtf.changePercent >= 0 ? "+" : ""}{realEtf.changePercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Top holdings */}
            <div>
              <p className="font-mono text-xs text-white/50 mb-1">Real companies inside this ETF:</p>
              <div className="flex flex-wrap gap-1.5">
                {etfInfo.topHoldings.map((h) => (
                  <span key={h} className="font-mono text-xs text-white/70 bg-white/5 px-2 py-1 border border-white/10">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Plain language */}
            <p className="font-mono text-sm text-white/70 leading-relaxed border-t border-white/10 pt-3">
              {etfInfo.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
