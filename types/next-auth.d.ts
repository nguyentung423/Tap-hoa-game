import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: "SELLER" | "ADMIN";
      status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
      shopName: string | null;
      shopSlug: string | null;
      isVerified: boolean;
      emailVerified: boolean;
      isNewUser?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role: "SELLER" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
    shopName: string | null;
    shopSlug: string | null;
    isVerified: boolean;
    emailVerified: boolean;
    isNewUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    role: "SELLER" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
    shopName: string | null;
    shopSlug: string | null;
    isVerified: boolean;
    emailVerified: boolean;
    isNewUser?: boolean;
  }
}
