"use client";

import { useState, useCallback } from "react";
import { useDebounce } from "./use-debounce";

interface UseSearchOptions {
  debounceMs?: number;
}

export function useSearch({ debounceMs = 300 }: UseSearchOptions = {}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, debounceMs);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    handleSearch,
    clearSearch,
    isSearching: query !== debouncedQuery,
  };
}
