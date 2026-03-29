const CACHE_NAME = "blkx-shell-v1";
const SHELL_ASSETS = [
  "/manifest.json",
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
      fetch(request)
        .then((response) => {
          // Cache the offline page when we successfully fetch it
          if (url.pathname === "/offline") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("/offline", clone));
          }
          return response;
        })
        .catch(() =>
          caches.match("/offline").then(
            (cached) =>
              cached ||
              new Response(
                '<html><body style="background:#0A0A0A;color:#fff;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh"><div style="text-align:center"><h1>BLK<span style="color:#7F77DD">X</span></h1><p>No connection</p><button onclick="location.reload()" style="padding:12px 24px;background:#7F77DD;color:#fff;border:2px solid #fff;cursor:pointer;font-family:monospace;font-weight:900">RETRY</button></div></body></html>',
                { headers: { "Content-Type": "text/html" } }
              )
          )
        )
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2?|ttf|ico)$/)) {
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
