/**
 * Games API Service
 * Xử lý các API liên quan đến Games
 */

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { Game, GameSlug } from "@/types/game";
import { ApiResponse } from "@/types/api";

// ============ Types ============
export interface GamesListParams {
  activeOnly?: boolean;
}

// ============ API Functions ============

/**
 * Lấy danh sách tất cả games
 */
export async function getGames(
  params?: GamesListParams
): Promise<ApiResponse<Game[]>> {
  return apiClient.get<Game[]>(API_ENDPOINTS.games.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

/**
 * Lấy danh sách games đang active
 */
export async function getActiveGames(): Promise<ApiResponse<Game[]>> {
  return apiClient.get<Game[]>(API_ENDPOINTS.games.active);
}

/**
 * Lấy thông tin 1 game theo slug
 */
export async function getGameBySlug(
  slug: GameSlug
): Promise<ApiResponse<Game>> {
  return apiClient.get<Game>(API_ENDPOINTS.games.getBySlug(slug));
}

// ============ Export ============
export const gamesApi = {
  getGames,
  getActiveGames,
  getGameBySlug,
};

export default gamesApi;
