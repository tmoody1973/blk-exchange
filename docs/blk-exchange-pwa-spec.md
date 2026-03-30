# BLK Exchange — PWA & Animated Splash Screen Implementation Spec

**Document purpose:** This is a Claude Code implementation directive. It specifies the complete PWA configuration, animated splash screen system, mobile optimizations, and install flow for BLK Exchange. Follow this spec precisely.

---

## TABLE OF CONTENTS

1. PWA Manifest & Meta Tags
2. Service Worker Strategy
3. Animated Splash Screen Component
4. Mobile-Only Detection & Install Prompt
5. iOS-Specific PWA Fixes
6. Viewport & Layout Fixes
7. Offline Fallback Page
8. App Icons & Assets
9. Implementation Order
10. Testing Checklist

---

## 1. PWA MANIFEST & META TAGS

### 1.1 manifest.json

Create `/public/manifest.json` with these exact values:

```json
{
  "name": "BLK Exchange",
  "short_name": "BLKX",
  "description": "News moves markets. A cultural stock market simulation for financial literacy.",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0A0A0A",
  "theme_color": "#0A0A0A",
  "categories": ["education", "finance", "games"],
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-event.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Breaking event drops in real-time"
    },
    {
      "src": "/screenshots/mobile-trade.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Execute trades with a single tap"
    }
  ],
  "launch_handler": {
    "client_mode": "navigate-existing"
  }
}
```

**Critical settings explained:**
- `display: "standalone"` — removes all browser chrome (URL bar, nav buttons). The app looks native.
- `orientation: "portrait"` — locks to portrait. The trading UI doesn't need landscape.
- `background_color: "#0A0A0A"` — matches app background so the native splash (before our animated one) doesn't flash white.
- `theme_color: "#0A0A0A"` — colors the status bar on Android and the title bar in desktop PWA mode.
- `launch_handler.client_mode: "navigate-existing"` — if the app is already open and the user taps the icon, focus the existing window instead of opening a new one.

### 1.2 HTML Meta Tags

Add these to `<head>` in your root HTML file (index.html or layout):

```html
<!-- PWA Core -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0A0A0A" />

<!-- iOS PWA Support -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="BLKX" />

<!-- iOS Splash Screens (generated with correct dimensions) -->
<!-- iPhone 16 Pro Max (1320x2868) -->
<link rel="apple-touch-startup-image"
  media="screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3)"
  href="/splash/apple-splash-1320x2868.png" />
<!-- iPhone 16 Pro (1206x2622) -->
<link rel="apple-touch-startup-image"
  media="screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3)"
  href="/splash/apple-splash-1206x2622.png" />
<!-- iPhone 15 / 14 (1170x2532) -->
<link rel="apple-touch-startup-image"
  media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
  href="/splash/apple-splash-1170x2532.png" />
<!-- iPhone SE (750x1334) -->
<link rel="apple-touch-startup-image"
  media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
  href="/splash/apple-splash-750x1334.png" />

<!-- iOS Icon (separate from manifest icons) -->
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png" />

<!-- Viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />

<!-- Prevent phone number detection -->
<meta name="format-detection" content="telephone=no" />
```

**Why `black-translucent` status bar:** This makes the status bar transparent with white text, so your app content extends behind it into the safe area. This is what makes the PWA feel truly edge-to-edge on iOS.

**Why `viewport-fit=cover`:** Required for `black-translucent` to work. Without it, iOS adds a black bar at the top. Your app must then use `env(safe-area-inset-top)` to prevent content from being hidden behind the notch/Dynamic Island.

**Why `user-scalable=no`:** Prevents accidental pinch-to-zoom during gameplay, which would break the experience. The trading interface should not zoom.

---

## 2. SERVICE WORKER STRATEGY

### 2.1 Strategy Choice: Network-First with Offline Fallback

BLK Exchange is a real-time game driven by Convex WebSocket subscriptions. Caching stale game data would be harmful — you never want a player seeing yesterday's prices. The service worker's job is:
1. Cache the app shell (HTML, CSS, JS, fonts, icons) so the app loads instantly from the home screen
2. Let all API/WebSocket traffic pass through to the network
3. Show an offline fallback page when there's no connection

