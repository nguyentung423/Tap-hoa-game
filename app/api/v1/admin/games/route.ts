import { prisma } from "@/lib/db/prisma";
import {
  requireAdminAuth,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";
import { NextRequest } from "next/server";

/**
 * GET /api/v1/admin/games
 * Lấy danh sách games cho admin
 */
export async function GET() {
  try {
    await requireAdminAuth();

    const games = await prisma.game.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { accs: true },
        },
      },
    });

    return successResponse({ games });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("GET /api/v1/admin/games error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * POST /api/v1/admin/games
 * Tạo game mới
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { name, slug, icon, image, description, fields, isActive, order } =
      body;

    if (!name || !slug || !icon) {
      return errorResponse("Thiếu thông tin bắt buộc");
    }

    // Check slug exists
    const existing = await prisma.game.findUnique({ where: { slug } });
    if (existing) {
      return errorResponse("Slug đã tồn tại");
    }

    const game = await prisma.game.create({
      data: {
        name,
        slug,
        icon,
        image,
        description,
        fields: fields || [],
        isActive: isActive ?? false,
        order: order ?? 0,
      },
    });

    return successResponse({ game });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("POST /api/v1/admin/games error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
