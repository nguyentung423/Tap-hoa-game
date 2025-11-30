import { GameSlug } from "./game";
import { ShopInfo } from "./shop";

// Acc status - đơn giản hóa
export type AccStatus = "pending" | "approved" | "rejected" | "sold";

export interface AccAttribute {
  label: string;
  value: string;
}

export interface Acc {
  id: string;
  title: string;
  slug: string;
  description?: string;

  // Pricing
  price: number;
  originalPrice?: number;

  // Game info
  gameId: string;
  gameSlug: GameSlug;
  gameName: string;

  // Images
  images: string[];
  thumbnail: string;

  // Attributes based on game (key-value for display)
  attributes: AccAttribute[];

  // Status
  status: AccStatus;

  // VIP / Hot flags
  isVip: boolean;
  isHot: boolean;
  vipEndTime?: string;

  // Stats
  views: number;

  // Shop info (thay vì seller)
  shop: ShopInfo;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  soldAt?: string;

  // Admin note (for rejection)
  adminNote?: string;
}

// Filters cho trang listing
export interface AccFilters {
  gameSlug?: GameSlug;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "oldest" | "price-asc" | "price-desc" | "popular";
}

// Response từ API
export interface AccListResponse {
  items: Acc[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
