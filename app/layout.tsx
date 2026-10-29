import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_JP } from "next/font/google";
import Header from "@/components/organisms/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "promoting-flower-shop",
  description: "フラワーショップの商品を宣伝するページ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // safe-area（env(safe-area-inset-*)）を有効にする
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${notoSansJp.variable} antialiased`}
    >
      <body className="min-h-dvh bg-background text-base text-foreground">
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col pb-[env(safe-area-inset-bottom)]">
          <Header />
          <main className="flex flex-1 flex-col px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
