/**
 * Auth API Service
 * Xử lý các API liên quan đến Authentication
 *
 * GOOGLE OAUTH:
 * - Frontend dùng NextAuth.js với Google Provider
 * - Sau khi đăng nhập Google thành công, gọi syncGoogle để sync user với backend
 * - Backend tự tạo user/shop nếu chưa có
 */

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { User } from "@/types/user";
import { ApiResponse } from "@/types/api";

// ============ Types ============

// Google user info từ NextAuth session
export interface GoogleUserInfo {
  email: string;
  name: string;
  image?: string;
  googleId?: string; // sub từ Google
}

export interface SyncGoogleResponse {
  user: User;
  isNewUser: boolean; // true nếu vừa tạo user mới
}

// ============ API Functions ============

/**
 * Sync user từ Google OAuth
 * Gọi sau khi NextAuth đăng nhập thành công
 * Backend sẽ tạo user/shop nếu chưa có
 */
export async function syncGoogleUser(
  userInfo: GoogleUserInfo
): Promise<ApiResponse<SyncGoogleResponse>> {
  return apiClient.post<SyncGoogleResponse>(
    API_ENDPOINTS.auth.syncGoogle,
    userInfo
  );
}

/**
 * Đăng xuất
 */
export async function logout(): Promise<ApiResponse<{ success: boolean }>> {
  return apiClient.post<{ success: boolean }>(API_ENDPOINTS.auth.logout);
}

/**
 * Lấy thông tin user hiện tại
 */
export async function getMe(): Promise<ApiResponse<User>> {
  return apiClient.get<User>(API_ENDPOINTS.auth.me);
}

// ============ Export ============

export const authApi = {
  syncGoogleUser,
  logout,
  getMe,
};

export default authApi;
