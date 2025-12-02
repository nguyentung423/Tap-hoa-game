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
  Crown,
  Shield,
  Ban,
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
  isVipShop?: boolean;
  vipShopEndTime?: string | null;
  commissionRate?: number;
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
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 20;

  // Fetch shops from API
  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (activeTab !== "all") {
        params.set("status", activeTab);
      }

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const res = await fetch(`/api/v1/admin/shops?${params.toString()}`);
      const json = await res.json();

      if (json.data?.shops) {
        setShops(json.data.shops);
        setTotal(json.data.pagination?.total || 0);
        setTotalPages(json.data.pagination?.totalPages || 0);
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
  }, [page, activeTab, searchQuery]);

  // Reset về trang 1 khi đổi filter
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

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

  // Toggle VIP
  const handleToggleVip = async (
    shopId: string,
    shopName: string,
    currentlyVip: boolean
  ) => {
    // Prompt for duration if enabling VIP
    if (!currentlyVip) {
      const duration = prompt(
        `Bật VIP cho shop "${shopName}"\nNhập số ngày (30, 90, 180, 365):`,
        "90"
      );

      if (!duration) return; // User cancelled

      const durationNum = parseInt(duration);
      if (![30, 90, 180, 365].includes(durationNum)) {
        toast.error("Duration phải là 30, 90, 180 hoặc 365 ngày");
        return;
      }

      setActionLoading(shopId);
      try {
        const res = await fetch(`/api/v1/admin/shops/${shopId}/vip`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isVipShop: true, duration: durationNum }),
        });
        const json = await res.json();

        if (res.ok) {
          toast.success(json.data.message || `Đã bật VIP cho "${shopName}"`);
          fetchShops();
        } else {
          toast.error(json.error || "Không thể cập nhật VIP");
        }
      } catch (error) {
        console.error("Error updating VIP:", error);
        toast.error("Đã xảy ra lỗi");
      } finally {
        setActionLoading(null);
      }
    } else {
      // Disable VIP
      if (!confirm(`Tắt VIP cho shop "${shopName}"?`)) return;

      setActionLoading(shopId);
      try {
        const res = await fetch(`/api/v1/admin/shops/${shopId}/vip`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isVipShop: false }),
        });
        const json = await res.json();

        if (res.ok) {
          toast.success(json.data.message || `Đã tắt VIP cho "${shopName}"`);
          fetchShops();
        } else {
          toast.error(json.error || "Không thể cập nhật VIP");
        }
      } catch (error) {
        console.error("Error updating VIP:", error);
        toast.error("Đã xảy ra lỗi");
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Toggle Strategic Partner
  const handleToggleStrategic = async (
    shopId: string,
    shopName: string,
    currentlyStrategic: boolean
  ) => {
    // Prompt for commission rate if enabling Strategic Partner
    if (!currentlyStrategic) {
      const commissionRate = prompt(
        `Bật Đối tác chiến lược cho shop "${shopName}"\nNhập % hoa hồng (0-5):`,
        "1.5"
      );

      if (!commissionRate) return; // User cancelled

      const rate = parseFloat(commissionRate);
      if (isNaN(rate) || rate < 0 || rate > 5) {
        toast.error("Commission rate phải từ 0-5%");
        return;
      }

      setActionLoading(shopId);
      try {
        const res = await fetch(`/api/v1/admin/shops/${shopId}/strategic`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enable: true, commissionRate: rate }),
        });
        const json = await res.json();

        if (res.ok) {
          toast.success(
            json.data.message || `Đã bật Đối tác chiến lược cho "${shopName}"`
          );
          fetchShops();
        } else {
          toast.error(json.error || "Không thể cập nhật Strategic Partner");
        }
      } catch (error) {
        console.error("Error updating Strategic Partner:", error);
        toast.error("Đã xảy ra lỗi");
      } finally {
        setActionLoading(null);
      }
    } else {
      // Disable Strategic Partner
      if (!confirm(`Tắt Đối tác chiến lược cho shop "${shopName}"?`)) return;

      setActionLoading(shopId);
      try {
        const res = await fetch(`/api/v1/admin/shops/${shopId}/strategic`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enable: false }),
        });
        const json = await res.json();

        if (res.ok) {
          toast.success(
            json.data.message || `Đã tắt Đối tác chiến lược cho "${shopName}"`
          );
          fetchShops();
        } else {
          toast.error(json.error || "Không thể cập nhật Strategic Partner");
        }
      } catch (error) {
        console.error("Error updating Strategic Partner:", error);
        toast.error("Đã xảy ra lỗi");
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Ban shop permanently
  const handleBanShop = async (
    shopId: string,
    shopName: string,
    email: string
  ) => {
    // First confirmation
    const firstConfirm = confirm(
      `⚠️ BẠN CHẮC CHẮN MUỐN BAN SHOP "${shopName}"?\n\nEmail: ${email}\n\nHành động này sẽ:\n- Xóa toàn bộ thông tin shop\n- Cấm vĩnh viễn email này tạo shop mới\n- KHÔNG THỂ hoàn tác!\n\nBấm OK để tiếp tục...`
    );
    if (!firstConfirm) return;

    // Second confirmation - must type shop name
    const confirmText = prompt(
      `⚠️ XÁC NHẬN LẦN 2:\n\nĐể ban vĩnh viễn shop "${shopName}", vui lòng nhập chính xác TÊN SHOP bên dưới:\n\n"${shopName}"\n\n(Nhập đúng để xác nhận)`
    );

    if (confirmText !== shopName) {
      if (confirmText !== null) {
        toast.error("Tên shop không khớp. Hủy thao tác ban.");
      }
      return;
    }

    setActionLoading(shopId);
    try {
      const res = await fetch(`/api/v1/admin/shops/${shopId}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(
          `Đã ban vĩnh viễn shop "${shopName}" và email "${email}"`
        );
        fetchShops();
      } else {
        toast.error(json.error || "Không thể ban shop");
      }
    } catch (error) {
      console.error("Error banning shop:", error);
      toast.error("Đã xảy ra lỗi");
    } finally {
      setActionLoading(null);
    }
  };

  // Shops already filtered by API
  const filteredShops = shops;

  // Count by status - use total from API
  const counts = {
    all: total,
    PENDING: activeTab === "PENDING" ? total : 0,
    APPROVED: activeTab === "APPROVED" ? total : 0,
    REJECTED: activeTab === "REJECTED" ? total : 0,
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
                            {(shop as any).isStrategicPartner && (
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-900 text-xs font-bold">
                                <Shield className="w-3 h-3" />
                                CHIẾN LƯỢC
                              </div>
                            )}
                            {shop.isVipShop &&
                              shop.vipShopEndTime &&
                              new Date(shop.vipShopEndTime) > new Date() &&
                              !(shop as any).isStrategicPartner && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 text-xs font-bold">
                                  <Crown className="w-3 h-3" />
                                  VIP
                                </div>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "gap-1.5",
                            shop.isVipShop &&
                              shop.vipShopEndTime &&
                              new Date(shop.vipShopEndTime) > new Date()
                              ? "text-amber-500 hover:text-amber-500 hover:bg-amber-500/10"
                              : "text-amber-600 hover:text-amber-600 hover:bg-amber-600/10"
                          )}
                          disabled={isProcessing}
                          onClick={() =>
                            handleToggleVip(
                              shop.id,
                              shop.shopName || "",
                              !!(
                                shop.isVipShop &&
                                shop.vipShopEndTime &&
                                new Date(shop.vipShopEndTime) > new Date()
                              )
                            )
                          }
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Crown className="w-4 h-4" />
                          )}
                          {shop.isVipShop &&
                          shop.vipShopEndTime &&
                          new Date(shop.vipShopEndTime) > new Date()
                            ? "Tắt VIP"
                            : "Bật VIP"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "gap-1.5",
                            (shop as any).isStrategicPartner
                              ? "text-cyan-500 hover:text-cyan-500 hover:bg-cyan-500/10"
                              : "text-cyan-600 hover:text-cyan-600 hover:bg-cyan-600/10"
                          )}
                          disabled={isProcessing}
                          onClick={() =>
                            handleToggleStrategic(
                              shop.id,
                              shop.shopName || "",
                              !!(shop as any).isStrategicPartner
                            )
                          }
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                          {(shop as any).isStrategicPartner
                            ? "Tắt Chiến lược"
                            : "Bật Chiến lược"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1.5"
                          disabled={isProcessing}
                          onClick={() =>
                            handleBanShop(
                              shop.id,
                              shop.shopName || "",
                              shop.email
                            )
                          }
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                          Ban Shop
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Trang {page} / {totalPages} • Tổng {total} shops
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
