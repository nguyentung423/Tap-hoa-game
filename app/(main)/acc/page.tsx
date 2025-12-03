"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccCard } from "@/components/acc/acc-card";
import { Acc } from "@/types";
import { transformApiAcc } from "@/lib/transforms/acc";

export default function AccListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameFromUrl = searchParams.get("game");
  const sortFromUrl = searchParams.get("sort");
  const searchFromUrl = searchParams.get("q");

  const [accs, setAccs] = useState<Acc[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string | undefined>(
    gameFromUrl || undefined
  );
  const [sortBy, setSortBy] = useState<string>(sortFromUrl || "newest");
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || "");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Update URL when filters change
  const updateUrl = (game?: string, sort?: string, search?: string) => {
    const params = new URLSearchParams();
    if (game) params.set("game", game);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (search) params.set("q", search);
    const queryString = params.toString();
    router.push(queryString ? `/acc?${queryString}` : "/acc", {
      scroll: false,
    });
  };

  // Fetch games from API
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoadingGames(true);
      try {
        const res = await fetch("/api/v1/games", {
          next: { revalidate: 60 }, // Cache 60s
        });
        if (res.ok) {
          const data = await res.json();
          setGames(data.data || data || []);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setIsLoadingGames(false);
      }
    };
    fetchGames();
  }, []);

  // Fetch accs from API
  useEffect(() => {
    const fetchAccs = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedGame) params.set("game", selectedGame);
        if (searchQuery) params.set("q", searchQuery);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        // Convert sort values to API format
        const sortMap: Record<string, string> = {
          newest: "newest",
          oldest: "oldest",
          "price-asc": "price_asc",
          "price-desc": "price_desc",
          popular: "views",
        };
        params.set("sort", sortMap[sortBy] || "newest");

        const res = await fetch(`/api/v1/accs?${params.toString()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          const items = data.data?.items || data.items || [];
          const sellers = data.data?.sellers || data.sellers || {};
          const games = data.data?.games || data.games || {};

          console.log("Fetched accs:", items.length, "items");

          // Denormalize on client: attach seller and game data to each acc
          const denormalizedAccs = items.map((acc: any) => {
            const seller = sellers[acc.sellerId];
            const game = games[acc.gameId];
            return transformApiAcc({
              ...acc,
              seller,
              game,
            });
          });

          setAccs(denormalizedAccs);
        } else {
          console.error("Accs API error:", res.status, await res.text());
          setAccs([]);
        }
      } catch (error) {
        console.error("Error fetching accs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccs();
  }, [selectedGame, sortBy, searchQuery, minPrice, maxPrice]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(selectedGame, sortBy, searchQuery);
  };

  // Handle game selection
  const handleGameSelect = (game?: string) => {
    setSelectedGame(game);
    updateUrl(game, sortBy, searchQuery);
    setShowMobileFilters(false);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateUrl(selectedGame, sort, searchQuery);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedGame(undefined);
    setSortBy("newest");
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/acc", { scroll: false });
  };

  const hasActiveFilters =
    selectedGame || searchQuery || minPrice || maxPrice || sortBy !== "newest";

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Danh sách Acc</h1>
        <p className="text-muted-foreground">
          {isLoading ? "Đang tải..." : `${accs.length} acc đang được bán`}
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm acc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
          <Button
            type="button"
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Đang lọc:</span>
          {selectedGame && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {games.find((g: any) => g.slug === selectedGame)?.name}
              <button
                onClick={() => handleGameSelect(undefined)}
                className="hover:text-primary/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="hover:text-primary/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {minPrice && maxPrice
                ? `${Number(minPrice).toLocaleString()}đ - ${Number(
                    maxPrice
                  ).toLocaleString()}đ`
                : minPrice
                ? `Từ ${Number(minPrice).toLocaleString()}đ`
                : `Đến ${Number(maxPrice).toLocaleString()}đ`}
              <button
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="hover:text-primary/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <div
          className={cn(
            "lg:w-64 shrink-0",
            showMobileFilters ? "block" : "hidden lg:block"
          )}
        >
          <div className="sticky top-24 space-y-6">
            {/* Game filter */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold mb-3">Game</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleGameSelect(undefined)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    !selectedGame
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  Tất cả game
                </button>
                {isLoadingGames ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-9 bg-muted rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  games
                    .filter((g: any) => g.isActive)
                    .map((game: any) => (
                      <button
                        key={game.slug}
                        onClick={() => handleGameSelect(game.slug)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                          selectedGame === game.slug
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <span className="text-xl">{game.icon}</span>
                        <span>{game.name}</span>
                      </button>
                    ))
                )}

                {/* Coming soon games */}
                {!isLoadingGames &&
                  games.filter((g: any) => !g.isActive).length > 0 && (
                    <div className="pt-2 mt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2 px-3">
                        Sắp ra mắt
                      </p>
                      {games
                        .filter((g: any) => !g.isActive)
                        .map((game: any) => (
                          <div
                            key={game.slug}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 opacity-50 cursor-not-allowed"
                          >
                            <span className="text-xl">{game.icon}</span>
                            <span>{game.name}</span>
                            <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-500 font-bold">
                              Soon
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Price filter */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold mb-3">Khoảng giá</h3>
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="text-sm"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: "< 100k", min: "", max: "100000" },
                    { label: "100k-500k", min: "100000", max: "500000" },
                    { label: "500k-1tr", min: "500000", max: "1000000" },
                    { label: "> 1tr", min: "1000000", max: "" },
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        setMinPrice(range.min);
                        setMaxPrice(range.max);
                      }}
                      className={cn(
                        "px-2 py-1 text-xs rounded-md border transition-colors",
                        minPrice === range.min && maxPrice === range.max
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold mb-3">Sắp xếp</h3>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full p-2 rounded-lg bg-background border border-border text-sm"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="popular">Phổ biến nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Acc grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : accs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {accs.map((acc) => (
                <AccCard key={acc.id} acc={acc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">
                Không tìm thấy acc nào
              </h3>
              <p className="text-muted-foreground mb-4">
                Thử thay đổi bộ lọc hoặc tìm kiếm game khác
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Xem tất cả acc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
