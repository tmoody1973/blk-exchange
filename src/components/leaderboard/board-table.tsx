"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Id } from "../../../convex/_generated/dataModel";

type BoardEntry = {
  _id: string;
  playerId: Id<"players">;
  playerName: string;
  score: number;
  board: string;
  period: string;
  updatedAt: number;
};

interface BoardTableProps {
  entries: BoardEntry[];
  currentPlayerId?: Id<"players"> | null;
  scoreLabel?: string;
  formatScore?: (score: number) => string;
}

const RANK_STYLES: Record<number, { border: string; color: string; label: string }> = {
  1: { border: "#FFD700", color: "#FFD700", label: "1ST" },
  2: { border: "#C0C0C0", color: "#C0C0C0", label: "2ND" },
  3: { border: "#CD7F32", color: "#CD7F32", label: "3RD" },
};

export function BoardTable({
  entries,
  currentPlayerId,
  scoreLabel = "Score",
  formatScore,
}: BoardTableProps) {
  if (entries.length === 0) {
    return (
      <div
        className="border-2 border-[#ffffff30] p-8 text-center"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <p className="font-mono text-white/30 text-sm">No entries yet. Start trading to appear on this board.</p>
      </div>
    );
  }

  const fmt = formatScore ?? ((s: number) => s.toLocaleString());

  return (
    <div
      className="border-2 border-[#ffffff]"
      style={{ backgroundColor: "#1a1a1a", boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      <Table>
        <TableHeader>
          <TableRow
            style={{ backgroundColor: "#1a1a1a", borderBottomColor: "#ffffff40" }}
          >
            <TableHead className="font-mono text-xs text-white/60 uppercase tracking-widest w-16">
              Rank
            </TableHead>
            <TableHead className="font-mono text-xs text-white/60 uppercase tracking-widest">
              Player
            </TableHead>
            <TableHead className="font-mono text-xs text-white/60 uppercase tracking-widest text-right">
              {scoreLabel}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isCurrentPlayer = entry.playerId === currentPlayerId;
            const rankStyle = RANK_STYLES[rank];

            return (
              <TableRow
                key={entry._id}
                style={{
                  backgroundColor: isCurrentPlayer ? "#7F77DD20" : "#1a1a1a",
                  borderColor: isCurrentPlayer ? "#7F77DD" : rankStyle?.border ?? "#ffffff20",
                  borderLeftWidth: isCurrentPlayer ? 3 : rankStyle ? 3 : 0,
                  borderLeftStyle: "solid",
                  borderBottomColor: "#ffffff10",
                }}
              >
                <TableCell className="font-mono font-bold w-16">
                  {rankStyle ? (
                    <span
                      className="text-xs font-bold"
                      style={{ color: rankStyle.color }}
                    >
                      {rankStyle.label}
                    </span>
                  ) : (
                    <span className="text-white/50 text-sm">#{rank}</span>
                  )}
                </TableCell>
                <TableCell className="font-mono">
                  <span
                    style={{
                      color: isCurrentPlayer ? "#7F77DD" : rankStyle?.color ?? "#ffffff",
                      fontWeight: isCurrentPlayer ? 700 : 400,
                    }}
                  >
                    {entry.playerName}
                    {isCurrentPlayer && (
                      <span className="ml-2 text-xs text-[#7F77DD]/60">(you)</span>
                    )}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-right">
                  <span
                    style={{
                      color: isCurrentPlayer ? "#7F77DD" : rankStyle?.color ?? "#ffffff",
                      fontWeight: isCurrentPlayer ? 700 : 400,
                    }}
                  >
                    {fmt(entry.score)}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
