const CACHE_NAME = "freshmart-v1.0.0";
const urlsToCache = [
  "/",
  "/categories",
  "/basket",
  "/wallet",
  "/more",
  "/manifest.json",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files");
        // Cache files individually to handle missing resources gracefully
        return Promise.allSettled(
          urlsToCache.map(url =>
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log("Service Worker: Installed");
        // Don't skip waiting automatically, let user decide
      }),
  );
});

// Handle skip waiting message
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("Service Worker: Skip waiting requested");
    self.skipWaiting();
  }
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      }),
  );
});

// Fetch Event - Cache First Strategy for static assets, Network First for API calls
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests with Network First strategy
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If network request succeeds, clone and cache the response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        }),
    );
    return;
  }

  // Handle other requests with Cache First strategy
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            // Cache the new response
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return fetchResponse;
          })
        );
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      }),
  );
});

// Background Sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag);

  if (event.tag === "cart-sync") {
    event.waitUntil(syncCartData());
  }
});

// Push Notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received", event);

  const options = {
    body: event.data ? event.data.text() : "New notification from FreshMart",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/",
    },
    actions: [
      {
        action: "open",
        title: "Open App",
        icon: "/icons/icon-96x96.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/icon-96x96.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("FreshMart", options));
});

// Notification Click Handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);

  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  }
});

// Helper function to sync cart data when online
async function syncCartData() {
  try {
    // Get pending cart operations from IndexedDB
    const pendingOperations = await getPendingCartOperations();

    for (const operation of pendingOperations) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(operation),
        });

        // Remove from pending operations after successful sync
        await removePendingCartOperation(operation.id);
      } catch (error) {
        console.error("Failed to sync cart operation:", error);
      }
    }
  } catch (error) {
    console.error("Failed to sync cart data:", error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingCartOperations() {
  // Implementation would use IndexedDB to get pending operations
  return [];
}

async function removePendingCartOperation(id) {
  // Implementation would use IndexedDB to remove completed operations
  return true;
}
