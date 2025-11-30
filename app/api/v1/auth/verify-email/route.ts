import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api/helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse("Chưa đăng nhập", 401);
    }

    // Check if OTP was verified
    const verifiedOtp = await prisma.otpVerification.findFirst({
      where: {
        email: session.user.email,
        verified: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verifiedOtp) {
      return errorResponse("Chưa xác thực OTP", 400);
    }

    // Update user emailVerified
    await prisma.user.update({
      where: { email: session.user.email },
      data: { emailVerified: true },
    });

    // Clean up all OTPs for this email
    await prisma.otpVerification.deleteMany({
      where: { email: session.user.email },
    });

    return successResponse({
      message: "Email đã được xác thực",
      emailVerified: true,
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
