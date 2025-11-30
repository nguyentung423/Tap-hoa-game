"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Plus, Store, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const sellerNavItems = [
  {
    href: "/seller/dashboard",
    icon: LayoutDashboard,
    label: "Tổng quan",
  },
  {
    href: "/seller/post",
    icon: Plus,
    label: "Đăng acc",
    isCenter: true,
  },
  {
    href: "/seller/shop",
    icon: Store,
    label: "Shop",
  },
];

export function SellerBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder to avoid layout shift
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-dark-card/95 backdrop-blur-xl border-t border-white/10" />
        <div className="relative flex items-center justify-around px-4 py-2 safe-area-bottom h-16" />
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-dark-card/95 backdrop-blur-xl border-t border-white/10" />

      {/* Nav items */}
      <div className="relative flex items-center justify-around px-4 py-2 safe-area-bottom">
        {sellerNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/seller/dashboard" &&
              pathname.startsWith("/seller/edit"));

          if (item.isCenter) {
            // Center button - Đăng acc (nổi bật)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary -mt-6 shadow-lg shadow-primary/50">
                  <item.icon className="h-7 w-7 text-black" />
                </div>
                <span className="text-[10px] text-primary font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-primary")}
              />
              <span className={cn("text-[10px]", isActive && "font-medium")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
