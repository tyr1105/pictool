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

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'tile';

export default function WatermarkPage() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [text, setText] = useState('PicTool 水印');
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(50);
  const [rotation, setRotation] = useState(-30);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [watermarkImg, setWatermarkImg] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generateWatermark = useCallback(() => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = image.img.width;
    canvas.height = image.img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(image.img, 0, 0);
    ctx.globalAlpha = opacity / 100;

    if (watermarkType === 'text' && text) {
      ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Noto Sans SC", sans-serif`;
      ctx.fillStyle = fontColor;

      if (position === 'tile') {
        const metrics = ctx.measureText(text);
        const tw = metrics.width + 60;
        const th = fontSize + 60;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        for (let y = -canvas.height; y < canvas.height * 2; y += th) {
          for (let x = -canvas.width; x < canvas.width * 2; x += tw) {
            ctx.fillText(text, x - canvas.width / 2, y - canvas.height / 2);
          }
        }
        ctx.restore();
      } else {
        const metrics = ctx.measureText(text);
        const tw = metrics.width;
        const padding = 30;
        let x = padding;
        let y = padding + fontSize;

        switch (position) {
          case 'top-right':
            x = canvas.width - tw - padding;
            break;
          case 'bottom-left':
            y = canvas.height - padding;
            break;
          case 'bottom-right':
            x = canvas.width - tw - padding;
            y = canvas.height - padding;
            break;
          case 'center':
            x = (canvas.width - tw) / 2;
            y = (canvas.height + fontSize) / 2;
            break;
        }

        ctx.save();
        ctx.translate(x + tw / 2, y - fontSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(text, -tw / 2, fontSize / 2);
        ctx.restore();
      }
    } else if (watermarkType === 'image' && watermarkImg) {
      const wmScale = Math.min(image.img.width / 4, image.img.height / 4) / Math.max(watermarkImg.width, watermarkImg.height);
      const wmW = watermarkImg.width * wmScale;
      const wmH = watermarkImg.height * wmScale;

      if (position === 'tile') {
        const paddingX = wmW + 40;
        const paddingY = wmH + 40;
        for (let y = 0; y < canvas.height + paddingY; y += paddingY) {
          for (let x = 0; x < canvas.width + paddingX; x += paddingX) {
            ctx.drawImage(watermarkImg, x, y, wmW, wmH);
          }
        }
      } else {
        const padding = 30;
        let x = padding;
        let y = padding;

        switch (position) {
          case 'top-right':
            x = canvas.width - wmW - padding;
            break;
          case 'bottom-left':
            y = canvas.height - wmH - padding;
            break;
          case 'bottom-right':
            x = canvas.width - wmW - padding;
            y = canvas.height - wmH - padding;
            break;
          case 'center':
            x = (canvas.width - wmW) / 2;
            y = (canvas.height - wmH) / 2;
            break;
        }
        ctx.drawImage(watermarkImg, x, y, wmW, wmH);
      }
    }

    ctx.globalAlpha = 1;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(canvas.toDataURL('image/png'));
  }, [image, watermarkType, text, fontSize, fontColor, opacity, rotation, position, watermarkImg, previewUrl]);

  useEffect(() => {
    if (image) {
      generateWatermark();
    }
  }, [image, watermarkType, text, fontSize, fontColor, opacity, rotation, position, watermarkImg]);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const img = new Image();
    img.onload = () => {
      setImage({ file, img, preview: URL.createObjectURL(file) });
    };
    img.src = URL.createObjectURL(file);
  }, []);

  const handleWatermarkImg = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const img = new Image();
    img.onload = () => setWatermarkImg(img);
    img.src = URL.createObjectURL(files[0]);
  }, []);

  const download = () => {
    if (!previewUrl || !image) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = image.file.name.replace(/\.[^.]+$/, '_watermarked.png');
    a.click();
  };

  const positionLabels: Record<Position, string> = {
    'top-left': '左上角',
    'top-right': '右上角',
    'bottom-left': '左下角',
    'bottom-right': '右下角',
    center: '居中',
    tile: '平铺',
  };

  return (
    <ToolPage
      icon="💧"
      title="水印添加"
      description="为图片添加自定义文字或图片水印，支持位置、透明度、旋转等设置。"
    >
      <div className="space-y-6">
        {!image ? (
          <ImageUploader onFiles={handleFiles} label="拖拽图片到此处，或点击选择文件" sublabel="支持 PNG、JPG、WebP 格式" />
        ) : (
          <>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 md:p-6 space-y-4">
              {/* Watermark type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">水印类型</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWatermarkType('text')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      watermarkType === 'text'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    文字水印
                  </button>
                  <button
                    onClick={() => setWatermarkType('image')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      watermarkType === 'image'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    图片水印
                  </button>
                </div>
              </div>

              {/* Text settings */}
              {watermarkType === 'text' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">水印文字</label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">字体大小: {fontSize}px</label>
                    <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">字体颜色</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                      <span className="text-sm text-gray-500">{fontColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">透明度: {opacity}%</label>
                    <input type="range" min={1} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">旋转角度: {rotation}°</label>
                    <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full" />
                  </div>
                </div>
              )}

              {/* Image watermark upload */}
              {watermarkType === 'image' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">水印图片</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) handleWatermarkImg(Array.from(e.target.files));
                      }}
                      className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">透明度: {opacity}%</label>
                    <input type="range" min={1} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
                  </div>
                </div>
              )}

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">水印位置</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(positionLabels) as [Position, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setPosition(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        position === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {previewUrl && (
                  <button onClick={download} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    下载
                  </button>
                )}
                <button
                  onClick={() => { setImage(null); setWatermarkImg(null); setPreviewUrl(null); }}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  重新选择
                </button>
              </div>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">预览</h3>
                <div className="flex justify-center">
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-96 rounded-lg" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPage>
  );
}
