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
 * POST /api/v1/admin/shops/[id]/reject
 * Từ chối shop
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();

    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    const shop = await prisma.user.findUnique({ where: { id } });
    if (!shop) {
      return notFoundResponse("Không tìm thấy shop");
    }

    // Reject shop
    const updatedShop = await prisma.user.update({
      where: { id },
      data: {
        status: "REJECTED",
        updatedAt: new Date(),
      },
    });

    // TODO: Gửi email/notification cho seller về lý do từ chối

    return successResponse({
      id: updatedShop.id,
      shopName: updatedShop.shopName,
      status: updatedShop.status,
      reason,
      message: "Đã từ chối shop",
    });
  } catch (error) {
    console.error("POST /api/v1/admin/shops/[id]/reject error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
