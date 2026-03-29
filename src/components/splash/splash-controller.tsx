"use client";

import { useState, useEffect, useCallback } from "react";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AnimatedSplash } from "./animated-splash";

export function SplashController({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [shouldShowSplash, setShouldShowSplash] = useState(false);
  const convex = useConvex();

  // Determine on client side whether to show splash (sessionStorage check)
  useEffect(() => {
    const alreadyShown =
      typeof window !== "undefined" &&
      sessionStorage.getItem("blkx-splash-shown") === "true";
    setShouldShowSplash(!alreadyShown);
  }, []);

  // Register service worker
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          intervalId = setInterval(() => {
            registration.update();
          }, 30 * 60 * 1000);
        })
        .catch(() => {
          // SW registration failed — app still works, just no offline support
        });
    };

    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Poll Convex connection via lightweight health ping
  useEffect(() => {
    if (!shouldShowSplash) return;

    let cancelled = false;

    const checkConnection = async () => {
      try {
        await convex.query(api.health.ping);
        if (!cancelled) setIsConnected(true);
      } catch {
        if (!cancelled) {
          setTimeout(checkConnection, 500);
        }
      }
    };

    checkConnection();

    return () => {
      cancelled = true;
    };
  }, [convex, shouldShowSplash]);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
    sessionStorage.setItem("blkx-splash-shown", "true");
  }, []);

  const splashActive = shouldShowSplash && !splashDone;

  return (
    <>
      {splashActive && (
        <AnimatedSplash
          isReady={isConnected}
          onComplete={handleSplashComplete}
        />
      )}
      <div
        style={{
          opacity: splashActive ? 0 : 1,
          transition: "opacity 0.4s ease 0.2s",
        }}
      >
        {children}
      </div>
    </>
  );
}
