import type { Metadata, Viewport } from "next";
import { Kulim_Park, Syne_Mono } from "next/font/google";
import "./globals.css";
import { Logo } from "./Logo";
import PlausibleProvider from "next-plausible";
// import { UserAPIKey } from "./UserAPIKey"; // 已移除，API 密钥从环境变量读取
import { Toaster } from "@/components/ui/sonner";
// import GitHub from "./components/GitHubIcon"; // 已移除 GitHub 链接
// import XformerlyTwitter from "./components/TwitterIcon"; // 已移除 Twitter 链接
import { PlusIcon } from "./components/PlusIcon";

const kulimPark = Kulim_Park({
  variable: "--font-kulim-park",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
});

const syneMono = Syne_Mono({
  variable: "--font-syne-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const title = "EasyEdit – 用一个提示编辑图片";
const description = "用一个提示编辑图片的最简单方法";
const url = "https://www.easyedit.io/";
const ogimage = "https://www.easyedit.io/og-image.png";
const sitename = "easyedit.io";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${kulimPark.variable} ${syneMono.variable}`}>
      <head>
        <PlausibleProvider domain="easyedit.io" />
      </head>
      <body className="flex min-h-screen w-full flex-col antialiased">
        <header className="relative flex p-4 text-center text-white">
          <div className="flex items-center gap-2 text-lg">
            <Logo />
            EasyEdit
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <a
              href="https://katon-easyedit.vercel.app"
              className="hidden h-8 cursor-pointer items-center gap-2 rounded border-[0.5px] border-gray-700 bg-gray-900 px-3.5 text-gray-200 transition hover:bg-gray-800 md:flex"
            >
              <PlusIcon />
              新图片
            </a>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center overflow-auto pt-4 md:pb-12">
          <div className="w-full">{children}</div>
        </main>

        <Toaster />

        <footer className="flex flex-col items-center p-4">
          <p className="text-sm text-gray-400">
            由{" "}
            <a
              href="https://fal.ai"
              target="_blank"
              className="text-gray-200 underline underline-offset-2"
            >
              fal.ai
            </a>{" "}
            提供的{" "}
            <a
              href="https://fal.ai"
              target="_blank"
              className="text-gray-200 underline underline-offset-2"
            >
              Flux Kontext
            </a>{" "}
            驱动
          </p>
        </footer>
      </body>
    </html>
  );
}
