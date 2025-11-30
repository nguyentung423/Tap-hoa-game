/**
 * API Client - HTTP Client wrapper
 * Sử dụng fetch với các config mặc định
 */

import { ApiResponse } from "@/types/api";

// Base URL - sẽ lấy từ env khi deploy
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Default headers
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Request options type
interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

/**
 * Build URL with query params
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(endpoint, BASE_URL || window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Get auth token from storage/cookies
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Có thể lấy từ localStorage, sessionStorage, hoặc cookie
  // Tùy theo cách implement auth
  return localStorage.getItem("auth_token");
}

/**
 * Core fetch wrapper
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, body, headers: customHeaders, ...restOptions } = options;

  const url = buildUrl(endpoint, params);

  // Build headers
  const headers: HeadersInit = {
    ...DEFAULT_HEADERS,
    ...customHeaders,
  };

  // Add auth token if exists
  const token = getAuthToken();
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Build request config
  const config: RequestInit = {
    ...restOptions,
    headers,
  };

  // Add body if exists
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Parse JSON response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || "Something went wrong",
      };
    }

    return {
      success: true,
      data: data.data ?? data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * HTTP Methods
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
