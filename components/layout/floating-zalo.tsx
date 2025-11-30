"use client";

import { usePathname } from "next/navigation";
import { FloatingZaloButton } from "@/components/acc/zalo-contact-button";
import { siteConfig } from "@/config/site";

// Các trang KHÔNG hiển thị floating Zalo button
const HIDDEN_PATHS = [
  "/acc/", // Chi tiết acc - đã có nút Mua ngay
  "/shop/", // Chi tiết shop - đã có nút Hỏi về Shop
];

export function ConditionalFloatingZalo() {
  const pathname = usePathname();

  // Kiểm tra xem có nên ẩn không
  const shouldHide = HIDDEN_PATHS.some((path) => pathname.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <FloatingZaloButton phone={siteConfig.admin.zaloPhone} />;
}
