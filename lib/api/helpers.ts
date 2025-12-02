import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

const ADMIN_JWT_SECRET =
  process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production";

// In-memory cache for user data (lasts for request lifecycle)
const userCache = new Map<string, { user: any; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds

/**
 * Get current authenticated user from session with caching
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const email = session.user.email;
  const now = Date.now();

  // Check cache
  const cached = userCache.get(email);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.user;
  }

  // Query database with minimal fields
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      shopName: true,
      shopSlug: true,
      shopDesc: true,
      shopAvatar: true,
      shopCover: true,
      role: true,
      status: true,
      isVerified: true,
      rating: true,
      totalReviews: true,
      totalSales: true,
      totalViews: true,
      createdAt: true,
      approvedAt: true,
    },
  });

  // Cache result
  if (user) {
    userCache.set(email, { user, timestamp: now });

    // Clean old cache entries (prevent memory leak)
    if (userCache.size > 100) {
      const firstKey = userCache.keys().next().value;
      if (firstKey) userCache.delete(firstKey);
    }
  }

  return user;
}

/**
 * Check admin authentication from JWT cookie
 */
export async function getAdminFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return null;

    const decoded = verify(token, ADMIN_JWT_SECRET) as {
      email: string;
      name: string;
      role: string;
    };

    if (decoded.role !== "admin") return null;

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Require admin authentication - checks JWT cookie
 */
export async function requireAdminAuth() {
  const admin = await getAdminFromToken();
  if (!admin) {
    throw NextResponse.json(
      { error: "Unauthorized", message: "Bạn cần đăng nhập admin" },
      { status: 401 }
    );
  }
  return admin;
}

/**
 * Require authentication - returns user or throws error response
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw NextResponse.json(
      { error: "Unauthorized", message: "Bạn cần đăng nhập" },
      { status: 401 }
    );
  }
  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw NextResponse.json(
      { error: "Forbidden", message: "Bạn không có quyền truy cập" },
      { status: 403 }
    );
  }
  return user;
}

/**
 * Require approved seller status
 */
export async function requireApprovedSeller() {
  const user = await requireAuth();
  if (user.status !== "APPROVED") {
    throw NextResponse.json(
      { error: "Forbidden", message: "Shop của bạn chưa được duyệt" },
      { status: 403 }
    );
  }
  return user;
}

/**
 * API Response helpers
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function notFoundResponse(message = "Không tìm thấy") {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}
