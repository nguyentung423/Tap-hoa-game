import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "ui-avatars.com",
      "i.imgur.com",
      "gamek.mediacdn.vn",
      "genk.mediacdn.vn",
      "cdn.thegioigame.vn",
      "game8.vn",
      "vcdn-sohoa.vnecdn.net",
      "soha.vn",
      "ngoisao.net",
      "cafef.vn",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Modern browsers only - remove legacy polyfills
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Enable SWC minification for better performance
  swcMinify: true,
};

export default nextConfig;
