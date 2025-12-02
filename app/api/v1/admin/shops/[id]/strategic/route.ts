import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * POST /api/v1/admin/shops/[id]/strategic
 * Toggle Strategic Partner status (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth();

    const { id } = params;
    const body = await request.json();
    const { enable, commissionRate } = body;

    // Get current shop
    const shop = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        shopName: true,
        isStrategicPartner: true,
        isVipShop: true,
      },
    });

    if (!shop) {
      return errorResponse("Shop không tồn tại", 404);
    }

    if (!shop.shopName) {
      return errorResponse("User này không phải shop", 400);
    }

    // Validate commission rate
    if (
      enable &&
      (!commissionRate || commissionRate < 0 || commissionRate > 5)
    ) {
      return errorResponse("Commission rate phải từ 0-5%", 400);
    }

    // Update Strategic Partner status
    const updateData: any = {
      isStrategicPartner: enable,
      partnerTier: enable ? "strategic" : null,
      partnerSince: enable ? new Date() : null,
      commissionRate: enable ? commissionRate : shop.isVipShop ? 3.0 : 5.0,
    };

    const updatedShop = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        shopName: true,
        isStrategicPartner: true,
        partnerTier: true,
        partnerSince: true,
        commissionRate: true,
        isVipShop: true,
        vipShopEndTime: true,
      },
    });

    return successResponse({
      message: enable
        ? "Đã kích hoạt Đối tác chiến lược"
        : "Đã tắt Đối tác chiến lược",
      shop: updatedShop,
    });
  } catch (error) {
    console.error("POST /api/v1/admin/shops/[id]/strategic error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
