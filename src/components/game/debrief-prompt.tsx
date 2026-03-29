"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

const DEBRIEF_DISMISSED_KEY = "blk-exchange-debrief-dismissed-at";
const DISMISS_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const MIN_SESSION_MINUTES = 45;
const MIN_EVENTS = 5;

interface DebriefPromptProps {
  sessionStartedAt: number | null;
  eventsExperienced: number;
  sessionId: Id<"sessions"> | null;
  onRequestDebrief: () => Promise<void>;
}

export function DebriefPrompt({
  sessionStartedAt,
  eventsExperienced,
  sessionId,
  onRequestDebrief,
}: DebriefPromptProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasShownRef = useRef(false);

  // Periodic timer so the 45-min check works even if no events fire
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sessionStartedAt || !sessionId) return;
    if (hasShownRef.current) return;

    const sessionMins = (Date.now() - sessionStartedAt) / 60_000;
    const shouldPrompt =
      sessionMins >= MIN_SESSION_MINUTES || eventsExperienced >= MIN_EVENTS;

    if (!shouldPrompt) return;

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem(DEBRIEF_DISMISSED_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS) {
      return;
    }

    hasShownRef.current = true;
    setVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStartedAt, eventsExperienced, sessionId, tick]);

  if (!visible) return null;

  const sessionMins = sessionStartedAt
    ? Math.floor((Date.now() - sessionStartedAt) / 60_000)
    : 0;

  const handleDismiss = () => {
    localStorage.setItem(DEBRIEF_DISMISSED_KEY, String(Date.now()));
    setVisible(false);
    hasShownRef.current = false;
  };

  const handleDebrief = async () => {
    setLoading(true);
    try {
      await onRequestDebrief();
      setVisible(false);
      // Store session ID so profile page auto-shows the debrief
      if (sessionId) {
        localStorage.setItem("blk-exchange-pending-debrief", sessionId);
      }
      router.push("/profile");
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleDismiss} />
      <div
        className="relative z-10 w-full max-w-sm border-2 border-white bg-[#1a1a1a] p-6"
        style={{ boxShadow: "6px 6px 0px 0px #7F77DD" }}
      >
        <h2 className="font-mono font-bold text-white text-lg mb-2">
          Ready for your debrief?
        </h2>
        <p className="font-mono text-white/60 text-sm mb-6">
          You&apos;ve been trading for {sessionMins} minutes and experienced{" "}
          {eventsExperienced} events. Claude will write a personalized narrative
          about your session.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDebrief}
            disabled={loading}
            className="flex-1 font-mono text-sm font-bold py-2.5 border-2 border-white bg-[#7F77DD] text-white transition-transform hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: loading ? "none" : "3px 3px 0px 0px #ffffff" }}
          >
            {loading ? "Generating..." : "Get My Debrief"}
          </button>
          <button
            onClick={handleDismiss}
            disabled={loading}
            className="flex-1 font-mono text-sm py-2.5 border-2 border-white/30 text-white/60 hover:text-white hover:border-white transition-colors disabled:opacity-50"
          >
            Keep Trading
          </button>
        </div>
      </div>
    </div>
  );
}
