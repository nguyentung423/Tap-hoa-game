"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Package,
  Plus,
  TrendingUp,
  Eye,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  Store,
  ChevronRight,
  Flame,
  BadgeCheck,
  Shield,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";

interface ShopData {
  id: string;
  shopName: string | null;
  shopSlug: string | null;
  shopAvatar: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
  isVerified: boolean;
  rating: number;
  totalSales: number;
  totalViews: number;
}

interface AccData {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SOLD";
  views: number;
  gameId?: string;
  game?: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  isVip: boolean;
  isHot: boolean;
  createdAt: string;
  soldAt?: string;
  adminNote?: string;
}

type AccStatus = "all" | "APPROVED" | "REJECTED" | "SOLD";

const STATUS_CONFIG = {
  APPROVED: {
    label: "Đang bán",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  REJECTED: {
    label: "Bị từ chối",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  SOLD: {
    label: "Đã bán",
    icon: DollarSign,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

export default function SellerDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [accs, setAccs] = useState<AccData[]>([]);

  const [activeTab, setActiveTab] = useState<AccStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [hideVerificationTip, setHideVerificationTip] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Refetch dashboard data
  const refetchData = async () => {
    try {
      const dashboardRes = await fetch(
        "/api/v1/seller/dashboard?" + new Date().getTime(),
        {
          cache: "no-store",
        }
      );
      const dashboardJson = await dashboardRes.json();

      if (dashboardJson.success && dashboardJson.data) {
        const { shop, stats, recentAccs } = dashboardJson.data;

        if (shop) {
          setShopData({
            id: shop.id,
            shopName: shop.name,
            shopSlug: shop.slug,
            shopAvatar: shop.avatar,
            status: shop.status,
            isVerified: shop.isVerified,
            rating: shop.rating || 5.0,
            totalSales: shop.totalSales || 0,
            totalViews: stats.totalViews || 0,
          });
        }

        if (recentAccs) {
          setAccs(recentAccs);
        }
      }
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  };

  // Check auth and redirect if needed
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/seller");
      return;
    }

    // If user is logged in but doesn't have a shop, redirect to welcome
    if (session?.user && !session.user.shopName) {
      router.replace("/seller/welcome");
      return;
    }
  }, [session, status, router]);

  // Fetch shop data and check status
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.shopName) return;

    const checkShopStatus = async () => {
      try {
        const res = await fetch("/api/v1/seller/shop");
        const json = await res.json();

        if (json.success && json.data) {
          const { status: shopStatus } = json.data;

          // If not approved, redirect to pending page
          if (shopStatus !== "APPROVED") {
            router.replace("/seller/pending");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking shop status:", error);
      }
    };

    checkShopStatus();
  }, [session, status, router]);

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/v1/games");
        if (res.ok) {
          const data = await res.json();
          // Only get active games
          const activeGames = (data.data || data || []).filter(
            (g: any) => g.isActive
          );
          setGames(activeGames);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  // Load shop and accs data
  useEffect(() => {
    // Don't fetch if not authenticated or no shop
    if (status !== "authenticated" || !session?.user?.shopName) return;

    const fetchData = async () => {
      try {
        // Only fetch dashboard - it already includes recent accs
        const dashboardRes = await fetch("/api/v1/seller/dashboard", {
          cache: "no-store",
        });
        const dashboardJson = await dashboardRes.json();

        // Set shop data from dashboard
        if (dashboardJson.success && dashboardJson.data) {
          const { shop, stats, recentAccs } = dashboardJson.data;

          if (shop) {
            setShopData({
              id: shop.id,
              shopName: shop.name,
              shopSlug: shop.slug,
              shopAvatar: shop.avatar,
              status: shop.status,
              isVerified: shop.isVerified,
              rating: shop.rating || 5.0,
              totalSales: shop.totalSales || 0,
              totalViews: stats.totalViews || 0,
            });
          }

          // Use recent accs from dashboard (only 5 latest)
          if (recentAccs) {
            setAccs(recentAccs);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session, status]);

  // Show loading while checking auth
  if (
    status === "loading" ||
    (status === "authenticated" && !session?.user?.shopName)
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if shop is pending approval
  const isShopPending = shopData?.status === "PENDING";

  const filteredAccs = accs.filter((acc) => {
    // Tab "Tất cả" chỉ hiện acc đang bán và bị từ chối (không hiện đã bán)
    if (activeTab === "all" && acc.status === "SOLD") return false;
    // Các tab khác thì filter theo status
    if (activeTab !== "all" && acc.status !== activeTab) return false;
    const accGameId = acc.game?.id || acc.gameId;
    if (selectedGame !== "all" && accGameId !== selectedGame) return false;
    if (
      searchQuery &&
      !acc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const stats = [
    {
      label: "Tổng acc",
      value: accs.length,
      icon: Package,
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Đang bán",
      value: accs.filter((a) => a.status === "APPROVED").length,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Lượt xem",
      value: isShopPending
        ? "—"
        : (shopData?.totalViews || 0).toLocaleString("vi-VN"),
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
      locked: isShopPending,
    },
    {
      label: "Đã bán",
      value: isShopPending ? "—" : shopData?.totalSales || 0,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500",
      locked: isShopPending,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Pending Banner */}
      {isShopPending && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30">
          <div className="container py-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-500 flex items-center gap-2">
                  Shop đang chờ duyệt
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Admin sẽ xét duyệt shop của bạn trong vòng 24h. Trong thời
                  gian chờ, bạn có thể chuẩn bị sẵn acc để đăng.
                </p>
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    ✓ Cập nhật thông tin Shop
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    ✓ Đăng acc (lưu nháp)
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border">
                    🔒 Hiển thị công khai
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border">
                    🔒 Nhận đơn hàng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border md:border-none">
        <div className="container py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden border-2 border-border">
                  {shopData?.shopAvatar ? (
                    <Image
                      src={shopData.shopAvatar}
                      alt={shopData.shopName || "Shop"}
                      fill
                      sizes="48px"
                      className="object-cover rounded-full"
                      unoptimized
                    />
                  ) : (
                    <Store className="w-6 h-6 text-primary" />
                  )}
                </div>
                {/* Verified badge - only show when isVerified */}
                {shopData?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg md:text-2xl">
                    {shopData?.shopName ||
                      session?.user?.name ||
                      "Shop của bạn"}
                  </h1>
                  {shopData?.isVerified && (
                    <span className="text-xs text-green-500 font-medium">
                      Đã xác minh
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isShopPending ? (
                    <span className="text-yellow-500">⏳ Đang chờ duyệt</span>
                  ) : (
                    <>🛒 {shopData?.totalSales || 0} đã bán</>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href="/seller/shop">
                <Button variant="outline" size="sm" className="gap-2">
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">Quản lý Shop</span>
                </Button>
              </Link>
              <Link href="/seller/post">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng acc</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={cn(
                "glass-card rounded-2xl p-4 relative overflow-hidden",
                stat.locked && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20",
                  `bg-gradient-to-r ${stat.color}`
                )}
              />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r",
                    stat.color
                  )}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shop Link */}
        {!isShopPending && shopData?.shopSlug && (
          <div className="glass-card rounded-2xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">
                    Link shop của bạn
                  </p>
                  <p className="font-medium text-primary truncate">
                    {siteConfig.url}/shop/{shopData.shopSlug}
                  </p>
                </div>
              </div>
              <Link
                href={`/shop/${shopData.shopSlug}`}
                className="flex-shrink-0"
              >
                <Button variant="outline" size="sm">
                  Xem shop
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Verification Tip */}
        {!isShopPending && !shopData?.isVerified && !hideVerificationTip && (
          <div className="glass-card rounded-2xl p-4 mb-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-500">
                  Xác minh Shop để tăng uy tín
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Shop được xác minh sẽ có tick xanh, hiển thị ưu tiên và được
                  khách hàng tin tưởng hơn.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Xác minh ngay
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setHideVerificationTip(true)}
                  >
                    Để sau
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              Tất cả ({accs.length})
            </button>
            {(["APPROVED", "REJECTED", "SOLD"] as const).map((status) => {
              const count = accs.filter((a) => a.status === status).length;
              const config = STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2",
                    activeTab === status
                      ? cn(config.bg, config.color, "border", config.border)
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Game Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto w-full sm:w-auto">
            {/* Game Filter */}
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary transition-colors text-sm"
            >
              <option value="all">Tất cả game</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm acc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Acc List */}
        {filteredAccs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Chưa có acc nào</h3>
            <p className="text-muted-foreground mb-6">
              Bắt đầu đăng acc để bán ngay hôm nay!
            </p>
            <Link href="/seller/post">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Đăng acc đầu tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAccs.map((acc) => (
              <AccCard key={acc.id} acc={acc} onUpdate={refetchData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface AccCardProps {
  acc: AccData;
  onUpdate?: () => void;
}

function AccCard({ acc, onUpdate }: AccCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const statusConfig =
    STATUS_CONFIG[acc.status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.APPROVED;
  const thumbnail =
    acc.thumbnail || acc.images?.[0] || "/images/placeholder.jpg";
  const gameName = acc.game?.name || "Unknown Game";

  const handleCardClick = () => {
    router.push(`/seller/acc/${acc.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all group cursor-pointer"
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
          <Image
            src={thumbnail}
            alt={acc.title}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {acc.isVip && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> VIP
              </span>
            )}
            {acc.isHot && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white flex items-center gap-1">
                <Flame className="w-3 h-3" /> HOT
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {acc.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{gameName}</p>
            </div>

            {/* Status Badge */}
            <div
              className={cn(
                "shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5",
                statusConfig.bg,
                statusConfig.color,
                statusConfig.border,
                "border"
              )}
            >
              <statusConfig.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{statusConfig.label}</span>
            </div>
          </div>

          {/* Price & Stats */}
          <div className="mt-3 flex items-center gap-4">
            <div>
              <span className="text-lg font-bold text-primary">
                {acc.price.toLocaleString("vi-VN")}đ
              </span>
              {acc.originalPrice && acc.originalPrice > acc.price && (
                <span className="text-xs text-muted-foreground line-through ml-2">
                  {acc.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
            {acc.status === "APPROVED" && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3.5 h-3.5" />
                {(acc.views || 0).toLocaleString("vi-VN")}
              </div>
            )}
          </div>

          {/* Rejection Note */}
          {acc.status === "REJECTED" && acc.adminNote && (
            <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{acc.adminNote}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {acc.status === "APPROVED" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 h-8 text-xs px-2.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/seller/edit/${acc.id}`);
                  }}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1 h-8 text-xs px-2.5 bg-green-600 hover:bg-green-700"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!confirm("Bạn chắc chắn acc này đã bán?")) return;
                    try {
                      const res = await fetch(
                        `/api/v1/seller/accs/${acc.id}/mark-sold`,
                        {
                          method: "POST",
                        }
                      );

                      if (!res.ok) {
                        const error = await res.json().catch(() => ({
                          message: "Không thể đánh dấu đã bán!",
                        }));
                        toast.error(
                          error.message || "Không thể đánh dấu đã bán!"
                        );
                        return;
                      }

                      toast.success("Đã đánh dấu acc đã bán!");
                      onUpdate?.();
                    } catch (error) {
                      console.error("Mark sold error:", error);
                      toast.error("Có lỗi xảy ra!");
                    }
                  }}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Đã bán</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 h-8 text-xs px-2.5 text-red-500 border-red-500/20 hover:bg-red-500/10"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!confirm("Bạn chắc chắn muốn xóa acc này?")) return;
                    try {
                      const res = await fetch(`/api/v1/seller/accs/${acc.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) {
                        toast.success("Đã xóa acc!");
                        onUpdate?.();
                      } else {
                        toast.error("Không thể xóa acc!");
                      }
                    } catch (error) {
                      toast.error("Có lỗi xảy ra!");
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            {acc.status === "REJECTED" && (
              <>
                <Button
                  size="sm"
                  className="gap-1.5 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/seller/edit/${acc.id}`);
                  }}
                >
                  <Edit className="w-3.5 h-3.5" />
                  Sửa & gửi lại
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-8 text-xs text-red-500 border-red-500/20 hover:bg-red-500/10"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!confirm("Bạn chắc chắn muốn xóa acc này?")) return;
                    try {
                      const res = await fetch(`/api/v1/seller/accs/${acc.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) {
                        toast.success("Đã xóa acc!");
                        onUpdate?.();
                      } else {
                        toast.error("Không thể xóa acc!");
                      }
                    } catch (error) {
                      toast.error("Có lỗi xảy ra!");
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            {acc.status === "SOLD" && acc.soldAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                Đã bán {new Date(acc.soldAt).toLocaleDateString("vi-VN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
