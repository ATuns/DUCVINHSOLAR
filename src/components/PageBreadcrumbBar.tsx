import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MAIN_SITE_ROUTES,
  SITE_ORIGIN,
  SitePageType,
  buildProductCatalogPath
} from '../utils/siteRoutes';
import {
  Home,
  ChevronRight,
  Map,
  Package,
  Award,
  BookOpen,
  Building2,
  PhoneCall,
  ExternalLink
} from 'lucide-react';

const QUICK_PAGES: Array<{
  page: SitePageType;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { page: 'home', label: 'Trang Chủ', path: '/', icon: Home },
  { page: 'products', label: 'Sản Phẩm Solar', path: '/san-pham-solar', icon: Package },
  { page: 'projects', label: 'Dự Án Tiêu Biểu', path: '/du-an-tieu-bieu', icon: Award },
  { page: 'blog', label: 'Blog Bài Viết', path: '/blog-bai-viet', icon: BookOpen },
  { page: 'company', label: 'Giới Thiệu Công Ty', path: '/gioi-thieu-cong-ty', icon: Building2 },
  { page: 'contact', label: 'Liên Hệ & Báo Giá', path: '/lien-he-bao-gia', icon: PhoneCall },
  { page: 'sitemap', label: 'Sơ Đồ Web (Sitemap)', path: '/so-do-trang-web', icon: Map }
];

export const PageBreadcrumbBar: React.FC = () => {
  const {
    currentPage,
    navigateToPage,
    categories,
    selectedCategory,
    selectedBrand,
    selectCatalogFilter
  } = useApp();

  if (currentPage === 'home') return null;

  const routeInfo = MAIN_SITE_ROUTES[currentPage] || MAIN_SITE_ROUTES.home;
  const activeCat =
    currentPage === 'products' && selectedCategory !== 'all'
      ? categories.find((c) => c.id === selectedCategory)
      : undefined;

  const canonicalPath =
    currentPage === 'products'
      ? buildProductCatalogPath(selectedCategory, selectedBrand, categories)
      : routeInfo.path;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-1">
      <div className="glass-bubble rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 border border-white/80">
        {/* Left: Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToPage('home');
            }}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Trang Chủ</span>
          </a>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          {currentPage === 'products' && activeCat ? (
            <>
              <a
                href="/san-pham-solar"
                onClick={(e) => {
                  e.preventDefault();
                  selectCatalogFilter('all', 'all', true);
                }}
                className="font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
              >
                Sản Phẩm Solar
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {selectedBrand !== 'all' ? (
                <>
                  <a
                    href={buildProductCatalogPath(activeCat.id, 'all', categories)}
                    onClick={(e) => {
                      e.preventDefault();
                      selectCatalogFilter(activeCat.id, 'all', true);
                    }}
                    className="font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
                  >
                    {activeCat.label}
                  </a>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-md border border-emerald-200/70">
                    Hãng {selectedBrand}
                  </span>
                </>
              ) : (
                <span className="font-bold text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-md border border-emerald-200/70">
                  {activeCat.label}
                </span>
              )}
            </>
          ) : (
            <span className="font-bold text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded-md border border-emerald-200/70">
              {routeInfo.label}
            </span>
          )}

          <span className="hidden xl:inline-flex items-center gap-1 ml-2 text-[11px] font-mono text-slate-400">
            ({SITE_ORIGIN}
            {canonicalPath})
          </span>
        </nav>

        {/* Right: Quick Standalone Page Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          {QUICK_PAGES.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <a
                key={item.page}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.page === 'products') {
                    selectCatalogFilter('all', 'all', true);
                  } else {
                    navigateToPage(item.page);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white/75 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span>{item.label}</span>
              </a>
            );
          })}
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg text-[11px] font-mono font-semibold bg-slate-900/90 hover:bg-emerald-700 text-emerald-300 hover:text-white inline-flex items-center gap-1 transition-colors"
            title="Mở tệp XML Sitemap chuẩn Google SEO"
          >
            <span>sitemap.xml</span>
            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
