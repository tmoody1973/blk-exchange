"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { Sparkline } from "@/components/market/sparkline";
import { SECTORS } from "@/lib/constants/sectors";

type StockData = {
  symbol: string;
  name: string;
  sector: string;
  priceInCents: number;
  dailyChangeInCents: number;
  dailyChangePercent: number;
  priceHistory: Array<{ timestamp: number; priceInCents: number }>;
};

type TickerRowProps = {
  stock: StockData;
};

function formatCents(cents: number): string {
  return `$${(Math.abs(cents) / 100).toFixed(2)}`;
}

function getSectorColor(sectorId: string): string {
  const sector = SECTORS.find((s) => s.id === sectorId);
  return sector?.color ?? "#ffffff";
}

function getSectorName(sectorId: string): string {
  const sector = SECTORS.find((s) => s.id === sectorId);
  return sector?.name ?? sectorId;
}

export function TickerRow({ stock }: TickerRowProps) {
  const isPositive = stock.dailyChangePercent >= 0;
  const changeColor = isPositive ? "#22c55e" : "#ef4444";
  const changePrefix = isPositive ? "+" : "-";
  const sectorColor = getSectorColor(stock.sector);

  return (
    <TableRow
      className="cursor-pointer hover:bg-[#242424] transition-colors"
      style={{ minHeight: 44 }}
    >
      <TableCell className="py-2 px-3">
        <Link href={`/market/${stock.symbol}`} className="block w-full h-full">
          <div className="flex flex-col">
            <span className="font-mono font-bold text-white text-sm">
              {stock.symbol}
            </span>
            <span className="hidden md:block font-mono text-xs text-white/50 truncate max-w-[140px]">
              {stock.name}
            </span>
          </div>
        </Link>
      </TableCell>

      {/* Sector badge — desktop only */}
      <TableCell className="hidden md:table-cell py-2 px-3">
        <Link href={`/market/${stock.symbol}`} className="block">
          <Badge
            className="text-xs font-mono border-2"
            style={{
              backgroundColor: `${sectorColor}20`,
              borderColor: sectorColor,
              color: sectorColor,
            }}
          >
            {getSectorName(stock.sector)}
          </Badge>
        </Link>
      </TableCell>

      {/* Price */}
      <TableCell className="py-2 px-3 text-right">
        <Link href={`/market/${stock.symbol}`} className="block">
          <span className="font-mono font-bold text-white text-sm">
            ${(stock.priceInCents / 100).toFixed(2)}
          </span>
        </Link>
      </TableCell>

      {/* Daily change $ — desktop only */}
      <TableCell className="hidden md:table-cell py-2 px-3 text-right">
        <Link href={`/market/${stock.symbol}`} className="block">
          <span className="font-mono text-sm" style={{ color: changeColor }}>
            {changePrefix}
            {formatCents(stock.dailyChangeInCents)}
          </span>
        </Link>
      </TableCell>

      {/* Daily change % */}
      <TableCell className="py-2 px-3 text-right">
        <Link href={`/market/${stock.symbol}`} className="block">
          <span className="font-mono text-sm font-bold" style={{ color: changeColor }}>
            {changePrefix}
            {Math.abs(stock.dailyChangePercent).toFixed(2)}%
          </span>
        </Link>
      </TableCell>

      {/* Sparkline */}
      <TableCell className="py-2 px-3">
        <Link href={`/market/${stock.symbol}`} className="block">
          <Sparkline data={stock.priceHistory} />
        </Link>
      </TableCell>
    </TableRow>
  );
}
