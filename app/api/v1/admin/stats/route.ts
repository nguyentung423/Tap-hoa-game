import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/db/prisma";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production";

// Verify admin JWT
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as {
      email: string;
      name: string;
      role: string;
    };
    if (decoded.role.toUpperCase() !== "ADMIN") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

// Cache admin stats for 30 seconds
export const dynamic = "force-dynamic";
export const revalidate = 30;

/**
 * GET /api/v1/admin/stats
 * Lấy thống kê tổng quan cho admin dashboard
 */
export async function GET() {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Optimize: Use raw SQL for faster aggregation
    const [
      shopStats,
      accStats,
      totalGames,
      recentPendingShops,
      recentRejectedAccs,
    ] = await Promise.all([
      // Shop stats in one query
      prisma.$queryRaw<Array<{ status: string; count: bigint }>>`
        SELECT status, COUNT(*)::bigint as count
        FROM users
        WHERE "shopName" IS NOT NULL
        GROUP BY status
      `,
      // Acc stats in one query
      prisma.$queryRaw<Array<{ status: string; count: bigint }>>`
        SELECT status, COUNT(*)::bigint as count
        FROM accs
        GROUP BY status
      `,
      // Total active games
      prisma.game.count({ where: { isActive: true } }),
      // Recent pending shops
      prisma.user.findMany({
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
      }),
      // Recent rejected accs
      prisma.acc.findMany({
        where: { status: "REJECTED" },
        select: {
          id: true,
          title: true,
          price: true,
          thumbnail: true,
          adminNote: true,
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
      }),
    ]);

    // Process shop stats
    let totalShops = 0;
    let pendingShops = 0;
    let approvedShops = 0;

    shopStats.forEach((row) => {
      const count = Number(row.count);
      totalShops += count;
      if (row.status === "PENDING") pendingShops = count;
      if (row.status === "APPROVED") approvedShops = count;
    });

    // Process acc stats
    let totalAccs = 0;
    let approvedAccs = 0;
    let rejectedAccs = 0;
    let soldAccs = 0;

    accStats.forEach((row) => {
      const count = Number(row.count);
      totalAccs += count;
      if (row.status === "APPROVED") approvedAccs = count;
      if (row.status === "REJECTED") rejectedAccs = count;
      if (row.status === "SOLD") soldAccs = count;
    });

    return NextResponse.json({
      stats: {
        totalShops,
        pendingShops,
        approvedShops,
        totalAccs,
        approvedAccs,
        rejectedAccs,
        soldAccs,
        totalGames,
      },
      recentPendingShops,
      recentRejectedAccs,
    });
  } catch (error) {
    console.error("GET /api/v1/admin/stats error:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra" }, { status: 500 });
  }
}
