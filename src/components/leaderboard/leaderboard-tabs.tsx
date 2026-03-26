"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BoardTable } from "./board-table";
import { getCurrentWeek, getCurrentSeason } from "@/lib/leaderboard-periods";
import { Id } from "../../../convex/_generated/dataModel";

type BoardType =
  | "portfolio-value"
  | "knowledge-vault"
  | "diversification"
  | "biggest-mover"
  | "blueprint-award";

interface BoardConfig {
  id: BoardType;
  label: string;
  period: string;
  scoreLabel: string;
  formatScore: (score: number) => string;
  description: string;
}

const BOARDS: BoardConfig[] = [
  {
    id: "portfolio-value",
    label: "Portfolio",
    period: getCurrentWeek(),
    scoreLabel: "Portfolio Value",
    formatScore: (s) => `$${(s / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    description: "Total portfolio value this week",
  },
  {
    id: "knowledge-vault",
    label: "Knowledge",
    period: getCurrentSeason(),
    scoreLabel: "Concepts",
    formatScore: (s) => `${s} concepts`,
    description: "Most financial concepts unlocked",
  },
  {
    id: "diversification",
    label: "Diversity",
    period: getCurrentWeek(),
    scoreLabel: "Div. Score",
    formatScore: (s) => `${s}/100`,
    description: "Highest diversification score this week",
  },
  {
    id: "biggest-mover",
    label: "Biggest Mover",
    period: getCurrentWeek(),
    scoreLabel: "% Gain",
    formatScore: (s) => `+${(s / 100).toFixed(2)}%`,
    description: "Largest portfolio gain % this week",
  },
  {
    id: "blueprint-award",
    label: "Blueprint",
    period: getCurrentSeason(),
    scoreLabel: "Sessions",
    formatScore: (s) => `${s} sessions`,
    description: "Most consistent player this season",
  },
];

interface LeaderboardTabsProps {
  currentPlayerId?: Id<"players"> | null;
}

function BoardPanel({
  board,
  currentPlayerId,
}: {
  board: BoardConfig;
  currentPlayerId?: Id<"players"> | null;
}) {
  const entries = useQuery(api.leaderboards.getBoard, {
    board: board.id,
    period: board.period,
  });

  const playerRank = useQuery(
    api.leaderboards.getPlayerRank,
    currentPlayerId
      ? { playerId: currentPlayerId, board: board.id, period: board.period }
      : "skip"
  );

  return (
    <div className="space-y-3">
      {/* Board description + player rank */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-white/40 text-xs">{board.description}</p>
        {playerRank && playerRank.rank && (
          <span className="font-mono text-xs" style={{ color: "#7F77DD" }}>
            Your rank: #{playerRank.rank} of {playerRank.total}
          </span>
        )}
      </div>

      {entries === undefined ? (
        <div
          className="border-2 border-[#ffffff30] p-8 text-center"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <p className="font-mono text-white/30 text-sm animate-pulse">Loading...</p>
        </div>
      ) : (
        <BoardTable
          entries={entries as Parameters<typeof BoardTable>[0]["entries"]}
          currentPlayerId={currentPlayerId}
          scoreLabel={board.scoreLabel}
          formatScore={board.formatScore}
        />
      )}
    </div>
  );
}

export function LeaderboardTabs({ currentPlayerId }: LeaderboardTabsProps) {
  return (
    <Tabs defaultValue="portfolio-value" className="w-full">
      <div className="overflow-x-auto pb-1">
        <TabsList
          className="flex w-max gap-1 border-2 border-[#ffffff] p-1 h-auto"
          style={{ backgroundColor: "#1a1a1a", boxShadow: "3px 3px 0px 0px #ffffff" }}
        >
          {BOARDS.map((board) => (
            <TabsTrigger
              key={board.id}
              value={board.id}
              className="font-mono text-xs uppercase tracking-wider whitespace-nowrap px-3 py-2 data-[state=active]:text-[#0e0e0e]"
              style={{
                fontFamily: "Courier New, monospace",
              }}
            >
              {board.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {BOARDS.map((board) => (
        <TabsContent key={board.id} value={board.id} className="mt-4">
          <BoardPanel board={board} currentPlayerId={currentPlayerId} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
