import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductSvgThumbnail } from './ProductSvgThumbnail';
import { MultiImageInput } from './MultiImageInput';
import {
  X,
  CheckCircle,
  Phone,
  Wrench,
  FileText,
  Send,
  Sparkles,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    companyInfo,
    submitInquiry,
    isAdmin,
    openEditProductInAdmin,
    updateProduct
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Gallery & Fullscreen Lightbox state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showImageManager, setShowImageManager] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    setActiveImageIdx(0);
    setShowImageManager(false);
    setIsZoomOpen(false);
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const productImages: string[] =
    Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
      ? selectedProduct.images.filter(Boolean)
      : selectedProduct.imageUrl
      ? [selectedProduct.imageUrl]
      : [];

  const currentImageUrl =
    productImages[activeImageIdx] || productImages[0] || selectedProduct.imageUrl;

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

  const specsList = Array.isArray(selectedProduct.specs) ? selectedProduct.specs : [];

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-200"
        onClick={() => setSelectedProduct(null)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-slate-200 bg-slate-50/90">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <span className="font-bold text-emerald-700 uppercase">
                Hãng {selectedProduct.brand}
              </span>
              <span aria-hidden="true">/</span>
              <span className="font-mono font-semibold text-slate-700">{selectedProduct.sku}</span>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowImageManager(!showImageManager)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {showImageManager
                        ? 'Đóng quản lý ảnh'
                        : `Thêm / Sửa Ảnh (${productImages.length})`}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const prod = selectedProduct;
                      setSelectedProduct(null);
                      openEditProductInAdmin(prod);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
                    title="Sửa thông tin & thông số sản phẩm này"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa thông số &amp; kho</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-8">
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

            {/* Main Showcase inside Modal: Large 7-col Image Viewer + 5-col Overview & Quick Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              {/* Left Column (7/12): Extra-Large, Crystal-Clear Product Image Studio */}
              <div className="lg:col-span-7 space-y-3">
                <div
                  onClick={() => {
                    if (currentImageUrl) setIsZoomOpen(true);
                  }}
                  className={`bg-white rounded-2xl overflow-hidden border-2 border-slate-200/90 h-[320px] sm:h-[420px] lg:h-[460px] relative group flex items-center justify-center p-3 sm:p-5 shadow-xs ${
                    currentImageUrl ? 'cursor-zoom-in' : ''
                  }`}
                >
                  <ProductSvgThumbnail
                    type={selectedProduct.svgType}
                    imageUrl={currentImageUrl}
                    name={selectedProduct.name}
                    fit="contain"
                    className="w-full h-full max-h-full transition-transform duration-300 group-hover:scale-102"
                  />

                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg text-xs font-bold text-emerald-800 shadow-xs border border-slate-200">
                    Bảo hành chính hãng: {selectedProduct.warrantyYears} năm
                  </div>

                  {currentImageUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomOpen(true);
                      }}
                      className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
                      title="Phóng to hình ảnh toàn màn hình"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Phóng to ảnh</span>
                    </button>
                  )}

                  {productImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIdx((prev) =>
                            prev === 0 ? productImages.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors"
                        title="Ảnh trước"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIdx((prev) =>
                            prev === productImages.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors"
                        title="Ảnh tiếp theo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 right-3.5 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-xs font-mono font-semibold">
                        Ảnh {activeImageIdx + 1} / {productImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Large Thumbnails Strip */}
                {productImages.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {productImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-20 h-16 rounded-xl overflow-hidden border-2 bg-white p-1 shrink-0 transition-all ${
                          activeImageIdx === idx
                            ? 'border-emerald-600 ring-2 ring-emerald-500/30 opacity-100 shadow-xs'
                            : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${selectedProduct.name} - ảnh ${idx + 1}`}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column (5/12): Product Title, Key Summary & Direct Quote Action */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-bold text-emerald-700 uppercase">
                      Hãng {selectedProduct.brand}
                    </span>
                    <span>·</span>
                    <span className="font-mono">Mã SP: {selectedProduct.sku}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading leading-snug">
                    {selectedProduct.name}
                  </h2>

                  {/* Stock & Origin status info */}
                  <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>
                        Sẵn kho: <strong className="font-mono-nums">{selectedProduct.stock}</strong>{' '}
                        {selectedProduct.unit}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      Xuất xứ: <strong>{selectedProduct.origin}</strong>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                    {selectedProduct.fullDesc || selectedProduct.shortDesc}
                  </p>

                  {/* Quick Highlighted Specifications Preview Box right beside the image */}
                  {specsList.length > 0 && (
                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tóm tắt cấu hình ({specsList.length} thông số)</span>
                      </div>
                      <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                        {specsList.map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-200/60 last:border-0"
                          >
                            {spec?.value ? (
                              <>
                                <span className="text-slate-600 font-medium">{spec.label}:</span>
                                <span className="font-bold text-slate-900 font-mono-nums text-right">
                                  {spec.value}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold text-slate-800 flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{spec?.label}</span>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Zalo & Hotline Quote Banner */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/90 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        Liên hệ nhận báo giá sỉ &amp; lẻ tốt nhất:
                      </span>
                      <span className="text-[11px] text-slate-600">
                        Hỗ trợ kỹ thuật và giao hàng nhanh tận công trình
                      </span>
                    </div>

                    <a
                      href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Zalo: {companyInfo.hotlineZalo}</span>
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

            {/* Detailed Technical Specifications Table */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Bảng Cấu Hình &amp; Thông Số Kỹ Thuật Chi Tiết</span>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      const prod = selectedProduct;
                      setSelectedProduct(null);
                      openEditProductInAdmin(prod);
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa nhanh bảng thông số</span>
                  </button>
                )}
              </div>

              {specsList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  Liên hệ Hotline/Zalo {companyInfo.hotlineZalo} để nhận bảng thông số kỹ thuật (Datasheet) chi tiết của sản phẩm này.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <tbody>
                      {specsList.map((spec, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-slate-50/80' : 'bg-white'}
                        >
                          {spec?.value ? (
                            <>
                              <td className="py-3 px-4 font-semibold text-slate-700 w-2/5 border-b border-slate-100">
                                {spec.label}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900 font-mono-nums border-b border-slate-100">
                                {spec.value}
                              </td>
                            </>
                          ) : (
                            <td
                              colSpan={2}
                              className="py-3 px-4 font-semibold text-slate-800 border-b border-slate-100"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                                <span>{spec?.label}</span>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                  <span>
                    Đã gửi thành công! Kỹ sư của Đức Vinh Solar sẽ liên hệ với quý khách trong ít phút.
                  </span>
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
              Hotline kỹ thuật:{' '}
              <strong className="text-slate-800 font-mono">{companyInfo.hotlineZalo}</strong>
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

      {/* Fullscreen High-Resolution Image Lightbox Modal */}
      {isZoomOpen && currentImageUrl && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="w-full max-w-6xl flex items-center justify-between text-white mb-3 px-2">
            <div className="truncate text-sm font-bold">{selectedProduct.name}</div>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Đóng ảnh phóng to</span>
            </button>
          </div>

          <div
            className="relative flex-1 w-full max-w-6xl flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImageUrl}
              alt={selectedProduct.name}
              className="max-w-full max-h-[82vh] object-contain rounded-lg bg-white p-2 shadow-2xl"
              referrerPolicy="no-referrer"
            />

            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((prev) =>
                      prev === 0 ? productImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((prev) =>
                      prev === productImages.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
