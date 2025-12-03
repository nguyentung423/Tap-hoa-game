import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// ISR: Cache for 30 seconds (shorter due to view counting)
export const revalidate = 30;

// GET /api/v1/posts/[slug] - Get single post and increment views
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: {
        slug,
        status: "PUBLISHED",
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment views
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      ...post,
      views: post.views + 1,
    });
  } catch (error) {
    console.error("GET /api/v1/posts/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
