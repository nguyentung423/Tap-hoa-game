import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api/helpers";

// ISR: Cache for 60 seconds for better performance
export const revalidate = 60;

/**
 * GET /api/v1/accs
 * Lấy danh sách acc công khai (đã được duyệt)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("game");
    const shopSlug = searchParams.get("shop");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort") || "newest"; // newest, price_asc, price_desc, views
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const isHot = searchParams.get("hot") === "true";
    const isVip = searchParams.get("vip") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause - only APPROVED accs from APPROVED sellers
    const where: any = {
      status: "APPROVED",
      seller: {
        status: "APPROVED",
      },
    };

    if (gameSlug) {
      where.game = { slug: gameSlug };
    }

    if (shopSlug) {
      where.seller = { ...where.seller, shopSlug };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseInt(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseInt(maxPrice) };
    }

    if (isHot) {
      where.isHot = true;
    }

    if (isVip) {
      where.isVip = true;
    }

    // Build orderBy
    let orderBy: any = { createdAt: "desc" };
    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "views":
        orderBy = { views: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
    }

    // VIP accs first
    const orderByArray = [{ isVip: "desc" as const }, orderBy];

    // Parallel queries for better performance
    const [accs, total] = await Promise.all([
      prisma.acc.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          price: true,
          originalPrice: true,
          gameId: true,
          sellerId: true, // Just ID for normalization
          images: true,
          thumbnail: true,
          attributes: true,
          status: true,
          isVip: true,
          isHot: true,
          views: true,
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
          seller: {
            select: {
              id: true,
              shopName: true,
              shopSlug: true,
              shopAvatar: true,
              isVerified: true,
              isVipShop: true,
              isStrategicPartner: true,
              rating: true,
              totalSales: true,
            },
          },
        },
        orderBy: orderByArray,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.acc.count({ where }),
    ]);

    // Normalize data: Extract unique sellers and games to avoid duplication
    const sellersMap = new Map();
    const gamesMap = new Map();

    const normalizedAccs = accs.map((acc) => {
      if (acc.seller) {
        sellersMap.set(acc.seller.id, acc.seller);
      }
      if (acc.game) {
        gamesMap.set(acc.game.id, acc.game);
      }

      return {
        id: acc.id,
        title: acc.title,
        slug: acc.slug,
        description: acc.description,
        price: acc.price,
        originalPrice: acc.originalPrice,
        gameId: acc.gameId,
        sellerId: acc.sellerId,
        images: acc.images,
        thumbnail: acc.thumbnail,
        attributes: acc.attributes,
        status: acc.status,
        isVip: acc.isVip,
        isHot: acc.isHot,
        views: acc.views,
        createdAt: acc.createdAt,
        updatedAt: acc.updatedAt,
      };
    });

    return successResponse({
      items: normalizedAccs,
      sellers: Object.fromEntries(sellersMap),
      games: Object.fromEntries(gamesMap),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/v1/accs error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Có lỗi xảy ra",
      500
    );
  }
}
