import { NextRequest } from "next/server";
import {
  getCurrentUser,
  successResponse,
  errorResponse,
} from "@/lib/api/helpers";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * POST /api/v1/upload
 * Upload ảnh lên Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Bạn cần đăng nhập", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "accs";

    if (!file) {
      return errorResponse("Vui lòng chọn file");
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse("Chỉ chấp nhận ảnh JPG, PNG, WebP hoặc GIF");
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("Ảnh không được quá 5MB");
    }

    // Upload to Cloudinary
    const { url, publicId, error } = await uploadToCloudinary(file, folder);

    if (error) {
      return errorResponse(error);
    }

    return successResponse({ url, publicId });
  } catch (error) {
    console.error("POST /api/v1/upload error:", error);
    return errorResponse("Có lỗi xảy ra", 500);
  }
}
