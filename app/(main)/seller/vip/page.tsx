"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Crown, Check, Zap, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const VIP_PLANS = [
  {
    duration: 30,
    name: "VIP 1 Tháng",
    price: 99000,
    pricePerDay: 3300,
    popular: false,
  },
  {
    duration: 90,
    name: "VIP 3 Tháng",
    price: 249000,
    pricePerDay: 2767,
    popular: true,
    savings: "Tiết kiệm 48k",
  },
  {
    duration: 180,
    name: "VIP 6 Tháng",
    price: 449000,
    pricePerDay: 2494,
    popular: false,
    savings: "Tiết kiệm 145k",
  },
  {
    duration: 365,
    name: "VIP 1 Năm",
    price: 799000,
    pricePerDay: 2189,
    popular: false,
    savings: "Tiết kiệm 416k",
  },
];

const BENEFITS = [
  {
    icon: Crown,
    title: "Hiển thị ưu tiên",
    desc: "Shop của bạn luôn hiển thị đầu tiên ở trang chủ",
  },
  {
    icon: Zap,
    title: "Badge VIP nổi bật",
    desc: "Dấu hiệu VIP vàng đẹp mắt, tăng uy tín shop",
  },
  {
    icon: Star,
    title: "Giảm phí hoa hồng",
    desc: "Từ 5% xuống 3% - tiết kiệm chi phí đáng kể",
  },
  {
    icon: Shield,
    title: "Ưu tiên hỗ trợ",
    desc: "Được hỗ trợ nhanh chóng khi có vấn đề",
  },
];

export default function VipPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleContactAdmin = (planName: string, price: number) => {
    // Get admin Zalo from config
    const adminZalo = process.env.NEXT_PUBLIC_ADMIN_ZALO || "0374918396";
    const message = `Chào Admin, tôi muốn đăng ký gói ${planName} (${price.toLocaleString(
      "vi-VN"
    )}đ) để nâng cấp shop lên VIP.`;

    // Open Zalo chat with admin
    const zaloUrl = `https://zalo.me/${adminZalo}?text=${encodeURIComponent(
      message
    )}`;
    window.open(zaloUrl, "_blank");

    toast.success("Đang chuyển đến Zalo Admin...");
  };
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-amber-500/5">
      <div className="container max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <Link href="/seller/shop">
              <Button variant="ghost" size="sm" className="gap-2 -ml-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />
              Nâng cấp Shop VIP
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Tăng doanh thu với Shop VIP
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nâng cấp shop lên VIP để được hiển thị ưu tiên, giảm phí hoa hồng
              và nhiều quyền lợi hấp dẫn khác
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-card border border-border hover:border-amber-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {VIP_PLANS.map((plan) => (
            <div
              key={plan.duration}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                plan.popular
                  ? "border-amber-500 bg-amber-500/5"
                  : "border-border bg-card hover:border-amber-500/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                  Phổ biến nhất
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-primary mb-1">
                  {plan.price.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ {plan.pricePerDay.toLocaleString("vi-VN")}đ/ngày
                </div>
                {plan.savings && (
                  <div className="mt-2 text-xs font-medium text-green-600">
                    {plan.savings}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Hiển thị đầu trang chủ</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Badge VIP vàng nổi bật</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Giảm phí 5% → 3%</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Ưu tiên hỗ trợ</span>
                </li>
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleContactAdmin(plan.name, plan.price)}
              >
                <Crown className="w-4 h-4 mr-2" />
                Liên hệ Admin
              </Button>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="text-center p-6 rounded-2xl bg-muted/30 border border-border">
          <p className="text-sm text-muted-foreground">
            💡 Nhấn "Liên hệ Admin" để được tư vấn và kích hoạt VIP cho shop của
            bạn. Admin sẽ hỗ trợ thanh toán và kích hoạt ngay sau khi xác nhận.
          </p>
        </div>
      </div>
    </div>
  );
}
