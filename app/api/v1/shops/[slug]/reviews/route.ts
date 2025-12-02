import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // First find the shop by slug
    const shop = await prisma.user.findFirst({
      where: {
        shopSlug: slug,
        role: "SELLER",
      },
      select: {
        id: true,
      },
    });

    if (!shop) {
      return NextResponse.json(
        { success: false, error: "Shop not found" },
        { status: 404 }
      );
    }

    // Fetch reviews for this shop
    const reviews = await prisma.review.findMany({
      where: {
        sellerId: shop.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        rating: true,
        content: true,
        buyerName: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        buyerName: review.buyerName,
        createdAt: review.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
