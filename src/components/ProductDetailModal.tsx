import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle,
  Phone,
  Send,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  MapPin,
  ArrowRight,
  ZoomIn,
  X
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { normalizeImageUrl } from '../utils/imageUrl';
import { toSentenceCase } from '../utils/formatText';
import { ProductSvgThumbnail } from './ProductSvgThumbnail';

interface ProductDetailModalProps {
  product?: Product | null;
  onClose?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product: propProduct,
  onClose: propOnClose
}) => {
  const {
    products,
    categories,
    selectedProduct,
    openProductPage,
    selectCatalogFilter,
    companyInfo,
    submitInquiry,
    isAdmin,
    openEditProductInAdmin,
    deleteProduct
  } = useApp();

  const product = propProduct !== undefined ? propProduct : selectedProduct;
  const onClose = propOnClose || (() => openProductPage(null));

  const [isContacting, setIsContacting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const allImages: string[] = product
    ? (product.images && product.images.length > 0
        ? product.images
        : product.imageUrl
        ? [product.imageUrl]
        : []
      )
        .filter(Boolean)
        .map((u) => normalizeImageUrl(u))
    : [];

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsContacting(false);
    setIsSubmitted(false);
    setIsZoomOpen(false);
  }, [product?.id]);

  useEffect(() => {
    if (!isZoomOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
      } else if (e.key === 'ArrowRight' && allImages.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      } else if (e.key === 'ArrowLeft' && allImages.length > 1) {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, allImages.length]);

  if (!product) return null;

  const activeCategory = categories.find((c) => c.id === product.category);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const safeIdx =
    allImages.length > 0 ? Math.min(currentImageIndex, allImages.length - 1) : 0;
  const currentImgUrl = allImages[safeIdx];
  const imgFailed = currentImgUrl ? imageLoadError[`${product.id}-${safeIdx}`] : true;

  const nextImage = () => {
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleOpenZoom = () => {
    if (!currentImgUrl || imgFailed) return;
    setIsZoomOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry(
      formData.name,
      formData.phone,
      formData.email,
      formData.message,
      `${product.name} (${product.sku})`
    );
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsContacting(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] py-6 sm:py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Top Bar: Back Button + Breadcrumb + Admin Controls */}
        <div className="mb-6 pb-4 border-b border-[#DEDEDE] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8F8F8] hover:bg-[#FFF2D0] border border-[#DEDEDE] text-[#1C1C1C] font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#FF7C00]" />
              <span>Quay lại danh mục</span>
            </button>

            {activeCategory && (
              <>
                <span className="text-[#DEDEDE]">/</span>
                <button
                  type="button"
                  onClick={() => selectCatalogFilter(activeCategory.id, 'all', true)}
                  className="text-[#747474] hover:text-[#FF7C00] font-semibold transition-colors"
                >
                  {toSentenceCase(activeCategory.label)}
                </button>
              </>
            )}

            {product.brand && (
              <>
                <span className="text-[#DEDEDE]">/</span>
                <button
                  type="button"
                  onClick={() =>
                    selectCatalogFilter(product.category || 'all', product.brand, true)
                  }
                  className="text-[#1C1C1C] hover:text-[#FF7C00] font-bold transition-colors"
                >
                  Hãng {product.brand}
                </button>
              </>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEditProductInAdmin(product)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa sản phẩm</span>
              </button>
              <button
                type="button"
                onClick={() => deleteProduct(product.id, () => onClose())}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>

        {/* Main 2-Column Product Layout: Simple, Clean, Easy to Read */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (5 cols): Clean Image Display with Click-to-Zoom */}
          <div className="lg:col-span-5 space-y-3">
            <div
              onClick={handleOpenZoom}
              className={`group relative rounded-2xl bg-[#F8F8F8] border border-[#DEDEDE] aspect-square flex items-center justify-center p-6 overflow-hidden ${
                currentImgUrl && !imgFailed ? 'cursor-zoom-in' : ''
              }`}
              title={currentImgUrl && !imgFailed ? 'Nhấp vào ảnh để phóng to' : undefined}
            >
              {currentImgUrl && !imgFailed ? (
                <>
                  <img
                    src={currentImgUrl}
                    alt={toSentenceCase(product.name)}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setImageLoadError((prev) => ({
                        ...prev,
                        [`${product.id}-${safeIdx}`]: true
                      }))
                    }
                  />
                  <span className="pointer-events-none absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 border border-[#DEDEDE] text-[#1C1C1C] text-[11px] font-bold inline-flex items-center gap-1.5 shadow-2xs">
                    <ZoomIn className="w-3.5 h-3.5 text-[#FF7C00]" />
                    <span>Nhấp để phóng to</span>
                  </span>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ProductSvgThumbnail
                    type={product.svgType || 'custom'}
                    name={product.name}
                  />
                </div>
              )}

              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#DEDEDE] text-[#1C1C1C] hover:border-[#FFBD00] flex items-center justify-center shadow-xs"
                    title="Ảnh trước"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#DEDEDE] text-[#1C1C1C] hover:border-[#FFBD00] flex items-center justify-center shadow-xs"
                    title="Ảnh tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 bg-[#F8F8F8] p-1 transition-all ${
                      safeIdx === idx
                        ? 'border-[#FFBD00]'
                        : 'border-[#DEDEDE] opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Essential Product Information */}
          <div className="lg:col-span-7 space-y-5">
            {/* Brand + SKU Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#FFBD00] text-[#1C1C1C] text-xs font-extrabold uppercase rounded-lg">
                HÃNG {(product.brand || 'CHÍNH HÃNG').toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-[#F8F8F8] border border-[#DEDEDE] text-[#747474] text-xs font-mono font-semibold rounded-lg">
                Mã SP: {product.sku}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1C1C1C] leading-snug">
              {toSentenceCase(product.name)}
            </h1>

            {/* Short Summary */}
            {product.shortDesc && (
              <p className="text-sm sm:text-base text-[#363636] leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            {/* 2 Simple Summary Boxes */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-3 rounded-xl bg-[#F8F8F8] border border-[#DEDEDE]">
                <div className="text-[11px] text-[#747474] font-medium">Bảo hành</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#1C1C1C] mt-0.5">
                  {product.warrantyYears} năm
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F8F8] border border-[#DEDEDE]">
                <div className="text-[11px] text-[#747474] font-medium">Xuất xứ</div>
                <div className="text-xs sm:text-sm font-extrabold text-[#1C1C1C] mt-0.5 truncate">
                  {product.origin || 'Chính hãng'}
                </div>
              </div>
            </div>

            {/* Clean Technical Specifications Table */}
            {product.specs && product.specs.length > 0 && (
              <div className="border border-[#DEDEDE] rounded-2xl overflow-hidden">
                <div className="bg-[#F8F8F8] px-4 py-2.5 border-b border-[#DEDEDE] text-xs font-extrabold text-[#1C1C1C] uppercase">
                  THÔNG SỐ KỸ THUẬT CHÍNH
                </div>
                <div className="divide-y divide-[#DEDEDE]">
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      className={`px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm ${
                        i % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]/50'
                      }`}
                    >
                      <span className="text-[#747474] font-medium">{spec.label}</span>
                      <span className="text-[#1C1C1C] font-bold text-right ml-4">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white font-extrabold py-3.5 px-5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Chat Zalo báo giá: {companyInfo.hotlineZalo}</span>
              </a>
              <button
                type="button"
                onClick={() => setIsContacting((prev) => !prev)}
                className="flex-1 bg-[#F8F8F8] hover:bg-[#FFF2D0] border border-[#DEDEDE] hover:border-[#FFBD00] text-[#1C1C1C] font-bold py-3.5 px-5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4 text-[#FF7C00]" />
                <span>{isContacting ? 'Đóng khung đặt hàng' : 'Đặt hàng / Yêu cầu báo giá'}</span>
              </button>
            </div>

            {/* Warehouse Address Line */}
            <div className="text-xs text-[#747474] flex items-start gap-2 pt-1">
              <MapPin className="w-4 h-4 text-[#FF7C00] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#1C1C1C]">Kho hàng:</strong>{' '}
                {companyInfo.warehouseAddress || companyInfo.officeAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Simple Inline Quote Form when clicked */}
        {isContacting && (
          <div className="mt-8 bg-[#FEFBF3] border border-[#FFBD00] p-5 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-[#1C1C1C]">
                Yêu cầu báo giá: {toSentenceCase(product.name)}
              </h3>
              <button
                type="button"
                onClick={() => setIsContacting(false)}
                className="p-1 text-[#747474] hover:text-[#1C1C1C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-[#FF7C00] mx-auto mb-2" />
                <p className="text-[#1C1C1C] font-bold">Đã gửi yêu cầu thành công!</p>
                <p className="text-[#747474] text-xs sm:text-sm mt-1">
                  Đức Vinh Solar sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-[#DEDEDE] rounded-xl text-sm text-[#1C1C1C] focus:border-[#FFBD00] outline-none"
                      placeholder="Nhập họ tên của bạn"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                      Số điện thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-[#DEDEDE] rounded-xl text-sm text-[#1C1C1C] focus:border-[#FFBD00] outline-none"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1C1C] mb-1">
                    Địa chỉ nhận hàng hoặc ghi chú số lượng
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-[#DEDEDE] rounded-xl text-sm text-[#1C1C1C] focus:border-[#FFBD00] outline-none"
                    placeholder="Số lượng cần báo giá, địa chỉ giao hàng..."
                  />
                </div>
                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsContacting(false)}
                    className="px-4 py-2 text-xs font-bold text-[#747474] bg-white border border-[#DEDEDE] rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-extrabold bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white rounded-xl transition-colors"
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Simple & Clear Description + Highlights Section */}
        <div className="mt-10 pt-8 border-t border-[#DEDEDE] space-y-8">
          {product.highlights && product.highlights.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#1C1C1C] uppercase mb-3">
                ƯU ĐIỂM NỔI BẬT
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F8F8F8] border border-[#DEDEDE] flex items-start gap-2.5 text-xs sm:text-sm text-[#363636]"
                  >
                    <CheckCircle className="w-4 h-4 text-[#FF7C00] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1C1C1C] uppercase mb-3">
              MÔ TẢ CHI TIẾT SẢN PHẨM
            </h2>
            {product.fullDesc || product.shortDesc ? (
              <div className="text-sm sm:text-base text-[#363636] whitespace-pre-line leading-relaxed">
                {product.fullDesc || product.shortDesc}
              </div>
            ) : (
              <p className="text-sm text-[#747474]">
                Liên hệ trực tiếp Zalo {companyInfo.hotlineZalo} để nhận thông số kỹ thuật (Datasheet) và báo giá tốt nhất.
              </p>
            )}
          </div>
        </div>

        {/* Related Products in the Same Category */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#DEDEDE]">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1C1C1C] uppercase">
                SẢN PHẨM CÙNG DANH MỤC
              </h2>
              <button
                type="button"
                onClick={() => selectCatalogFilter(product.category || 'all', 'all', true)}
                className="text-xs sm:text-sm font-bold text-[#FF7C00] hover:underline inline-flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((relProd) => {
                const relImgs =
                  relProd.images && relProd.images.length > 0
                    ? relProd.images.filter(Boolean)
                    : relProd.imageUrl
                    ? [relProd.imageUrl]
                    : [];
                const relThumb = relImgs[0] ? normalizeImageUrl(relImgs[0]) : '';

                return (
                  <div
                    key={relProd.id}
                    onClick={() => openProductPage(relProd)}
                    className="group cursor-pointer apple-glass-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="relative aspect-4/3 bg-[#F8F8F8] border-b border-[#DEDEDE] flex items-center justify-center p-3 overflow-hidden">
                        {relThumb ? (
                          <img
                            src={relThumb}
                            alt={toSentenceCase(relProd.name)}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ProductSvgThumbnail
                            type={relProd.svgType || 'custom'}
                            name={relProd.name}
                          />
                        )}
                      </div>

                      <div className="p-3">
                        <div className="text-[11px] font-bold text-[#FF7C00] mb-0.5">
                          Hãng {relProd.brand}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#1C1C1C] group-hover:text-[#FF7C00] line-clamp-2 leading-snug transition-colors">
                          {toSentenceCase(relProd.name)}
                        </h3>
                      </div>
                    </div>

                    <div className="px-3 pb-3 pt-1 flex items-center justify-between text-xs text-[#747474]">
                      <span className="font-mono truncate max-w-[110px]">Mã: {relProd.sku}</span>
                      <span className="font-bold text-[#1C1C1C] group-hover:text-[#FF7C00]">
                        Chi tiết &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Simple, Easy-to-Use Full-Screen Image Viewer (Portaled above Header menu) */}
      {isZoomOpen &&
        currentImgUrl &&
        !imgFailed &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
            onClick={() => setIsZoomOpen(false)}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10 px-4 py-2 rounded-full bg-white hover:bg-[#FFBD00] text-[#1C1C1C] text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5 shadow-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Đóng ảnh</span>
            </button>

            {/* Main Large Image Container (Click image or outside to close) */}
            <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
              <img
                src={currentImgUrl}
                alt={toSentenceCase(product.name)}
                onClick={() => setIsZoomOpen(false)}
                className="max-w-full max-h-[88vh] object-contain bg-white rounded-2xl p-3 sm:p-6 shadow-2xl cursor-zoom-out"
                referrerPolicy="no-referrer"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#FFBD00] text-[#1C1C1C] flex items-center justify-center shadow-lg transition-colors"
                    title="Ảnh trước"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#FFBD00] text-[#1C1C1C] flex items-center justify-center shadow-lg transition-colors"
                    title="Ảnh tiếp theo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
