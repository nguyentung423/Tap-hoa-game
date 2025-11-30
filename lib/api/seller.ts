/**
 * Seller API Service
 * Xử lý các API cho Seller Dashboard
 */

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Acc, AccStatus } from "@/types/acc";
import { Shop } from "@/types/shop";
import { ApiResponse, PaginatedResponse } from "@/types/api";

// ============ Types ============

// Dashboard Stats
export interface SellerDashboardStats {
  totalAccs: number;
  pendingAccs: number;
  approvedAccs: number;
  soldAccs: number;
  totalViews: number;
  totalRevenue: number;
}

// Seller Acc (includes more fields than public Acc)
export interface SellerAcc extends Acc {
  adminNote?: string;
}

// Create/Update Acc payload
export interface CreateAccPayload {
  gameId: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  attributes: Record<string, string>;
}

export interface UpdateAccPayload extends Partial<CreateAccPayload> {}

// Seller Accs List Params
export interface SellerAccsListParams {
  page?: number;
  pageSize?: number;
  status?: AccStatus;
  gameSlug?: string;
  search?: string;
}

// ============ API Functions ============

/**
 * Lấy dashboard stats
 */
export async function getDashboardStats(): Promise<
  ApiResponse<SellerDashboardStats>
> {
  return apiClient.get<SellerDashboardStats>(API_ENDPOINTS.seller.stats);
}

/**
 * Lấy thông tin shop của seller
 */
export async function getMyShop(): Promise<ApiResponse<Shop>> {
  return apiClient.get<Shop>(API_ENDPOINTS.seller.shop);
}

/**
 * Cập nhật thông tin shop
 */
export async function updateMyShop(
  data: Partial<Shop>
): Promise<ApiResponse<Shop>> {
  return apiClient.put<Shop>(API_ENDPOINTS.seller.updateShop, data);
}

/**
 * Lấy danh sách accs của seller
 */
export async function getMyAccs(
  params?: SellerAccsListParams
): Promise<ApiResponse<PaginatedResponse<SellerAcc>>> {
  return apiClient.get<PaginatedResponse<SellerAcc>>(
    API_ENDPOINTS.seller.accs,
    {
      params: params as Record<string, string | number | boolean | undefined>,
    }
  );
}

/**
 * Lấy chi tiết 1 acc của seller
 */
export async function getMyAcc(id: string): Promise<ApiResponse<SellerAcc>> {
  return apiClient.get<SellerAcc>(API_ENDPOINTS.seller.getAcc(id));
}

/**
 * Tạo acc mới
 */
export async function createAcc(
  data: CreateAccPayload
): Promise<ApiResponse<SellerAcc>> {
  return apiClient.post<SellerAcc>(API_ENDPOINTS.seller.createAcc, data);
}

/**
 * Cập nhật acc
 */
export async function updateAcc(
  id: string,
  data: UpdateAccPayload
): Promise<ApiResponse<SellerAcc>> {
  return apiClient.put<SellerAcc>(API_ENDPOINTS.seller.updateAcc(id), data);
}

/**
 * Xóa acc
 */
export async function deleteAcc(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiClient.delete<{ success: boolean }>(
    API_ENDPOINTS.seller.deleteAcc(id)
  );
}

// ============ Export ============
export const sellerApi = {
  getDashboardStats,
  getMyShop,
  updateMyShop,
  getMyAccs,
  getMyAcc,
  createAcc,
  updateAcc,
  deleteAcc,
};

export default sellerApi;
