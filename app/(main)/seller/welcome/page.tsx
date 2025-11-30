"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PartyPopper,
  Store,
  Shield,
  Users,
  TrendingUp,
  Zap,
  CheckCircle,
  Upload,
  Camera,
  ArrowRight,
  Sparkles,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";

type Step = "welcome" | "setup" | "done";

export default function SellerWelcomePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user already has a shop
  useEffect(() => {
    const checkExistingShop = async () => {
      try {
        const res = await fetch("/api/v1/seller/shop");
        const json = await res.json();

        if (json.success && json.data?.shopName) {
          // User already has a shop, redirect to dashboard
          router.replace("/seller/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking shop:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingShop();
  }, [router]);

  const benefits = [
    {
      icon: Store,
      title: "Shop riêng của bạn",
      desc: "Gian hàng cá nhân, khách hàng dễ nhớ và tin tưởng",
    },
    {
      icon: Shield,
      title: "Giao dịch an toàn 100%",
      desc: "Admin làm trung gian, không lo bị lừa",
    },
    {
      icon: Users,
      title: "Tiếp cận ngàn khách hàng",
      desc: "Không cần tự marketing, khách tự tìm đến",
    },
    {
      icon: TrendingUp,
      title: "Xây dựng uy tín",
      desc: "Đánh giá tốt → Nhiều khách hơn → Thu nhập tăng",
    },
    {
      icon: Zap,
      title: "Đăng acc siêu nhanh",
      desc: "Giao diện đơn giản, đăng acc chỉ vài phút",
    },
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateShop = async () => {
    if (!shopName.trim()) {
      toast.error("Vui lòng nhập tên shop");
      return;
    }

    if (shopName.trim().length < 3) {
      toast.error("Tên shop phải có ít nhất 3 ký tự");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/seller/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName: shopName.trim(),
          shopDesc: shopDescription.trim() || null,
          shopAvatar: avatarPreview,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Không thể tạo shop");
        return;
      }

      toast.success("Tạo shop thành công!");
      setCurrentStep("done");
    } catch (error) {
      console.error("Error creating shop:", error);
      toast.error("Đã xảy ra lỗi khi tạo shop");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipToPost = () => {
    router.push("/seller/post");
  };

  const handleGoToDashboard = () => {
    router.push("/seller/dashboard");
  };

  // Show loading while checking existing shop
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container max-w-2xl py-8 px-4">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {currentStep === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Header */}
              <div className="text-center pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  <PartyPopper className="w-12 h-12 text-black" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold mb-3"
                >
                  Chào mừng đến với
                  <br />
                  <span className="text-primary">Seller Center!</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  Bạn đã chính thức trở thành người bán tại {siteConfig.name}
                </motion.p>
              </div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <p className="text-center text-sm font-medium text-muted-foreground mb-4">
                  🎁 Những gì bạn nhận được
                </p>
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{benefit.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {benefit.desc}
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="pt-4"
              >
                <Button
                  size="lg"
                  onClick={() => setCurrentStep("setup")}
                  className="w-full h-14 text-base bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-semibold"
                >
                  Tạo Shop ngay
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Setup Shop */}
          {currentStep === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center pt-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Tạo Shop của bạn</h1>
                <p className="text-sm text-muted-foreground">
                  Điền thông tin cơ bản để bắt đầu
                </p>
              </div>

              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <label className="relative cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="w-28 h-28 rounded-full bg-muted/50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                        <span className="text-xs text-muted-foreground">
                          Tải ảnh
                        </span>
                      </div>
                    )}
                  </div>
                  {avatarPreview && (
                    <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Upload className="w-4 h-4 text-black" />
                    </div>
                  )}
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Avatar Shop (khuyến khích)
                </p>
              </div>

              {/* Shop Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tên Shop <span className="text-red-500">*</span>
                </label>
                <Input
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="VD: GenshinVN Store, ProGamer Shop..."
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Tên ngắn gọn, dễ nhớ, tối đa 30 ký tự
                </p>
              </div>

              {/* Shop Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả ngắn</label>
                <Textarea
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                  placeholder="VD: Chuyên acc Genshin Impact chất lượng cao, giao dịch uy tín..."
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Giới thiệu shop của bạn (tùy chọn)
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("welcome")}
                  disabled={isSubmitting}
                  className="flex-1 h-12"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleCreateShop}
                  disabled={!shopName.trim() || isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo Shop"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Done - Suggest posting first acc */}
          {currentStep === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-8"
            >
              {/* Success Animation */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.4 }}
                  >
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold mb-2"
                >
                  Shop đã được tạo! 🎉
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-muted-foreground"
                >
                  Shop của bạn đang chờ Admin duyệt
                  <br />
                  <span className="text-sm">(thường trong vòng 24h)</span>
                </motion.p>
              </div>

              {/* Shop Preview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-6 rounded-2xl bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Shop avatar"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{shopName}</h3>
                    <div className="flex items-center gap-2 text-xs text-yellow-500">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      Đang chờ duyệt
                    </div>
                  </div>
                </div>
                {shopDescription && (
                  <p className="text-sm text-muted-foreground mt-4">
                    {shopDescription}
                  </p>
                )}
              </motion.div>

              {/* Suggestion to post first acc */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      💡 Mẹo: Đăng acc ngay!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Trong khi chờ duyệt, bạn có thể chuẩn bị sẵn acc để đăng.
                      Khi shop được duyệt, acc sẽ tự động hiển thị!
                    </p>
                    <Button
                      onClick={handleSkipToPost}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-semibold"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Thêm acc đầu tiên
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Secondary action */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-center"
              >
                <Button
                  variant="ghost"
                  onClick={handleGoToDashboard}
                  className="text-muted-foreground"
                >
                  Để sau, đi đến Dashboard
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
