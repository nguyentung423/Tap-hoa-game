import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { siteConfig } from "@/config/site";
import { ShopDetailClient } from "./client";

// Enable ISR - revalidate every 60 seconds for better performance
export const revalidate = 60;

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

async function getShop(slug: string) {
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
      _count: {
        select: {
          accs: {
            where: { status: "APPROVED" },
          },
        },
      },
    },
  });

  if (!shop || shop.status !== "APPROVED") {
    return null;
  }

  return shop;
}

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShop(slug);

  if (!shop) {
    return {
      title: "Shop không tồn tại",
    };
  }

  return {
    title: `${shop.shopName} | ${siteConfig.name}`,
    description:
      shop.shopDesc ||
      `Shop ${shop.shopName} - ${shop._count.accs} acc đang bán`,
    openGraph: {
      title: shop.shopName || undefined,
      description: shop.shopDesc || undefined,
      images: shop.shopCover ? [shop.shopCover] : [],
    },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;

  // Fetch shop and initial accs in parallel on server
  const [shop, initialAccs] = await Promise.all([
    getShop(slug),
    prisma.acc.findMany({
      where: {
        seller: { shopSlug: slug },
        status: "APPROVED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        price: true,
        originalPrice: true,
        thumbnail: true,
        images: true,
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
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  if (!shop) {
    notFound();
  }

  const now = new Date().toISOString();

  // Transform to match Shop type
  const shopData = {
    id: shop.id,
    name: shop.shopName || "Unknown Shop",
    slug: shop.shopSlug || "",
    description: shop.shopDesc || undefined,
    avatar: shop.shopAvatar || undefined,
    coverImage: shop.shopCover || undefined,
    status: shop.status.toLowerCase() as "approved" | "pending" | "rejected",
    isVerified: shop.isVerified,
    isVipShop: shop.isVipShop,
    isStrategicPartner: shop.isStrategicPartner,
    rating: shop.rating,
    totalReviews: shop.totalReviews,
    totalSales: shop.totalSales,
    totalAccs: shop._count.accs,
    featuredGames: [] as string[],
    ownerId: shop.id,
    createdAt: shop.createdAt.toISOString(),
    updatedAt: shop.createdAt.toISOString(),
    lastActiveAt: now,
  };

  // Transform accs
  const serializedAccs = initialAccs.map((acc) => ({
    ...acc,
    createdAt: acc.createdAt.toISOString(),
  }));

  return <ShopDetailClient shop={shopData} initialAccs={serializedAccs} />;
}
