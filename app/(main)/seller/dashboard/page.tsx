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
import { GAMES } from "@/config/games";
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
  images: string[];
  price: number;
  originalPrice?: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SOLD";
  views: number;
  gameId: string;
  gameName?: string;
  isVip: boolean;
  isHot: boolean;
  createdAt: string;
  soldAt?: string;
  adminNote?: string;
}

type AccStatus = "all" | "APPROVED" | "PENDING" | "REJECTED" | "SOLD";

const STATUS_CONFIG = {
  APPROVED: {
    label: "Đang bán",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  PENDING: {
    label: "Chờ duyệt",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
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

  // Load shop and accs data
  useEffect(() => {
    // Don't fetch if not authenticated or no shop
    if (status !== "authenticated" || !session?.user?.shopName) return;

    const fetchData = async () => {
      try {
        // Fetch shop data
        const shopRes = await fetch("/api/v1/seller/shop");
        const shopJson = await shopRes.json();
        if (shopJson.data) {
          setShopData({
            id: shopJson.data.id,
            shopName: shopJson.data.shopName,
            shopSlug: shopJson.data.shopSlug,
            shopAvatar: shopJson.data.shopAvatar,
            status: shopJson.data.status,
            isVerified: shopJson.data.isVerified,
            rating: shopJson.data.rating || 5.0,
            totalSales: shopJson.data.totalSales || 0,
            totalViews: shopJson.data.totalViews || 0,
          });
        }

        // Fetch seller's accs
        const accsRes = await fetch("/api/v1/seller/accs");
        const accsJson = await accsRes.json();
        if (accsJson.success && accsJson.data?.accs) {
          setAccs(accsJson.data.accs);
        } else if (Array.isArray(accsJson.data)) {
          setAccs(accsJson.data);
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
    if (activeTab !== "all" && acc.status !== activeTab) return false;
    if (selectedGame !== "all" && acc.gameId !== selectedGame) return false;
    if (
      searchQuery &&
      !acc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const pendingCount = accs.filter((a) => a.status === "PENDING").length;

  const stats = [
    {
      label: "Tổng acc",
      value: accs.length,
      icon: Package,
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Chờ duyệt",
      value: pendingCount,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
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
      color: "from-green-500 to-emerald-500",
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                  {shopData?.shopAvatar ? (
                    <Image
                      src={shopData.shopAvatar}
                      alt={shopData.shopName || "Shop"}
                      fill
                      className="object-cover"
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
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Link shop của bạn
                  </p>
                  <p className="font-medium text-primary">
                    {siteConfig.url}/shop/{shopData.shopSlug}
                  </p>
                </div>
              </div>
              <Link href={`/shop/${shopData.shopSlug}`}>
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
            {(["APPROVED", "PENDING", "REJECTED", "SOLD"] as const).map(
              (status) => {
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
              }
            )}
          </div>

          {/* Search */}
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative flex-1 sm:w-64">
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
              <AccCard key={acc.id} acc={acc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface AccCardProps {
  acc: AccData;
}

function AccCard({ acc }: AccCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const statusConfig = STATUS_CONFIG[acc.status];
  const thumbnail = acc.images?.[0] || "/images/placeholder.jpg";

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
              <p className="text-xs text-muted-foreground mt-1">
                {acc.gameName || acc.gameId}
              </p>
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
          <div className="mt-3 flex items-center gap-2">
            {acc.status === "APPROVED" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/seller/edit/${acc.id}`);
                  }}
                >
                  <Edit className="w-3.5 h-3.5" />
                  Sửa
                </Button>
              </>
            )}
            {acc.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/seller/edit/${acc.id}`);
                  }}
                >
                  <Edit className="w-3.5 h-3.5" />
                  Sửa
                </Button>
                <span className="text-xs text-muted-foreground flex items-center gap-1 ml-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đang chờ duyệt...</span>
                </span>
              </>
            )}
            {acc.status === "REJECTED" && (
              <Button
                size="sm"
                className="gap-1.5 h-8 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/seller/edit/${acc.id}`);
                }}
              >
                <Edit className="w-3.5 h-3.5" />
                Sửa & gửi lại
              </Button>
            )}
            {acc.status === "SOLD" && acc.soldAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                Đã bán {new Date(acc.soldAt).toLocaleDateString("vi-VN")}
              </span>
            )}

            <div className="ml-auto relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-card border border-border shadow-xl overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Nhân bản
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted flex items-center gap-2 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa acc
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
