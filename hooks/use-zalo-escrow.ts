"use client";

import { useCallback } from "react";
import { getZaloDeepLink, generateZaloMessage } from "@/lib/utils";
import { siteConfig, getAdminZaloLink } from "@/config/site";
import { Acc } from "@/types";

interface UseZaloEscrowReturn {
  openZaloChat: (zaloId: string, message?: string) => void;
  initiateDeal: (acc: Acc) => void;
  generateDealLink: (acc: Acc) => string;
  contactAdmin: (acc: Acc) => void;
}

export function useZaloEscrow(): UseZaloEscrowReturn {
  const openZaloChat = useCallback((zaloId: string, message?: string) => {
    const url = getZaloDeepLink(zaloId, message || "");
    window.open(url, "_blank");
  }, []);

  // Liên hệ admin để mua acc (theo business model mới)
  const contactAdmin = useCallback((acc: Acc) => {
    const accUrl = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/acc/${acc.slug}`;
    const url = getAdminZaloLink(acc.title, acc.price, accUrl);

    console.log("Contact admin for acc:", acc.id);
    window.open(url, "_blank");
  }, []);

  // Deprecated - giữ lại để tương thích, nhưng chuyển sang liên hệ admin
  const initiateDeal = useCallback(
    (acc: Acc) => {
      contactAdmin(acc);
    },
    [contactAdmin]
  );

  const generateDealLink = useCallback((acc: Acc): string => {
    const accUrl = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/acc/${acc.slug}`;
    return getAdminZaloLink(acc.title, acc.price, accUrl);
  }, []);

  return {
    openZaloChat,
    initiateDeal,
    generateDealLink,
    contactAdmin,
  };
}
