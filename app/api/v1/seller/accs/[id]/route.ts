import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  getCurrentUser,
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api/helpers";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/seller/accs/[id]
 * Lấy chi tiết acc
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    const acc = await prisma.acc.findFirst({
      where: {
        id,
        sellerId: user.id,
      },
      include: {
        game: true,
      },
    });

    if (!acc) {
      return notFoundResponse("Không tìm thấy acc");
    }

    return successResponse(acc);
  } catch (error) {
    console.error("GET /api/v1/seller/accs/[id] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * PUT /api/v1/seller/accs/[id]
 * Cập nhật acc
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Find acc owned by user
    const existingAcc = await prisma.acc.findFirst({
      where: {
        id,
        sellerId: user.id,
      },
    });

    if (!existingAcc) {
      return notFoundResponse("Không tìm thấy acc");
    }

    // Can't edit sold acc
    if (existingAcc.status === "SOLD") {
      return errorResponse("Không thể sửa acc đã bán");
    }

    const body = await request.json();
    const { title, description, price, originalPrice, images, attributes } =
      body;

    // Validate
    if (title && title.length < 10) {
      return errorResponse("Tiêu đề phải có ít nhất 10 ký tự");
    }

    if (price && price < 10000) {
      return errorResponse("Giá tối thiểu là 10.000đ");
    }

    if (images && images.length > 15) {
      return errorResponse("Tối đa 15 ảnh");
    }

    // Update acc - reset to PENDING if was REJECTED
    const newStatus =
      existingAcc.status === "REJECTED" ? "PENDING" : existingAcc.status;

    const acc = await prisma.acc.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(price && { price }),
        ...(originalPrice !== undefined && { originalPrice }),
        ...(images && { images, thumbnail: images[0] }),
        ...(attributes && { attributes }),
        status: newStatus,
        adminNote: newStatus === "PENDING" ? null : existingAcc.adminNote,
        updatedAt: new Date(),
      },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(acc);
  } catch (error) {
    console.error("PUT /api/v1/seller/accs/[id] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * DELETE /api/v1/seller/accs/[id]
 * Xóa acc
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Find acc owned by user
    const acc = await prisma.acc.findFirst({
      where: {
        id,
        sellerId: user.id,
      },
    });

    if (!acc) {
      return notFoundResponse("Không tìm thấy acc");
    }

    // Can't delete sold acc
    if (acc.status === "SOLD") {
      return errorResponse("Không thể xóa acc đã bán");
    }

    await prisma.acc.delete({
      where: { id },
    });

    return successResponse({ message: "Đã xóa acc" });
  } catch (error) {
    console.error("DELETE /api/v1/seller/accs/[id] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
