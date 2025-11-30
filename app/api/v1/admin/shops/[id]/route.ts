import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api/helpers";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/admin/shops/[id]
 * Lấy chi tiết shop
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();
    const { id } = await params;

    const shop = await prisma.user.findUnique({
      where: { id },
      include: {
        accs: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            game: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: { accs: true, reviews: true },
        },
      },
    });

    if (!shop) {
      return notFoundResponse("Không tìm thấy shop");
    }

    return successResponse(shop);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("GET /api/v1/admin/shops/[id] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * PUT /api/v1/admin/shops/[id]
 * Cập nhật thông tin shop (admin)
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();
    const { id } = await params;

    const body = await request.json();
    const { status, isVerified } = body;

    // Validate status
    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "BANNED"];
    if (status && !validStatuses.includes(status)) {
      return errorResponse("Trạng thái không hợp lệ");
    }

    const shop = await prisma.user.findUnique({ where: { id } });
    if (!shop) {
      return notFoundResponse("Không tìm thấy shop");
    }

    // Update shop
    const updatedShop = await prisma.user.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(status === "APPROVED" && { approvedAt: new Date() }),
        ...(isVerified !== undefined && { isVerified }),
        updatedAt: new Date(),
      },
    });

    return successResponse({
      id: updatedShop.id,
      status: updatedShop.status,
      isVerified: updatedShop.isVerified,
      approvedAt: updatedShop.approvedAt,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("PUT /api/v1/admin/shops/[id] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
