import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

// Create fresh prisma client for auth to avoid PgBouncer prepared statement issues
const getAuthPrisma = () => new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth only
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const prisma = getAuthPrisma();
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Existing user - just update lastActiveAt
            await prisma.user.update({
              where: { email: user.email },
              data: {
                lastActiveAt: new Date(),
              },
            });
          } else {
            // New user - create account
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                avatar: user.image,
                emailVerified: false,
                status: "PENDING",
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error syncing user:", error);
          return false;
        } finally {
          await prisma.$disconnect();
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      const prisma = getAuthPrisma();
      try {
        // Khi đăng nhập lần đầu, check xem user mới hay cũ
        if (trigger === "signIn" && user?.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email as string },
            select: { createdAt: true, lastActiveAt: true },
          });

          if (dbUser) {
            // Nếu createdAt và lastActiveAt gần nhau (< 5 giây) thì là user mới
            const timeDiff = Math.abs(
              dbUser.lastActiveAt.getTime() - dbUser.createdAt.getTime()
            );
            token.isNewUser = timeDiff < 5000; // 5 seconds
          }
        }

        if (user) {
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }

        // Lấy thêm info từ database
        if (token.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              status: true,
              shopName: true,
              shopSlug: true,
              isVerified: true,
              emailVerified: true,
            },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.picture = dbUser.avatar;
            token.role = dbUser.role;
            token.status = dbUser.status;
            token.shopName = dbUser.shopName;
            token.shopSlug = dbUser.shopSlug;
            token.isVerified = dbUser.isVerified;
            token.emailVerified = dbUser.emailVerified;
          }
        }

        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        return token;
      } finally {
        await prisma.$disconnect();
      }
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as "SELLER" | "ADMIN";
        session.user.status = token.status as
          | "PENDING"
          | "APPROVED"
          | "REJECTED"
          | "BANNED";
        session.user.shopName = token.shopName as string | null;
        session.user.shopSlug = token.shopSlug as string | null;
        session.user.isVerified = token.isVerified as boolean;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.isNewUser = token.isNewUser as boolean | undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Nếu đang redirect về /seller/check, xử lý logic ở đây
      if (url.includes("/seller/check")) {
        return `${baseUrl}/seller/check`;
      }

      // Cho phép redirect đến các URL trong cùng domain
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/seller",
    error: "/seller",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
