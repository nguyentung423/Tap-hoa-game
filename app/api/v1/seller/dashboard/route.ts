import { prisma } from "@/lib/db/prisma";
import {
  getCurrentUser,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * GET /api/v1/seller/dashboard
 * Lấy thống kê dashboard của seller
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Get acc stats
    const [totalAccs, pendingAccs, approvedAccs, soldAccs, totalViews] =
      await Promise.all([
        prisma.acc.count({ where: { sellerId: user.id } }),
        prisma.acc.count({
          where: { sellerId: user.id, status: "PENDING" },
        }),
        prisma.acc.count({
          where: { sellerId: user.id, status: "APPROVED" },
        }),
        prisma.acc.count({
          where: { sellerId: user.id, status: "SOLD" },
        }),
        prisma.acc.aggregate({
          where: { sellerId: user.id },
          _sum: { views: true },
        }),
      ]);

    // Get total revenue from sold accs
    const revenue = await prisma.acc.aggregate({
      where: { sellerId: user.id, status: "SOLD" },
      _sum: { price: true },
    });

    // Get recent accs
    const recentAccs = await prisma.acc.findMany({
      where: { sellerId: user.id },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return successResponse({
      shop: {
        id: user.id,
        name: user.shopName,
        slug: user.shopSlug,
        avatar: user.shopAvatar,
        status: user.status,
        isVerified: user.isVerified,
        rating: user.rating,
        totalReviews: user.totalReviews,
        totalSales: user.totalSales,
      },
      stats: {
        totalAccs,
        pendingAccs,
        approvedAccs,
        soldAccs,
        totalViews: totalViews._sum.views || 0,
        totalRevenue: revenue._sum.price || 0,
      },
      recentAccs,
    });
  } catch (error) {
    console.error("GET /api/v1/seller/dashboard error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
