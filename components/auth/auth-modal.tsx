"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: AuthMode;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setMode(defaultMode);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, defaultMode]);

  const handleClose = () => {
    setMode(defaultMode);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect về /seller/check - trang này sẽ check isNewUser và redirect đúng
      await signIn("google", {
        callbackUrl: "/seller/check",
      });
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const isRegister = mode === "register";

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 pt-12">
          {/* Logo */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">
              <span className="text-primary">{siteConfig.name}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isRegister
                ? "Đăng ký để mở shop bán acc"
                : "Đăng nhập để quản lý shop của bạn"}
            </p>
          </div>

          {/* Note for buyers */}
          <div className="mb-6 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-center text-muted-foreground">
              💡{" "}
              <strong className="text-foreground">
                Người mua không cần đăng ký!
              </strong>
              <br />
              Chỉ cần bấm &quot;Mua ngay&quot; và liên hệ qua Zalo để giao dịch.
            </p>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            size="lg"
            className="w-full py-6"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading
              ? "Đang xử lý..."
              : isRegister
              ? "Đăng ký với Google"
              : "Đăng nhập với Google"}
          </Button>

          {/* Switch mode */}
          <p className="text-sm text-center text-muted-foreground mt-6">
            {isRegister ? (
              <>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Đăng nhập
                </button>
              </>
            ) : (
              <>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-primary hover:underline font-medium"
                >
                  Đăng ký ngay
                </button>
              </>
            )}
          </p>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground mt-6">
            Bằng việc {isRegister ? "đăng ký" : "đăng nhập"}, bạn đồng ý với{" "}
            <a href="/terms" className="text-primary hover:underline">
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
