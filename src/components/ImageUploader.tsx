'use client';

import { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  maxFiles?: number;
  label?: string;
  sublabel?: string;
}

export default function ImageUploader({
  accept = 'image/*',
  multiple = false,
  onFiles,
  maxFiles,
  label = '拖拽图片到此处，或点击选择文件',
  sublabel = '支持 PNG、JPG、WebP、BMP、GIF 格式',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
      if (maxFiles) {
        onFiles(files.slice(0, maxFiles));
      } else {
        onFiles(files);
      }
    },
    [onFiles, maxFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer
        transition-all duration-200
        ${isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-medium text-gray-700 dark:text-gray-200">{label}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{sublabel}</p>
        </div>
        {multiple && (
          <span className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            支持多文件上传
          </span>
        )}
      </div>
    </div>
  );
}
