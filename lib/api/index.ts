/**
 * API Module - Central export
 * Import tất cả API services từ đây
 */

// Core
export { apiClient } from "./client";
export { API_ENDPOINTS } from "./endpoints";

// Auth
export { authApi } from "./auth";
export type { GoogleUserInfo, SyncGoogleResponse } from "./auth";

// Games
export { gamesApi } from "./games";
export type { GamesListParams } from "./games";

// Shops
export { shopsApi } from "./shops";
export type { ShopsListParams } from "./shops";

// Accs
export { accsApi } from "./acc";
export type { AccsListParams } from "./acc";

// Seller
export { sellerApi } from "./seller";
export type {
  SellerDashboardStats,
  SellerAcc,
  CreateAccPayload,
  UpdateAccPayload,
  SellerAccsListParams,
} from "./seller";

// Admin
export { adminApi } from "./admin";
export type {
  AdminDashboardStats,
  AdminShopsListParams,
  AdminAccsListParams,
  AdminUsersListParams,
  AdminSettings,
  RejectPayload,
} from "./admin";

// Upload
export { uploadApi } from "./upload";
export type { UploadResponse, MultiUploadResponse } from "./upload";
