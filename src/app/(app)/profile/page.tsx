"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { SessionDebrief } from "@/components/education/session-debrief";

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div
      className="border-2 border-[#ffffff30] p-4 flex flex-col gap-2"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <span className="font-mono text-xs text-white/40 uppercase tracking-widest">{label}</span>
      <span
        className="font-mono font-bold text-2xl"
        style={{ color: valueColor ?? "#ffffff" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [debriefSessionId, setDebriefSessionId] = useState<Id<"sessions"> | null>(null);

  const player = useQuery(
    api.players.getPlayer,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );

  const vault = useQuery(
    api.vault.getVault,
    player ? { playerId: player._id } : "skip"
  );

  const recentSessions = useQuery(
    api.sessions.getRecentSessions,
    player ? { playerId: player._id } : "skip"
  );

  const activeSession = useQuery(
    api.sessions.getActiveSession,
    player ? { playerId: player._id } : "skip"
  );

  const endSessionMutation = useMutation(api.sessions.endSession);
  const startSessionMutation = useMutation(api.sessions.startSession);

  // Loading state
  if (!isLoaded || player === undefined || vault === undefined) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="font-mono text-white/50 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (player === null) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="font-mono text-white/30 text-sm">Player not found.</p>
      </div>
    );
  }

  // Count total trades from recent sessions approximation
  const totalSessions = recentSessions?.length ?? 0;

  async function handleEndSession() {
    if (!player) return;
    const sessionId = await endSessionMutation({ playerId: player._id });
    if (sessionId) {
      setDebriefSessionId(sessionId as Id<"sessions">);
    }
  }

  async function handleStartNewSession() {
    if (!player) return;
    setDebriefSessionId(null);
    await startSessionMutation({ playerId: player._id });
  }

  // Show debrief overlay if we have a completed session to show
  if (debriefSessionId) {
    return (
      <SessionDebrief
        sessionId={debriefSessionId}
        onStartNewSession={handleStartNewSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] p-4 lg:p-6 pb-24 lg:pb-8">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-mono font-bold text-2xl text-white tracking-widest uppercase">
            Profile
          </h1>
          <p className="font-mono text-white/40 text-sm mt-1">
            {player.name}
          </p>
        </div>

        {/* End Session button */}
        {activeSession && (
          <button
            onClick={handleEndSession}
            className="border-2 border-[#ef4444] px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all"
            style={{
              backgroundColor: "#ef444415",
              color: "#ef4444",
              boxShadow: "3px 3px 0px 0px #ef444440",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ef4444";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ef444415";
              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
            }}
          >
            End Session
          </button>
        )}
      </div>

      {/* Player stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Concepts Unlocked"
          value={vault.length}
          valueColor="#7F77DD"
        />
        <StatCard
          label="Current Streak"
          value={`${player.streakDays}d`}
          valueColor="#FDE047"
        />
        <StatCard
          label="Events Experienced"
          value={player.totalEventsExperienced}
          valueColor="#22c55e"
        />
        <StatCard
          label="Sessions Played"
          value={totalSessions}
        />
      </div>

      {/* Active session indicator */}
      {activeSession && (
        <div
          className="border-2 border-[#22c55e] p-3 mb-6 flex items-center gap-3"
          style={{
            backgroundColor: "#22c55e10",
            boxShadow: "3px 3px 0px 0px #22c55e40",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest">
            Active session — {activeSession.eventsExperienced} events experienced
          </p>
        </div>
      )}

      {/* Leaderboards section */}
      <div className="mb-8">
        <h2
          className="font-mono font-bold text-sm uppercase tracking-widest mb-4"
          style={{ color: "#ffffff60" }}
        >
          Leaderboards
        </h2>
        <LeaderboardTabs currentPlayerId={player._id} />
      </div>

      {/* Recent sessions */}
      {recentSessions && recentSessions.length > 0 && (
        <div>
          <h2
            className="font-mono font-bold text-sm uppercase tracking-widest mb-4"
            style={{ color: "#ffffff60" }}
          >
            Recent Sessions
          </h2>
          <div className="space-y-2">
            {recentSessions.map((session) => {
              const durationMs = (session.endedAt ?? Date.now()) - session.startedAt;
              const durationMins = Math.floor(durationMs / 60_000);
              const pnl =
                session.portfolioEndValueInCents !== undefined
                  ? session.portfolioEndValueInCents - session.portfolioStartValueInCents
                  : null;
              const pnlColor = pnl === null ? "#ffffff40" : pnl >= 0 ? "#22c55e" : "#ef4444";

              return (
                <div
                  key={session._id}
                  className="border-2 border-[#ffffff20] p-3 flex items-center justify-between"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: session.active ? "#22c55e" : "#ffffff30",
                      }}
                    />
                    <div>
                      <p className="font-mono text-white text-xs">
                        {new Date(session.startedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="font-mono text-white/40 text-xs">
                        {durationMins}m · {session.eventsExperienced} events · {session.conceptsUnlocked.length} concepts
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {pnl !== null && (
                      <p
                        className="font-mono font-bold text-sm"
                        style={{ color: pnlColor }}
                      >
                        {pnl >= 0 ? "+" : ""}${(Math.abs(pnl) / 100).toFixed(2)}
                      </p>
                    )}
                    {session.debriefText && (
                      <button
                        onClick={() => setDebriefSessionId(session._id)}
                        className="font-mono text-xs underline"
                        style={{ color: "#7F77DD" }}
                      >
                        View Debrief
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
