import { Acc, ShopInfo } from "@/types";

// Mock shop infos cho accs
const shopGamePro: ShopInfo = {
  id: "shop1",
  slug: "shop-game-pro",
  name: "Shop Game Pro",
  avatar:
    "https://api.dicebear.com/7.x/initials/svg?seed=SGP&backgroundColor=f97316",
  rating: 4.9,
  totalSales: 523,
  isVerified: true,
};

const accVipStore: ShopInfo = {
  id: "shop2",
  slug: "acc-vip-store",
  name: "Acc VIP Store",
  avatar:
    "https://api.dicebear.com/7.x/initials/svg?seed=AVS&backgroundColor=8b5cf6",
  rating: 4.8,
  totalSales: 312,
  isVerified: true,
};

const gameKing: ShopInfo = {
  id: "shop3",
  slug: "game-king",
  name: "Game King",
  avatar:
    "https://api.dicebear.com/7.x/initials/svg?seed=GK&backgroundColor=10b981",
  rating: 4.7,
  totalSales: 198,
  isVerified: true,
};

const lienQuanMaster: ShopInfo = {
  id: "shop4",
  slug: "lien-quan-master",
  name: "Liên Quân Master",
  avatar:
    "https://api.dicebear.com/7.x/initials/svg?seed=LQM&backgroundColor=ef4444",
  rating: 4.95,
  totalSales: 756,
  isVerified: true,
};

const genshinParadise: ShopInfo = {
  id: "shop6",
  slug: "genshin-paradise",
  name: "Genshin Paradise",
  avatar:
    "https://api.dicebear.com/7.x/initials/svg?seed=GP&backgroundColor=06b6d4",
  rating: 4.85,
  totalSales: 389,
  isVerified: true,
};

