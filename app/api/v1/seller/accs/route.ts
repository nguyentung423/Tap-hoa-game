import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  getCurrentUser,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";

// Cache for 30 seconds - balance between freshness and performance
export const dynamic = "force-dynamic";
export const revalidate = 30;

/**
 * GET /api/v1/seller/accs
 * Lấy danh sách acc của seller hiện tại
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // all, PENDING, APPROVED, REJECTED, SOLD
    const gameSlug = searchParams.get("game");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {
      sellerId: user.id,
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (gameSlug) {
      where.game = { slug: gameSlug };
    }

    // Parallel queries with minimal select
    const [accs, total] = await Promise.all([
      prisma.acc.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          originalPrice: true,
          thumbnail: true,
          status: true,
          isVip: true,
          isHot: true,
          views: true,
          createdAt: true,
          updatedAt: true,
          approvedAt: true,
          adminNote: true,
          gameId: true,
          game: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.acc.count({ where }),
    ]);

    return successResponse({
      accs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/v1/seller/accs error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  } finally {
    const duration = Date.now() - startTime;
    console.log(`[PERF] GET /api/v1/seller/accs - ${duration}ms`);
  }
}

/**
 * POST /api/v1/seller/accs
 * Tạo acc mới
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      originalPrice,
      gameId,
      images,
      attributes,
    } = body;

    // Validate required fields
    if (!title || !price || !gameId || !images?.length) {
      return errorResponse("Vui lòng điền đầy đủ thông tin bắt buộc");
    }

    if (title.length < 10) {
      return errorResponse("Tiêu đề phải có ít nhất 10 ký tự");
    }

    if (price < 10000) {
      return errorResponse("Giá tối thiểu là 10.000đ");
    }

    if (images.length > 15) {
      return errorResponse("Tối đa 15 ảnh");
    }

    // Check game exists - gameId from form is the game slug (e.g., "lqm", "lmht")
    const game = await prisma.game.findFirst({
      where: {
        OR: [{ id: gameId }, { slug: gameId }],
      },
    });

    if (!game || !game.isActive) {
      return errorResponse("Game không hợp lệ");
    }

    // Generate slug
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.acc.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create acc
    const acc = await prisma.acc.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        price,
        originalPrice: originalPrice || null,
        gameId: game.id, // Use actual game.id from database
        images,
        thumbnail: images[0],
        attributes: attributes || [],
        sellerId: user.id,
        status: "APPROVED", // Auto approved - chỉ duyệt shop
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

    return successResponse(acc, 201);
  } catch (error) {
    console.error("POST /api/v1/seller/accs error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100); // Max 100 chars
}
