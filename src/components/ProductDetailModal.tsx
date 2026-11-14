import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductSvgThumbnail } from './ProductSvgThumbnail';
import { MultiImageInput } from './MultiImageInput';
import { 
  X, CheckCircle, Phone, Wrench, FileText, 
  Send, Sparkles, Edit3, ChevronLeft, ChevronRight, Image as ImageIcon 
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    companyInfo, 
    submitInquiry, 
    isAdmin, 
    setIsAdminModalOpen,
    updateProduct
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Gallery state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showImageManager, setShowImageManager] = useState(false);

  useEffect(() => {
    setActiveImageIdx(0);
    setShowImageManager(false);
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const productImages: string[] = Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
    ? selectedProduct.images.filter(Boolean)
    : selectedProduct.imageUrl
    ? [selectedProduct.imageUrl]
    : [];

  const currentImageUrl = productImages[activeImageIdx] || productImages[0] || selectedProduct.imageUrl;

  const handleUpdateImagesInline = (newImgs: string[]) => {
    updateProduct(selectedProduct.id, {
      images: newImgs,
      imageUrl: newImgs[0] || undefined
    });
    if (activeImageIdx >= newImgs.length) {
      setActiveImageIdx(Math.max(0, newImgs.length - 1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    submitInquiry(
      customerName,
      phone,
      address,
      note || `Yêu cầu báo giá sản phẩm: ${selectedProduct.name}`,
      selectedProduct.name
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCustomerName('');
      setPhone('');
      setAddress('');
      setNote('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-emerald-700">{selectedProduct.brand}</span>
            <span aria-hidden="true">/</span>
            <span className="font-mono">{selectedProduct.sku}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setShowImageManager(!showImageManager)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{showImageManager ? 'Đóng quản lý ảnh' : `Thêm / Sửa Ảnh (${productImages.length})`}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsAdminModalOpen(true);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors flex items-center gap-1"
                  title="Sửa sản phẩm này trong kho"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa kho</span>
                </button>
              </>
            )}
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Admin Inline Multi-Image Uploader */}
          {isAdmin && showImageManager && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
              <MultiImageInput
                images={productImages}
                onChange={handleUpdateImagesInline}
                label={`Quản Lý Hình Ảnh Sản Phẩm: ${selectedProduct.name}`}
                helperText="Tải nhiều ảnh từ máy tính / điện thoại hoặc dán link ảnh. Thay đổi được lưu tự động ngay lập tức."
              />
            </div>
          )}

          {/* Main Hero Showcase inside Modal */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Visual Thumbnail + Multi-Image Gallery */}
            <div className="md:col-span-5 space-y-2.5">
              <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-4/3 relative group">
                <ProductSvgThumbnail
                  type={selectedProduct.svgType}
                  imageUrl={currentImageUrl}
                  name={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-bold text-emerald-800 shadow-xs border border-slate-200">
                  Bảo hành: {selectedProduct.warrantyYears} năm
                </div>

                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === 0 ? productImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-colors"
                      title="Ảnh trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIdx((prev) =>
                          prev === productImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-colors"
                      title="Ảnh tiếp theo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/75 text-white text-[11px] font-mono">
                      {activeImageIdx + 1} / {productImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails Strip */}
              {productImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {productImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIdx === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30 opacity-100'
                          : 'border-slate-200 opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${selectedProduct.name} - ảnh ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Highlights */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading leading-tight">
                  {selectedProduct.name}
                </h2>

                {/* Stock status info */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                    <CheckCircle className="w-4 h-4" />
                    <span>Hiện có: <strong className="font-mono-nums">{selectedProduct.stock}</strong> {selectedProduct.unit} tại kho Hóc Môn</span>
                  </div>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">Xuất xứ: {selectedProduct.origin}</span>
                </div>

                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {selectedProduct.fullDesc || selectedProduct.shortDesc}
                </p>
              </div>

              {/* Direct Zalo & Hotline Quote Banner */}
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      Liên hệ báo giá &amp; kiểm tra hàng tại Kho tổng:
                    </span>
                    <span className="text-xs text-slate-600">
                      Tư vấn kỹ thuật và chiết khấu đại lý tốt nhất
                    </span>
                  </div>

                  <a
                    href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hotline/Zalo: {companyInfo.hotlineZalo}</span>
                  </a>
                </div>
                <div className="pt-2 border-t border-emerald-200/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700">
                  <span className="truncate">
                    <strong>Địa chỉ kho:</strong> {companyInfo.warehouseAddress}
                  </span>
                  <a
                    href={companyInfo.warehouseMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline shrink-0"
                  >
                    Bản đồ Kho tổng &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Bảng Thông Số Kỹ Thuật Chi Tiết</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <tbody>
                  {(Array.isArray(selectedProduct.specs) ? selectedProduct.specs : []).map((spec, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}
                    >
                      <td className="py-2.5 px-4 font-medium text-slate-600 w-1/3 border-b border-slate-100">
                        {spec?.label}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 font-mono-nums border-b border-slate-100">
                        {spec?.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Highlights & Advantages */}
          {selectedProduct.highlights && selectedProduct.highlights.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Ưu Điểm Nổi Bật Của Thiết Bị</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProduct.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-World Applications */}
          {selectedProduct.applications && selectedProduct.applications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Ứng Dụng Thực Tế Trong Công Trình</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedProduct.applications.map((app, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Request Quote Form */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Gửi Yêu Cầu Nhận Báo Giá Thiết Bị Này
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Chuyên viên kỹ thuật của Đức Vinh Solar sẽ gọi lại ngay để tư vấn chiết khấu và sơ đồ lắp đặt:
            </p>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Đã gửi thành công! Kỹ sư của Đức Vinh Solar sẽ liên hệ với quý khách trong ít phút.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Anh Vinh"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Số Điện Thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0938288876"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Địa Chỉ Công Trình / Lắp Đặt
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Hóc Môn, TP.HCM"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ghi Chú Nhu Cầu
                    </label>
                    <input
                      type="text"
                      placeholder="Số lượng cần mua, diện tích mái..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Yêu Cầu Báo Giá Sản Phẩm Này</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Hotline kỹ thuật: <strong className="text-slate-800 font-mono">{companyInfo.hotlineZalo}</strong>
          </span>
          <button
            onClick={() => setSelectedProduct(null)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
