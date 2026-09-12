"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if previously dismissed
    if (sessionStorage.getItem("classr_pwa_dismissed")) {
      return;
    }

    // iOS detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isApple);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If iOS and not standalone, show after a delay
    if (isApple && !(window.navigator as any).standalone) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("classr_pwa_dismissed", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="PWA Install Banner"
      className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 p-3.5 rounded-2xl bg-zinc-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="AIBA Sync"
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">
              AIBA Sync অ্যাপ ইনস্টল করুন
            </h4>
            <p className="text-xs font-medium text-slate-300">
              {isIos
                ? "Safari-তে Share (⎋) চেপে 'Add to Home Screen' দিন"
                : "ইন্টারনেট ছাড়াও ক্যাম্পাসে এক ক্লিকে রুটিন দেখুন"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isIos && deferredPrompt && (
            <button
              type="button"
              onClick={handleInstall}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ইন্সটল</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors cursor-pointer"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
