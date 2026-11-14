import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import {
  Product,
  ProjectItem,
  CompanyInfo,
  CustomerInquiry,
  CategoryItem,
  BrandItem,
  BlogPost
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_PROJECTS,
  INITIAL_COMPANY_INFO,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_BLOG_POSTS
} from '../data/initialData';

export type AdminTabType = 'inventory' | 'categories-brands' | 'projects' | 'blog' | 'inquiries' | 'company' | 'backup';

interface AppContextType {
  products: Product[];
  categories: CategoryItem[];
  brands: BrandItem[];
  projects: ProjectItem[];
  blogPosts: BlogPost[];
  companyInfo: CompanyInfo;
  inquiries: CustomerInquiry[];
  isAdmin: boolean;
  selectedProduct: Product | null;
  quoteModalProduct: Product | null;
  isAdminModalOpen: boolean;
  adminActiveTab: AdminTabType;
  adminEditingProduct: Product | null;
  isSyncingCloud: boolean;
  selectedCategory: 'all' | string;
  selectedBrand: string;

  // Actions
  setSelectedProduct: (p: Product | null) => void;
  setSelectedCategory: (cat: 'all' | string) => void;
  setSelectedBrand: (brand: string) => void;
  selectCatalogFilter: (category: 'all' | string, brand?: string) => void;
  openQuoteModal: (product?: Product | null) => void;
  closeQuoteModal: () => void;
  setIsAdminModalOpen: (open: boolean) => void;
  setAdminActiveTab: (tab: AdminTabType) => void;
  openAdminTab: (tab: AdminTabType) => void;
  openEditProductInAdmin: (product: Product) => void;
  clearAdminEditingProduct: () => void;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Confirmation Dialog
  requestConfirm: (message: string, onConfirm: () => void, title?: string) => void;

  // Category Management
  addCategory: (cat: Omit<CategoryItem, 'id'> & { id?: string }) => CategoryItem;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string, onConfirmed?: () => void) => void;

  // Brand Management
  addBrand: (brand: Omit<BrandItem, 'id'>) => BrandItem;
  updateBrand: (id: string, updates: Partial<BrandItem>) => void;
  deleteBrand: (id: string, onConfirmed?: () => void) => void;
  deleteBrandByName: (name: string, categoryId?: string, onConfirmed?: () => void) => void;

  // Product Management
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string, onConfirmed?: () => void) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Project Management
  addProject: (proj: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, proj: Partial<ProjectItem>) => void;
  deleteProject: (id: string, onConfirmed?: () => void) => void;

  // Blog Management
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string, onConfirmed?: () => void) => void;

  // Company & Inquiries
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  submitInquiry: (name: string, phone: string, address?: string, note?: string, product?: string) => void;
  updateInquiryStatus: (id: string, status: CustomerInquiry['status']) => void;

  // System & Cloud Sync Tools
  syncAllToCloud: () => Promise<boolean>;
  resetToDefaults: (onConfirmed?: () => void) => void;
  exportBackup: () => string;
  importBackup: (
    jsonData: string,
    mode?: 'replace' | 'merge'
  ) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'dvs_products_v3',
  CATEGORIES: 'dvs_categories_v3',
  BRANDS: 'dvs_brands_v3',
  PROJECTS: 'dvs_projects_v2',
  BLOG_POSTS: 'dvs_blog_posts_v1',
  COMPANY: 'dvs_company_v1',
  INQUIRIES: 'dvs_inquiries_v1',
  ADMIN_AUTH: 'dvs_admin_auth',
  CLOUD_MIGRATED: 'dvs_cloud_migrated_v4'
};

// Natural order maps for default items so Firestore snapshots always sort deterministically
const INITIAL_CATEGORY_ORDER = new Map<string, number>(
  INITIAL_CATEGORIES.map((c, idx) => [c.id, idx])
);
const INITIAL_BRAND_ORDER = new Map<string, number>(
  INITIAL_BRANDS.map((b, idx) => [b.id, idx])
);
const INITIAL_PRODUCT_ORDER = new Map<string, number>(
  INITIAL_PRODUCTS.map((p, idx) => [p.id, idx])
);
const INITIAL_PROJECT_ORDER = new Map<string, number>(
  INITIAL_PROJECTS.map((pr, idx) => [pr.id, idx])
);
const INITIAL_BLOG_ORDER = new Map<string, number>(
  INITIAL_BLOG_POSTS.map((bp, idx) => [bp.id, idx])
);

/**
 * Recursively strips `undefined` properties so Firestore setDoc never fails
 */
function cleanForFirestore<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => cleanForFirestore(item)) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  Object.entries(obj as Record<string, any>).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = cleanForFirestore(value);
    }
  });
  return cleaned as T;
}

/**
 * Compresses a single base64 data:image string if it exceeds maxChars
 */
function compressDataUrl(dataUrl: string, maxDim = 600, quality = 0.55): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return Promise.resolve(dataUrl);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Guarantees that an array of image URLs / base64 strings will fit safely inside a single
 * Firestore document (< 700,000 bytes total) so Firestore never rejects a Product or Project write.
 */
