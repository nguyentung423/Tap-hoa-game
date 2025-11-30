import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api/helpers";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/admin/games/[id]
 * Lấy chi tiết game
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();
    const { id } = await params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        _count: {
          select: { accs: true },
        },
      },
    });

    if (!game) {
      return notFoundResponse("Không tìm thấy game");
    }

    return successResponse({ game });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("GET /api/v1/admin/games/[id] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * PUT /api/v1/admin/games/[id]
 * Cập nhật game
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();
    const { id } = await params;

    const game = await prisma.game.findUnique({ where: { id } });
    if (!game) {
      return notFoundResponse("Không tìm thấy game");
    }

    const body = await request.json();
    const { name, icon, image, description, fields, isActive, order } = body;

    const updatedGame = await prisma.game.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image }),
        ...(description !== undefined && { description }),
        ...(fields !== undefined && { fields }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
        updatedAt: new Date(),
      },
    });

    return successResponse({ game: updatedGame });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("PUT /api/v1/admin/games/[id] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * DELETE /api/v1/admin/games/[id]
 * Xóa game
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await requireAdminAuth();
    const { id } = await params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: { _count: { select: { accs: true } } },
    });

    if (!game) {
      return notFoundResponse("Không tìm thấy game");
    }

    if (game._count.accs > 0) {
      return errorResponse("Không thể xóa game đang có acc");
    }

    await prisma.game.delete({ where: { id } });

    return successResponse({ message: "Đã xóa game" });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("DELETE /api/v1/admin/games/[id] error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
