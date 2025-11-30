/**
 * Upload API Service
 * Xử lý upload files
 */

import { API_ENDPOINTS } from "./endpoints";
import { ApiResponse } from "@/types/api";

// ============ Types ============

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export interface MultiUploadResponse {
  files: UploadResponse[];
}

// ============ API Functions ============

/**
 * Upload single image
 */
export async function uploadImage(
  file: File,
  folder?: string
): Promise<ApiResponse<UploadResponse>> {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) {
    formData.append("folder", folder);
  }

  try {
    const response = await fetch(API_ENDPOINTS.upload.image, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Upload failed",
      };
    }

    return {
      success: true,
      data: data.data ?? data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[],
  folder?: string
): Promise<ApiResponse<MultiUploadResponse>> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  if (folder) {
    formData.append("folder", folder);
  }

  try {
    const response = await fetch(API_ENDPOINTS.upload.images, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Upload failed",
      };
    }

    return {
      success: true,
      data: data.data ?? data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Convert File to base64 (for preview before upload)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File phải là hình ảnh" };
  }

  // Check file size
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `File không được lớn hơn ${maxSizeMB}MB` };
  }

  return { valid: true };
}

// ============ Export ============
export const uploadApi = {
  uploadImage,
  uploadImages,
  fileToBase64,
  validateImageFile,
};

export default uploadApi;
