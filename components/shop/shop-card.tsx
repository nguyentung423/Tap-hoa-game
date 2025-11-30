"use client";

import Link from "next/link";
import Image from "next/image";
import { Shop } from "@/types";
import { ShoppingBag, Package, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopCardProps {
  shop: Shop;
  className?: string;
}

export function ShopCard({ shop, className }: ShopCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <Link
      href={`/shop/${shop.slug}`}
      className={cn(
        "group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative h-24 sm:h-28 bg-gradient-to-br from-primary/20 to-secondary/20">
        {shop.coverImage && (
          <Image
            src={shop.coverImage}
            alt={shop.name}
            fill
            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-4 pb-4">
        {/* Avatar */}
        <div className="absolute -top-8 left-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-4 border-card bg-muted shadow-lg">
            {shop.avatar ? (
              <Image
                src={shop.avatar}
                alt={shop.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                {shop.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Shop Info */}
        <div className="pt-10">
          {/* Name */}
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {shop.name}
          </h3>

          {/* Verified badge */}
          {shop.isVerified && (
            <div className="flex items-center gap-1 mt-1 text-green-500">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs font-medium">Đã xác minh</span>
            </div>
          )}

          {/* Total Sales */}
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{formatNumber(shop.totalSales)} đã bán</span>
          </div>

          {/* Description */}
          {shop.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {shop.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="w-4 h-4" />
              <span className="text-sm">{shop.totalAccs} acc</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm">
                {formatNumber(shop.totalSales)} đã bán
              </span>
            </div>
          </div>

          {/* Featured Games */}
          {shop.featuredGames && shop.featuredGames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {shop.featuredGames.slice(0, 3).map((game) => (
                <span
                  key={game}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
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
