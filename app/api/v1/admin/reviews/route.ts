import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/db/prisma";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production";

// Verify admin JWT
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as {
      email: string;
      name: string;
      role: string;
    };
    if (decoded.role.toUpperCase() !== "ADMIN") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

// GET - Lấy tất cả reviews
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: {
            id: true,
            shopName: true,
            shopSlug: true,
          },
        },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Thêm review mới
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { shopId, rating, comment, buyerName } = body;

    // Validate
    if (!shopId || !rating || !buyerName?.trim()) {
      return NextResponse.json(
        { message: "shopId, rating và buyerName là bắt buộc" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating phải từ 1-5" },
        { status: 400 }
      );
    }

    // Kiểm tra shop tồn tại
    const shop = await prisma.user.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return NextResponse.json(
        { message: "Shop không tồn tại" },
        { status: 404 }
      );
    }

    // Tạo review mới
    const review = await prisma.review.create({
      data: {
        sellerId: shopId,
        rating,
        content: comment?.trim() || null,
        buyerName: buyerName.trim(),
        isVerified: true, // Admin tạo nên mặc định verified
      },
      include: {
        seller: {
          select: {
            id: true,
            shopName: true,
            shopSlug: true,
          },
        },
      },
    });

    // Cập nhật rating và totalReviews của shop
    const allReviews = await prisma.review.findMany({
      where: { sellerId: shopId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.user.update({
      where: { id: shopId },
      data: {
        rating: avgRating,
        totalReviews: allReviews.length,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
