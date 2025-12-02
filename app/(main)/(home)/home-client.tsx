"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronRight,
  Shield,
  Users,
  MessageCircle,
  Store,
  TrendingUp,
  Crown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShopCard } from "@/components/shop/shop-card";
import { SafetyPolicyButton } from "@/components/acc/safety-policy-button";
import { siteConfig } from "@/config/site";

// Game quick filter chips
function GameChips({
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

// Feature card - removed framer-motion for better performance
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
    <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 transition-transform hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

interface HomeClientProps {
  initialShops: any[];
  initialGames: any[];
  initialAccs: any[];
}

export function HomeClient({
  initialShops,
  initialGames,
  initialAccs,
}: HomeClientProps) {
  const [selectedGame, setSelectedGame] = useState<string | undefined>();
  const [showAllShops, setShowAllShops] = useState(false);

  // Strategic Partner shops - top tier
  const strategicPartnerShops = useMemo(() => {
    return initialShops
      .filter((shop: any) => shop.isStrategicPartner)
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 4);
  }, [initialShops]);

  // Top VIP shops
  const topShops = useMemo(() => {
    const now = new Date();
    const vipShops = initialShops.filter((shop: any) => {
      const isVipActive =
        shop.isVipShop &&
        shop.vipShopEndTime &&
        new Date(shop.vipShopEndTime) > now;
      const notStrategic = !shop.isStrategicPartner;
      return isVipActive && notStrategic;
    });
    return vipShops.sort((a: any, b: any) => b.rating - a.rating).slice(0, 8);
  }, [initialShops]);

  // Developing shops
  const developingShops = useMemo(() => {
    const now = new Date();
    return initialShops
      .filter((shop: any) => {
        const notStrategic = !shop.isStrategicPartner;
        const notVip = !(
          shop.isVipShop &&
          shop.vipShopEndTime &&
          new Date(shop.vipShopEndTime) > now
        );
        return notStrategic && notVip;
      })
      .sort((a: any, b: any) => b.rating - a.rating);
  }, [initialShops]);

  // Filtered developing shops
  const filteredDevelopingShops = useMemo(() => {
    let filtered = developingShops;
    if (!showAllShops && filtered.length > 12) {
      return filtered.slice(0, 12);
    }
    return filtered;
  }, [developingShops, showAllShops]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4" />
              <span>Nơi hội tụ các shop game uy tín</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span className="text-primary">{siteConfig.name}</span>
              <br />
              Chợ Acc Game Uy Tín
            </h1>

            <p className="text-lg text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Khám phá các shop game uy tín, chọn acc ưng ý.
              <br />
              Giao dịch an toàn qua trung gian Zalo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button asChild size="lg" className="text-base">
                <Link href="#shops">
                  <Store className="w-5 h-5 mr-2" />
                  Khám phá các Shop
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/seller">Mở Shop của bạn</Link>
              </Button>
            </div>

            {/* Safety Policy Button */}
            <div className="flex justify-center mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <SafetyPolicyButton className="text-base" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container pb-12">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {initialShops.length}+
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

      {/* Strategic Partner Shops */}
      {strategicPartnerShops.length > 0 && (
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
            {strategicPartnerShops.map((shop: any) => (
              <ShopCard key={shop.id} shop={shop} variant="strategic" />
            ))}
          </div>
        </section>
      )}

      {/* Top VIP Shops */}
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

        {topShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topShops.map((shop: any) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Chưa có shop VIP nào</p>
          </div>
        )}
      </section>

      {/* Developing Shops */}
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
            onSelect={setSelectedGame}
            games={initialGames}
          />
        </div>

        {/* Shop grid */}
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDevelopingShops.map((shop: any) => (
              <ShopCard key={shop.id} shop={shop} variant="developing" />
            ))}
          </div>

          {filteredDevelopingShops.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có shop đang phát triển nào
            </div>
          )}

          {/* Show more button */}
          {!showAllShops && developingShops.length > 12 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllShops(true)}
                className="gap-2"
              >
                Xem tất cả {developingShops.length} shop
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
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
