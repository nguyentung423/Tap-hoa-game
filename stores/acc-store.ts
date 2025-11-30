import { create } from "zustand";
import { Acc } from "@/types";

interface AccState {
  accs: Acc[];
  featuredAccs: Acc[];
  currentAcc: Acc | null;
  relatedAccs: Acc[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  page: number;
}

interface AccActions {
  setAccs: (accs: Acc[]) => void;
  appendAccs: (accs: Acc[]) => void;
  setFeaturedAccs: (accs: Acc[]) => void;
  setCurrentAcc: (acc: Acc | null) => void;
  setRelatedAccs: (accs: Acc[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  incrementPage: () => void;
  resetPagination: () => void;
  incrementViews: (accId: string) => void;
}

type AccStore = AccState & AccActions;

export const useAccStore = create<AccStore>((set, get) => ({
  accs: [],
  featuredAccs: [],
  currentAcc: null,
  relatedAccs: [],
  isLoading: false,
  isError: false,
  hasMore: true,
  page: 1,

  setAccs: (accs) => set({ accs }),

  appendAccs: (newAccs) =>
    set((state) => ({
      accs: [...state.accs, ...newAccs],
    })),

  setFeaturedAccs: (featuredAccs) => set({ featuredAccs }),

  setCurrentAcc: (currentAcc) => set({ currentAcc }),

  setRelatedAccs: (relatedAccs) => set({ relatedAccs }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (isError) => set({ isError }),

  setHasMore: (hasMore) => set({ hasMore }),

  incrementPage: () => set((state) => ({ page: state.page + 1 })),

  resetPagination: () => set({ page: 1, hasMore: true, accs: [] }),

  incrementViews: (accId) =>
    set((state) => ({
      accs: state.accs.map((acc) =>
        acc.id === accId ? { ...acc, views: acc.views + 1 } : acc
      ),
      currentAcc:
        state.currentAcc?.id === accId
          ? { ...state.currentAcc, views: state.currentAcc.views + 1 }
          : state.currentAcc,
    })),
}));

// Selector hooks
export const useAccById = (id: string) => {
  return useAccStore(
    (state) => state.accs.find((acc) => acc.id === id) || state.currentAcc
  );
};

export const useVipAccs = () => {
  return useAccStore((state) => state.accs.filter((acc) => acc.isVip));
};

export const useHotAccs = () => {
  return useAccStore((state) => state.accs.filter((acc) => acc.isHot));
};
