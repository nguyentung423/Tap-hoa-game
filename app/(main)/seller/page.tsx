"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Store,
  Shield,
  Users,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { AuthModal } from "@/components/auth/auth-modal";

export default function SellerPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Redirect logged-in sellers
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.shopName) {
        router.push("/seller/dashboard");
      } else {
        router.push("/seller/welcome");
      }
    }
  }, [session, status, router]);

  const handleAuthSuccess = () => {
    // After successful login, redirect to welcome page for new sellers
    router.push("/seller/welcome");
  };

  const benefits = [
    {
      icon: Store,
      title: "Có Shop riêng",
      description:
        "Gian hàng cá nhân với avatar, cover, mô tả - khách hàng dễ nhớ và tin tưởng",
    },
    {
      icon: Shield,
      title: "Giao dịch an toàn",
      description:
        "Admin làm trung gian 100% giao dịch - không lo bị lừa, không rủi ro",
    },
    {
      icon: Users,
      title: "Tiếp cận khách hàng",
      description:
        "Hàng ngàn người mua tiềm năng truy cập mỗi ngày, không cần tự marketing",
    },
    {
      icon: TrendingUp,
      title: "Tăng uy tín",
      description:
        "Đánh giá và số giao dịch hiển thị công khai - shop tốt được nhiều khách",
    },
    {
      icon: Zap,
      title: "Đăng acc nhanh",
      description: "Giao diện quản lý đơn giản, đăng acc chỉ trong vài phút",
    },
    {
      icon: Clock,
      title: "Hỗ trợ 24/7",
      description: "Admin luôn sẵn sàng hỗ trợ, xử lý nhanh mọi vấn đề",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Đăng nhập bằng Google",
      description: "Xác thực nhanh chóng, an toàn qua tài khoản Google của bạn",
    },
    {
      number: "2",
      title: "Tạo Shop",
      description: "Đặt tên shop, thêm mô tả, upload avatar và ảnh bìa",
    },
    {
      number: "3",
      title: "Chờ duyệt",
      description:
        "Admin xét duyệt shop trong vòng 24h (thường nhanh hơn nhiều)",
    },
    {
      number: "4",
      title: "Đăng acc & bán",
      description:
        "Shop được duyệt → đăng acc → khách mua → nhận tiền qua Admin",
    },
  ];

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/20 mb-6">
              <Store className="w-4 h-4 text-neon-green" />
              <span className="text-sm text-neon-green">
                Trở thành người bán
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mở <span className="text-neon-green">Shop</span> tại{" "}
              {siteConfig.name}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Có shop riêng, bán acc dễ dàng, giao dịch an toàn 100% qua trung
              gian. Chỉ cần đăng nhập bằng Google để bắt đầu!
            </p>

            <Button
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-8 py-6 text-lg border border-gray-300"
              onClick={() => setShowAuthModal(true)}
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập / Đăng ký
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              Miễn phí đăng ký • Không cần SĐT • Xác thực nhanh
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-dark-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Tại sao nên bán tại{" "}
              <span className="text-neon-green">{siteConfig.name}</span>?
            </h2>
            <p className="text-muted-foreground">
              Tất cả những gì bạn cần để bán acc game thành công
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-dark-bg border border-white/5 hover:border-neon-green/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-neon-green/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quy trình đơn giản</h2>
            <p className="text-muted-foreground">
              4 bước để bắt đầu bán acc tại {siteConfig.name}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative p-6 rounded-xl bg-dark-card border border-white/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neon-green text-black font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-dark-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-16 h-16 text-neon-green mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Giao dịch an toàn tuyệt đối
            </h2>
            <p className="text-muted-foreground mb-8">
              Tất cả giao dịch đều qua Admin làm trung gian. Khi có khách mua,
              Admin tạo nhóm Zalo 3 người (Khách - Admin - Bạn) để đảm bảo cả
              hai bên được bảo vệ.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Khách chuyển tiền cho Admin</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Bạn giao acc cho khách</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10">
                <CheckCircle className="w-4 h-4 text-neon-green" />
                <span>Admin chuyển tiền cho bạn</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
            <p className="text-muted-foreground mb-8">
              Đăng nhập ngay để tạo shop và bắt đầu bán acc game của bạn
            </p>

            <Button
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-8 py-6 text-lg border border-gray-300"
              onClick={() => setShowAuthModal(true)}
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Mở Shop ngay
            </Button>

            <p className="text-sm text-muted-foreground mt-6">
              Có thắc mắc? Liên hệ Admin qua Zalo:{" "}
              <strong>{siteConfig.admin.zaloPhone}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
