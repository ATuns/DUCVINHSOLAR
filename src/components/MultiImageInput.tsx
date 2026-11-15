import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Link as LinkIcon, Trash2, Star, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MultiImageInputProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  label?: string;
  helperText?: string;
}

/**
 * Compress and resize an uploaded image file using HTML5 canvas
 * so multiple photos can be stored and synced in Firestore (1MB doc limit)
 * and localStorage without hitting quota limits.
 */
const compressImageFile = (file: File, maxDimension = 720, quality = 0.65): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Không đọc được file'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const renderAtScale = (maxDim: number, q: number): string => {
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, width);
            canvas.height = Math.max(1, height);
            const ctx = canvas.getContext('2d');
            if (!ctx) return result;
            // Fill white background for transparent PNGs converted to JPEG
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', q);
          };

          let compressedDataUrl = renderAtScale(maxDimension, quality);
          // If still larger than ~85KB in base64, step down once more so 10+ photos fit in 1 Firestore doc
          if (compressedDataUrl.length > 85000) {
            compressedDataUrl = renderAtScale(560, 0.55);
          }
          if (compressedDataUrl.length > 65000) {
            compressedDataUrl = renderAtScale(460, 0.5);
          }
          resolve(compressedDataUrl);
        } catch {
          resolve(result);
        }
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => reject(new Error('Lỗi đọc file ảnh'));
    reader.readAsDataURL(file);
  });
};

export const MultiImageInput: React.FC<MultiImageInputProps> = ({
  images,
  onChange,
  label = 'Danh Sách Hình Ảnh (Tải nhiều file từ máy hoặc dán Link ảnh)',
  helperText = 'Có thể chọn nhiều ảnh cùng lúc từ máy tính / điện thoại hoặc dán nhiều đường dẫn URL. Ảnh đầu tiên sẽ là ảnh đại diện chính.'
}) => {
  const { requestConfirm } = useApp();
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const handleAddUrl = () => {
    const raw = urlInput.trim();
    if (!raw) return;

    // Support pasting multiple links separated by commas or newlines
    const urls = raw
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(Boolean);

    if (urls.length > 0) {
      onChange([...safeImages, ...urls]);
      setUrlInput('');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    try {
      const filesArray = Array.from(fileList);
      const uploadedUrls: string[] = [];
      for (const file of filesArray) {
        if (!file.type.startsWith('image/')) continue;
        // Use higher resolution (1200px, 0.80 quality) for crisp studio display;
        // if Vercel Blob is active it returns a fast CDN URL, otherwise falls back to compressed Data URL
        const compressedDataUrl = await compressImageFile(file, 1100, 0.78);
        try {
          const res = await fetch('/api/blob/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name || `solar-${Date.now()}.jpg`,
              contentType: 'image/jpeg',
              dataUrl: compressedDataUrl
            })
          });
          if (res.ok) {
            const payload = await res.json();
            if (payload && typeof payload.url === 'string' && payload.url) {
              uploadedUrls.push(payload.url);
              continue;
            }
          }
        } catch {
          // Fallback to local compressed Data URL if offline
        }
        uploadedUrls.push(compressedDataUrl);
      }
      if (uploadedUrls.length > 0) {
        onChange([...safeImages, ...uploadedUrls]);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    requestConfirm(
      'Bạn chắc chắn muốn xóa hình ảnh này hay không?',
      () => {
        onChange(safeImages.filter((_, i) => i !== index));
      }
    );
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0 || index < 0 || index >= safeImages.length) return;
    const picked = safeImages[index];
    const rest = safeImages.filter((_, i) => i !== index);
    onChange([picked, ...rest]);
  };

  return (
    <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200">
      <div>
        <label className="block text-xs font-bold text-slate-800">
          {label} ({safeImages.length} ảnh)
        </label>
        <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
      </div>

      {/* Controls: Upload Files + Add Link */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
        {/* Upload Multiple Files Button */}
        <div className="sm:col-span-5">
          <label className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 border-dashed rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Đang xử lý ảnh...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Tải Ảnh Từ Máy (Chọn Nhiều)</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Paste Image URL Input */}
        <div className="sm:col-span-7 flex items-center gap-1.5">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="Dán link ảnh (https://...) rồi nhấn Thêm Link"
              className="w-full pl-8 pr-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Link</span>
          </button>
        </div>
      </div>

      {/* Preview Grid of Images */}
      {safeImages.length === 0 ? (
        <div className="py-5 px-4 rounded-lg bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center justify-center gap-1 text-slate-400">
          <ImageIcon className="w-6 h-6 text-slate-300" />
          <span className="text-xs">
            Chưa có hình ảnh tải lên (Sẽ hiển thị hình minh họa mặc định nếu để trống)
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
          {safeImages.map((imgSrc, idx) => (
            <div
              key={`${idx}-${imgSrc.slice(0, 24)}`}
              className={`relative group rounded-lg overflow-hidden border bg-slate-100 aspect-4/3 flex flex-col justify-between ${
                idx === 0
                  ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                  : 'border-slate-200'
              }`}
            >
              <img
                src={imgSrc}
                alt={`Ảnh ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Top Badge */}
              <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1">
                {idx === 0 ? (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Ảnh chính</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="px-1.5 py-0.5 rounded bg-slate-900/75 hover:bg-emerald-600 text-white text-[10px] font-medium transition-colors"
                    title="Đặt làm ảnh đại diện chính"
                  >
                    Đặt làm chính
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
