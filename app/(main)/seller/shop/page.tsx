"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Store,
  Camera,
  Save,
  Loader2,
  ExternalLink,
  Phone,
  FileText,
  ImageIcon,
  Sparkles,
  CheckCircle,
  Package,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ShopData {
  id: string;
  shopName: string | null;
  shopSlug: string | null;
  shopDesc: string | null;
  shopAvatar: string | null;
  shopCover: string | null;
  isVipShop: boolean;
  vipShopEndTime: string | null;
  commissionRate: number;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalViews: number;
  totalAccs: number;
  totalAccsOnSale: number;
}

export default function ShopSettingsPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [formData, setFormData] = useState({
    shopName: "",
    shopDesc: "",
    shopAvatar: "",
    shopCover: "",
    featuredGames: [] as string[],
  });

  const [availableGames, setAvailableGames] = useState<string[]>([]);

  // Fetch active games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/v1/games");
        if (res.ok) {
          const data = await res.json();
          // Only get active games and extract names
          const activeGames = (data.data || data || [])
            .filter((g: any) => g.isActive)
            .map((g: any) => g.name);
          setAvailableGames(activeGames);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  // Load shop data on mount - wait for session to be ready
  useEffect(() => {
    // Đợi session sẵn sàng
    if (status === "loading") return;

    // Nếu chưa đăng nhập thì redirect
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    // If no shop name, redirect to welcome
    if (session?.user && !session.user.shopName) {
      router.replace("/seller/welcome");
      return;
    }

    const fetchShopData = async () => {
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

          // Shop is approved, load data
          setShopData(json.data);
          setFormData({
            shopName: json.data.shopName || "",
            shopDesc: json.data.shopDesc || "",
            shopAvatar: json.data.shopAvatar || "",
            shopCover: json.data.shopCover || "",
            featuredGames: json.data.featuredGames || [],
          });
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
        toast.error("Không thể tải thông tin shop");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [status, router, session]);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (
    file: File,
    folder: string
  ): Promise<string | null> => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", folder);

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }

      return json.data.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Không thể upload ảnh");
      return null;
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được quá 5MB");
      return;
    }

    setIsUploadingAvatar(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, shopAvatar: reader.result as string }));
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const url = await uploadToCloudinary(file, "shops/avatars");
    if (url) {
      setFormData((prev) => ({ ...prev, shopAvatar: url }));

      // Auto save to DB if shop already exists
      if (shopData?.shopName) {
        try {
          await fetch("/api/v1/seller/shop", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shopAvatar: url }),
          });
          toast.success("Đã lưu ảnh đại diện");
        } catch {
          toast.error("Không thể lưu ảnh đại diện");
        }
      } else {
        toast.success("Upload ảnh đại diện thành công");
      }
    }

    setIsUploadingAvatar(false);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ảnh không được quá 10MB");
      return;
    }

    setIsUploadingCover(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, shopCover: reader.result as string }));
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const url = await uploadToCloudinary(file, "shops/covers");
    if (url) {
      setFormData((prev) => ({ ...prev, shopCover: url }));

      // Auto save to DB if shop already exists
      if (shopData?.shopName) {
        try {
          await fetch("/api/v1/seller/shop", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shopCover: url }),
          });
          toast.success("Đã lưu ảnh bìa");
        } catch {
          toast.error("Không thể lưu ảnh bìa");
        }
      } else {
        toast.success("Upload ảnh bìa thành công");
      }
    }

    setIsUploadingCover(false);
  };

  const handleSave = async () => {
    if (!formData.shopName.trim()) {
      toast.error("Vui lòng nhập tên shop");
      return;
    }

    setIsSaving(true);

    try {
      // Nếu chưa có shop thì POST để tạo mới, ngược lại PUT để cập nhật
      const isCreating = !shopData?.shopName;

      const res = await fetch("/api/v1/seller/shop", {
        method: isCreating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isCreating && { shopName: formData.shopName }),
          shopDesc: formData.shopDesc,
          shopAvatar: formData.shopAvatar || null,
          shopCover: formData.shopCover || null,
          featuredGames: formData.featuredGames,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Lưu thất bại");
      }

      // Update local state
      setShopData({
        ...shopData!,
        shopName: json.data.shopName,
        shopSlug: json.data.shopSlug,
        shopDesc: json.data.shopDesc,
        shopAvatar: json.data.shopAvatar,
        shopCover: json.data.shopCover,
      });

      // Refresh session to update header
      await updateSession();

      toast.success(
        isCreating
          ? "Tạo shop thành công! Vui lòng chờ admin duyệt."
          : "Đã lưu thông tin shop"
      );
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Không thể lưu");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <div className="flex-1">
              <h1 className="font-bold text-lg">Quản lý Shop</h1>
              <p className="text-sm text-muted-foreground">
                Cập nhật thông tin gian hàng
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving || isUploadingAvatar || isUploadingCover}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Lưu</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Stats Overview */}
          {shopData && (
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Package,
                  label: "Đã bán",
                  value: shopData.totalSales || 0,
                  color: "text-green-500",
                },
                {
                  icon: Store,
                  label: "Acc đang bán",
                  value: shopData.totalAccsOnSale || 0,
                  color: "text-blue-500",
                },
                {
                  icon: Eye,
                  label: "Lượt xem",
                  value: (shopData.totalViews || 0).toLocaleString("vi-VN"),
                  color: "text-purple-500",
                },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-xl p-3 text-center">
                  <stat.icon
                    className={cn("w-5 h-5 mx-auto mb-1", stat.color)}
                  />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Ảnh bìa Shop
            </label>
            <div
              className={cn(
                "relative h-40 rounded-2xl overflow-hidden bg-muted cursor-pointer group",
                isUploadingCover && "pointer-events-none opacity-70"
              )}
              onClick={() => coverInputRef.current?.click()}
            >
              {formData.shopCover ? (
                <Image
                  src={formData.shopCover}
                  alt="Cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 600px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              {isUploadingCover ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Thay đổi ảnh bìa</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
            <p className="text-xs text-muted-foreground">
              Kích thước khuyến nghị: 1200x400px
            </p>
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <label className="font-semibold flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              Logo Shop
            </label>
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "relative w-24 h-24 rounded-2xl overflow-hidden bg-muted cursor-pointer group",
                  isUploadingAvatar && "pointer-events-none opacity-70"
                )}
                onClick={() => avatarInputRef.current?.click()}
              >
                {formData.shopAvatar ? (
                  <Image
                    src={formData.shopAvatar}
                    alt="Avatar"
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Store className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {isUploadingAvatar ? (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {formData.shopName || "Shop của bạn"}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  {shopData?.isVerified && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Đã xác minh
                    </>
                  )}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  disabled={isUploadingAvatar}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 mr-2" />
                  )}
                  Đổi logo
                </Button>
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Shop Name */}
          <div className="space-y-2">
            <label className="font-semibold">
              Tên Shop <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.shopName}
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
              placeholder="Nhập tên shop của bạn"
              disabled={!!shopData?.shopName}
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all",
                shopData?.shopName && "opacity-60 cursor-not-allowed bg-muted"
              )}
            />
            {shopData?.shopSlug ? (
              <p className="text-xs text-muted-foreground">
                Link shop: taphoagame.online/shop/{shopData.shopSlug}
                <br />
                <span className="text-amber-500">
                  ⚠️ Tên shop không thể thay đổi sau khi đã tạo
                </span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Tên shop sẽ không thể thay đổi sau khi tạo
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Mô tả Shop
            </label>
            <textarea
              value={formData.shopDesc}
              onChange={(e) =>
                setFormData({ ...formData, shopDesc: e.target.value })
              }
              placeholder="Giới thiệu về shop của bạn, kinh nghiệm, cam kết..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Mô tả hấp dẫn giúp khách hàng tin tưởng shop hơn
            </p>
          </div>

          {/* Featured Games */}
          <div className="space-y-2">
            <label className="font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Game bán chủ yếu
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableGames.map((game) => {
                const isSelected = formData.featuredGames.includes(game);
                return (
                  <button
                    key={game}
                    type="button"
                    onClick={async () => {
                      let newGames: string[];
                      if (isSelected) {
                        newGames = formData.featuredGames.filter(
                          (g) => g !== game
                        );
                      } else {
                        if (formData.featuredGames.length >= 2) {
                          toast.error("Chỉ được chọn tối đa 2 game");
                          return;
                        }
                        newGames = [...formData.featuredGames, game];
                      }

                      // Update local state
                      setFormData({
                        ...formData,
                        featuredGames: newGames,
                      });

                      // Auto-save to server if shop exists
                      if (shopData?.shopName) {
                        try {
                          const res = await fetch("/api/v1/seller/shop", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ featuredGames: newGames }),
                          });

                          if (res.ok) {
                            toast.success(
                              isSelected ? "Đã xóa game" : "Đã thêm game"
                            );
                          }
                        } catch (error) {
                          console.error("Auto-save error:", error);
                        }
                      }
                    }}
                    className={cn(
                      "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 border-border hover:border-primary/50"
                    )}
                  >
                    {game}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Chọn tối đa 3 game sẽ hiển thị trên card shop của bạn.{" "}
              <span className="text-primary font-medium">
                ✨ Tự động lưu khi click
              </span>
            </p>
          </div>

          {/* VIP Upgrade */}
          <div className="glass-card rounded-2xl p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                {shopData?.isVipShop &&
                shopData.vipShopEndTime &&
                new Date(shopData.vipShopEndTime) > new Date() ? (
                  <>
                    <h3 className="font-bold text-lg text-amber-500">
                      🎉 Shop VIP đang hoạt động
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Phí hoa hồng:{" "}
                      <span className="font-bold text-green-600">
                        {shopData.commissionRate}%
                      </span>
                      <br />
                      Hiệu lực đến:{" "}
                      <span className="font-bold">
                        {new Date(shopData.vipShopEndTime).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                      onClick={() => router.push("/seller/vip")}
                    >
                      Gia hạn VIP
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-amber-500">
                      Nâng cấp Shop VIP
                    </h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Shop hiển thị đầu trang chủ
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Badge VIP nổi bật
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Giảm phí từ 5% → 3%
                      </li>
                    </ul>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Phí hiện tại:{" "}
                      <span className="font-bold">
                        {shopData?.commissionRate || 5}%
                      </span>
                    </p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                      onClick={() => router.push("/seller/vip")}
                    >
                      Xem gói VIP
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* View Shop */}
          {shopData?.shopSlug && (
            <Link href={`/shop/${shopData.shopSlug}`}>
              <Button variant="outline" className="w-full gap-2 h-12">
                <ExternalLink className="w-4 h-4" />
                Xem trang Shop của bạn
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
