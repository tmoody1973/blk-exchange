"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { formatPrice, formatChange, formatPercent } from "@/lib/utils/format";

type EnrichedHolding = {
  symbol: string;
  shares: number;
  avgCostInCents: number;
  currentPriceInCents: number;
  currentValueInCents: number;
  pnlInCents: number;
  pnlPercent: number;
};

type HoldingsTableProps = {
  holdings: EnrichedHolding[];
  totalHoldingsValueInCents: number;
};

function pnlColor(pnl: number): string {
  return pnl >= 0 ? "#22c55e" : "#ef4444";
}

export function HoldingsTable({ holdings, totalHoldingsValueInCents }: HoldingsTableProps) {
  const router = useRouter();

  if (holdings.length === 0) {
    return (
      <div
        className="border-2 border-[#ffffff] bg-[#1a1a1a] p-6 text-center"
        style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
      >
        <p className="font-mono text-white/30 text-sm">
          You have no holdings. Head to the market to buy your first stock.
        </p>
      </div>
    );
  }

  const getAllocationPct = (valueInCents: number): string => {
    if (totalHoldingsValueInCents === 0) return "0.0%";
    return ((valueInCents / totalHoldingsValueInCents) * 100).toFixed(1) + "%";
  };

  return (
    <div
      className="border-2 border-[#ffffff] bg-[#1a1a1a]"
      style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      <div className="px-4 pt-4 pb-2 border-b-2 border-[#ffffff]">
        <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider">
          Holdings
        </h2>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider">
                Symbol
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                Shares
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                Avg Cost
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                Price
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                P&amp;L $
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                P&amp;L %
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                Alloc
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((h) => (
              <TableRow
                key={h.symbol}
                className="cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => router.push(`/market/${h.symbol}`)}
              >
                <TableCell className="font-mono font-bold text-white text-sm">
                  {h.symbol}
                </TableCell>
                <TableCell className="font-mono text-white/70 text-sm text-right">
                  {h.shares.toFixed(4)}
                </TableCell>
                <TableCell className="font-mono text-white/70 text-sm text-right">
                  {formatPrice(h.avgCostInCents)}
                </TableCell>
                <TableCell className="font-mono text-white text-sm text-right">
                  {formatPrice(h.currentPriceInCents)}
                </TableCell>
                <TableCell
                  className="font-mono font-bold text-sm text-right"
                  style={{ color: pnlColor(h.pnlInCents) }}
                >
                  {formatChange(h.pnlInCents)}
                </TableCell>
                <TableCell
                  className="font-mono font-bold text-sm text-right"
                  style={{ color: pnlColor(h.pnlPercent) }}
                >
                  {formatPercent(h.pnlPercent)}
                </TableCell>
                <TableCell className="font-mono text-white/60 text-sm text-right">
                  {getAllocationPct(h.currentValueInCents)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile table */}
      <div className="md:hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider">
                Symbol
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                Value
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                P&amp;L $
              </TableHead>
              <TableHead className="font-mono text-xs text-white/60 uppercase tracking-wider text-right">
                P&amp;L %
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((h) => (
              <TableRow
                key={h.symbol}
                className="cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => router.push(`/market/${h.symbol}`)}
              >
                <TableCell className="font-mono font-bold text-white text-sm">
                  {h.symbol}
                </TableCell>
                <TableCell className="font-mono text-white text-sm text-right">
                  {formatPrice(h.currentValueInCents)}
                </TableCell>
                <TableCell
                  className="font-mono font-bold text-sm text-right"
                  style={{ color: pnlColor(h.pnlInCents) }}
                >
                  {formatChange(h.pnlInCents)}
                </TableCell>
                <TableCell
                  className="font-mono font-bold text-sm text-right"
                  style={{ color: pnlColor(h.pnlPercent) }}
                >
                  {formatPercent(h.pnlPercent)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
