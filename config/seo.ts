import { Metadata } from "next";

export const defaultSeo: Metadata = {
  title: {
    default: "Tạp hoá game - Chợ Mua Bán Acc Game Uy Tín",
    template: "%s | Tạp hoá game",
  },
  description:
    "Tạp hoá game - Nơi mua bán tài khoản game uy tín. Các Shop uy tín, giao dịch an toàn qua Admin trung gian, hỗ trợ 24/7.",
  keywords: [
    "mua bán acc game",
    "acc lmht",
    "acc valorant",
    "acc liên quân",
    "acc genshin",
    "shop acc game",
    "acc game uy tín",
    "mua nick game",
    "bán nick game",
  ],
  authors: [{ name: "Tạp hoá game Team" }],
  creator: "Tạp hoá game",
  publisher: "Tạp hoá game",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://taphoagame.vn"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "Tạp hoá game - Chợ Mua Bán Acc Game Uy Tín",
    description:
      "Nơi mua bán tài khoản game uy tín. Các Shop uy tín, giao dịch an toàn qua Admin trung gian.",
    siteName: "Tạp hoá game",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tạp hoá game - Chợ Mua Bán Acc Game Uy Tín",
    description:
      "Nơi mua bán tài khoản game uy tín. Các Shop uy tín, giao dịch an toàn qua Admin trung gian.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export function generatePageSeo({
  title,
  description,
  path = "/",
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${
    process.env.NEXT_PUBLIC_APP_URL || "https://taphoagame.vn"
  }${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
