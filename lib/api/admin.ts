/**
 * Admin API Service
 * Xử lý các API cho Admin Panel
 */

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Acc, AccStatus } from "@/types/acc";
import { Shop, ShopStatus } from "@/types/shop";
import { Game } from "@/types/game";
import { User } from "@/types/user";
import { ApiResponse, PaginatedResponse } from "@/types/api";

// ============ Types ============

// Dashboard Stats
export interface AdminDashboardStats {
  totalShops: number;
  pendingShops: number;
  totalAccs: number;
  pendingAccs: number;
  totalUsers: number;
  totalGames: number;
  activeGames: number;
}

// List Params
export interface AdminShopsListParams {
  page?: number;
  pageSize?: number;
  status?: ShopStatus;
  search?: string;
  verified?: boolean;
}

export interface AdminAccsListParams {
  page?: number;
  pageSize?: number;
  status?: AccStatus;
  gameSlug?: string;
  shopId?: string;
  search?: string;
}

export interface AdminUsersListParams {
  page?: number;
  pageSize?: number;
  role?: "seller" | "admin";
  status?: string;
  search?: string;
}

// Action Payloads
export interface RejectPayload {
  reason: string;
}

// ============ Dashboard ============

export async function getDashboardStats(): Promise<
  ApiResponse<AdminDashboardStats>
> {
  return apiClient.get<AdminDashboardStats>(API_ENDPOINTS.admin.stats);
}

// ============ Games Management ============

export async function getGames(): Promise<ApiResponse<Game[]>> {
  return apiClient.get<Game[]>(API_ENDPOINTS.admin.games);
}

export async function updateGame(
  id: string,
  data: Partial<Game>
): Promise<ApiResponse<Game>> {
  return apiClient.put<Game>(API_ENDPOINTS.admin.updateGame(id), data);
}

export async function toggleGame(
  id: string,
  isActive: boolean
): Promise<ApiResponse<Game>> {
  return apiClient.patch<Game>(API_ENDPOINTS.admin.toggleGame(id), {
    isActive,
  });
}

// ============ Shops Management ============

export async function getShops(
  params?: AdminShopsListParams
): Promise<ApiResponse<PaginatedResponse<Shop>>> {
  return apiClient.get<PaginatedResponse<Shop>>(API_ENDPOINTS.admin.shops, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getShop(id: string): Promise<ApiResponse<Shop>> {
  return apiClient.get<Shop>(API_ENDPOINTS.admin.getShop(id));
}

export async function approveShop(id: string): Promise<ApiResponse<Shop>> {
  return apiClient.post<Shop>(API_ENDPOINTS.admin.approveShop(id));
}

export async function rejectShop(
  id: string,
  payload: RejectPayload
): Promise<ApiResponse<Shop>> {
  return apiClient.post<Shop>(API_ENDPOINTS.admin.rejectShop(id), payload);
}

export async function verifyShop(
  id: string,
  isVerified: boolean
): Promise<ApiResponse<Shop>> {
  return apiClient.patch<Shop>(API_ENDPOINTS.admin.verifyShop(id), {
    isVerified,
  });
}

export async function banShop(
  id: string,
  reason: string
): Promise<ApiResponse<Shop>> {
  return apiClient.post<Shop>(API_ENDPOINTS.admin.banShop(id), { reason });
}

// ============ Accs Management ============

export async function getAccs(
  params?: AdminAccsListParams
): Promise<ApiResponse<PaginatedResponse<Acc>>> {
  return apiClient.get<PaginatedResponse<Acc>>(API_ENDPOINTS.admin.accs, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getAcc(id: string): Promise<ApiResponse<Acc>> {
  return apiClient.get<Acc>(API_ENDPOINTS.admin.getAcc(id));
}

export async function approveAcc(id: string): Promise<ApiResponse<Acc>> {
  return apiClient.post<Acc>(API_ENDPOINTS.admin.approveAcc(id));
}

export async function rejectAcc(
  id: string,
  payload: RejectPayload
): Promise<ApiResponse<Acc>> {
  return apiClient.post<Acc>(API_ENDPOINTS.admin.rejectAcc(id), payload);
}

export async function featureAcc(
  id: string,
  isHot: boolean
): Promise<ApiResponse<Acc>> {
  return apiClient.patch<Acc>(API_ENDPOINTS.admin.featureAcc(id), { isHot });
}

// ============ Users Management ============

export async function getUsers(
  params?: AdminUsersListParams
): Promise<ApiResponse<PaginatedResponse<User>>> {
  return apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.admin.users, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export async function getUser(id: string): Promise<ApiResponse<User>> {
  return apiClient.get<User>(API_ENDPOINTS.admin.getUser(id));
}

// ============ Settings ============

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  adminZaloPhone: string;
  adminZaloName: string;
  maintenanceMode: boolean;
  featuredGames: string[];
}

export async function getSettings(): Promise<ApiResponse<AdminSettings>> {
  return apiClient.get<AdminSettings>(API_ENDPOINTS.admin.settings);
}

export async function updateSettings(
  data: Partial<AdminSettings>
): Promise<ApiResponse<AdminSettings>> {
  return apiClient.put<AdminSettings>(API_ENDPOINTS.admin.settings, data);
}

// ============ Export ============
export const adminApi = {
  // Dashboard
  getDashboardStats,

  // Games
  getGames,
  updateGame,
  toggleGame,

  // Shops
  getShops,
  getShop,
  approveShop,
  rejectShop,
  verifyShop,
  banShop,

  // Accs
  getAccs,
  getAcc,
  approveAcc,
  rejectAcc,
  featureAcc,

  // Users
  getUsers,
  getUser,

  // Settings
  getSettings,
  updateSettings,
};

export default adminApi;
