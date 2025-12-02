import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/api/helpers";

/**
 * GET /api/v1/settings
 * Get public site settings
 */
export async function GET(request: NextRequest) {
  try {
    // Get main site settings
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
      select: {
        adminZaloId: true,
        adminZaloName: true,
        adminPhone: true,
        siteName: true,
        siteDesc: true,
        facebookUrl: true,
        youtubeUrl: true,
        tiktokUrl: true,
      },
    });

    // If settings don't exist, create default
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "main",
          adminZaloId: "",
          adminZaloName: "Admin AccVip",
          adminPhone: "0123456789",
          siteName: "AccVip",
          siteDesc: "Mua bán acc game uy tín",
        },
        select: {
          adminZaloId: true,
          adminZaloName: true,
          adminPhone: true,
          siteName: true,
          siteDesc: true,
          facebookUrl: true,
          youtubeUrl: true,
          tiktokUrl: true,
        },
      });
    }

    return successResponse(settings);
  } catch (error) {
    console.error("GET /api/v1/settings error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
