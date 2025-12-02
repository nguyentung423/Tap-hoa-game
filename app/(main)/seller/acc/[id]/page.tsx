"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Eye,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Flame,
  Copy,
  Share2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GAMES } from "@/config/games";
import { toast } from "sonner";

interface AccDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "SOLD";
  adminNote?: string;
  gameId: string;
  views: number;
  isVip: boolean;
  isHot: boolean;
  createdAt: string;
  updatedAt: string;
  attributes: Record<string, string>;
  game?: {
    name: string;
    slug: string;
  };
}

const STATUS_CONFIG = {
  APPROVED: {
    label: "Đang bán",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    description: "Acc đang được hiển thị công khai",
  },
  PENDING: {
    label: "Chờ duyệt",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    description: "Đang chờ Admin duyệt, thường trong 24h",
  },
  REJECTED: {
    label: "Bị từ chối",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    description: "Vui lòng sửa theo góp ý và gửi lại",
  },
  SOLD: {
    label: "Đã bán",
    icon: CheckCircle,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    description: "Acc đã được bán thành công",
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function SellerAccDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [acc, setAcc] = useState<AccDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingSold, setIsMarkingSold] = useState(false);

  // Fetch acc data from API
  useEffect(() => {
    const fetchAcc = async () => {
      try {
        const response = await fetch(`/api/v1/seller/accs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch acc");
        }
        const result = await response.json();
        setAcc(result.data);
      } catch (error) {
        console.error("Error fetching acc:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAcc();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!acc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Không tìm thấy acc</h2>
          <Button onClick={() => router.push("/seller/dashboard")}>
            Về Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const gameConfig = GAMES.find((g) => g.id === acc.gameId);
  const statusConfig =
    acc.status && STATUS_CONFIG[acc.status as keyof typeof STATUS_CONFIG]
      ? STATUS_CONFIG[acc.status as keyof typeof STATUS_CONFIG]
      : STATUS_CONFIG.PENDING; // Fallback to PENDING if status is invalid

  const discount = acc.originalPrice
    ? Math.round(((acc.originalPrice - acc.price) / acc.originalPrice) * 100)
    : 0;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/acc/${acc.slug}`);
    toast.success("Đã sao chép link!");
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/seller/accs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete");
      }
      router.push("/seller/dashboard?deleted=true");
    } catch (error) {
      console.error("Error deleting acc:", error);
      toast.error("Không thể xóa acc!");
    }
  };

  const handleMarkSold = async () => {
    if (!confirm("Bạn chắc chắn acc này đã bán?")) return;

    setIsMarkingSold(true);
    try {
      const response = await fetch(`/api/v1/seller/accs/${id}/mark-sold`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to mark as sold");
      }

      toast.success("Đã đánh dấu acc đã bán!");

      // Refresh data
      const accResponse = await fetch(`/api/v1/seller/accs/${id}`);
      if (accResponse.ok) {
        const result = await accResponse.json();
        setAcc(result.data);
      }
    } catch (error: any) {
      console.error("Error marking sold:", error);
      toast.error(error.message || "Không thể đánh dấu đã bán!");
    } finally {
      setIsMarkingSold(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg truncate">Chi tiết acc</h1>
              <p className="text-sm text-muted-foreground">ID: {id}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {acc.status === "APPROVED" && (
                <Link href={`/acc/${acc.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Xem công khai</span>
                  </Button>
                </Link>
              )}
              <Link href={`/seller/edit/${id}`}>
                <Button size="sm" className="gap-1.5">
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Chỉnh sửa</span>
                </Button>
              </Link>

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-card border border-border shadow-xl overflow-hidden">
                      {acc.status === "APPROVED" && (
                        <button
                          onClick={() => {
                            handleMarkSold();
                            setShowMenu(false);
                          }}
                          disabled={isMarkingSold}
                          className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted flex items-center gap-2 text-green-500 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {isMarkingSold ? "Đang xử lý..." : "Đánh dấu đã bán"}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleCopyLink();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Sao chép link
                      </button>
                      <button
                        onClick={() => {
                          router.push("/seller/post?duplicate=" + id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-muted flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Nhân bản acc
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
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

      <div className="container py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Banner */}
          <div
            className={cn(
              "glass-card rounded-2xl p-4",
              statusConfig.bg,
              statusConfig.border,
              "border"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  statusConfig.bg
                )}
              >
                <statusConfig.icon
                  className={cn("w-5 h-5", statusConfig.color)}
                />
              </div>
              <div className="flex-1">
                <p className={cn("font-semibold", statusConfig.color)}>
                  {statusConfig.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {statusConfig.description}
                </p>
              </div>
              {acc.status === "APPROVED" && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {acc.views.toLocaleString("vi-VN")} lượt xem
                </div>
              )}
            </div>

            {/* Rejection Note */}
            {acc.status === "REJECTED" && acc.adminNote && (
              <div className="mt-3 p-3 rounded-xl bg-background/50 border border-red-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      Lý do từ chối:
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {acc.adminNote}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="space-y-3">
            <h2 className="font-semibold">
              Hình ảnh ({acc.images?.length || 0})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(acc.images || []).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <Image
                    src={img}
                    alt={`Image ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {i === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                      Ảnh bìa
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Info */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {acc.isVip && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> VIP
                </span>
              )}
              {acc.isHot && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> HOT
                </span>
              )}
              {gameConfig && (
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded overflow-hidden relative">
                    <Image
                      src={gameConfig.icon}
                      alt={gameConfig.name}
                      fill
                      sizes="16px"
                      className="object-cover"
                    />
                  </div>
                  {gameConfig.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold">{acc.title}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-primary">
                {(acc.price || 0).toLocaleString("vi-VN")}đ
              </span>
              {acc.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {acc.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-sm font-medium">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Dates */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                Đăng: {new Date(acc.createdAt).toLocaleDateString("vi-VN")}
              </span>
              <span>
                Cập nhật: {new Date(acc.updatedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>

          {/* Attributes */}
          {Object.keys(acc.attributes).length > 0 && (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Thông tin chi tiết
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(acc.attributes).map(([key, value]) => {
                  const field = gameConfig?.fields.find(
                    (f: { key: string }) => f.key === key
                  );
                  return (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-muted/50 space-y-1"
                    >
                      <p className="text-xs text-muted-foreground">
                        {field?.label || key}
                      </p>
                      <p className="font-medium">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold">Mô tả</h2>
            <div className="whitespace-pre-wrap text-muted-foreground">
              {acc.description}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link href={`/seller/edit/${id}`} className="flex-1 sm:flex-none">
              <Button className="w-full gap-2">
                <Edit className="w-4 h-4" />
                Chỉnh sửa acc
              </Button>
            </Link>
            {acc.status === "APPROVED" && (
              <Link href={`/acc/${acc.slug}`} className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Xem trang công khai
                </Button>
              </Link>
            )}
            {acc.status === "REJECTED" && (
              <Link href={`/seller/edit/${id}`} className="flex-1 sm:flex-none">
                <Button className="w-full gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90">
                  <Edit className="w-4 h-4" />
                  Sửa & gửi lại duyệt
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() =>
              setLightboxIndex(
                (lightboxIndex - 1 + (acc.images?.length || 0)) %
                  (acc.images?.length || 1)
              )
            }
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full max-w-4xl aspect-video mx-4">
            <Image
              src={acc.images?.[lightboxIndex] || ""}
              alt={`Image ${lightboxIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />
          </div>

          <button
            onClick={() =>
              setLightboxIndex((lightboxIndex + 1) % (acc.images?.length || 1))
            }
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {(acc.images || []).map((_, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === lightboxIndex ? "bg-white w-4" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative glass-card rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Xóa acc này?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Bạn có chắc chắn muốn xóa acc "{acc.title}"? Hành động này không
                thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
