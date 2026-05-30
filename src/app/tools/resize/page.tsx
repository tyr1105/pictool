'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ToolPage from '@/components/ToolPage';
import ImageUploader from '@/components/ImageUploader';
import { saveAs } from 'file-saver';

interface ImageData {
  file: File;
  img: HTMLImageElement;
  preview: string;
}

const presets = [
  { label: '1920×1080', w: 1920, h: 1080 },
  { label: '1280×720', w: 1280, h: 720 },
  { label: '800×600', w: 800, h: 600 },
  { label: '自定义', w: 0, h: 0 },
];

const scales = [50, 75, 150, 200];

export default function ResizePage() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [originalRatio, setOriginalRatio] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(-1);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const img = new Image();
    img.onload = () => {
      setImage({ file, img, preview: URL.createObjectURL(file) });
      setWidth(img.width);
      setHeight(img.height);
      setOriginalRatio(img.width / img.height);
      setPreviewUrl(null);
      setSelectedPreset(-1);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const handleWidthChange = (newW: number) => {
    setWidth(newW);
    if (lockRatio) {
      setHeight(Math.round(newW / originalRatio));
    }
    setSelectedPreset(-1);
  };

  const handleHeightChange = (newH: number) => {
    setHeight(newH);
    if (lockRatio) {
      setWidth(Math.round(newH * originalRatio));
    }
    setSelectedPreset(-1);
  };

  const applyPreset = (idx: number) => {
    setSelectedPreset(idx);
    const p = presets[idx];
    if (p.w === 0) return;
    if (lockRatio) {
      const scale = Math.max(p.w / image!.img.width, p.h / image!.img.height);
      setWidth(Math.round(image!.img.width * scale));
      setHeight(Math.round(image!.img.height * scale));
    } else {
      setWidth(p.w);
      setHeight(p.h);
    }
  };

  const applyScale = (pct: number) => {
    if (!image) return;
    setWidth(Math.round(image.img.width * pct / 100));
    setHeight(Math.round(image.img.height * pct / 100));
    setSelectedPreset(-1);
  };

  const generatePreview = () => {
    if (!image || width <= 0 || height <= 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(image.img, 0, 0, width, height);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    if (previewUrl && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        const maxW = 600;
        const maxH = 400;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = previewUrl;
    }
  }, [previewUrl]);

  const download = () => {
    if (!previewUrl || !image) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(image.img, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, image.file.name.replace(/\.[^.]+$/, '_resized.png'));
    }, 'image/png');
  };

  return (
    <ToolPage
      icon="📐"
      title="图片缩放"
      description="快速调整图片尺寸，支持自定义宽高、百分比缩放和常用预设尺寸。"
    >
      <div className="space-y-6">
        {!image && (
          <ImageUploader onFiles={handleFiles} label="拖拽图片到此处，或点击选择文件" sublabel="支持 PNG、JPG、WebP 格式" />
        )}

        {image && (
          <>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 md:p-6 space-y-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                原始尺寸: {image.img.width} × {image.img.height}px
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">预设尺寸</label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p, idx) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(idx)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPreset === idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale percentages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">百分比缩放</label>
                <div className="flex flex-wrap gap-2">
                  {scales.map((s) => (
                    <button
                      key={s}
                      onClick={() => applyScale(s)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 transition-colors"
                    >
                      {s}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Width / Height */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">宽度 (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => setLockRatio(!lockRatio)}
                  className={`p-2.5 rounded-lg border transition-colors mb-0.5 ${
                    lockRatio
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400'
                  }`}
                  title={lockRatio ? '解除锁定比例' : '锁定比例'}
                >
                  {lockRatio ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    </svg>
                  )}
                </button>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">高度 (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generatePreview}
                  disabled={width <= 0 || height <= 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  生成预览
                </button>
                {previewUrl && (
                  <button onClick={download} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    下载
                  </button>
                )}
                <button
                  onClick={() => { setImage(null); setPreviewUrl(null); }}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  重新选择
                </button>
              </div>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">预览 ({width} × {height}px)</h3>
                <div className="flex justify-center">
                  <canvas ref={previewCanvasRef} className="max-w-full rounded-lg" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPage>
  );
}
