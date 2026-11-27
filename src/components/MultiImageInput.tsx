import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  Link as LinkIcon,
  Trash2,
  Star,
  Plus,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

interface MultiImageInputProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  label?: string;
  helperText?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

interface PreparedImage {
  blob: Blob;
  contentType: string;
  filename: string;
}

const IMAGE_EXT_REGEX = /\.(jpe?g|png|webp|gif|bmp|avif|svg|jfif|ico|heic|heif|tiff?)$/i;
const SAFE_RAW_WEB_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif'
]);

const isLikelyImageFile = (file: File): boolean => {
  if (file.type && file.type.toLowerCase().startsWith('image/')) return true;
  if (file.name && IMAGE_EXT_REGEX.test(file.name)) return true;
  return false;
};

const replaceFilenameExtension = (name: string, newExt: string): string => {
  const base = (name || `solar-${Date.now()}`).replace(/\.[^.]+$/, '');
  return `${base}${newExt}`;
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result.startsWith('data:')) {
        resolve(reader.result);
      } else {
        reject(new Error('Không thể chuyển đổi dữ liệu ảnh.'));
      }
    };
    reader.onerror = () => reject(new Error('Lỗi đọc dữ liệu ảnh.'));
    reader.readAsDataURL(blob);
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> =>
  new Promise((resolve) => {
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob((b) => resolve(b), mimeType, quality);
      return;
    }
    try {
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const parts = dataUrl.split(',');
      const bin = atob(parts[1] || '');
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      resolve(new Blob([bytes], { type: mimeType }));
    } catch {
      resolve(null);
    }
  });

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Trình duyệt không giải mã được tệp ảnh này.'));
    img.src = src;
  });

/**
 * Resize and compress uploaded image cleanly using Object URL + Canvas
 * so photos stay crisp (up to 1400px) while comfortably fitting within Vercel Blob/API limits.
 */
