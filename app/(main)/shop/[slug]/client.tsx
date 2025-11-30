"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Package,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Clock,
  Filter,
  Loader2,
} from "lucide-react";

import { Shop, Acc } from "@/types";
import { Button } from "@/components/ui/button";
import { AccCard } from "@/components/acc/acc-card";
import { GAMES } from "@/types/game";
import { cn } from "@/lib/utils";
import { getAdminZaloLink } from "@/config/site";

interface ShopDetailClientProps {
  shop: Shop;
}

export function ShopDetailClient({ shop }: ShopDetailClientProps) {
  const [selectedGame, setSelectedGame] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest"
  );
  const [allAccs, setAllAccs] = useState<Acc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch shop's accs from API
  useEffect(() => {
    async function fetchAccs() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/shops/${shop.slug}?limit=100`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.accs) {
            // Transform API response to Acc type
            const accs: Acc[] = data.data.accs.map((acc: any) => ({
              id: acc.id,
              title: acc.title,
              slug: acc.slug,
              description: acc.description,
              price: acc.price,
              originalPrice: acc.originalPrice,
              thumbnail: acc.thumbnail,
              images: acc.images || [],
              gameSlug: acc.game?.slug || "",
              gameName: acc.game?.name || "",
              gameIcon: acc.game?.icon || "",
              sellerId: acc.sellerId,
              sellerName: shop.name,
              sellerSlug: shop.slug,
              sellerAvatar: shop.avatar,
              isVerified: shop.isVerified,
              attributes: acc.attributes || {},
              status: acc.status?.toLowerCase() || "active",
              isVip: acc.isVip,
              views: acc.views,
              createdAt: acc.createdAt,
              updatedAt: acc.updatedAt,
            }));
            setAllAccs(accs);
          }
        }
      } catch (error) {
        console.error("Error fetching shop accs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAccs();
  }, [shop.slug, shop.name, shop.avatar, shop.isVerified]);

  // Filter and sort
  const filteredAccs = useMemo(() => {
    let accs = [...allAccs];

    // Filter by game
    if (selectedGame) {
      accs = accs.filter((acc) => acc.gameSlug === selectedGame);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        accs.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        accs.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        accs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return accs;
  }, [allAccs, selectedGame, sortBy]);

  // Get unique games from this shop's accs
  const shopGames = useMemo(() => {
    const gameSlugs = [...new Set(allAccs.map((acc) => acc.gameSlug))];
    return GAMES.filter((g) => gameSlugs.includes(g.slug));
  }, [allAccs]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
    });
  };

  // Contact via admin (trung gian)
  const handleContact = () => {
    const url = getAdminZaloLink(
      `Hỏi về shop ${shop.name}`,
      undefined,
      typeof window !== "undefined" ? window.location.href : undefined
    );
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="container pt-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      </div>

      {/* Shop Header */}
      <section className="relative">
        {/* Cover Image */}
        <div className="h-32 sm:h-48 md:h-56 relative bg-gradient-to-br from-primary/20 to-secondary/20">
          {shop.coverImage && (
            <Image
              src={shop.coverImage}
              alt={shop.name}
              fill
              className="object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Shop Info */}
        <div className="container relative">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-background bg-muted shadow-xl"
            >
              {shop.avatar ? (
                <Image
                  src={shop.avatar}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-4xl">
                  {shop.name.charAt(0)}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  {/* Name */}
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {shop.name}
                  </h1>

                  {/* Verified badge */}
                  {shop.isVerified && (
                    <div className="flex items-center gap-1.5 mt-1 text-green-500">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">Đã xác minh</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {shop.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      ({formatNumber(shop.totalReviews)} đánh giá)
                    </span>
                  </div>

                  {/* Description */}
                  {shop.description && (
                    <p className="mt-3 text-muted-foreground max-w-2xl">
                      {shop.description}
                    </p>
                  )}
                </div>

                {/* Contact Button - qua Admin */}
                <Button
                  size="lg"
                  onClick={handleContact}
                  className="sm:self-start"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Hỏi về Shop này
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-6 py-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{shop.totalAccs}</span>
                  <span className="text-muted-foreground">Acc đang bán</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">
                    {formatNumber(shop.totalSales)}
                  </span>
                  <span className="text-muted-foreground">Đã bán</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Tham gia từ {formatDate(shop.createdAt)}
                  </span>
                </div>
              </div>

              {/* Featured Games */}
              {shop.featuredGames && shop.featuredGames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {shop.featuredGames.map((gameSlug) => {
                    const game = GAMES.find((g) => g.slug === gameSlug);
                    return game ? (
                      <span
                        key={gameSlug}
                        className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
                      >
                        {game.icon} {game.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Accs Section */}
      <section className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold">
            Acc đang bán ({isLoading ? "..." : filteredAccs.length})
          </h2>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Game filter */}
            {shopGames.length > 1 && (
              <select
                value={selectedGame || ""}
                onChange={(e) => setSelectedGame(e.target.value || undefined)}
                className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
              >
                <option value="">Tất cả game</option>
                {shopGames.map((game) => (
                  <option key={game.slug} value={game.slug}>
                    {game.name}
                  </option>
                ))}
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
            </select>
          </div>
        </div>

        {/* Acc Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredAccs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAccs.map((acc) => (
              <AccCard key={acc.id} acc={acc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Shop chưa có acc nào{selectedGame ? " cho game này" : ""}</p>
          </div>
        )}
      </section>
    </div>
  );
}
