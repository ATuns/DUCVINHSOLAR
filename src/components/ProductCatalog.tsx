import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ProductSvgThumbnail } from './ProductSvgThumbnail';
import { MountReveal, ScrollReveal, EXPO_EASE } from './MotionPrimitives';
import { toSentenceCase } from '../utils/formatText';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Eye,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Image as ImageIcon,
  ListOrdered
} from 'lucide-react';

const PRODUCTS_PER_PAGE = 9;

// Helper to remove Vietnamese diacritics for accurate, accent-insensitive search
const normalizeVietnamese = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper to generate compact page items: [1, 2, 3, '...', N]
const getCompactPageItems = (current: number, total: number): (number | string)[] => {
  if (total <= 4) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 2) {
    return [1, 2, 3, 'ellipsis-end', total];
  }
  if (current === 3) {
    if (total === 5) return [1, 2, 3, 4, 5];
    return [1, 2, 3, 4, 'ellipsis-end', total];
  }
  if (current >= total - 1) {
    return [1, 'ellipsis-start', total - 2, total - 1, total];
  }
  if (current === total - 2) {
    return [1, 'ellipsis-start', total - 3, total - 2, total - 1, total];
  }
  return [1, 'ellipsis-start', current - 1, current, current + 1, 'ellipsis-end', total];
};

