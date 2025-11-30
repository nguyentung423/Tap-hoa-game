"use client";

import { useState, useCallback } from "react";

interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard({ timeout = 2000 }: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        setTimeout(() => {
          setCopied(false);
        }, timeout);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to copy"));
        setCopied(false);
      }
    },
    [timeout]
  );

  return { copy, copied, error };
}
