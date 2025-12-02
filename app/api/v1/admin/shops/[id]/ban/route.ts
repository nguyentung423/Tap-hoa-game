import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

/**
 * POST /api/v1/admin/shops/[id]/ban
 * Ban a shop permanently - sets status to BANNED and clears shop data
 * The email will be permanently blocked from creating new shops
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin auth
    await requireAdminAuth();

    const { id } = params;

    // Find the user/shop
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, shopName: true, status: true },
    });

    if (!user) {
      return errorResponse("Không tìm thấy shop", 404);
    }

    // Ban the user - set status to BANNED and clear shop data
    const bannedUser = await prisma.user.update({
      where: { id },
      data: {
        status: "BANNED",
        shopName: null,
        shopSlug: null,
        shopDescription: null,
        shopAvatar: null,
        isVipShop: false,
        vipShopEndTime: null,
        isStrategicPartner: false,
        partnerTier: null,
        partnerSince: null,
        commissionRate: 5.0, // Reset to default
        isVerified: false,
        featuredGames: [],
      },
    });

    return successResponse({
      user: bannedUser,
      message: `Đã ban vĩnh viễn shop và email ${user.email}`,
    });
  } catch (error) {
    console.error("Error banning shop:", error);
    return errorResponse("Đã xảy ra lỗi khi ban shop", 500);
  }
}
