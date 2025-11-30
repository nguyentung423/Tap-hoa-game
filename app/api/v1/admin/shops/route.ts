import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * GET /api/v1/admin/shops
 * Lấy danh sách shops (cho admin duyệt)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // PENDING, APPROVED, REJECTED, BANNED
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause - only get users with shopName (sellers)
    const where: any = {
      shopName: { not: null },
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { shopName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get shops with pagination
    const [shops, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          shopName: true,
          shopSlug: true,
          shopAvatar: true,
          shopDesc: true,
          status: true,
          isVerified: true,
          rating: true,
          totalSales: true,
          createdAt: true,
          approvedAt: true,
          _count: {
            select: { accs: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse({
      shops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("GET /api/v1/admin/shops error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
