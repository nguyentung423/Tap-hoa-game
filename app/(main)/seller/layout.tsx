"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Store,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SellerBottomNav } from "@/components/layout/seller-nav";
import { siteConfig } from "@/config/site";

const sidebarItems = [
  {
    href: "/seller/dashboard",
    icon: LayoutDashboard,
    label: "Tổng quan",
  },
  {
    href: "/seller/shop",
    icon: Store,
    label: "Quản lý Shop",
  },
  {
    href: "/seller/post",
    icon: Plus,
    label: "Đăng acc mới",
  },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if user is approved
  const isApproved = session?.user?.status === "APPROVED";

  // Không áp dụng layout này cho trang /seller, /seller/welcome, và /seller/pending
  if (
    pathname === "/seller" ||
    pathname === "/seller/welcome" ||
    pathname === "/seller/pending"
  ) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-64 md:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark-card border-r border-white/10 px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-neon">
              <span className="text-lg font-bold text-black">🎮</span>
            </div>
            <span className="font-gaming text-lg font-bold text-neon-green">
              {siteConfig.name}
            </span>
          </Link>

          {/* Back to site */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors -mx-2 px-2 py-2 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </Link>

          {/* Nav */}
          <nav className="flex flex-1 flex-col gap-1">
            {isApproved ? (
              sidebarItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/seller/dashboard" &&
                    pathname.startsWith("/seller/edit"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <p>Shop đang chờ duyệt</p>
                <p className="text-xs mt-1">Vui lòng liên hệ admin</p>
              </div>
            )}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-white/10 pt-4 space-y-1">
            <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 w-full transition-colors">
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:pl-64">{children}</main>

      {/* Mobile Bottom Nav */}
      <SellerBottomNav />
    </div>
  );
}
