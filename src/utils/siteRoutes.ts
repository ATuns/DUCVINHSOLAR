import { CategoryItem } from '../types';

export type SitePageType =
  | 'home'
  | 'products'
  | 'projects'
  | 'blog'
  | 'company'
  | 'contact'
  | 'sitemap';

export const SITE_ORIGIN = 'https://www.solarducvinh.com';

export interface RouteMetaInfo {
  page: SitePageType;
  path: string;
  label: string;
  shortLabel: string;
  title: string;
  description: string;
}

export const MAIN_SITE_ROUTES: Record<SitePageType, RouteMetaInfo> = {
  home: {
    page: 'home',
    path: '/',
    label: 'Trang Chủ',
    shortLabel: 'Trang Chủ',
    title: 'Đức Vinh Solar – Thiết Bị Điện Năng Lượng Mặt Trời & Pin Lưu Trữ Chính Hãng',
    description:
      'Đức Vinh Solar phân phối tấm pin năng lượng mặt trời, biến tần Inverter Hybrid, pin lưu trữ Lithium ESS, tủ điện và vật tư Solar chính hãng tại TP.HCM.'
  },
  products: {
    page: 'products',
    path: '/san-pham-solar',
    label: 'Sản Phẩm Solar',
    shortLabel: 'Sản Phẩm Solar',
    title: 'Sản Phẩm Solar Chính Hãng – Tấm Pin, Biến Tần Inverter & Pin Lưu Trữ | Đức Vinh Solar',
    description:
      'Danh mục sản phẩm điện năng lượng mặt trời chính hãng tại Đức Vinh Solar: tấm pin mặt trời, biến tần Inverter Hybrid, pin lưu trữ Lithium, tủ điện và phụ kiện Solar.'
  },
  projects: {
    page: 'projects',
    path: '/du-an-tieu-bieu',
    label: 'Dự Án Tiêu Biểu',
    shortLabel: 'Dự Án Tiêu Biểu',
    title: 'Dự Án Điện Mặt Trời Tiêu Biểu – Hộ Gia Đình, Biệt Thự & Nhà Xưởng | Đức Vinh Solar',
    description:
      'Các công trình và dự án điện năng lượng mặt trời áp mái, hệ thống lưu trữ Hybrid tiêu biểu do đội ngũ kỹ sư Đức Vinh Solar thiết kế và thi công.'
  },
  blog: {
    page: 'blog',
    path: '/blog-bai-viet',
    label: 'Blog Bài Viết',
    shortLabel: 'Blog Bài Viết',
    title: 'Blog Kiến Thức Điện Năng Lượng Mặt Trời & Giải Pháp Tiết Kiệm Điện | Đức Vinh Solar',
    description:
      'Cẩm nang kỹ thuật, kinh nghiệm lắp đặt điện mặt trời, hướng dẫn chọn biến tần Inverter, pin lưu trữ Lithium và giải pháp tiết kiệm điện từ kỹ sư Đức Vinh Solar.'
  },
  company: {
    page: 'company',
    path: '/gioi-thieu-cong-ty',
    label: 'Giới Thiệu Công Ty',
    shortLabel: 'Giới Thiệu Công Ty',
    title: 'Giới Thiệu Công Ty TNHH Dịch Vụ Viễn Thông Đức Vinh – Đức Vinh Solar',
    description:
      'Thông tin pháp lý, mã số thuế 0311193770, hồ sơ năng lực và địa chỉ kho tổng Đức Vinh Solar tại Đông Thạnh, Hóc Môn, TP. Hồ Chí Minh.'
  },
  contact: {
    page: 'contact',
    path: '/lien-he-bao-gia',
    label: 'Liên Hệ & Báo Giá',
    shortLabel: 'Liên Hệ & Báo Giá',
    title: 'Liên Hệ & Nhận Báo Giá Điện Năng Lượng Mặt Trời – Hotline/Zalo 0938.288.876 | Đức Vinh Solar',
    description:
      'Liên hệ kho tổng Đức Vinh Solar tại Hóc Môn, TP.HCM qua Hotline/Zalo 0938.288.876 để nhận tư vấn kỹ thuật, khảo sát tận nơi và báo giá vật tư điện mặt trời.'
  },
  sitemap: {
    page: 'sitemap',
    path: '/so-do-trang-web',
    label: 'Sơ Đồ Trang Web (Sitemap)',
    shortLabel: 'Sitemap',
    title: 'Sơ Đồ Trang Web (Sitemap) – Danh Sách Toàn Bộ Trang & Danh Mục | Đức Vinh Solar',
    description:
      'Sơ đồ trang web (HTML & XML Sitemap) tổng hợp toàn bộ đường dẫn trang chuyên biệt, danh mục thiết bị điện mặt trời, thương hiệu, dự án và bài viết tại Đức Vinh Solar.'
  }
};

