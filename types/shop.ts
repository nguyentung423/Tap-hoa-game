// Shop types - Mỗi người bán là một Shop

export type ShopStatus = "pending" | "approved" | "rejected" | "banned";

export interface Shop {
  id: string;
  slug: string;

  // Thông tin cơ bản
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;

  // Liên hệ
  zaloPhone?: string;

  // Status
  status: ShopStatus;
  isVerified: boolean; // status === 'approved'
  isVipShop: boolean; // VIP shop status
  isStrategicPartner: boolean; // Strategic Partner status

  // Stats
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalAccs: number;

  // Featured games
  featuredGames: string[]; // game slugs

  // Owner info
  ownerId: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  lastActiveAt: string;
}

// Shop info để hiển thị trên acc card (simplified)
export interface ShopInfo {
  id: string;
  slug: string;
  name: string;
  avatar?: string;
  rating: number;
  totalSales: number;
  isVerified: boolean;
  isVipShop: boolean;
  isStrategicPartner: boolean;
}

// Shop filters cho trang listing
export interface ShopFilters {
  search?: string;
  gameSlug?: string;
  sortBy?: "newest" | "rating" | "sales" | "popular";
  verified?: boolean;
}
