"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Clock, Sparkles, Star, Shield, CheckCircle2 } from "lucide-react";

import { cn, formatPriceShort, getCountdown } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Acc } from "@/types";

interface AccCardProps {
  acc: Acc;
  index?: number;
  priority?: boolean;
}

export function AccCard({ acc, index = 0, priority = false }: AccCardProps) {
  const [countdown, setCountdown] = useState(
    acc.vipEndTime ? getCountdown(acc.vipEndTime) : null
  );

  useEffect(() => {
    if (!acc.vipEndTime) return;

    const timer = setInterval(() => {
      setCountdown(getCountdown(acc.vipEndTime!));
    }, 1000);

    return () => clearInterval(timer);
  }, [acc.vipEndTime]);

  // Calculate discount percent
  const discountPercent = acc.originalPrice
    ? Math.round(((acc.originalPrice - acc.price) / acc.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/acc/${acc.slug}`}>
        <div
          className={cn(
            "group relative overflow-hidden rounded-xl border border-border/50 bg-card",
            "transition-all duration-300 hover:border-primary/50",
            "hover:shadow-lg hover:-translate-y-1",
            "active:scale-[0.98]"
          )}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={acc.thumbnail}
              alt={acc.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
              {acc.isVip && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold">
                  <Sparkles className="h-3 w-3" />
                  VIP
                </span>
              )}
              {acc.isHot && (
                <span className="px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold">
                  🔥 HOT
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Game Badge */}
            <div className="absolute right-2 top-2">
              <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                {acc.gameName.length > 12
                  ? acc.gameName.split(" ").slice(0, 2).join(" ")
                  : acc.gameName}
              </span>
            </div>

            {/* VIP Countdown */}
            {acc.isVip && countdown && !countdown.isExpired && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 backdrop-blur-sm">
                  <Clock className="h-3 w-3 text-primary animate-pulse" />
                  <span className="text-xs font-medium text-primary">
                    {countdown.days > 0 && `${countdown.days}d `}
                    {String(countdown.hours).padStart(2, "0")}:
                    {String(countdown.minutes).padStart(2, "0")}:
                    {String(countdown.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            )}

            {/* Stats overlay */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-white/80">
              <Eye className="h-3 w-3" />
              <span>{acc.views}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Title */}
            <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-tight group-hover:text-primary transition-colors">
              {acc.title}
            </h3>

            {/* Quick Attributes */}
            <div className="mb-3 flex flex-wrap gap-1">
              {(Array.isArray(acc.attributes) ? acc.attributes : [])
                .slice(0, 3)
                .map((attr, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {attr.label}: {attr.value}
                  </span>
                ))}
            </div>

            {/* Price & Shop */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary">
                  {formatPriceShort(acc.price)}
                </span>
                {acc.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPriceShort(acc.originalPrice)}
                  </span>
                )}
              </div>

              {/* Shop info */}
              {acc.shop && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {acc.shop.avatar ? (
                      <Image
                        src={acc.shop.avatar}
                        alt={acc.shop.name}
                        width={20}
                        height={20}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-[10px] font-medium">
                        {acc.shop.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="truncate max-w-[60px]">{acc.shop.name}</span>
                  {acc.shop.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default AccCard;
