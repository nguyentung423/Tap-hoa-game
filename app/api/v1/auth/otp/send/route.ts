import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api/helpers";
import { sendOtpEmail, generateOtpCode } from "@/lib/email/resend";

// Rate limiting: max 3 OTP requests per email per 10 minutes
const OTP_RATE_LIMIT = 3;
const OTP_RATE_WINDOW = 10 * 60 * 1000; // 10 minutes
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return errorResponse("Email không hợp lệ", 400);
    }

    // Check rate limit
    const recentOtps = await prisma.otpVerification.count({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - OTP_RATE_WINDOW),
        },
      },
    });

    if (recentOtps >= OTP_RATE_LIMIT) {
      return errorResponse(
        "Bạn đã yêu cầu quá nhiều mã OTP. Vui lòng thử lại sau 10 phút.",
        429
      );
    }

    // Generate OTP
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY);

    // Save OTP to database
    await prisma.otpVerification.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // Send OTP email
    const result = await sendOtpEmail(email, code);

    if (!result.success) {
      return errorResponse("Không thể gửi email. Vui lòng thử lại.", 500);
    }

    return successResponse({
      message: "Mã OTP đã được gửi đến email của bạn",
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
