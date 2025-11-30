// User types - Chỉ dành cho Seller (Shop Owner) và Admin

export type UserRole = "seller" | "admin";

export type UserStatus = "pending" | "approved" | "rejected" | "banned";

export interface User {
  id: string;

  // Google OAuth info
  email: string;
  name: string;
  avatar?: string;

  // Role & Status
  role: UserRole;
  status: UserStatus;

  // Shop ID (nếu là seller)
  shopId?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  lastActiveAt: string;
}
