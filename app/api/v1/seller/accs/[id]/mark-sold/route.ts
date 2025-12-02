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
 * POST /api/v1/seller/accs/[id]/mark-sold
 * Đánh dấu acc đã bán
 */
export async function POST(request: NextRequest, { params }: Params) {
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

    // Check if already sold
    if (existingAcc.status === "SOLD") {
      return errorResponse("Acc đã được đánh dấu bán rồi");
    }

    // Only approved accs can be marked as sold
    if (existingAcc.status !== "APPROVED") {
      return errorResponse("Chỉ có thể đánh dấu bán acc đã được duyệt");
    }

    // Update acc status to SOLD and increment seller's totalSales
    const [updatedAcc] = await prisma.$transaction([
      // Update acc
      prisma.acc.update({
        where: { id },
        data: {
          status: "SOLD",
          soldAt: new Date(),
        },
      }),
      // Increment seller's total sales
      prisma.user.update({
        where: { id: user.id },
        data: {
          totalSales: { increment: 1 },
        },
      }),
    ]);

    return successResponse({
      message: "Đã đánh dấu acc đã bán",
      acc: updatedAcc,
    });
  } catch (error) {
    console.error("POST /api/v1/seller/accs/[id]/mark-sold error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * DELETE /api/v1/seller/accs/[id]/mark-sold
 * Hủy đánh dấu đã bán (trong trường hợp bấm nhầm)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    // Only admin can undo sold status
    if (user.role !== "ADMIN") {
      return errorResponse("Chỉ admin mới có thể hủy đánh dấu bán", 403);
    }

    // Find acc
    const existingAcc = await prisma.acc.findUnique({
      where: { id },
    });

    if (!existingAcc) {
      return notFoundResponse("Không tìm thấy acc");
    }

    if (existingAcc.status !== "SOLD") {
      return errorResponse("Acc chưa được đánh dấu bán");
    }

    // Revert acc status to APPROVED and decrement seller's totalSales
    const [updatedAcc] = await prisma.$transaction([
      // Update acc
      prisma.acc.update({
        where: { id },
        data: {
          status: "APPROVED",
          soldAt: null,
        },
      }),
      // Decrement seller's total sales
      prisma.user.update({
        where: { id: existingAcc.sellerId },
        data: {
          totalSales: { decrement: 1 },
        },
      }),
    ]);

    return successResponse({
      message: "Đã hủy đánh dấu bán",
      acc: updatedAcc,
    });
  } catch (error) {
    console.error("DELETE /api/v1/seller/accs/[id]/mark-sold error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
