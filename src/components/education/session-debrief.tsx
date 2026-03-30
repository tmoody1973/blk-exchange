"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import ReactMarkdown from "react-markdown";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SessionDebriefProps {
  sessionId: Id<"sessions">;
  onStartNewSession: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60_000);
  const secs = Math.floor((ms % 60_000) / 1000);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatPnl(cents: number): string {
  const sign = cents >= 0 ? "+" : "-";
  const abs = Math.abs(cents);
  return `${sign}$${(abs / 100).toFixed(2)}`;
}

function formatValue(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DebriefSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-4 rounded"
          style={{
            backgroundColor: "#ffffff15",
            width: i % 3 === 0 ? "60%" : i % 2 === 0 ? "85%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

// ─── Stat badge ───────────────────────────────────────────────────────────────

function StatBadge({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      className="border-2 border-[#ffffff40] p-3 flex flex-col gap-1"
      style={{ backgroundColor: "#111111" }}
    >
      <span className="font-mono text-xs text-white/40 uppercase tracking-widest">{label}</span>
      <span
        className="font-mono font-bold text-lg"
        style={{ color: valueColor ?? "#ffffff" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── SessionDebrief ───────────────────────────────────────────────────────────

export function SessionDebrief({ sessionId, onStartNewSession }: SessionDebriefProps) {
  const session = useQuery(api.sessions.getSessionById, { sessionId });
  const [isVisible, setIsVisible] = useState(false);

  // Animate in
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  if (session === undefined) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0e0e]">
        <p className="font-mono text-white/30 text-sm animate-pulse">Loading session...</p>
      </div>
    );
  }

  if (session === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0e0e]">
        <p className="font-mono text-white/30 text-sm">Session not found.</p>
      </div>
    );
  }

  const durationMs = (session.endedAt ?? Date.now()) - session.startedAt;
  const startValue = session.portfolioStartValueInCents;
  const endValue = session.portfolioEndValueInCents ?? startValue;
  const pnlCents = endValue - startValue;
  const pnlPercent =
    startValue > 0 ? ((pnlCents / startValue) * 100).toFixed(2) : "0.00";
  const pnlColor = pnlCents >= 0 ? "#22c55e" : "#ef4444";
  const hasDebrief = !!session.debriefText;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        backgroundColor: "#0e0e0e",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div className="min-h-screen flex flex-col">
        {/* Header bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b-2"
          style={{ backgroundColor: "#0e0e0e", borderColor: "#7F77DD" }}
        >
          <div>
            <h1
              className="font-mono font-bold text-sm uppercase tracking-widest"
              style={{ color: "#7F77DD" }}
            >
              Session Complete
            </h1>
            <p className="font-mono text-white/30 text-xs">{formatDuration(durationMs)} session</p>
          </div>
          <div
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: pnlColor }}
          >
            {formatPnl(pnlCents)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 max-w-2xl mx-auto w-full">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
            <StatBadge label="Duration" value={formatDuration(durationMs)} />
            <StatBadge
              label="P&L"
              value={`${formatPnl(pnlCents)} (${pnlCents >= 0 ? "+" : ""}${pnlPercent}%)`}
              valueColor={pnlColor}
            />
            <StatBadge
              label="Events"
              value={`${session.eventsExperienced}`}
              valueColor="#FDE047"
            />
            <StatBadge
              label="Concepts"
              value={`${session.conceptsUnlocked.length} new`}
              valueColor="#7F77DD"
            />
          </div>

          {/* Portfolio values */}
          <div
            className="border-2 border-[#ffffff30] p-4 mb-6 flex items-center justify-between"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <div>
              <p className="font-mono text-xs text-white/30 uppercase tracking-widest">Start</p>
              <p className="font-mono text-white font-bold">{formatValue(startValue)}</p>
            </div>
            <div className="font-mono text-white/20 text-lg">→</div>
            <div className="text-right">
              <p className="font-mono text-xs text-white/30 uppercase tracking-widest">End</p>
              <p className="font-mono font-bold" style={{ color: endValue >= startValue ? "#22c55e" : "#ef4444" }}>
                {formatValue(endValue)}
              </p>
            </div>
          </div>

          {/* Claude debrief narrative */}
          <div
            className="border-2 border-[#7F77DD] p-6 mb-6"
            style={{
              backgroundColor: "#1a1a1a",
              boxShadow: "4px 4px 0px 0px #7F77DD",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#7F77DD" }}
              />
              <h2
                className="font-mono text-xs font-bold uppercase tracking-widest"
                style={{ color: "#7F77DD" }}
              >
                Session Debrief
              </h2>
            </div>

            {hasDebrief ? (
              <div className="font-mono text-sm leading-relaxed debrief-markdown">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold text-white mb-3 mt-4 first:mt-0 border-b border-[#7F77DD]/30 pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold text-white mb-2 mt-4 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-bold text-[#FDE047] mb-2 mt-3 uppercase tracking-wider">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-white/80 mb-3 leading-relaxed">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-bold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="text-[#7F77DD] not-italic font-bold">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-1.5 mb-3 ml-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-1.5 mb-3 ml-1 list-decimal list-inside">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-white/70 flex gap-2">
                        <span className="text-[#7F77DD] flex-shrink-0">•</span>
                        <span>{children}</span>
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#7F77DD] pl-4 my-3 text-white/60 italic">
                        {children}
                      </blockquote>
                    ),
                    hr: () => (
                      <hr className="border-white/10 my-4" />
                    ),
                  }}
                >
                  {session.debriefText ?? ""}
                </ReactMarkdown>
              </div>
            ) : (
              <div>
                <p className="font-mono text-white/40 text-xs mb-4">
                  Generating your personalized debrief...
                </p>
                <DebriefSkeleton />
              </div>
            )}
          </div>

          {/* Concepts unlocked this session */}
          {session.conceptsUnlocked.length > 0 && (
            <div
              className="border-2 border-[#FDE047] p-4 mb-6"
              style={{
                backgroundColor: "#1a1a1a",
                boxShadow: "3px 3px 0px 0px #FDE047",
              }}
            >
              <h3
                className="font-mono text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#FDE047" }}
              >
                Concepts Unlocked This Session
              </h3>
              <div className="flex flex-wrap gap-2">
                {session.conceptsUnlocked.map((conceptId) => (
                  <span
                    key={conceptId}
                    className="font-mono text-xs border px-2 py-1 uppercase tracking-wider"
                    style={{
                      borderColor: "#FDE04760",
                      color: "#FDE047",
                      backgroundColor: "#FDE04710",
                    }}
                  >
                    {conceptId.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onStartNewSession}
            className="w-full border-2 border-[#7F77DD] py-4 font-mono font-bold text-sm uppercase tracking-widest transition-all active:translate-y-0.5"
            style={{
              backgroundColor: "#7F77DD",
              color: "#0e0e0e",
              boxShadow: "4px 4px 0px 0px #ffffff",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px 0px #ffffff";
              (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px 0px #ffffff";
              (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
            }}
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
}
