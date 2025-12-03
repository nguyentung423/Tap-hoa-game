import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccDetailClient } from "./client";
import { prisma } from "@/lib/db/prisma";
import { siteConfig } from "@/config/site";
import { GameSlug } from "@/types/game";

// ISR: Revalidate every 30 seconds
export const revalidate = 30;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getAcc(slug: string) {
  const acc = await prisma.acc.findUnique({
    where: { slug },
    include: {
      game: true,
      seller: {
        select: {
          id: true,
          shopName: true,
          shopSlug: true,
          shopAvatar: true,
          shopDesc: true,
          isVerified: true,
          isVipShop: true,
          isStrategicPartner: true,
          rating: true,
          totalReviews: true,
          totalSales: true,
          status: true,
        },
      },
    },
  });

  if (!acc || acc.status !== "APPROVED" || acc.seller.status !== "APPROVED") {
    return null;
  }

  return acc;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const acc = await getAcc(slug);

  if (!acc) {
    return { title: "Không tìm thấy" };
  }

  return {
    title: `${acc.title} | ${siteConfig.name}`,
    description:
      acc.description ||
      `Mua ${acc.title} giá ${acc.price.toLocaleString("vi-VN")}đ`,
    openGraph: {
      title: acc.title,
      description: acc.description || undefined,
      images: acc.thumbnail ? [acc.thumbnail] : [],
    },
  };
}

export default async function AccDetailPage({ params }: Props) {
  const { slug } = await params;
  const acc = await getAcc(slug);

  if (!acc) {
    notFound();
  }

  // Increment view count
  await prisma.acc.update({
    where: { id: acc.id },
    data: { views: { increment: 1 } },
  });

  // Transform attributes from Record to AccAttribute[]
  const attributesRecord = (acc.attributes as Record<string, string>) || {};
  const attributes = Object.entries(attributesRecord).map(([label, value]) => ({
    label,
    value: String(value),
  }));

  // Transform to match Acc type
  const accData = {
    id: acc.id,
    title: acc.title,
    slug: acc.slug,
    description: acc.description || undefined,
    price: acc.price,
    originalPrice: acc.originalPrice || undefined,
    thumbnail: acc.thumbnail,
    images: (acc.images as string[]) || [],
    gameId: acc.gameId,
    gameSlug: acc.game.slug as GameSlug,
    gameName: acc.game.name,
    attributes,
    status: acc.status.toLowerCase() as
      | "pending"
      | "approved"
      | "rejected"
      | "sold",
    isVip: acc.isVip,
    isHot: acc.isVip, // Use isVip as isHot for now
    views: acc.views,
    shop: {
      id: acc.seller.id,
      slug: acc.seller.shopSlug || "",
      name: acc.seller.shopName || "Unknown",
      avatar: acc.seller.shopAvatar || undefined,
      rating: acc.seller.rating,
      totalSales: acc.seller.totalSales,
      isVerified: acc.seller.isVerified,
      isVipShop: acc.seller.isVipShop,
      isStrategicPartner: acc.seller.isStrategicPartner,
    },
    createdAt: acc.createdAt.toISOString(),
    updatedAt: acc.updatedAt.toISOString(),
  };

  return <AccDetailClient acc={accData} />;
}
