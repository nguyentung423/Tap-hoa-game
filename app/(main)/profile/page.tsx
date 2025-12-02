"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Eye,
  ShoppingBag,
  Settings,
  Plus,
  LayoutDashboard,
  Store,
  BadgeCheck,
  Shield,
  TrendingUp,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProfileData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  shopName?: string;
  shopSlug?: string;
  shopDesc?: string;
  shopAvatar?: string;
  shopCover?: string;
  featuredGames: string[];
  isVipShop: boolean;
  vipShopEndTime?: string;
  isStrategicPartner: boolean;
  partnerTier?: string;
  role: string;
  status: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalViews: number;
  commissionRate: number;
  createdAt: string;
  approvedAt?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/v1/profile");
      const json = await res.json();

      if (json.success) {
        setProfileData(json.data);

        if (json.data.status === "PENDING") {
          router.replace("/seller/pending");
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          Không tìm thấy thông tin profile
        </div>
      </div>
    );
  }

  // Determine shop tier
  const isStrategicPartner = profileData.isStrategicPartner;
  const isVipActive =
    profileData.isVipShop &&
    (!profileData.vipShopEndTime ||
      new Date(profileData.vipShopEndTime) > new Date());

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header with cover */}
      <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/seller/dashboard">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/seller/shop">
              <Settings className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4">
        {/* Profile Card */}
        <div className="relative -mt-16 sm:-mt-20 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background bg-muted overflow-hidden">
                  {profileData.shopAvatar || profileData.avatar ? (
                    <Image
                      src={profileData.shopAvatar || profileData.avatar || ""}
                      alt={profileData.shopName || profileData.name}
                      width={128}
                      height={128}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {profileData.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate">
                    {profileData.shopName || profileData.name}
                  </h1>
                  {isStrategicPartner && (
                    <span className="shrink-0 px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Đối tác
                    </span>
                  )}
                  {isVipActive && !isStrategicPartner && (
                    <span className="shrink-0 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      VIP
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>{profileData.email}</span>
                  <span>•</span>
                  <span>Phí: {profileData.commissionRate}%</span>
                </div>

                {profileData.shopDesc && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {profileData.shopDesc}
                  </p>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" asChild>
                    <Link href="/seller/post">
                      <Plus className="w-4 h-4 mr-2" />
                      Đăng acc
                    </Link>
                  </Button>
                  {profileData.shopSlug && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/shop/${profileData.shopSlug}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Xem shop
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Sales */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-green-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold truncate">
                  {profileData.totalSales}
                </p>
                <p className="text-xs text-muted-foreground">Đã bán</p>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold truncate">
                  {profileData.totalViews.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Lượt xem</p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold truncate">
                  {profileData.rating.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Đánh giá</p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold truncate">
                  {profileData.totalReviews}
                </p>
                <p className="text-xs text-muted-foreground">Nhận xét</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Thông tin tài khoản
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Ngày tham gia
              </p>
              <p className="font-medium">
                {new Date(profileData.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            {profileData.approvedAt && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Ngày được duyệt
                </p>
                <p className="font-medium">
                  {new Date(profileData.approvedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
              <p className="font-medium">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    profileData.status === "APPROVED"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {profileData.status === "APPROVED"
                    ? "Đã duyệt"
                    : profileData.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Vai trò</p>
              <p className="font-medium">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted">
                  {profileData.role === "SELLER"
                    ? "Người bán"
                    : profileData.role}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