### 2.2 Service Worker Implementation

Create `/public/sw.js`:

```javascript
const CACHE_NAME = "blkx-shell-v1";
const SHELL_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  // CSS and JS bundles will be added dynamically
];

// Install: cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip WebSocket upgrades (Convex)
  if (request.headers.get("upgrade") === "websocket") return;

  // Skip API calls to external services (Groq, Perplexity, ElevenLabs, Clerk)
  const externalDomains = [
    "api.groq.com",
    "api.perplexity.ai",
    "api.elevenlabs.io",
    "clerk.com",
    "api.clerk.com",
    "convex.cloud",
    "convex.dev",
  ];
  if (externalDomains.some((d) => url.hostname.includes(d))) return;

  // Navigation requests: network-first, fall back to offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline"))
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2?|ttf|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        });
      })
    );
    return;
  }
});
```

### 2.3 Service Worker Registration

In your main app entry point (e.g., `main.tsx` or `_app.tsx`):

```typescript
// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[BLKX] SW registered:", registration.scope);

        // Check for updates every 30 minutes during active gameplay
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);
      })
      .catch((error) => {
        console.error("[BLKX] SW registration failed:", error);
      });
  });
}
```

### 2.4 Framework-Specific Setup

**If using Next.js:** Use `next-pwa` or `@serwist/next` package. Configure in `next.config.js`:

```javascript
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
  ],
});

module.exports = withPWA({
  // ... rest of next config
});
```

**If using Vite:** Use `vite-plugin-pwa`:

```javascript
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // we provide our own manifest.json
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "/offline",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(api\.groq|api\.perplexity|api\.elevenlabs|.*\.convex)/,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
});
```

---

## 3. ANIMATED SPLASH SCREEN COMPONENT

### 3.1 Architecture

The animated splash screen is a React component that:
1. Renders as a fixed full-screen overlay on initial app load
2. Plays a choreographed animation sequence (5 seconds total)
3. Masks the Convex WebSocket connection time
4. Performs a cinematic wipe-out transition to reveal the app
5. Only shows on **first load of a session** (not on every route change)
6. Unmounts from the DOM after completion (no lingering invisible elements)

### 3.2 Animation Sequence Timing

```
T+0.0s   Black screen (Convex starts connecting in background)
T+0.4s   Corner bracket decorations draw in (staggered, 4 corners)
T+1.0s   "BLK" letters animate up with spring easing (staggered L→R)
T+1.4s   "X" scales in from 2x with purple glow + text shadow
T+1.8s   "EXCHANGE" types out letter by letter (40ms per character)
T+2.4s   Tagline "NEWS MOVES MARKETS" fades in (50% opacity)
T+3.2s   Ticker tape starts scrolling (fictional company tickers)
T+4.2s   Connection status appears ("CONNECTING TO MARKET...")
T+5.0s   Circle-wipe transition begins (clip-path circle shrinks to 0)
T+5.6s   Splash fully gone, app content revealed, component unmounts
```

Total duration: **5.6 seconds** from load to interactive app.

If Convex connects before the animation finishes, the splash continues to play out — don't cut it short. If Convex hasn't connected by T+5.6s, extend the "CONNECTING TO MARKET..." phase until connection is established.

### 3.3 Component Implementation

