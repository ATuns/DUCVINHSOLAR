import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductSvgThumbnail } from './ProductSvgThumbnail';
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
  Image as ImageIcon
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
    setSelectedProduct,
    isAdmin,
    openAdminTab,
    openEditProductInAdmin,
    deleteProduct
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [productPage, setProductPage] = useState<number>(1);

  // Reset product page when category or brand changes from the top Header MENU
  useEffect(() => {
    setProductPage(1);
  }, [selectedCategory, selectedBrand]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setProductPage(1);
    if (val.trim() !== '') {
      setSelectedCategory('all');
      setSelectedBrand('all');
    }
  };

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    const rawQ = searchQuery.toLowerCase().trim();
    const normQ = normalizeVietnamese(searchQuery);
    const queryTokens = normQ ? normQ.split(' ').filter(Boolean) : [];

    return (products || []).filter(item => {
      if (!item) return false;
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchBrand =
        selectedBrand === 'all' ||
        (item.brand || '').trim().toLowerCase() === selectedBrand.toLowerCase();

      let matchSearch = true;
      if (rawQ) {
        const catLabelStr = categories.find(c => c.id === item.category)?.label || '';
        const specsStr = Array.isArray(item.specs)
          ? item.specs.map(s => `${s?.label || ''} ${s?.value || ''}`).join(' ')
          : '';
        const combinedRaw = `${item.name || ''} ${item.brand || ''} ${item.sku || ''} ${catLabelStr} ${item.shortDesc || ''} ${item.fullDesc || ''} ${item.origin || ''} ${specsStr}`.toLowerCase();
        const combinedNorm = normalizeVietnamese(combinedRaw);

        const directMatch = combinedRaw.includes(rawQ) || combinedNorm.includes(normQ);
        const tokenMatch =
          queryTokens.length > 0 &&
          queryTokens.every(tok => combinedNorm.includes(tok) || combinedRaw.includes(tok));

        matchSearch = directMatch || tokenMatch;
      }

      const matchStock = inStockOnly ? (item.stock ?? 0) > 0 : true;

      return matchCategory && matchBrand && matchSearch && matchStock;
    });
  }, [products, categories, selectedCategory, selectedBrand, searchQuery, inStockOnly]);

  const currentCategoryLabel =
    selectedCategory === 'all'
      ? 'Tất Cả Thiết Bị'
      : categories.find(c => c.id === selectedCategory)?.label || 'Danh Mục';

  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safeProductPage = Math.min(productPage, totalProductPages);
  const paginatedProducts = useMemo(() => {
    const start = (safeProductPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safeProductPage]);

  const scrollToResults = () => {
    const el = document.getElementById('product-results-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="products-section" className="pt-8 pb-16 sm:pt-10 sm:pb-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Compact Welcome & Search Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-300 mb-2">
                <span className="text-[10px]">ĐỨC VINH SOLAR</span>
                <span aria-hidden="true">·</span>
                <span className="text-[10px]">DANH MỤC SẢN PHẨM CHÍNH HÃNG</span>
                <span aria-hidden="true">·</span>
                <span className="text-[10px]">ZALO: 0938288876</span>
              </div>
              <h1 className="text-[18px] font-extrabold font-heading tracking-tight text-white">
                Danh Mục Thiết Bị Năng Lượng Mặt Trời
              </h1>
              <p className="text-[10px] text-emerald-100/90 mt-1.5 max-w-2xl">
                Phân phối sỉ &amp; lẻ tấm pin năng lượng mặt trời, biến tần Inverter, pin lưu trữ Lithium và phụ kiện Solar chính hãng.
              </p>
            </div>

            {/* Quick Search Box + Admin Manage Button */}
            <div className="w-full lg:w-96 shrink-0 flex flex-col gap-2.5 relative">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Gõ tên SP, hãng (SolaX, Deye...), công suất..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        scrollToResults();
                      }
                    }}
                    className="w-full pl-10 pr-14 py-3 text-xs sm:text-sm bg-white text-slate-900 placeholder:text-slate-400 border-2 border-emerald-400 focus:border-emerald-300 rounded-xl focus:outline-hidden shadow-sm font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-md font-bold transition-colors"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={scrollToResults}
                  className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs sm:text-sm rounded-xl shrink-0 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Tìm</span>
                </button>
              </div>

              {/* Instant Live Search Results Preview Dropdown */}
              {searchQuery.trim() !== '' && (
                <div className="bg-white text-slate-900 rounded-xl p-3 shadow-2xl border-2 border-emerald-500 max-h-80 overflow-y-auto z-30">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                    <span className="font-bold text-emerald-800">
                      Kết quả tìm kiếm cho &ldquo;{searchQuery}&rdquo;: ({filteredProducts.length} SP)
                    </span>
                    <button
                      type="button"
                      onClick={scrollToResults}
                      className="text-emerald-600 hover:underline font-semibold text-[11px]"
                    >
                      Xem dưới lưới &darr;
                    </button>
                  </div>
                  {filteredProducts.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-500">
                      Không tìm thấy sản phẩm nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedProduct(p)}
                          className="p-2 rounded-lg hover:bg-emerald-50 border border-transparent hover:border-emerald-200 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span className="text-emerald-700 font-semibold">Hãng {p.brand}</span>
                              <span>·</span>
                              <span className="font-mono">{p.sku}</span>
                              <span>·</span>
                              <span>Kho: {p.stock} {p.unit}</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md shrink-0">
                            Xem
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isAdmin && (
                <button
                  onClick={() => openAdminTab('categories-brands')}
                  className="w-full py-2 px-3 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Quản Lý Thêm / Xóa / Sửa Loại &amp; Hãng</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= DANH SÁCH SẢN PHẨM ================= */}
        <div id="product-results-grid">
          {/* Simple Active Filter & Count Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="text-emerald-800 font-bold">
                {currentCategoryLabel}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="text-emerald-700 font-semibold">
                {selectedBrand === 'all' ? 'Tất cả hãng' : `Hãng ${selectedBrand}`}
              </span>
              {searchQuery.trim() !== '' && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-xs">
                    Từ khóa: &ldquo;{searchQuery}&rdquo;
                  </span>
                </>
              )}
              {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery || inStockOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setProductPage(1);
                  }}
                  className="ml-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xem tất cả</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setProductPage(1);
                  }}
                  className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                />
                <span>Chỉ hiện sẵn kho</span>
              </label>

              {isAdmin && (
                <button
                  onClick={() => openAdminTab('inventory')}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm / Quản Lý Sản Phẩm</span>
                </button>
              )}
              <div className="text-xs text-slate-600">
                Hiển thị <strong className="text-emerald-800 font-mono-nums">{filteredProducts.length}</strong> sản phẩm
                {filteredProducts.length > PRODUCTS_PER_PAGE && (
                  <span> · Trang <strong>{safeProductPage}/{totalProductPages}</strong></span>
                )}
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Chưa có sản phẩm nào trong mục này</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                {isAdmin
                  ? 'Bạn có thể nhấn nút "Thêm Sản Phẩm Mới" trong trình Quản Trị để thêm sản phẩm cho hãng/loại này.'
                  : 'Vui lòng chọn hãng khác trên thanh MENU hoặc nhấn nút bên dưới để xem toàn bộ sản phẩm của Đức Vinh Solar.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setProductPage(1);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  Xem tất cả sản phẩm
                </button>
                {isAdmin && (
                  <button
                    onClick={() => openAdminTab('inventory')}
                    className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                  >
                    + Thêm sản phẩm ngay
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedProducts.map((product) => {
                  const imgList = Array.isArray(product.images) && product.images.length > 0
                    ? product.images
                    : product.imageUrl
                    ? [product.imageUrl]
                    : [];

                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all duration-200 flex flex-col cursor-pointer"
                    >
                      {/* Large, High-Clarity Studio Image Showcase */}
                      <div className="relative h-64 sm:h-72 bg-white overflow-hidden border-b border-slate-100 flex items-center justify-center p-3">
                        <ProductSvgThumbnail
                          type={product.svgType}
                          imageUrl={imgList[0] || product.imageUrl}
                          name={product.name}
                          fit="contain"
                          className="w-full h-full max-h-full transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Stock status indicator badge */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 shadow-xs border border-slate-200/80">
                          {product.stock > 10 ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-800 font-mono-nums">
                                Sẵn kho ({product.stock} {product.unit})
                              </span>
                            </>
                          ) : product.stock > 0 ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-amber-800 font-mono-nums">
                                Sắp hết ({product.stock} {product.unit})
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-500">Liên hệ đặt trước</span>
                          )}
                        </div>

                        {/* Multi-photo count badge */}
                        {imgList.length > 1 && (
                          <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
                            <span>{imgList.length} ảnh thực tế</span>
                          </div>
                        )}

                        {/* Admin Quick Edit & Delete Product Buttons */}
                        {isAdmin && (
                          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditProductInAdmin(product);
                              }}
                              className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold shadow-sm flex items-center gap-1 transition-colors"
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
                              className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-sm flex items-center gap-1 transition-colors"
                              title="Xóa sản phẩm này"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        )}

                        {/* Subtle bottom-left zoom prompt on hover (keeps image 100% bright & unobstructed) */}
                        <div className="absolute bottom-2.5 left-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="px-2.5 py-1 rounded-md bg-emerald-700/95 text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Phóng to &amp; Xem thông số</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                        <div>
                          {/* Unboxed clean metadata (Zero-pill discipline) */}
                          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-bold text-emerald-700 uppercase tracking-wide truncate">
                                Hãng {product.brand}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-[11px]">{product.sku}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                              BH {product.warrantyYears} năm
                            </span>
                          </div>

                          {/* Product Name */}
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                            {product.name}
                          </h3>

                          {/* Short Description */}
                          {product.shortDesc && (
                            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                              {product.shortDesc}
                            </p>
                          )}

                          {/* Highlights Specs Summary */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                            {(Array.isArray(product.specs) ? product.specs : []).slice(0, 4).map((spec, idx) => (
                              <div key={idx} className="flex items-start justify-between gap-2">
                                {spec?.value ? (
                                  <>
                                    <span className="text-slate-500 shrink-0">{spec.label}:</span>
                                    <span className="font-semibold text-slate-900 font-mono-nums text-right">
                                      {spec.value}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-medium text-slate-800 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>{spec?.label}</span>
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:underline">
                            <span>Xem ảnh lớn &amp; cấu hình chi tiết</span>
                            <ChevronRight className="w-4 h-4" />
                          </span>

                          <span className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white rounded-lg transition-colors flex items-center gap-1 shrink-0">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chi Tiết</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Product Pagination Controls (shown when filteredProducts > 9) */}
              {filteredProducts.length > PRODUCTS_PER_PAGE && (
                <div className="mt-8 bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <span className="text-xs sm:text-sm text-slate-600">
                    Trang sản phẩm <strong className="text-emerald-800">{safeProductPage} / {totalProductPages}</strong> (Hiển thị {(safeProductPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(safeProductPage * PRODUCTS_PER_PAGE, filteredProducts.length)} / <strong>{filteredProducts.length}</strong> sản phẩm)
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      disabled={safeProductPage <= 1}
                      onClick={() => {
                        setProductPage(p => Math.max(1, p - 1));
                        scrollToResults();
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Trang trước</span>
                    </button>

                    {getCompactPageItems(safeProductPage, totalProductPages).map((item) =>
                      typeof item === 'string' ? (
                        <span
                          key={item}
                          className="px-1.5 text-xs font-bold text-slate-400 select-none"
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
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                            safeProductPage === item
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
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
                        setProductPage(p => Math.min(totalProductPages, p + 1));
                        scrollToResults();
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
                    >
                      <span>Trang sau</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
