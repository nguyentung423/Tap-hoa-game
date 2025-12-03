import { prisma } from "@/lib/db/prisma";
import AccListClient from "./acc-client";

/**
 * Acc List Page - Server Component
 * Fetches initial data on server for instant FCP
 */
export const revalidate = 60; // ISR cache 60 seconds

export default async function AccListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const gameSlug = params.game;
  const sort = params.sort || "newest";

  // Build where clause
  const where: any = {
    status: "APPROVED",
    seller: { status: "APPROVED" },
  };

  if (gameSlug) {
    where.game = { slug: gameSlug };
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
  }

  // Parallel fetch on server
  const [accs, games] = await Promise.all([
    prisma.acc.findMany({
      where,
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
        gameId: true,
        sellerId: true,
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
      orderBy: [{ isVip: "desc" }, orderBy],
      take: 20,
    }),
    prisma.game.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        isActive: true,
      },
    }),
  ]);

  // Serialize dates
  const serializedAccs = accs.map((acc) => ({
    ...acc,
    createdAt: acc.createdAt.toISOString(),
  }));

  return (
    <AccListClient
      initialAccs={serializedAccs}
      initialGames={games}
      initialGame={gameSlug}
      initialSort={sort}
    />
  );
}
