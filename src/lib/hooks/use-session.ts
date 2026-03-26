"use client";

import { useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseSessionOptions {
  playerId: Id<"players"> | null | undefined;
}

interface UseSessionReturn {
  sessionId: Id<"sessions"> | null;
  eventsExperienced: number;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
}

export function useSession({ playerId }: UseSessionOptions): UseSessionReturn {
  const activeSession = useQuery(
    api.sessions.getActiveSession,
    playerId ? { playerId } : "skip"
  );

  const startSessionMutation = useMutation(api.sessions.startSession);
  const endSessionMutation = useMutation(api.sessions.endSession);

  const hasStartedRef = useRef(false);

  // Auto-start a session when a player is available and no active session exists
  useEffect(() => {
    if (!playerId) return;
    if (activeSession === undefined) return; // still loading
    if (activeSession !== null) {
      // Already have an active session — mark as started
      hasStartedRef.current = true;
      return;
    }
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;
    startSessionMutation({ playerId }).catch((err) => {
      console.error("[useSession] Failed to start session:", err);
      hasStartedRef.current = false;
    });
  }, [playerId, activeSession, startSessionMutation]);

  async function startSession(): Promise<void> {
    if (!playerId) return;
    await startSessionMutation({ playerId });
  }

  async function endSession(): Promise<void> {
    if (!playerId) return;
    await endSessionMutation({ playerId });
  }

  return {
    sessionId: activeSession?._id ?? null,
    eventsExperienced: activeSession?.eventsExperienced ?? 0,
    startSession,
    endSession,
  };
}
