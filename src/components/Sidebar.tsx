'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const tools = [
  { href: '/tools/compress', label: '图片压缩', icon: '🗜️', desc: '压缩图片减小体积' },
  { href: '/tools/convert', label: '格式转换', icon: '🔄', desc: 'PNG/JPG/WebP互转' },
  { href: '/tools/resize', label: '图片缩放', icon: '📐', desc: '调整图片尺寸' },
  { href: '/tools/crop', label: '图片裁剪', icon: '✂️', desc: '裁剪图片区域' },
  { href: '/tools/watermark', label: '水印添加', icon: '💧', desc: '添加文字/图片水印' },
  { href: '/tools/base64', label: 'Base64转换', icon: '🔤', desc: '图片与Base64互转' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="切换导航"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {collapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {collapsed && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setCollapsed(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-200 ease-in-out
        ${collapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-3" onClick={() => setCollapsed(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              P
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-lg">PicTool</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">在线图片工具箱</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            href="/"
            onClick={() => setCollapsed(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">🏠</span>
            首页
          </Link>

          <div className="pt-3 pb-1 px-4">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">工具</span>
          </div>

          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setCollapsed(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === tool.href || pathname === tool.href + '/'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{tool.icon}</span>
              <div>
                <div>{tool.label}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-normal">{tool.desc}</div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
            100% 浏览器端处理<br />无需上传服务器
          </div>
        </div>
      </aside>
    </>
  );
}
