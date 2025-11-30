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
 * POST /api/v1/admin/accs/[id]/reject
 * Từ chối acc
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();

    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim().length < 5) {
      return errorResponse("Vui lòng nhập lý do từ chối (ít nhất 5 ký tự)");
    }

    const acc = await prisma.acc.findUnique({ where: { id } });
    if (!acc) {
      return notFoundResponse("Không tìm thấy acc");
    }

    // Reject acc
    const updatedAcc = await prisma.acc.update({
      where: { id },
      data: {
        status: "REJECTED",
        adminNote: reason.trim(),
        updatedAt: new Date(),
      },
    });

    return successResponse({
      id: updatedAcc.id,
      title: updatedAcc.title,
      status: updatedAcc.status,
      adminNote: updatedAcc.adminNote,
      message: "Đã từ chối acc",
    });
  } catch (error) {
    console.error("POST /api/v1/admin/accs/[id]/reject error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
