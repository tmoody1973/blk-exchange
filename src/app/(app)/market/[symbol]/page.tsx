"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { PriceChart } from "@/components/market/price-chart";
import { SECTORS } from "@/lib/constants/sectors";
import { TradeModal } from "@/components/trade/trade-modal";

type PageProps = {
  params: Promise<{ symbol: string }>;
};

function getSectorColor(sectorId: string): string {
  const sector = SECTORS.find((s) => s.id === sectorId);
  return sector?.color ?? "#ffffff";
}

function getSectorName(sectorId: string): string {
  const sector = SECTORS.find((s) => s.id === sectorId);
  return sector?.name ?? sectorId;
}

function formatCents(cents: number): string {
  return `$${(Math.abs(cents) / 100).toFixed(2)}`;
}

export default function TickerDetailPage({ params }: PageProps) {
  const { symbol } = use(params);
  const { user, isLoaded } = useUser();

  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeModalType, setTradeModalType] = useState<"buy" | "sell">("buy");

  const stock = useQuery(api.market.getStock, { symbol: symbol.toUpperCase() });

  const player = useQuery(
    api.players.getPlayer,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );

  // Lookup holding for this stock using player id
  // We fetch all holdings and filter client-side since getHoldingForStock needs stockId
  const holdings = useQuery(
    api.holdings.getHoldings,
    player ? { playerId: player._id } : "skip"
  );

  const holding = holdings?.find(
    (h: { symbol: string }) => h.symbol === symbol.toUpperCase()
  );

  if (stock === undefined) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="font-mono text-white/50">Loading...</p>
      </div>
    );
  }

  if (stock === null) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] p-6">
        <Link
          href="/market"
          className="font-mono text-sm text-white/50 hover:text-white transition-colors"
        >
          ← Market
        </Link>
        <div className="mt-8 text-center font-mono text-white/30">
          Symbol &quot;{symbol}&quot; not found.
        </div>
      </div>
    );
  }

  const isPositive = stock.dailyChangePercent >= 0;
  const changeColor = isPositive ? "#22c55e" : "#ef4444";
  const changePrefix = isPositive ? "+" : "-";
  const sectorColor = getSectorColor(stock.sector);

  const holdingShares = holding?.shares ?? 0;
  const holdingValue = holding?.currentValueInCents ?? 0;
  const holdingPnl = holding?.pnlInCents ?? 0;
  const holdingPnlPercent = holding?.pnlPercent ?? 0;
  const holdingPnlColor = holdingPnl >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div className="min-h-screen bg-[#0e0e0e] pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Back button */}
        <Link
          href="/market"
          className="inline-block font-mono text-sm text-white/50 hover:text-white transition-colors mb-6"
        >
          ← Market
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start gap-3 mb-2">
            <h1 className="font-mono font-bold text-3xl text-white tracking-widest">
              {stock.symbol}
            </h1>
            <Badge
              className="text-xs font-mono border-2 mt-1"
              style={{
                backgroundColor: `${sectorColor}20`,
                borderColor: sectorColor,
                color: sectorColor,
              }}
            >
              {getSectorName(stock.sector)}
            </Badge>
          </div>
          <p className="font-mono text-white/60 text-sm">{stock.name}</p>
        </div>

        {/* Price block */}
        <div
          className="border-2 border-[#ffffff] bg-[#1a1a1a] p-4 mb-6"
          style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
        >
          <div className="flex flex-wrap items-end gap-4">
            <span className="font-mono font-bold text-4xl text-white">
              ${(stock.priceInCents / 100).toFixed(2)}
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-mono font-bold text-lg"
                style={{ color: changeColor }}
              >
                {changePrefix}
                {formatCents(stock.dailyChangeInCents)}
              </span>
              <span
                className="font-mono font-bold text-lg"
                style={{ color: changeColor }}
              >
                ({changePrefix}
                {Math.abs(stock.dailyChangePercent).toFixed(2)}%)
              </span>
            </div>
          </div>
          <p className="font-mono text-xs text-white/30 mt-2">
            Prev close: ${(stock.previousCloseInCents / 100).toFixed(2)}
          </p>
        </div>

        {/* Price chart */}
        <div className="mb-6">
          <PriceChart priceHistory={stock.priceHistory} />
        </div>

        {/* Company profile */}
        <div
          className="border-2 border-[#ffffff] bg-[#1a1a1a] p-4 mb-6"
          style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
        >
          <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider mb-3 border-b-2 border-[#ffffff] pb-2">
            Company Profile
          </h2>
          <p className="font-mono text-white/70 text-sm leading-relaxed">
            {stock.description}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                Market Cap
              </p>
              <p className="font-mono text-white text-sm font-bold">
                ${(stock.marketCapInCents / 100).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                Sector
              </p>
              <p className="font-mono text-sm font-bold" style={{ color: sectorColor }}>
                {getSectorName(stock.sector)}
              </p>
            </div>
          </div>
        </div>

        {/* Your Position */}
        <div
          className="border-2 border-[#ffffff] bg-[#1a1a1a] p-4 mb-8"
          style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
        >
          <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider mb-3 border-b-2 border-[#ffffff] pb-2">
            Your Position
          </h2>
          {holdingShares > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                  Shares
                </p>
                <p className="font-mono text-white text-sm font-bold">
                  {holdingShares.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                  Value
                </p>
                <p className="font-mono text-white text-sm font-bold">
                  {formatCents(holdingValue)}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                  P&amp;L
                </p>
                <p
                  className="font-mono text-sm font-bold"
                  style={{ color: holdingPnlColor }}
                >
                  {holdingPnl >= 0 ? "+" : "-"}
                  {formatCents(holdingPnl)}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                  Return
                </p>
                <p
                  className="font-mono text-sm font-bold"
                  style={{ color: holdingPnlColor }}
                >
                  {holdingPnlPercent >= 0 ? "+" : ""}
                  {holdingPnlPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          ) : (
            <p className="font-mono text-white/40 text-sm">No position</p>
          )}
        </div>

        {/* BUY / SELL buttons — desktop inline */}
        <div className="hidden lg:flex gap-4">
          <button
            onClick={() => {
              setTradeModalType("buy");
              setTradeModalOpen(true);
            }}
            className="flex-1 border-2 border-[#ffffff] bg-[#22c55e]/20 text-[#22c55e] font-mono font-bold text-sm py-3 uppercase tracking-widest hover:bg-[#22c55e]/30 transition-colors"
            style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
          >
            Buy {stock.symbol}
          </button>
          <button
            onClick={() => {
              setTradeModalType("sell");
              setTradeModalOpen(true);
            }}
            className="flex-1 border-2 border-[#ffffff] bg-[#ef4444]/20 text-[#ef4444] font-mono font-bold text-sm py-3 uppercase tracking-widest hover:bg-[#ef4444]/30 transition-colors"
            style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
          >
            Sell {stock.symbol}
          </button>
        </div>
      </div>

      {/* Mobile sticky buy/sell buttons */}
      <div
        className="lg:hidden fixed bottom-16 left-0 right-0 z-30 flex gap-0 border-t-2 border-[#ffffff] bg-[#0e0e0e]"
      >
        <button
          onClick={() => {
            setTradeModalType("buy");
            setTradeModalOpen(true);
          }}
          className="flex-1 bg-[#22c55e]/20 text-[#22c55e] font-mono font-bold text-sm py-4 uppercase tracking-widest border-r-2 border-[#ffffff] hover:bg-[#22c55e]/30 transition-colors"
        >
          Buy
        </button>
        <button
          onClick={() => {
            setTradeModalType("sell");
            setTradeModalOpen(true);
          }}
          className="flex-1 bg-[#ef4444]/20 text-[#ef4444] font-mono font-bold text-sm py-4 uppercase tracking-widest hover:bg-[#ef4444]/30 transition-colors"
        >
          Sell
        </button>
      </div>

      {/* Trade modal */}
      {player && (
        <TradeModal
          stock={{
            _id: stock._id,
            symbol: stock.symbol,
            name: stock.name,
            priceInCents: stock.priceInCents,
          }}
          playerId={player._id}
          playerCash={player.cashInCents}
          currentHoldingShares={holdingShares}
          isOpen={tradeModalOpen}
          onClose={() => setTradeModalOpen(false)}
          initialType={tradeModalType}
        />
      )}
    </div>
  );
}
