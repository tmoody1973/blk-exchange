"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { TickerRow } from "@/components/market/ticker-row";

type SortKey = "symbol" | "price" | "change" | "sector";
type SortDirection = "asc" | "desc";

type StockDoc = {
  _id: string;
  symbol: string;
  name: string;
  sector: string;
  priceInCents: number;
  dailyChangeInCents: number;
  dailyChangePercent: number;
  priceHistory: Array<{ timestamp: number; priceInCents: number }>;
};

function sortStocks(
  stocks: StockDoc[],
  key: SortKey,
  direction: SortDirection
): StockDoc[] {
  const sorted = [...stocks].sort((a, b) => {
    switch (key) {
      case "symbol":
        return a.symbol.localeCompare(b.symbol);
      case "price":
        return a.priceInCents - b.priceInCents;
      case "change":
        return a.dailyChangePercent - b.dailyChangePercent;
      case "sector":
        return a.sector.localeCompare(b.sector) || a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });

  return direction === "desc" ? sorted.reverse() : sorted;
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) {
    return <span className="text-white/30 ml-1">↕</span>;
  }
  return (
    <span className="text-[#7F77DD] ml-1">{direction === "asc" ? "↑" : "↓"}</span>
  );
}

export function TickerTable() {
  const stocks = useQuery(api.market.getAllStocks);
  const [sortKey, setSortKey] = useState<SortKey>("sector");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  if (stocks === undefined) {
    return (
      <div className="p-8 text-center font-mono text-white/50">
        Loading market data...
      </div>
    );
  }

  const sorted = sortStocks(stocks as StockDoc[], sortKey, sortDirection);

  return (
    <div className="border-2 border-[#ffffff]" style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1a1a1a]">
            <TableHead
              className="cursor-pointer select-none font-mono text-white text-xs uppercase tracking-wider hover:text-[#7F77DD] transition-colors"
              onClick={() => handleSort("symbol")}
            >
              Symbol
              <SortIcon active={sortKey === "symbol"} direction={sortDirection} />
            </TableHead>

            <TableHead className="hidden md:table-cell font-mono text-white/50 text-xs uppercase tracking-wider">
              <button
                className="cursor-pointer hover:text-[#7F77DD] transition-colors text-white/50 uppercase text-xs font-mono tracking-wider"
                onClick={() => handleSort("sector")}
              >
                Sector
                <SortIcon active={sortKey === "sector"} direction={sortDirection} />
              </button>
            </TableHead>

            <TableHead
              className="cursor-pointer select-none font-mono text-white text-xs uppercase tracking-wider text-right hover:text-[#7F77DD] transition-colors"
              onClick={() => handleSort("price")}
            >
              Price
              <SortIcon active={sortKey === "price"} direction={sortDirection} />
            </TableHead>

            <TableHead className="hidden md:table-cell font-mono text-white/50 text-xs uppercase tracking-wider text-right">
              Chg $
            </TableHead>

            <TableHead
              className="cursor-pointer select-none font-mono text-white text-xs uppercase tracking-wider text-right hover:text-[#7F77DD] transition-colors"
              onClick={() => handleSort("change")}
            >
              Chg %
              <SortIcon active={sortKey === "change"} direction={sortDirection} />
            </TableHead>

            <TableHead className="font-mono text-white/50 text-xs uppercase tracking-wider">
              7D
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((stock) => (
            <TickerRow key={stock._id} stock={stock} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
