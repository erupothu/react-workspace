import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, X } from "lucide-react";

function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] =
    useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setWaitingWorker(newWorker);
                  setShowUpdate(true);
                }
              });
            }
          });

          // Check if there's already a waiting worker
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowUpdate(true);
          }
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      waitingWorker.addEventListener("statechange", (e) => {
        const target = e.target as ServiceWorker;
        if (target.state === "activated") {
          window.location.reload();
        }
      });
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Show again in 24 hours
    setTimeout(
      () => {
        setShowUpdate(true);
      },
      24 * 60 * 60 * 1000,
    );
  };

  if (!showUpdate) return null;

  return (
    <Card className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 border-fresh-200 shadow-lg bg-fresh-50 border-fresh-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-fresh-600" />
            <h3 className="font-semibold text-fresh-700">Update Available</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="p-1 h-auto text-fresh-600 hover:text-fresh-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-fresh-600 mb-4">
          A new version of FreshMart is available with improved features and bug
          fixes.
        </p>

        <div className="flex space-x-2">
          <Button
            onClick={handleUpdate}
            className="flex-1 bg-fresh-600 hover:bg-fresh-700 text-sm h-9"
          >
            Update Now
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="border-fresh-300 text-fresh-600 hover:bg-fresh-50 text-sm h-9"
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PWAUpdateNotification;
