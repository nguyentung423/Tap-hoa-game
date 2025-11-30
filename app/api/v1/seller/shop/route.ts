import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  getCurrentUser,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * GET /api/v1/seller/shop
 * Lấy thông tin shop của seller hiện tại
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Đếm số acc đang bán (APPROVED)
    const totalAccsOnSale = await prisma.acc.count({
      where: {
        sellerId: user.id,
        status: "APPROVED",
      },
    });

    // Đếm tổng số acc
    const totalAccs = await prisma.acc.count({
      where: {
        sellerId: user.id,
      },
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
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      rating: user.rating,
      totalReviews: user.totalReviews,
      totalSales: user.totalSales,
      totalViews: user.totalViews,
      totalAccs,
      totalAccsOnSale,
      createdAt: user.createdAt,
      approvedAt: user.approvedAt,
    });
  } catch (error) {
    console.error("GET /api/v1/seller/shop error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
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

    // Check if user already has a shop
    if (user.shopName) {
      return errorResponse(
        "Bạn đã có shop rồi. Mỗi tài khoản chỉ được tạo 1 shop.",
        400
      );
    }

    const body = await request.json();
    const { shopName, shopDesc, shopAvatar } = body;

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
    const { shopDesc, shopAvatar, shopCover } = body;

    // Update shop info (shopName và shopSlug không được thay đổi)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(shopDesc !== undefined && { shopDesc: shopDesc?.trim() || null }),
        ...(shopAvatar !== undefined && { shopAvatar }),
        ...(shopCover !== undefined && { shopCover }),
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
