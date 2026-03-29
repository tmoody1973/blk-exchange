"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type MarketAlertEvent = {
  _id: string;
  headline: string;
  source: string;
  sourceType: "fictional" | "real";
  sourceUrl?: string;
  affectedStocks: { symbol: string; changePercent: number }[];
  conceptTaught?: string;
  commentary?: string;
  timestamp: number;
};

type UseMarketAlertReturn = {
  alert: MarketAlertEvent | null;
  isVisible: boolean;
  dismiss: () => void;
};

const ALERT_DURATION_MS = 15_000;

export function useMarketAlert(onNewEvent?: () => void): UseMarketAlertReturn {
  const latestEvent = useQuery(api.events.getLatestFiredEvent);
  const lastSeenIdRef = useRef<string | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onNewEventRef = useRef(onNewEvent);
  onNewEventRef.current = onNewEvent;

  const [alert, setAlert] = useState<MarketAlertEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!latestEvent) return;

    const eventId = latestEvent._id as string;

    // If this is a new event we haven't shown yet
    if (eventId !== lastSeenIdRef.current) {
      lastSeenIdRef.current = eventId;

      const alertData: MarketAlertEvent = {
        _id: eventId,
        headline: latestEvent.headline,
        source: latestEvent.source,
        sourceType: latestEvent.sourceType,
        sourceUrl: latestEvent.sourceUrl,
        affectedStocks: latestEvent.affectedStocks,
        conceptTaught: latestEvent.conceptTaught,
        commentary: latestEvent.commentary,
        timestamp: latestEvent.timestamp,
      };

      setAlert(alertData);
      setIsVisible(true);

      // Notify parent that a new event was seen (for session tracking)
      onNewEventRef.current?.();

      // Fire TTS in background — non-blocking
      void playAlertTTS(latestEvent.headline);

      // Auto-dismiss after 15s
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      dismissTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, ALERT_DURATION_MS);
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestEvent]);

  function dismiss() {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setIsVisible(false);
  }

  return { alert, isVisible, dismiss };
}

async function playAlertTTS(text: string): Promise<void> {
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.warn("[MarketAlert] TTS request failed:", response.status);
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.addEventListener("ended", () => URL.revokeObjectURL(audioUrl));
    audio.addEventListener("error", () => {
      console.warn("[MarketAlert] Audio playback error");
      URL.revokeObjectURL(audioUrl);
    });

    await audio.play();
  } catch (err) {
    // TTS is non-critical — log and continue silently
    console.warn("[MarketAlert] TTS playback skipped:", err);
  }
}
