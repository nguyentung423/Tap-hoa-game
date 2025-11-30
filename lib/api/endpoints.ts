/**
 * API Endpoints Configuration
 * Tất cả endpoints được định nghĩa tại đây để dễ quản lý
 */

const API_VERSION = "/api/v1";

export const API_ENDPOINTS = {
  // ============ AUTH ============
  // Google OAuth - NextAuth.js xử lý ở frontend
  // Backend chỉ cần sync user từ Google profile
  auth: {
    // Sync user info từ Google OAuth (gọi sau khi đăng nhập thành công)
    syncGoogle: `${API_VERSION}/auth/google/sync`,
    logout: `${API_VERSION}/auth/logout`,
    me: `${API_VERSION}/auth/me`,
  },

  // ============ GAMES ============
  games: {
    list: `${API_VERSION}/games`,
    getBySlug: (slug: string) => `${API_VERSION}/games/${slug}`,
    active: `${API_VERSION}/games/active`,
  },

  // ============ ACCS (Public) ============
  accs: {
    list: `${API_VERSION}/accs`,
    getBySlug: (slug: string) => `${API_VERSION}/accs/${slug}`,
    hot: `${API_VERSION}/accs/hot`,
    byGame: (gameSlug: string) => `${API_VERSION}/accs/game/${gameSlug}`,
    byShop: (shopSlug: string) => `${API_VERSION}/accs/shop/${shopSlug}`,
    search: `${API_VERSION}/accs/search`,
  },

  // ============ SHOPS (Public) ============
  shops: {
    list: `${API_VERSION}/shops`,
    getBySlug: (slug: string) => `${API_VERSION}/shops/${slug}`,
    featured: `${API_VERSION}/shops/featured`,
  },

  // ============ SELLER ============
  seller: {
    // Dashboard
    dashboard: `${API_VERSION}/seller/dashboard`,
    stats: `${API_VERSION}/seller/stats`,

    // Shop management
    shop: `${API_VERSION}/seller/shop`,
    updateShop: `${API_VERSION}/seller/shop`,

    // Acc management
    accs: `${API_VERSION}/seller/accs`,
    getAcc: (id: string) => `${API_VERSION}/seller/accs/${id}`,
    createAcc: `${API_VERSION}/seller/accs`,
    updateAcc: (id: string) => `${API_VERSION}/seller/accs/${id}`,
    deleteAcc: (id: string) => `${API_VERSION}/seller/accs/${id}`,

    // Orders
    orders: `${API_VERSION}/seller/orders`,
    getOrder: (id: string) => `${API_VERSION}/seller/orders/${id}`,
  },

  // ============ ADMIN ============
  admin: {
    // Dashboard
    dashboard: `${API_VERSION}/admin/dashboard`,
    stats: `${API_VERSION}/admin/stats`,

    // Games management
    games: `${API_VERSION}/admin/games`,
    updateGame: (id: string) => `${API_VERSION}/admin/games/${id}`,
    toggleGame: (id: string) => `${API_VERSION}/admin/games/${id}/toggle`,

    // Shops management
    shops: `${API_VERSION}/admin/shops`,
    getShop: (id: string) => `${API_VERSION}/admin/shops/${id}`,
    approveShop: (id: string) => `${API_VERSION}/admin/shops/${id}/approve`,
    rejectShop: (id: string) => `${API_VERSION}/admin/shops/${id}/reject`,
    verifyShop: (id: string) => `${API_VERSION}/admin/shops/${id}/verify`,
    banShop: (id: string) => `${API_VERSION}/admin/shops/${id}/ban`,

    // Accs management
    accs: `${API_VERSION}/admin/accs`,
    getAcc: (id: string) => `${API_VERSION}/admin/accs/${id}`,
    approveAcc: (id: string) => `${API_VERSION}/admin/accs/${id}/approve`,
    rejectAcc: (id: string) => `${API_VERSION}/admin/accs/${id}/reject`,
    featureAcc: (id: string) => `${API_VERSION}/admin/accs/${id}/feature`,

    // Users management
    users: `${API_VERSION}/admin/users`,
    getUser: (id: string) => `${API_VERSION}/admin/users/${id}`,

    // Settings
    settings: `${API_VERSION}/admin/settings`,
  },

  // ============ UPLOAD ============
  upload: {
    image: `${API_VERSION}/upload/image`,
    images: `${API_VERSION}/upload/images`,
  },
} as const;

export default API_ENDPOINTS;
