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

const aspectPresets = [
  { label: '自由', ratio: 0 },
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '3:2', ratio: 3 / 2 },
];

interface Selection {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function CropPage() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [displayScale, setDisplayScale] = useState(1);
  const [displayOffset, setDisplayOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const img = new Image();
    img.onload = () => {
      setImage({ file, img, preview: URL.createObjectURL(file) });
      setSelection(null);
      setCroppedUrl(null);
    };
    img.src = URL.createObjectURL(file);
  }, []);

  // Calculate display scale when image loads
  useEffect(() => {
    if (!image || !containerRef.current) return;
    const container = containerRef.current;
    const cw = container.clientWidth;
    const ch = 500;
    const scale = Math.min(cw / image.img.width, ch / image.img.height, 1);
    setDisplayScale(scale);
    const offsetX = (cw - image.img.width * scale) / 2;
    const offsetY = (ch - image.img.height * scale) / 2;
    setDisplayOffset({ x: offsetX, y: offsetY });
  }, [image]);

  const getRelativePos = (e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - displayOffset.x) / displayScale,
      y: (e.clientY - rect.top - displayOffset.y) / displayScale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image) return;
    isDragging.current = true;
    const pos = getRelativePos(e);
    startPos.current = pos;
    setSelection({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setCroppedUrl(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !image) return;
    const pos = getRelativePos(e);
    let w = pos.x - startPos.current.x;
    let h = pos.y - startPos.current.y;

    if (aspectRatio > 0) {
      if (Math.abs(w) / aspectRatio > Math.abs(h)) {
        h = (Math.abs(w) / aspectRatio) * Math.sign(h || 1);
      } else {
        w = Math.abs(h) * aspectRatio * Math.sign(w || 1);
      }
    }

    // Clamp to image bounds
    const x = w >= 0 ? startPos.current.x : startPos.current.x + w;
    const y = h >= 0 ? startPos.current.y : startPos.current.y + h;
    const finalW = Math.abs(w);
    const finalH = Math.abs(h);

    setSelection({
      x: Math.max(0, x),
      y: Math.max(0, y),
      w: Math.min(finalW, image.img.width - Math.max(0, x)),
      h: Math.min(finalH, image.img.height - Math.max(0, y)),
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const cropImage = () => {
    if (!image || !selection || selection.w <= 0 || selection.h <= 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(selection.w);
    canvas.height = Math.round(selection.h);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      image.img,
      Math.round(selection.x),
      Math.round(selection.y),
      Math.round(selection.w),
      Math.round(selection.h),
      0,
      0,
      canvas.width,
      canvas.height
    );
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setCroppedUrl(canvas.toDataURL('image/png'));
  };

  const download = () => {
    if (!croppedUrl || !image) return;
    const a = document.createElement('a');
    a.href = croppedUrl;
    a.download = image.file.name.replace(/\.[^.]+$/, '_cropped.png');
    a.click();
  };

  const selDisplay = selection
    ? {
        left: selection.x * displayScale + displayOffset.x,
        top: selection.y * displayScale + displayOffset.y,
        width: selection.w * displayScale,
        height: selection.h * displayScale,
      }
    : null;

  return (
    <ToolPage
      icon="✂️"
      title="图片裁剪"
      description="可视化裁剪图片，支持自由裁剪和多种预设比例。"
    >
      <div className="space-y-6">
        {!image && (
          <ImageUploader onFiles={handleFiles} label="拖拽图片到此处，或点击选择文件" sublabel="支持 PNG、JPG、WebP 格式" />
        )}

        {image && (
          <>
            {/* Aspect ratio buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">裁剪比例</label>
              <div className="flex flex-wrap gap-2">
                {aspectPresets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setAspectRatio(p.ratio);
                      setSelection(null);
                      setCroppedUrl(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      aspectRatio === p.ratio
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop area */}
            <div
              ref={containerRef}
              className="relative bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden select-none"
              style={{ height: 500 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={image.preview}
                alt=""
                className="absolute"
                style={{
                  left: displayOffset.x,
                  top: displayOffset.y,
                  width: image.img.width * displayScale,
                  height: image.img.height * displayScale,
                }}
                draggable={false}
              />
              {selDisplay && selDisplay.width > 0 && selDisplay.height > 0 && (
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/10"
                  style={{
                    left: selDisplay.left,
                    top: selDisplay.top,
                    width: selDisplay.width,
                    height: selDisplay.height,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="absolute inset-0 border border-white/30" />
                </div>
              )}
              {!selection && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400 dark:text-gray-500 text-sm bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg">
                    在图片上拖拽鼠标选择裁剪区域
                  </p>
                </div>
              )}
            </div>

            {selection && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                选区大小: {Math.round(selection.w)} × {Math.round(selection.h)} px
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={cropImage}
                disabled={!selection || selection.w <= 0 || selection.h <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                裁剪
              </button>
              {croppedUrl && (
                <button onClick={download} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                  下载裁剪图片
                </button>
              )}
              <button
                onClick={() => { setImage(null); setSelection(null); setCroppedUrl(null); }}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                重新选择
              </button>
            </div>

            {/* Preview */}
            {croppedUrl && (
              <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">裁剪预览</h3>
                <div className="flex justify-center">
                  <img src={croppedUrl} alt="Cropped" className="max-w-full max-h-80 rounded-lg" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPage>
  );
}
