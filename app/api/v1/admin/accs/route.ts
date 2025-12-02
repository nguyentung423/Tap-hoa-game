import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * GET /api/v1/admin/accs
 * Lấy danh sách accs (cho admin duyệt)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // PENDING, APPROVED, REJECTED, SOLD
    const gameSlug = searchParams.get("game");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (gameSlug) {
      where.game = { slug: gameSlug };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { seller: { shopName: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get accs with pagination
    const [accs, total] = await Promise.all([
      prisma.acc.findMany({
        where,
        include: {
          game: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          seller: {
            select: {
              id: true,
              shopName: true,
              shopSlug: true,
              status: true,
              isVerified: true,
              isVipShop: true,
              isStrategicPartner: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.acc.count({ where }),
    ]);

    return successResponse({
      accs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/v1/admin/accs error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