export const ProductCatalog: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    selectCatalogFilter,
    setSelectedProduct,
    isAdmin,
    openAdminTab,
    openEditProductInAdmin,
    openPageOneOrderInAdmin,
    deleteProduct
  } = useApp();

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [productPage, setProductPage] = useState<number>(1);

  // Reset product page when category or brand changes from the top Header MENU
  useEffect(() => {
    setProductPage(1);
  }, [selectedCategory, selectedBrand]);

  const scrollToResults = () => {
    const el = document.getElementById('product-results-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExecuteSearch = () => {
    const trimmed = searchInput.trim();
    setSearchQuery(trimmed);
    setProductPage(1);
    if (trimmed !== '') {
      setSelectedCategory('all');
      setSelectedBrand('all');
    }
    scrollToResults();
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setProductPage(1);
  };

  // Compute filtered products based on committed searchQuery (only after clicking "Tìm")
  const filteredProducts = useMemo(() => {
    const rawQ = searchQuery.toLowerCase().trim();
    const normQ = normalizeVietnamese(searchQuery);
    const queryTokens = normQ ? normQ.split(' ').filter(Boolean) : [];

    return (products || [])
      .filter((item) => {
        if (!item) return false;
        const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchBrand =
          selectedBrand === 'all' ||
          (item.brand || '').trim().toLowerCase() === selectedBrand.toLowerCase();

        let matchSearch = true;
        if (rawQ) {
          const catLabelStr = categories.find((c) => c.id === item.category)?.label || '';
          const specsStr = Array.isArray(item.specs)
            ? item.specs.map((s) => `${s?.label || ''} ${s?.value || ''}`).join(' ')
            : '';
          const combinedRaw =
            `${item.name || ''} ${item.brand || ''} ${item.sku || ''} ${catLabelStr} ${item.shortDesc || ''} ${item.fullDesc || ''} ${item.origin || ''} ${specsStr}`.toLowerCase();
          const combinedNorm = normalizeVietnamese(combinedRaw);

          const directMatch = combinedRaw.includes(rawQ) || combinedNorm.includes(normQ);
          const tokenMatch =
            queryTokens.length > 0 &&
            queryTokens.every((tok) => combinedNorm.includes(tok) || combinedRaw.includes(tok));

          matchSearch = directMatch || tokenMatch;
        }

        const matchStock = inStockOnly ? (item.stock ?? 0) > 0 : true;

        return matchCategory && matchBrand && matchSearch && matchStock;
      })
      .map((item, originalIdx) => ({ item, originalIdx }))
      .sort((a, b) => {
        const pinA =
          typeof a.item.pinOrder === 'number' && a.item.pinOrder >= 1 && a.item.pinOrder <= 10
            ? a.item.pinOrder
            : Number.POSITIVE_INFINITY;
        const pinB =
          typeof b.item.pinOrder === 'number' && b.item.pinOrder >= 1 && b.item.pinOrder <= 10
            ? b.item.pinOrder
            : Number.POSITIVE_INFINITY;
        if (pinA !== pinB) return pinA - pinB;
        return a.originalIdx - b.originalIdx;
      })
      .map((entry) => entry.item);
  }, [products, categories, selectedCategory, selectedBrand, searchQuery, inStockOnly]);

  const currentCategoryLabel =
    selectedCategory === 'all'
      ? 'Tất cả thiết bị'
      : toSentenceCase(categories.find((c) => c.id === selectedCategory)?.label || 'Danh mục');

  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safeProductPage = Math.min(productPage, totalProductPages);
  const paginatedProducts = useMemo(() => {
    const start = (safeProductPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safeProductPage]);

  return (
    <section id="products-section" className="pt-4 pb-10 sm:pt-8 sm:pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Compact Welcome & Search Header in Official SolaX Power Theme */}
        <MountReveal y={18} delay={0.04} className="relative z-30">
          <div className="relative z-30 bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-white border border-[#DEDEDE] rounded-3xl sm:rounded-[2rem] p-4 sm:p-7 lg:p-8 text-[#1C1C1C] mb-5 sm:mb-6 shadow-[0_8px_24px_-10px_rgba(28,28,28,0.06)]">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#747474] mb-2">
                  <span className="text-[10px] text-[#1C1C1C]">ĐỨC VINH SOLAR</span>
                  <span aria-hidden="true" className="text-[#B3B3B3]">·</span>
                  <span className="text-[10px] text-[#FF7C00]">DANH MỤC SẢN PHẨM CHÍNH HÃNG</span>
                  <span aria-hidden="true" className="text-[#B3B3B3]">·</span>
                  <span className="text-[10px]">ZALO: 0938288876</span>
                </div>
                <h1 className="text-[18px] sm:text-xl font-extrabold font-heading tracking-tight text-[#1C1C1C] uppercase break-words">
                  DANH MỤC THIẾT BỊ NĂNG LƯỢNG MẶT TRỜI
                </h1>
                <p className="text-[11px] sm:text-xs text-[#747474] mt-1.5 max-w-2xl leading-relaxed break-words">
                  Phân phối sỉ &amp; lẻ tấm pin năng lượng mặt trời, biến tần Inverter, pin lưu trữ Lithium và phụ kiện Solar chính hãng.
                </p>
              </div>

              {/* Quick Search Box + Admin Manage Button */}
              <div className="w-full lg:w-96 shrink-0 flex flex-col gap-2.5 relative min-w-0">
                <div className="relative min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative flex-1 min-w-0">
                      <Search className="w-4 h-4 text-[#FF7C00] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Gõ tên SP, hãng (SolaX, Deye...), công suất..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleExecuteSearch();
                          }
                        }}
                        className="w-full pl-9 pr-12 py-2.5 sm:py-3 text-xs sm:text-sm bg-white text-[#1C1C1C] placeholder:text-[#747474]/70 border border-[#DEDEDE] focus:border-[#FFBD00] rounded-full focus:outline-hidden shadow-2xs font-medium"
                      />
                      {(searchInput || searchQuery) && (
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] bg-[#F8F8F8] hover:bg-rose-50 text-[#747474] hover:text-rose-600 border border-[#DEDEDE] rounded-full font-bold transition-colors"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleExecuteSearch}
                      className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white font-bold text-xs sm:text-sm rounded-full shrink-0 shadow-2xs transition-all flex items-center gap-1.5"
                    >
                      <Search className="w-4 h-4 shrink-0" />
                      <span>Tìm</span>
                    </button>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => openAdminTab('categories-brands')}
                    className="w-full py-2 px-3 bg-white hover:bg-[#FFF2D0] text-[#1C1C1C] border border-[#DEDEDE] hover:border-[#FFBD00] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 shrink-0 text-[#FF7C00]" />
                    <span className="truncate">Quản lý thêm / xóa / sửa loại &amp; hãng</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </MountReveal>

        {/* ================= DANH SÁCH SẢN PHẨM ================= */}
        <div id="product-results-grid">
          {/* Simple Active Filter & Count Bar */}
          <MountReveal y={16} delay={0.12}>
            <div className="bg-[#F8F8F8] border border-[#DEDEDE] rounded-2xl sm:rounded-3xl lg:rounded-full px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-2.5 sm:gap-3 mb-6 shadow-[0_4px_16px_-6px_rgba(28,28,28,0.04)]">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm min-w-0 max-w-full">
                <span className="text-[#1C1C1C] font-bold break-words">
                  {currentCategoryLabel}
                </span>
                <ChevronRight className="w-4 h-4 text-[#B3B3B3] shrink-0" />
                <span className="text-[#FF7C00] font-semibold break-words">
                  {selectedBrand === 'all' ? 'Tất cả hãng' : `Hãng ${selectedBrand}`}
                </span>
                {searchQuery.trim() !== '' && (
                  <>
                    <ChevronRight className="w-4 h-4 text-[#B3B3B3] shrink-0" />
                    <span className="px-2.5 py-0.5 bg-[#FFF2D0] text-[#1C1C1C] border border-[#FFBD00] rounded-full font-bold text-xs break-all">
                      Từ khóa: &ldquo;{searchQuery}&rdquo;
                    </span>
                  </>
                )}
                {(selectedCategory !== 'all' ||
                  selectedBrand !== 'all' ||
                  searchQuery ||
                  inStockOnly) && (
                  <button
                    type="button"
                    onClick={() => {
                      selectCatalogFilter('all', 'all');
                      setSearchInput('');
                      setSearchQuery('');
                      setInStockOnly(false);
                      setProductPage(1);
                    }}
                    className="px-3 py-1 text-xs font-semibold text-[#1C1C1C] hover:bg-[#FFBD00] bg-white border border-[#DEDEDE] rounded-full flex items-center gap-1 transition-all shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0 text-[#FF7C00]" />
                    <span>Xem tất cả</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DEDEDE]">
                {isAdmin && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openPageOneOrderInAdmin()}
                      className="px-3.5 py-1.5 text-xs font-bold text-[#1C1C1C] bg-[#FFF2D0] hover:bg-[#FFBD00] rounded-full flex items-center gap-1 transition-colors border border-[#FFBD00]"
                      title="Tùy chọn & sắp xếp thứ tự 10 sản phẩm đầu tiên trên trang 1"
                    >
                      <ListOrdered className="w-3.5 h-3.5 shrink-0 text-[#1C1C1C]" />
                      <span>Sắp xếp 10 SP trang 1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAdminTab('inventory')}
                      className="px-3.5 py-1.5 text-xs font-bold text-[#1C1C1C] bg-white hover:bg-[#FFF2D0] rounded-full flex items-center gap-1 transition-colors border border-[#DEDEDE]"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0 text-[#FF7C00]" />
                      <span>Thêm / quản lý SP</span>
                    </button>
                  </div>
                )}
                <div className="text-xs text-[#747474]">
                  Hiển thị{' '}
                  <strong className="text-[#FF7C00] font-mono-nums">{filteredProducts.length}</strong>{' '}
                  SP
                  {filteredProducts.length > PRODUCTS_PER_PAGE && (
                    <span>
                      {' '}
                      · Trang{' '}
                      <strong className="text-[#1C1C1C]">
                        {safeProductPage}/{totalProductPages}
                      </strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </MountReveal>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#DEDEDE] rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FFF2D0] border border-[#FFBD00] text-[#FF7C00] flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1C1C1C]">
                Chưa có sản phẩm nào trong mục này
              </h3>
              <p className="text-xs text-[#747474] mt-1 mb-6">
                {isAdmin
                  ? 'Bạn có thể nhấn nút "+ Thêm sản phẩm ngay" bên dưới để thêm sản phẩm cho hãng/loại này.'
                  : 'Vui lòng chọn hãng khác trên thanh menu hoặc nhấn nút bên dưới để xem toàn bộ sản phẩm của Đức Vinh Solar.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSearchInput('');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setProductPage(1);
                  }}
                  className="px-5 py-2 text-xs font-bold text-[#1C1C1C] bg-[#FFBD00] hover:bg-[#FF7C00] hover:text-white rounded-full transition-colors"
                >
                  Xem tất cả sản phẩm
                </button>
                {isAdmin && (
                  <button
                    onClick={() => openAdminTab('inventory')}
                    className="px-5 py-2 text-xs font-semibold text-[#1C1C1C] bg-[#F8F8F8] hover:bg-[#FFF2D0] border border-[#DEDEDE] rounded-full transition-colors"
                  >
                    + Thêm sản phẩm ngay
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Soft Ambient Light Blobs behind Product Cards so Apple Frosted Glass refracts warm SolaX depth */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 overflow-hidden rounded-[2.5rem]"
              >
                <div className="absolute -top-16 left-8 w-80 h-80 rounded-full bg-[#FFBD00]/16 blur-3xl" />
                <div className="absolute top-1/3 right-6 w-96 h-96 rounded-full bg-[#FF7C00]/10 blur-3xl" />
                <div className="absolute bottom-8 left-1/3 w-80 h-80 rounded-full bg-[#FFF2D0]/75 blur-3xl" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                {paginatedProducts.map((product, idx) => {
                  const imgList =
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images
                      : product.imageUrl
                      ? [product.imageUrl]
                      : [];

                  const cardDelay = Math.min(
                    (idx % 3) * 0.06 + Math.floor(idx / 3) * 0.04,
                    0.24
                  );

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 22, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.06 }}
                      transition={{ duration: 0.52, delay: cardDelay, ease: EXPO_EASE }}
                      whileHover={{ y: -6 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedProduct(product)}
                      className="apple-glass-card group rounded-[2rem] sm:rounded-[2.15rem] p-3 sm:p-3.5 flex flex-col cursor-pointer overflow-hidden min-w-0"
                    >
                      {/* Apple Frosted Inner Studio Image Showcase Bubble */}
                      <div className="apple-glass-inner relative h-60 sm:h-64 lg:h-72 rounded-[1.5rem] sm:rounded-[1.65rem] overflow-hidden flex items-center justify-center p-3">
                        <ProductSvgThumbnail
                          type={product.svgType}
                          imageUrl={imgList[0] || product.imageUrl}
                          name={product.name}
                          fit="contain"
                          className="w-full h-full max-h-full transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Multi-photo count badge in Apple Frosted Pill */}
                        {imgList.length > 1 && (
                          <div className="apple-glass-pill absolute bottom-2.5 right-2.5 text-[#1C1C1C] px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5 text-[#FF7C00] shrink-0" />
                            <span>{imgList.length} ảnh thực tế</span>
                          </div>
                        )}

                        {/* Admin Quick Edit & Delete Product Buttons */}
                        {isAdmin && (
                          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
                            {typeof product.pinOrder === 'number' &&
                              product.pinOrder >= 1 &&
                              product.pinOrder <= 10 && (
                                <span
                                  className="px-2.5 py-1 rounded-full bg-[#FFBD00] text-[#1C1C1C] text-[11px] font-extrabold shadow-2xs"
                                  title={`Vị trí #${product.pinOrder} trên trang 1`}
                                >
                                  TOP #{product.pinOrder}
                                </span>
                              )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditProductInAdmin(product);
                              }}
                              className="px-2.5 py-1 rounded-full bg-[#1C1C1C]/85 backdrop-blur-md hover:bg-[#FF7C00] text-white text-[11px] font-bold shadow-2xs flex items-center gap-1 transition-colors"
                              title="Chỉnh sửa sản phẩm này"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProduct(product.id);
                              }}
                              className="px-2.5 py-1 rounded-full bg-rose-50/90 backdrop-blur-md hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold shadow-2xs flex items-center gap-1 transition-colors"
                              title="Xóa sản phẩm này"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        )}

                        {/* Subtle bottom-left zoom prompt on hover */}
                        <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="px-3 py-1 rounded-full bg-[#1C1C1C]/85 backdrop-blur-md text-white text-[11px] font-bold shadow-2xs flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#FFBD00] shrink-0" />
                            <span>Phóng to &amp; xem thông số</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="px-2 sm:px-3 pt-3.5 pb-2 flex-1 flex flex-col justify-between min-w-0">
                        <div className="min-w-0">
                          {/* Unboxed clean metadata */}
                          <div className="flex items-center justify-between gap-2 text-xs text-[#747474] mb-1.5 min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <span className="font-bold text-[#FF7C00] uppercase tracking-wide shrink-0">
                                HÃNG {(product.brand || '').toUpperCase()}
                              </span>
                              <span aria-hidden="true" className="shrink-0 text-[#B3B3B3]">
                                ·
                              </span>
                              <span className="font-mono text-[11px] truncate min-w-0">
                                {product.sku}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#363636] shrink-0">
                              BH {product.warrantyYears} năm
                            </span>
                          </div>

                          {/* Product Name (Sentence case, never Title Case) */}
                          <h3 className="text-base sm:text-lg font-bold text-[#1C1C1C] group-hover:text-[#FF7C00] transition-colors line-clamp-2 leading-snug break-words">
                            {toSentenceCase(product.name)}
                          </h3>

                          {/* Short Description */}
                          {product.shortDesc && (
                            <p className="text-xs text-[#747474] mt-1.5 line-clamp-2 leading-relaxed break-words">
                              {product.shortDesc}
                            </p>
                          )}

                          {/* Highlights Specs Summary */}
                          <div className="mt-3.5 pt-3 border-t border-black/6 space-y-1.5 text-xs text-[#747474] min-w-0">
                            {(Array.isArray(product.specs) ? product.specs : [])
                              .slice(0, 4)
                              .map((spec, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start justify-between gap-2 min-w-0"
                                >
                                  {spec?.value ? (
                                    <>
                                      <span className="text-[#747474] max-w-[48%] break-words">
                                        {spec.label}:
                                      </span>
                                      <span className="font-semibold text-[#1C1C1C] font-mono-nums text-right break-words min-w-0 flex-1">
                                        {spec.value}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="font-medium text-[#747474] flex items-start gap-1.5 min-w-0">
                                      <span className="text-[#FF7C00] font-bold shrink-0 leading-snug">
                                        ·
                                      </span>
                                      <span className="break-words min-w-0">{spec?.label}</span>
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="mt-4 pt-3 border-t border-black/6 flex items-center justify-between gap-2 min-w-0">
                          <span className="text-xs font-bold text-[#363636] group-hover:text-[#FF7C00] flex items-center gap-1 group-hover:underline min-w-0">
                            <span className="truncate">Xem ảnh lớn &amp; cấu hình</span>
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          </span>

                          <span className="apple-glass-pill px-3.5 py-1.5 text-xs font-bold text-[#1C1C1C] group-hover:bg-[#FFBD00] group-hover:border-[#FFBD00] group-hover:text-[#1C1C1C] rounded-full transition-all flex items-center gap-1 shrink-0">
                            <Eye className="w-3.5 h-3.5 shrink-0" />
                            <span>Chi tiết</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Product Pagination Controls */}
              {filteredProducts.length > PRODUCTS_PER_PAGE && (
                <ScrollReveal y={16} delay={0.05}>
                  <div className="mt-8 bg-[#F8F8F8] border border-[#DEDEDE] rounded-2xl sm:rounded-3xl lg:rounded-full px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_4px_16px_-6px_rgba(28,28,28,0.04)]">
                    <span className="text-xs sm:text-sm text-[#747474] text-center sm:text-left">
                      Trang sản phẩm{' '}
                      <strong className="text-[#1C1C1C]">
                        {safeProductPage} / {totalProductPages}
                      </strong>{' '}
                      (Hiển thị {(safeProductPage - 1) * PRODUCTS_PER_PAGE + 1}–
                      {Math.min(safeProductPage * PRODUCTS_PER_PAGE, filteredProducts.length)} /{' '}
                      <strong className="text-[#FF7C00]">{filteredProducts.length}</strong> sản
                      phẩm)
                    </span>

                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      <button
                        type="button"
                        disabled={safeProductPage <= 1}
                        onClick={() => {
                          setProductPage((p) => Math.max(1, p - 1));
                          scrollToResults();
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-full bg-white border border-[#DEDEDE] hover:bg-[#FFF2D0] hover:border-[#FFBD00] text-[#1C1C1C] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#FF7C00]" />
                        <span>Trước</span>
                      </button>

                      {getCompactPageItems(safeProductPage, totalProductPages).map((item) =>
                        typeof item === 'string' ? (
                          <span
                            key={item}
                            className="px-1 text-xs font-bold text-[#B3B3B3] select-none"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setProductPage(item);
                              scrollToResults();
                            }}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                              safeProductPage === item
                                ? 'bg-[#FFBD00] text-[#1C1C1C] shadow-2xs'
                                : 'bg-white border border-[#DEDEDE] text-[#363636] hover:bg-[#FFF2D0] hover:border-[#FFBD00]'
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        disabled={safeProductPage >= totalProductPages}
                        onClick={() => {
                          setProductPage((p) => Math.min(totalProductPages, p + 1));
                          scrollToResults();
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-full bg-white border border-[#DEDEDE] hover:bg-[#FFF2D0] hover:border-[#FFBD00] text-[#1C1C1C] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all"
                      >
                        <span>Sau</span>
                        <ChevronRight className="w-4 h-4 text-[#FF7C00]" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