```tsx
// components/AnimatedSplash.tsx

"use client";

import { useState, useEffect, useCallback } from "react";

interface AnimatedSplashProps {
  isReady: boolean; // true when Convex is connected and initial data is loaded
  onComplete: () => void; // called when splash is fully done
}

export function AnimatedSplash({ isReady, onComplete }: AnimatedSplashProps) {
  const [phase, setPhase] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),    // corner brackets
      setTimeout(() => setPhase(2), 1000),   // BLK text
      setTimeout(() => setPhase(3), 1400),   // X pulse
      setTimeout(() => setPhase(4), 1800),   // EXCHANGE typewriter
      setTimeout(() => setPhase(5), 2400),   // tagline
      setTimeout(() => setPhase(6), 3200),   // ticker tape
      setTimeout(() => setPhase(7), 4200),   // connection status
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Trigger exit when both animation is ready AND Convex is connected
  useEffect(() => {
    if (phase >= 7 && isReady) {
      const exitTimer = setTimeout(() => setPhase(8), 400);
      const unmountTimer = setTimeout(() => {
        setShouldRender(false);
        onComplete();
      }, 1000);
      return () => {
        clearTimeout(exitTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [phase, isReady, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className="splash-container"
      style={{
        clipPath: phase >= 8
          ? "circle(0% at 50% 50%)"
          : "circle(150% at 50% 50%)",
      }}
    >
      {/* Scan lines overlay for CRT texture */}
      <div className="splash-scanlines" />

      {/* Corner brackets */}
      <div className="splash-corners" data-visible={phase >= 1}>
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />
      </div>

      {/* Logo group */}
      <div className="splash-logo">
        {/* BLK letters */}
        {"BLK".split("").map((char, i) => (
          <span
            key={char}
            className="splash-letter"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${i * 80}ms`,
            }}
          >
            {char}
          </span>
        ))}

        {/* X with glow */}
        <span
          className="splash-x"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "scale(1)" : "scale(2)",
          }}
        >
          X
        </span>
      </div>

      {/* EXCHANGE typewriter */}
      <div className="splash-subtitle">
        {"EXCHANGE".split("").map((char, i) => (
          <span
            key={i}
            style={{
              opacity: phase >= 4 ? 1 : 0,
              transitionDelay: `${i * 40}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <div
        className="splash-tagline"
        style={{ opacity: phase >= 5 ? 0.5 : 0 }}
      >
        News Moves Markets
      </div>

      {/* Ticker tape */}
      <div
        className="splash-ticker"
        style={{ opacity: phase >= 6 ? 1 : 0 }}
      >
        <div className="splash-ticker-track">
          <TickerContent />
          <TickerContent /> {/* Duplicate for seamless loop */}
        </div>
      </div>

      {/* Connection status */}
      <div
        className="splash-status"
        style={{ opacity: phase >= 7 ? 1 : 0 }}
      >
        <div className="splash-status-dot" />
        <span>
          {isReady ? "CONNECTED" : "CONNECTING TO MARKET..."}
        </span>
      </div>

      {/* Version stamp */}
      <div className="splash-version">v1.0.0 · HACKONOMICS 2026</div>
    </div>
  );
}

function TickerContent() {
  const tickers = [
    { sym: "SOUL", price: "42.50", chg: "+3.2%", up: true },
    { sym: "MELN", price: "78.30", chg: "-1.1%", up: false },
    { sym: "CRWN", price: "156.00", chg: "+0.8%", up: true },
    { sym: "DAPS", price: "23.40", chg: "+5.7%", up: true },
    { sym: "RSTV", price: "91.20", chg: "-2.3%", up: false },
    { sym: "HRLM", price: "45.60", chg: "+1.9%", up: true },
    { sym: "BKST", price: "34.80", chg: "+4.1%", up: true },
    { sym: "FLVR", price: "67.90", chg: "-0.5%", up: false },
  ];

  return (
    <div className="ticker-content">
      {tickers.map((t, i) => (
        <span key={i} className="ticker-item">
          <span className="ticker-sym">{t.sym}</span>
          <span className="ticker-price">${t.price}</span>
          <span className={`ticker-chg ${t.up ? "up" : "down"}`}>
            {t.chg}
          </span>
        </span>
      ))}
    </div>
  );
}
```

### 3.4 Splash Screen CSS

```css
/* styles/splash.css */

.splash-container {
  position: fixed;
  inset: 0;
  background: #0A0A0A;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  color: #FFFFFF;
  transition: clip-path 0.6s cubic-bezier(0.77, 0, 0.175, 1);
}

/* CRT scan lines texture */
.splash-scanlines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(127, 119, 221, 0.03) 2px,
    rgba(127, 119, 221, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1;
}

/* Corner brackets */
.splash-corners {
  position: absolute;
  width: 200px;
  height: 200px;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.splash-corners[data-visible="true"] { opacity: 1; }

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
}
.corner-tl {
  top: 0; left: 0;
  border-top: 2px solid #FFFFFF;
  border-left: 2px solid #FFFFFF;
  animation: cornerFade 0.4s ease forwards;
}
.corner-tr {
  top: 0; right: 0;
  border-top: 2px solid #FFFFFF;
  border-right: 2px solid #FFFFFF;
  animation: cornerFade 0.4s ease 0.1s forwards;
}
.corner-bl {
  bottom: 0; left: 0;
  border-bottom: 2px solid #FFFFFF;
  border-left: 2px solid #FFFFFF;
  animation: cornerFade 0.4s ease 0.2s forwards;
}
.corner-br {
  bottom: 0; right: 0;
  border-bottom: 2px solid #FFFFFF;
  border-right: 2px solid #FFFFFF;
  animation: cornerFade 0.4s ease 0.3s forwards;
}

@keyframes cornerFade {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}

/* Logo */
.splash-logo {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.splash-letter {
  font-size: 64px;
  font-weight: 900;
  color: #FFFFFF;
  letter-spacing: -2px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.splash-x {
  font-size: 64px;
  font-weight: 900;
  color: #7F77DD;
  letter-spacing: -2px;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-shadow: 0 0 20px rgba(127, 119, 221, 0.5),
               0 0 40px rgba(127, 119, 221, 0.25);
}

/* EXCHANGE typewriter */
.splash-subtitle {
  display: flex;
  margin-bottom: 32px;
  position: relative;
  z-index: 2;
  height: 16px;
}
.splash-subtitle span {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 8px;
  color: #7F77DD;
  transition: opacity 0.1s ease;
}

/* Tagline */
.splash-tagline {
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 48px;
  transition: opacity 0.8s ease;
  position: relative;
  z-index: 2;
}

/* Ticker tape */
.splash-ticker {
  position: absolute;
  bottom: 120px;
  left: 0;
  right: 0;
  overflow: hidden;
  height: 24px;
  transition: opacity 0.5s ease;
  border-top: 1px solid #2A2A2A;
  border-bottom: 1px solid #2A2A2A;
}

.splash-ticker-track {
  display: flex;
  animation: tickerScroll 12s linear infinite;
  white-space: nowrap;
  padding-top: 3px;
}

.ticker-content {
  display: flex;
  gap: 32px;
  padding-right: 32px; /* gap between duplicated content */
}

.ticker-item {
  font-size: 11px;
  display: inline-flex;
  gap: 6px;
}
.ticker-sym { color: #FFFFFF; font-weight: 700; }
.ticker-price { color: #FFFFFF; opacity: 0.5; }
.ticker-chg.up { color: #4ADE80; font-weight: 700; }
.ticker-chg.down { color: #EF4444; font-weight: 700; }

@keyframes tickerScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Connection status */
.splash-status {
  position: absolute;
  bottom: 60px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.4s ease;
}

.splash-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ADE80;
  animation: statusPulse 1s ease infinite;
}

.splash-status span {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.4;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.8); }
}

/* Version */
.splash-version {
  position: absolute;
  bottom: 24px;
  font-size: 9px;
  letter-spacing: 2px;
  opacity: 0.15;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .splash-letter, .splash-x {
    font-size: 48px;
  }
  .splash-corners {
    width: 160px;
    height: 160px;
  }
  .splash-ticker {
    bottom: 100px;
  }
  .splash-status {
    bottom: 50px;
  }
}
```

### 3.5 Integration with App Root

```tsx
// app/layout.tsx or App.tsx

"use client";

import { useState, useCallback } from "react";
import { useConvex } from "convex/react";
import { AnimatedSplash } from "@/components/AnimatedSplash";

export default function AppLayout({ children }) {
  const [splashDone, setSplashDone] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const convex = useConvex();

  // Track Convex connection state
  // Convex client emits connection state — check their docs for the
  // exact API, but conceptually:
  useEffect(() => {
    // The simplest approach: try a lightweight query and mark connected
    // when it resolves
    const checkConnection = async () => {
      try {
        await convex.query(api.health.ping); // implement a simple ping query
        setIsConnected(true);
      } catch {
        setTimeout(checkConnection, 500);
      }
    };
    checkConnection();
  }, [convex]);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
    // Store in sessionStorage so splash doesn't replay on navigation
    sessionStorage.setItem("blkx-splash-shown", "true");
  }, []);

  // Skip splash if already shown this session
  const shouldShowSplash = !sessionStorage.getItem("blkx-splash-shown");

  return (
    <>
      {shouldShowSplash && !splashDone && (
        <AnimatedSplash
          isReady={isConnected}
          onComplete={handleSplashComplete}
        />
      )}
      <div style={{
        opacity: splashDone || !shouldShowSplash ? 1 : 0,
        transition: "opacity 0.4s ease 0.2s",
      }}>
        {children}
      </div>
    </>
  );
}
```

### 3.6 Convex Health Ping

```typescript
// convex/health.ts

import { query } from "./_generated/server";

export const ping = query({
  args: {},
  handler: async () => {
    return { ok: true, timestamp: Date.now() };
  },
});
```

---

## 4. MOBILE-ONLY DETECTION & INSTALL PROMPT

### 4.1 Install Prompt Component

Show an install prompt only to mobile users who are NOT already in standalone mode (i.e., they're using the browser). This prompt appears after their first event, not immediately on load.

```tsx
// components/InstallPrompt.tsx

"use client";

import { useState, useEffect } from "react";

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Don't show on desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Don't show if previously dismissed this session
    if (sessionStorage.getItem("blkx-install-dismissed")) return;

    // Detect iOS
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Android: capture beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Show prompt after a delay (let them experience the app first)
    const timer = setTimeout(() => setShowPrompt(true), 60000); // 60 seconds

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    sessionStorage.setItem("blkx-install-dismissed", "true");
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="install-prompt">
      <div className="install-prompt-inner">
        <button
          className="install-prompt-close"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          ✕
        </button>

        <div className="install-prompt-icon">
          BLK<span style={{ color: "#7F77DD" }}>X</span>
        </div>

        <div className="install-prompt-text">
          <strong>Add BLKX to Home Screen</strong>
          <span>Full-screen experience. Instant access.</span>
        </div>

        {isIOS ? (
          <div className="install-prompt-ios">
            Tap <span className="install-share-icon">⎙</span> then
            "Add to Home Screen"
          </div>
        ) : (
          <button className="install-prompt-btn" onClick={handleInstall}>
            INSTALL
          </button>
        )}
      </div>
    </div>
  );
}
```

### 4.2 Install Prompt CSS

```css
.install-prompt {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 8000;
  padding: 0 16px 16px;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.install-prompt-inner {
  background: #1A1A1A;
  border: 2px solid #FFFFFF;
  box-shadow: 4px 4px 0px #7F77DD;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: 'Courier New', monospace;
  position: relative;
}

.install-prompt-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  color: #E5E5E5;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.4;
  padding: 4px;
}

.install-prompt-icon {
  font-weight: 900;
  font-size: 18px;
  color: #FFFFFF;
  white-space: nowrap;
  font-family: 'Courier New', monospace;
}

.install-prompt-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.install-prompt-text strong {
  font-size: 13px;
  color: #FFFFFF;
}
.install-prompt-text span {
  font-size: 11px;
  color: #E5E5E5;
  opacity: 0.5;
}

.install-prompt-btn {
  padding: 8px 16px;
  background: #7F77DD;
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
  border: 2px solid #FFFFFF;
  box-shadow: 2px 2px 0px #FFFFFF;
  white-space: nowrap;
}

.install-prompt-ios {
  font-size: 11px;
  color: #E5E5E5;
  opacity: 0.7;
  text-align: right;
}

.install-share-icon {
  display: inline-block;
  font-size: 16px;
  vertical-align: middle;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

---

## 5. iOS-SPECIFIC PWA FIXES

iOS Safari's PWA support has known issues. Apply these fixes globally:

### 5.1 Global CSS Fixes

```css
/* styles/pwa-ios-fixes.css */

/* Prevent pull-to-refresh breaking the game */
html, body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

/* Handle safe areas (notch, Dynamic Island, home indicator) */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Fix the 100vh problem on mobile browsers */
html {
  height: 100%;
}
body {
  min-height: 100dvh; /* dynamic viewport height */
  min-height: -webkit-fill-available; /* iOS fallback */
}

/* Prevent text selection during gameplay (feels more app-like) */
.game-area {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

/* Prevent iOS "rubber band" bounce on fixed elements */
.fixed-header,
.fixed-footer {
  position: fixed;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* Prevent iOS zoom on input focus (buy amount input) */
input[type="number"],
input[type="text"],
select {
  font-size: 16px !important; /* iOS won't zoom if font-size >= 16px */
}

/* Smooth scrolling for scrollable content areas */
.scrollable {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}

/* Fix iOS Safari tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Status bar safe area for black-translucent */
.app-header {
  padding-top: calc(env(safe-area-inset-top) + 12px);
}
```

### 5.2 iOS Navigation Fix

iOS PWAs lose navigation state when backgrounded. Add this:

```typescript
// utils/iosNavFix.ts

export function initIOSNavFix() {
  // Detect iOS standalone mode
  const isIOSStandalone =
    (window.navigator as any).standalone === true;

  if (!isIOSStandalone) return;

  // Save current path before page unload
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("blkx-last-path", window.location.pathname);
  });

  // Restore path on load (iOS sometimes resets to start_url)
  const lastPath = sessionStorage.getItem("blkx-last-path");
  if (lastPath && lastPath !== window.location.pathname && lastPath !== "/") {
    window.history.replaceState(null, "", lastPath);
  }
}
```

### 5.3 iOS Apple Splash Screen Images

iOS requires static PNG splash images per device size. These show during the brief native load before your animated splash takes over. Generate them with this approach:

```bash
# Use pwa-asset-generator to create all required splash images
npx pwa-asset-generator \
  ./public/icons/splash-source.png \
  ./public/splash \
  --background "#0A0A0A" \
  --splash-only \
  --type png \
  --padding "20%" \
  --quality 90
```

The source image (`splash-source.png`) should be the BLKX logo (white text, purple X) on transparent background, at least 1024x1024px. The tool generates all device-specific sizes and outputs the `<link>` tags to copy into your HTML.

---

## 6. VIEWPORT & LAYOUT FIXES

### 6.1 Dynamic Viewport Height Utility

```typescript
// utils/viewport.ts

export function initViewportFix() {
  const setVH = () => {
    // Set a CSS custom property to the actual visible viewport height
    const vh = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  setVH();
  window.addEventListener("resize", setVH);
  window.visualViewport?.addEventListener("resize", setVH);

  return () => {
    window.removeEventListener("resize", setVH);
    window.visualViewport?.removeEventListener("resize", setVH);
  };
}
```

### 6.2 Usage in CSS

```css
/* Use var(--vh) instead of 100vh for full-height elements */
.full-screen {
  height: calc(var(--vh, 100vh));
}

/* Event card area should use real viewport */
.game-viewport {
  height: calc(var(--vh, 100vh) - 60px); /* minus header */
  overflow-y: auto;
}
```

### 6.3 Keyboard-Aware Layout

When the buy amount input is focused on mobile, the keyboard pushes content up. Handle this:

```typescript
// hooks/useKeyboardAware.ts

import { useState, useEffect } from "react";

export function useKeyboardAware() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const viewport = window.visualViewport!;
      const windowHeight = window.innerHeight;
      const viewportHeight = viewport.height;
      const isKeyboard = windowHeight - viewportHeight > 100;

      setKeyboardVisible(isKeyboard);
      setKeyboardHeight(isKeyboard ? windowHeight - viewportHeight : 0);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return { keyboardVisible, keyboardHeight };
}
```

```tsx
// In TradeExecutionScreen:
const { keyboardVisible } = useKeyboardAware();

return (
  <div style={{
    paddingBottom: keyboardVisible ? "20px" : "80px",
    transition: "padding-bottom 0.2s ease",
  }}>
    {/* ... trade UI ... */}
    {/* Confirm button stays above keyboard */}
    <button className="confirm-buy" style={{
      position: keyboardVisible ? "relative" : "fixed",
      bottom: keyboardVisible ? "auto" : "env(safe-area-inset-bottom, 16px)",
    }}>
      CONFIRM BUY
    </button>
  </div>
);
```

---

## 7. OFFLINE FALLBACK PAGE

### 7.1 Offline Page Component

When the player has no connection, show a branded offline page instead of a browser error:

```tsx
// app/offline/page.tsx (Next.js) or pages/offline.tsx

export default function OfflinePage() {
  return (
    <div className="offline-page">
      <div className="offline-content">
        <div className="offline-logo">
          BLK<span className="offline-x">X</span>
        </div>
        <div className="offline-icon">📡</div>
        <h1 className="offline-title">MARKET CLOSED</h1>
        <p className="offline-message">
          No connection detected. BLK Exchange requires
          an active internet connection to stream live events
          and market data.
        </p>
        <button
          className="offline-retry"
          onClick={() => window.location.reload()}
        >
          ↻ RETRY CONNECTION
        </button>
      </div>
    </div>
  );
}
```

### 7.2 Offline Page CSS

```css
.offline-page {
  min-height: 100dvh;
  background: #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  color: #FFFFFF;
  padding: 20px;
}

.offline-content {
  text-align: center;
  max-width: 360px;
}

.offline-logo {
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 32px;
}

.offline-x { color: #7F77DD; }

.offline-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.offline-title {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 3px;
  margin-bottom: 12px;
}

.offline-message {
  font-size: 13px;
  line-height: 1.6;
  color: #E5E5E5;
  opacity: 0.6;
  margin-bottom: 32px;
}

.offline-retry {
  padding: 12px 24px;
  background: #7F77DD;
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
  border: 2px solid #FFFFFF;
  box-shadow: 4px 4px 0px #FFFFFF;
}
```

---

## 8. APP ICONS & ASSETS

### 8.1 Icon Requirements

Generate these from a 1024x1024 source icon:

```
/public/icons/
  icon-192.png          — 192x192, standard icon (required by manifest)
  icon-512.png          — 512x512, standard icon (required by manifest)
  icon-maskable-192.png — 192x192, with safe zone padding (maskable)
  icon-maskable-512.png — 512x512, with safe zone padding (maskable)
  apple-touch-icon-180.png — 180x180, iOS home screen icon
  favicon-32.png        — 32x32, browser tab favicon
  favicon-16.png        — 16x16, browser tab favicon

/public/splash/
  apple-splash-*.png    — iOS launch images (generated per device)

/public/screenshots/
  mobile-event.png      — 1080x1920, App screenshot for manifest
  mobile-trade.png      — 1080x1920, App screenshot for manifest
```

### 8.2 Icon Design Spec

The BLKX app icon should be:
- Background: `#0A0A0A` (solid black)
- Foreground: "BLKX" in Courier New bold, centered
- "BLK" in white, "X" in `#7F77DD` purple
- Neobrutalism white border around the text block with 4px offset shadow
- For maskable icons: ensure the logo fits within the 80% safe zone circle

### 8.3 Favicon in HTML

```html
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
```

---

## 9. IMPLEMENTATION ORDER

Build in this exact sequence:

```
PHASE 1: PWA Foundation (do this FIRST)
  1. Create manifest.json with all required fields
  2. Add all meta tags to root HTML
  3. Create app icons (at minimum: 192, 512, apple-touch-icon-180)
  4. Implement service worker (sw.js)
  5. Register service worker in app entry
  6. Create offline fallback page (/offline)
  7. Test: Chrome DevTools → Application → Manifest shows valid
  8. Test: Lighthouse PWA audit passes

PHASE 2: Mobile Viewport Fixes
  9.  Add iOS PWA CSS fixes (overscroll, safe areas, tap highlight)
  10. Implement viewport height fix utility (--vh custom property)
  11. Apply 100dvh / var(--vh) to all full-screen layouts
  12. Fix input font-size to 16px to prevent iOS zoom
  13. Add keyboard-aware layout hook for trade screens
  14. Test on iPhone Safari: no rubber-banding, no zoom on input

PHASE 3: Animated Splash Screen
  15. Build AnimatedSplash component with all 9 phases
  16. Add splash CSS with all animations
  17. Create Convex health.ping query
  18. Integrate splash into app root with Convex connection tracking
  19. Add sessionStorage check so splash only plays once per session
  20. Test: splash plays → Convex connects → wipe reveals app

PHASE 4: Install Experience
  21. Build InstallPrompt component (Android + iOS paths)
  22. Add install prompt CSS
  23. Wire trigger: show after 60 seconds of gameplay
  24. Generate iOS apple-touch-startup-image PNGs
  25. Add all apple-touch-startup-image link tags to HTML
  26. Implement iOS navigation fix (sessionStorage path restore)
  27. Test: Add to Home Screen on iOS → launches in standalone

PHASE 5: Polish & Verify
  28. Run Lighthouse PWA audit — fix any remaining issues
  29. Test full flow on Android Chrome (install → splash → gameplay)
  30. Test full flow on iOS Safari (install → splash → gameplay)
  31. Test offline: airplane mode → offline page shows → reconnect works
  32. Test Convex reconnection after phone sleep/wake cycle
  33. Verify splash doesn't replay on route navigation
  34. Verify splash extends if Convex is slow to connect
```

---

## 10. TESTING CHECKLIST

### 10.1 PWA Validation

Run Chrome DevTools → Application tab and verify:
- [ ] Manifest loads with no errors
- [ ] Service worker is registered and active
- [ ] All icons are accessible
- [ ] "Install app" option appears in Chrome menu (Android)

Run Lighthouse → PWA audit:
- [ ] Installable: Yes
- [ ] PWA Optimized: all checks pass
- [ ] No manifest warnings

### 10.2 iOS Testing

- [ ] `apple-mobile-web-app-capable` works (launches without Safari chrome)
- [ ] Status bar is `black-translucent` (content extends behind status bar)
- [ ] Safe area insets are respected (content not hidden behind notch)
- [ ] Pull-to-refresh is disabled (`overscroll-behavior: none`)
- [ ] Input focus doesn't zoom the page (font-size >= 16px)
- [ ] Home screen icon uses apple-touch-icon, not a screenshot
- [ ] Static splash image shows during native load
- [ ] Animated splash plays after static splash
- [ ] App survives background → foreground cycle without breaking

### 10.3 Android Testing

- [ ] Install banner appears or Chrome menu shows "Install app"
- [ ] Installed app has correct name and icon on home screen
- [ ] App launches in standalone mode (no browser chrome)
- [ ] Theme color applies to status bar and task switcher
- [ ] Back button navigates within app, doesn't exit

### 10.4 Gameplay Flow

- [ ] Splash plays on first visit, not on subsequent navigations
- [ ] Splash waits for Convex connection before exit transition
- [ ] Event countdown timer works after splash completes
- [ ] Trade execution works (buy amount → confirm → result)
- [ ] Glossary chips are tappable on mobile (44px touch target)
- [ ] Popover definitions don't overflow screen edges on mobile
- [ ] Knowledge Vault counter updates in real-time

### 10.5 Edge Cases

- [ ] Slow connection: splash extends "CONNECTING..." phase
- [ ] Lost connection mid-game: Convex reconnects, UI recovers
- [ ] Airplane mode: offline page shows with retry button
- [ ] Phone locked/unlocked during event: timer state preserved
- [ ] Multiple tabs: only one active session (launch_handler)

---

## 11. DESIGN TOKENS REFERENCE

```typescript
const PWA_TOKENS = {
  manifest: {
    backgroundColor: "#0A0A0A",
    themeColor: "#0A0A0A",
    display: "standalone",
    orientation: "portrait",
  },
  splash: {
    duration: 5600,           // total ms
    exitTransition: 600,      // circle-wipe ms
    tickerSpeed: 12000,       // ticker scroll ms per loop
    cornerDrawSpeed: 400,     // corner bracket animation ms
    letterStagger: 80,        // ms between BLK letters
    typewriterSpeed: 40,      // ms between EXCHANGE letters
  },
  mobile: {
    minTouchTarget: 44,       // px, minimum tap area
    inputMinFontSize: 16,     // px, prevents iOS zoom
    headerSafeArea: "env(safe-area-inset-top)",
    bottomSafeArea: "env(safe-area-inset-bottom)",
  },
};
```
