import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api/helpers";

// ISR: Cache for 60 seconds
export const revalidate = 60;

/**
 * GET /api/v1/shops
 * Lấy danh sách shops công khai (đã được duyệt)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const status = searchParams.get("status") || "APPROVED";

    // Build where clause
    const where: any = {
      shopName: { not: null },
      status: status,
    };

    // Get shops with stats
    const [shops, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          shopName: true,
          shopSlug: true,
          shopAvatar: true,
          shopDesc: true,
          featuredGames: true,
          status: true,
          isVerified: true,
          isVipShop: true,
          vipShopEndTime: true,
          isStrategicPartner: true,
          partnerTier: true,
          partnerSince: true,
          commissionRate: true,
          rating: true,
          totalReviews: true,
          totalSales: true,
          totalViews: true,
          createdAt: true,
          _count: {
            select: {
              accs: {
                where: {
                  status: "APPROVED",
                },
              },
            },
          },
        },
        orderBy: [
          { isStrategicPartner: "desc" }, // Strategic partners first
          { isVipShop: "desc" }, // VIP shops second
          { isVerified: "desc" }, // Verified third
          { totalSales: "desc" }, // Then by sales
          { createdAt: "desc" }, // Then by newest
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Transform shops to include totalAccs
    const shopsWithAccCount = shops.map((shop) => ({
      ...shop,
      totalAccs: shop._count.accs,
      _count: undefined, // Remove _count from response
    }));

    return successResponse({
      items: shopsWithAccCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/v1/shops error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
