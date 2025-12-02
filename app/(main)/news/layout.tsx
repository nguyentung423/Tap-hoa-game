import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin Tức Game",
  description:
    "Cập nhật tin tức mới nhất về Liên Quân Mobile, Liên Minh Huyền Thoại, Free Fire, PUBG, Roblox và các game hot khác",
  keywords: [
    "tin tức game",
    "tin game",
    "tin liên quân",
    "tin liên minh",
    "tin free fire",
    "tin pubg",
    "tin roblox",
    "esports",
    "game news",
  ],
  openGraph: {
    title: "Tin Tức Game - Tạp hoá game",
    description:
      "Cập nhật tin tức mới nhất về Liên Quân Mobile, Liên Minh Huyền Thoại, Free Fire, PUBG, Roblox",
    type: "website",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
