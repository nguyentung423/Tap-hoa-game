import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface UserState {
  profile: User | null;
  isProfileLoading: boolean;
  favorites: string[]; // acc IDs
  recentlyViewed: string[]; // acc IDs
  searchHistory: string[];
}

interface UserActions {
  setProfile: (profile: User | null) => void;
  updateProfile: (data: Partial<User>) => void;
  setProfileLoading: (loading: boolean) => void;
  addFavorite: (accId: string) => void;
  removeFavorite: (accId: string) => void;
  toggleFavorite: (accId: string) => void;
  isFavorite: (accId: string) => boolean;
  addRecentlyViewed: (accId: string) => void;
  clearRecentlyViewed: () => void;
  addSearchHistory: (query: string) => void;
  removeSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

type UserStore = UserState & UserActions;

const MAX_RECENTLY_VIEWED = 20;
const MAX_SEARCH_HISTORY = 10;

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isProfileLoading: false,
      favorites: [],
      recentlyViewed: [],
      searchHistory: [],

      setProfile: (profile) => set({ profile }),

      updateProfile: (data) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...data } : null,
        })),

      setProfileLoading: (isProfileLoading) => set({ isProfileLoading }),

      addFavorite: (accId) =>
        set((state) => ({
          favorites: state.favorites.includes(accId)
            ? state.favorites
            : [...state.favorites, accId],
        })),

      removeFavorite: (accId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== accId),
        })),

      toggleFavorite: (accId) => {
        const { favorites } = get();
        if (favorites.includes(accId)) {
          get().removeFavorite(accId);
        } else {
          get().addFavorite(accId);
        }
      },

      isFavorite: (accId) => get().favorites.includes(accId),

      addRecentlyViewed: (accId) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== accId);
          return {
            recentlyViewed: [accId, ...filtered].slice(0, MAX_RECENTLY_VIEWED),
          };
        }),

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      addSearchHistory: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;

          const filtered = state.searchHistory.filter((q) => q !== trimmed);
          return {
            searchHistory: [trimmed, ...filtered].slice(0, MAX_SEARCH_HISTORY),
          };
        }),

      removeSearchHistory: (query) =>
        set((state) => ({
          searchHistory: state.searchHistory.filter((q) => q !== query),
        })),

      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: "accvip-user",
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
        searchHistory: state.searchHistory,
      }),
    }
  )
);

// Selector hooks
export const useFavoriteCount = () => {
  return useUserStore((state) => state.favorites.length);
};
