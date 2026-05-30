import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PicTool - 免费在线图片工具箱",
  description: "免费在线图片工具箱，支持图片压缩、格式转换、缩放、裁剪、水印添加和Base64转换。所有处理在浏览器本地完成，保护您的隐私。",
};

const tools = [
  {
    href: "/tools/compress",
    icon: "🗜️",
    title: "图片压缩",
    desc: "智能压缩图片，大幅减小文件体积，保持画质清晰。支持批量处理。",
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-900/20",
  },
  {
    href: "/tools/convert",
    icon: "🔄",
    title: "格式转换",
    desc: "支持 PNG、JPG、WebP 等常见图片格式互相转换，一键批量处理。",
    color: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-900/20",
  },
  {
    href: "/tools/resize",
    icon: "📐",
    title: "图片缩放",
    desc: "快速调整图片尺寸，支持自定义宽高、百分比缩放和常用预设尺寸。",
    color: "from-green-500 to-teal-500",
    bgLight: "bg-green-50",
    bgDark: "dark:bg-green-900/20",
  },
  {
    href: "/tools/crop",
    icon: "✂️",
    title: "图片裁剪",
    desc: "可视化裁剪图片，支持自由裁剪和多种预设比例（1:1、4:3、16:9等）。",
    color: "from-orange-500 to-red-500",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-900/20",
  },
  {
    href: "/tools/watermark",
    icon: "💧",
    title: "水印添加",
    desc: "为图片添加自定义文字或图片水印，支持位置、透明度、旋转等设置。",
    color: "from-indigo-500 to-blue-500",
    bgLight: "bg-indigo-50",
    bgDark: "dark:bg-indigo-900/20",
  },
  {
    href: "/tools/base64",
    icon: "🔤",
    title: "Base64转换",
    desc: "图片与Base64编码互转，方便嵌入代码或传输，一键复制结果。",
    color: "from-teal-500 to-emerald-500",
    bgLight: "bg-teal-50",
    bgDark: "dark:bg-teal-900/20",
  },
];

const features = [
  { icon: "🆓", title: "完全免费", desc: "所有工具永久免费使用，无需付费" },
  { icon: "🔒", title: "隐私安全", desc: "图片不上传服务器，本地处理保护隐私" },
  { icon: "⚡", title: "快速处理", desc: "浏览器端直接处理，即时预览效果" },
  { icon: "📦", title: "批量操作", desc: "支持多文件批量处理，提高工作效率" },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          100% 浏览器端处理 · 无需上传
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
          PicTool - 免费在线
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">图片工具箱</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          无需上传服务器，所有处理在浏览器本地完成，保护您的隐私
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/tools/compress"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            开始使用
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#tools"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            浏览全部工具
          </a>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">图片处理工具</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-10">选择您需要的工具，开始处理图片</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl ${tool.bgLight} ${tool.bgDark} flex items-center justify-center text-2xl mb-4`}>
                {tool.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{tool.desc}</p>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">为什么选择 PicTool？</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-10">专为隐私和效率设计的图片工具</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">立即开始使用</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            无需注册，无需下载，打开浏览器即可使用全部功能。您的图片永远不会离开您的设备。
          </p>
          <Link
            href="/tools/compress"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors shadow-lg"
          >
            开始处理图片
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
