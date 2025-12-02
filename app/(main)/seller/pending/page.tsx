"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  MessageCircle,
  Shield,
  FileText,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type UserStatus = "PENDING" | "APPROVED" | "REJECTED" | "BANNED";

export default function SellerPendingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [adminZalo, setAdminZalo] = useState("");
  const [shopName, setShopName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userStatus, setUserStatus] = useState<UserStatus>("PENDING");
  const [activeTab, setActiveTab] = useState<"policy" | "rules" | "faq">(
    "policy"
  );

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [shopRes, settingsRes] = await Promise.all([
          fetch("/api/v1/seller/shop"),
          fetch("/api/v1/settings"),
        ]);

        const shopJson = await shopRes.json();
        const settingsJson = await settingsRes.json();

        if (shopJson.success && shopJson.data) {
          const { shopName: name, status, email } = shopJson.data;
          setShopName(name || "");
          setUserStatus(status);
          setUserEmail(email || "");

          // If approved, redirect to dashboard
          if (status === "APPROVED") {
            router.replace("/seller/dashboard");
            return;
          }

          // If rejected or banned, show appropriate message
          if (status === "REJECTED" || status === "BANNED") {
            // Stay on this page, will show rejection message
          }
        }

        if (settingsJson.success && settingsJson.data?.adminPhone) {
          setAdminZalo(settingsJson.data.adminPhone);
        }
      } catch (error) {
        console.error("Error checking status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Rejected state
  if (userStatus === "REJECTED") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-red-500/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">Shop bị từ chối</h1>
              <p className="text-muted-foreground">
                Shop của bạn không được duyệt. Vui lòng liên hệ admin để biết
                thêm chi tiết.
              </p>
            </div>

            <Button
              onClick={() => {
                if (adminZalo) {
                  window.open(`https://zalo.me/${adminZalo}`, "_blank");
                } else {
                  toast.error("Không tìm thấy thông tin admin");
                }
              }}
              className="w-full"
              variant="destructive"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Liên hệ Admin
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Banned state
  if (userStatus === "BANNED") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-red-500/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">Tài khoản bị cấm</h1>
              <p className="text-muted-foreground">
                Shop của bạn đã bị cấm vĩnh viễn do vi phạm chính sách nền tảng.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pending state - Main content
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container max-w-4xl py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>

          <h1 className="text-3xl font-bold mb-2">Shop đang chờ duyệt</h1>
          <p className="text-muted-foreground">
            Trong khi chờ, hãy tìm hiểu về chính sách và quy định của nền tảng
          </p>
        </motion.div>

        {/* Shop Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl bg-muted/30 border border-border/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{shopName}</h3>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-yellow-500">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm font-medium">Chờ duyệt</span>
            </div>
          </div>
        </motion.div>

        {/* Contact Admin CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">Để được duyệt nhanh</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Nhắn tin qua Zalo và gửi kèm: Tên shop, Email, Ảnh CCCD (đã che
                mặt và 6 số cuối)
              </p>
              <Button
                onClick={() => {
                  if (adminZalo) {
                    window.open(`https://zalo.me/${adminZalo}`, "_blank");
                  } else {
                    toast.error("Không tìm thấy thông tin admin");
                  }
                }}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-semibold"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Nhắn Zalo Admin
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Tab Navigation */}
          <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
            <button
              onClick={() => setActiveTab("policy")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "policy"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="w-4 h-4" />
              Chính sách
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "rules"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              Quy định
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "faq"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 rounded-2xl bg-background border border-border/50">
            {activeTab === "policy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Chính sách nền tảng
                  </h2>
                  <div className="space-y-4 text-sm">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Phí giao dịch
                      </h3>
                      <ul className="space-y-1 text-muted-foreground ml-6">
                        <li>• Shop thường: 5% mỗi giao dịch</li>
                        <li>• Shop VIP: 3% mỗi giao dịch</li>
                        <li>• Đối tác chiến lược: 0% (miễn phí)</li>
                        <li>• Phí tối thiểu: 10,000đ</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Quy trình giao dịch
                      </h3>
                      <ul className="space-y-1 text-muted-foreground ml-6">
                        <li>• Admin làm trung gian 100% giao dịch</li>
                        <li>• Buyer trả tiền → Admin kiểm tra acc</li>
                        <li>• Đúng mô tả → Chuyển tiền cho Seller</li>
                        <li>• Sai mô tả → Hoàn tiền cho Buyer</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Chính sách bảo vệ
                      </h3>
                      <ul className="space-y-1 text-muted-foreground ml-6">
                        <li>• Buyer được kiểm tra acc trước khi thanh toán</li>
                        <li>• Seller được bảo vệ khỏi giao dịch gian lận</li>
                        <li>• Đánh giá minh bạch, xây dựng uy tín</li>
                        <li>• Hỗ trợ giải quyết tranh chấp 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "rules" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Quy định seller</h2>
                  <div className="space-y-4 text-sm">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <h3 className="font-semibold mb-2 text-green-600 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Được phép
                      </h3>
                      <ul className="space-y-1 text-muted-foreground ml-6">
                        <li>• Đăng acc game hợp pháp, tự nông hoặc mua lại</li>
                        <li>• Mô tả đầy đủ, trung thực về acc</li>
                        <li>• Giá cả hợp lý, cạnh tranh</li>
                        <li>• Chăm sóc khách hàng, trả lời inbox</li>
                        <li>• Cập nhật acc đã bán để tránh nhầm lẫn</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Nghiêm cấm
                      </h3>
                      <ul className="space-y-1 text-muted-foreground ml-6">
                        <li>• Bán acc hack, clone, vi phạm bản quyền</li>
                        <li>• Mô tả sai lệch để lừa đảo buyer</li>
                        <li>• Lấy lại acc sau khi đã bán (scam)</li>
                        <li>• Spam, đăng trùng lặp cùng 1 acc</li>
                        <li>• Sử dụng CCCD giả, thông tin giả mạo</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <h3 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Xử phạt vi phạm
                      </h3>
                      <ul className="space-y-1 text-muted-foreground ml-6">
                        <li>• Vi phạm nhẹ: Cảnh cáo, gỡ acc vi phạm</li>
                        <li>• Vi phạm nghiêm trọng: Khóa shop 7-30 ngày</li>
                        <li>
                          • Lừa đảo: Ban vĩnh viễn + báo cơ quan chức năng
                        </li>
                        <li>• Tái phạm: Tăng mức xử phạt</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Câu hỏi thường gặp</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        Shop bao lâu được duyệt?
                      </h3>
                      <p className="text-sm text-muted-foreground ml-6">
                        Thường trong vòng vài giờ đến 24 giờ. Nếu bạn đã gửi
                        CCCD qua Zalo, admin sẽ ưu tiên duyệt nhanh hơn.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        Tại sao phải gửi CCCD?
                      </h3>
                      <p className="text-sm text-muted-foreground ml-6">
                        CCCD giúp xác minh danh tính, tránh lừa đảo và bảo vệ
                        buyer. <strong>Chỉ cần che mặt và 6 số cuối</strong>,
                        admin chỉ xác minh họ tên + địa chỉ. Thông tin được bảo
                        mật tuyệt đối.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        Làm sao để trở thành Shop VIP?
                      </h3>
                      <p className="text-sm text-muted-foreground ml-6">
                        Sau khi shop được duyệt, vào Dashboard {">"} Cài đặt
                        shop {">"} Nâng cấp VIP. Phí: 99,000đ/tháng, giảm phí
                        giao dịch từ 5% xuống 3%.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        Khi nào nhận được tiền?
                      </h3>
                      <p className="text-sm text-muted-foreground ml-6">
                        Ngay sau khi buyer xác nhận acc đúng mô tả. Admin chuyển
                        tiền (trừ phí) vào tài khoản/ví của bạn trong vòng
                        24-48h.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        Nếu shop bị từ chối?
                      </h3>
                      <p className="text-sm text-muted-foreground ml-6">
                        Liên hệ admin qua Zalo để biết lý do cụ thể. Thường do
                        CCCD không rõ ràng hoặc thông tin chưa đầy đủ. Bạn có
                        thể gửi lại.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            💡 Bạn sẽ nhận được thông báo email khi shop được duyệt
          </p>
        </motion.div>
      </div>
    </div>
  );
}
