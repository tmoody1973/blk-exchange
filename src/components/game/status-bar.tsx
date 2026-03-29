"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  getSeasonInfo,
  getMsUntilNextMonday,
  formatCountdown,
} from "@/lib/constants/season";

interface StatusBarProps {
  playerId: Id<"players"> | null;
  sessionStartedAt: number | null;
  eventsExperienced: number;
}

export function GameStatusBar({
  playerId,
  sessionStartedAt,
  eventsExperienced,
}: StatusBarProps) {
  const vault = useQuery(
    api.vault.getVault,
    playerId ? { playerId } : "skip"
  );

  const [now, setNow] = useState(Date.now());

  // Update every 30 seconds for countdown timers
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const season = getSeasonInfo();
  const resetCountdown = formatCountdown(getMsUntilNextMonday());
  const vaultCount = vault?.length ?? 0;

  // Session duration
  const sessionMins = sessionStartedAt
    ? Math.floor((now - sessionStartedAt) / 60_000)
    : 0;

  return (
    <div
      className="border-2 border-white bg-[#1a1a1a] px-4 py-3"
      style={{ boxShadow: "4px 4px 0px 0px #7F77DD" }}
    >
      {/* Row 1: Season + reset countdown */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#7F77DD] uppercase tracking-widest">
            {season.label}
          </span>
          {season.endsLabel && (
            <span className="font-mono text-xs text-white/40">
              {season.endsLabel}
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-white/40">
          Resets in {resetCountdown}
        </span>
      </div>

      {/* Row 2: Session + Vault */}
      <div className="flex items-center gap-4 flex-wrap">
        <StatusPill
          label="Session"
          value={`${sessionMins} min`}
          color="#ffffff"
        />
        <StatusPill
          label="Events"
          value={String(eventsExperienced)}
          color={eventsExperienced >= 5 ? "#22c55e" : "#ffffff"}
        />
        <StatusPill
          label="Vault"
          value={`${vaultCount}/23`}
          color="#FDE047"
        />
      </div>
    </div>
  );
}

function StatusPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
        {label}
      </span>
      <span
        className="font-mono text-xs font-bold"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}
