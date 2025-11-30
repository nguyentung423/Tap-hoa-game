import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api/helpers";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/v1/admin/accs/[id]/approve
 * Duyệt acc
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();

    const { id } = await params;

    const acc = await prisma.acc.findUnique({
      where: { id },
      include: { seller: true },
    });

    if (!acc) {
      return notFoundResponse("Không tìm thấy acc");
    }

    if (acc.status === "APPROVED") {
      return errorResponse("Acc đã được duyệt rồi");
    }

    // Check if seller is approved
    if (acc.seller.status !== "APPROVED") {
      return errorResponse("Shop của acc này chưa được duyệt");
    }

    // Approve acc
    const updatedAcc = await prisma.acc.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        adminNote: null,
        updatedAt: new Date(),
      },
    });

    return successResponse({
      id: updatedAcc.id,
      title: updatedAcc.title,
      status: updatedAcc.status,
      approvedAt: updatedAcc.approvedAt,
      message: "Đã duyệt acc thành công",
    });
  } catch (error) {
    console.error("POST /api/v1/admin/accs/[id]/approve error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
