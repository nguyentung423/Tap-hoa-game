import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Tạp hoá game - Chợ Mua Bán Acc Game Uy Tín",
    template: "%s | Tạp hoá game",
  },
  description:
    "Chợ acc game uy tín với các shop được xác thực. Giao dịch an toàn qua trung gian Zalo.",
  keywords: [
    "mua acc game",
    "bán acc game",
    "shop acc game",
    "acc lien quan",
    "acc genshin",
    "tạp hoá game",
  ],
  authors: [{ name: "Tạp hoá game" }],
  creator: "Tạp hoá game",
  metadataBase: new URL("https://taphoagame.online"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://taphoagame.online",
    siteName: "Tạp hoá game",
    title: "Tạp hoá game - Chợ Mua Bán Acc Game Uy Tín",
    description:
      "Chợ acc game uy tín với các shop được xác thực. Giao dịch an toàn qua trung gian Zalo.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tạp hoá game - Chợ Acc Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tạp hoá game - Chợ Mua Bán Acc Game Uy Tín",
    description: "Chợ acc game uy tín. Giao dịch an toàn qua trung gian Zalo.",
    images: ["/og-image.png"],
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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
