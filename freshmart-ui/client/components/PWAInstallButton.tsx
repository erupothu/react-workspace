import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, X, Share } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallButtonProps {
  variant?: "default" | "hero" | "floating";
  className?: string;
  children?: React.ReactNode;
}

export function PWAInstallButton({
  variant = "default",
  className,
  children,
}: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

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
      setCanInstall(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("PWA: App was installed");
      setShowModal(false);
      setDeferredPrompt(null);
      setCanInstall(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // For iOS, we can always show the install option
    if (iOS && !standalone) {
      setCanInstall(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS install instructions
      setShowModal(true);
      return;
    }

    if (!deferredPrompt) {
      setShowModal(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`PWA: User response to install prompt: ${outcome}`);

      if (outcome === "accepted") {
        console.log("PWA: User accepted the install prompt");
      } else {
        console.log("PWA: User dismissed the install prompt");
      }

      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error("PWA: Error during install prompt:", error);
      setShowModal(true);
    }
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  const buttonContent = children || (
    <>
      <Download className="w-4 h-4 mr-2" />
      Install App
    </>
  );

  const buttonClasses = cn(
    "transition-all duration-200",
    {
      "bg-fresh-500 hover:bg-fresh-600 text-white shadow-lg hover:shadow-xl":
        variant === "hero",
      "bg-primary hover:bg-primary/90": variant === "default",
      "fixed bottom-20 md:bottom-4 right-4 z-50 shadow-lg":
        variant === "floating",
    },
    className,
  );

  return (
    <>
      <Button
        onClick={handleInstallClick}
        className={buttonClasses}
        size={variant === "hero" ? "lg" : "default"}
      >
        {buttonContent}
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {isIOS ? (
                    <Smartphone className="w-5 h-5 text-fresh-600" />
                  ) : (
                    <Download className="w-5 h-5 text-fresh-600" />
                  )}
                  <span>Install FreshMart App</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get the best shopping experience with our mobile app!
              </p>

              {isIOS ? (
                <div className="space-y-3">
                  <div className="bg-fresh-50 p-4 rounded-lg">
                    <h4 className="font-medium text-fresh-700 mb-2">
                      For iPhone/iPad:
                    </h4>
                    <ol className="text-sm space-y-1 text-fresh-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-5 h-5 bg-fresh-200 rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>
                          Tap the Share button{" "}
                          <Share className="w-4 h-4 inline" /> in Safari
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-5 h-5 bg-fresh-200 rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <span>Scroll down and tap "Add to Home Screen"</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-5 h-5 bg-fresh-200 rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <span>Tap "Add" to install</span>
                      </li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-fresh-50 p-4 rounded-lg">
                    <h4 className="font-medium text-fresh-700 mb-2">
                      For Android/Chrome:
                    </h4>
                    <ol className="text-sm space-y-1 text-fresh-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-5 h-5 bg-fresh-200 rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>Tap the menu (⋮) in your browser</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-5 h-5 bg-fresh-200 rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <span>Select "Add to Home screen" or "Install app"</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-5 h-5 bg-fresh-200 rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <span>Tap "Install" to confirm</span>
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Benefits:</strong> Faster loading, offline access, push
                  notifications, and home screen shortcut!
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Maybe Later
                </Button>
                <Button
                  className="bg-fresh-500 hover:bg-fresh-600"
                  onClick={() => setShowModal(false)}
                >
                  Got it!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default PWAInstallButton;
