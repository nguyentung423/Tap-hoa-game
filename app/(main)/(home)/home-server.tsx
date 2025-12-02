import { prisma } from "@/lib/db/prisma";
import { HomeClient } from "./home-client";

/**
 * Server component - Fetch data on server for instant load
 */
export async function HomeServer() {
  // Fetch all data in parallel on server
  const [shops, games, hotAccs] = await Promise.all([
    // Fetch shops with proper ordering
    prisma.user.findMany({
      where: {
        shopName: { not: null },
        status: "APPROVED",
      },
      select: {
        id: true,
        shopName: true,
        shopSlug: true,
        shopAvatar: true,
        shopDesc: true,
        featuredGames: true,
        status: true,
        isVerified: true,
        isVipShop: true,
        vipShopEndTime: true,
        isStrategicPartner: true,
        partnerTier: true,
        partnerSince: true,
        commissionRate: true,
        rating: true,
        totalReviews: true,
        totalSales: true,
        totalViews: true,
        createdAt: true,
        _count: {
          select: {
            accs: {
              where: {
                status: "APPROVED",
              },
            },
          },
        },
      },
      orderBy: [
        { isStrategicPartner: "desc" },
        { isVipShop: "desc" },
        { isVerified: "desc" },
        { totalSales: "desc" },
        { createdAt: "desc" },
      ],
      take: 50, // Limit to 50 shops for performance
    }),

    // Fetch games
    prisma.game.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        isActive: true,
        order: true,
      },
      orderBy: { order: "asc" },
    }),

    // Fetch hot accs (newest 4)
    prisma.acc.findMany({
      where: {
        status: "APPROVED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        originalPrice: true,
        thumbnail: true,
        isVip: true,
        isHot: true,
        views: true,
        createdAt: true,
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
            rating: true,
            isVerified: true,
            isVipShop: true,
            isStrategicPartner: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  // Serialize data (convert Date to string for client)
  const serializedShops = shops.map((shop) => ({
    ...shop,
    totalAccs: shop._count.accs,
    _count: undefined,
    createdAt: shop.createdAt.toISOString(),
    vipShopEndTime: shop.vipShopEndTime?.toISOString() || null,
    partnerSince: shop.partnerSince?.toISOString() || null,
  }));

  const serializedAccs = hotAccs.map((acc) => ({
    ...acc,
    createdAt: acc.createdAt.toISOString(),
  }));

  // Pass to client component
  return (
    <HomeClient
      initialShops={serializedShops}
      initialGames={games}
      initialAccs={serializedAccs}
    />
  );
}