export const MOCK_ACCS: Acc[] = [
  {
    id: "1",
    title: "Acc Liên Quân 200 Tướng Full Skin",
    slug: "acc-lien-quan-200-tuong-full-skin",
    description:
      "Acc VIP có đầy đủ 200 tướng, skin đẹp, rank Cao Thủ. Đã chơi từ mùa 1, nhiều skin giới hạn hiếm.",
    price: 2500000,
    originalPrice: 3000000,
    gameId: "lien-quan",
    gameSlug: "lien-quan",
    gameName: "Liên Quân Mobile",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    attributes: [
      { label: "Rank", value: "Cao Thủ" },
      { label: "Tướng", value: "200" },
      { label: "Skin", value: "150+" },
      { label: "Ngọc", value: "Full" },
    ],
    status: "approved",
    isVip: true,
    isHot: true,
    views: 1250,
    shop: lienQuanMaster,
    createdAt: "2024-11-25T10:00:00Z",
    updatedAt: "2024-11-25T10:00:00Z",
  },
  {
    id: "2",
    title: "Acc Free Fire Max Rank Huyền Thoại",
    slug: "acc-free-fire-max-rank-huyen-thoai",
    description: "Acc rank Huyền Thoại, nhiều súng skin đẹp, pet đầy đủ.",
    price: 1800000,
    gameId: "free-fire",
    gameSlug: "free-fire",
    gameName: "Free Fire",
    images: [
      "https://images.unsplash.com/photo-1493711662062-fa541f7f905a?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1493711662062-fa541f7f905a?w=400",
    attributes: [
      { label: "Rank", value: "Huyền Thoại" },
      { label: "Level", value: "75" },
      { label: "Pet", value: "10+" },
    ],
    status: "approved",
    isVip: false,
    isHot: true,
    views: 890,
    shop: shopGamePro,
    createdAt: "2024-11-24T14:00:00Z",
    updatedAt: "2024-11-24T14:00:00Z",
  },
  {
    id: "3",
    title: "Acc PUBG Mobile Rank Conqueror",
    slug: "acc-pubg-mobile-rank-conqueror",
    description: "Acc rank Conqueror mùa này, nhiều outfit đẹp.",
    price: 3500000,
    originalPrice: 4000000,
    gameId: "pubg-mobile",
    gameSlug: "pubg-mobile",
    gameName: "PUBG Mobile",
    images: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    attributes: [
      { label: "Rank", value: "Conqueror" },
      { label: "Outfit", value: "50+" },
      { label: "RP", value: "Mùa 1-20" },
    ],
    status: "approved",
    isVip: true,
    isHot: false,
    views: 650,
    shop: accVipStore,
    createdAt: "2024-11-23T09:00:00Z",
    updatedAt: "2024-11-23T09:00:00Z",
  },
  {
    id: "4",
    title: "Acc Genshin Impact AR60 Full SSR",
    slug: "acc-genshin-impact-ar60-full-ssr",
    description: "Adventure Rank 60, nhiều nhân vật 5 sao, vũ khí 5 sao.",
    price: 5000000,
    gameId: "genshin",
    gameSlug: "genshin-impact",
    gameName: "Genshin Impact",
    images: ["https://images.unsplash.com/photo-1552820728-8b83bb6b2b5a?w=800"],
    thumbnail:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b2b5a?w=400",
    attributes: [
      { label: "AR", value: "60" },
      { label: "5★ Char", value: "15" },
      { label: "5★ Weapon", value: "10" },
    ],
    status: "approved",
    isVip: true,
    isHot: true,
    views: 2100,
    shop: genshinParadise,
    createdAt: "2024-11-22T16:00:00Z",
    updatedAt: "2024-11-22T16:00:00Z",
  },
  {
    id: "5",
    title: "Acc Liên Quân 50 Tướng Rank Kim Cương",
    slug: "acc-lien-quan-50-tuong-kim-cuong",
    description: "Acc mới chơi, rank Kim Cương, 50 tướng cơ bản.",
    price: 500000,
    gameId: "lien-quan",
    gameSlug: "lien-quan",
    gameName: "Liên Quân Mobile",
    images: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
    attributes: [
      { label: "Rank", value: "Kim Cương" },
      { label: "Tướng", value: "50" },
      { label: "Skin", value: "20" },
    ],
    status: "approved",
    isVip: false,
    isHot: false,
    views: 320,
    shop: gameKing,
    createdAt: "2024-11-21T11:00:00Z",
    updatedAt: "2024-11-21T11:00:00Z",
  },
  {
    id: "6",
    title: "Acc Honkai Star Rail UID Đẹp",
    slug: "acc-honkai-star-rail-uid-dep",
    description: "Acc Honkai Star Rail có nhiều nhân vật 5 sao, UID số đẹp.",
    price: 4200000,
    gameId: "honkai-star-rail",
    gameSlug: "honkai-star-rail",
    gameName: "Honkai Star Rail",
    images: [
      "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=400",
    attributes: [
      { label: "Level", value: "70" },
      { label: "5★ Char", value: "8" },
      { label: "Light Cone", value: "5" },
    ],
    status: "approved",
    isVip: true,
    isHot: false,
    views: 780,
    shop: genshinParadise,
    createdAt: "2024-11-20T08:00:00Z",
    updatedAt: "2024-11-20T08:00:00Z",
  },
  {
    id: "7",
    title: "Acc Liên Quân Thách Đấu 300 Skin",
    slug: "acc-lien-quan-thach-dau-300-skin",
    description:
      "Acc rank Thách Đấu, 300+ skin bao gồm nhiều skin giới hạn, trang phục SS+.",
    price: 8500000,
    originalPrice: 10000000,
    gameId: "lien-quan",
    gameSlug: "lien-quan",
    gameName: "Liên Quân Mobile",
    images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"],
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    attributes: [
      { label: "Rank", value: "Thách Đấu" },
      { label: "Tướng", value: "Full" },
      { label: "Skin", value: "300+" },
      { label: "SS+", value: "15" },
    ],
    status: "approved",
    isVip: true,
    isHot: true,
    views: 3200,
    shop: lienQuanMaster,
    createdAt: "2024-11-26T10:00:00Z",
    updatedAt: "2024-11-26T10:00:00Z",
  },
  {
    id: "8",
    title: "Acc PUBG Mobile Level 80 Full Skin",
    slug: "acc-pubg-mobile-level-80-full-skin",
    description: "Acc level cao, đầy đủ skin súng, outfit, xe cộ.",
    price: 2800000,
    gameId: "pubg-mobile",
    gameSlug: "pubg-mobile",
    gameName: "PUBG Mobile",
    images: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    attributes: [
      { label: "Level", value: "80" },
      { label: "Skin Súng", value: "100+" },
      { label: "Outfit", value: "50+" },
    ],
    status: "approved",
    isVip: false,
    isHot: false,
    views: 420,
    shop: accVipStore,
    createdAt: "2024-11-19T14:00:00Z",
    updatedAt: "2024-11-19T14:00:00Z",
  },
];

// Active game slugs - later will be from database
const ACTIVE_GAME_SLUGS = ["lien-quan"];

// Get accs from active games only
export function getActiveAccs(): Acc[] {
  return MOCK_ACCS.filter(
    (acc) =>
      acc.status === "approved" &&
      ACTIVE_GAME_SLUGS.includes(acc.gameSlug as string)
  );
}

// Get hot accs from active games
export function getHotAccs(limit = 4): Acc[] {
  return MOCK_ACCS.filter(
    (acc) =>
      (acc.isHot || acc.isVip) &&
      acc.status === "approved" &&
      ACTIVE_GAME_SLUGS.includes(acc.gameSlug as string)
  ).slice(0, limit);
}

// Get accs by shop ID
export function getAccsByShopId(shopId: string): Acc[] {
  return MOCK_ACCS.filter(
    (acc) => acc.shop.id === shopId && acc.status === "approved"
  );
}

// Get accs by shop slug
export function getAccsByShopSlug(shopSlug: string): Acc[] {
  return MOCK_ACCS.filter(
    (acc) => acc.shop.slug === shopSlug && acc.status === "approved"
  );
}
