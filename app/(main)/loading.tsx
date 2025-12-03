"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>

        <p className="text-muted-foreground text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
          Đang tải...
        </p>
      </div>
    </div>
  );
}
