import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  getCurrentUser,
} from "@/lib/api/helpers";

interface Params {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/v1/shops/[slug]
 * Lấy chi tiết shop công khai + danh sách acc
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("game");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Find shop by slug
    const shop = await prisma.user.findUnique({
      where: { shopSlug: slug },
      select: {
        id: true,
        shopName: true,
        shopSlug: true,
        shopDesc: true,
        shopAvatar: true,
        shopCover: true,
        isVerified: true,
        rating: true,
        totalReviews: true,
        totalSales: true,
        totalViews: true,
        status: true,
        createdAt: true,
      },
    });

    if (!shop) {
      return notFoundResponse("Không tìm thấy shop");
    }

    // Only show approved shops
    if (shop.status !== "APPROVED") {
      return notFoundResponse("Shop không khả dụng");
    }

    // Build where for accs
    const accWhere: any = {
      sellerId: shop.id,
      status: "APPROVED",
    };

    if (gameSlug) {
      accWhere.game = { slug: gameSlug };
    }

    // Get shop's accs
    const [accs, totalAccs] = await Promise.all([
      prisma.acc.findMany({
        where: accWhere,
        include: {
          game: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
        orderBy: [{ isVip: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.acc.count({ where: accWhere }),
    ]);

    // Get games that this shop sells
    const gamesWithAccs = await prisma.acc.groupBy({
      by: ["gameId"],
      where: {
        sellerId: shop.id,
        status: "APPROVED",
      },
      _count: { id: true },
    });

    const gameIds = gamesWithAccs.map((g: { gameId: string }) => g.gameId);
    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    });

    // Check if should increment view
    // 1. Get current user (if logged in)
    let currentUser = null;
    try {
      currentUser = await getCurrentUser();
    } catch {}

    // 2. Check cookie for viewed shops
    const cookieStore = await cookies();
    const viewedShops = cookieStore.get("viewed_shops")?.value || "";
    const viewedShopIds = viewedShops.split(",").filter(Boolean);

    // 3. Only increment if:
    //    - User is not the shop owner
    //    - Shop hasn't been viewed in this session
    const isOwner = currentUser?.id === shop.id;
    const alreadyViewed = viewedShopIds.includes(shop.id);

    let newTotalViews = shop.totalViews;

    if (!isOwner && !alreadyViewed) {
      // Increment view count
      await prisma.user.update({
        where: { id: shop.id },
        data: { totalViews: { increment: 1 } },
      });
      newTotalViews = shop.totalViews + 1;
    }

    // Build response with cookie
    const response = successResponse({
      shop: {
        ...shop,
        totalViews: newTotalViews,
      },
      games,
      accs,
      pagination: {
        page,
        limit,
        total: totalAccs,
        totalPages: Math.ceil(totalAccs / limit),
      },
    });

    // Set cookie to track viewed shops (expires in 1 hour)
    if (!alreadyViewed && !isOwner) {
      const newViewedShops = [...viewedShopIds, shop.id].join(",");
      response.cookies.set("viewed_shops", newViewedShops, {
        maxAge: 60 * 60, // 1 hour
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("GET /api/v1/shops/[slug] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
