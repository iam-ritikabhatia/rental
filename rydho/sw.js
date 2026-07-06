const CACHE_NAME = "rydho-marketing-v3";
const ASSETS = [
  "/",
  "/index.html",
  "/src/css/style.css",
  "/src/js/main.js",
  "/src/js/api.js",
  "/data.json",
  "/manifest.json",
  "/assets/icons/logo.png"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("RYDHO SW: Pre-caching offline shell files");
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event (Cleanup Old Caches)
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("RYDHO SW: Clearing old cache", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Hybrid Cache strategy)
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Network-First for HTML files to always keep content fresh, falling back to cache if offline
  if (e.request.mode === "navigate" || url.pathname.endsWith(".html")) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return caches.match("/index.html"); // Default fallback
        }))
    );
    return;
  }

  // Cache-First for static stylesheet, scripts, Google Fonts, and images
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in the background to update cache (Stale-While-Revalidate)
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        });
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
