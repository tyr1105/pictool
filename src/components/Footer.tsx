'use client';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="font-bold text-gray-900 dark:text-white">PicTool</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              免费在线图片工具箱，所有处理均在浏览器本地完成，保护您的隐私安全。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">图片工具</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="/pictool/tools/compress" className="hover:text-blue-600 dark:hover:text-blue-400">图片压缩</a></li>
              <li><a href="/pictool/tools/convert" className="hover:text-blue-600 dark:hover:text-blue-400">格式转换</a></li>
              <li><a href="/pictool/tools/resize" className="hover:text-blue-600 dark:hover:text-blue-400">图片缩放</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">更多工具</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="/pictool/tools/crop" className="hover:text-blue-600 dark:hover:text-blue-400">图片裁剪</a></li>
              <li><a href="/pictool/tools/watermark" className="hover:text-blue-600 dark:hover:text-blue-400">水印添加</a></li>
              <li><a href="/pictool/tools/base64" className="hover:text-blue-600 dark:hover:text-blue-400">Base64转换</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} PicTool - 免费在线图片工具箱 | 所有图片处理均在本地浏览器完成
        </div>
      </div>
    </footer>
  );
}
