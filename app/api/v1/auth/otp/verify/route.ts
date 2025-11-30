import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api/helpers";

const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return errorResponse("Email và mã OTP là bắt buộc", 400);
    }

    // Find the latest OTP for this email
    const otp = await prisma.otpVerification.findFirst({
      where: {
        email,
        verified: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otp) {
      return errorResponse("Mã OTP không tồn tại hoặc đã hết hạn", 400);
    }

    // Check attempts
    if (otp.attempts >= MAX_ATTEMPTS) {
      return errorResponse(
        "Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.",
        429
      );
    }

    // Verify code
    if (otp.code !== code) {
      // Increment attempts
      await prisma.otpVerification.update({
        where: { id: otp.id },
        data: { attempts: otp.attempts + 1 },
      });

      const remainingAttempts = MAX_ATTEMPTS - otp.attempts - 1;
      return errorResponse(
        `Mã OTP không đúng. Còn ${remainingAttempts} lần thử.`,
        400
      );
    }

    // Mark as verified
    await prisma.otpVerification.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    // Clean up old OTPs for this email
    await prisma.otpVerification.deleteMany({
      where: {
        email,
        id: { not: otp.id },
      },
    });

    return successResponse({
      message: "Xác thực thành công",
      verified: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
