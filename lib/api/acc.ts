/**
 * Accs API Service
 * Xử lý các API liên quan đến Accs (Public)
 */

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Acc, AccFilters, AccListResponse } from "@/types/acc";
import { ApiResponse } from "@/types/api";
import { GameSlug } from "@/types/game";

// ============ Types ============
export interface AccsListParams extends AccFilters {
  page?: number;
  pageSize?: number;
}

// ============ API Functions ============

/**
 * Lấy danh sách accs (public)
 */
export async function getAccs(
  params?: AccsListParams
): Promise<ApiResponse<AccListResponse>> {
  return apiClient.get<AccListResponse>(API_ENDPOINTS.accs.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Lấy danh sách accs hot
 */
export async function getHotAccs(limit?: number): Promise<ApiResponse<Acc[]>> {
  return apiClient.get<Acc[]>(API_ENDPOINTS.accs.hot, {
    params: { limit },
  });
}

/**
 * Lấy accs theo game
 */
export async function getAccsByGame(
  gameSlug: GameSlug,
  params?: AccsListParams
): Promise<ApiResponse<AccListResponse>> {
  return apiClient.get<AccListResponse>(API_ENDPOINTS.accs.byGame(gameSlug), {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Lấy accs theo shop
 */
export async function getAccsByShop(
  shopSlug: string,
  params?: AccsListParams
): Promise<ApiResponse<AccListResponse>> {
  return apiClient.get<AccListResponse>(API_ENDPOINTS.accs.byShop(shopSlug), {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Lấy chi tiết acc theo slug
 */
export async function getAccBySlug(slug: string): Promise<ApiResponse<Acc>> {
  return apiClient.get<Acc>(API_ENDPOINTS.accs.getBySlug(slug));
}

/**
 * Tìm kiếm accs
 */
export async function searchAccs(
  query: string,
  params?: AccsListParams
): Promise<ApiResponse<AccListResponse>> {
  return apiClient.get<AccListResponse>(API_ENDPOINTS.accs.search, {
    params: {
      q: query,
      ...(params as Record<string, string | number | boolean | undefined>),
    },
  });
}

// ============ Export ============
export const accsApi = {
  getAccs,
  getHotAccs,
  getAccsByGame,
  getAccsByShop,
  getAccBySlug,
  searchAccs,
};

export default accsApi;
