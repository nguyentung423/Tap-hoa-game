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
 * POST /api/v1/admin/shops/[id]/approve
 * Duyệt shop
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();

    const { id } = await params;

    const shop = await prisma.user.findUnique({ where: { id } });
    if (!shop) {
      return notFoundResponse("Không tìm thấy shop");
    }

    if (shop.status === "APPROVED") {
      return errorResponse("Shop đã được duyệt rồi");
    }

    // Approve shop
    const updatedShop = await prisma.user.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return successResponse({
      id: updatedShop.id,
      shopName: updatedShop.shopName,
      status: updatedShop.status,
      approvedAt: updatedShop.approvedAt,
      message: "Đã duyệt shop thành công",
    });
  } catch (error) {
    console.error("POST /api/v1/admin/shops/[id]/approve error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
