// PWA Service Worker Registration and Utilities

export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if ("serviceWorker" in navigator) {
      try {
        console.log("PWA: Registering service worker...");
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log(
          "PWA: Service worker registered successfully:",
          registration,
        );

        // Check for updates
        registration.addEventListener("updatefound", () => {
          console.log("PWA: New service worker available");
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("PWA: New content available, please refresh");
                // You can show a notification to user here
                showUpdateAvailable();
              }
            });
          }
        });

        return registration;
      } catch (error) {
        console.error("PWA: Service worker registration failed:", error);
        return null;
      }
    } else {
      console.log("PWA: Service workers not supported");
      return null;
    }
  };

export const showUpdateAvailable = () => {
  // Create a toast or notification to inform user about update
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("FreshMart Update Available", {
      body: "A new version of the app is available. Refresh to update.",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      tag: "app-update",
    });
  }
};

export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      console.log("PWA: Notification permission:", permission);
      return permission;
    }
    return "denied";
  };

export const subscribeToPushNotifications = async (
  registration: ServiceWorkerRegistration,
) => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array("your-public-vapid-key-here"), // Replace with your VAPID key
    });

    console.log("PWA: Push subscription successful:", subscription);

    // Send subscription to your server
    await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error("PWA: Push subscription failed:", error);
    return null;
  }
};

export const checkIfInstalled = (): boolean => {
  // Check if app is running in standalone mode
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes("android-app://")
  );
};

export const getInstallPromptEvent = (): Promise<any> => {
  return new Promise((resolve) => {
    let deferredPrompt: any;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      resolve(deferredPrompt);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt, {
      once: true,
    });

    // Timeout after 5 seconds if no prompt event
    setTimeout(() => {
      if (!deferredPrompt) {
        resolve(null);
      }
    }, 5000);
  });
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Offline detection
export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const onConnectionChange = (callback: (online: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};

// Cache management
export const clearAppCache = async (): Promise<void> => {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log("PWA: App cache cleared");
  }
};

// App version checking
export const checkForAppUpdate = async (): Promise<boolean> => {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return registration.waiting !== null;
    }
  }
  return false;
};