const BUILTIN_CATEGORY_SLUGS: Record<string, string> = {
  'solar-panels': 'tam-pin-mat-troi',
  inverters: 'bien-tan-inverter',
  'energy-storage': 'pin-luu-tru-ess',
  'solar-lights': 'den-nang-luong'
};

/**
 * Convert arbitrary Vietnamese text into a clean URL slug (e.g. "Tủ điện Solar" -> "tu-dien-solar")
 */
export function toUrlSlug(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get the canonical slug for a category (e.g. "tam-pin-mat-troi", "bien-tan-inverter", "tu-dien-solar")
 */
export function getCategorySlug(category: CategoryItem | { id: string; label?: string }): string {
  if (!category) return '';
  if (BUILTIN_CATEGORY_SLUGS[category.id]) {
    return BUILTIN_CATEGORY_SLUGS[category.id];
  }
  const fromLabel = toUrlSlug(category.label || '');
  return fromLabel || toUrlSlug(category.id);
}

/**
 * Build canonical path for a product catalog view (all products, specific category, or category + brand)
 */
export function buildProductCatalogPath(
  categoryId: 'all' | string,
  brandName: string = 'all',
  categories: CategoryItem[] = []
): string {
  if (!categoryId || categoryId === 'all') {
    if (brandName && brandName !== 'all') {
      return `/san-pham-solar?hang=${encodeURIComponent(brandName)}`;
    }
    return '/san-pham-solar';
  }

  const foundCat = categories.find((c) => c.id === categoryId);
  const catSlug = foundCat
    ? getCategorySlug(foundCat)
    : BUILTIN_CATEGORY_SLUGS[categoryId] || toUrlSlug(categoryId);

  if (brandName && brandName !== 'all') {
    const brandSlug = toUrlSlug(brandName);
    return `/san-pham-solar/${catSlug}/${brandSlug}`;
  }

  return `/san-pham-solar/${catSlug}`;
}

/**
 * Match a slug back to a category ID using the loaded categories list + built-in slugs
 */
export function findCategoryBySlug(
  slug: string,
  categories: CategoryItem[]
): CategoryItem | undefined {
  const cleanSlug = toUrlSlug(slug);
  if (!cleanSlug) return undefined;

  for (const cat of categories) {
    if (
      toUrlSlug(cat.id) === cleanSlug ||
      getCategorySlug(cat) === cleanSlug ||
      toUrlSlug(cat.label) === cleanSlug ||
      toUrlSlug(cat.shortLabel) === cleanSlug
    ) {
      return cat;
    }
  }

  for (const [catId, builtinSlug] of Object.entries(BUILTIN_CATEGORY_SLUGS)) {
    if (builtinSlug === cleanSlug) {
      return categories.find((c) => c.id === catId) || {
        id: catId,
        label: catId,
        shortLabel: catId,
        desc: '',
        iconName: 'Sun'
      };
    }
  }

  return undefined;
}

export interface ParsedSiteLocation {
  page: SitePageType;
  categorySlug?: string;
  brandSlug?: string;
  queryBrand?: string;
}

/**
 * Parse window.location.pathname + search into a structured route state
 */
export function parseSiteLocation(pathname: string, search: string = ''): ParsedSiteLocation {
  const cleanPath = (pathname || '/')
    .replace(/\/+$/g, '')
    .toLowerCase() || '/';

  const searchParams = new URLSearchParams(search || '');
  const queryBrand = searchParams.get('hang') || searchParams.get('brand') || undefined;
  const queryCat = searchParams.get('danh-muc') || searchParams.get('category') || undefined;

  if (cleanPath === '/' || cleanPath === '/trang-chu' || cleanPath === '/index.html') {
    if (queryCat || queryBrand) {
      return {
        page: 'products',
        categorySlug: queryCat,
        queryBrand
      };
    }
    return { page: 'home' };
  }

  const segments = cleanPath.split('/').filter(Boolean);
  const first = segments[0] || '';

  // 1. Product Catalog & Sub-routes (/san-pham-solar, /san-pham-solar/:categorySlug, /san-pham-solar/:categorySlug/:brandSlug)
  if (
    first === 'san-pham-solar' ||
    first === 'san-pham' ||
    first === 'danh-muc-san-pham' ||
    first === 'thiet-bi-solar'
  ) {
    return {
      page: 'products',
      categorySlug: segments[1] || queryCat,
      brandSlug: segments[2],
      queryBrand
    };
  }

  // 2. Direct top-level category aliases (e.g. /tam-pin-mat-troi, /bien-tan-inverter, /pin-luu-tru-ess, /tu-dien-solar, /vat-tu-solar)
  if (
    [
      'tam-pin-mat-troi',
      'tam-pin-solar',
      'bien-tan-inverter',
      'inverter-solar',
      'pin-luu-tru-ess',
      'pin-luu-tru',
      'tu-dien-solar',
      'vat-tu-solar',
      'phu-kien-solar',
      'den-nang-luong'
    ].includes(first)
  ) {
    const normalizedCatSlug =
      first === 'tam-pin-solar'
        ? 'tam-pin-mat-troi'
        : first === 'inverter-solar'
        ? 'bien-tan-inverter'
        : first === 'pin-luu-tru'
        ? 'pin-luu-tru-ess'
        : first === 'phu-kien-solar'
        ? 'vat-tu-solar'
        : first;
    return {
      page: 'products',
      categorySlug: normalizedCatSlug,
      brandSlug: segments[1],
      queryBrand
    };
  }

  // 3. Projects Page (/du-an-tieu-bieu, /du-an, /cong-trinh)
  if (first === 'du-an-tieu-bieu' || first === 'du-an' || first === 'cong-trinh') {
    return { page: 'projects' };
  }

  // 4. Blog Page (/blog-bai-viet, /blog, /tin-tuc, /bai-viet)
  if (
    first === 'blog-bai-viet' ||
    first === 'blog' ||
    first === 'tin-tuc' ||
    first === 'bai-viet'
  ) {
    return { page: 'blog' };
  }

  // 5. Company Profile Page (/gioi-thieu-cong-ty, /gioi-thieu, /ve-chung-toi)
  if (
    first === 'gioi-thieu-cong-ty' ||
    first === 'gioi-thieu' ||
    first === 've-chung-toi' ||
    first === 'ho-so-doanh-nghiep'
  ) {
    return { page: 'company' };
  }

  // 6. Contact & Quote Page (/lien-he-bao-gia, /lien-he, /bao-gia)
  if (first === 'lien-he-bao-gia' || first === 'lien-he' || first === 'bao-gia') {
    return { page: 'contact' };
  }

  // 7. HTML Sitemap Page (/so-do-trang-web, /sitemap)
  if (first === 'so-do-trang-web' || first === 'sitemap' || first === 'so-do-web') {
    return { page: 'sitemap' };
  }

  // Unknown single-segment slug might be a custom category slug created by Admin
  return {
    page: 'products',
    categorySlug: first,
    brandSlug: segments[1],
    queryBrand
  };
}
