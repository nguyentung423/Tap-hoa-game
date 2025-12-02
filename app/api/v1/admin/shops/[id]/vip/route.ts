import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * POST /api/v1/admin/shops/[id]/vip
 * Bật/tắt VIP cho shop (chỉ admin)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth();
    const { id } = params;
    const body = await request.json();
    const { isVipShop, duration } = body; // duration in days (30, 90, 180, 365)

    // Validate input
    if (typeof isVipShop !== "boolean") {
      return errorResponse("Thiếu thông tin isVipShop", 400);
    }

    // Calculate VIP end time if enabling VIP
    let vipShopEndTime = null;
    let commissionRate = 5.0; // Default for non-VIP

    if (isVipShop) {
      if (!duration || ![30, 90, 180, 365].includes(duration)) {
        return errorResponse("Duration phải là 30, 90, 180 hoặc 365 ngày", 400);
      }

      const now = new Date();
      vipShopEndTime = new Date(now);
      vipShopEndTime.setDate(vipShopEndTime.getDate() + duration);
      commissionRate = 3.0; // VIP commission rate
    }

    // Update shop VIP status
    const updatedShop = await prisma.user.update({
      where: { id },
      data: {
        isVipShop,
        vipShopEndTime,
        commissionRate,
        updatedAt: new Date(),
      },
    });

    return successResponse({
      id: updatedShop.id,
      shopName: updatedShop.shopName,
      isVipShop: (updatedShop as any).isVipShop,
      vipShopEndTime: (updatedShop as any).vipShopEndTime,
      commissionRate: (updatedShop as any).commissionRate,
      message: isVipShop
        ? `Đã bật VIP cho shop ${updatedShop.shopName} (${duration} ngày)`
        : `Đã tắt VIP cho shop ${updatedShop.shopName}`,
    });
  } catch (error) {
    console.error("POST /api/v1/admin/shops/[id]/vip error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
