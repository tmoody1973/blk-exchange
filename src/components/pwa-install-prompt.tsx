"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Check if previously dismissed
    if (sessionStorage.getItem("blkx-install-dismissed")) {
      setDismissed(true);
    }

    // Detect iOS (no beforeinstallprompt support)
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(ios);

    // Listen for the install prompt event (Chrome/Edge/Samsung)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    sessionStorage.setItem("blkx-install-dismissed", "true");
  }, []);

  // Don't show if already installed, dismissed, or no prompt available (and not iOS)
  if (isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIos) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 9999,
        background: "#1A1A1A",
        border: "2px solid #FFFFFF",
        boxShadow: "4px 4px 0px #7F77DD",
        padding: "16px 20px",
        fontFamily: "'Courier New', monospace",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: 420,
        marginInline: "auto",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: 4,
          }}
        >
          Install BLK Exchange
        </div>
        <div style={{ fontSize: "11px", opacity: 0.7, lineHeight: 1.4 }}>
          {isIos
            ? "Tap Share ↑ then \"Add to Home Screen\""
            : "Add to your home screen for the full experience"}
        </div>
      </div>

      {!isIos && (
        <button
          onClick={handleInstall}
          style={{
            padding: "10px 16px",
            background: "#7F77DD",
            color: "#FFFFFF",
            fontFamily: "'Courier New', monospace",
            fontSize: "11px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "1px",
            cursor: "pointer",
            border: "2px solid #FFFFFF",
            boxShadow: "2px 2px 0px #FFFFFF",
            whiteSpace: "nowrap",
          }}
        >
          Install
        </button>
      )}

      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: "#FFFFFF",
          opacity: 0.5,
          cursor: "pointer",
          fontSize: "18px",
          padding: "4px",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}
