/**
 * API Hooks - Custom hooks cho việc gọi API
 * Sử dụng real API từ database
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Acc, AccFilters } from "@/types/acc";
import { Shop, ShopFilters } from "@/types/shop";
import { Game } from "@/types/game";
import { accsApi, shopsApi, gamesApi, AccsListParams } from "@/lib/api";

// ============ ACCS HOOK ============
interface UseAccsOptions {
  filters?: AccFilters;
  pageSize?: number;
  enabled?: boolean;
}

interface UseAccsReturn {
  accs: Acc[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => Promise<void>;
  total: number;
}

export function useAccsQuery({
  filters = {},
  pageSize = 12,
  enabled = true,
}: UseAccsOptions = {}): UseAccsReturn {
  const [accs, setAccs] = useState<Acc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchAccs = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const params: AccsListParams = {
        ...filters,
        page,
        pageSize,
      };
      const response = await accsApi.getAccs(params);

      if (response.success && response.data) {
        if (page === 1) {
          setAccs(response.data.items);
        } else {
          setAccs((prev) => [...prev, ...response.data!.items]);
        }
        setTotal(response.data.total);
        setHasMore(response.data.hasMore);
      } else {
        throw new Error(response.error || "Failed to fetch accs");
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, filters, page, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [JSON.stringify(filters)]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchAccs();
  }, [fetchAccs]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [isLoading, hasMore]);

  const refresh = useCallback(async () => {
    setPage(1);
    await fetchAccs();
  }, [fetchAccs]);

  return {
    accs,
    isLoading,
    isError,
    error,
    hasMore,
    loadMore,
    refresh,
    total,
  };
}

// ============ HOT ACCS HOOK ============
export function useHotAccs(limit: number = 8) {
  const [accs, setAccs] = useState<Acc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      try {
        const response = await accsApi.getHotAccs(limit);
        if (response.success && response.data) {
          setAccs(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [limit]);

  return { accs, isLoading };
}

// ============ SINGLE ACC HOOK ============
export function useAcc(slug: string) {
  const [acc, setAcc] = useState<Acc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await accsApi.getAccBySlug(slug);
        if (response.success && response.data) {
          setAcc(response.data);
        } else {
          setIsError(true);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [slug]);

  return { acc, isLoading, isError };
}

// ============ SHOPS HOOK ============
interface UseShopsOptions {
  filters?: ShopFilters;
  pageSize?: number;
}

export function useShopsQuery({
  filters = {},
  pageSize = 12,
}: UseShopsOptions = {}) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await shopsApi.getShops({
          ...filters,
          page,
          pageSize,
        });
        if (response.success && response.data) {
          if (page === 1) {
            setShops(response.data.items);
          } else {
            setShops((prev) => [...prev, ...response.data!.items]);
          }
          setTotal(response.data.total);
          setHasMore(response.data.hasMore);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [filters, page, pageSize]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [isLoading, hasMore]);

  return { shops, isLoading, isError, hasMore, loadMore, total };
}

// ============ SINGLE SHOP HOOK ============
export function useShop(slug: string) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await shopsApi.getShopBySlug(slug);
        if (response.success && response.data) {
          setShop(response.data);
        } else {
          setIsError(true);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [slug]);

  return { shop, isLoading, isError };
}

// ============ GAMES HOOK ============
export function useGames(activeOnly: boolean = false) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      try {
        const response = activeOnly
          ? await gamesApi.getActiveGames()
          : await gamesApi.getGames();
        if (response.success && response.data) {
          setGames(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [activeOnly]);

  return { games, isLoading };
}

// ============ FEATURED SHOPS HOOK ============
export function useFeaturedShops(limit: number = 6) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      try {
        const response = await shopsApi.getFeaturedShops();
        if (response.success && response.data) {
          setShops(response.data.slice(0, limit));
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, [limit]);

  return { shops, isLoading };
}
