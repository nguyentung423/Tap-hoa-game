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

// DELETE - Xóa review
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Lấy thông tin review trước khi xóa
    const review = await prisma.review.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review không tồn tại" },
        { status: 404 }
      );
    }

    // Xóa review
    await prisma.review.delete({
      where: { id },
    });

    // Cập nhật lại rating và totalReviews của shop
    const remainingReviews = await prisma.review.findMany({
      where: { sellerId: review.sellerId },
      select: { rating: true },
    });

    const avgRating =
      remainingReviews.length > 0
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
          remainingReviews.length
        : 5.0;

    await prisma.user.update({
      where: { id: review.sellerId },
      data: {
        rating: avgRating,
        totalReviews: remainingReviews.length,
      },
    });

    return NextResponse.json({ message: "Đã xóa review" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
