"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Sparkles, Shield, MessageCircle, Users, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SafetyPolicyButton } from "@/components/acc/safety-policy-button";
import { siteConfig } from "@/config/site";

// Lazy load shop sections - they're below the fold
const StrategicPartnerSection = dynamic(
  () => import("./shop-sections").then((mod) => mod.StrategicPartnerSection),
  { ssr: true }
);
const VipShopsSection = dynamic(
  () => import("./shop-sections").then((mod) => mod.VipShopsSection),
  { ssr: true }
);
const DevelopingShopsSection = dynamic(
  () => import("./shop-sections").then((mod) => mod.DevelopingShopsSection),
  { ssr: true }
);

// Feature card - inline for above-the-fold rendering
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
        <div className="container py-8 md:py-12 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4" />
              <span>Nơi hội tụ các shop game uy tín</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span className="text-primary">{siteConfig.name}</span>
              <br />
              Chợ Acc Game Uy Tín
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Khám phá các shop game uy tín, chọn acc ưng ý.
              <br className="hidden sm:inline" />
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

        {/* Stats - hidden on mobile for performance */}
        <div className="container pb-8 md:pb-12 hidden sm:block">
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

      {/* Features - reduced padding on mobile */}
      <section className="container py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
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

      {/* Strategic Partner Shops - Lazy loaded */}
      <StrategicPartnerSection shops={strategicPartnerShops} />

      {/* Top VIP Shops - Lazy loaded */}
      <VipShopsSection shops={topShops} />

      {/* Developing Shops - Lazy loaded */}
      <DevelopingShopsSection
        shops={filteredDevelopingShops}
        games={initialGames}
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
        showAll={showAllShops}
        onShowAll={() => setShowAllShops(true)}
        totalCount={developingShops.length}
      />

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
