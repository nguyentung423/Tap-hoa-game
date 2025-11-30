"use client";

import { useState, useCallback } from "react";
import { AccFilters, GameSlug } from "@/types";

interface UseFiltersReturn {
  filters: AccFilters;
  setFilters: (filters: AccFilters) => void;
  updateFilter: <K extends keyof AccFilters>(key: K, value: AccFilters[K]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useFilters(initialFilters: AccFilters = {}): UseFiltersReturn {
  const [filters, setFilters] = useState<AccFilters>(initialFilters);

  const updateFilter = useCallback(
    <K extends keyof AccFilters>(key: K, value: AccFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = !!(
    filters.gameSlug ||
    filters.search ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sortBy
  );

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}
