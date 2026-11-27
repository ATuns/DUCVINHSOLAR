import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MAIN_SITE_ROUTES,
  SITE_ORIGIN,
  SitePageType,
  buildProductCatalogPath
} from '../utils/siteRoutes';
import { ScrollReveal } from './MotionPrimitives';
import {
  Map,
  Home,
  Package,
  Award,
  BookOpen,
  Building2,
  PhoneCall,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Globe,
  FileCode
} from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const {
    categories,
    brands,
    products,
    projects,
    blogPosts,
    navigateToPage,
    selectCatalogFilter
  } = useApp();

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = (fullUrl: string) => {
    navigator.clipboard?.writeText(fullUrl);
    setCopiedUrl(fullUrl);
    setTimeout(() => {
      setCopiedUrl((prev) => (prev === fullUrl ? null : prev));
    }, 2000);
  };

  const mainPages: Array<{
    page: SitePageType;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }> = [
    { page: 'home', icon: Home, badge: 'Trang tổng hợp' },
    { page: 'products', icon: Package, badge: `${products.length} sản phẩm` },
    { page: 'projects', icon: Award, badge: `${projects.length} dự án` },
    { page: 'blog', icon: BookOpen, badge: `${blogPosts.length} bài viết` },
    { page: 'company', icon: Building2, badge: 'Hồ sơ pháp lý' },
    { page: 'contact', icon: PhoneCall, badge: 'Hotline & Bản đồ' },
    { page: 'sitemap', icon: Map, badge: 'HTML & XML Sitemap' }
  ];

  return (
    <section id="sitemap-section" className="py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header Hero Card */}
        <ScrollReveal y={18}>
          <div className="glass-bubble-dark rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Hệ Thống Đường Dẫn &amp; Sitemap Chuẩn SEO</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold font-heading tracking-tight text-white">
                  Sơ Đồ Trang Web (Sitemap) – Đức Vinh Solar
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Mỗi chuyên mục và danh mục sản phẩm đều có đường dẫn URL độc lập riêng (ví dụ:{' '}
                  <code className="px-1.5 py-0.5 rounded bg-white/15 text-emerald-200 font-mono">
                    {SITE_ORIGIN}/san-pham-solar
                  </code>
                  ). Khi truy cập trực tiếp vào đường dẫn nào, hệ thống sẽ mở trang chuyên biệt chỉ hiển thị nội dung của trang đó.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
                >
                  <FileCode className="w-4 h-4 shrink-0" />
                  <span>Mở File XML Sitemap (/sitemap.xml)</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(`${SITE_ORIGIN}/sitemap.xml`)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-all"
                >
                  {copiedUrl === `${SITE_ORIGIN}/sitemap.xml` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Đã chép link XML!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Chép link sitemap.xml</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Section 1: Main Dedicated Pages */}
        <ScrollReveal y={20} delay={0.05}>
          <div className="glass-bubble rounded-3xl sm:rounded-[2rem] p-5 sm:p-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3.5">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  1. Các Trang Chính Độc Lập ({mainPages.length} trang)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bấm vào bất kỳ trang nào bên dưới để mở trang riêng chỉ hiển thị đúng chuyên mục đó
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {mainPages.map(({ page, icon: Icon, badge }) => {
                const info = MAIN_SITE_ROUTES[page];
                const fullUrl = `${SITE_ORIGIN}${info.path}`;
                return (
                  <div
                    key={page}
                    className="p-4 rounded-2xl bg-white/85 border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <a
                              href={info.path}
                              onClick={(e) => {
                                e.preventDefault();
                                if (page === 'products') {
                                  selectCatalogFilter('all', 'all', true);
                                } else {
                                  navigateToPage(page);
                                }
                              }}
                              className="text-sm font-extrabold text-slate-900 hover:text-emerald-700 transition-colors block truncate"
                            >
                              {info.label}
                            </a>
                            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {info.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={info.path}
                        onClick={(e) => {
                          e.preventDefault();
                          if (page === 'products') {
                            selectCatalogFilter('all', 'all', true);
                          } else {
                            navigateToPage(page);
                          }
                        }}
                        className="text-[11px] font-mono font-semibold text-emerald-700 hover:underline truncate"
                        title={fullUrl}
                      >
                        {fullUrl}
                      </a>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(fullUrl)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-colors"
                          title="Sao chép đường dẫn đầy đủ"
                        >
                          {copiedUrl === fullUrl ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={info.path}
                          onClick={(e) => {
                            e.preventDefault();
                            if (page === 'products') {
                              selectCatalogFilter('all', 'all', true);
                            } else {
                              navigateToPage(page);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold inline-flex items-center gap-0.5 transition-colors"
                        >
                          <span>Mở trang</span>
                          <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Section 2: Dedicated Product Category & Brand Pages */}
        <ScrollReveal y={20} delay={0.1}>
          <div className="glass-bubble rounded-3xl sm:rounded-[2rem] p-5 sm:p-7 space-y-4">
            <div className="border-b border-slate-200/80 pb-3.5">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                2. Các Trang Danh Mục Sản Phẩm &amp; Thương Hiệu ({categories.length} danh mục)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mỗi loại thiết bị và hãng sản xuất đều có đường dẫn riêng để khách hàng truy cập thẳng hoặc chạy quảng cáo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const catPath = buildProductCatalogPath(cat.id, 'all', categories);
                const catFullUrl = `${SITE_ORIGIN}${catPath}`;
                const catProducts = products.filter((p) => p.category === cat.id);
                const catBrands = brands.filter((b) => b.categoryId === cat.id);

                return (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={catPath}
                          onClick={(e) => {
                            e.preventDefault();
                            selectCatalogFilter(cat.id, 'all', true);
                          }}
                          className="text-sm font-extrabold text-emerald-900 hover:text-emerald-600 transition-colors"
                        >
                          {cat.label}
                        </a>
                        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {catProducts.length} SP
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70">
                        <span className="text-[11px] font-mono text-slate-600 truncate">
                          {catFullUrl}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(catFullUrl)}
                            className="p-1 text-slate-500 hover:text-emerald-700"
                            title="Sao chép link danh mục"
                          >
                            {copiedUrl === catFullUrl ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={catPath}
                            onClick={(e) => {
                              e.preventDefault();
                              selectCatalogFilter(cat.id, 'all', true);
                            }}
                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                          >
                            Xem &rarr;
                          </a>
                        </div>
                      </div>

                      {/* Brand sub-routes */}
                      {catBrands.length > 0 && (
                        <div className="pt-1">
                          <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                            Link theo hãng ({catBrands.length} hãng):
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {catBrands.map((b) => {
                              const brandPath = buildProductCatalogPath(cat.id, b.name, categories);
                              return (
                                <a
                                  key={b.id}
                                  href={brandPath}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    selectCatalogFilter(cat.id, b.name, true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50/80 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200/80 text-[11px] font-semibold transition-colors"
                                  title={`${SITE_ORIGIN}${brandPath}`}
                                >
                                  Hãng {b.name}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
