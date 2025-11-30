"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  BadgeCheck,
  Eye,
  Mail,
  Calendar,
  ShoppingBag,
  Star,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ShopStatus = "all" | "PENDING" | "APPROVED" | "REJECTED";

interface Shop {
  id: string;
  shopName: string | null;
  shopSlug: string | null;
  shopAvatar: string | null;
  shopDesc: string | null;
  name: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
  isVerified: boolean;
  createdAt: string;
  rejectedReason?: string;
  _count?: {
    accs: number;
  };
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ duyệt",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  APPROVED: {
    label: "Đã duyệt",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  REJECTED: {
    label: "Từ chối",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  BANNED: {
    label: "Bị cấm",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
};

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ShopStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch shops from API
  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/admin/shops");
      const json = await res.json();
      if (json.data?.shops) {
        setShops(json.data.shops);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      toast.error("Không thể tải danh sách shop");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Approve shop
  const handleApprove = async (shopId: string, shopName: string) => {
    setActionLoading(shopId);
    try {
      const res = await fetch(`/api/v1/admin/shops/${shopId}/approve`, {
        method: "POST",
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(`Đã duyệt shop "${shopName}"`);
        fetchShops();
      } else {
        toast.error(json.error || "Không thể duyệt shop");
      }
    } catch (error) {
      console.error("Error approving shop:", error);
      toast.error("Đã xảy ra lỗi");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject shop
  const handleReject = async (shopId: string, shopName: string) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    setActionLoading(shopId);
    try {
      const res = await fetch(`/api/v1/admin/shops/${shopId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(`Đã từ chối shop "${shopName}"`);
        fetchShops();
      } else {
        toast.error(json.error || "Không thể từ chối shop");
      }
    } catch (error) {
      console.error("Error rejecting shop:", error);
      toast.error("Đã xảy ra lỗi");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle verification
  const handleToggleVerify = async (
    shopId: string,
    shopName: string,
    currentlyVerified: boolean
  ) => {
    setActionLoading(shopId);
    try {
      const res = await fetch(`/api/v1/admin/shops/${shopId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !currentlyVerified }),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(
          currentlyVerified
            ? `Đã gỡ tick xanh của "${shopName}"`
            : `Đã cấp tick xanh cho "${shopName}"`
        );
        fetchShops();
      } else {
        toast.error(json.error || "Không thể cập nhật");
      }
    } catch (error) {
      console.error("Error updating shop:", error);
      toast.error("Đã xảy ra lỗi");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter shops - only show shops with shopName
  const filteredShops = shops.filter((shop) => {
    if (!shop.shopName) return false;

    const matchesStatus = activeTab === "all" || shop.status === activeTab;
    const matchesSearch =
      shop.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count by status
  const shopsWithName = shops.filter((s) => s.shopName);
  const counts = {
    all: shopsWithName.length,
    PENDING: shopsWithName.filter((s) => s.status === "PENDING").length,
    APPROVED: shopsWithName.filter((s) => s.status === "APPROVED").length,
    REJECTED: shopsWithName.filter((s) => s.status === "REJECTED").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Shops</h1>
          <p className="text-muted-foreground">
            Duyệt và quản lý các shop (1 email = 1 shop duy nhất)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchShops}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
              activeTab === status
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {status === "all" && "Tất cả"}
            {status === "PENDING" && (
              <>
                <Clock className="w-4 h-4" />
                Chờ duyệt
              </>
            )}
            {status === "APPROVED" && (
              <>
                <CheckCircle className="w-4 h-4" />
                Đã duyệt
              </>
            )}
            {status === "REJECTED" && (
              <>
                <XCircle className="w-4 h-4" />
                Từ chối
              </>
            )}
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-xs",
                activeTab === status
                  ? "bg-white/20"
                  : status === "PENDING"
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-muted-foreground/20"
              )}
            >
              {counts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm theo tên shop hoặc email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Shops List */}
      <div className="space-y-3">
        {filteredShops.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? "Không tìm thấy shop nào" : "Chưa có shop nào"}
          </div>
        ) : (
          filteredShops.map((shop) => {
            const statusConfig =
              STATUS_CONFIG[shop.status] || STATUS_CONFIG.PENDING;
            const isProcessing = actionLoading === shop.id;

            return (
              <div
                key={shop.id}
                className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                      {shop.shopAvatar ? (
                        <img
                          src={shop.shopAvatar}
                          alt={shop.shopName || ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Store className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{shop.shopName}</h3>
                            {shop.isVerified && (
                              <BadgeCheck className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {shop.shopDesc || "Chưa có mô tả"}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium shrink-0",
                            statusConfig.bg,
                            statusConfig.color
                          )}
                        >
                          <statusConfig.icon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {shop.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(shop.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        {shop.status === "APPROVED" && shop._count && (
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {shop._count.accs} accs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    {shop.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="gap-1.5"
                          disabled={isProcessing}
                          onClick={() =>
                            handleApprove(shop.id, shop.shopName || "")
                          }
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-red-500 hover:text-red-500 hover:bg-red-500/10"
                          disabled={isProcessing}
                          onClick={() =>
                            handleReject(shop.id, shop.shopName || "")
                          }
                        >
                          <XCircle className="w-4 h-4" />
                          Từ chối
                        </Button>
                      </>
                    )}

                    {shop.status === "APPROVED" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "gap-1.5",
                            !shop.isVerified &&
                              "text-blue-500 hover:text-blue-500 hover:bg-blue-500/10"
                          )}
                          disabled={isProcessing}
                          onClick={() =>
                            handleToggleVerify(
                              shop.id,
                              shop.shopName || "",
                              shop.isVerified
                            )
                          }
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <BadgeCheck className="w-4 h-4" />
                          )}
                          {shop.isVerified ? "Gỡ Tick Xanh" : "Cấp Tick Xanh"}
                        </Button>
                        {shop.shopSlug && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            asChild
                          >
                            <Link
                              href={`/shop/${shop.shopSlug}`}
                              target="_blank"
                            >
                              <Eye className="w-4 h-4" />
                              Xem Shop
                            </Link>
                          </Button>
                        )}
                      </>
                    )}

                    {shop.status === "REJECTED" && (
                      <Button
                        size="sm"
                        className="gap-1.5"
                        disabled={isProcessing}
                        onClick={() =>
                          handleApprove(shop.id, shop.shopName || "")
                        }
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Duyệt lại
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
