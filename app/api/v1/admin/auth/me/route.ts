import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = verify(token, JWT_SECRET) as {
        email: string;
        name: string;
        role: string;
      };

      return NextResponse.json({
        admin: {
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        },
      });
    } catch {
      // Token invalid or expired
      cookieStore.delete("admin_token");
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
  } catch (error) {
    console.error("Admin auth check error:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
