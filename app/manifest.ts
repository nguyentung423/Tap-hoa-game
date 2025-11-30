import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AccVIP - Mua Bán Acc Game",
    short_name: "AccVIP",
    description: "Sàn giao dịch tài khoản game uy tín #1 Việt Nam",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#00ff9d",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
