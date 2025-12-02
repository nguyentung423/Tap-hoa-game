import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  getCurrentUser,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

// Cache for 60 seconds
export const dynamic = "force-dynamic";
export const revalidate = 60;

/**
 * GET /api/v1/seller/shop
 * Lấy thông tin shop của seller hiện tại
 */
export async function GET() {
  const startTime = Date.now();
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Optimize: Get acc counts and total views with single raw query
    const accStats = await prisma.$queryRaw<
      Array<{ status: string; count: bigint; total_views: bigint }>
    >`
      SELECT 
        status,
        COUNT(*)::bigint as count,
        COALESCE(SUM(views), 0)::bigint as total_views
      FROM accs
      WHERE "sellerId" = ${user.id}
      GROUP BY status
    `;

    // Calculate totals from aggregation
    let totalAccs = 0;
    let totalAccsOnSale = 0;
    let totalViews = 0;

    accStats.forEach((stat) => {
      const count = Number(stat.count);
      totalAccs += count;
      totalViews += Number(stat.total_views);
      if (stat.status === "APPROVED") {
        totalAccsOnSale = count;
      }
    });

    return successResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      shopName: user.shopName,
      shopSlug: user.shopSlug,
      shopDesc: user.shopDesc,
      shopAvatar: user.shopAvatar,
      shopCover: user.shopCover,
      featuredGames: user.featuredGames || [],
      isVipShop: user.isVipShop,
      vipShopEndTime: user.vipShopEndTime,
      commissionRate: user.commissionRate,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      rating: user.rating,
      totalReviews: user.totalReviews,
      totalSales: user.totalSales,
      totalViews,
      totalAccs,
      totalAccsOnSale,
      createdAt: user.createdAt,
      approvedAt: user.approvedAt,
    });
  } catch (error) {
    console.error("GET /api/v1/seller/shop error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  } finally {
    const duration = Date.now() - startTime;
    console.log(`[PERF] GET /api/v1/seller/shop - ${duration}ms`);
  }
}

/**
 * POST /api/v1/seller/shop
 * Tạo shop mới (chỉ cho phép 1 lần)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Check if user is banned
    if (user.status === "BANNED") {
      return errorResponse(
        "Tài khoản này đã bị cấm tạo shop vĩnh viễn. Vui lòng liên hệ admin nếu đây là nhầm lẫn.",
        403
      );
    }

    // Check if user already has a shop
    if (user.shopName) {
      return errorResponse(
        "Bạn đã có shop rồi. Mỗi tài khoản chỉ được tạo 1 shop.",
        400
      );
    }

    const body = await request.json();
    const { shopName, shopDesc, shopAvatar, featuredGames } = body;

    // Validate shopName
    if (!shopName || shopName.trim().length < 3) {
      return errorResponse("Tên shop phải có ít nhất 3 ký tự");
    }
    if (shopName.trim().length > 50) {
      return errorResponse("Tên shop không được quá 50 ký tự");
    }

    // Generate shopSlug
    let shopSlug = generateSlug(shopName);

    // Check if slug exists
    const existing = await prisma.user.findUnique({
      where: { shopSlug },
    });

    if (existing) {
      // Add random suffix if exists
      shopSlug = `${shopSlug}-${Date.now().toString(36)}`;
    }

    // Create shop (update user with shop info)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        shopName: shopName.trim(),
        shopSlug,
        shopDesc: shopDesc?.trim() || null,
        shopAvatar: shopAvatar || null,
        featuredGames: Array.isArray(featuredGames)
          ? featuredGames.slice(0, 3)
          : [],
        commissionRate: 5.0, // Default commission rate for new shops
        status: "PENDING", // Chờ admin duyệt
        updatedAt: new Date(),
      },
    });

    return successResponse({
      id: updatedUser.id,
      shopName: updatedUser.shopName,
      shopSlug: updatedUser.shopSlug,
      shopDesc: updatedUser.shopDesc,
      shopAvatar: updatedUser.shopAvatar,
      status: updatedUser.status,
      message: "Tạo shop thành công! Vui lòng chờ admin duyệt.",
    });
  } catch (error) {
    console.error("POST /api/v1/seller/shop error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * PUT /api/v1/seller/shop
 * Cập nhật thông tin shop (chỉ khi đã có shop)
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Check if user has a shop
    if (!user.shopName) {
      return errorResponse("Bạn chưa có shop. Vui lòng tạo shop trước.", 400);
    }

    const body = await request.json();
    const { shopDesc, shopAvatar, shopCover, featuredGames } = body;

    // Update shop info (shopName và shopSlug không được thay đổi)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(shopDesc !== undefined && { shopDesc: shopDesc?.trim() || null }),
        ...(shopAvatar !== undefined && { shopAvatar }),
        ...(shopCover !== undefined && { shopCover }),
        ...(featuredGames !== undefined && {
          featuredGames: Array.isArray(featuredGames)
            ? featuredGames.slice(0, 3)
            : [],
        }),
        updatedAt: new Date(),
      },
    });

    return successResponse({
      id: updatedUser.id,
      shopName: updatedUser.shopName,
      shopSlug: updatedUser.shopSlug,
      shopDesc: updatedUser.shopDesc,
      shopAvatar: updatedUser.shopAvatar,
      shopCover: updatedUser.shopCover,
      featuredGames: updatedUser.featuredGames,
      status: updatedUser.status,
    });
  } catch (error) {
    console.error("PUT /api/v1/seller/shop error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * Generate URL-friendly slug from string
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Replace multiple - with single -
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
}
