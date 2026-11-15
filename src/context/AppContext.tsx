import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

export type AdminTabType =
  | 'inventory'
  | 'categories-brands'
  | 'projects'
  | 'blog'
  | 'inquiries'
  | 'company'
  | 'backup';

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
  submitInquiry: (
    name: string,
    phone: string,
    address?: string,
    note?: string,
    product?: string
  ) => void;
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
  ADMIN_AUTH: 'dvs_admin_auth'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial categories from localStorage or defaults before Vercel Blob sync
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

  // Activate Admin Modal only via keyboard shortcut: "Ctrl + X + 1"
  useEffect(() => {
    const pressedKeys = new Set<string>();
    let lastCtrlXTime = 0;
    let lastCtrl1Time = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code;

      pressedKeys.add(key);
      if (code === 'KeyX') pressedKeys.add('x');
      if (code === 'Digit1' || code === 'Numpad1' || key === '1' || key === '!') {
        pressedKeys.add('1');
      }

      const isCtrlOrMeta =
        e.ctrlKey || e.metaKey || pressedKeys.has('control') || pressedKeys.has('meta');

      const isX = key === 'x' || code === 'KeyX';
      const is1 = key === '1' || key === '!' || code === 'Digit1' || code === 'Numpad1';

      if (isCtrlOrMeta && isX) {
        lastCtrlXTime = Date.now();
      }
      if (isCtrlOrMeta && is1) {
        lastCtrl1Time = Date.now();
      }

      const now = Date.now();
      const isSimultaneous = isCtrlOrMeta && pressedKeys.has('x') && pressedKeys.has('1');
      const isCtrlXThen1 = is1 && now - lastCtrlXTime < 1500;
      const isCtrl1ThenX = isX && now - lastCtrl1Time < 1500;

      if (isSimultaneous || isCtrlXThen1 || isCtrl1ThenX) {
        e.preventDefault();
        lastCtrlXTime = 0;
        lastCtrl1Time = 0;
        pressedKeys.clear();
        setIsAdminModalOpen(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      pressedKeys.delete(key);
      if (e.code === 'KeyX') pressedKeys.delete('x');
      if (e.code === 'Digit1' || e.code === 'Numpad1') pressedKeys.delete('1');
    };

    const handleBlur = () => {
      pressedKeys.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

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

  // Helper functions to communicate with Vercel Blob Store `ducvinhsolar` (/api/*)
  const postToBlobApi = async (endpoint: string, body: unknown) => {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.warn(`Vercel Blob API sync warning (${endpoint}):`, err);
    }
  };

  const deleteFromBlobApi = async (endpoint: string) => {
    try {
      await fetch(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.warn(`Vercel Blob API delete warning (${endpoint}):`, err);
    }
  };

  const isMountedRef = useRef(true);
  const lastRemoteUpdatedAtRef = useRef<string>('');

  // Sync with Vercel Blob Store `ducvinhsolar` on startup and tab focus
  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    const fetchAndSyncFromBlob = async (isInitial = false) => {
      try {
        const res = await fetch('/api/state', { cache: 'no-store' });
        if (!res.ok) return;
        const blobData = await res.json();
        const hasBlobData =
          Array.isArray(blobData.categories) && blobData.categories.length > 0;

        if (!hasBlobData && isInitial) {
          // Auto-seed the Vercel Blob Store `ducvinhsolar` on first visit
          await postToBlobApi('/api/seed', {
            categories: categories.length > 0 ? categories : INITIAL_CATEGORIES,
            brands: brands.length > 0 ? brands : INITIAL_BRANDS,
            products: products.length > 0 ? products : INITIAL_PRODUCTS,
            projects: projects.length > 0 ? projects : INITIAL_PROJECTS,
            blogPosts: blogPosts.length > 0 ? blogPosts : INITIAL_BLOG_POSTS,
            inquiries,
            companyInfo: companyInfo || INITIAL_COMPANY_INFO
          });
          return;
        }

        if (!cancelled && hasBlobData) {
          if (
            !isInitial &&
            blobData.updatedAt &&
            blobData.updatedAt === lastRemoteUpdatedAtRef.current
          ) {
            return;
          }
          if (blobData.updatedAt) {
            lastRemoteUpdatedAtRef.current = blobData.updatedAt;
          }

          if (Array.isArray(blobData.categories) && blobData.categories.length > 0) {
            setCategories(blobData.categories);
          }
          if (Array.isArray(blobData.brands) && blobData.brands.length > 0) {
            setBrands(blobData.brands);
          }
          if (Array.isArray(blobData.products) && blobData.products.length > 0) {
            setProducts(blobData.products);
            setSelectedProduct((prevSelected) => {
              if (!prevSelected) return null;
              return (
                blobData.products.find((item: Product) => item.id === prevSelected.id) ||
                null
              );
            });
          }
          if (Array.isArray(blobData.projects) && blobData.projects.length > 0) {
            setProjects(blobData.projects);
          }
          if (Array.isArray(blobData.blogPosts) && blobData.blogPosts.length > 0) {
            setBlogPosts(blobData.blogPosts);
          }
          if (Array.isArray(blobData.inquiries) && blobData.inquiries.length > 0) {
            setInquiries(blobData.inquiries);
          }
          if (blobData.companyInfo) {
            setCompanyInfo((prev) => ({ ...prev, ...blobData.companyInfo }));
          }
        }
      } catch (err) {
        console.warn('Vercel Blob /api/state load warning:', err);
      }
    };

    void fetchAndSyncFromBlob(true);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        void fetchAndSyncFromBlob(false);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
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
    setCategories((prev) => [...prev, newCat]);
    void postToBlobApi('/api/categories', newCat);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    const existingIdx = categories.findIndex((c) => c.id === id);
    const existingCat = existingIdx >= 0 ? categories[existingIdx] : undefined;
    const updatedCat: CategoryItem = {
      id,
      label: (updates.label ?? existingCat?.label ?? 'Danh mục').trim(),
      shortLabel: (
        updates.shortLabel ??
        updates.label ??
        existingCat?.shortLabel ??
        'Danh mục'
      ).trim(),
      desc: (updates.desc ?? existingCat?.desc ?? '').trim(),
      iconName: updates.iconName ?? existingCat?.iconName ?? 'Package'
    };
    setCategories((prev) => prev.map((c) => (c.id === id ? updatedCat : c)));
    void postToBlobApi('/api/categories', updatedCat);
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

        void deleteFromBlobApi(`/api/categories/${encodeURIComponent(id)}`);
        brandsToRemove.forEach((b) =>
          void deleteFromBlobApi(`/api/brands/${encodeURIComponent(b.id)}`)
        );
        productsToRemove.forEach((p) =>
          void deleteFromBlobApi(`/api/products/${encodeURIComponent(p.id)}`)
        );
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
    setBrands((prev) => [...prev, newBrand]);
    void postToBlobApi('/api/brands', newBrand);
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
    } else {
      setBrands((prev) => [...prev, updatedBrand]);
    }
    void postToBlobApi('/api/brands', updatedBrand);

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
        void postToBlobApi('/api/products', up);
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

        void deleteFromBlobApi(`/api/brands/${encodeURIComponent(id)}`);
        productsToRemove.forEach((p) =>
          void deleteFromBlobApi(`/api/products/${encodeURIComponent(p.id)}`)
        );
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

        matchingBrands.forEach((b) => {
          void deleteFromBlobApi(`/api/brands/${encodeURIComponent(b.id)}`);
        });
        matchingProducts.forEach((p) => {
          void deleteFromBlobApi(`/api/products/${encodeURIComponent(p.id)}`);
        });
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
    setProducts((prev) => [newProduct, ...prev]);
    void postToBlobApi('/api/products', newProduct);

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

    void postToBlobApi('/api/products', updatedObj);

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

        void deleteFromBlobApi(`/api/products/${encodeURIComponent(id)}`);
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
    setProjects((prev) => [newProj, ...prev]);
    void postToBlobApi('/api/projects', newProj);
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
    void postToBlobApi('/api/projects', updatedProj);
  };

  const deleteProject = (id: string, onConfirmed?: () => void) => {
    const target = projects.find((p) => p.id === id);
    const projLabel = target ? `"${target.title}"` : 'dự án này';
    requestConfirm(
      `Bạn chắc chắn muốn xóa dự án ${projLabel} hay không?`,
      async () => {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (onConfirmed) onConfirmed();

        void deleteFromBlobApi(`/api/projects/${encodeURIComponent(id)}`);
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
    setBlogPosts((prev) => [newPost, ...prev]);
    void postToBlobApi('/api/blog-posts', newPost);
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
    void postToBlobApi('/api/blog-posts', updatedPost);
  };

  const deleteBlogPost = (id: string, onConfirmed?: () => void) => {
    const target = blogPosts.find((bp) => bp.id === id);
    const postLabel = target ? `"${target.title}"` : 'bài viết này';
    requestConfirm(
      `Bạn chắc chắn muốn xóa bài viết ${postLabel} hay không?`,
      async () => {
        setBlogPosts((prev) => prev.filter((bp) => bp.id !== id));
        if (onConfirmed) onConfirmed();

        void deleteFromBlobApi(`/api/blog-posts/${encodeURIComponent(id)}`);
      }
    );
  };

  // Company Operations
  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    const updated = { ...companyInfo, ...info };
    setCompanyInfo(updated);
    void postToBlobApi('/api/company-info', updated);
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
    void postToBlobApi('/api/inquiries', newInquiry);
  };

  const updateInquiryStatus = (id: string, status: CustomerInquiry['status']) => {
    const existing = inquiries.find((item) => item.id === id);
    if (!existing) return;
    const updated = { ...existing, status };
    setInquiries((prev) => prev.map((item) => (item.id === id ? updated : item)));
    void postToBlobApi('/api/inquiries', updated);
  };

  // Modals
  const openQuoteModal = (product?: Product | null) => {
    setQuoteModalProduct(product || null);
  };

  const closeQuoteModal = () => {
    setQuoteModalProduct(null);
  };

  // Force push all current state to Vercel Blob Store `ducvinhsolar`
  const syncAllToCloud = async (): Promise<boolean> => {
    setIsSyncingCloud(true);
    try {
      await postToBlobApi('/api/restore', {
        mode: 'replace',
        categories,
        brands,
        products,
        projects,
        blogPosts,
        inquiries,
        companyInfo
      });
      return true;
    } catch (e) {
      console.error('Sync all to Vercel Blob error:', e);
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

          await postToBlobApi('/api/restore', {
            mode: 'replace',
            categories: INITIAL_CATEGORIES,
            brands: INITIAL_BRANDS,
            products: INITIAL_PRODUCTS,
            projects: INITIAL_PROJECTS,
            blogPosts: INITIAL_BLOG_POSTS,
            companyInfo: INITIAL_COMPANY_INFO
          });
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
      storeName: 'ducvinhsolar',
      taxCode: companyInfo.taxCode || '0317971512',
      version: '3.2',
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
        message:
          'Tệp JSON không chứa dữ liệu hệ thống hợp lệ (thiếu danh mục, hãng, sản phẩm, dự án hoặc bài viết)!'
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
              const imgs: string[] =
                Array.isArray(p.images) && p.images.length > 0
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
              const imgs: string[] =
                Array.isArray(pr.images) && pr.images.length > 0
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
                estimatedSaving: String(
                  pr.estimatedSaving || pr.savingEstimate || 'Tiết kiệm hiệu quả'
                ).trim(),
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
              const imgs: string[] =
                Array.isArray(bp.images) && bp.images.length > 0
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
              productInterest: inq.productInterest
                ? String(inq.productInterest).trim()
                : undefined,
              note: inq.note ? String(inq.note).trim() : undefined,
              createdAt: String(inq.createdAt || new Date().toLocaleString('vi-VN')),
              status:
                inq.status === 'contacted' || inq.status === 'completed' ? inq.status : 'new'
            }))
        : [];

      const mergeById = <T extends { id: string }>(current: T[], incoming: T[]): T[] => {
        const map = new Map<string, T>();
        current.forEach((item) => map.set(item.id, item));
        incoming.forEach((item) => map.set(item.id, item));
        return Array.from(map.values());
      };

      const finalCategories = Array.isArray(raw.categories)
        ? mode === 'merge'
          ? mergeById(categories, incomingCategories)
          : incomingCategories
        : categories;

      let finalBrands = Array.isArray(raw.brands)
        ? mode === 'merge'
          ? mergeById(brands, incomingBrands)
          : incomingBrands
        : brands;

      const finalProducts = Array.isArray(raw.products)
        ? mode === 'merge'
          ? mergeById(products, incomingProducts)
          : incomingProducts
        : products;

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

      const finalProjects = Array.isArray(raw.projects)
        ? mode === 'merge'
          ? mergeById(projects, incomingProjects)
          : incomingProjects
        : projects;

      const finalBlogPosts = Array.isArray(raw.blogPosts)
        ? mode === 'merge'
          ? mergeById(blogPosts, incomingBlogPosts)
          : incomingBlogPosts
        : blogPosts;

      const finalCompanyInfo: CompanyInfo = raw.companyInfo
        ? { ...INITIAL_COMPANY_INFO, ...companyInfo, ...raw.companyInfo }
        : companyInfo;

      const finalInquiries = Array.isArray(raw.inquiries)
        ? mode === 'merge'
          ? mergeById(inquiries, incomingInquiries)
          : incomingInquiries
        : inquiries;

      setCategories(finalCategories);
      setBrands(finalBrands);
      setProducts(finalProducts);
      setProjects(finalProjects);
      setBlogPosts(finalBlogPosts);
      setCompanyInfo(finalCompanyInfo);
      setInquiries(finalInquiries);

      await postToBlobApi('/api/restore', {
        mode,
        categories: finalCategories,
        brands: finalBrands,
        products: finalProducts,
        projects: finalProjects,
        blogPosts: finalBlogPosts,
        inquiries: finalInquiries,
        companyInfo: finalCompanyInfo
      });

      return {
        success: true,
        message: `Đã khôi phục & đồng bộ lên Vercel Blob (ducvinhsolar) thành công: ${finalCategories.length} loại thiết bị, ${finalBrands.length} hãng, ${finalProducts.length} sản phẩm, ${finalProjects.length} dự án và ${finalBlogPosts.length} bài viết!`
      };
    } catch (error) {
      console.error('Import backup error:', error);
      return {
        success: false,
        message:
          'Có lỗi xảy ra khi đồng bộ dữ liệu khôi phục lên Vercel Blob. Vui lòng thử lại!'
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
