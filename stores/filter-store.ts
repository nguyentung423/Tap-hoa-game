import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AccFilters } from "@/types";
import { GAMES, GameSlug } from "@/types/game";

interface FilterState {
  filters: AccFilters;
  activeGame: GameSlug | null;
  viewMode: "grid" | "list";
}

interface FilterActions {
  setFilters: (filters: AccFilters) => void;
  updateFilter: <K extends keyof AccFilters>(
    key: K,
    value: AccFilters[K]
  ) => void;
  clearFilter: (key: keyof AccFilters) => void;
  clearAllFilters: () => void;
  setActiveGame: (gameSlug: GameSlug | null) => void;
  setSortBy: (sort: AccFilters["sortBy"]) => void;
  setViewMode: (mode: FilterState["viewMode"]) => void;
}

type FilterStore = FilterState & FilterActions;

const initialFilters: AccFilters = {
  gameSlug: undefined,
  search: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: "newest",
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      filters: initialFilters,
      activeGame: null,
      viewMode: "grid",

      setFilters: (filters) => set({ filters }),

      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      clearFilter: (key) =>
        set((state) => {
          const newFilters = { ...state.filters };
          delete newFilters[key];
          return { filters: newFilters };
        }),

      clearAllFilters: () =>
        set({
          filters: initialFilters,
          activeGame: null,
        }),

      setActiveGame: (gameSlug) => {
        set((state) => ({
          activeGame: gameSlug,
          filters: { ...state.filters, gameSlug: gameSlug || undefined },
        }));
      },

      setSortBy: (sortBy) =>
        set((state) => ({
          filters: { ...state.filters, sortBy },
        })),

      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: "accvip-filters",
      partialize: (state) => ({
        filters: { sortBy: state.filters.sortBy },
        viewMode: state.viewMode,
      }),
    }
  )
);

// Selector hooks
export const useActiveGame = () => {
  const activeGame = useFilterStore((s) => s.activeGame);
  return activeGame ? GAMES.find((g) => g.slug === activeGame) : null;
};

export const useHasActiveFilters = () => {
  const filters = useFilterStore((s) => s.filters);
  return (
    !!filters.gameSlug ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    !!filters.search
  );
};
