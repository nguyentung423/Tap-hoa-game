"use client";

import { useState } from "react";
import { MessageCircle, Shield, Users, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminZaloLink } from "@/config/site";
import { Acc } from "@/types";
import { Button } from "@/components/ui/button";

interface BuyButtonProps {
  acc: Acc;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BuyButton({
  acc,
  className = "",
  size = "md",
}: BuyButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    const accUrl = `${window.location.origin}/acc/${acc.slug}`;
    const zaloLink = getAdminZaloLink(acc.title, acc.price, accUrl);
    window.open(zaloLink, "_blank");
    setShowConfirm(false);
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center justify-center gap-2
          bg-gradient-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          text-white font-semibold rounded-xl
          shadow-lg shadow-blue-500/25
          transition-all duration-200
          ${sizeClasses[size]}
          ${className}
        `}
      >
        <MessageCircle className="w-5 h-5" />
        <span>Mua ngay</span>
      </motion.button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <BuyConfirmModal
            acc={acc}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface BuyConfirmModalProps {
  acc: Acc;
  onConfirm: () => void;
  onCancel: () => void;
}

function BuyConfirmModal({ acc, onConfirm, onCancel }: BuyConfirmModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card rounded-3xl overflow-hidden border border-primary/20">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 text-center relative">
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <Shield className="w-10 h-10 text-black" />
            </div>

            <h3 className="text-xl font-bold mb-1">Giao dịch An toàn</h3>
            <p className="text-sm text-muted-foreground">
              Mua{" "}
              {acc.title.length > 30
                ? acc.title.slice(0, 30) + "..."
                : acc.title}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-center text-foreground leading-relaxed">
              Bạn sắp được kết nối với{" "}
              <span className="text-primary font-semibold">
                Trung Gian Chính Thức
              </span>{" "}
              của nền tảng để giao dịch an toàn.
            </p>

            {/* Features */}
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Nhóm 3 người</p>
                  <p className="text-xs text-muted-foreground">
                    Bạn - Admin - Người bán
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">100% Minh bạch</p>
                  <p className="text-xs text-muted-foreground">
                    Toàn bộ quá trình được giám sát
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              💬 Bạn sẽ được chuyển đến Zalo để chat với Admin
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl"
            >
              Hủy
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-semibold gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Tiếp tục
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
