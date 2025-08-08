import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Smartphone, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (running in standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("PWA: beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show install banner if not already installed
      if (!standalone) {
        setShowInstallBanner(true);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("PWA: App was installed");
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    // Listen for manual install trigger
    const handleManualInstallRequest = () => {
      console.log("PWA: Manual install requested");
      if (deferredPrompt) {
        setShowInstallBanner(true);
      } else if (isIOS && !isStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("pwa-install-request", handleManualInstallRequest);

    // Check if user has previously dismissed the install prompt
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissed =
        (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

      // Show again after 3 days (reduced from 7)
      if (daysSinceDismissed < 3) {
        setShowInstallBanner(false);
      }
    }

    // Auto-show banner after 10 seconds if conditions are met
    const timer = setTimeout(() => {
      if (!standalone && (deferredPrompt || isIOS) && !dismissed) {
        setShowInstallBanner(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
    };

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener(
        "pwa-install-request",
        handleManualInstallRequest,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`PWA: User response to install prompt: ${outcome}`);

      if (outcome === "accepted") {
        console.log("PWA: User accepted the install prompt");
      } else {
        console.log("PWA: User dismissed the install prompt");
        localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
      }

      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } catch (error) {
      console.error("PWA: Error during install prompt:", error);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
  };

  // Don't show if already installed
  if (isStandalone || !showInstallBanner) {
    return null;
  }

  // iOS Install Instructions
  if (isIOS && !isStandalone) {
    return (
      <Card className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 border-fresh-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-fresh-600" />
              <h3 className="font-semibold text-fresh-700">
                Install FreshMart
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            Install our app for a better shopping experience!
          </p>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>📱 Tap the Share button below</p>
            <p>➕ Then tap "Add to Home Screen"</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Android/Chrome Install Prompt
  return (
    <Card className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 border-fresh-200 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-fresh-600" />
            <h3 className="font-semibold text-fresh-700">Install FreshMart</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Install our app for faster shopping, offline access, and push
          notifications!
        </p>

        <div className="flex space-x-2">
          <Button
            onClick={handleInstallClick}
            className="flex-1 bg-fresh-500 hover:bg-fresh-600 text-sm"
          >
            Install App
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="border-fresh-300 text-fresh-600 text-sm"
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PWAInstall;
