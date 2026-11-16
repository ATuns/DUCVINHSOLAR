import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Lock,
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
    selectCatalogFilter,
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

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setIsProductMenuHovered(false);
    setHoveredCategoryId(null);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectFromNav = (categoryId: 'all' | string, brandName: string = 'all') => {
    selectCatalogFilter(categoryId, brandName);
    setIsProductMenuHovered(false);
    setHoveredCategoryId(null);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById('products-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 30);
  };

  return (
    <>
      {/* Main Header styled as a floating frosted glass bubble that always follows scroll */}
      <header className="fixed top-2 sm:top-3 left-0 right-0 z-50 mx-auto max-w-7xl w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-2.5rem)] rounded-full bg-white/40 hover:bg-white/55 backdrop-blur-2xl backdrop-saturate-180 border border-white/80 ring-1 ring-emerald-900/5 shadow-[0_14px_38px_-6px_rgba(15,23,42,0.12),0_4px_14px_-2px_rgba(16,185,129,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.92)] transition-all duration-300">
        <div className="px-3.5 sm:px-6 lg:px-7 h-14 sm:h-16 lg:h-[68px] flex items-center justify-between gap-2 sm:gap-4 lg:gap-5">
          {/* Zone 1: Brand title wordmark */}
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 sm:gap-2.5 text-emerald-800 hover:text-emerald-950 transition-colors min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] group-hover:scale-105 transition-transform shrink-0">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 animate-[spin_12s_linear_infinite]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-xl xl:text-2xl font-extrabold tracking-tight font-heading text-emerald-950 whitespace-nowrap truncate drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  Đức Vinh <span className="text-emerald-600">Solar</span>
                </span>
                <span className="text-[9px] xl:text-[10px] text-slate-600 uppercase tracking-wider font-medium hidden sm:block lg:hidden xl:block truncate">
                  Năng Lượng Mặt Trời &amp; Tiết Kiệm Điện
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation links with cascading hover menu on "Sản Phẩm Solar" */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-xs xl:text-sm font-semibold text-slate-700 min-w-0">
            {/* Cascading Dropdown Trigger: Sản Phẩm Solar -> Loại Sản Phẩm -> Hãng */}
            <div
              ref={productMenuRef}
              className="relative py-4"
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
                  // On touch/tablet (no mouse hover) or if closed, toggle dropdown instead of immediately navigating away
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
                className={`flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 py-1 font-semibold ${
                  isProductMenuHovered || selectedCategory !== 'all'
                    ? 'text-emerald-700'
                    : 'text-slate-700 hover:text-emerald-700'
                }`}
              >
                <span>Sản Phẩm Solar</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-150 ${
                    isProductMenuHovered ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Level 1 Dropdown: Loại Sản Phẩm */}
              {isProductMenuHovered && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 ring-1 ring-slate-900/10 shadow-[0_20px_50px_rgba(15,23,42,0.18),inset_0_1px_1px_rgba(255,255,255,0.9)] flex max-w-[calc(100vw-2rem)] overflow-visible">
                    {/* Categories Column */}
                    <div className="w-56 xl:w-72 py-2 bg-white/80 rounded-l-2xl shrink-0">
                      <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        Loại Sản Phẩm
                      </div>

                      {/* All Products Item */}
                      <button
                        type="button"
                        onPointerEnter={(e) => {
                          if (e.pointerType === 'mouse') setHoveredCategoryId(null);
                        }}
                        onClick={() => handleSelectFromNav('all', 'all')}
                        className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                          selectedCategory === 'all' && hoveredCategoryId === null
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <LayoutGrid className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">Tất Cả Sản Phẩm Solar</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 shrink-0">
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
                              className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                                isHovered || isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icon
                                  className={`w-4 h-4 shrink-0 ${
                                    isHovered || isSelected ? 'text-emerald-100' : 'text-emerald-600'
                                  }`}
                                />
                                <span className="truncate">{cat.label}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span
                                  className={`text-[11px] font-mono ${
                                    isHovered || isSelected ? 'text-emerald-100' : 'text-slate-400'
                                  }`}
                                >
                                  {catCount}
                                </span>
                                <ChevronRight
                                  className={`w-3.5 h-3.5 ${
                                    isHovered || isSelected ? 'text-white' : 'text-slate-400'
                                  }`}
                                />
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Level 2 Flyout Submenu: Hãng Sản Xuất for Hovered Category */}
                    {hoveredCategoryId && (() => {
                      const activeCat = categories.find((c) => c.id === hoveredCategoryId);
                      const catBrands = brandsByCategory.get(hoveredCategoryId) || [];
                      if (!activeCat) return null;

                      return (
                        <div className="w-52 xl:w-64 py-2 bg-slate-50/95 border-l border-slate-200 rounded-r-2xl flex flex-col justify-between min-w-0">
                          <div>
                            <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-200/80 flex items-center justify-between">
                              <span className="truncate">Hãng: {activeCat.shortLabel || activeCat.label}</span>
                              <span className="font-mono text-[10px] text-slate-500">{catBrands.length} hãng</span>
                            </div>

                            {/* All brands of this category */}
                            <button
                              type="button"
                              onClick={() => handleSelectFromNav(activeCat.id, 'all')}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                                selectedCategory === activeCat.id && selectedBrand === 'all'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'text-slate-700 hover:bg-emerald-100/60 hover:text-emerald-900'
                              }`}
                            >
                              <span>Tất cả hãng {activeCat.shortLabel || activeCat.label}</span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {catBrands.reduce((sum, b) => sum + b.count, 0)} SP
                              </span>
                            </button>

                            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                              {catBrands.length === 0 ? (
                                <div className="px-3.5 py-4 text-xs text-slate-400 text-center">
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
                                      className={`w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors ${
                                        isBrandSelected
                                          ? 'bg-emerald-700 text-white'
                                          : 'text-slate-800 hover:bg-emerald-600 hover:text-white group/brand'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <Building2
                                          className={`w-3.5 h-3.5 shrink-0 ${
                                            isBrandSelected
                                              ? 'text-emerald-200'
                                              : 'text-emerald-600 group-hover/brand:text-emerald-200'
                                          }`}
                                        />
                                        <span className="truncate">Hãng {b.name}</span>
                                      </div>
                                      <span
                                        className={`text-[11px] font-mono shrink-0 ${
                                          isBrandSelected
                                            ? 'text-emerald-100'
                                            : 'text-slate-400 group-hover/brand:text-emerald-100'
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
                </div>
              )}
            </div>

            <button
              onClick={() => scrollTo('projects-section')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Dự Án Tiêu Biểu
            </button>
            <button
              onClick={() => scrollTo('blog-section')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Blog Bài Viết
            </button>
            <button
              onClick={() => scrollTo('company-section')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Giới Thiệu Công Ty
            </button>
            <button
              onClick={() => scrollTo('contact-section')}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Liên Hệ &amp; Báo Giá
            </button>
          </nav>

          {/* Zone 3: Admin control (only visible after Admin is activated) & Mobile menu trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/90 backdrop-blur-sm rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap border border-emerald-300/60 shadow-2xs"
                  title="Mở bảng điều khiển quản trị"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">Quản Trị Kho &amp; SP</span>
                  <span className="sm:hidden">Quản Trị</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-full transition-colors"
                  title="Đăng xuất quản trị"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-800 hover:text-slate-950 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 shadow-2xs transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (solid background, no blur on phone & tablet) */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-[calc(100%+0.6rem)] rounded-2xl border border-slate-200 bg-white px-4 pt-3 pb-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1.5">
              {/* Mobile expandable Sản Phẩm Solar -> Loại sản phẩm -> Hãng */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                    className="flex-1 text-left px-3 py-2.5 text-sm font-semibold text-slate-900 hover:text-emerald-700"
                  >
                    Sản Phẩm Solar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                    className="px-3 py-2.5 text-xs font-bold text-emerald-700 flex items-center gap-1"
                  >
                    <span>Chọn loại / hãng</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${mobileCatalogOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {mobileCatalogOpen && (
                  <div className="px-2 pb-2.5 pt-1 border-t border-slate-200 space-y-1 bg-white">
                    <button
                      type="button"
                      onClick={() => handleSelectFromNav('all', 'all')}
                      className="w-full text-left px-2.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 rounded-md flex items-center justify-between"
                    >
                      <span>Tất Cả Thiết Bị Solar</span>
                      <span className="font-mono text-[11px] text-slate-500">{(products || []).length} SP</span>
                    </button>

                    {categories.map((cat) => {
                      const catBrands = brandsByCategory.get(cat.id) || [];
                      const isExpanded = mobileExpandedCat === cat.id;
                      return (
                        <div key={cat.id} className="rounded-md border border-slate-100 overflow-hidden">
                          <div className="flex items-center justify-between bg-slate-50">
                            <button
                              type="button"
                              onClick={() => handleSelectFromNav(cat.id, 'all')}
                              className="flex-1 text-left px-2.5 py-2 text-xs font-semibold text-slate-800 hover:text-emerald-700"
                            >
                              {cat.label}
                            </button>
                            <button
                              type="button"
                              onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                              className="px-2.5 py-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1"
                            >
                              <span>{catBrands.length} hãng</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="p-1.5 bg-white flex flex-wrap gap-1.5 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => handleSelectFromNav(cat.id, 'all')}
                                className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white"
                              >
                                Tất cả
                              </button>
                              {catBrands.map((b) => (
                                <button
                                  key={b.name}
                                  type="button"
                                  onClick={() => handleSelectFromNav(cat.id, b.name)}
                                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white"
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

              <button
                onClick={() => scrollTo('projects-section')}
                className="text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
              >
                Dự Án Tiêu Biểu
              </button>
              <button
                onClick={() => scrollTo('blog-section')}
                className="text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
              >
                Blog Bài Viết
              </button>
              <button
                onClick={() => scrollTo('company-section')}
                className="text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
              >
                Giới Thiệu Công Ty
              </button>
              <button
                onClick={() => scrollTo('contact-section')}
                className="text-left px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
              >
                Liên Hệ &amp; Báo Giá
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <a
                  href={`tel:${companyInfo.hotlineZalo}`}
                  className="text-xs font-bold text-emerald-700 flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {companyInfo.hotlineZalo}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Light, blurred background overlay behind the mobile/tablet menu when open */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-white/45 backdrop-blur-md transition-opacity"
          aria-hidden="true"
        />
      )}
    </>
  );
};

