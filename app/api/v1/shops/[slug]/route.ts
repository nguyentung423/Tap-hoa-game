import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  getCurrentUser,
} from "@/lib/api/helpers";

// ISR: Cache for 60 seconds
export const revalidate = 60;

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
        isVipShop: true,
        isStrategicPartner: true,
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

    // Get shop's accs - optimize select for performance
    const [accs, totalAccs] = await Promise.all([
      prisma.acc.findMany({
        where: accWhere,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          price: true,
          originalPrice: true,
          thumbnail: true,
          images: true,
          attributes: true,
          status: true,
          isVip: true,
          isHot: true,
          views: true,
          sellerId: true,
          createdAt: true,
          updatedAt: true,
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

    // Get games that this shop sells - using raw query instead of groupBy
    const gamesWithAccs = await prisma.$queryRaw<
      Array<{ gameId: string; count: bigint }>
    >`
      SELECT "gameId", COUNT(*)::bigint as count
      FROM accs
      WHERE "sellerId" = ${shop.id}
      AND status = 'APPROVED'
      GROUP BY "gameId"
    `;

    const gameIds = gamesWithAccs.map((g) => g.gameId);
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

    // 2. Check cookie for viewed shops (format: id:timestamp,id:timestamp)
    const cookieStore = await cookies();
    const viewedShops = cookieStore.get("viewed_shops")?.value || "";
    const viewedEntries = viewedShops.split(",").filter(Boolean);
    const viewedMap = new Map<string, number>();

    // Parse existing views with timestamps
    viewedEntries.forEach((entry) => {
      const [id, timestamp] = entry.split(":");
      if (id && timestamp) {
        viewedMap.set(id, parseInt(timestamp));
      }
    });

    // 3. Only increment if:
    //    - User is not the shop owner
    //    - Shop hasn't been viewed in last 2 hours
    const isOwner = currentUser?.id === shop.id;
    const lastViewTime = viewedMap.get(shop.id);
    const now = Date.now();
    const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 hours
    const alreadyViewed = lastViewTime && now - lastViewTime < twoHoursInMs;

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

    // Set cookie to track viewed shops (expires in 2 hours)
    if (!alreadyViewed && !isOwner) {
      // Update view map with current timestamp
      viewedMap.set(shop.id, now);

      // Clean up old entries (older than 2 hours)
      const cleanedEntries: string[] = [];
      viewedMap.forEach((timestamp, id) => {
        if (now - timestamp < twoHoursInMs) {
          cleanedEntries.push(`${id}:${timestamp}`);
        }
      });

      response.cookies.set("viewed_shops", cleanedEntries.join(","), {
        maxAge: 2 * 60 * 60, // 2 hours
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
