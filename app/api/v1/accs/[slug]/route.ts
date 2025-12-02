import { NextRequest } from "next/server";
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
 * GET /api/v1/accs/[slug]
 * Lấy chi tiết acc công khai
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

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
            rating: true,
            totalReviews: true,
            totalSales: true,
            status: true,
          },
        },
      },
    });

    if (!acc) {
      return notFoundResponse("Không tìm thấy acc");
    }

    // Only show approved accs from approved sellers
    if (acc.status !== "APPROVED" || acc.seller.status !== "APPROVED") {
      return notFoundResponse("Acc không khả dụng");
    }

    // Check if should increment view
    // 1. Get current user (if logged in)
    let currentUser = null;
    try {
      currentUser = await getCurrentUser();
    } catch {}

    // 2. Check cookie for viewed accs (format: id:timestamp,id:timestamp)
    const cookieStore = await cookies();
    const viewedAccs = cookieStore.get("viewed_accs")?.value || "";
    const viewedEntries = viewedAccs.split(",").filter(Boolean);
    const viewedMap = new Map<string, number>();

    // Parse existing views with timestamps
    viewedEntries.forEach((entry) => {
      const [id, timestamp] = entry.split(":");
      if (id && timestamp) {
        viewedMap.set(id, parseInt(timestamp));
      }
    });

    // 3. Only increment if:
    //    - User is not the acc seller
    //    - Acc hasn't been viewed in last 2 hours
    const isSeller = currentUser?.id === acc.sellerId;
    const lastViewTime = viewedMap.get(acc.id);
    const now = Date.now();
    const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 hours
    const alreadyViewed = lastViewTime && now - lastViewTime < twoHoursInMs;

    let newViews = acc.views;

    if (!isSeller && !alreadyViewed) {
      // Increment view count
      await prisma.acc.update({
        where: { id: acc.id },
        data: { views: { increment: 1 } },
      });
      newViews = acc.views + 1;
    }

    // Get related accs (same game)
    const relatedAccs = await prisma.acc.findMany({
      where: {
        gameId: acc.gameId,
        id: { not: acc.id },
        status: "APPROVED",
        seller: { status: "APPROVED" },
      },
      include: {
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
            shopName: true,
            shopSlug: true,
            isVerified: true,
          },
        },
      },
      orderBy: { views: "desc" },
      take: 6,
    });

    // Build response
    const response = successResponse({
      acc: {
        ...acc,
        views: newViews,
      },
      relatedAccs,
    });

    // Set cookie to track viewed accs (expires in 2 hours)
    if (!alreadyViewed && !isSeller) {
      // Update view map with current timestamp
      viewedMap.set(acc.id, now);

      // Clean up old entries (older than 2 hours)
      const cleanedEntries: string[] = [];
      viewedMap.forEach((timestamp, id) => {
        if (now - timestamp < twoHoursInMs) {
          cleanedEntries.push(`${id}:${timestamp}`);
        }
      });

      response.cookies.set("viewed_accs", cleanedEntries.join(","), {
        maxAge: 2 * 60 * 60, // 2 hours
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("GET /api/v1/accs/[slug] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
