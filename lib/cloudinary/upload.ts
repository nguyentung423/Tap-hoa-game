import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File | Blob,
  folder: string = "accs"
): Promise<{ url: string; publicId: string; error: string | null }> {
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: `accvip/${folder}`,
      resource_type: "image",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" }, // Max size
        { quality: "auto:good" }, // Auto optimize
        { fetch_format: "auto" }, // Auto format (webp, etc)
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      error: null,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return {
      url: "",
      publicId: "",
      error: error.message || "Upload failed",
    };
  }
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Cloudinary delete error:", error);
    return { success: false, error: error.message || "Delete failed" };
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleToCloudinary(
  files: (File | Blob)[],
  folder: string = "accs"
): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.all(
    files.map((file) => uploadToCloudinary(file, folder))
  );

  const urls = results.filter((r) => r.url).map((r) => r.url);
  const errors = results.filter((r) => r.error).map((r) => r.error!);

  return { urls, errors };
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
  } = {}
): string {
  const { width, height, quality = "auto" } = options;

  // Extract public_id from URL
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  if (!match) return url;

  const publicId = match[1];

  return cloudinary.url(publicId, {
    transformation: [
      ...(width || height ? [{ width, height, crop: "fill" }] : []),
      { quality },
      { fetch_format: "auto" },
    ],
  });
}
