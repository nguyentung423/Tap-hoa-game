"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  Flame,
  Shield,
  Users,
  MessageCircle,
  Store,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShopCard } from "@/components/shop/shop-card";
import { AccCard } from "@/components/acc/acc-card";
import { SafetyPolicyButton } from "@/components/acc/safety-policy-button";
import { getApprovedShops } from "@/data/mock-shops";
import { GAMES } from "@/types/game";
import { siteConfig } from "@/config/site";
import { Acc } from "@/types";
import { transformApiAcc } from "@/lib/transforms/acc";

// Game quick filter chips - show ALL games, active ones can be clicked
function GameChips({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (slug?: string) => void;
}) {
  const quickGames = [
    { slug: undefined, label: "Tất cả", icon: "🎮", isActive: true },
    ...GAMES.map((g) => ({
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
          <span>{game.icon}</span>
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

// Feature card
function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-muted/30 border border-border/50"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

export default function HomePage() {
  const [selectedGame, setSelectedGame] = useState<string | undefined>();
  const [hotAccs, setHotAccs] = useState<Acc[]>([]);

  // Get approved shops - already filtered by active games in getApprovedShops
  const shops = getApprovedShops();

  // Fetch hot accs from API
  useEffect(() => {
    const fetchHotAccs = async () => {
      try {
        const res = await fetch("/api/v1/accs?limit=4&sort=newest");
        if (res.ok) {
          const data = await res.json();
          const items = data.data?.items || [];
          setHotAccs(items.map(transformApiAcc));
        }
      } catch (error) {
        console.error("Error fetching hot accs:", error);
      }
    };
    fetchHotAccs();
  }, []);

  // Filter shops by game
  const filteredShops = useMemo(() => {
    if (!selectedGame) return shops;
    return shops.filter((shop) => shop.featuredGames?.includes(selectedGame));
  }, [selectedGame, shops]);

  // Top shops by rating
  const topShops = [...shops]
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nơi hội tụ các shop game uy tín</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="text-primary">{siteConfig.name}</span>
              <br />
              Chợ Acc Game Uy Tín
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Khám phá các shop game uy tín, chọn acc ưng ý.
              <br />
              Giao dịch an toàn qua trung gian Zalo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="text-base">
                <Link href="#shops">
                  <Store className="w-5 h-5 mr-2" />
                  Khám phá các Shop
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/seller">Mở Shop của bạn</Link>
              </Button>
            </motion.div>

            {/* Safety Policy Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mt-4"
            >
              <SafetyPolicyButton className="text-base" />
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="container pb-12">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {shops.length}+
              </div>
              <div className="text-sm text-muted-foreground">Shop uy tín</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                500+
              </div>
              <div className="text-sm text-muted-foreground">Acc đang bán</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                2000+
              </div>
              <div className="text-sm text-muted-foreground">Giao dịch</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Shield}
            title="Giao dịch an toàn"
            desc="Trung gian giữ tiền, đảm bảo quyền lợi cả người mua và người bán."
          />
          <FeatureCard
            icon={MessageCircle}
            title="Hỗ trợ qua Zalo"
            desc="Tạo nhóm Zalo 3 người để giao dịch minh bạch, nhanh chóng."
          />
          <FeatureCard
            icon={Users}
            title="Shop được xác thực"
            desc="Tất cả shop đều được admin duyệt và xác minh trước khi hoạt động."
          />
        </div>
      </section>

      {/* Top Shops */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Shop Nổi Bật</h2>
              <p className="text-sm text-muted-foreground">
                Các shop có nhiều giao dịch nhất
              </p>
            </div>
          </div>
          <Button asChild variant="ghost">
            <Link href="#shops">
              Xem tất cả
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* Hot Accs */}
      {hotAccs.length > 0 && (
        <section className="container py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Flame className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Acc Hot</h2>
                <p className="text-sm text-muted-foreground">
                  Acc được quan tâm nhiều nhất
                </p>
              </div>
            </div>
            <Button asChild variant="ghost">
              <Link href="/acc">
                Xem tất cả
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotAccs.map((acc) => (
              <AccCard key={acc.id} acc={acc} />
            ))}
          </div>
        </section>
      )}

      {/* All Shops */}
      <section id="shops" className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tất cả Shop</h2>
              <p className="text-sm text-muted-foreground">
                Chọn shop phù hợp với game bạn quan tâm
              </p>
            </div>
          </div>
        </div>

        {/* Game filter */}
        <div className="mb-6">
          <GameChips selected={selectedGame} onSelect={setSelectedGame} />
        </div>

        {/* Shop grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Không có shop nào cho game này
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container py-12 mb-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12 overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-bold mb-4">
              Bạn muốn mở shop bán acc?
            </h2>
            <p className="text-muted-foreground mb-6">
              Tham gia {siteConfig.name} ngay hôm nay. Miễn phí đăng ký, được hỗ
              trợ tận tình. Shop của bạn sẽ được hiển thị cho hàng nghìn người
              mua tiềm năng.
            </p>
            <Button asChild size="lg">
              <Link href="/seller">Mở Shop Ngay</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
