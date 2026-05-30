'use client';

import { useState, useCallback } from 'react';
import ToolPage from '@/components/ToolPage';
import ImageUploader from '@/components/ImageUploader';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface ImageItem {
  id: string;
  file: File;
  originalSize: number;
  compressedBlob?: Blob;
  compressedSize?: number;
  preview: string;
  compressedPreview?: string;
}

function compressImage(file: File, quality: number, format: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0);

      let mimeType = format;
      if (format === 'original') {
        mimeType = file.type || 'image/jpeg';
        if (mimeType === 'image/gif' || mimeType === 'image/bmp') {
          mimeType = 'image/png';
        }
      }

      const q = mimeType === 'image/png' ? undefined : quality / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
          URL.revokeObjectURL(img.src);
        },
        mimeType,
        q
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function CompressPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState('original');
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const newImages: ImageItem[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      originalSize: file.size,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const compressAll = async () => {
    setProcessing(true);
    const updated = [...images];
    for (let i = 0; i < updated.length; i++) {
      try {
        const blob = await compressImage(updated[i].file, quality, format);
        const oldPreview = updated[i].compressedPreview;
        if (oldPreview) URL.revokeObjectURL(oldPreview);
        updated[i] = {
          ...updated[i],
          compressedBlob: blob,
          compressedSize: blob.size,
          compressedPreview: URL.createObjectURL(blob),
        };
        setImages([...updated]);
      } catch (e) {
        console.error('Compression failed:', e);
      }
    }
    setProcessing(false);
  };

  const downloadOne = (item: ImageItem) => {
    if (!item.compressedBlob) return;
    const ext = format === 'original' ? item.file.name.split('.').pop() || 'jpg' : format.split('/')[1];
    const name = item.file.name.replace(/\.[^.]+$/, '') + '_compressed.' + ext;
    saveAs(item.compressedBlob, name);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const compressed = images.filter((i) => i.compressedBlob);
    if (compressed.length === 0) return;
    compressed.forEach((item) => {
      const ext = format === 'original' ? item.file.name.split('.').pop() || 'jpg' : format.split('/')[1];
      const name = item.file.name.replace(/\.[^.]+$/, '') + '_compressed.' + ext;
      zip.file(name, item.compressedBlob!);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'compressed_images.zip');
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.preview);
        const cp = item.compressedPreview;
        if (cp) URL.revokeObjectURL(cp);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const totalOriginal = images.reduce((s, i) => s + i.originalSize, 0);
  const totalCompressed = images.reduce((s, i) => s + (i.compressedSize || 0), 0);
  const savings = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;

  return (
    <ToolPage
      icon="🗜️"
      title="图片压缩"
      description="智能压缩图片，大幅减小文件体积。支持批量处理，保持画质清晰。"
    >
      <div className="space-y-6">
        <ImageUploader multiple onFiles={handleFiles} label="拖拽图片到此处，或点击选择文件" sublabel="支持多文件上传，PNG、JPG、WebP格式" />

        {images.length > 0 && (
          <>
            {/* Controls */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    压缩质量: {quality}%
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>最小体积</span>
                    <span>最高质量</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    输出格式
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="original">保持原格式</option>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/webp">WebP</option>
                    <option value="image/png">PNG</option>
                  </select>
                </div>
              </div>

              {/* Stats */}
              {totalCompressed > 0 && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">原始大小</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{formatSize(totalOriginal)}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">压缩后</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{formatSize(totalCompressed)}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">节省空间</div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{savings > 0 ? savings : 0}%</div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={compressAll}
                  disabled={processing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  {processing ? '压缩中...' : '开始压缩'}
                </button>
                {images.some((i) => i.compressedBlob) && (
                  <button
                    onClick={downloadAll}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    下载全部 (ZIP)
                  </button>
                )}
              </div>
            </div>

            {/* Image list */}
            <div className="space-y-3">
              {images.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <img src={item.compressedPreview || item.preview} alt="" className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.file.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatSize(item.originalSize)}</span>
                      {item.compressedSize !== undefined && (
                        <>
                          <span>→</span>
                          <span className="text-green-600 dark:text-green-400 font-medium">{formatSize(item.compressedSize)}</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            (-{Math.round((1 - item.compressedSize / item.originalSize) * 100)}%)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.compressedBlob && (
                      <button
                        onClick={() => downloadOne(item)}
                        className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        下载
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(item.id)}
                      className="text-sm text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolPage>
  );
}
