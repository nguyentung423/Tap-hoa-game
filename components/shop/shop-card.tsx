"use client";

import Link from "next/link";
import Image from "next/image";
import { Shop } from "@/types";
import {
  ShoppingBag,
  Package,
  CheckCircle2,
  Crown,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopCardProps {
  shop: Shop;
  className?: string;
  variant?: "default" | "strategic" | "developing"; // Size variant
  priority?: boolean; // Image loading priority
}

export function ShopCard({
  shop,
  className,
  variant = "default",
  priority = false,
}: ShopCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Handle both API formats: shopName (from DB) or name (from type)
  const shopName = (shop as any).shopName || shop.name || "Shop";
  const shopSlug = (shop as any).shopSlug || shop.slug;
  const shopAvatar = (shop as any).shopAvatar || shop.avatar;
  const shopCover = (shop as any).shopCover || shop.coverImage;
  const isVipShop = (shop as any).isVipShop || false;
  const vipShopEndTime = (shop as any).vipShopEndTime;
  const isStrategicPartner = (shop as any).isStrategicPartner || false;
  const isVerified = shop.isVerified || false;

  // Check if VIP is still active
  const isVipActive =
    isVipShop && vipShopEndTime && new Date(vipShopEndTime) > new Date();

  // Determine if this is a developing shop (not VIP, not Strategic)
  const isDevelopingShop =
    variant === "developing" || (!isStrategicPartner && !isVipActive);

  return (
    <Link
      href={`/shop/${shopSlug}`}
      className={cn(
        "group block bg-card rounded-xl overflow-hidden border transition-all duration-300",
        isStrategicPartner
          ? "border-2 border-cyan-400/70 hover:border-cyan-300 shadow-xl shadow-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/40 animate-pulse-border-strategic"
          : isVipActive
          ? "border-2 border-yellow-500/70 hover:border-yellow-400 shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 animate-pulse-border"
          : "border-2 border-green-500/50 hover:border-green-400 shadow-md shadow-green-500/10 hover:shadow-lg hover:shadow-green-500/20",
        className
      )}
    >
      {/* Cover Image */}
      <div
        className={cn(
          "relative bg-gradient-to-br overflow-hidden h-20 sm:h-24",
          isStrategicPartner
            ? "from-cyan-400/20 via-blue-400/20 to-sky-300/20"
            : isVipActive
            ? "from-yellow-500/20 to-orange-500/20"
            : "from-green-500/20 via-emerald-500/20 to-teal-500/20"
        )}
      >
        {shopCover && (
          <Image
            src={shopCover}
            alt={shopName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            quality={85}
          />
        )}
        {/* Animated Shine Effect */}
        <div
          className={cn(
            "absolute inset-0 animate-shine",
            isStrategicPartner
              ? "bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent animate-shine-electric"
              : isVipActive
              ? "bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"
              : "bg-gradient-to-r from-transparent via-green-400/25 to-transparent"
          )}
          style={{
            transform: "translateX(-100%)",
            width: "200%",
          }}
        />
        {/* Strategic Partner Badge - Top Right */}
        {isStrategicPartner && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 text-slate-900 shadow-xl animate-glow-strategic">
            <Shield className="w-4 h-4 animate-bounce-slow" />
            <span className="text-xs font-bold tracking-wide">
              ĐỐI TÁC CHIẾN LƯỢC
            </span>
          </div>
        )}
        {/* VIP Badge - Top Right */}
        {!isStrategicPartner && isVipActive && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 shadow-lg animate-glow">
            <Crown className="w-3.5 h-3.5 animate-bounce-slow" />
            <span className="text-xs font-bold">VIP</span>
          </div>
        )}
        {/* Developing Shop Badge - Top Right */}
        {!isStrategicPartner && !isVipActive && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-green-950 shadow-md">
            <span className="text-xs font-bold">ĐANG PHÁT TRIỂN</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-3 pb-3">
        {/* Avatar */}
        <div className="absolute left-3 -top-6">
          <div
            className={cn(
              "relative rounded-full overflow-hidden border-3 bg-muted shadow-lg w-12 h-12 border-card",
              isStrategicPartner && "ring-2 ring-cyan-400/50"
            )}
          >
            {shopAvatar ? (
              <Image
                src={shopAvatar}
                alt={shopName}
                fill
                sizes="64px"
                className="object-cover"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                quality={85}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                {shopName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Shop Info */}
        <div className="pt-7">
          {/* Name & Rating */}
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "font-semibold text-sm text-foreground truncate transition-colors flex-1",
                isStrategicPartner
                  ? "group-hover:text-cyan-500"
                  : isVipActive
                  ? "group-hover:text-yellow-500"
                  : "group-hover:text-green-500"
              )}
            >
              {shopName}
            </h3>
            {/* Show star icon always, show rating number only if has reviews */}
            <div className="flex items-center gap-0.5 text-yellow-500 flex-shrink-0">
              <span className="text-xs">⭐</span>
              {shop.totalReviews && shop.totalReviews > 0 && shop.rating && (
                <span className="text-xs font-medium">
                  {shop.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          {/* Verified Badge */}
          {isVerified && (
            <div className="flex items-center gap-1 mt-1.5">
              <CheckCircle2
                className={cn(
                  "w-3 h-3",
                  isStrategicPartner
                    ? "text-cyan-500"
                    : isVipActive
                    ? "text-yellow-500"
                    : "text-green-500"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isStrategicPartner
                    ? "text-cyan-500"
                    : isVipActive
                    ? "text-yellow-500"
                    : "text-green-500"
                )}
              >
                Đã xác minh
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              <span>{shop.totalAccs ?? 0} acc</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{formatNumber(shop.totalSales)} bán</span>
            </div>
          </div>

          {/* Featured Games */}
          {shop.featuredGames && shop.featuredGames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {shop.featuredGames.slice(0, 2).map((game) => (
                <span
                  key={game}
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full font-medium",
                    isStrategicPartner
                      ? "bg-cyan-500/10 text-cyan-500"
                      : isVipActive
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-green-500/10 text-green-500"
                  )}
                >
                  {game}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
