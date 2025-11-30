"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone, Share2 } from "lucide-react";
import { Button } from "@/components/ui";
import { usePWA } from "@/hooks/use-pwa";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function InstallPWAPrompt() {
  const { isInstallable, isInstalled, install } = usePWA();
  const [dismissed, setDismissed] = useLocalStorage(
    "pwa-prompt-dismissed",
    false
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show prompt after 10 seconds if installable and not dismissed
    const timer = setTimeout(() => {
      if (isInstallable && !dismissed && !isInstalled) {
        setShow(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isInstallable, dismissed, isInstalled]);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setShow(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:w-80"
      >
        <div className="glass-card p-4 rounded-xl border border-primary/30 shadow-lg shadow-primary/20">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-primary-foreground" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold mb-1">Cài đặt Tạp hoá game</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Thêm vào màn hình để truy cập nhanh hơn
              </p>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleInstall} className="gap-1">
                  <Download className="w-3 h-3" />
                  Cài đặt
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  Để sau
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
