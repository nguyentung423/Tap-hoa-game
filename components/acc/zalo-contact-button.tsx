"use client";

import { MessageCircle, Phone } from "lucide-react";
import { cn, getZaloDeepLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ZaloContactButtonProps {
  phone: string;
  message?: string;
  variant?: "default" | "floating" | "sticky";
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function ZaloContactButton({
  phone,
  message = "",
  variant = "default",
  className,
  size = "default",
}: ZaloContactButtonProps) {
  const zaloLink = getZaloDeepLink(phone, message);

  const handleClick = () => {
    window.open(zaloLink, "_blank");
  };

  if (variant === "floating") {
    return (
      <button
        onClick={handleClick}
        className={cn("floating-button zalo", className)}
        aria-label="Liên hệ Zalo"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
        >
          <path
            d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0zm9.654 31.252c-.18.36-.72.66-1.14.78-.42.12-.78.12-1.38-.12-.6-.24-2.4-1.14-4.38-3.18-1.56-1.62-2.58-3.6-2.88-4.2-.3-.6 0-.9.24-1.2.24-.24.48-.6.72-.9.24-.3.3-.48.48-.78.18-.3.06-.6-.06-.84-.12-.24-1.14-2.7-1.56-3.72-.42-1.02-.84-.9-1.14-.9h-.96c-.3 0-.84.12-1.26.6-.42.48-1.68 1.62-1.68 4.02s1.74 4.68 1.98 5.01c.24.3 3.36 5.34 8.28 7.26 1.14.48 2.04.72 2.76.96 1.14.36 2.16.3 2.98.18.9-.12 2.82-1.14 3.24-2.28.42-1.14.42-2.1.3-2.28-.12-.24-.42-.36-.84-.6z"
            fill="white"
          />
        </svg>
      </button>
    );
  }

  if (variant === "sticky") {
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-dark/95 p-4 backdrop-blur-xl",
          "safe-area-bottom",
          className
        )}
      >
        <Button
          variant="zalo"
          size="lg"
          onClick={handleClick}
          className="w-full gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          Liên hệ Zalo ngay
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="zalo"
      size={size}
      onClick={handleClick}
      className={cn("gap-2", className)}
    >
      <MessageCircle className="h-5 w-5" />
      Liên hệ Zalo
    </Button>
  );
}

export function FloatingZaloButton({ phone }: { phone: string }) {
  const handleClick = () => {
    window.open(`https://zalo.me/${phone}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="floating-button zalo animate-float group"
      aria-label="Liên hệ Zalo"
    >
      <div className="flex flex-col items-center justify-center gap-0.5">
        <MessageCircle className="h-6 w-6 fill-white stroke-white" />
        <span className="text-[10px] font-bold text-white leading-none">
          ZALO
        </span>
      </div>
    </button>
  );
}

export default ZaloContactButton;
