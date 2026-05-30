'use client';

import { useState, useCallback } from 'react';
import ToolPage from '@/components/ToolPage';
import ImageUploader from '@/components/ImageUploader';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface ConvertItem {
  id: string;
  file: File;
  preview: string;
  convertedBlob?: Blob;
  convertedPreview?: string;
  converted?: boolean;
  error?: boolean;
}

function convertImage(file: File, targetFormat: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0);
      const q = targetFormat === 'image/png' ? undefined : quality / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Conversion failed'));
          URL.revokeObjectURL(img.src);
        },
        targetFormat,
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

export default function ConvertPage() {
  const [images, setImages] = useState<ConvertItem[]>([]);
  const [targetFormat, setTargetFormat] = useState('image/webp');
  const [quality, setQuality] = useState(85);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const newItems: ConvertItem[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newItems]);
  }, []);

  const convertAll = async () => {
    setProcessing(true);
    const updated = [...images];
    for (let i = 0; i < updated.length; i++) {
      try {
        const blob = await convertImage(updated[i].file, targetFormat, quality);
        const oldPreview = updated[i].convertedPreview;
        if (oldPreview) URL.revokeObjectURL(oldPreview);
        updated[i] = {
          ...updated[i],
          convertedBlob: blob,
          convertedPreview: URL.createObjectURL(blob),
          converted: true,
        };
        setImages([...updated]);
      } catch {
        updated[i] = { ...updated[i], error: true };
        setImages([...updated]);
      }
    }
    setProcessing(false);
  };

  const downloadOne = (item: ConvertItem) => {
    if (!item.convertedBlob) return;
    const ext = targetFormat.split('/')[1];
    const name = item.file.name.replace(/\.[^.]+$/, '') + '.' + ext;
    saveAs(item.convertedBlob, name);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const converted = images.filter((i) => i.convertedBlob);
    if (converted.length === 0) return;
    const ext = targetFormat.split('/')[1];
    converted.forEach((item) => {
      const name = item.file.name.replace(/\.[^.]+$/, '') + '.' + ext;
      zip.file(name, item.convertedBlob!);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'converted_images.zip');
  };

  const removeItem = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.preview);
        const cp = item.convertedPreview;
        if (cp) URL.revokeObjectURL(cp);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const formatLabel: Record<string, string> = {
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'image/webp': 'WebP',
  };

  return (
    <ToolPage
      icon="🔄"
      title="格式转换"
      description="支持 PNG、JPG、WebP 等常见图片格式互相转换，一键批量处理。"
    >
      <div className="space-y-6">
        <ImageUploader multiple onFiles={handleFiles} label="拖拽图片到此处，或点击选择文件" sublabel="支持 PNG、JPG、WebP、BMP、GIF 格式" />

        {images.length > 0 && (
          <>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">目标格式</label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="image/png">PNG (无损)</option>
                    <option value="image/jpeg">JPEG (有损)</option>
                    <option value="image/webp">WebP (高效)</option>
                  </select>
                </div>
                {targetFormat !== 'image/png' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      质量: {quality}%
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={convertAll}
                  disabled={processing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  {processing ? '转换中...' : `转换为 ${formatLabel[targetFormat]}`}
                </button>
                {images.some((i) => i.convertedBlob) && (
                  <button
                    onClick={downloadAll}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    下载全部 (ZIP)
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {images.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <img src={item.convertedPreview || item.preview} alt="" className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.file.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{(item.file.type || 'image/unknown').split('/')[1].toUpperCase()}</span>
                      <span>→</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{formatLabel[targetFormat]}</span>
                      <span>·</span>
                      <span>{formatSize(item.file.size)}</span>
                      {item.convertedBlob && (
                        <>
                          <span>→</span>
                          <span className="text-green-600 dark:text-green-400">{formatSize(item.convertedBlob.size)}</span>
                        </>
                      )}
                    </div>
                    {item.error && <p className="text-xs text-red-500 mt-1">转换失败</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.convertedBlob && (
                      <button onClick={() => downloadOne(item)} className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50">
                        下载
                      </button>
                    )}
                    <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
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
