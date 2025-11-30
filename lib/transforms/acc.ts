import { Acc, AccAttribute } from "@/types";

/**
 * Transform API response acc to frontend Acc type
 */
export function transformApiAcc(apiAcc: any): Acc {
  return {
    id: apiAcc.id,
    title: apiAcc.title,
    slug: apiAcc.slug,
    description: apiAcc.description || "",
    price: apiAcc.price,
    originalPrice: apiAcc.originalPrice || undefined,
    gameId: apiAcc.gameId || apiAcc.game?.id || "",
    gameSlug: apiAcc.game?.slug || "",
    gameName: apiAcc.game?.name || "",
    images: apiAcc.images || [],
    thumbnail: apiAcc.thumbnail || apiAcc.images?.[0] || "/placeholder.webp",
    attributes: transformAttributes(apiAcc.attributes),
    status: apiAcc.status?.toLowerCase() || "pending",
    isVip: apiAcc.isVip || false,
    isHot: apiAcc.isHot || false,
    vipEndTime: apiAcc.vipEndTime || undefined,
    views: apiAcc.views || 0,
    shop: {
      id: apiAcc.seller?.id || "",
      name: apiAcc.seller?.shopName || "Shop",
      slug: apiAcc.seller?.shopSlug || "",
      avatar: apiAcc.seller?.shopAvatar || undefined,
      isVerified: apiAcc.seller?.isVerified || false,
      rating: apiAcc.seller?.rating || 0,
      totalSales: apiAcc.seller?.totalSales || 0,
    },
    createdAt: apiAcc.createdAt,
    updatedAt: apiAcc.updatedAt,
    approvedAt: apiAcc.approvedAt || undefined,
    soldAt: apiAcc.soldAt || undefined,
    adminNote: apiAcc.adminNote || undefined,
  };
}

/**
 * Transform attributes from object/array to AccAttribute[]
 */
function transformAttributes(attrs: any): AccAttribute[] {
  if (!attrs) return [];

  // If already array of { label, value }
  if (Array.isArray(attrs)) {
    return attrs.map((attr: any) => ({
      label: attr.label || attr.key || "",
      value: String(attr.value || ""),
    }));
  }

  // If object { key: value }
  if (typeof attrs === "object") {
    return Object.entries(attrs).map(([key, value]) => ({
      label: formatLabel(key),
      value: String(value),
    }));
  }

  return [];
}

/**
 * Format key to readable label
 */
function formatLabel(key: string): string {
  const labels: Record<string, string> = {
    rank: "Rank",
    champions: "Số tướng",
    skins: "Số skin",
    gems: "Quân Huy",
    level: "Level",
    characters: "Số nhân vật",
    gunSkins: "Skin súng",
    outfits: "Trang phục",
    diamonds: "Kim cương",
    pets: "Pet",
    vehicles: "Skin xe",
    uc: "UC",
    agents: "Agent",
    vp: "VP",
    ar: "AR",
    characters5: "Nhân vật 5*",
    weapons5: "Vũ khí 5*",
    primogems: "Nguyên Thạch",
    tl: "Trailblaze Level",
    lightCones5: "Nón Ánh Sáng 5*",
    jades: "Stellar Jade",
    blueEssence: "Tinh Hoa Xanh",
    rp: "RP",
    littleLegends: "Linh Thú",
    arenas: "Đấu Trường",
    booms: "Boom",
  };

  return labels[key] || key;
}

/**
 * Transform array of API accs
 */
export function transformApiAccs(apiAccs: any[]): Acc[] {
  return apiAccs.map(transformApiAcc);
}
