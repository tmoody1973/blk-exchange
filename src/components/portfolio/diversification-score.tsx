"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TOTAL_SECTORS = 12;

type DiversificationScoreProps = {
  holdings: { sector: string }[];
};

export function DiversificationScore({ holdings }: DiversificationScoreProps) {
  const uniqueSectors = new Set(holdings.map((h) => h.sector)).size;
  const score = Math.round((uniqueSectors / TOTAL_SECTORS) * 100);

  const scoreLabel =
    score >= 75
      ? "Excellent"
      : score >= 50
      ? "Good"
      : score >= 25
      ? "Fair"
      : "Low";

  const scoreLabelColor =
    score >= 75
      ? "#22c55e"
      : score >= 50
      ? "#7F77DD"
      : score >= 25
      ? "#FDE047"
      : "#ef4444";

  return (
    <Card
      className="border-2 border-[#7F77DD] bg-[#1a1a1a] rounded-none"
      style={{ boxShadow: "4px 4px 0px 0px #7F77DD" }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="font-mono font-bold text-white text-sm uppercase tracking-wider">
          Diversification Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Score row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-white font-bold text-3xl">{score}</span>
          <span
            className="font-mono font-bold text-sm uppercase tracking-wider"
            style={{ color: scoreLabelColor }}
          >
            {scoreLabel}
          </span>
        </div>

        {/* Progress bar */}
        <Progress value={score} className="h-4" />

        {/* Sector count */}
        <p className="font-mono text-white/50 text-xs">
          {uniqueSectors} of {TOTAL_SECTORS} sectors represented
        </p>

        {/* Coaching placeholder */}
        <div className="border-t-2 border-[#7F77DD]/30 pt-3">
          <p className="font-mono text-[#7F77DD] text-xs italic">
            {uniqueSectors === 0
              ? "Start investing to unlock your diversification coach."
              : score < 50
              ? "Consider branching into more sectors to reduce risk."
              : score < 75
              ? "Solid start — explore more sectors to strengthen your portfolio."
              : "Strong diversification. Keep balancing as prices shift."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
