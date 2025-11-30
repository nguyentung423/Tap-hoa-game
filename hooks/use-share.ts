"use client";

import { useCallback } from "react";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export function useShare() {
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  const share = useCallback(
    async (data: ShareData) => {
      if (canShare) {
        try {
          await navigator.share(data);
          return { success: true };
        } catch (error) {
          // User cancelled or share failed
          return { success: false, error };
        }
      } else {
        // Fallback: copy URL to clipboard
        if (data.url) {
          try {
            await navigator.clipboard.writeText(data.url);
            return { success: true, fallback: "clipboard" };
          } catch (error) {
            return { success: false, error };
          }
        }
        return { success: false, error: new Error("No URL provided") };
      }
    },
    [canShare]
  );

  return { share, canShare };
}
