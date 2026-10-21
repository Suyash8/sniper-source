"use client";

import { useEffect, useState } from "react";
import { Download, CheckCircle2, Wifi, WifiOff } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.error("[PWA] Service Worker registration failed:", error);
          });
      });
    }

    // 2. Track Online / Offline network status
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 3. Handle install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
      };

      // 4. Check if already running in standalone PWA mode
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;

      if (isStandalone) {
        setIsInstalled(true);
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      });

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Status Badge / Banner */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300 shadow-xl backdrop-blur-md">
          <WifiOff className="h-4 w-4 shrink-0 text-amber-400" />
          <span>Offline mode active — full study library & tracker available</span>
        </div>
      )}

      {/* Install App Prompt Button (when browser triggers beforeinstallprompt) */}
      {isInstallable && !isInstalled && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-md">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Install App</span>
          </button>
          <button
            onClick={() => setIsInstallable(false)}
            aria-label="Dismiss install banner"
            className="rounded-lg p-2 text-xs text-muted-foreground hover:bg-muted/60 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
