"use client";

import dynamic from "next/dynamic";
import { Shield, Crown, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Lazy load ShopCard - reduces initial bundle
const ShopCard = dynamic(
  () => import("@/components/shop/shop-card").then((mod) => mod.ShopCard),
  {
    loading: () => (
      <div className="bg-card rounded-xl border border-border/50 animate-pulse">
        <div className="h-20 sm:h-24 bg-muted/50 rounded-t-xl" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-muted/50 rounded w-3/4" />
          <div className="h-3 bg-muted/50 rounded w-1/2" />
        </div>
      </div>
    ),
    ssr: true, // Keep SSR for SEO
  }
);

// Game quick filter chips
export function GameChips({
  selected,
  onSelect,
  games,
}: {
  selected?: string;
  onSelect: (slug?: string) => void;
  games: any[];
}) {
  const quickGames = [
    {
      slug: undefined,
      label: "Tất cả",
      icon: "🎮",
      isActive: true,
    },
    ...games.map((g: any) => ({
      slug: g.slug,
      label: g.name.split(" ").slice(0, 2).join(" "),
      icon: g.icon,
      isActive: g.isActive ?? false,
    })),
  ];

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
      {quickGames.map((game) => (
        <button
          key={game.slug || "all"}
          onClick={() => game.isActive && onSelect(game.slug)}
          disabled={!game.isActive}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/30 text-sm font-medium transition-all shrink-0",
            game.isActive && "hover:bg-muted cursor-pointer",
            !game.isActive && "opacity-60 cursor-not-allowed",
            selected === game.slug &&
              game.isActive &&
              "bg-primary text-primary-foreground border-primary"
          )}
        >
          <span className="text-xl">{game.icon}</span>
          <span>{game.label}</span>
          {!game.isActive && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-500 font-bold">
              Sắp ra mắt
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Strategic Partner Section
export function StrategicPartnerSection({ shops }: { shops: any[] }) {
  if (shops.length === 0) return null;

  return (
    <section id="shops" className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-400/10">
            <Shield className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Đối Tác Chiến Lược</h2>
            <p className="text-sm text-muted-foreground">
              Các shop đối tác lớn với uy tín được kiểm chứng
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop: any, index: number) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            variant="strategic"
            priority={index < 2}
          />
        ))}
      </div>
    </section>
  );
}

// VIP Shops Section
export function VipShopsSection({ shops }: { shops: any[] }) {
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <Crown className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Shop VIP</h2>
            <p className="text-sm text-muted-foreground">
              Top shop VIP uy tín nhất
            </p>
          </div>
        </div>
      </div>

      {shops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shops.map((shop: any) => (
            <ShopCard key={shop.id} shop={shop} priority={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Chưa có shop VIP nào</p>
        </div>
      )}
    </section>
  );
}

// Developing Shops Section
export function DevelopingShopsSection({
  shops,
  games,
  selectedGame,
  onSelectGame,
  showAll,
  onShowAll,
  totalCount,
}: {
  shops: any[];
  games: any[];
  selectedGame?: string;
  onSelectGame: (slug?: string) => void;
  showAll: boolean;
  onShowAll: () => void;
  totalCount: number;
}) {
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Shop Đang Phát Triển</h2>
            <p className="text-sm text-muted-foreground">
              Các shop mới và đang phát triển với nhiều lựa chọn
            </p>
          </div>
        </div>
      </div>

      {/* Game filter */}
      <div className="mb-6">
        <GameChips
          selected={selectedGame}
          onSelect={onSelectGame}
          games={games}
        />
      </div>

      {/* Shop grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shops.map((shop: any) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            variant="developing"
            priority={false}
          />
        ))}
      </div>

      {shops.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Chưa có shop đang phát triển nào
        </div>
      )}

      {/* Show more button */}
      {!showAll && totalCount > 12 && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onShowAll}
            className="gap-2"
          >
            Xem tất cả {totalCount} shop
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
