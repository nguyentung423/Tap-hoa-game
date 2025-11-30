import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * GET /api/v1/admin/stats
 * Lấy thống kê tổng quan cho admin dashboard
 */
export async function GET() {
  try {
    await requireAdminAuth();

    // Get stats sequentially to avoid connection pool issues
    const totalShops = await prisma.user.count({
      where: { shopName: { not: null } },
    });
    const pendingShops = await prisma.user.count({
      where: { status: "PENDING", shopName: { not: null } },
    });
    const approvedShops = await prisma.user.count({
      where: { status: "APPROVED", shopName: { not: null } },
    });
    const totalAccs = await prisma.acc.count();
    const pendingAccs = await prisma.acc.count({
      where: { status: "PENDING" },
    });
    const approvedAccs = await prisma.acc.count({
      where: { status: "APPROVED" },
    });
    const soldAccs = await prisma.acc.count({ where: { status: "SOLD" } });
    const totalGames = await prisma.game.count({ where: { isActive: true } });

    // Get recent pending shops
    const recentPendingShops = await prisma.user.findMany({
      where: {
        status: "PENDING",
        shopName: { not: null },
      },
      select: {
        id: true,
        email: true,
        name: true,
        shopName: true,
        shopAvatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Get recent pending accs
    const recentPendingAccs = await prisma.acc.findMany({
      where: { status: "PENDING" },
      select: {
        id: true,
        title: true,
        price: true,
        thumbnail: true,
        createdAt: true,
        seller: {
          select: {
            id: true,
            shopName: true,
          },
        },
        game: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return successResponse({
      stats: {
        totalShops,
        pendingShops,
        approvedShops,
        totalAccs,
        pendingAccs,
        approvedAccs,
        soldAccs,
        totalGames,
      },
      recentPendingShops,
      recentPendingAccs,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("GET /api/v1/admin/stats error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
