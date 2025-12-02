import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        shopName: true,
        shopSlug: true,
        shopDesc: true,
        shopAvatar: true,
        shopCover: true,
        featuredGames: true,
        isVipShop: true,
        vipShopEndTime: true,
        isStrategicPartner: true,
        partnerTier: true,
        role: true,
        status: true,
        isVerified: true,
        rating: true,
        totalReviews: true,
        totalSales: true,
        totalViews: true,
        commissionRate: true,
        createdAt: true,
        approvedAt: true,
        lastActiveAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
