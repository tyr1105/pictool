'use client';

import { useState, useCallback } from 'react';
import ToolPage from '@/components/ToolPage';
import ImageUploader from '@/components/ImageUploader';
import CopyButton from '@/components/CopyButton';
import { saveAs } from 'file-saver';

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function Base64Page() {
  const [tab, setTab] = useState<'to' | 'from'>('to');
  const [base64Str, setBase64Str] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [decodedImage, setDecodedImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFileName(file.name);
    setFileSize(file.size);
    setError('');

    const reader = new FileReader();
    reader.onload = () => {
      setBase64Str(reader.result as string);
    };
    reader.onerror = () => {
      setError('读取文件失败');
    };
    reader.readAsDataURL(file);
  }, []);

  const decodeBase64 = () => {
    setError('');
    let data = base64Str.trim();

    // If it has data URI prefix, extract the base64 part
    if (data.startsWith('data:')) {
      try {
        // Validate by creating an image
        setDecodedImage(data);
        return;
      } catch {
        setError('无效的 Base64 图片数据');
        return;
      }
    }

    // Try to detect format from base64 content
    try {
      // Detect PNG
      const prefix = atob(data.substring(0, 8));
      let mimeType = 'image/png';
      if (prefix.startsWith('\x89PNG')) mimeType = 'image/png';
      else if (prefix.startsWith('\xFF\xD8')) mimeType = 'image/jpeg';
      else if (prefix.startsWith('RIFF')) mimeType = 'image/webp';
      else if (prefix.startsWith('GIF')) mimeType = 'image/gif';

      const uri = `data:${mimeType};base64,${data}`;
      setDecodedImage(uri);
    } catch {
      setError('无效的 Base64 编码，请检查输入');
    }
  };

  const downloadDecoded = () => {
    if (!decodedImage) return;
    const ext = decodedImage.includes('image/jpeg') ? 'jpg'
      : decodedImage.includes('image/png') ? 'png'
      : decodedImage.includes('image/webp') ? 'webp'
      : decodedImage.includes('image/gif') ? 'gif' : 'png';

    fetch(decodedImage)
      .then((r) => r.blob())
      .then((blob) => saveAs(blob, `decoded_image.${ext}`));
  };

  return (
    <ToolPage
      icon="🔤"
      title="Base64转换"
      description="图片与Base64编码互转，方便嵌入代码或传输。"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl">
          <button
            onClick={() => setTab('to')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
              tab === 'to'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            图片转 Base64
          </button>
          <button
            onClick={() => setTab('from')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
              tab === 'from'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Base64 转图片
          </button>
        </div>

        {/* Tab: Image to Base64 */}
        {tab === 'to' && (
          <div className="space-y-4">
            <ImageUploader onFiles={handleFiles} label="拖拽图片到此处，或点击选择文件" sublabel="支持 PNG、JPG、WebP、BMP、GIF 格式" />

            {fileName && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{fileName}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({formatSize(fileSize)})</span>
                  </div>
                  <CopyButton text={base64Str} label="复制 Base64" />
                </div>

                {base64Str && (
                  <>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Base64 编码大小: {formatSize(base64Str.length)}
                    </div>
                    <div className="relative">
                      <textarea
                        readOnly
                        value={base64Str}
                        className="w-full h-40 px-4 py-3 text-xs font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 resize-none"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Base64 to Image */}
        {tab === 'from' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">粘贴 Base64 编码</label>
              <textarea
                value={base64Str}
                onChange={(e) => { setBase64Str(e.target.value); setError(''); setDecodedImage(null); }}
                placeholder="粘贴 Base64 字符串（支持带 data:image/... 前缀的格式）"
                className="w-full h-40 px-4 py-3 text-sm font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-none placeholder:text-gray-400"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={decodeBase64}
                disabled={!base64Str.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                解码图片
              </button>
              {decodedImage && (
                <button onClick={downloadDecoded} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                  下载图片
                </button>
              )}
              <CopyButton text={base64Str} label="复制" />
            </div>

            {decodedImage && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">解码预览</h3>
                <div className="flex justify-center">
                  <img src={decodedImage} alt="Decoded" className="max-w-full max-h-80 rounded-lg" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPage>
  );
}
