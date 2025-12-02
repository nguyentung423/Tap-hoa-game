"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Store,
  Calendar,
  Tag,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GAMES } from "@/config/games";

type AccStatus = "all" | "PENDING" | "APPROVED" | "REJECTED" | "SOLD";

interface Acc {
  id: string;
  title: string;
  slug: string;
  images: string[];
  price: number;
  description: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SOLD";
  createdAt: string;
  soldAt?: string;
  adminNote?: string;
  game?: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  seller?: {
    id: string;
    shopName: string | null;
    shopSlug: string | null;
    isVerified: boolean;
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
    label: "Đang bán",
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
  SOLD: {
    label: "Đã bán",
    icon: ShoppingBag,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
};

export default function AdminAccsPage() {
  const [accs, setAccs] = useState<Acc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AccStatus>("all");
  const [selectedGame, setSelectedGame] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch accs from API
  const fetchAccs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("status", activeTab);
      if (selectedGame !== "all") params.set("game", selectedGame);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/v1/admin/accs?${params.toString()}`);
      const json = await res.json();
      if (json.data?.accs) {
        setAccs(json.data.accs);
      }
    } catch (error) {
      console.error("Error fetching accs:", error);
      toast.error("Không thể tải danh sách acc");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccs();
  }, [activeTab, selectedGame]);

  // Approve acc
  const handleApprove = async (accId: string, accTitle: string) => {
    setActionLoading(accId);
    try {
      const res = await fetch(`/api/v1/admin/accs/${accId}/approve`, {
        method: "POST",
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(`Đã duyệt acc "${accTitle}"`);
        fetchAccs();
      } else {
        toast.error(json.error || "Không thể duyệt acc");
      }
    } catch (error) {
      console.error("Error approving acc:", error);
      toast.error("Đã xảy ra lỗi");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject acc
  const handleReject = async (accId: string, accTitle: string) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    setActionLoading(accId);
    try {
      const res = await fetch(`/api/v1/admin/accs/${accId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success(`Đã từ chối acc "${accTitle}"`);
        fetchAccs();
      } else {
        toast.error(json.error || "Không thể từ chối acc");
      }
    } catch (error) {
      console.error("Error rejecting acc:", error);
      toast.error("Đã xảy ra lỗi");
    } finally {
      setActionLoading(null);
    }
  };

  // Count by status
  const counts = {
    all: accs.length,
    PENDING: accs.filter((a) => a.status === "PENDING").length,
    APPROVED: accs.filter((a) => a.status === "APPROVED").length,
    REJECTED: accs.filter((a) => a.status === "REJECTED").length,
    SOLD: accs.filter((a) => a.status === "SOLD").length,
  };

  // Filter by search (already filtered by status/game from API)
  const filteredAccs = searchQuery
    ? accs.filter(
        (acc) =>
          acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          acc.seller?.shopName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : accs;

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
          <h1 className="text-2xl font-bold">Quản lý Accs</h1>
          <p className="text-muted-foreground">
            Duyệt và quản lý acc (sản phẩm) trên hệ thống
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAccs}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "PENDING", "APPROVED", "REJECTED", "SOLD"] as const).map(
          (status) => (
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
              {status !== "all" && (
                <>
                  {STATUS_CONFIG[status].icon && (
                    <span
                      className={
                        activeTab === status ? "" : STATUS_CONFIG[status].color
                      }
                    >
                      {(() => {
                        const Icon = STATUS_CONFIG[status].icon;
                        return <Icon className="w-4 h-4" />;
                      })()}
                    </span>
                  )}
                  {STATUS_CONFIG[status].label}
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
          )
        )}
      </div>

      {/* Search & Game Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên acc hoặc shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
        >
          <option value="all">Tất cả game</option>
          {GAMES.map((game) => (
            <option key={game.id} value={game.slug}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      {/* Accs List */}
      <div className="space-y-3">
        {filteredAccs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery || activeTab !== "all"
              ? "Không tìm thấy acc nào"
              : "Chưa có acc nào"}
          </div>
        ) : (
          filteredAccs.map((acc) => {
            const statusConfig =
              STATUS_CONFIG[acc.status] || STATUS_CONFIG.PENDING;
            const isProcessing = actionLoading === acc.id;
            const thumbnail = acc.images?.[0] || "/images/placeholder.jpg";

            return (
              <div
                key={acc.id}
                className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-muted overflow-hidden shrink-0 cursor-pointer relative group"
                      onClick={() => {
                        if (acc.images && acc.images.length > 0) {
                          setPreviewImages(acc.images);
                          setPreviewIndex(0);
                        }
                      }}
                    >
                      <Image
                        src={thumbnail}
                        alt={acc.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                      {acc.images && acc.images.length > 1 && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white" />
                          <span className="text-white text-sm ml-1">
                            {acc.images.length}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold line-clamp-2">
                            {acc.title}
                          </h3>
                          <p className="text-lg font-bold text-primary mt-1">
                            {acc.price.toLocaleString("vi-VN")}đ
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
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {acc.game && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            {acc.game.name}
                          </span>
                        )}
                        {acc.seller && (
                          <span className="flex items-center gap-1">
                            <Store className="w-3.5 h-3.5" />
                            {acc.seller.shopName}
                            {acc.seller.isVerified && (
                              <BadgeCheck className="w-3 h-3 text-blue-500" />
                            )}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(acc.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      {/* Description */}
                      {acc.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {acc.description}
                        </p>
                      )}

                      {/* Rejected Reason */}
                      {acc.status === "REJECTED" && acc.adminNote && (
                        <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-xs text-red-500">
                            <strong>Lý do:</strong> {acc.adminNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    {acc.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="gap-1.5"
                          disabled={isProcessing}
                          onClick={() => handleApprove(acc.id, acc.title)}
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
                          onClick={() => handleReject(acc.id, acc.title)}
                        >
                          <XCircle className="w-4 h-4" />
                          Từ chối
                        </Button>
                      </>
                    )}

                    {acc.status === "APPROVED" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          asChild
                        >
                          <Link href={`/acc/${acc.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                            Xem
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-red-500 hover:text-red-500 hover:bg-red-500/10"
                          disabled={isProcessing}
                          onClick={() => handleReject(acc.id, acc.title)}
                        >
                          <XCircle className="w-4 h-4" />
                          Ẩn
                        </Button>
                      </>
                    )}

                    {acc.status === "REJECTED" && (
                      <Button
                        size="sm"
                        className="gap-1.5"
                        disabled={isProcessing}
                        onClick={() => handleApprove(acc.id, acc.title)}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Duyệt lại
                      </Button>
                    )}

                    {acc.status === "SOLD" && acc.soldAt && (
                      <span className="text-xs text-muted-foreground">
                        Đã bán ngày{" "}
                        {new Date(acc.soldAt).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImages && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setPreviewImages(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewImages[previewIndex]}
              alt="Preview"
              width={800}
              height={600}
              className="object-contain w-full h-auto rounded-lg"
            />

            {/* Navigation */}
            {previewImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setPreviewIndex((i) =>
                      i === 0 ? previewImages.length - 1 : i - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setPreviewIndex((i) =>
                      i === previewImages.length - 1 ? 0 : i + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-sm">
              {previewIndex + 1} / {previewImages.length}
            </div>

            {/* Close */}
            <button
              onClick={() => setPreviewImages(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