const prepareImageForUpload = async (file: File): Promise<PreparedImage> => {
  const rawType = (file.type || '').toLowerCase();
  const rawName = file.name || `product-${Date.now()}.jpg`;

  // Keep SVG and small animated GIF files intact without canvas flattening
  if ((rawType === 'image/svg+xml' || rawType === 'image/gif') && file.size <= 3 * 1024 * 1024) {
    return {
      blob: file,
      contentType: rawType,
      filename: rawName
    };
  }

  let objectUrl = '';
  try {
    let img: HTMLImageElement;
    try {
      objectUrl = URL.createObjectURL(file);
      img = await loadImageElement(objectUrl);
    } catch {
      // Fallback to FileReader if Object URL decoding fails
      const rawDataUrl = await blobToDataUrl(file);
      img = await loadImageElement(rawDataUrl);
    }

    const naturalWidth = img.naturalWidth || img.width || 0;
    const naturalHeight = img.naturalHeight || img.height || 0;
    if (naturalWidth <= 0 || naturalHeight <= 0) {
      throw new Error('Kích thước ảnh không hợp lệ.');
    }

    // If original PNG/WebP/JPG is already compact and within 1400px, preserve original quality/transparency
    const isStandardWeb =
      SAFE_RAW_WEB_TYPES.has(rawType) &&
      rawType !== 'image/svg+xml' &&
      rawType !== 'image/gif';
    if (
      isStandardWeb &&
      file.size <= 1.2 * 1024 * 1024 &&
      naturalWidth <= 1400 &&
      naturalHeight <= 1400
    ) {
      return {
        blob: file,
        contentType: rawType === 'image/jpg' ? 'image/jpeg' : rawType,
        filename: rawName
      };
    }

    const renderCandidate = async (
      maxDim: number,
      mimeType: string,
      quality: number,
      fillWhite: boolean
    ): Promise<Blob | null> => {
      let width = naturalWidth;
      let height = naturalHeight;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.max(1, Math.round((height * maxDim) / width));
          width = maxDim;
        } else {
          width = Math.max(1, Math.round((width * maxDim) / height));
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      if (fillWhite) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      return await canvasToBlob(canvas, mimeType, quality);
    };

    const preferWebpOrPng = rawType === 'image/png' || rawType === 'image/webp';
    const steps: Array<{ dim: number; mime: string; q: number; white: boolean; ext: string }> =
      preferWebpOrPng
        ? [
            { dim: 1400, mime: 'image/webp', q: 0.86, white: false, ext: '.webp' },
            { dim: 1200, mime: 'image/jpeg', q: 0.84, white: true, ext: '.jpg' },
            { dim: 960, mime: 'image/jpeg', q: 0.76, white: true, ext: '.jpg' }
          ]
        : [
            { dim: 1400, mime: 'image/jpeg', q: 0.85, white: true, ext: '.jpg' },
            { dim: 1100, mime: 'image/jpeg', q: 0.78, white: true, ext: '.jpg' },
            { dim: 850, mime: 'image/jpeg', q: 0.7, white: true, ext: '.jpg' }
          ];

    let bestBlob: Blob | null = null;
    let bestMime = 'image/jpeg';
    let bestExt = '.jpg';

    for (const step of steps) {
      const candidate = await renderCandidate(step.dim, step.mime, step.q, step.white);
      if (candidate && candidate.size > 0) {
        bestBlob = candidate;
        bestMime = candidate.type || step.mime;
        bestExt = bestMime === 'image/webp' ? '.webp' : '.jpg';
        if (candidate.size <= 1.8 * 1024 * 1024) {
          break;
        }
      }
    }

    if (!bestBlob) {
      throw new Error('Không thể nén ảnh bằng trình duyệt.');
    }

    return {
      blob: bestBlob,
      contentType: bestMime,
      filename: replaceFilenameExtension(rawName, bestExt)
    };
  } catch (decodeErr) {
    // If browser couldn't canvas-decode (e.g. odd EXIF), allow raw upload only for standard web images <= 3MB
    if (
      (SAFE_RAW_WEB_TYPES.has(rawType) || /\.(jpe?g|png|webp|gif|jfif)$/i.test(rawName)) &&
      file.size > 0 &&
      file.size <= 3 * 1024 * 1024
    ) {
      return {
        blob: file,
        contentType: rawType && rawType.startsWith('image/') ? rawType : 'image/jpeg',
        filename: rawName
      };
    }
    if (/\.heic$|\.heif$/i.test(rawName) || rawType.includes('heic') || rawType.includes('heif')) {
      throw new Error(
        `Ảnh "${rawName}" có định dạng HEIC chưa được trình duyệt hỗ trợ. Vui lòng chuyển sang JPG hoặc PNG rồi tải lại.`
      );
    }
    throw decodeErr instanceof Error
      ? decodeErr
      : new Error(`Không thể xử lý tệp ảnh "${rawName}".`);
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
};

/**
 * Upload a prepared image blob to `/api/blob/upload`:
 * 1) Try raw binary upload (zero base64 overhead, fastest)
 * 2) Fallback to JSON `{ filename, contentType, dataUrl }` if binary returns 400/415 or fails
 */
const uploadPreparedImageToServer = async (prepared: PreparedImage): Promise<string> => {
  const tryBinary = async (): Promise<{ url?: string; error?: string; status?: number }> => {
    const query = `filename=${encodeURIComponent(prepared.filename)}&contentType=${encodeURIComponent(
      prepared.contentType
    )}`;
    const res = await fetch(`/api/blob/upload?${query}`, {
      method: 'POST',
      headers: {
        'Content-Type': prepared.contentType || 'application/octet-stream',
        'X-Filename': encodeURIComponent(prepared.filename)
      },
      body: prepared.blob
    });
    const payload = await res.json().catch(() => null);
    if (res.ok && payload && typeof payload.url === 'string' && payload.url) {
      return { url: payload.url };
    }
    return {
      status: res.status,
      error:
        (payload && typeof payload.error === 'string' && payload.error) ||
        `Máy chủ trả về mã lỗi ${res.status}`
    };
  };

  const tryJsonBase64 = async (): Promise<{ url?: string; error?: string; status?: number }> => {
    const dataUrl = await blobToDataUrl(prepared.blob);
    const res = await fetch('/api/blob/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: prepared.filename,
        contentType: prepared.contentType,
        dataUrl
      })
    });
    const payload = await res.json().catch(() => null);
    if (res.ok && payload && typeof payload.url === 'string' && payload.url) {
      return { url: payload.url };
    }
    return {
      status: res.status,
      error:
        (payload && typeof payload.error === 'string' && payload.error) ||
        `Máy chủ trả về mã lỗi ${res.status}`
    };
  };

  let lastError = 'Không thể tải ảnh lên máy chủ.';

  try {
    const binResult = await tryBinary();
    if (binResult.url) return binResult.url;
    if (binResult.error) lastError = binResult.error;
  } catch (err: any) {
    lastError = err?.message || lastError;
  }

  // Fallback to JSON base64 upload (handles proxies/serverless environments that expect JSON)
  try {
    const jsonResult = await tryJsonBase64();
    if (jsonResult.url) return jsonResult.url;
    if (jsonResult.error) lastError = jsonResult.error;
  } catch (err: any) {
    lastError = err?.message || lastError;
  }

  throw new Error(lastError);
};

