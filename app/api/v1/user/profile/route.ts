import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// GET /api/v1/user/profile - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        shopName: true,
        shopSlug: true,
        shopDesc: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/v1/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, avatar } = body;

    // Validate input
    if (!name && !avatar) {
      return NextResponse.json({ error: "No data to update" }, { status: 400 });
    }

    const updateData: { name?: string; avatar?: string } = {};

    if (name) {
      if (name.length < 2 || name.length > 50) {
        return NextResponse.json(
          { error: "Tên phải từ 2-50 ký tự" },
          { status: 400 }
        );
      }
      updateData.name = name;
    }

    if (avatar) {
      // Validate avatar URL (should be Cloudinary URL)
      if (!avatar.startsWith("https://res.cloudinary.com/")) {
        return NextResponse.json(
          { error: "Invalid avatar URL" },
          { status: 400 }
        );
      }
      updateData.avatar = avatar;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        shopName: true,
        emailVerified: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
