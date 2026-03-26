"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { X, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";

type CoachResult = {
  diversificationScore: number;
  concentrationWarnings: string[];
  recommendation: string;
  summary: string;
};

type PortfolioCoachProps = {
  playerId: Id<"players">;
  onDismiss?: () => void;
};

export function PortfolioCoach({ playerId, onDismiss }: PortfolioCoachProps) {
  const [result, setResult] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gradePortfolio = useAction(api.claude.answerQuestion.gradePortfolioPublic);

  async function handleGrade() {
    setLoading(true);
    setError(null);
    try {
      const data = await gradePortfolio({ playerId });
      setResult(data as CoachResult);
    } catch (err) {
      console.error("[PortfolioCoach] Error:", err);
      setError("Failed to get coaching. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="border-2 border-[#7F77DD] bg-[#1a1a1a] p-4"
      style={{ boxShadow: "4px 4px 0px 0px #7F77DD" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#7F77DD]" />
          <span className="font-mono font-bold text-white text-sm uppercase tracking-widest">
            Portfolio Coach
          </span>
          <span className="font-mono text-[10px] text-[#7F77DD] border border-[#7F77DD] px-1.5 py-0.5">
            AI
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Initial state — prompt to grade */}
      {!result && !loading && (
        <div className="text-center py-4">
          <p className="font-mono text-white/60 text-xs mb-4 leading-relaxed">
            Get AI-powered feedback on your portfolio diversification, concentration
            risks, and a specific recommendation.
          </p>
          <button
            onClick={handleGrade}
            className="font-mono font-bold text-sm uppercase tracking-widest px-6 py-2 border-2 border-[#7F77DD] text-[#7F77DD] hover:bg-[#7F77DD]/10 transition-colors"
            style={{ boxShadow: "2px 2px 0px 0px #7F77DD" }}
          >
            Grade My Portfolio
          </button>
          {error && (
            <p className="font-mono text-[#ef4444] text-xs mt-3">{error}</p>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-6">
          <RefreshCw className="h-6 w-6 text-[#7F77DD] animate-spin" />
          <p className="font-mono text-white/50 text-xs uppercase tracking-wider">
            Analyzing portfolio...
          </p>
        </div>
      )}

      {/* Result state */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Diversification score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
                Diversification Score
              </span>
              <span
                className="font-mono font-bold text-lg"
                style={{ color: scoreColor(result.diversificationScore) }}
              >
                {result.diversificationScore}/100
              </span>
            </div>
            <div className="h-2 bg-white/10 border border-white/20">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${result.diversificationScore}%`,
                  backgroundColor: scoreColor(result.diversificationScore),
                }}
              />
            </div>
            <p className="font-mono text-[10px] text-white/30 mt-1">
              {scoreLabel(result.diversificationScore)}
            </p>
          </div>

          {/* Summary */}
          {result.summary && (
            <p className="font-mono text-white/70 text-xs leading-relaxed border-l-2 border-[#7F77DD] pl-3">
              {result.summary}
            </p>
          )}

          {/* Concentration warnings */}
          {result.concentrationWarnings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3 w-3 text-[#FDE047]" />
                <span className="font-mono text-xs text-[#FDE047] uppercase tracking-wider font-bold">
                  Concentration Warnings
                </span>
              </div>
              <ul className="space-y-1">
                {result.concentrationWarnings.map((w, i) => (
                  <li key={i} className="font-mono text-xs text-white/60 pl-3">
                    • {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3 w-3 text-[#22c55e]" />
              <span className="font-mono text-xs text-[#22c55e] uppercase tracking-wider font-bold">
                Recommendation
              </span>
            </div>
            <p className="font-mono text-white/80 text-xs leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          {/* Re-grade button */}
          <button
            onClick={handleGrade}
            className="w-full font-mono text-xs text-white/40 hover:text-white/70 uppercase tracking-wider py-2 border border-white/10 hover:border-white/30 transition-colors"
          >
            Re-analyze Portfolio
          </button>
          {error && (
            <p className="font-mono text-[#ef4444] text-xs">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#FDE047";
  return "#ef4444";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent diversification";
  if (score >= 60) return "Good diversification";
  if (score >= 40) return "Moderate — could be spread further";
  if (score >= 20) return "Concentrated — consider spreading risk";
  return "High concentration risk";
}
