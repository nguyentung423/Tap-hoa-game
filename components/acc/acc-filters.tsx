"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/types/game";
import { AccFilters as AccFiltersType, GameSlug } from "@/types";

interface AccFiltersProps {
  filters: AccFiltersType;
  onFiltersChange: (filters: AccFiltersType) => void;
  className?: string;
}

const PRICE_RANGES = [
  { label: "Tất cả", min: undefined, max: undefined },
  { label: "Dưới 500K", min: 0, max: 500000 },
  { label: "500K - 1M", min: 500000, max: 1000000 },
  { label: "1M - 3M", min: 1000000, max: 3000000 },
  { label: "Trên 3M", min: 3000000, max: undefined },
];

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá thấp → cao", value: "price-asc" },
  { label: "Giá cao → thấp", value: "price-desc" },
  { label: "Phổ biến nhất", value: "popular" },
];

export function AccFilters({
  filters,
  onFiltersChange,
  className,
}: AccFiltersProps) {
  const handleGameChange = (gameSlug: GameSlug | undefined) => {
    onFiltersChange({ ...filters, gameSlug });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    onFiltersChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleSortChange = (sortBy: AccFiltersType["sortBy"]) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters =
    filters.gameSlug || filters.minPrice || filters.maxPrice || filters.sortBy;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Game filter */}
      <div>
        <h3 className="text-sm font-medium mb-2">Game</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGameChange(undefined)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition-colors",
              !filters.gameSlug
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            Tất cả
          </button>
          {/* Active games */}
          {GAMES.filter((g) => g.isActive).map((game) => (
            <button
              key={game.slug}
              onClick={() => handleGameChange(game.slug as GameSlug)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1",
                filters.gameSlug === game.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <span>{game.icon}</span>
              <span>{game.name.split(" ").slice(0, 2).join(" ")}</span>
            </button>
          ))}
          {/* Coming soon games */}
          {GAMES.filter((g) => !g.isActive)
            .slice(0, 3)
            .map((game) => (
              <div
                key={game.slug}
                className="px-3 py-1.5 rounded-full text-sm bg-muted/50 flex items-center gap-1 opacity-50 cursor-not-allowed"
              >
                <span>{game.icon}</span>
                <span>{game.name.split(" ").slice(0, 2).join(" ")}</span>
                <span className="px-1 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-500 font-bold ml-1">
                  Soon
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Price filter */}
      <div>
        <h3 className="text-sm font-medium mb-2">Mức giá</h3>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((range, idx) => (
            <button
              key={idx}
              onClick={() => handlePriceChange(range.min, range.max)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                filters.minPrice === range.min && filters.maxPrice === range.max
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-medium mb-2">Sắp xếp</h3>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                handleSortChange(option.value as AccFiltersType["sortBy"])
              }
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-colors",
                filters.sortBy === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1"
        >
          <X className="w-4 h-4" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}

export default AccFilters;
