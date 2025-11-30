import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isFilterDrawerOpen: boolean;
  isLoginModalOpen: boolean;
  isContactModalOpen: boolean;
  activeModal: string | null;
  theme: "light" | "dark";
  toasts: Toast[];
}

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface UIActions {
  toggleMobileMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleFilterDrawer: () => void;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openContactModal: () => void;
  closeContactModal: () => void;
  setActiveModal: (modal: string | null) => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFilterDrawerOpen: false,
  isLoginModalOpen: false,
  isContactModalOpen: false,
  activeModal: null,
  theme: "dark",
  toasts: [],

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  toggleFilterDrawer: () =>
    set((state) => ({ isFilterDrawerOpen: !state.isFilterDrawerOpen })),
  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  openContactModal: () => set({ isContactModalOpen: true }),
  closeContactModal: () => set({ isContactModalOpen: false }),

  setActiveModal: (modal) => set({ activeModal: modal }),

  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));

// Helper function to show toast
export const showToast = (toast: Omit<Toast, "id">) => {
  useUIStore.getState().addToast(toast);
};

export const showSuccess = (title: string, message?: string) => {
  showToast({ type: "success", title, message });
};

export const showError = (title: string, message?: string) => {
  showToast({ type: "error", title, message });
};

export const showWarning = (title: string, message?: string) => {
  showToast({ type: "warning", title, message });
};

export const showInfo = (title: string, message?: string) => {
  showToast({ type: "info", title, message });
};
