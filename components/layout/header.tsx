"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  X,
  Newspaper,
  User,
  Home,
  ShoppingBag,
  Store,
  LogOut,
  Settings,
  LayoutDashboard,
  ChevronDown,
  LogIn,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { SafetyPolicyButton } from "@/components/acc/safety-policy-button";
import { AuthModal } from "@/components/auth/auth-modal";

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login"
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Use real session from NextAuth
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const user = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || null,
        hasShop: !!session.user.shopName, // Has shop if shopName exists
        status: session.user.status || "PENDING", // Shop approval status
      }
    : null;

  // Open auth modal with specific mode
  const openAuthModal = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAuthSuccess = () => {
    // After login, session will be updated automatically
    // Redirect will be handled by the auth flow
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-dark/95 backdrop-blur-xl safe-area-top">
        <div className="container flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-neon">
              <span className="text-lg font-bold text-black">🎮</span>
            </div>
            <span className="font-gaming text-lg font-bold text-neon-green hidden sm:block">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-neon-green transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/acc"
              className="text-sm text-muted-foreground hover:text-neon-green transition-colors"
            >
              Mua acc
            </Link>
            {isLoggedIn && user?.hasShop && user?.status === "APPROVED" ? (
              <Link
                href="/seller/shop"
                className="text-sm text-muted-foreground hover:text-neon-green transition-colors"
              >
                Shop của tôi
              </Link>
            ) : isLoggedIn ? (
              <span className="text-sm text-muted-foreground/50 cursor-not-allowed">
                Shop của tôi
              </span>
            ) : (
              <button
                onClick={() => openAuthModal("register")}
                className="text-sm text-muted-foreground hover:text-neon-green transition-colors"
              >
                Mở Shop
              </button>
            )}
          </nav>

          {/* News Link */}
          <div className="flex items-center">
            <Link href="/news">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-white/5"
              >
                <Newspaper className="h-4 w-4" />
                <span className="hidden md:inline">Tin Tức</span>
              </Button>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* User Menu / Login Button */}
            {isLoggedIn && user ? (
              /* Logged in - Show user dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-black" />
                    )}
                  </div>
                  <span className="hidden lg:block text-sm font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform hidden lg:block",
                      showUserMenu && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="p-3 border-b border-border">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {user.hasShop && user.status === "APPROVED" ? (
                          <>
                            <Link
                              href="/seller/dashboard"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Dashboard</span>
                            </Link>
                            <Link
                              href="/seller/post"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                            >
                              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Đăng bán acc</span>
                            </Link>
                            <Link
                              href="/seller/shop"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                            >
                              <Store className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Cài đặt Shop</span>
                            </Link>
                          </>
                        ) : user.hasShop ? (
                          <Link
                            href="/seller/pending"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                          >
                            <Store className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Shop (Chờ duyệt)</span>
                          </Link>
                        ) : (
                          <Link
                            href="/seller/welcome"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                          >
                            <Store className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Tạo Shop</span>
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                        >
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Tài khoản</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-border py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors w-full text-left text-red-500"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Đăng xuất</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Not logged in - Show login button */
              <>
                {/* Desktop: Full button */}
                <Button
                  variant="default"
                  size="sm"
                  className="hidden md:flex gap-2"
                  onClick={() => openAuthModal("login")}
                >
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Button>

                {/* Mobile: Icon only */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => openAuthModal("login")}
                >
                  <User className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultMode={authModalMode}
      />
    </>
  );
}

// Các trang KHÔNG hiển thị MobileBottomNav mặc định (vì có nav riêng)
const HIDDEN_BOTTOM_NAV_PATHS = [
  "/seller/dashboard",
  "/seller/post",
  "/seller/shop",
  "/seller/edit",
  "/seller/vip",
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Use real session from NextAuth
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const user = session?.user
    ? {
        hasShop: !!session.user.shopName,
      }
    : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ẩn khi đang ở seller dashboard (có nav riêng)
  const shouldHide = HIDDEN_BOTTOM_NAV_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // Không render gì cho đến khi mounted để tránh hydration mismatch
  if (!mounted) {
    return null;
  }

  if (shouldHide) {
    return null;
  }

  return (
    <>
      <nav className="mobile-bottom-bar md:hidden">
        {/* Trang chủ */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-neon-green transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Trang chủ</span>
        </Link>

        {/* Mở Shop / Dashboard - NỔI BẬT Ở GIỮA */}
        {isLoggedIn && user?.hasShop ? (
          <Link
            href="/seller/dashboard"
            className="flex flex-col items-center gap-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-neon -mt-5 shadow-lg shadow-neon-green/50">
              <Store className="h-6 w-6 text-black" />
            </div>
            <span className="text-[10px] text-neon-green font-medium">
              Dashboard
            </span>
          </Link>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex flex-col items-center gap-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-neon -mt-5 shadow-lg shadow-neon-green/50">
              <Store className="h-6 w-6 text-black" />
            </div>
            <span className="text-[10px] text-neon-green font-medium">
              Mở Shop
            </span>
          </button>
        )}

        {/* Mua acc */}
        <Link
          href="/acc"
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-neon-green transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px]">Mua acc</span>
        </Link>
      </nav>

      {/* Auth Modal for "Mở Shop" */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="register"
      />
    </>
  );
}

export function Footer() {
  const [games, setGames] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch games and site settings
    const fetchData = async () => {
      try {
        const [gamesRes, settingsRes] = await Promise.all([
          fetch("/api/v1/games"),
          fetch("/api/v1/settings"),
        ]);

        if (gamesRes.ok) {
          const gamesData = await gamesRes.json();
          setGames(gamesData.data || gamesData || []);
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSiteSettings(settingsData.data || settingsData);
        }
      } catch (error) {
        console.error("Footer data fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // Show first 4 games in footer
  const footerGames = games.slice(0, 4);
  const adminZaloPhone = siteSettings?.adminPhone || siteConfig.admin.zaloPhone;

  return (
    <footer className="border-t border-white/10 bg-dark-card py-8 pb-24 md:pb-8">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-neon">
                <span className="text-lg font-bold text-black">🎮</span>
              </div>
              <span className="font-gaming text-lg font-bold text-neon-green">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/acc"
                  className="hover:text-neon-green transition-colors"
                >
                  Mua acc
                </Link>
              </li>
              <li>
                <Link
                  href="/seller"
                  className="hover:text-neon-green transition-colors"
                >
                  Mở Shop bán acc
                </Link>
              </li>
              <li>
                <SafetyPolicyButton className="!p-0 !bg-transparent !border-0 text-muted-foreground hover:!text-neon-green" />
              </li>
            </ul>
          </div>

          {/* Games - Dynamic from API */}
          <div>
            <h4 className="mb-4 font-semibold">Game</h4>
            {footerGames.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {footerGames.map((game: any) => (
                  <li key={game.id}>
                    {game.isActive ? (
                      <Link
                        href={`/acc?game=${game.slug}`}
                        className="hover:text-neon-green transition-colors"
                      >
                        {game.name}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 opacity-50">
                        <span>{game.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-500 font-bold">
                          Sắp ra mắt
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-32"></div>
                </li>
                <li className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-28"></div>
                </li>
              </ul>
            )}
          </div>

          {/* Contact - Dynamic from API */}
          <div>
            <h4 className="mb-4 font-semibold">Liên hệ Admin</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Zalo: {adminZaloPhone}</li>
              <li>Hỗ trợ 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 {siteConfig.name}. Giao dịch an toàn qua trung gian.</p>
        </div>
      </div>
    </footer>
  );
}

export default Header;
