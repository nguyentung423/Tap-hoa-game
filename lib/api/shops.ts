/**
 * Shops API Service
 * Xử lý các API liên quan đến Shops
 */

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Shop, ShopFilters } from "@/types/shop";
import { ApiResponse, PaginatedResponse } from "@/types/api";

// ============ Types ============
export interface ShopsListParams extends ShopFilters {
  page?: number;
  pageSize?: number;
}

// ============ API Functions ============

/**
 * Lấy danh sách shops (public)
 */
export async function getShops(
  params?: ShopsListParams
): Promise<ApiResponse<PaginatedResponse<Shop>>> {
  return apiClient.get<PaginatedResponse<Shop>>(API_ENDPOINTS.shops.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Lấy danh sách shops featured
 */
export async function getFeaturedShops(): Promise<ApiResponse<Shop[]>> {
  return apiClient.get<Shop[]>(API_ENDPOINTS.shops.featured);
}

/**
 * Lấy thông tin shop theo slug
 */
export async function getShopBySlug(slug: string): Promise<ApiResponse<Shop>> {
  return apiClient.get<Shop>(API_ENDPOINTS.shops.getBySlug(slug));
}

// ============ Export ============
export const shopsApi = {
  getShops,
  getFeaturedShops,
  getShopBySlug,
};

export default shopsApi;
