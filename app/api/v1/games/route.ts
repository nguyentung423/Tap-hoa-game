import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api/helpers";

/**
 * GET /api/v1/games
 * Lấy danh sách games
 */
export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            accs: {
              where: {
                status: "APPROVED",
                seller: { status: "APPROVED" },
              },
            },
          },
        },
      },
    });

    return successResponse(games);
  } catch (error) {
    console.error("GET /api/v1/games error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
