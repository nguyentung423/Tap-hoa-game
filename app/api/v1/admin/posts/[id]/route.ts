import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH /api/v1/admin/posts/[id] - Approve or reject post
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        status: action === "approve" ? "PUBLISHED" : "REJECTED",
        publishedAt: action === "approve" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      post,
      message:
        action === "approve" ? "Đã duyệt bài viết" : "Đã từ chối bài viết",
    });
  } catch (error) {
    console.error("PATCH /api/v1/admin/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/admin/posts/[id] - Delete post
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa bài viết",
    });
  } catch (error) {
    console.error("DELETE /api/v1/admin/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
