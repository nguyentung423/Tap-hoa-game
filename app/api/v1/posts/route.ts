import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// ISR: Cache for 60 seconds
export const revalidate = 60;

// GET /api/v1/posts - Public endpoint for published posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get("game");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: any = {
      status: "PUBLISHED",
    };

    if (game && game !== "all") {
      where.game = game;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnail: true,
          game: true,
          views: true,
          publishedAt: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/v1/posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
