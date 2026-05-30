import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: {
    default: "PicTool - 免费在线图片工具箱",
    template: "%s | PicTool - 免费在线图片工具箱",
  },
  description: "PicTool 是一个免费的在线图片工具箱，支持图片压缩、格式转换、缩放、裁剪、水印添加和Base64转换。所有处理在浏览器本地完成，保护您的隐私。",
  keywords: "图片压缩,格式转换,图片缩放,图片裁剪,水印,Base64,在线工具,免费,图片处理",
  authors: [{ name: "PicTool" }],
  creator: "PicTool",
  metadataBase: new URL("https://tyr1105.github.io/pictool"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://tyr1105.github.io/pictool",
    siteName: "PicTool",
    title: "PicTool - 免费在线图片工具箱",
    description: "无需上传服务器，所有处理在浏览器本地完成，保护您的隐私。支持图片压缩、格式转换、缩放、裁剪、水印、Base64转换。",
  },
  twitter: {
    card: "summary_large_image",
    title: "PicTool - 免费在线图片工具箱",
    description: "免费在线图片工具箱，所有处理在浏览器本地完成",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PicTool",
    "description": "免费在线图片工具箱",
    "url": "https://tyr1105.github.io/pictool",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CNY",
    },
    "featureList": [
      "图片压缩",
      "格式转换",
      "图片缩放",
      "图片裁剪",
      "水印添加",
      "Base64转换",
    ],
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              {/* Header */}
              <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-6 py-3">
                  <div className="lg:hidden w-10" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                    无需上传服务器 · 浏览器本地处理 · 保护隐私
                  </p>
                  <ThemeToggle />
                </div>
              </header>

              {/* Main content */}
              <main className="flex-1 p-4 md:p-8">
                {children}
              </main>

              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
