"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ACHIEVEMENTS, Achievement } from "@/lib/constants/achievements";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AchievementsPanelProps {
  playerId: Id<"players">;
}

const CATEGORY_LABELS: Record<Achievement["category"], string> = {
  trading: "Trading",
  diversification: "Diversification",
  learning: "Learning",
  social: "Social",
};

const CATEGORY_ORDER: Achievement["category"][] = [
  "trading",
  "diversification",
  "learning",
  "social",
];

// ─── AchievementCard ──────────────────────────────────────────────────────────

function AchievementCard({
  achievement,
  unlockedAt,
}: {
  achievement: Achievement;
  unlockedAt: number | null;
}) {
  const unlocked = unlockedAt !== null;

  return (
    <div
      className="border-2 p-3 flex flex-col gap-2 transition-all"
      style={{
        borderColor: unlocked ? "#ffffff" : "#ffffff25",
        backgroundColor: unlocked ? "#1a1a1a" : "#0f0f0f",
        boxShadow: unlocked ? "3px 3px 0px 0px #7F77DD" : "none",
        opacity: unlocked ? 1 : 0.5,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl" style={{ filter: unlocked ? "none" : "grayscale(1)" }}>
          {achievement.icon}
        </span>
        <span
          className="font-mono font-bold text-xs uppercase tracking-wider"
          style={{ color: unlocked ? "#ffffff" : "#ffffff60" }}
        >
          {achievement.name}
        </span>
      </div>

      <p
        className="font-mono text-xs leading-relaxed"
        style={{ color: unlocked ? "#ffffff80" : "#ffffff30" }}
      >
        {unlocked ? achievement.description : "Keep trading to unlock"}
      </p>

      {unlocked && unlockedAt && (
        <p className="font-mono text-[10px]" style={{ color: "#7F77DD" }}>
          Unlocked{" "}
          {new Date(unlockedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}

// ─── AchievementsPanel ────────────────────────────────────────────────────────

export function AchievementsPanel({ playerId }: AchievementsPanelProps) {
  const playerAchievements = useQuery(api.achievements.getPlayerAchievements, {
    playerId,
  });

  if (playerAchievements === undefined) {
    return (
      <div className="border-2 border-[#ffffff20] p-4">
        <p className="font-mono text-white/40 text-sm">Loading achievements...</p>
      </div>
    );
  }

  // Build lookup: achievementId → unlockedAt
  const unlockedMap = new Map<string, number>(
    playerAchievements.map((a) => [a.achievementId, a.unlockedAt])
  );

  const unlockedCount = unlockedMap.size;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-mono font-bold text-sm uppercase tracking-widest"
          style={{ color: "#ffffff60" }}
        >
          Achievements
        </h2>
        <span
          className="font-mono text-xs"
          style={{ color: "#7F77DD" }}
        >
          {unlockedCount}/{ACHIEVEMENTS.length} unlocked
        </span>
      </div>

      {/* Category groups */}
      <div className="space-y-6">
        {CATEGORY_ORDER.map((category) => {
          const items = ACHIEVEMENTS.filter((a) => a.category === category);

          return (
            <div key={category}>
              <h3
                className="font-mono text-[10px] uppercase tracking-widest mb-3"
                style={{ color: "#ffffff40" }}
              >
                {CATEGORY_LABELS[category]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlockedAt={unlockedMap.get(achievement.id) ?? null}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
