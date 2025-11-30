import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Create Supabase client lazily
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase environment variables are not set");
  }

  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseInstance;
}

// Storage bucket name
const BUCKET_NAME = "images";

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  file: File | Blob,
  path: string
): Promise<{ url: string; error: string | null }> {
  try {
    const supabase = getSupabase();

    // Generate unique filename
    const ext = file instanceof File ? file.name.split(".").pop() : "jpg";
    const filename = `${path}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { url: "", error: error.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Upload error:", error);
    return { url: "", error: "Upload failed" };
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  url: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getSupabase();

    // Extract path from URL
    const path = url.split(`${BUCKET_NAME}/`)[1];
    if (!path) {
      return { success: false, error: "Invalid URL" };
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Delete failed" };
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: (File | Blob)[],
  path: string
): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.all(
    files.map((file) => uploadFile(file, path))
  );

  const urls = results.filter((r) => r.url).map((r) => r.url);
  const errors = results.filter((r) => r.error).map((r) => r.error!);

  return { urls, errors };
}
