import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  getCurrentUser,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * POST /api/v1/seller/shop/upgrade-vip
 * Nâng cấp shop lên VIP (giảm phí từ 5% xuống 3%)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Check if user has a shop
    if (!user.shopName) {
      return errorResponse("Bạn chưa có shop. Vui lòng tạo shop trước.", 400);
    }

    // Check if shop is approved
    if (user.status !== "APPROVED") {
      return errorResponse("Shop của bạn chưa được duyệt", 400);
    }

    const body = await request.json();
    const { duration } = body; // duration in days (30, 90, 180, 365)

    // Validate duration
    const validDurations = [30, 90, 180, 365];
    if (!duration || !validDurations.includes(duration)) {
      return errorResponse(
        "Gói VIP không hợp lệ. Chọn: 30, 90, 180 hoặc 365 ngày"
      );
    }

    // Calculate VIP end time
    const now = new Date();
    const currentVipEndTime = user.vipShopEndTime || now;
    const startTime = currentVipEndTime > now ? currentVipEndTime : now;
    const vipEndTime = new Date(startTime);
    vipEndTime.setDate(vipEndTime.getDate() + duration);

    // Update shop to VIP
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVipShop: true,
        vipShopEndTime: vipEndTime,
        commissionRate: 3.0, // Giảm phí xuống 3%
        updatedAt: new Date(),
      },
    });

    return successResponse({
      id: updatedUser.id,
      shopName: updatedUser.shopName,
      isVipShop: updatedUser.isVipShop,
      vipShopEndTime: updatedUser.vipShopEndTime,
      commissionRate: updatedUser.commissionRate,
      message: `Nâng cấp VIP thành công! Giảm phí từ 5% xuống 3%. Hiệu lực đến ${vipEndTime.toLocaleDateString(
        "vi-VN"
      )}`,
    });
  } catch (error) {
    console.error("POST /api/v1/seller/shop/upgrade-vip error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
