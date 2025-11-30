"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SellerCheckPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // Chưa đăng nhập -> về trang seller
      router.replace("/seller");
      return;
    }

    if (session?.user) {
      // isNewUser = true: User mới đăng ký lần đầu -> Welcome
      // isNewUser = false/undefined: User cũ đăng nhập lại -> Dashboard
      if (session.user.isNewUser) {
        router.replace("/seller/welcome");
      } else {
        router.replace("/seller/dashboard");
      }
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Đang kiểm tra tài khoản...</p>
      </div>
    </div>
  );
}
