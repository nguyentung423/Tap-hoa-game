"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (error) {
      console.error("Error caught:", error.message || error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center animate-in zoom-in duration-300 delay-100">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Đã xảy ra lỗi!</h1>
        <p className="text-muted-foreground mb-6">
          Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại hoặc quay về trang chủ.
        </p>

        {process.env.NODE_ENV === "development" && error && (
          <div className="mb-6 p-4 rounded-lg bg-muted text-left">
            <p className="text-xs font-mono text-muted-foreground break-all">
              {error.message || String(error)}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-6 p-4 rounded-lg bg-card border text-left overflow-auto animate-in fade-in duration-500 delay-500">
            <p className="text-xs font-mono text-destructive">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
