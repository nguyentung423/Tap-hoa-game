"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Clock,
  Filter,
  Loader2,
  Star,
  User,
  Calendar,
  Crown,
  Shield,
} from "lucide-react";

import { Shop, Acc } from "@/types";
import { Button } from "@/components/ui/button";
import { AccCard } from "@/components/acc/acc-card";
import { GAMES } from "@/types/game";
import { cn } from "@/lib/utils";
import { getAdminZaloLink } from "@/config/site";

interface ShopDetailClientProps {
  shop: Shop;
  initialAccs?: any[]; // Server-fetched accs for instant display
}

interface Review {
  id: string;
  rating: number;
  content: string | null;
  buyerName: string;
  createdAt: string;
}

export function ShopDetailClient({
  shop,
  initialAccs = [],
}: ShopDetailClientProps) {
  const [selectedGame, setSelectedGame] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">(
    "newest"
  );
  const [allAccs, setAllAccs] = useState<Acc[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(initialAccs.length === 0); // Don't show loading if we have initial data
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [displayCount, setDisplayCount] = useState(6);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initialize with server-fetched accs for instant display
  useEffect(() => {
    if (initialAccs.length > 0) {
      const transformedAccs: Acc[] = initialAccs.map((acc: any) => ({
        id: acc.id,
        title: acc.title,
        slug: acc.slug,
        description: acc.description,
        price: acc.price,
        originalPrice: acc.originalPrice,
        thumbnail: acc.thumbnail,
        images: acc.images || [],
        gameId: acc.game?.id || "",
        gameSlug: acc.game?.slug || "",
        gameName: acc.game?.name || "",
        gameIcon: acc.game?.icon || "",
        sellerId: shop.ownerId,
        sellerName: shop.name,
        sellerSlug: shop.slug,
        sellerAvatar: shop.avatar,
        isVerified: shop.isVerified,
        attributes: {},
        status: "approved",
        isVip: acc.isVip,
        isHot: acc.isHot,
        views: acc.views,
        createdAt: acc.createdAt,
        updatedAt: acc.createdAt,
        shop: {
          id: shop.id,
          name: shop.name,
          slug: shop.slug,
          avatar: shop.avatar,
          isVerified: shop.isVerified,
          isVipShop: shop.isVipShop,
          isStrategicPartner: shop.isStrategicPartner,
          rating: shop.rating,
          totalSales: shop.totalSales,
        },
      }));
      setAllAccs(transformedAccs);
      setHasMore(transformedAccs.length >= 20);
    }
  }, [initialAccs, shop]);

  // Fetch shop's accs from API with pagination
  const fetchAccs = async (pageNum: number = 1, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const params = new URLSearchParams({
        limit: "20",
        page: pageNum.toString(),
      });

      if (selectedGame) {
        params.set("game", selectedGame);
      }

      const res = await fetch(
        `/api/v1/shops/${shop.slug}?${params.toString()}`
      );
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

          if (append) {
            setAllAccs((prev) => [...prev, ...accs]);
          } else {
            setAllAccs(accs);
          }

          // Check if there's more data
          const pagination = data.data.pagination;
          setHasMore(pagination && pagination.page < pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching shop accs:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    setPage(1);
    fetchAccs(1, false);
  }, [shop.slug, selectedGame]);

  // Load more function
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAccs(nextPage, true);
  };

  // Fetch shop reviews
  useEffect(() => {
    async function fetchReviews() {
      setIsLoadingReviews(true);
      try {
        const res = await fetch(`/api/v1/shops/${shop.slug}/reviews`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reviews) {
            setReviews(data.reviews);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [shop.slug]);

  // Filter and sort - client side for already loaded data
  const filteredAccs = useMemo(() => {
    let accs = [...allAccs];

    // Sort (game filter now handled by API)
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
  }, [allAccs, sortBy]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(6);
  }, [sortBy]);

  // Get unique games from this shop's accs
  const shopGames = useMemo(() => {
    const gameSlugs = [...new Set(allAccs.map((acc) => acc.gameSlug))].filter(
      (slug) => slug
    );
    const games = GAMES.filter((g) => gameSlugs.includes(g.slug));
    console.log("Shop games:", {
      gameSlugs,
      foundGames: games,
      allAccs: allAccs.length,
    });
    return games;
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
      <div className="container py-2">
        <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Link>
        </Button>
      </div>

      {/* Shop Header */}
      <section className="relative">
        {/* Cover Image */}
        <div className="h-24 sm:h-32 md:h-40 relative bg-gradient-to-br from-primary/20 to-secondary/20">
          {shop.coverImage && (
            <Image
              src={shop.coverImage}
              alt={shop.name}
              fill
              sizes="100vw"
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
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-background bg-muted shadow-xl"
            >
              {shop.avatar ? (
                <Image
                  src={shop.avatar}
                  alt={shop.name}
                  fill
                  sizes="(max-width: 768px) 112px, 144px"
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

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {/* Verified badge - Color matches shop tier */}
                    {shop.isVerified && (
                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          shop.isStrategicPartner
                            ? "text-cyan-500"
                            : shop.isVipShop
                            ? "text-yellow-500"
                            : "text-green-500"
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">Đã xác minh</span>
                      </div>
                    )}

                    {/* Strategic Partner badge - Cyan/Blue (same as card) */}
                    {shop.isStrategicPartner && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-300 text-slate-900 shadow-xl">
                        <Shield className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-bold tracking-wide">
                          ĐỐI TÁC CHIẾN LƯỢC
                        </span>
                      </div>
                    )}

                    {/* VIP Shop badge - Yellow gradient (same as card) */}
                    {!shop.isStrategicPartner && shop.isVipShop && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 shadow-lg">
                        <Crown className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-bold">VIP</span>
                      </div>
                    )}

                    {/* Developing Shop badge - Green gradient (same as card) */}
                    {!shop.isStrategicPartner && !shop.isVipShop && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-green-950 shadow-md">
                        <span className="text-sm font-bold">
                          ĐANG PHÁT TRIỂN
                        </span>
                      </div>
                    )}
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
                        className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary flex items-center gap-1.5"
                      >
                        <span className="text-xl">{game.icon}</span> {game.name}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAccs.slice(0, displayCount).map((acc, index) => (
                <AccCard
                  key={acc.id}
                  acc={acc}
                  index={index}
                  priority={index < 6}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  className="px-8"
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Đang tải...
                    </>
                  ) : (
                    `Xem thêm`
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Shop chưa có acc nào{selectedGame ? " cho game này" : ""}</p>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="container py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Đánh giá từ khách hàng</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {shop.rating > 0 ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(shop.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold">
                    {shop.rating.toFixed(1)}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Chưa có đánh giá</span>
              )}
            </div>
            {shop.totalReviews > 0 && (
              <span className="text-muted-foreground">
                ({shop.totalReviews} đánh giá)
              </span>
            )}
          </div>
        </div>

        {isLoadingReviews ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{review.buyerName}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.content && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {review.content}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