export const MultiImageInput: React.FC<MultiImageInputProps> = ({
  images,
  onChange,
  label = 'Danh Sách Hình Ảnh (Tải nhiều file từ máy hoặc dán Link ảnh)',
  helperText = 'Có thể chọn nhiều ảnh từ máy tính / điện thoại, kéo thả hoặc dán (Ctrl+V). Ảnh đầu tiên sẽ là ảnh đại diện chính.',
  onUploadingChange
}) => {
  const { requestConfirm } = useApp();
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [brokenIndices, setBrokenIndices] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const latestImagesRef = useRef<string[]>(safeImages);
  latestImagesRef.current = safeImages;

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const setUploadingState = (uploading: boolean) => {
    setIsUploading(uploading);
    onUploadingChange?.(uploading);
  };

  const handleAddUrl = () => {
    const raw = urlInput.trim();
    if (!raw) return;

    setUploadError(null);
    setUploadSuccess(null);

    // Support pasting multiple links separated by commas or newlines
    const urls = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (urls.length > 0) {
      onChange([...latestImagesRef.current, ...urls]);
      setUrlInput('');
      setUploadSuccess(`Đã thêm ${urls.length} đường dẫn ảnh.`);
    }
  };

  const processFiles = async (filesArray: File[]) => {
    if (filesArray.length === 0) return;

    setUploadError(null);
    setUploadSuccess(null);
    setUploadingState(true);

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    try {
      const validFiles: File[] = [];
      for (const file of filesArray) {
        if (!isLikelyImageFile(file)) {
          errors.push(`"${file.name || 'Tệp'}" không phải tệp hình ảnh hợp lệ.`);
          continue;
        }
        validFiles.push(file);
      }

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress(
          validFiles.length > 1
            ? `Đang tải lên ảnh ${i + 1}/${validFiles.length}...`
            : 'Đang nén & tải ảnh lên máy chủ...'
        );
        try {
          const prepared = await prepareImageForUpload(file);
          const uploadedUrl = await uploadPreparedImageToServer(prepared);
          uploadedUrls.push(uploadedUrl);
        } catch (err: any) {
          const reason = err?.message || 'Lỗi tải ảnh lên máy chủ';
          errors.push(`${file.name ? `"${file.name}": ` : ''}${reason}`);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...latestImagesRef.current, ...uploadedUrls]);
        setUploadSuccess(
          `Đã tải lên ${uploadedUrls.length} ảnh thành công!${
            latestImagesRef.current.length > 0
              ? ' Bấm "Đặt làm chính" nếu muốn dùng làm ảnh đại diện.'
              : ''
          }`
        );
      }

      if (errors.length > 0) {
        setUploadError(errors.join(' '));
      }
    } finally {
      setUploadProgress('');
      setUploadingState(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    await processFiles(Array.from(fileList));
  };

  const handleOpenFilePicker = () => {
    if (isUploading) return;
    if (fileInputRef.current) {
      // Clear value first so selecting the exact same file twice always fires onChange
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUploading) return;
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    if (droppedFiles.length > 0) {
      await processFiles(droppedFiles);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (isUploading) return;
    const items = Array.from(e.clipboardData?.items || []);
    const pastedImages: File[] = [];
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const f = item.getAsFile();
        if (f) pastedImages.push(f);
      }
    }
    if (pastedImages.length > 0) {
      e.preventDefault();
      await processFiles(pastedImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    requestConfirm(
      'Bạn chắc chắn muốn xóa hình ảnh này hay không?',
      () => {
        onChange(latestImagesRef.current.filter((_, i) => i !== index));
      }
    );
  };

  const handleSetPrimary = (index: number) => {
    const current = latestImagesRef.current;
    if (index === 0 || index < 0 || index >= current.length) return;
    const picked = current[index];
    const rest = current.filter((_, i) => i !== index);
    onChange([picked, ...rest]);
    setUploadSuccess('Đã đặt làm ảnh đại diện chính!');
  };

  return (
    <div
      onPaste={handlePaste}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isUploading) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={`space-y-3 bg-white p-3.5 rounded-xl border transition-colors ${
        isDragging ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20' : 'border-slate-200'
      }`}
    >
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.jfif,.bmp,.avif,.svg"
            multiple
            disabled={isUploading}
            onChange={handleFileChange}
            className="sr-only"
            tabIndex={-1}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={handleOpenFilePicker}
            className={`w-full py-2.5 px-3 border border-dashed rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              isUploading
                ? 'bg-emerald-100/70 text-emerald-700 border-emerald-300 cursor-wait'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-400 cursor-pointer'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                <span className="truncate">{uploadProgress || 'Đang tải ảnh lên...'}</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tải Ảnh Từ Máy (Chọn Nhiều)</span>
              </>
            )}
          </button>
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
              className="w-full pl-8 pr-2.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Link</span>
          </button>
        </div>
      </div>

      {/* Upload Feedback Banners */}
      {uploadError && (
        <div className="flex items-start justify-between gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="p-0.5 text-rose-500 hover:text-rose-800 shrink-0"
            aria-label="Đóng thông báo lỗi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {uploadSuccess && !uploadError && (
        <div className="flex items-start justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{uploadSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadSuccess(null)}
            className="p-0.5 text-emerald-600 hover:text-emerald-900 shrink-0"
            aria-label="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Preview Grid of Images */}
      {safeImages.length === 0 ? (
        <button
          type="button"
          onClick={handleOpenFilePicker}
          disabled={isUploading}
          className="w-full py-5 px-4 rounded-lg bg-slate-50 hover:bg-emerald-50/50 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center gap-1 text-slate-500 transition-colors cursor-pointer"
        >
          <ImageIcon className="w-6 h-6 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">
            Chưa có hình ảnh tải lên — Bấm vào đây hoặc kéo thả ảnh để tải lên
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
          {safeImages.map((imgSrc, idx) => {
            const imgKey = `${idx}-${imgSrc.slice(0, 64)}`;
            const isBroken = Boolean(brokenIndices[imgKey]);
            return (
              <div
                key={imgKey}
                className={`relative group rounded-lg overflow-hidden border bg-slate-100 aspect-4/3 flex flex-col justify-between ${
                  idx === 0
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                    : 'border-slate-200'
                }`}
              >
                {isBroken ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-rose-50 text-rose-600">
                    <AlertCircle className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold leading-tight">
                      Lỗi hiển thị ảnh
                    </span>
                  </div>
                ) : (
                  <img
                    src={imgSrc}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full h-full object-contain bg-white p-1"
                    onError={() =>
                      setBrokenIndices((prev) => ({ ...prev, [imgKey]: true }))
                    }
                  />
                )}

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
            );
          })}
        </div>
      )}
    </div>
  );
};
