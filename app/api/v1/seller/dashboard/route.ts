import { prisma } from "@/lib/db/prisma";
import {
  getCurrentUser,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

// Cache dashboard for 60 seconds
export const dynamic = "force-dynamic";
export const revalidate = 60;

/**
 * GET /api/v1/seller/dashboard
 * Lấy thống kê dashboard của seller
 */
export async function GET() {
  const startTime = Date.now();
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Optimize: Get all stats in one efficient query using raw aggregation
    const statsQuery = prisma.$queryRaw<
      Array<{
        status: string;
        count: bigint;
        total_views: bigint;
        total_price: bigint;
      }>
    >`
      SELECT 
        status,
        COUNT(*)::bigint as count,
        COALESCE(SUM(views), 0)::bigint as total_views,
        COALESCE(SUM(price), 0)::bigint as total_price
      FROM accs
      WHERE "sellerId" = ${user.id}
      GROUP BY status
    `;

    const [statsResult, recentAccs] = await Promise.all([
      statsQuery,
      // Get recent accs with minimal fields
      prisma.acc.findMany({
        where: { sellerId: user.id },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          thumbnail: true,
          status: true,
          views: true,
          createdAt: true,
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
      }),
    ]);

    // Process stats results
    let totalAccs = 0;
    let pendingAccs = 0;
    let approvedAccs = 0;
    let soldAccs = 0;
    let totalViews = 0;
    let totalRevenue = 0;

    statsResult.forEach((row) => {
      const count = Number(row.count);
      totalAccs += count;
      totalViews += Number(row.total_views);

      if (row.status === "PENDING") pendingAccs = count;
      if (row.status === "APPROVED") approvedAccs = count;
      if (row.status === "SOLD") {
        soldAccs = count;
        totalRevenue = Number(row.total_price);
      }
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
        totalViews,
        totalRevenue,
      },
      recentAccs,
    });
  } catch (error) {
    console.error("GET /api/v1/seller/dashboard error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  } finally {
    const duration = Date.now() - startTime;
    console.log(`[PERF] GET /api/v1/seller/dashboard - ${duration}ms`);
  }
}
