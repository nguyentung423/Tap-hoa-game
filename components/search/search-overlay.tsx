"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, X, Clock, TrendingUp, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui";
import { useSearch } from "@/hooks/use-search";
import { useUserStore } from "@/stores";
import { GAMES } from "@/types/game";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, debouncedQuery, isSearching } = useSearch();
  const {
    searchHistory,
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
  } = useUserStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    addSearchHistory(searchQuery);
    router.push(`/acc?search=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const trendingSearches = ["Full skin", "VIP", "Rank cao", "Giá rẻ", "Mới"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="sticky top-0 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="container flex items-center gap-3 px-4 py-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm tài khoản game..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-10"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Huỷ
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="container px-4 py-6 space-y-6 overflow-auto max-h-[calc(100vh-80px)]">
            {/* Search History */}
            {searchHistory.length > 0 && !query && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Tìm kiếm gần đây
                  </h3>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Xoá tất cả
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSearch(item)}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSearchHistory(item);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {!query && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  Xu hướng tìm kiếm
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSearch(item)}
                      className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm hover:bg-primary/20 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Game Links */}
            {!query && (
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Gamepad2 className="w-4 h-4 text-muted-foreground" />
                  Game phổ biến
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {/* Active games */}
                  {GAMES.filter((g) => g.isActive)
                    .slice(0, 2)
                    .map((game) => (
                      <Link
                        key={game.id}
                        href={`/acc?game=${game.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                      >
                        <span className="text-xl">{game.icon}</span>
                        <span className="text-sm font-medium">{game.name}</span>
                      </Link>
                    ))}
                  {/* Coming soon games */}
                  {GAMES.filter((g) => !g.isActive)
                    .slice(0, 4)
                    .map((game) => (
                      <div
                        key={game.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed relative"
                      >
                        <span className="text-xl">{game.icon}</span>
                        <span className="text-sm font-medium">{game.name}</span>
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-500 font-bold">
                          Soon
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && debouncedQuery && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  {isSearching ? (
                    "Đang tìm kiếm..."
                  ) : (
                    <>
                      Nhấn Enter để tìm &quot;<strong>{query}</strong>&quot;
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
