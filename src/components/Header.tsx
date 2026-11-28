import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { toSentenceCase } from '../utils/formatText';
import {
  Phone,
  LogOut,
  Menu,
  X,
  Sun,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronRight,
  Cpu,
  BatteryCharging,
  Lightbulb,
  Package,
  Wrench,
  LayoutGrid,
  Building2
} from 'lucide-react';
import { CategoryIconName } from '../types';

const ICON_MAP: Record<CategoryIconName, React.ComponentType<{ className?: string }>> = {
  Sun,
  Cpu,
  BatteryCharging,
  Zap,
  Lightbulb,
  Package,
  Wrench,
  ShieldCheck
};

export const Header: React.FC = () => {
  const {
    companyInfo,
    categories,
    brands,
    products,
    selectedCategory,
    selectedBrand,
    currentPage,
    selectCatalogFilter,
    navigateToPage,
    isAdmin,
    logoutAdmin,
    setIsAdminModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [isProductMenuHovered, setIsProductMenuHovered] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const lastPointerTypeRef = useRef<string>('mouse');

  // Close the desktop/tablet cascading product menu when tapping or clicking outside
  useEffect(() => {
    if (!isProductMenuHovered) return;
    const handleOutsidePointerDown = (e: PointerEvent) => {
      if (productMenuRef.current && !productMenuRef.current.contains(e.target as Node)) {
        setIsProductMenuHovered(false);
        setHoveredCategoryId(null);
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isProductMenuHovered]);

  // Compute brands per category for the cascading menu
  const brandsByCategory = useMemo(() => {
    const map = new Map<string, Array<{ name: string; count: number }>>();

    categories.forEach((cat) => {
      const catProducts = (products || []).filter((p) => p && p.category === cat.id);
      const countByBrand = new Map<string, number>();
      const displayNameMap = new Map<string, string>();

      catProducts.forEach((p) => {
        const raw = (p.brand || 'Khác').trim();
        const key = raw.toLowerCase();
        countByBrand.set(key, (countByBrand.get(key) || 0) + 1);
        if (!displayNameMap.has(key)) {
          displayNameMap.set(key, raw);
        }
      });

      const configuredBrands = (brands || []).filter((b) => b.categoryId === cat.id);
      const resultMap = new Map<string, { name: string; count: number }>();

      configuredBrands.forEach((b) => {
        const cleanName = (b.name || '').trim();
        if (!cleanName) return;
        const key = cleanName.toLowerCase();
        resultMap.set(key, {
          name: cleanName,
          count: countByBrand.get(key) || 0
        });
      });

      countByBrand.forEach((count, key) => {
        if (!resultMap.has(key)) {
          resultMap.set(key, {
            name: displayNameMap.get(key) || key,
            count
          });
        }
      });

      map.set(cat.id, Array.from(resultMap.values()));
    });

    return map;
  }, [categories, brands, products]);

  const handleNavPage = (
    page: 'home' | 'products' | 'projects' | 'blog' | 'company' | 'contact'
  ) => {
    setMobileMenuOpen(false);
    setIsProductMenuHovered(false);
    setHoveredCategoryId(null);
    navigateToPage(page);
  };

  const handleSelectFromNav = (categoryId: 'all' | string, brandName: string = 'all') => {
    selectCatalogFilter(categoryId, brandName, true);
    setIsProductMenuHovered(false);
    setHoveredCategoryId(null);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Header styled as Apple Liquid Glass / Frosted Bubble with SolaX Brand Accents */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="apple-glass-menu fixed top-2 sm:top-3 left-0 right-0 z-50 mx-auto max-w-7xl w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-2.5rem)] rounded-full"
      >
        <div className="px-3.5 sm:px-6 lg:px-7 h-14 sm:h-16 lg:h-[68px] flex items-center justify-between gap-2 sm:gap-4 lg:gap-5">
          {/* Zone 1: Brand title wordmark */}
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavPage('home');
              }}
              className="group flex items-center gap-2 sm:gap-2.5 text-[#1C1C1C] transition-colors min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#FFBD00] to-[#FF7C00] flex items-center justify-center text-[#1C1C1C] shadow-[0_4px_12px_rgba(255,189,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.65)] group-hover:scale-105 transition-transform shrink-0">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 animate-[spin_18s_linear_infinite]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl xl:text-2xl font-extrabold tracking-tight font-heading text-[#1C1C1C] whitespace-nowrap truncate">
                  ĐỨC VINH <span className="text-[#FF7C00]">SOLAR</span>
                </span>
                <span className="text-[9px] xl:text-[10px] text-[#747474] uppercase tracking-wider font-medium hidden sm:block lg:hidden xl:block truncate">
                  NĂNG LƯỢNG MẶT TRỜI &amp; TIẾT KIỆM ĐIỆN
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation links (clean text links, color-only active/hover state) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-semibold text-[#363636] min-w-0">
            {/* Cascading Dropdown Trigger: Sản phẩm Solar -> Loại sản phẩm -> Hãng */}
            <div
              ref={productMenuRef}
              className="relative"
              onPointerEnter={(e) => {
                lastPointerTypeRef.current = e.pointerType || 'mouse';
                if (e.pointerType === 'mouse') {
                  setIsProductMenuHovered(true);
                  if (!hoveredCategoryId && categories.length > 0) {
                    setHoveredCategoryId(
                      selectedCategory !== 'all' ? selectedCategory : categories[0].id
                    );
                  }
                }
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === 'mouse') {
                  setIsProductMenuHovered(false);
                  setHoveredCategoryId(null);
                }
              }}
            >
              <button
                type="button"
                onPointerDown={(e) => {
                  lastPointerTypeRef.current = e.pointerType || 'mouse';
                }}
                onClick={() => {
                  if (lastPointerTypeRef.current !== 'mouse' || !isProductMenuHovered) {
                    if (isProductMenuHovered) {
                      setIsProductMenuHovered(false);
                      setHoveredCategoryId(null);
                    } else {
                      setIsProductMenuHovered(true);
                      if (!hoveredCategoryId && categories.length > 0) {
                        setHoveredCategoryId(
                          selectedCategory !== 'all' ? selectedCategory : categories[0].id
                        );
                      }
                    }
                  } else {
                    handleSelectFromNav('all', 'all');
                  }
                }}
                aria-expanded={isProductMenuHovered}
                className={`flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 py-1.5 font-semibold ${
                  isProductMenuHovered || currentPage === 'products' || selectedCategory !== 'all'
                    ? 'text-[#FF7C00] font-bold'
                    : 'text-[#363636] hover:text-[#FF7C00]'
                }`}
              >
                <span>Sản phẩm Solar</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-150 ${
                    isProductMenuHovered ? 'rotate-180 text-[#FF7C00]' : 'text-[#747474]'
                  }`}
                />
              </button>

              {/* Level 1 & Level 2 Inner Dropdown: Solid Opaque Background (No Blur) */}
              <AnimatePresence>
                {isProductMenuHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-full pt-3 z-50 origin-top-left"
                  >
                    <div className="bg-white rounded-2xl border border-[#DEDEDE] shadow-[0_18px_42px_rgba(28,28,28,0.16)] flex max-w-[calc(100vw-2rem)] overflow-hidden">
                      {/* Categories Column (Solid White) */}
                      <div className="w-56 xl:w-72 py-2.5 bg-white shrink-0">
                        <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF7C00] border-b border-[#DEDEDE]">
                          LOẠI SẢN PHẨM
                        </div>

                        {/* All Products Item */}
                        <button
                          type="button"
                          onPointerEnter={(e) => {
                            if (e.pointerType === 'mouse') setHoveredCategoryId(null);
                          }}
                          onClick={() => handleSelectFromNav('all', 'all')}
                          className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                            selectedCategory === 'all' && hoveredCategoryId === null
                              ? 'bg-[#FFF2D0] text-[#1C1C1C] font-bold'
                              : 'text-[#363636] hover:bg-[#FEFBF3] hover:text-[#FF7C00]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <LayoutGrid className="w-4 h-4 text-[#FF7C00] shrink-0" />
                            <span className="truncate">Tất cả sản phẩm Solar</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#747474] shrink-0">
                            {(products || []).length} SP
                          </span>
                        </button>

                        {/* Each Category Item */}
                        {categories.map((cat) => {
                          const Icon = ICON_MAP[cat.iconName] || Package;
                          const isHovered = hoveredCategoryId === cat.id;
                          const isSelected = selectedCategory === cat.id;
                          const catCount = (products || []).filter((p) => p?.category === cat.id).length;

                          return (
                            <div
                              key={cat.id}
                              onPointerEnter={(e) => {
                                if (e.pointerType === 'mouse') {
                                  setHoveredCategoryId(cat.id);
                                }
                              }}
                              className="relative"
                            >
                              <button
                                type="button"
                                onPointerDown={(e) => {
                                  lastPointerTypeRef.current = e.pointerType || 'mouse';
                                }}
                                onClick={() => {
                                  if (
                                    lastPointerTypeRef.current !== 'mouse' &&
                                    hoveredCategoryId !== cat.id
                                  ) {
                                    setHoveredCategoryId(cat.id);
                                  } else {
                                    handleSelectFromNav(cat.id, 'all');
                                  }
                                }}
                                className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                                  isHovered || isSelected
                                    ? 'bg-[#FFBD00] text-[#1C1C1C] font-bold'
                                    : 'text-[#363636] hover:bg-[#FEFBF3] hover:text-[#FF7C00]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Icon
                                    className={`w-4 h-4 shrink-0 ${
                                      isHovered || isSelected ? 'text-[#1C1C1C]' : 'text-[#FF7C00]'
                                    }`}
                                  />
                                  <span className="truncate">{toSentenceCase(cat.label)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span
                                    className={`text-[11px] font-mono ${
                                      isHovered || isSelected ? 'text-[#1C1C1C]' : 'text-[#747474]'
                                    }`}
                                  >
                                    {catCount}
                                  </span>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 ${
                                      isHovered || isSelected ? 'text-[#1C1C1C]' : 'text-[#B3B3B3]'
                                    }`}
                                  />
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Level 2 Flyout Submenu: Hãng sản xuất for Hovered Category (Solid #F8F8F8) */}
                      {hoveredCategoryId &&
                        (() => {
                          const activeCat = categories.find((c) => c.id === hoveredCategoryId);
                          const catBrands = brandsByCategory.get(hoveredCategoryId) || [];
                          if (!activeCat) return null;

                          const cleanShortLabel = toSentenceCase(
                            activeCat.shortLabel || activeCat.label
                          ).toLowerCase();

                          return (
                            <div className="w-52 xl:w-64 py-2.5 bg-[#F8F8F8] border-l border-[#DEDEDE] flex flex-col justify-between min-w-0">
                              <div>
                                <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] border-b border-[#DEDEDE] flex items-center justify-between">
                                  <span className="truncate">
                                    HÃNG: {(activeCat.shortLabel || activeCat.label).toUpperCase()}
                                  </span>
                                  <span className="font-mono text-[10px] text-[#FF7C00] font-bold">
                                    {catBrands.length} hãng
                                  </span>
                                </div>

                                {/* All brands of this category */}
                                <button
                                  type="button"
                                  onClick={() => handleSelectFromNav(activeCat.id, 'all')}
                                  className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                                    selectedCategory === activeCat.id && selectedBrand === 'all'
                                      ? 'bg-[#FFF2D0] text-[#1C1C1C] font-bold'
                                      : 'text-[#363636] hover:bg-white hover:text-[#1C1C1C]'
                                  }`}
                                >
                                  <span>Tất cả hãng {cleanShortLabel}</span>
                                  <span className="text-[11px] font-mono text-[#FF7C00] font-bold">
                                    {catBrands.reduce((sum, b) => sum + b.count, 0)} SP
                                  </span>
                                </button>

                                <div className="max-h-72 overflow-y-auto divide-y divide-[#DEDEDE]">
                                  {catBrands.length === 0 ? (
                                    <div className="px-4 py-4 text-xs text-[#747474] text-center">
                                      Chưa có hãng nào trong mục này
                                    </div>
                                  ) : (
                                    catBrands.map((b) => {
                                      const isBrandSelected =
                                        selectedCategory === activeCat.id &&
                                        selectedBrand.toLowerCase() === b.name.toLowerCase();
                                      return (
                                        <button
                                          key={b.name}
                                          type="button"
                                          onClick={() => handleSelectFromNav(activeCat.id, b.name)}
                                          className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                                            isBrandSelected
                                              ? 'bg-[#FF7C00] text-white font-bold'
                                              : 'text-[#363636] hover:bg-white hover:text-[#1C1C1C] group/brand'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <Building2
                                              className={`w-3.5 h-3.5 shrink-0 ${
                                                isBrandSelected
                                                  ? 'text-white'
                                                  : 'text-[#FF7C00] group-hover/brand:text-[#1C1C1C]'
                                              }`}
                                            />
                                            <span className="truncate">Hãng {b.name}</span>
                                          </div>
                                          <span
                                            className={`text-[11px] font-mono shrink-0 ${
                                              isBrandSelected
                                                ? 'text-white'
                                                : 'text-[#747474] group-hover/brand:text-[#1C1C1C]'
                                            }`}
                                          >
                                            {b.count} SP
                                          </span>
                                        </button>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/du-an-tieu-bieu"
              onClick={(e) => {
                e.preventDefault();
                handleNavPage('projects');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1.5 ${
                currentPage === 'projects'
                  ? 'text-[#FF7C00] font-bold'
                  : 'text-[#363636] hover:text-[#FF7C00]'
              }`}
            >
              Dự án tiêu biểu
            </a>
            <a
              href="/blog-bai-viet"
              onClick={(e) => {
                e.preventDefault();
                handleNavPage('blog');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1.5 ${
                currentPage === 'blog'
                  ? 'text-[#FF7C00] font-bold'
                  : 'text-[#363636] hover:text-[#FF7C00]'
              }`}
            >
              Blog bài viết
            </a>
            <a
              href="/gioi-thieu-cong-ty"
              onClick={(e) => {
                e.preventDefault();
                handleNavPage('company');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1.5 ${
                currentPage === 'company'
                  ? 'text-[#FF7C00] font-bold'
                  : 'text-[#363636] hover:text-[#FF7C00]'
              }`}
            >
              Giới thiệu công ty
            </a>
            <a
              href="/lien-he-bao-gia"
              onClick={(e) => {
                e.preventDefault();
                handleNavPage('contact');
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1.5 ${
                currentPage === 'contact'
                  ? 'text-[#FF7C00] font-bold'
                  : 'text-[#363636] hover:text-[#FF7C00]'
              }`}
            >
              Liên hệ &amp; báo giá
            </a>
          </nav>

          {/* Zone 3: Admin control & Mobile menu trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-[#1C1C1C] bg-[#FFBD00] hover:bg-[#FF7C00] hover:text-white rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-[0_4px_12px_rgba(255,189,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)]"
                  title="Mở bảng điều khiển quản trị"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Quản trị kho &amp; SP</span>
                  <span className="sm:hidden">Quản trị</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  className="p-2 text-[#747474] hover:text-rose-600 hover:bg-white/70 rounded-full transition-colors"
                  title="Đăng xuất quản trị"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile menu trigger in Apple Frosted Pill */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="apple-glass-pill lg:hidden p-2 text-[#1C1C1C] hover:bg-white/90 rounded-full transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer: Solid White Opaque Background */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#DEDEDE] shadow-[0_18px_42px_rgba(28,28,28,0.16)] lg:hidden absolute left-0 right-0 top-[calc(100%+0.6rem)] rounded-2xl px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto origin-top"
            >
              <div className="flex flex-col gap-1.5">
                {/* Mobile expandable Sản phẩm Solar -> Loại sản phẩm -> Hãng */}
                <div className="rounded-lg border border-[#DEDEDE] bg-[#F8F8F8] overflow-hidden">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                      className="flex-1 text-left px-3 py-2.5 text-sm font-semibold text-[#1C1C1C] hover:text-[#FF7C00]"
                    >
                      Sản phẩm Solar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                      className="px-3 py-2.5 text-xs font-bold text-[#FF7C00] flex items-center gap-1"
                    >
                      <span>Chọn loại / hãng</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileCatalogOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {mobileCatalogOpen && (
                    <div className="px-2 pb-2.5 pt-1 border-t border-[#DEDEDE] space-y-1 bg-white">
                      <button
                        type="button"
                        onClick={() => handleSelectFromNav('all', 'all')}
                        className="w-full text-left px-2.5 py-2 text-xs font-bold text-[#1C1C1C] hover:bg-[#FEFBF3] rounded-md flex items-center justify-between"
                      >
                        <span>Tất cả thiết bị Solar</span>
                        <span className="font-mono text-[11px] text-[#FF7C00] font-bold">
                          {(products || []).length} SP
                        </span>
                      </button>

                      {categories.map((cat) => {
                        const catBrands = brandsByCategory.get(cat.id) || [];
                        const isExpanded = mobileExpandedCat === cat.id;
                        return (
                          <div
                            key={cat.id}
                            className="rounded-md border border-[#DEDEDE] overflow-hidden"
                          >
                            <div className="flex items-center justify-between bg-[#F8F8F8]">
                              <button
                                type="button"
                                onClick={() => handleSelectFromNav(cat.id, 'all')}
                                className="flex-1 text-left px-2.5 py-2 text-xs font-semibold text-[#1C1C1C] hover:text-[#FF7C00]"
                              >
                                {toSentenceCase(cat.label)}
                              </button>
                              <button
                                type="button"
                                onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                                className="px-2.5 py-2 text-[11px] font-bold text-[#FF7C00] flex items-center gap-1"
                              >
                                <span>{catBrands.length} hãng</span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="p-1.5 bg-white flex flex-wrap gap-1.5 border-t border-[#DEDEDE]">
                                <button
                                  type="button"
                                  onClick={() => handleSelectFromNav(cat.id, 'all')}
                                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#F8F8F8] border border-[#DEDEDE] text-[#1C1C1C] hover:bg-[#FFBD00]"
                                >
                                  Tất cả
                                </button>
                                {catBrands.map((b) => (
                                  <button
                                    key={b.name}
                                    type="button"
                                    onClick={() => handleSelectFromNav(cat.id, b.name)}
                                    className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#F8F8F8] border border-[#DEDEDE] text-[#363636] hover:bg-[#FFBD00] hover:text-[#1C1C1C]"
                                  >
                                    Hãng {b.name} ({b.count})
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavPage('home');
                  }}
                  className={`text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 'home'
                      ? 'bg-[#FEFBF3] text-[#1C1C1C] font-bold border-l-4 border-[#FFBD00]'
                      : 'text-[#363636] hover:bg-[#F8F8F8] hover:text-[#FF7C00]'
                  }`}
                >
                  Trang chủ
                </a>
                <a
                  href="/du-an-tieu-bieu"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavPage('projects');
                  }}
                  className={`text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 'projects'
                      ? 'bg-[#FEFBF3] text-[#1C1C1C] font-bold border-l-4 border-[#FFBD00]'
                      : 'text-[#363636] hover:bg-[#F8F8F8] hover:text-[#FF7C00]'
                  }`}
                >
                  Dự án tiêu biểu
                </a>
                <a
                  href="/blog-bai-viet"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavPage('blog');
                  }}
                  className={`text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 'blog'
                      ? 'bg-[#FEFBF3] text-[#1C1C1C] font-bold border-l-4 border-[#FFBD00]'
                      : 'text-[#363636] hover:bg-[#F8F8F8] hover:text-[#FF7C00]'
                  }`}
                >
                  Blog bài viết
                </a>
                <a
                  href="/gioi-thieu-cong-ty"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavPage('company');
                  }}
                  className={`text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 'company'
                      ? 'bg-[#FEFBF3] text-[#1C1C1C] font-bold border-l-4 border-[#FFBD00]'
                      : 'text-[#363636] hover:bg-[#F8F8F8] hover:text-[#FF7C00]'
                  }`}
                >
                  Giới thiệu công ty
                </a>
                <a
                  href="/lien-he-bao-gia"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavPage('contact');
                  }}
                  className={`text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 'contact'
                      ? 'bg-[#FEFBF3] text-[#1C1C1C] font-bold border-l-4 border-[#FFBD00]'
                      : 'text-[#363636] hover:bg-[#F8F8F8] hover:text-[#FF7C00]'
                  }`}
                >
                  Liên hệ &amp; báo giá
                </a>

                <div className="pt-3 border-t border-[#DEDEDE] flex items-center justify-end gap-2">
                  <a
                    href={`tel:${companyInfo.hotlineZalo}`}
                    className="text-xs font-bold text-[#FF7C00] flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FF7C00]" />
                    {companyInfo.hotlineZalo}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Subtle background overlay behind the mobile/tablet menu when open */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-[#1C1C1C]/25"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};
