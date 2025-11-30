import { Shop, ShopInfo } from "@/types";

// Mock Shops data
export const MOCK_SHOPS: Shop[] = [
  {
    id: "shop1",
    slug: "shop-game-pro",
    name: "Shop Game Pro",
    description:
      "Chuyên acc Liên Quân, Free Fire chất lượng cao. Uy tín từ 2020, hơn 500 giao dịch thành công.",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=SGP&backgroundColor=f97316",
    coverImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
    zaloPhone: "0901234567",
    status: "approved",
    isVerified: true,
    rating: 4.9,
    totalReviews: 156,
    totalSales: 523,
    totalAccs: 45,
    featuredGames: ["lien-quan", "free-fire"],
    ownerId: "user1",
    createdAt: "2020-05-15T10:00:00Z",
    updatedAt: "2024-11-28T10:00:00Z",
    approvedAt: "2020-05-16T08:00:00Z",
    lastActiveAt: "2024-11-28T14:30:00Z",
  },
  {
    id: "shop2",
    slug: "acc-vip-store",
    name: "Acc VIP Store",
    description:
      "Shop chuyên acc game mobile cao cấp. PUBG Mobile, Genshin Impact rank cao.",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=AVS&backgroundColor=8b5cf6",
    coverImage:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200",
    zaloPhone: "0912345678",
    status: "approved",
    isVerified: true,
    rating: 4.8,
    totalReviews: 89,
    totalSales: 312,
    totalAccs: 28,
    featuredGames: ["pubg-mobile", "genshin-impact"],
    ownerId: "user2",
    createdAt: "2021-03-20T10:00:00Z",
    updatedAt: "2024-11-27T10:00:00Z",
    approvedAt: "2021-03-21T10:00:00Z",
    lastActiveAt: "2024-11-28T09:00:00Z",
  },
  {
    id: "shop3",
    slug: "game-king",
    name: "Game King",
    description:
      "Vua acc game! Đa dạng các loại game, giá cả hợp lý, giao dịch nhanh chóng.",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=GK&backgroundColor=10b981",
    coverImage:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200",
    zaloPhone: "0923456789",
    status: "approved",
    isVerified: true,
    rating: 4.7,
    totalReviews: 67,
    totalSales: 198,
    totalAccs: 35,
    featuredGames: ["lien-quan", "pubg-mobile", "free-fire"],
    ownerId: "user3",
    createdAt: "2022-01-10T10:00:00Z",
    updatedAt: "2024-11-26T10:00:00Z",
    approvedAt: "2022-01-11T10:00:00Z",
    lastActiveAt: "2024-11-28T11:00:00Z",
  },
  {
    id: "shop4",
    slug: "lien-quan-master",
    name: "Liên Quân Master",
    description:
      "Chuyên sâu Liên Quân Mobile. Acc rank Thách Đấu, skin hiếm, giá tốt nhất.",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=LQM&backgroundColor=ef4444",
    coverImage:
      "https://images.unsplash.com/photo-1493711662062-fa541f7f905a?w=1200",
    zaloPhone: "0934567890",
    status: "approved",
    isVerified: true,
    rating: 4.95,
    totalReviews: 203,
    totalSales: 756,
    totalAccs: 62,
    featuredGames: ["lien-quan"],
    ownerId: "user4",
    createdAt: "2019-08-01T10:00:00Z",
    updatedAt: "2024-11-28T10:00:00Z",
    approvedAt: "2019-08-02T10:00:00Z",
    lastActiveAt: "2024-11-28T15:00:00Z",
  },
  {
    id: "shop5",
    slug: "new-seller-shop",
    name: "Shop Mới Mở",
    description: "Shop mới, cam kết uy tín và giá tốt!",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=SMM&backgroundColor=6366f1",
    status: "pending",
    isVerified: false,
    rating: 0,
    totalReviews: 0,
    totalSales: 0,
    totalAccs: 3,
    featuredGames: ["lien-quan"],
    ownerId: "user5",
    createdAt: "2024-11-27T10:00:00Z",
    updatedAt: "2024-11-27T10:00:00Z",
    lastActiveAt: "2024-11-28T08:00:00Z",
  },
  {
    id: "shop6",
    slug: "genshin-paradise",
    name: "Genshin Paradise",
    description:
      "Thiên đường Genshin Impact! Acc AR cao, nhiều nhân vật 5 sao, vũ khí hiếm.",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=GP&backgroundColor=06b6d4",
    coverImage:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=1200",
    zaloPhone: "0945678901",
    status: "approved",
    isVerified: true,
    rating: 4.85,
    totalReviews: 124,
    totalSales: 389,
    totalAccs: 41,
    featuredGames: ["genshin-impact"],
    ownerId: "user6",
    createdAt: "2021-09-28T10:00:00Z",
    updatedAt: "2024-11-28T10:00:00Z",
    approvedAt: "2021-09-29T10:00:00Z",
    lastActiveAt: "2024-11-28T12:30:00Z",
  },
];

// Helper: Get ShopInfo from Shop
export function getShopInfo(shop: Shop): ShopInfo {
  return {
    id: shop.id,
    slug: shop.slug,
    name: shop.name,
    avatar: shop.avatar,
    rating: shop.rating,
    totalSales: shop.totalSales,
    isVerified: shop.isVerified,
  };
}

// Active game slugs - later will be from database
const ACTIVE_GAME_SLUGS = ["lien-quan"];

// Get approved shops only - filter by shops that have active games
export function getApprovedShops(): Shop[] {
  return MOCK_SHOPS.filter(
    (shop) =>
      shop.status === "approved" &&
      shop.featuredGames?.some((game) => ACTIVE_GAME_SLUGS.includes(game))
  );
}

// Get all approved shops (including those with inactive games) - for admin
export function getAllApprovedShops(): Shop[] {
  return MOCK_SHOPS.filter((shop) => shop.status === "approved");
}

// Get shop by slug
export function getShopBySlug(slug: string): Shop | undefined {
  return MOCK_SHOPS.find((shop) => shop.slug === slug);
}

// Get shop by id
export function getShopById(id: string): Shop | undefined {
  return MOCK_SHOPS.find((shop) => shop.id === id);
}