async function ensureFirestoreSafeImages(images: string[] | undefined): Promise<string[]> {
  if (!Array.isArray(images) || images.length === 0) return [];
  const valid = images.filter((s) => typeof s === 'string' && s.trim().length > 0);
  if (valid.length === 0) return [];

  // Target budget for all images in a single Firestore document: ~620,000 chars
  const TOTAL_CHAR_BUDGET = 620000;
  const perImageBudget = Math.min(80000, Math.floor(TOTAL_CHAR_BUDGET / Math.max(1, valid.length)));

  const processed: string[] = [];
  for (const imgStr of valid) {
    if (imgStr.startsWith('data:image/') && imgStr.length > perImageBudget) {
      let step1 = await compressDataUrl(imgStr, 600, 0.55);
      if (step1.length > perImageBudget) {
        step1 = await compressDataUrl(step1, 440, 0.48);
      }
      if (step1.length > perImageBudget) {
        step1 = await compressDataUrl(step1, 340, 0.42);
      }
      processed.push(step1);
    } else {
      processed.push(imgStr);
    }
  }

  // Final safety check on total size
  const finalResult: string[] = [];
  let runningChars = 0;
  for (const item of processed) {
    if (runningChars + item.length <= 750000) {
      finalResult.push(item);
      runningChars += item.length;
    }
  }
  return finalResult;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial categories from localStorage or defaults before Firestore sync
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!saved) return INITIAL_CATEGORIES;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_CATEGORIES;
      return parsed
        .filter((c: any) => c?.id !== 'power-savers')
        .map((c: any, idx: number) => ({
          id: c?.id || `cat-${idx}`,
          label: c?.label || 'Danh mục',
          shortLabel: c?.shortLabel || c?.label || 'Danh mục',
          desc: c?.desc || '',
          iconName: c?.iconName || 'Package'
        }));
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Load initial brands
  const [brands, setBrands] = useState<BrandItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (!saved) return INITIAL_BRANDS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_BRANDS;
      return parsed
        .filter((b: any) => b?.categoryId !== 'power-savers')
        .map((b: any, idx: number) => ({
          id: b?.id || `br-${idx}`,
          name: b?.name || 'Hãng khác',
          categoryId: b?.categoryId || 'solar-panels',
          origin: b?.origin || 'Chính hãng'
        }));
    } catch {
      return INITIAL_BRANDS;
    }
  });

  // Load initial products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!saved) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_PRODUCTS;
      return parsed
        .filter((p: any) => p?.category !== 'power-savers')
        .map((p: any, idx: number) => {
          const imgs = Array.isArray(p?.images)
            ? p.images.filter(Boolean)
            : p?.imageUrl
            ? [p.imageUrl]
            : [];
          return {
            id: p?.id || `prod-${idx}`,
            sku: p?.sku || `DVS-${idx + 1}`,
            name: p?.name || 'Sản phẩm Đức Vinh Solar',
            category: p?.category || 'solar-panels',
            brand: p?.brand || 'Đức Vinh Solar',
            shortDesc: p?.shortDesc || '',
            fullDesc: p?.fullDesc || p?.shortDesc || '',
            stock: typeof p?.stock === 'number' ? p.stock : Number(p?.stock) || 0,
            unit: p?.unit || 'bộ',
            featured: Boolean(p?.featured),
            imageUrl: imgs[0] || p?.imageUrl,
            images: imgs,
            svgType: p?.svgType || 'panel',
            specs: Array.isArray(p?.specs) ? p.specs : [],
            highlights: Array.isArray(p?.highlights) ? p.highlights : [],
            applications: Array.isArray(p?.applications) ? p.applications : [],
            warrantyYears: Number(p?.warrantyYears) || 10,
            origin: p?.origin || 'Chính hãng',
            status: p?.status || 'in-stock',
            updatedAt: p?.updatedAt || '2026-11-03'
          };
        });
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Load initial projects
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!saved) return INITIAL_PROJECTS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_PROJECTS;
      return parsed.map((proj: any, idx: number) => {
        const imgs = Array.isArray(proj?.images)
          ? proj.images.filter(Boolean)
          : proj?.imageUrl
          ? [proj.imageUrl]
          : [];
        return {
          ...INITIAL_PROJECTS[0],
          ...proj,
          id: proj?.id || `proj-${idx}`,
          imageUrl: imgs[0] || proj?.imageUrl,
          images: imgs,
          keyEquipment: Array.isArray(proj?.keyEquipment) ? proj.keyEquipment : []
        };
      });
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Load initial blog posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
      if (!saved) return INITIAL_BLOG_POSTS;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_BLOG_POSTS;
      return parsed.map((bp: any, idx: number) => {
        const imgs = Array.isArray(bp?.images)
          ? bp.images.filter(Boolean)
          : bp?.imageUrl
          ? [bp.imageUrl]
          : [];
        return {
          ...INITIAL_BLOG_POSTS[0],
          ...bp,
          id: bp?.id || `blog-${idx}`,
          imageUrl: imgs[0] || bp?.imageUrl,
          images: imgs,
          tags: Array.isArray(bp?.tags) ? bp.tags : []
        };
      });
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  });

  // Load initial company info
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANY);
      if (!saved) return INITIAL_COMPANY_INFO;
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_COMPANY_INFO,
        ...parsed,
        warehouseAddress: parsed?.warehouseAddress || INITIAL_COMPANY_INFO.warehouseAddress,
        warehouseMapUrl: parsed?.warehouseMapUrl || INITIAL_COMPANY_INFO.warehouseMapUrl,
        affiliatedUnits: Array.isArray(parsed?.affiliatedUnits)
          ? parsed.affiliatedUnits
          : INITIAL_COMPANY_INFO.affiliatedUnits
      };
    } catch {
      return INITIAL_COMPANY_INFO;
    }
  });

  // Load initial inquiries
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'inq-sample-1',
              customerName: 'Anh Tuấn',
              phone: '0908123456',
              address: 'Xã Đông Thạnh, Hóc Môn',
              productInterest: 'Tấm Pin Năng Lượng Mặt Trời Longi Hi-MO 6 Explorer 580W',
              note: 'Cần tư vấn lắp áp mái tôn 10kWp cho xưởng gia đình.',
              createdAt: '2026-11-02 14:30',
              status: 'new'
            }
          ];
    } catch {
      return [];
    }
  });

  // Admin Auth state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Sync state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteModalProduct, setQuoteModalProduct] = useState<Product | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTabType>('inventory');
  const [adminEditingProduct, setAdminEditingProduct] = useState<Product | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const selectCatalogFilter = (category: 'all' | string, brand: string = 'all') => {
    setSelectedCategory(category);
    setSelectedBrand(brand);
  };

  // Custom Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const requestConfirm = (
    message: string,
    onConfirm: () => void,
    title = 'Xác Nhận Xóa'
  ) => {
    setConfirmDialog({
      title,
      message,
      onConfirm
    });
  };

  const openAdminTab = (tab: AdminTabType) => {
    setAdminActiveTab(tab);
    setIsAdminModalOpen(true);
  };

  const openEditProductInAdmin = (product: Product) => {
    setAdminEditingProduct(product);
    setAdminActiveTab('inventory');
    setIsAdminModalOpen(true);
  };

  const clearAdminEditingProduct = () => {
    setAdminEditingProduct(null);
  };

  // Helper functions to write to PostgreSQL (/api/*) & Firestore with structured error handling & automatic image compression
  const postToPostgresApi = async (endpoint: string, body: unknown) => {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.warn(`PostgreSQL API sync warning (${endpoint}):`, err);
    }
  };

  const deleteFromPostgresApi = async (endpoint: string) => {
    try {
      await fetch(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.warn(`PostgreSQL API delete warning (${endpoint}):`, err);
    }
  };

  const saveCategoryToCloud = async (cat: CategoryItem, orderIndex?: number) => {
    void postToPostgresApi('/api/categories', cat);
    const path = `categories/${cat.id}`;
    try {
      const order =
        typeof orderIndex === 'number'
          ? orderIndex
          : INITIAL_CATEGORY_ORDER.get(cat.id) ?? Date.now();
      await setDoc(doc(db, 'categories', cat.id), cleanForFirestore({ ...cat, order }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveBrandToCloud = async (brand: BrandItem, orderIndex?: number) => {
    void postToPostgresApi('/api/brands', brand);
    const path = `brands/${brand.id}`;
    try {
      const order =
        typeof orderIndex === 'number'
          ? orderIndex
          : INITIAL_BRAND_ORDER.get(brand.id) ?? Date.now();
      await setDoc(doc(db, 'brands', brand.id), cleanForFirestore({ ...brand, order }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveProductToCloud = async (prod: Product, orderIndex?: number) => {
    void postToPostgresApi('/api/products', prod);
    const path = `products/${prod.id}`;
    try {
      const safeImages = await ensureFirestoreSafeImages(
        Array.isArray(prod.images) && prod.images.length > 0
          ? prod.images
          : prod.imageUrl
          ? [prod.imageUrl]
          : []
      );
      const order =
        typeof orderIndex === 'number'
          ? orderIndex
          : INITIAL_PRODUCT_ORDER.has(prod.id)
          ? INITIAL_PRODUCT_ORDER.get(prod.id)!
          : -1000;
      const payload = cleanForFirestore({
        ...prod,
        images: safeImages,
        imageUrl: safeImages[0] || undefined,
        order
      });
      await setDoc(doc(db, 'products', prod.id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveProjectToCloud = async (proj: ProjectItem, orderIndex?: number) => {
    void postToPostgresApi('/api/projects', proj);
    const path = `projects/${proj.id}`;
    try {
      const safeImages = await ensureFirestoreSafeImages(
        Array.isArray(proj.images) && proj.images.length > 0
          ? proj.images
          : proj.imageUrl
          ? [proj.imageUrl]
          : []
      );
      const order =
        typeof orderIndex === 'number'
          ? orderIndex
          : INITIAL_PROJECT_ORDER.has(proj.id)
          ? INITIAL_PROJECT_ORDER.get(proj.id)!
          : -1000;
      const payload = cleanForFirestore({
        ...proj,
        images: safeImages,
        imageUrl: safeImages[0] || undefined,
        order
      });
      await setDoc(doc(db, 'projects', proj.id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveBlogPostToCloud = async (post: BlogPost, orderIndex?: number) => {
    void postToPostgresApi('/api/blog-posts', post);
    const path = `blogPosts/${post.id}`;
    try {
      const safeImages = await ensureFirestoreSafeImages(
        Array.isArray(post.images) && post.images.length > 0
          ? post.images
          : post.imageUrl
          ? [post.imageUrl]
          : []
      );
      const order =
        typeof orderIndex === 'number'
          ? orderIndex
          : INITIAL_BLOG_ORDER.has(post.id)
          ? INITIAL_BLOG_ORDER.get(post.id)!
          : -1000;
      const payload = cleanForFirestore({
        ...post,
        images: safeImages,
        imageUrl: safeImages[0] || undefined,
        order
      });
      await setDoc(doc(db, 'blogPosts', post.id), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveCompanyToCloud = async (info: CompanyInfo) => {
    void postToPostgresApi('/api/company-info', info);
    const path = 'settings/companyInfo';
    try {
      await setDoc(doc(db, 'settings', 'companyInfo'), cleanForFirestore(info));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveInquiryToCloud = async (inq: CustomerInquiry) => {
    void postToPostgresApi('/api/inquiries', inq);
    const path = `inquiries/${inq.id}`;
    try {
      await setDoc(doc(db, 'inquiries', inq.id), cleanForFirestore(inq));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Real-time Firestore Cloud Sync Effect
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let unsubCategories: (() => void) | undefined;
    let unsubBrands: (() => void) | undefined;
    let unsubProducts: (() => void) | undefined;
    let unsubProjects: (() => void) | undefined;
    let unsubBlogPosts: (() => void) | undefined;
    let unsubCompany: (() => void) | undefined;
    let unsubInquiries: (() => void) | undefined;
    let cancelled = false;

    const initFirestoreSync = async () => {
      // Load from Hosting Database (/api/state -> MySQL/SQLite on Linux Hosting or PostgreSQL on VPS)
      try {
        const pgRes = await fetch('/api/state');
        if (pgRes.ok) {
          const pgData = await pgRes.json();
          const hasHostingData =
            Array.isArray(pgData.categories) && pgData.categories.length > 0;
          if (!hasHostingData) {
            // Auto-seed the Linux Hosting database on very first visit
            await postToPostgresApi('/api/seed', {
              categories: categories.length > 0 ? categories : INITIAL_CATEGORIES,
              brands: brands.length > 0 ? brands : INITIAL_BRANDS,
              products: products.length > 0 ? products : INITIAL_PRODUCTS,
              projects: projects.length > 0 ? projects : INITIAL_PROJECTS,
              blogPosts: blogPosts.length > 0 ? blogPosts : INITIAL_BLOG_POSTS,
              inquiries,
              companyInfo: companyInfo || INITIAL_COMPANY_INFO,
            });
          } else if (!cancelled) {
            if (Array.isArray(pgData.categories) && pgData.categories.length > 0) {
              setCategories(pgData.categories);
            }
            if (Array.isArray(pgData.brands) && pgData.brands.length > 0) {
              setBrands(pgData.brands);
            }
            if (Array.isArray(pgData.products) && pgData.products.length > 0) {
              setProducts(pgData.products);
            }
            if (Array.isArray(pgData.projects) && pgData.projects.length > 0) {
              setProjects(pgData.projects);
            }
            if (Array.isArray(pgData.blogPosts) && pgData.blogPosts.length > 0) {
              setBlogPosts(pgData.blogPosts);
            }
            if (Array.isArray(pgData.inquiries) && pgData.inquiries.length > 0) {
              setInquiries(pgData.inquiries);
            }
            if (pgData.companyInfo) {
              setCompanyInfo((prev) => ({ ...prev, ...pgData.companyInfo }));
            }
          }
        }
      } catch (pgErr) {
        console.warn('Hosting database /api/state load warning:', pgErr);
      }

      try {
        const seedDocRef = doc(db, 'settings', 'seedMeta');
        const [seedSnap, catCheckSnap, brandCheckSnap, prodCheckSnap, projCheckSnap, blogCheckSnap] =
          await Promise.all([
            getDoc(seedDocRef),
            getDocs(collection(db, 'categories')),
            getDocs(collection(db, 'brands')),
            getDocs(collection(db, 'products')),
            getDocs(collection(db, 'projects')),
            getDocs(collection(db, 'blogPosts'))
          ]);

        const seedExists = seedSnap.exists();

        // 1. Seed any empty collections if initial seed has not completed
        if (!seedExists || catCheckSnap.empty) {
          const catsToSeed = categories.length > 0 ? categories : INITIAL_CATEGORIES;
          await Promise.all(
            catsToSeed.map((c, idx) => saveCategoryToCloud(c, idx))
          );
        }

        if (!seedExists || brandCheckSnap.empty) {
          const brandsToSeed = brands.length > 0 ? brands : INITIAL_BRANDS;
          await Promise.all(
            brandsToSeed.map((b, idx) => saveBrandToCloud(b, idx))
          );
        }

        if (!seedExists || prodCheckSnap.empty) {
          const prodsToSeed = products.length > 0 ? products : INITIAL_PRODUCTS;
          await Promise.all(
            prodsToSeed.map((p, idx) => saveProductToCloud(p, idx))
          );
        }

        if (!seedExists || projCheckSnap.empty) {
          const projsToSeed = projects.length > 0 ? projects : INITIAL_PROJECTS;
          await Promise.all(
            projsToSeed.map((pr, idx) => saveProjectToCloud(pr, idx))
          );
        }

        if (!seedExists || blogCheckSnap.empty) {
          const blogsToSeed = blogPosts.length > 0 ? blogPosts : INITIAL_BLOG_POSTS;
          await Promise.all(
            blogsToSeed.map((bp, idx) => saveBlogPostToCloud(bp, idx))
          );
        }

        if (!seedExists) {
          await Promise.all([
            saveCompanyToCloud(companyInfo),
            ...inquiries.map((inq) => saveInquiryToCloud(inq)),
            setDoc(seedDocRef, {
              seeded: true,
              seedVersion: 4,
              updatedAt: new Date().toISOString()
            })
          ]);
        }

        // 2. One-time migration: if this browser had custom user-created items in localStorage
        // that failed to upload earlier (e.g. due to >1MB images), push them to Firestore now!
        const alreadyMigrated = localStorage.getItem(STORAGE_KEYS.CLOUD_MIGRATED) === 'true';
        if (!alreadyMigrated) {
          const cloudCatIds = new Set(catCheckSnap.docs.map((d) => d.id));
          const cloudBrandIds = new Set(brandCheckSnap.docs.map((d) => d.id));
          const cloudProdIds = new Set(prodCheckSnap.docs.map((d) => d.id));
          const cloudProjIds = new Set(projCheckSnap.docs.map((d) => d.id));

          // Upload any custom categories created on this browser (`cat-...`) not yet in cloud
          const customCats = categories.filter(
            (c) => c.id.startsWith('cat-') && !cloudCatIds.has(c.id)
          );
          // Upload any custom brands created on this browser (`br-...` with timestamp) not yet in cloud
          const customBrands = brands.filter(
            (b) => !INITIAL_BRAND_ORDER.has(b.id) && !cloudBrandIds.has(b.id)
          );
          // Upload any custom products created on this browser (`prod-...`) not yet in cloud
          const customProds = products.filter(
            (p) => !INITIAL_PRODUCT_ORDER.has(p.id) && !cloudProdIds.has(p.id)
          );
          // Upload any custom projects created on this browser (`proj-...` with timestamp) not yet in cloud
          const customProjs = projects.filter(
            (pr) => !INITIAL_PROJECT_ORDER.has(pr.id) && !cloudProjIds.has(pr.id)
          );

          if (
            customCats.length > 0 ||
            customBrands.length > 0 ||
            customProds.length > 0 ||
            customProjs.length > 0
          ) {
            await Promise.all([
              ...customCats.map((c, i) => saveCategoryToCloud(c, 100 + i)),
              ...customBrands.map((b, i) => saveBrandToCloud(b, 100 + i)),
              ...customProds.map((p, i) => saveProductToCloud(p, -1000 - i)),
              ...customProjs.map((pr, i) => saveProjectToCloud(pr, -1000 - i))
            ]);
          }
          localStorage.setItem(STORAGE_KEYS.CLOUD_MIGRATED, 'true');
        }
      } catch (err) {
        console.warn('Firestore initial seed check warning:', err);
      }

      if (cancelled) return;

      // 3. Attach real-time listeners so all devices share identical live state
      unsubCategories = onSnapshot(
        collection(db, 'categories'),
        (snap) => {
          const list: (CategoryItem & { order: number })[] = [];
          snap.forEach((docSnap) => {
            const d = docSnap.data();
            if (d && d.id && d.id !== 'power-savers') {
              const fallbackOrder = INITIAL_CATEGORY_ORDER.get(d.id) ?? 999;
              list.push({
                id: d.id,
                label: d.label || 'Danh mục',
                shortLabel: d.shortLabel || d.label || 'Danh mục',
                desc: d.desc || '',
                iconName: d.iconName || 'Package',
                order: typeof d.order === 'number' ? d.order : fallbackOrder
              });
            }
          });
          list.sort((a, b) => a.order - b.order);
          if (list.length > 0 || !snap.metadata.fromCache) {
            setCategories(list.map(({ order, ...rest }) => rest));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'categories');
        }
      );

      unsubBrands = onSnapshot(
        collection(db, 'brands'),
        (snap) => {
          const list: (BrandItem & { order: number })[] = [];
          snap.forEach((docSnap) => {
            const d = docSnap.data();
            if (d && d.id && d.categoryId !== 'power-savers') {
              const fallbackOrder = INITIAL_BRAND_ORDER.get(d.id) ?? 999;
              list.push({
                id: d.id,
                name: d.name || 'Hãng khác',
                categoryId: d.categoryId || 'solar-panels',
                origin: d.origin || 'Chính hãng',
                order: typeof d.order === 'number' ? d.order : fallbackOrder
              });
            }
          });
          list.sort((a, b) => a.order - b.order);
          if (list.length > 0 || !snap.metadata.fromCache) {
            setBrands(list.map(({ order, ...rest }) => rest));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'brands');
        }
      );

      unsubProducts = onSnapshot(
        collection(db, 'products'),
        (snap) => {
          const list: (Product & { order: number })[] = [];
          snap.forEach((docSnap) => {
            const p = docSnap.data();
            if (p && p.id && p.category !== 'power-savers') {
              const imgs = Array.isArray(p.images)
                ? p.images.filter(Boolean)
                : p.imageUrl
                ? [p.imageUrl]
                : [];
              const fallbackOrder = INITIAL_PRODUCT_ORDER.has(p.id)
                ? INITIAL_PRODUCT_ORDER.get(p.id)!
                : -500;
              list.push({
                id: p.id,
                sku: p.sku || 'DVS',
                name: p.name || 'Sản phẩm Đức Vinh Solar',
                category: p.category || 'solar-panels',
                brand: p.brand || 'Đức Vinh Solar',
                shortDesc: p.shortDesc || '',
                fullDesc: p.fullDesc || p.shortDesc || '',
                stock: typeof p.stock === 'number' ? p.stock : Number(p.stock) || 0,
                unit: p.unit || 'bộ',
                featured: Boolean(p.featured),
                imageUrl: imgs[0] || p.imageUrl,
                images: imgs,
                svgType: p.svgType || 'panel',
                specs: Array.isArray(p.specs) ? p.specs : [],
                highlights: Array.isArray(p.highlights) ? p.highlights : [],
                applications: Array.isArray(p.applications) ? p.applications : [],
                warrantyYears: Number(p.warrantyYears) || 10,
                origin: p.origin || 'Chính hãng',
                status: p.status || 'in-stock',
                updatedAt: p.updatedAt || '2026-11-03',
                order: typeof p.order === 'number' ? p.order : fallbackOrder
              });
            }
          });
          list.sort((a, b) => a.order - b.order);
          if (list.length > 0 || !snap.metadata.fromCache) {
            const cleanedList = list.map(({ order, ...rest }) => rest);
            setProducts(cleanedList);
            setSelectedProduct((prevSelected) => {
              if (!prevSelected) return null;
              const updated = cleanedList.find((item) => item.id === prevSelected.id);
              return updated || null;
            });
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'products');
        }
      );

      unsubProjects = onSnapshot(
        collection(db, 'projects'),
        (snap) => {
          const list: (ProjectItem & { order: number })[] = [];
          snap.forEach((docSnap) => {
            const proj = docSnap.data();
            if (proj && proj.id) {
              const imgs = Array.isArray(proj.images)
                ? proj.images.filter(Boolean)
                : proj.imageUrl
                ? [proj.imageUrl]
                : [];
              const fallbackOrder = INITIAL_PROJECT_ORDER.has(proj.id)
                ? INITIAL_PROJECT_ORDER.get(proj.id)!
                : -500;
              list.push({
                id: proj.id,
                title: proj.title || 'Dự án Đức Vinh Solar',
                location: proj.location || 'TP. Hồ Chí Minh',
                capacity: proj.capacity || '10 kWp',
                category: proj.category || 'residential',
                completionDate: proj.completionDate || '2026',
                description: proj.description || '',
                keyEquipment: Array.isArray(proj.keyEquipment) ? proj.keyEquipment : [],
                estimatedSaving: proj.estimatedSaving || '',
                svgType: proj.svgType || 'rooftop',
                imageUrl: imgs[0] || proj.imageUrl,
                images: imgs,
                order: typeof proj.order === 'number' ? proj.order : fallbackOrder
              });
            }
          });
          list.sort((a, b) => a.order - b.order);
          if (list.length > 0 || !snap.metadata.fromCache) {
            setProjects(list.map(({ order, ...rest }) => rest));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'projects');
        }
      );

      unsubBlogPosts = onSnapshot(
        collection(db, 'blogPosts'),
        (snap) => {
          const list: (BlogPost & { order: number })[] = [];
          snap.forEach((docSnap) => {
            const bp = docSnap.data();
            if (bp && bp.id) {
              const imgs = Array.isArray(bp.images)
                ? bp.images.filter(Boolean)
                : bp.imageUrl
                ? [bp.imageUrl]
                : [];
              const fallbackOrder = INITIAL_BLOG_ORDER.has(bp.id)
                ? INITIAL_BLOG_ORDER.get(bp.id)!
                : -500;
              list.push({
                id: bp.id,
                title: bp.title || 'Bài viết Đức Vinh Solar',
                category: bp.category || 'Kinh Nghiệm Điện Mặt Trời',
                author: bp.author || 'Kỹ Sư Đức Vinh Solar',
                publishedAt: bp.publishedAt || '2026',
                readTime: bp.readTime || '5 phút đọc',
                summary: bp.summary || '',
                content: bp.content || bp.summary || '',
                tags: Array.isArray(bp.tags) ? bp.tags : [],
                imageUrl: imgs[0] || bp.imageUrl,
                images: imgs,
                order: typeof bp.order === 'number' ? bp.order : fallbackOrder
              });
            }
          });
          list.sort((a, b) => a.order - b.order);
          if (list.length > 0 || !snap.metadata.fromCache) {
            setBlogPosts(list.map(({ order, ...rest }) => rest));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'blogPosts');
        }
      );

      unsubCompany = onSnapshot(
        doc(db, 'settings', 'companyInfo'),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const mergedCompany: CompanyInfo = {
              ...INITIAL_COMPANY_INFO,
              ...data,
              warehouseAddress: data?.warehouseAddress || INITIAL_COMPANY_INFO.warehouseAddress,
              warehouseMapUrl: data?.warehouseMapUrl || INITIAL_COMPANY_INFO.warehouseMapUrl,
              affiliatedUnits: Array.isArray(data?.affiliatedUnits)
                ? data.affiliatedUnits
                : INITIAL_COMPANY_INFO.affiliatedUnits
            };
            setCompanyInfo(mergedCompany);
            if (
              !data?.warehouseMapUrl ||
              !data?.warehouseAddress
            ) {
              void saveCompanyToCloud(mergedCompany);
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'settings/companyInfo');
        }
      );

      unsubInquiries = onSnapshot(
        collection(db, 'inquiries'),
        (snap) => {
          const list: CustomerInquiry[] = [];
          snap.forEach((docSnap) => {
            const d = docSnap.data();
            if (d && d.id) {
              list.push({
                id: d.id,
                customerName: d.customerName || 'Khách hàng',
                phone: d.phone || '',
                address: d.address,
                productInterest: d.productInterest,
                note: d.note,
                createdAt: d.createdAt || '',
                status: d.status || 'new'
              });
            }
          });
          if (list.length > 0 || !snap.metadata.fromCache) {
            setInquiries(list);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'inquiries');
        }
      );
    };

    initFirestoreSync();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      if (unsubCategories) unsubCategories();
      if (unsubBrands) unsubBrands();
      if (unsubProducts) unsubProducts();
      if (unsubProjects) unsubProjects();
      if (unsubBlogPosts) unsubBlogPosts();
      if (unsubCompany) unsubCompany();
      if (unsubInquiries) unsubInquiries();
    };
  }, []);

  // Keep localStorage synced as a fast offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('LocalStorage cache warning:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    } catch (e) {
      console.warn('LocalStorage cache warning:', e);
    }
  }, [brands]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage cache warning:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage cache warning:', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(blogPosts));
    } catch (e) {
      console.warn('LocalStorage cache warning:', e);
    }
  }, [blogPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(companyInfo));
    } catch (e) {
      console.warn('LocalStorage cache warning:', e);
    }
  }, [companyInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.warn('LocalStorage cache warning:', e);
    }
  }, [inquiries]);

  // Auth operations
  const loginAdmin = (user: string, pass: string): boolean => {
    const trimmedUser = user.trim().toLowerCase();
    const isUserValid = trimmedUser === 'admin' || trimmedUser === 'adimn';
    const isPassValid = pass === 'DucVinh@123';

    if (isUserValid && isPassValid) {
      setIsAdmin(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  // Category Operations
  const addCategory = (catData: Omit<CategoryItem, 'id'> & { id?: string }): CategoryItem => {
    const newId = catData.id?.trim() || `cat-${Date.now()}`;
    const newCat: CategoryItem = {
      id: newId,
      label: catData.label.trim(),
      shortLabel: (catData.shortLabel || catData.label).trim(),
      desc: catData.desc.trim(),
      iconName: catData.iconName || 'Package'
    };
    const nextOrder = categories.length + 10;
    setCategories((prev) => [...prev, newCat]);
    void saveCategoryToCloud(newCat, nextOrder);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    const existingIdx = categories.findIndex((c) => c.id === id);
    const existingCat = existingIdx >= 0 ? categories[existingIdx] : undefined;
    const updatedCat: CategoryItem = {
      id,
      label: (updates.label ?? existingCat?.label ?? 'Danh mục').trim(),
      shortLabel: (updates.shortLabel ?? updates.label ?? existingCat?.shortLabel ?? 'Danh mục').trim(),
      desc: (updates.desc ?? existingCat?.desc ?? '').trim(),
      iconName: updates.iconName ?? existingCat?.iconName ?? 'Package'
    };
    setCategories((prev) => prev.map((c) => (c.id === id ? updatedCat : c)));
    void saveCategoryToCloud(updatedCat, existingIdx >= 0 ? existingIdx : 99);
  };

  const deleteCategory = (id: string, onConfirmed?: () => void) => {
    const targetCat = categories.find((c) => c.id === id);
    const label = targetCat ? `"${targetCat.label}"` : 'loại thiết bị này';
    requestConfirm(
      `Bạn chắc chắn muốn xóa loại thiết bị ${label} (cùng các hãng và sản phẩm thuộc loại này) hay không?`,
      async () => {
        const brandsToRemove = brands.filter((b) => b.categoryId === id);
        const productsToRemove = products.filter((p) => p.category === id);

        setCategories((prev) => prev.filter((c) => c.id !== id));
        setBrands((prev) => prev.filter((b) => b.categoryId !== id));
        setProducts((prev) => prev.filter((p) => p.category !== id));
        if (selectedProduct && selectedProduct.category === id) {
          setSelectedProduct(null);
        }
        if (onConfirmed) onConfirmed();

        void deleteFromPostgresApi(`/api/categories/${encodeURIComponent(id)}`);
        brandsToRemove.forEach((b) => void deleteFromPostgresApi(`/api/brands/${encodeURIComponent(b.id)}`));
        productsToRemove.forEach((p) => void deleteFromPostgresApi(`/api/products/${encodeURIComponent(p.id)}`));

        try {
          await deleteDoc(doc(db, 'categories', id));
          await Promise.all([
            ...brandsToRemove.map((b) => deleteDoc(doc(db, 'brands', b.id))),
            ...productsToRemove.map((p) => deleteDoc(doc(db, 'products', p.id)))
          ]);
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
        }
      }
    );
  };

  // Brand Operations
  const addBrand = (brandData: Omit<BrandItem, 'id'>): BrandItem => {
    const newBrand: BrandItem = {
      id: `br-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: brandData.name.trim(),
      categoryId: brandData.categoryId,
      origin: brandData.origin?.trim() || 'Chính hãng'
    };
    const nextOrder = brands.length + 10;
    setBrands((prev) => [...prev, newBrand]);
    void saveBrandToCloud(newBrand, nextOrder);
    return newBrand;
  };

  const updateBrand = (id: string, updates: Partial<BrandItem>) => {
    const existingIdx = brands.findIndex((b) => b.id === id);
    const targetBrand = existingIdx >= 0 ? brands[existingIdx] : undefined;

    const updatedBrand: BrandItem = {
      id: targetBrand ? targetBrand.id : id.startsWith('inferred-') ? `br-${Date.now()}` : id,
      name: (updates.name ?? targetBrand?.name ?? 'Hãng chính hãng').trim(),
      categoryId: updates.categoryId ?? targetBrand?.categoryId ?? 'solar-panels',
      origin: (updates.origin ?? targetBrand?.origin ?? 'Chính hãng').trim()
    };

    if (targetBrand) {
      setBrands((prev) => prev.map((b) => (b.id === id ? updatedBrand : b)));
      void saveBrandToCloud(updatedBrand, existingIdx);
    } else {
      setBrands((prev) => [...prev, updatedBrand]);
      void saveBrandToCloud(updatedBrand, brands.length + 10);
    }

    const oldName = targetBrand?.name;
    const oldCat = targetBrand?.categoryId ?? updatedBrand.categoryId;
    if (oldName && updatedBrand.name.toLowerCase() !== oldName.trim().toLowerCase()) {
      const prodsToUpdate: Product[] = [];
      setProducts((prev) =>
        prev.map((p) => {
          if (
            p.category === oldCat &&
            p.brand.trim().toLowerCase() === oldName.trim().toLowerCase()
          ) {
            const updatedProd = { ...p, brand: updatedBrand.name };
            prodsToUpdate.push(updatedProd);
            return updatedProd;
          }
          return p;
        })
      );
      prodsToUpdate.forEach((up) => {
        void saveProductToCloud(up);
      });
    }
  };

  const deleteBrand = (id: string, onConfirmed?: () => void) => {
    const target = brands.find((b) => b.id === id);
    const brandLabel = target ? `"${target.name}"` : 'hãng này';
    requestConfirm(
      `Bạn chắc chắn muốn xóa hãng ${brandLabel} (và các sản phẩm thuộc hãng này) hay không?`,
      async () => {
        const productsToRemove = target
          ? products.filter(
              (p) =>
                p.category === target.categoryId &&
                (p.brand || '').trim().toLowerCase() === target.name.trim().toLowerCase()
            )
          : [];

        setBrands((prev) => prev.filter((b) => b.id !== id));
        if (target) {
          const targetNameLower = target.name.trim().toLowerCase();
          setProducts((prev) =>
            prev.filter(
              (p) =>
                !(
                  p.category === target.categoryId &&
                  (p.brand || '').trim().toLowerCase() === targetNameLower
                )
            )
          );
        }
        if (onConfirmed) onConfirmed();

        void deleteFromPostgresApi(`/api/brands/${encodeURIComponent(id)}`);
        productsToRemove.forEach((p) => void deleteFromPostgresApi(`/api/products/${encodeURIComponent(p.id)}`));

        try {
          await deleteDoc(doc(db, 'brands', id));
          await Promise.all(
            productsToRemove.map((p) => deleteDoc(doc(db, 'products', p.id)))
          );
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `brands/${id}`);
        }
      }
    );
  };

  const deleteBrandByName = (name: string, categoryId?: string, onConfirmed?: () => void) => {
    const targetNameLower = name.trim().toLowerCase();
    requestConfirm(
      `Bạn chắc chắn muốn xóa hãng "${name}" hay không?`,
      async () => {
        const matchingBrands = brands.filter((b) => {
          const matchName = b.name.trim().toLowerCase() === targetNameLower;
          const matchCat = !categoryId || categoryId === 'all' ? true : b.categoryId === categoryId;
          return matchName && matchCat;
        });
        const matchingProducts = products.filter((p) => {
          const matchName = (p.brand || '').trim().toLowerCase() === targetNameLower;
          const matchCat = !categoryId || categoryId === 'all' ? true : p.category === categoryId;
          return matchName && matchCat;
        });

        setBrands((prev) =>
          prev.filter((b) => {
            const matchName = b.name.trim().toLowerCase() === targetNameLower;
            const matchCat = !categoryId || categoryId === 'all' ? true : b.categoryId === categoryId;
            return !(matchName && matchCat);
          })
        );
        setProducts((prev) =>
          prev.filter((p) => {
            const matchName = (p.brand || '').trim().toLowerCase() === targetNameLower;
            const matchCat = !categoryId || categoryId === 'all' ? true : p.category === categoryId;
            return !(matchName && matchCat);
          })
        );
        if (onConfirmed) onConfirmed();

        try {
          await Promise.all([
            ...matchingBrands.map((b) => deleteDoc(doc(db, 'brands', b.id))),
            ...matchingProducts.map((p) => deleteDoc(doc(db, 'products', p.id)))
          ]);
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, 'brands');
        }
      }
    );
  };

  // Product Operations
  const addProduct = (prodData: Omit<Product, 'id' | 'updatedAt'>) => {
    const cleanImages = Array.isArray(prodData.images)
      ? prodData.images.filter(Boolean)
      : prodData.imageUrl
      ? [prodData.imageUrl]
      : [];
    const newProduct: Product = {
      ...prodData,
      images: cleanImages,
      imageUrl: cleanImages[0] || prodData.imageUrl,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    // Place newly added product at the top on all devices with negative timestamp order
    const topOrder = -Math.floor(Date.now() / 1000);
    setProducts((prev) => [newProduct, ...prev]);
    void saveProductToCloud(newProduct, topOrder);

    const trimmedBrand = (prodData.brand || '').trim();
    if (trimmedBrand) {
      const exists = brands.some(
        (b) =>
          b.categoryId === prodData.category &&
          b.name.trim().toLowerCase() === trimmedBrand.toLowerCase()
      );
      if (!exists) {
        addBrand({
          name: trimmedBrand,
          categoryId: prodData.category,
          origin: prodData.origin || 'Chính hãng'
        });
      }
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const existingIdx = products.findIndex((p) => p.id === id);
    const existingProd = existingIdx >= 0 ? products[existingIdx] : undefined;
    if (!existingProd) return;

    const nextImages = Array.isArray(updates.images)
      ? updates.images.filter(Boolean)
      : updates.imageUrl !== undefined
      ? updates.imageUrl
        ? [updates.imageUrl]
        : []
      : existingProd.images || (existingProd.imageUrl ? [existingProd.imageUrl] : []);

    const updatedObj: Product = {
      ...existingProd,
      ...updates,
      images: nextImages,
      imageUrl: nextImages[0] || undefined,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProducts((prev) => prev.map((p) => (p.id === id ? updatedObj : p)));
    if (selectedProduct?.id === id) {
      setSelectedProduct(updatedObj);
    }

    const orderToKeep = INITIAL_PRODUCT_ORDER.has(id)
      ? INITIAL_PRODUCT_ORDER.get(id)!
      : -1000 + existingIdx;
    void saveProductToCloud(updatedObj, orderToKeep);

    // Ensure brand is also registered in brands collection if changed
    const trimmedBrand = (updatedObj.brand || '').trim();
    if (trimmedBrand) {
      const exists = brands.some(
        (b) =>
          b.categoryId === updatedObj.category &&
          b.name.trim().toLowerCase() === trimmedBrand.toLowerCase()
      );
      if (!exists) {
        addBrand({
          name: trimmedBrand,
          categoryId: updatedObj.category,
          origin: updatedObj.origin || 'Chính hãng'
        });
      }
    }
  };

  const deleteProduct = (id: string, onConfirmed?: () => void) => {
    const target = products.find((p) => p.id === id);
    const prodLabel = target ? `"${target.name}"` : 'sản phẩm này';
    requestConfirm(
      `Bạn chắc chắn muốn xóa sản phẩm ${prodLabel} hay không?`,
      async () => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if (selectedProduct?.id === id) {
          setSelectedProduct(null);
        }
        if (onConfirmed) onConfirmed();

        void deleteFromPostgresApi(`/api/products/${encodeURIComponent(id)}`);
        try {
          await deleteDoc(doc(db, 'products', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
        }
      }
    );
  };

  const updateProductStock = (id: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    const status: Product['status'] =
      validStock === 0 ? 'order-only' : validStock < 10 ? 'low-stock' : 'in-stock';

    updateProduct(id, { stock: validStock, status });
  };

  // Project Operations
  const addProject = (projData: Omit<ProjectItem, 'id'>) => {
    const cleanImages = Array.isArray(projData.images)
      ? projData.images.filter(Boolean)
      : projData.imageUrl
      ? [projData.imageUrl]
      : [];
    const newProj: ProjectItem = {
      ...projData,
      images: cleanImages,
      imageUrl: cleanImages[0] || projData.imageUrl,
      id: `proj-${Date.now()}`
    };
    const topOrder = -Math.floor(Date.now() / 1000);
    setProjects((prev) => [newProj, ...prev]);
    void saveProjectToCloud(newProj, topOrder);
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    const existingIdx = projects.findIndex((p) => p.id === id);
    const existingProj = existingIdx >= 0 ? projects[existingIdx] : undefined;
    if (!existingProj) return;

    const nextImages = Array.isArray(updates.images)
      ? updates.images.filter(Boolean)
      : updates.imageUrl !== undefined
      ? updates.imageUrl
        ? [updates.imageUrl]
        : []
      : existingProj.images || (existingProj.imageUrl ? [existingProj.imageUrl] : []);

    const updatedProj: ProjectItem = {
      ...existingProj,
      ...updates,
      images: nextImages,
      imageUrl: nextImages[0] || undefined
    };

    setProjects((prev) => prev.map((p) => (p.id === id ? updatedProj : p)));
    const orderToKeep = INITIAL_PROJECT_ORDER.has(id)
      ? INITIAL_PROJECT_ORDER.get(id)!
      : -1000 + existingIdx;
    void saveProjectToCloud(updatedProj, orderToKeep);
  };

  const deleteProject = (id: string, onConfirmed?: () => void) => {
    const target = projects.find((p) => p.id === id);
    const projLabel = target ? `"${target.title}"` : 'dự án này';
    requestConfirm(
      `Bạn chắc chắn muốn xóa dự án ${projLabel} hay không?`,
      async () => {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (onConfirmed) onConfirmed();

        void deleteFromPostgresApi(`/api/projects/${encodeURIComponent(id)}`);
        try {
          await deleteDoc(doc(db, 'projects', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
        }
      }
    );
  };

  // Blog Post Operations
  const addBlogPost = (postData: Omit<BlogPost, 'id'>) => {
    const cleanImages = Array.isArray(postData.images)
      ? postData.images.filter(Boolean)
      : postData.imageUrl
      ? [postData.imageUrl]
      : [];
    const newPost: BlogPost = {
      ...postData,
      images: cleanImages,
      imageUrl: cleanImages[0] || postData.imageUrl,
      id: `blog-${Date.now()}`
    };
    const topOrder = -Math.floor(Date.now() / 1000);
    setBlogPosts((prev) => [newPost, ...prev]);
    void saveBlogPostToCloud(newPost, topOrder);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    const existingIdx = blogPosts.findIndex((bp) => bp.id === id);
    const existingPost = existingIdx >= 0 ? blogPosts[existingIdx] : undefined;
    if (!existingPost) return;

    const nextImages = Array.isArray(updates.images)
      ? updates.images.filter(Boolean)
      : updates.imageUrl !== undefined
      ? updates.imageUrl
        ? [updates.imageUrl]
        : []
      : existingPost.images || (existingPost.imageUrl ? [existingPost.imageUrl] : []);

    const updatedPost: BlogPost = {
      ...existingPost,
      ...updates,
      images: nextImages,
      imageUrl: nextImages[0] || undefined
    };

    setBlogPosts((prev) => prev.map((bp) => (bp.id === id ? updatedPost : bp)));
    const orderToKeep = INITIAL_BLOG_ORDER.has(id)
      ? INITIAL_BLOG_ORDER.get(id)!
      : -1000 + existingIdx;
    void saveBlogPostToCloud(updatedPost, orderToKeep);
  };

  const deleteBlogPost = (id: string, onConfirmed?: () => void) => {
    const target = blogPosts.find((bp) => bp.id === id);
    const postLabel = target ? `"${target.title}"` : 'bài viết này';
    requestConfirm(
      `Bạn chắc chắn muốn xóa bài viết ${postLabel} hay không?`,
      async () => {
        setBlogPosts((prev) => prev.filter((bp) => bp.id !== id));
        if (onConfirmed) onConfirmed();

        void deleteFromPostgresApi(`/api/blog-posts/${encodeURIComponent(id)}`);
        try {
          await deleteDoc(doc(db, 'blogPosts', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `blogPosts/${id}`);
        }
      }
    );
  };

  // Company Operations
  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    const updated = { ...companyInfo, ...info };
    setCompanyInfo(updated);
    void saveCompanyToCloud(updated);
  };

  // Inquiries
  const submitInquiry = (
    name: string,
    phone: string,
    address?: string,
    note?: string,
    product?: string
  ) => {
    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      customerName: name,
      phone,
      address,
      productInterest: product,
      note,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'new'
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    void saveInquiryToCloud(newInquiry);
  };

  const updateInquiryStatus = (id: string, status: CustomerInquiry['status']) => {
    const existing = inquiries.find((item) => item.id === id);
    if (!existing) return;
    const updated = { ...existing, status };
    setInquiries((prev) => prev.map((item) => (item.id === id ? updated : item)));
    void saveInquiryToCloud(updated);
  };

  // Modals
  const openQuoteModal = (product?: Product | null) => {
    setQuoteModalProduct(product || null);
  };

  const closeQuoteModal = () => {
    setQuoteModalProduct(null);
  };

  // Helper to replace all docs in a collection with a fresh array
  const replaceCollectionInCloud = async <T extends { id: string }>(
    colName: string,
    newItems: T[]
  ) => {
    try {
      const existingSnap = await getDocs(collection(db, colName));
      const newIds = new Set(newItems.map((i) => i.id));
      const deletePromises: Promise<void>[] = [];
      existingSnap.forEach((docSnap) => {
        if (!newIds.has(docSnap.id)) {
          deletePromises.push(deleteDoc(doc(db, colName, docSnap.id)));
        }
      });

      const writePromises = newItems.map(async (item: any, idx) => {
        if (colName === 'products' || colName === 'projects' || colName === 'blogPosts') {
          const safeImages = await ensureFirestoreSafeImages(
            Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : item.imageUrl
              ? [item.imageUrl]
              : []
          );
          return setDoc(
            doc(db, colName, item.id),
            cleanForFirestore({
              ...item,
              images: safeImages,
              imageUrl: safeImages[0] || undefined,
              order: idx
            })
          );
        }
        return setDoc(
          doc(db, colName, item.id),
          cleanForFirestore({ ...item, order: idx })
        );
      });

      await Promise.all([...deletePromises, ...writePromises]);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, colName);
    }
  };

  // Force push all current state (categories, brands, products, projects, blogPosts, companyInfo) to Hosting Database & Cloud
  const syncAllToCloud = async (): Promise<boolean> => {
    setIsSyncingCloud(true);
    try {
      await postToPostgresApi('/api/restore', {
        mode: 'replace',
        categories,
        brands,
        products,
        projects,
        blogPosts,
        inquiries,
        companyInfo,
      });
      await Promise.all([
        replaceCollectionInCloud('categories', categories),
        replaceCollectionInCloud('brands', brands),
        replaceCollectionInCloud('products', products),
        replaceCollectionInCloud('projects', projects),
        replaceCollectionInCloud('blogPosts', blogPosts),
        saveCompanyToCloud(companyInfo)
      ]);
      return true;
    } catch (e) {
      console.error('Sync all to cloud error:', e);
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSyncingCloud(false);
      }
    }
  };

  // Backup & Reset
  const resetToDefaults = (onConfirmed?: () => void) => {
    requestConfirm(
      'Bạn chắc chắn muốn xóa các thay đổi hiện tại và đặt lại dữ liệu mặc định ban đầu của Đức Vinh Solar cho tất cả các máy hay không?',
      async () => {
        setIsSyncingCloud(true);
        try {
          setCategories(INITIAL_CATEGORIES);
          setBrands(INITIAL_BRANDS);
          setProducts(INITIAL_PRODUCTS);
          setProjects(INITIAL_PROJECTS);
          setBlogPosts(INITIAL_BLOG_POSTS);
          setCompanyInfo(INITIAL_COMPANY_INFO);
          localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
          localStorage.removeItem(STORAGE_KEYS.BRANDS);
          localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
          localStorage.removeItem(STORAGE_KEYS.PROJECTS);
          localStorage.removeItem(STORAGE_KEYS.BLOG_POSTS);
          localStorage.removeItem(STORAGE_KEYS.COMPANY);

          await postToPostgresApi('/api/restore', {
            mode: 'replace',
            categories: INITIAL_CATEGORIES,
            brands: INITIAL_BRANDS,
            products: INITIAL_PRODUCTS,
            projects: INITIAL_PROJECTS,
            blogPosts: INITIAL_BLOG_POSTS,
            companyInfo: INITIAL_COMPANY_INFO,
          });
          await Promise.all([
            replaceCollectionInCloud('categories', INITIAL_CATEGORIES),
            replaceCollectionInCloud('brands', INITIAL_BRANDS),
            replaceCollectionInCloud('products', INITIAL_PRODUCTS),
            replaceCollectionInCloud('projects', INITIAL_PROJECTS),
            replaceCollectionInCloud('blogPosts', INITIAL_BLOG_POSTS),
            saveCompanyToCloud(INITIAL_COMPANY_INFO)
          ]);
          if (onConfirmed) onConfirmed();
        } finally {
          if (isMountedRef.current) {
            setIsSyncingCloud(false);
          }
        }
      },
      'Xác Nhận Đặt Lại Dữ Liệu Gốc'
    );
  };

  const exportBackup = (): string => {
    const backupData = {
      appName: 'CÔNG TY TNHH ĐỨC VINH SOLAR NĂNG LƯỢNG XANH',
      taxCode: companyInfo.taxCode || '0317971512',
      version: '3.1',
      exportedAt: new Date().toISOString(),
      summary: {
        categoriesCount: categories.length,
        brandsCount: brands.length,
        productsCount: products.length,
        projectsCount: projects.length,
        blogPostsCount: blogPosts.length,
        inquiriesCount: inquiries.length
      },
      categories,
      brands,
      products,
      projects,
      blogPosts,
      companyInfo,
      inquiries
    };
    return JSON.stringify(backupData, null, 2);
  };

  const importBackup = async (
    jsonData: string,
    mode: 'replace' | 'merge' = 'replace'
  ): Promise<{ success: boolean; message: string }> => {
    let raw: any;
    try {
      raw = JSON.parse(jsonData);
    } catch {
      return {
        success: false,
        message: 'Nội dung file không đúng định dạng JSON chuẩn. Vui lòng kiểm tra lại!'
      };
    }

    if (!raw || typeof raw !== 'object') {
      return {
        success: false,
        message: 'Tệp sao lưu rỗng hoặc không hợp lệ!'
      };
    }

      const hasValidSection =
      Array.isArray(raw.categories) ||
      Array.isArray(raw.brands) ||
      Array.isArray(raw.products) ||
      Array.isArray(raw.projects) ||
      Array.isArray(raw.blogPosts) ||
      Boolean(raw.companyInfo) ||
      Array.isArray(raw.inquiries);

    if (!hasValidSection) {
      return {
        success: false,
        message: 'Tệp JSON không chứa dữ liệu hệ thống hợp lệ (thiếu danh mục, hãng, sản phẩm, dự án hoặc bài viết)!'
      };
    }

    setIsSyncingCloud(true);
    try {
      // 1. Normalize Categories
      const incomingCategories: CategoryItem[] = Array.isArray(raw.categories)
        ? raw.categories
            .filter((c: any) => c && (c.id || c.label))
            .map((c: any, idx: number) => ({
              id: String(c.id || `cat-imp-${idx}`),
              label: String(c.label || 'Danh mục thiết bị').trim(),
              shortLabel: String(c.shortLabel || c.label || 'Danh mục').trim(),
              desc: String(c.desc || '').trim(),
              iconName: c.iconName || 'Package'
            }))
        : [];

      // 2. Normalize Brands
      const incomingBrands: BrandItem[] = Array.isArray(raw.brands)
        ? raw.brands
            .filter((b: any) => b && (b.name || b.id))
            .map((b: any, idx: number) => ({
              id: String(b.id || `br-imp-${idx}`),
              name: String(b.name || 'Chính hãng').trim(),
              categoryId: String(b.categoryId || 'solar-panels'),
              origin: String(b.origin || 'Chính hãng').trim()
            }))
        : [];

      // 3. Normalize Products
      const incomingProducts: Product[] = Array.isArray(raw.products)
        ? raw.products
            .filter((p: any) => p && (p.name || p.id))
            .map((p: any, idx: number) => {
              const imgs: string[] = Array.isArray(p.images) && p.images.length > 0
                ? p.images.filter(Boolean)
                : p.imageUrl
                ? [String(p.imageUrl)]
                : [];
              const stockNum = Math.max(0, Number(p.stock ?? 10));
              const status: Product['status'] =
                p.status === 'in-stock' || p.status === 'low-stock' || p.status === 'order-only'
                  ? p.status
                  : stockNum === 0
                  ? 'order-only'
                  : stockNum < 10
                  ? 'low-stock'
                  : 'in-stock';
              return {
                id: String(p.id || `prod-imp-${idx}`),
                sku: String(p.sku || `DVS-${1000 + idx}`).trim(),
                name: String(p.name || 'Sản phẩm Điện mặt trời').trim(),
                category: String(p.category || 'solar-panels'),
                brand: String(p.brand || 'Chính hãng').trim(),
                stock: stockNum,
                unit: String(p.unit || 'bộ').trim(),
                status,
                shortDesc: String(p.shortDesc || '').trim(),
                fullDesc: String(p.fullDesc || p.shortDesc || '').trim(),
                specs: Array.isArray(p.specs) ? p.specs : [],
                highlights: Array.isArray(p.highlights) ? p.highlights : [],
                applications: Array.isArray(p.applications) ? p.applications : [],
                warrantyYears: Number(p.warrantyYears ?? 10),
                origin: String(p.origin || 'Chính hãng').trim(),
                images: imgs,
                imageUrl: imgs[0] || undefined,
                svgType: p.svgType || 'panel',
                updatedAt: String(p.updatedAt || new Date().toISOString().split('T')[0])
              };
            })
        : [];

      // 4. Normalize Projects
      const incomingProjects: ProjectItem[] = Array.isArray(raw.projects)
        ? raw.projects
            .filter((pr: any) => pr && (pr.title || pr.id))
            .map((pr: any, idx: number) => {
              const imgs: string[] = Array.isArray(pr.images) && pr.images.length > 0
                ? pr.images.filter(Boolean)
                : pr.imageUrl
                ? [String(pr.imageUrl)]
                : [];
              return {
                id: String(pr.id || `proj-imp-${idx}`),
                title: String(pr.title || 'Dự án Điện mặt trời').trim(),
                category:
                  pr.category === 'commercial' ||
                  pr.category === 'hybrid' ||
                  pr.category === 'lighting' ||
                  pr.category === 'saving'
                    ? pr.category
                    : 'residential',
                capacity: String(pr.capacity || '10 kWp').trim(),
                location: String(pr.location || 'TP. Hồ Chí Minh').trim(),
                completionDate: String(pr.completionDate || pr.completedDate || '2026').trim(),
                estimatedSaving: String(pr.estimatedSaving || pr.savingEstimate || 'Tiết kiệm hiệu quả').trim(),
                description: String(pr.description || '').trim(),
                keyEquipment: Array.isArray(pr.keyEquipment)
                  ? pr.keyEquipment.filter(Boolean)
                  : Array.isArray(pr.equipmentUsed)
                  ? pr.equipmentUsed.filter(Boolean)
                  : [],
                svgType: pr.svgType || 'rooftop',
                images: imgs,
                imageUrl: imgs[0] || undefined
              };
            })
        : [];

      // 5. Normalize Blog Posts
      const incomingBlogPosts: BlogPost[] = Array.isArray(raw.blogPosts)
        ? raw.blogPosts
            .filter((bp: any) => bp && (bp.title || bp.id))
            .map((bp: any, idx: number) => {
              const imgs: string[] = Array.isArray(bp.images) && bp.images.length > 0
                ? bp.images.filter(Boolean)
                : bp.imageUrl
                ? [String(bp.imageUrl)]
                : [];
              return {
                id: String(bp.id || `blog-imp-${idx}`),
                title: String(bp.title || 'Bài viết Đức Vinh Solar').trim(),
                category: String(bp.category || 'Kinh Nghiệm Điện Mặt Trời').trim(),
                author: String(bp.author || 'Kỹ Sư Đức Vinh Solar').trim(),
                publishedAt: String(bp.publishedAt || '2026').trim(),
                readTime: String(bp.readTime || '5 phút đọc').trim(),
                summary: String(bp.summary || '').trim(),
                content: String(bp.content || bp.summary || '').trim(),
                tags: Array.isArray(bp.tags) ? bp.tags.filter(Boolean) : [],
                images: imgs,
                imageUrl: imgs[0] || undefined
              };
            })
        : [];

      // 6. Normalize Inquiries
      const incomingInquiries: CustomerInquiry[] = Array.isArray(raw.inquiries)
        ? raw.inquiries
            .filter((inq: any) => inq && (inq.customerName || inq.phone))
            .map((inq: any, idx: number) => ({
              id: String(inq.id || `inq-imp-${idx}`),
              customerName: String(inq.customerName || 'Khách hàng').trim(),
              phone: String(inq.phone || '').trim(),
              address: inq.address ? String(inq.address).trim() : undefined,
              productInterest: inq.productInterest ? String(inq.productInterest).trim() : undefined,
              note: inq.note ? String(inq.note).trim() : undefined,
              createdAt: String(inq.createdAt || new Date().toLocaleString('vi-VN')),
              status:
                inq.status === 'contacted' || inq.status === 'completed' ? inq.status : 'new'
            }))
        : [];

      // Helper to merge arrays by ID (preserving order & updating matching IDs)
      const mergeById = <T extends { id: string }>(current: T[], incoming: T[]): T[] => {
        const map = new Map<string, T>();
        current.forEach((item) => map.set(item.id, item));
        incoming.forEach((item) => map.set(item.id, item));
        return Array.from(map.values());
      };

      const finalCategories =
        Array.isArray(raw.categories)
          ? mode === 'merge'
            ? mergeById(categories, incomingCategories)
            : incomingCategories
          : categories;

      let finalBrands =
        Array.isArray(raw.brands)
          ? mode === 'merge'
            ? mergeById(brands, incomingBrands)
            : incomingBrands
          : brands;

      const finalProducts =
        Array.isArray(raw.products)
          ? mode === 'merge'
            ? mergeById(products, incomingProducts)
            : incomingProducts
          : products;

      // Ensure every product's brand is also registered in finalBrands so no brand is orphaned
      const brandKeySet = new Set(
        finalBrands.map((b) => `${b.categoryId}::${b.name.trim().toLowerCase()}`)
      );
      finalProducts.forEach((p, idx) => {
        const bName = (p.brand || '').trim();
        if (bName) {
          const key = `${p.category}::${bName.toLowerCase()}`;
          if (!brandKeySet.has(key)) {
            brandKeySet.add(key);
            finalBrands = [
              ...finalBrands,
              {
                id: `br-auto-${Date.now()}-${idx}`,
                name: bName,
                categoryId: p.category,
                origin: p.origin || 'Chính hãng'
              }
            ];
          }
        }
      });

      const finalProjects =
        Array.isArray(raw.projects)
          ? mode === 'merge'
            ? mergeById(projects, incomingProjects)
            : incomingProjects
          : projects;

      const finalBlogPosts =
        Array.isArray(raw.blogPosts)
          ? mode === 'merge'
            ? mergeById(blogPosts, incomingBlogPosts)
            : incomingBlogPosts
          : blogPosts;

      const finalCompanyInfo: CompanyInfo = raw.companyInfo
        ? { ...INITIAL_COMPANY_INFO, ...companyInfo, ...raw.companyInfo }
        : companyInfo;

      const finalInquiries =
        Array.isArray(raw.inquiries)
          ? mode === 'merge'
            ? mergeById(inquiries, incomingInquiries)
            : incomingInquiries
          : inquiries;

      // Apply to local state immediately
      setCategories(finalCategories);
      setBrands(finalBrands);
      setProducts(finalProducts);
      setProjects(finalProjects);
      setBlogPosts(finalBlogPosts);
      setCompanyInfo(finalCompanyInfo);
      setInquiries(finalInquiries);

      // Sync all restored collections to Linux Hosting Database (/api/restore) & Cloud immediately
      await postToPostgresApi('/api/restore', {
        mode,
        categories: finalCategories,
        brands: finalBrands,
        products: finalProducts,
        projects: finalProjects,
        blogPosts: finalBlogPosts,
        inquiries: finalInquiries,
        companyInfo: finalCompanyInfo,
      });
      await Promise.all([
        replaceCollectionInCloud('categories', finalCategories),
        replaceCollectionInCloud('brands', finalBrands),
        replaceCollectionInCloud('products', finalProducts),
        replaceCollectionInCloud('projects', finalProjects),
        replaceCollectionInCloud('blogPosts', finalBlogPosts),
        replaceCollectionInCloud('inquiries', finalInquiries),
        saveCompanyToCloud(finalCompanyInfo),
        setDoc(doc(db, 'settings', 'seedMeta'), {
          seeded: true,
          seedVersion: 4,
          updatedAt: new Date().toISOString()
        })
      ]);

      return {
        success: true,
        message: `Đã khôi phục & đồng bộ lên web thành công: ${finalCategories.length} loại thiết bị, ${finalBrands.length} hãng, ${finalProducts.length} sản phẩm, ${finalProjects.length} dự án và ${finalBlogPosts.length} bài viết!`
      };
    } catch (error) {
      console.error('Import backup error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi đồng bộ dữ liệu khôi phục lên đám mây. Vui lòng thử lại!'
      };
    } finally {
      if (isMountedRef.current) {
        setIsSyncingCloud(false);
      }
    }
  };

      return (
    <AppContext.Provider
      value={{
        products,
        categories,
        brands,
        projects,
        blogPosts,
        companyInfo,
        inquiries,
        isAdmin,
        selectedProduct,
        quoteModalProduct,
        isAdminModalOpen,
        adminActiveTab,
        adminEditingProduct,
        isSyncingCloud,
        selectedCategory,
        selectedBrand,
        setSelectedProduct,
        setSelectedCategory,
        setSelectedBrand,
        selectCatalogFilter,
        openQuoteModal,
        closeQuoteModal,
        setIsAdminModalOpen,
        setAdminActiveTab,
        openAdminTab,
        openEditProductInAdmin,
        clearAdminEditingProduct,
        loginAdmin,
        logoutAdmin,
        requestConfirm,
        addCategory,
        updateCategory,
        deleteCategory,
        addBrand,
        updateBrand,
        deleteBrand,
        deleteBrandByName,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        addProject,
        updateProject,
        deleteProject,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        updateCompanyInfo,
        submitInquiry,
        updateInquiryStatus,
        syncAllToCloud,
        resetToDefaults,
        exportBackup,
        importBackup
      }}
    >
      {children}

      {/* Global Confirmation Dialog Modal */}
      {confirmDialog && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setConfirmDialog(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-bold text-lg">
                !
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Không, Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  action();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
              >
                {confirmDialog.title.toLowerCase().includes('xóa')
                  ? 'Có, Chắc Chắn Xóa'
                  : 'Có, Xác Nhận Thực Hiện'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
