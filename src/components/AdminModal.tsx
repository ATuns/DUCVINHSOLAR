import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Product,
  ProductCategory,
  ProductSpec,
  CategoryItem,
  BrandItem,
  CategoryIconName,
  ProjectItem,
  BlogPost
} from '../types';
import { MultiImageInput } from './MultiImageInput';
import {
  X,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  RefreshCw,
  Package,
  Database,
  Users,
  Download,
  Upload,
  Save,
  AlertCircle,
  Layers,
  Building2,
  Award,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';

const ADMIN_CATEGORIES_PER_PAGE = 5;
const ADMIN_BRANDS_PER_PAGE = 5;
const ADMIN_PRODUCTS_PER_PAGE = 9;

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

export const AdminModal: React.FC = () => {
  const {
    isAdmin,
    isAdminModalOpen,
    setIsAdminModalOpen,
    adminActiveTab,
    setAdminActiveTab,
    loginAdmin,
    logoutAdmin,
    products,
    categories,
    brands,
    projects,
    blogPosts,
    addCategory,
    updateCategory,
    deleteCategory,
    addBrand,
    updateBrand,
    deleteBrand,
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
    inquiries,
    updateInquiryStatus,
    companyInfo,
    updateCompanyInfo,
    adminEditingProduct,
    clearAdminEditingProduct,
    syncAllToCloud,
    isSyncingCloud,
    resetToDefaults,
    exportBackup,
    importBackup,
    requestConfirm
  } = useApp();

  // Login form state
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Edit / Add product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [adminProductSearch, setAdminProductSearch] = useState('');

  // Form states for product
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('solar-panels');
  const [formBrand, setFormBrand] = useState('');
  const [formStock, setFormStock] = useState<number>(10);
  const [formUnit, setFormUnit] = useState('tấm');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formWarranty, setFormWarranty] = useState<number>(12);
  const [formOrigin, setFormOrigin] = useState('Chính hãng');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formSvgType, setFormSvgType] = useState<Product['svgType']>('panel');
  const [formSpecs, setFormSpecs] = useState<ProductSpec[]>([
    { label: 'Công suất', value: '550 Wp' },
    { label: 'Hiệu suất', value: '22%' }
  ]);

  // Project Management Form States
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState<ProjectItem['category']>('residential');
  const [projCapacity, setProjCapacity] = useState('');
  const [projLocation, setProjLocation] = useState('');
  const [projDate, setProjDate] = useState('');
  const [projSaving, setProjSaving] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projEquipmentText, setProjEquipmentText] = useState('');
  const [projImages, setProjImages] = useState<string[]>([]);

  // Blog Management Form States
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Kinh Nghiệm Điện Mặt Trời');
  const [blogAuthor, setBlogAuthor] = useState('Kỹ Sư Đức Vinh Solar');
  const [blogPublishedAt, setBlogPublishedAt] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 phút đọc');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogTagsText, setBlogTagsText] = useState('');
  const [blogImages, setBlogImages] = useState<string[]>([]);

  // Category Management Form States
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catLabel, setCatLabel] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState<CategoryIconName>('Sun');

  // Brand Management Form States
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandCategoryId, setBrandCategoryId] = useState<string>(categories[0]?.id || 'solar-panels');
  const [brandOrigin, setBrandOrigin] = useState('Chính hãng');
  const [filterBrandCat, setFilterBrandCat] = useState<string>('all');

  // Company info form state
  const [compHotline, setCompHotline] = useState(companyInfo.hotlineZalo);
  const [compEmail, setCompEmail] = useState(companyInfo.email);
  const [compAddress, setCompAddress] = useState(companyInfo.officeAddress);
  const [compWarehouseAddress, setCompWarehouseAddress] = useState(companyInfo.warehouseAddress);
  const [compWarehouseMapUrl, setCompWarehouseMapUrl] = useState(companyInfo.warehouseMapUrl);
  const [compStatus, setCompStatus] = useState(companyInfo.status);
  const [compSaved, setCompSaved] = useState(false);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  useEffect(() => {
    setCompHotline(companyInfo.hotlineZalo || '');
    setCompEmail(companyInfo.email || '');
    setCompAddress(companyInfo.officeAddress || '');
    setCompWarehouseAddress(companyInfo.warehouseAddress || '');
    setCompWarehouseMapUrl(companyInfo.warehouseMapUrl || '');
    setCompStatus(companyInfo.status || '');
  }, [companyInfo]);

  // Admin Pagination states
  const [adminCatPage, setAdminCatPage] = useState<number>(1);
  const [adminBrandPage, setAdminBrandPage] = useState<number>(1);
  const [adminProductPage, setAdminProductPage] = useState<number>(1);

  // Backup & Restore states
  const [backupPreview, setBackupPreview] = useState<{
    fileName: string;
    rawJson: string;
    exportedAt?: string;
    categoriesCount: number;
    brandsCount: number;
    productsCount: number;
    projectsCount: number;
    inquiriesCount: number;
    hasCompanyInfo: boolean;
  } | null>(null);
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [showPasteJson, setShowPasteJson] = useState(false);
  const [pastedJsonText, setPastedJsonText] = useState('');
  const [copiedBackup, setCopiedBackup] = useState(false);

  const showNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 4500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAdmin(username, password);
    if (!success) {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
    } else {
      setPassword('');
    }
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsAddingNew(false);
    setFormName(p.name || '');
    setFormSku(p.sku || '');
    setFormCategory(p.category || categories[0]?.id || 'solar-panels');
    setFormBrand(p.brand || '');
    setFormStock(p.stock ?? 0);
    setFormUnit(p.unit || 'tấm');
    setFormShortDesc(p.shortDesc || '');
    setFormFullDesc(p.fullDesc || '');
    setFormWarranty(p.warrantyYears ?? 12);
    setFormOrigin(p.origin || 'Chính hãng');
    const existingImgs = Array.isArray(p.images) && p.images.length > 0
      ? [...p.images]
      : p.imageUrl
      ? [p.imageUrl]
      : [];
    setFormImages(existingImgs);
    setFormSvgType(p.svgType || 'panel');
    setFormSpecs(Array.isArray(p.specs) ? [...p.specs] : []);
  };

  useEffect(() => {
    if (isAdminModalOpen && adminEditingProduct) {
      handleOpenEdit(adminEditingProduct);
      clearAdminEditingProduct();
    }
  }, [isAdminModalOpen, adminEditingProduct]);

  if (!isAdminModalOpen) return null;

  const handleOpenAddNew = () => {
    const defaultCat = categories[0]?.id || 'solar-panels';
    const firstBrandOfCat = brands.find(b => b.categoryId === defaultCat)?.name || 'SolaX';
    setEditingProduct(null);
    setIsAddingNew(true);
    setFormName('');
    setFormSku(`DVS-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCategory(defaultCat);
    setFormBrand(firstBrandOfCat);
    setFormStock(50);
    setFormUnit('tấm');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormWarranty(12);
    setFormOrigin('Chính Hãng (Có CO/CQ)');
    setFormImages([]);
    setFormSvgType('panel');
    setFormSpecs([
      { label: 'Công suất', value: '580 Wp' },
      { label: 'Hiệu suất', value: '22.5%' },
      { label: 'Chuẩn bảo vệ', value: 'IP68' }
    ]);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim()) return;

    const status: Product['status'] =
      formStock <= 0 ? 'order-only' : formStock < 10 ? 'low-stock' : 'in-stock';

    const cleanImages = formImages.filter(Boolean);

    if (isAddingNew) {
      addProduct({
        sku: formSku,
        name: formName,
        category: formCategory,
        brand: formBrand,
        shortDesc: formShortDesc,
        fullDesc: formFullDesc || formShortDesc,
        stock: formStock,
        unit: formUnit,
        warrantyYears: formWarranty,
        origin: formOrigin,
        images: cleanImages,
        imageUrl: cleanImages[0] || undefined,
        svgType: formSvgType,
        specs: formSpecs,
        highlights: ['Sản phẩm chính hãng Đức Vinh Solar', 'Bảo hành đầy đủ'],
        applications: ['Dân dụng và công nghiệp'],
        status
      });
      showNotice(`Đã thêm sản phẩm "${formName}" thành công!`);
    } else if (editingProduct) {
      updateProduct(editingProduct.id, {
        sku: formSku,
        name: formName,
        category: formCategory,
        brand: formBrand,
        shortDesc: formShortDesc,
        fullDesc: formFullDesc,
        stock: formStock,
        unit: formUnit,
        warrantyYears: formWarranty,
        origin: formOrigin,
        images: cleanImages,
        imageUrl: cleanImages[0] || undefined,
        svgType: formSvgType,
        specs: formSpecs,
        status
      });
      showNotice(`Đã cập nhật sản phẩm "${formName}"!`);
    }

    setEditingProduct(null);
    setIsAddingNew(false);
  };

  // Project CRUD Handlers in Admin Modal
  const handleOpenAddProjectModal = () => {
    setEditingProject(null);
    setIsAddingProject(true);
    setProjTitle('');
    setProjCategory('residential');
    setProjCapacity('10 kWp');
    setProjLocation('TP. Hồ Chí Minh');
    setProjDate(`Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
    setProjSaving('Tiết kiệm ~4.500.000đ/tháng');
    setProjDesc('');
    setProjEquipmentText('18 Tấm pin Longi 580W\n01 Biến tần Hybrid Deye 10kW\n01 Pin lưu trữ Lithium 10.24kWh');
    setProjImages([]);
  };

  const handleOpenEditProjectModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setIsAddingProject(false);
    setProjTitle(proj.title || '');
    setProjCategory(proj.category || 'residential');
    setProjCapacity(proj.capacity || '');
    setProjLocation(proj.location || '');
    setProjDate(proj.completionDate || '');
    setProjSaving(proj.estimatedSaving || '');
    setProjDesc(proj.description || '');
    setProjEquipmentText(Array.isArray(proj.keyEquipment) ? proj.keyEquipment.join('\n') : '');
    const existingImgs = Array.isArray(proj.images) && proj.images.length > 0
      ? [...proj.images]
      : proj.imageUrl
      ? [proj.imageUrl]
      : [];
    setProjImages(existingImgs);
  };

  const handleSaveProjectModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const eqList = projEquipmentText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (isAddingProject) {
      addProject({
        title: projTitle.trim(),
        category: projCategory,
        capacity: projCapacity.trim() || '10 kWp',
        location: projLocation.trim() || 'TP. Hồ Chí Minh',
        completionDate: projDate.trim() || '2026',
        estimatedSaving: projSaving.trim() || 'Hiệu suất cao',
        description: projDesc.trim(),
        keyEquipment: eqList.length > 0 ? eqList : ['Thiết bị chính hãng Đức Vinh Solar'],
        images: projImages,
        imageUrl: projImages[0] || undefined,
        svgType: 'rooftop'
      });
      showNotice(`Đã thêm dự án "${projTitle.trim()}" thành công!`);
    } else if (editingProject) {
      updateProject(editingProject.id, {
        title: projTitle.trim(),
        category: projCategory,
        capacity: projCapacity.trim() || '10 kWp',
        location: projLocation.trim() || 'TP. Hồ Chí Minh',
        completionDate: projDate.trim() || '2026',
        estimatedSaving: projSaving.trim() || 'Hiệu suất cao',
        description: projDesc.trim(),
        keyEquipment: eqList.length > 0 ? eqList : ['Thiết bị chính hãng Đức Vinh Solar'],
        images: projImages,
        imageUrl: projImages[0] || undefined
      });
      showNotice(`Đã cập nhật dự án "${projTitle.trim()}"!`);
    }

    setEditingProject(null);
    setIsAddingProject(false);
  };

  // Blog Management Handlers in Admin Modal
  const handleOpenAddBlogModal = () => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    setEditingBlog(null);
    setIsAddingBlog(true);
    setBlogTitle('');
    setBlogCategory('Kinh Nghiệm Điện Mặt Trời');
    setBlogAuthor('Kỹ Sư Đức Vinh Solar');
    setBlogPublishedAt(dateStr);
    setBlogReadTime('5 phút đọc');
    setBlogSummary('');
    setBlogContent('');
    setBlogTagsText('Điện mặt trời, Đức Vinh Solar');
    setBlogImages([]);
  };

  const handleOpenEditBlogModal = (post: BlogPost) => {
    setEditingBlog(post);
    setIsAddingBlog(false);
    setBlogTitle(post.title || '');
    setBlogCategory(post.category || 'Kinh Nghiệm Điện Mặt Trời');
    setBlogAuthor(post.author || 'Kỹ Sư Đức Vinh Solar');
    setBlogPublishedAt(post.publishedAt || '');
    setBlogReadTime(post.readTime || '5 phút đọc');
    setBlogSummary(post.summary || '');
    setBlogContent(post.content || '');
    setBlogTagsText(Array.isArray(post.tags) ? post.tags.join(', ') : '');
    setBlogImages(
      Array.isArray(post.images) && post.images.length > 0
        ? post.images.filter(Boolean)
        : post.imageUrl
        ? [post.imageUrl]
        : []
    );
  };

  const handleSaveBlogModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;

    const tagsList = blogTagsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const summaryClean =
      blogSummary.trim() ||
      blogContent
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 180) + '...';

    if (editingBlog) {
      updateBlogPost(editingBlog.id, {
        title: blogTitle.trim(),
        category: blogCategory.trim() || 'Kinh Nghiệm Điện Mặt Trời',
        author: blogAuthor.trim() || 'Kỹ Sư Đức Vinh Solar',
        publishedAt: blogPublishedAt.trim() || '2026',
        readTime: blogReadTime.trim() || '5 phút đọc',
        summary: summaryClean,
        content: blogContent.trim() || summaryClean,
        tags: tagsList.length > 0 ? tagsList : ['Điện mặt trời'],
        images: blogImages,
        imageUrl: blogImages[0] || undefined
      });
      showNotice(`Đã cập nhật bài viết "${blogTitle.trim()}"!`);
    } else if (isAddingBlog) {
      addBlogPost({
        title: blogTitle.trim(),
        category: blogCategory.trim() || 'Kinh Nghiệm Điện Mặt Trời',
        author: blogAuthor.trim() || 'Kỹ Sư Đức Vinh Solar',
        publishedAt: blogPublishedAt.trim() || '2026',
        readTime: blogReadTime.trim() || '5 phút đọc',
        summary: summaryClean,
        content: blogContent.trim() || summaryClean,
        tags: tagsList.length > 0 ? tagsList : ['Điện mặt trời'],
        images: blogImages,
        imageUrl: blogImages[0] || undefined
      });
      showNotice(`Đã thêm bài viết mới "${blogTitle.trim()}"!`);
    }

    setEditingBlog(null);
    setIsAddingBlog(false);
  };

  const handleAddSpecRow = () => {
    setFormSpecs(prev => [...prev, { label: '', value: '' }]);
  };

  const handleUpdateSpecRow = (idx: number, field: 'label' | 'value', val: string) => {
    setFormSpecs(prev =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    );
  };

  const handleRemoveSpecRow = (idx: number) => {
    requestConfirm(
      'Bạn chắc chắn muốn xóa dòng thông số kỹ thuật này hay không?',
      () => {
        setFormSpecs(prev => prev.filter((_, i) => i !== idx));
      }
    );
  };

  // Category CRUD Handlers in Admin Tab
  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catLabel.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        label: catLabel.trim(),
        shortLabel: catLabel.trim(),
        desc: catDesc.trim(),
        iconName: catIcon
      });
      showNotice(`Đã cập nhật loại thiết bị "${catLabel.trim()}"!`);
      setEditingCategory(null);
    } else {
      addCategory({
        label: catLabel.trim(),
        shortLabel: catLabel.trim(),
        desc: catDesc.trim() || 'Thiết bị chính hãng Đức Vinh Solar',
        iconName: catIcon
      });
      showNotice(`Đã thêm loại thiết bị "${catLabel.trim()}"!`);
    }
    setCatLabel('');
    setCatDesc('');
    setCatIcon('Sun');
  };

  const startEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCatLabel(cat.label);
    setCatDesc(cat.desc);
    setCatIcon(cat.iconName || 'Package');
  };

  // Brand CRUD Handlers in Admin Tab
  const handleSubmitBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !brandCategoryId) return;

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        name: brandName.trim(),
        categoryId: brandCategoryId,
        origin: brandOrigin.trim()
      });
      showNotice(`Đã cập nhật hãng "${brandName.trim()}"!`);
      setEditingBrand(null);
    } else {
      addBrand({
        name: brandName.trim(),
        categoryId: brandCategoryId,
        origin: brandOrigin.trim() || 'Chính hãng'
      });
      showNotice(`Đã thêm hãng "${brandName.trim()}"!`);
    }
    setBrandName('');
    setBrandOrigin('Chính hãng');
  };

  const startEditBrand = (b: BrandItem) => {
    setEditingBrand(b);
    setBrandName(b.name);
    setBrandCategoryId(b.categoryId);
    setBrandOrigin(b.origin || 'Chính hãng');
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo({
      hotlineZalo: compHotline.trim(),
      email: compEmail.trim(),
      officeAddress: compAddress.trim(),
      warehouseAddress: compWarehouseAddress.trim(),
      warehouseMapUrl: compWarehouseMapUrl.trim(),
      status: compStatus.trim()
    });
    setCompSaved(true);
    setTimeout(() => setCompSaved(false), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const datePart = now.toISOString().split('T')[0];
    const timePart = `${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `DucVinhSolar_Backup_${datePart}_${timePart}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Đã tải tệp sao lưu hệ thống (.json) về máy thành công!');
  };

  const handleCopyBackupJson = async () => {
    try {
      const jsonStr = exportBackup();
      await navigator.clipboard.writeText(jsonStr);
      setCopiedBackup(true);
      showNotice('Đã sao chép toàn bộ mã dữ liệu sao lưu (JSON) vào bộ nhớ tạm!');
      setTimeout(() => setCopiedBackup(false), 3000);
    } catch {
      showNotice('Không thể tự động sao chép, vui lòng dùng nút Tải File Sao Lưu!');
    }
  };

  const parseAndPreviewBackup = (content: string, sourceLabel: string) => {
    try {
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== 'object') {
        showNotice('Tệp sao lưu không đúng cấu trúc đối tượng JSON!');
        return;
      }
      const hasValidData =
        Array.isArray(parsed.categories) ||
        Array.isArray(parsed.brands) ||
        Array.isArray(parsed.products) ||
        Array.isArray(parsed.projects) ||
        Boolean(parsed.companyInfo) ||
        Array.isArray(parsed.inquiries);

      if (!hasValidData) {
        showNotice('Tệp JSON không chứa dữ liệu hợp lệ của hệ thống Đức Vinh Solar!');
        return;
      }

      setBackupPreview({
        fileName: sourceLabel,
        rawJson: content,
        exportedAt: parsed.exportedAt,
        categoriesCount: Array.isArray(parsed.categories) ? parsed.categories.length : 0,
        brandsCount: Array.isArray(parsed.brands) ? parsed.brands.length : 0,
        productsCount: Array.isArray(parsed.products) ? parsed.products.length : 0,
        projectsCount: Array.isArray(parsed.projects) ? parsed.projects.length : 0,
        inquiriesCount: Array.isArray(parsed.inquiries) ? parsed.inquiries.length : 0,
        hasCompanyInfo: Boolean(parsed.companyInfo)
      });
      setShowPasteJson(false);
      showNotice(`Đã đọc bản sao lưu "${sourceLabel}". Vui lòng kiểm tra thông tin và bấm Xác Nhận Khôi Phục!`);
    } catch {
      showNotice('Lỗi: Nội dung không đúng định dạng JSON chuẩn. Vui lòng kiểm tra lại file!');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        parseAndPreviewBackup(content, file.name);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmRestore = () => {
    if (!backupPreview) return;
    const modeDesc =
      restoreMode === 'replace'
        ? 'GHI ĐÈ TOÀN BỘ hệ thống hiện tại bằng dữ liệu từ bản sao lưu'
        : 'GỘP BỔ SUNG dữ liệu từ bản sao lưu vào hệ thống hiện tại';

    requestConfirm(
      `Bạn chắc chắn muốn ${modeDesc} (${backupPreview.categoriesCount} loại thiết bị, ${backupPreview.brandsCount} hãng, ${backupPreview.productsCount} sản phẩm, ${backupPreview.projectsCount} dự án) và đồng bộ cho tất cả các máy hay không?`,
      async () => {
        const res = await importBackup(backupPreview.rawJson, restoreMode);
        showNotice(res.message);
        if (res.success) {
          setBackupPreview(null);
          setPastedJsonText('');
        }
      },
      'Xác Nhận Khôi Phục Dữ Liệu Hệ Thống'
    );
  };

  const brandsForFormCategory = brands.filter(b => b.categoryId === formCategory);
  const displayedBrandsInManager = brands.filter(b =>
    filterBrandCat === 'all' ? true : b.categoryId === filterBrandCat
  );

  // Admin Categories Pagination (5 per page)
  const totalAdminCatPages = Math.max(1, Math.ceil(categories.length / ADMIN_CATEGORIES_PER_PAGE));
  const safeAdminCatPage = Math.min(adminCatPage, totalAdminCatPages);
  const paginatedAdminCategories = categories.slice(
    (safeAdminCatPage - 1) * ADMIN_CATEGORIES_PER_PAGE,
    safeAdminCatPage * ADMIN_CATEGORIES_PER_PAGE
  );

  // Admin Brands Pagination (5 per page)
  const totalAdminBrandPages = Math.max(1, Math.ceil(displayedBrandsInManager.length / ADMIN_BRANDS_PER_PAGE));
  const safeAdminBrandPage = Math.min(adminBrandPage, totalAdminBrandPages);
  const paginatedAdminBrands = displayedBrandsInManager.slice(
    (safeAdminBrandPage - 1) * ADMIN_BRANDS_PER_PAGE,
    safeAdminBrandPage * ADMIN_BRANDS_PER_PAGE
  );

  // Admin Products Pagination (20 per page)
  const filteredAdminProducts = products.filter(p => {
    const q = adminProductSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q)
    );
  });
  const totalAdminProductPages = Math.max(1, Math.ceil(filteredAdminProducts.length / ADMIN_PRODUCTS_PER_PAGE));
  const safeAdminProductPage = Math.min(adminProductPage, totalAdminProductPages);
  const paginatedAdminProducts = filteredAdminProducts.slice(
    (safeAdminProductPage - 1) * ADMIN_PRODUCTS_PER_PAGE,
    safeAdminProductPage * ADMIN_PRODUCTS_PER_PAGE
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading">
                Hệ Thống Quản Trị – Đức Vinh Solar
              </h2>
              <p className="text-[11px] text-emerald-300">
                {isAdmin ? 'Đang đăng nhập với quyền Quản trị viên (Admin)' : 'Xác thực tài khoản để truy cập'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  type="button"
                  disabled={isSyncingCloud}
                  onClick={async () => {
                    const ok = await syncAllToCloud();
                    if (ok) {
                      showNotice('Đã đồng bộ toàn bộ Loại, Hãng, Sản phẩm & Dự án lên Đám mây cho tất cả các máy!');
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-100 bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  title="Đồng bộ toàn bộ dữ liệu hiện tại lên đám mây cho mọi thiết bị"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                  <span>{isSyncingCloud ? 'Đang đồng bộ...' : 'Đồng Bộ Web Ngay'}</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/40 rounded-lg transition-colors flex items-center gap-1"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            )}
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inline Notification Banner */}
        {adminNotice && (
          <div className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{adminNotice}</span>
            </div>
            <button onClick={() => setAdminNotice(null)} className="text-emerald-100 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        {!isAdmin ? (
          /* LOGIN VIEW */
          <div className="p-8 max-w-md mx-auto w-full my-auto text-slate-800">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Đăng Nhập Quản Trị Kho</h3>
              <p className="text-xs text-slate-500 mt-1">
                Quản lý loại thiết bị, các hãng sản xuất, sản phẩm và số lượng tồn kho
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tài Khoản Quản Trị (Admin)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật Khẩu
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
              >
                Đăng Nhập Vào Quản Trị
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN ADMIN CONSOLE */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none">
              <button
                onClick={() => {
                  setAdminActiveTab('categories-brands');
                  setEditingProduct(null);
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'categories-brands'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Quản Lý Loại &amp; Hãng ({categories.length} Loại · {brands.length} Hãng)</span>
              </button>

              <button
                onClick={() => {
                  setAdminActiveTab('inventory');
                  setEditingProduct(null);
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'inventory'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Quản Lý Sản Phẩm &amp; Kho ({products.length})</span>
              </button>

              <button
                onClick={() => {
                  setAdminActiveTab('projects');
                  setEditingProject(null);
                  setIsAddingProject(false);
                }}
                className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'projects'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Quản Lý Dự Án ({projects.length})</span>
              </button>

              <button
                onClick={() => {
                  setAdminActiveTab('blog');
                  setEditingBlog(null);
                  setIsAddingBlog(false);
                }}
                className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'blog'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Quản Lý Blog ({blogPosts.length})</span>
              </button>

              <button
                onClick={() => {
                  setAdminActiveTab('inquiries');
                  setEditingProduct(null);
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'inquiries'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Yêu Cầu Báo Giá ({inquiries.length})</span>
              </button>

              <button
                onClick={() => {
                  setAdminActiveTab('company');
                  setEditingProduct(null);
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'company'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Thông Tin Công Ty</span>
              </button>

              <button
                onClick={() => {
                  setAdminActiveTab('backup');
                  setEditingProduct(null);
                  setIsAddingNew(false);
                }}
                className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  adminActiveTab === 'backup'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Sao Lưu &amp; Khôi Phục</span>
              </button>
            </div>

            {/* Tab Views */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB: QUẢN LÝ LOẠI & HÃNG */}
              {adminActiveTab === 'categories-brands' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Quản Lý Các Loại Thiết Bị (Categories) */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-emerald-600" />
                          <span>{editingCategory ? 'Sửa Loại Thiết Bị' : 'Thêm Loại Thiết Bị Mới'}</span>
                        </h3>
                        {editingCategory && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(null);
                              setCatLabel('');
                              setCatDesc('');
                            }}
                            className="text-xs text-slate-500 hover:text-slate-800"
                          >
                            Hủy sửa
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSubmitCategory} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Tên Loại Thiết Bị *
                          </label>
                          <input
                            type="text"
                            required
                            value={catLabel}
                            onChange={(e) => setCatLabel(e.target.value)}
                            placeholder="VD: Tấm Pin Mặt Trời, Biến Tần, Phụ Kiện..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Mô Tả Ngắn / Gợi Ý Hãng
                          </label>
                          <input
                            type="text"
                            value={catDesc}
                            onChange={(e) => setCatDesc(e.target.value)}
                            placeholder="VD: SolaX, Deye, Solis..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Biểu Tượng Hiển Thị
                          </label>
                          <select
                            value={catIcon}
                            onChange={(e) => setCatIcon(e.target.value as CategoryIconName)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          >
                            <option value="Sun">Tấm Pin Mặt Trời (Sun)</option>
                            <option value="Cpu">Biến Tần Inverter (Cpu)</option>
                            <option value="BatteryCharging">Pin Lưu Trữ ESS (Battery)</option>
                            <option value="Lightbulb">Đèn Năng Lượng (Lightbulb)</option>
                            <option value="Package">Vật Tư / Thiết Bị Khác (Package)</option>
                            <option value="Wrench">Phụ Kiện Lắp Đặt (Wrench)</option>
                            <option value="ShieldCheck">Tủ Điện / Bảo Vệ (ShieldCheck)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          {editingCategory ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{editingCategory ? 'Cập Nhật Loại Thiết Bị' : 'Thêm Loại Thiết Bị'}</span>
                        </button>
                      </form>
                    </div>

                    {/* List of existing categories (Paginated 5 per page) */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Danh Sách Các Loại Hiện Có ({categories.length})
                        </h4>
                        {categories.length > ADMIN_CATEGORIES_PER_PAGE && (
                          <span className="text-[11px] font-semibold text-emerald-700">
                            Trang {safeAdminCatPage}/{totalAdminCatPages}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {paginatedAdminCategories.map((cat) => {
                          const prodCount = products.filter(p => p.category === cat.id).length;
                          const brandCount = brands.filter(b => b.categoryId === cat.id).length;
                          return (
                            <div
                              key={cat.id}
                              className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-emerald-400 transition-colors"
                            >
                              <div>
                                <div className="text-xs font-bold text-slate-900">
                                  {cat.label}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {cat.desc} · <strong className="text-emerald-700">{brandCount} hãng</strong> · <strong>{prodCount} SP</strong>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditCategory(cat)}
                                  className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                                  title="Sửa loại thiết bị"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteCategory(cat.id, () => {
                                      showNotice(`Đã xóa loại thiết bị "${cat.label}"!`);
                                    });
                                  }}
                                  className="px-2 py-1 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 rounded-md transition-colors flex items-center gap-1"
                                  title="Xóa loại thiết bị"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Xóa</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {categories.length > ADMIN_CATEGORIES_PER_PAGE && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                          <span className="text-[11px] text-slate-500">
                            Trang {safeAdminCatPage} / {totalAdminCatPages}
                          </span>
                          <div className="flex flex-wrap items-center gap-1">
                            <button
                              type="button"
                              disabled={safeAdminCatPage <= 1}
                              onClick={() => setAdminCatPage(p => Math.max(1, p - 1))}
                              className="px-2 py-1 text-[11px] font-bold rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 flex items-center gap-0.5"
                            >
                              <ChevronLeft className="w-3 h-3" />
                              <span>Trang trước</span>
                            </button>
                            {getCompactPageItems(safeAdminCatPage, totalAdminCatPages).map((item) =>
                              typeof item === 'string' ? (
                                <span
                                  key={item}
                                  className="px-1 text-[11px] font-bold text-slate-400 select-none"
                                >
                                  ...
                                </span>
                              ) : (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => setAdminCatPage(item)}
                                  className={`w-6 h-6 rounded text-[11px] font-bold ${
                                    safeAdminCatPage === item
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-white text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {item}
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              disabled={safeAdminCatPage >= totalAdminCatPages}
                              onClick={() => setAdminCatPage(p => Math.min(totalAdminCatPages, p + 1))}
                              className="px-2 py-1 text-[11px] font-bold rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 flex items-center gap-0.5"
                            >
                              <span>Trang sau</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Quản Lý Các Hãng Sản Xuất (Brands) */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span>{editingBrand ? `Sửa Hãng: ${editingBrand.name}` : 'Thêm Hãng Sản Xuất Mới'}</span>
                        </h3>
                        {editingBrand && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBrand(null);
                              setBrandName('');
                            }}
                            className="text-xs text-slate-500 hover:text-slate-800"
                          >
                            Hủy sửa
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSubmitBrand} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Tên Hãng Sản Xuất *
                          </label>
                          <input
                            type="text"
                            required
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="VD: SolaX, Deye, Solis..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Thuộc Loại Thiết Bị *
                          </label>
                          <select
                            value={brandCategoryId}
                            onChange={(e) => setBrandCategoryId(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Xuất Xứ / Ghi Chú
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={brandOrigin}
                              onChange={(e) => setBrandOrigin(e.target.value)}
                              placeholder="VD: Chính hãng Tier 1"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                            />
                            <button
                              type="submit"
                              className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                            >
                              {editingBrand ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              <span>{editingBrand ? 'Lưu' : 'Thêm'}</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Filter & Table of Brands (Paginated 5 per page) */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Danh Sách Các Hãng ({displayedBrandsInManager.length})
                        </h4>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Lọc theo loại:</span>
                          <select
                            value={filterBrandCat}
                            onChange={(e) => {
                              setFilterBrandCat(e.target.value);
                              setAdminBrandPage(1);
                            }}
                            className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md font-medium"
                          >
                            <option value="all">Tất cả các loại</option>
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-4 font-bold">Tên Hãng</th>
                              <th className="py-2.5 px-3 font-bold">Thuộc Loại Thiết Bị</th>
                              <th className="py-2.5 px-3 font-bold">Xuất Xứ</th>
                              <th className="py-2.5 px-3 font-bold text-center">Số SP</th>
                              <th className="py-2.5 px-4 font-bold text-right">Thao Tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {paginatedAdminBrands.map((b) => {
                              const catObj = categories.find(c => c.id === b.categoryId);
                              const prodCount = products.filter(
                                p =>
                                  p.category === b.categoryId &&
                                  (p.brand || '').trim().toLowerCase() === b.name.trim().toLowerCase()
                              ).length;

                              return (
                                <tr key={b.id} className="hover:bg-slate-50/80">
                                  <td className="py-2.5 px-4 font-bold text-emerald-800">
                                    Hãng {b.name}
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-700 font-medium">
                                    {catObj ? catObj.label : b.categoryId}
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-500">
                                    {b.origin || 'Chính hãng'}
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                                    {prodCount}
                                  </td>
                                  <td className="py-2.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        type="button"
                                        onClick={() => startEditBrand(b)}
                                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                                        title="Sửa hãng"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          deleteBrand(b.id, () => {
                                            showNotice(`Đã xóa hãng "${b.name}"!`);
                                          });
                                        }}
                                        className="px-2 py-1 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 rounded-md transition-colors flex items-center gap-1"
                                        title="Xóa hãng"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Xóa</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {displayedBrandsInManager.length > ADMIN_BRANDS_PER_PAGE && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                          <span className="text-[11px] text-slate-500">
                            Trang hãng {safeAdminBrandPage} / {totalAdminBrandPages} ({displayedBrandsInManager.length} hãng)
                          </span>
                          <div className="flex flex-wrap items-center gap-1">
                            <button
                              type="button"
                              disabled={safeAdminBrandPage <= 1}
                              onClick={() => setAdminBrandPage(p => Math.max(1, p - 1))}
                              className="px-2 py-1 text-[11px] font-bold rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 flex items-center gap-0.5"
                            >
                              <ChevronLeft className="w-3 h-3" />
                              <span>Trang trước</span>
                            </button>
                            {getCompactPageItems(safeAdminBrandPage, totalAdminBrandPages).map((item) =>
                              typeof item === 'string' ? (
                                <span
                                  key={item}
                                  className="px-1 text-[11px] font-bold text-slate-400 select-none"
                                >
                                  ...
                                </span>
                              ) : (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => setAdminBrandPage(item)}
                                  className={`w-6 h-6 rounded text-[11px] font-bold ${
                                    safeAdminBrandPage === item
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-white text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {item}
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              disabled={safeAdminBrandPage >= totalAdminBrandPages}
                              onClick={() => setAdminBrandPage(p => Math.min(totalAdminBrandPages, p + 1))}
                              className="px-2 py-1 text-[11px] font-bold rounded border border-slate-200 bg-white text-slate-700 disabled:opacity-40 flex items-center gap-0.5"
                            >
                              <span>Trang sau</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: INVENTORY & PRODUCTS */}
              {adminActiveTab === 'inventory' && (
                <div>
                  {/* If editing or adding new product */}
                  {isAddingNew || editingProduct ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                        <h4 className="text-sm font-bold text-slate-900">
                          {isAddingNew ? 'Thêm Sản Phẩm Mới Vào Kho' : `Chỉnh Sửa Sản Phẩm: ${editingProduct?.name}`}
                        </h4>
                        <button
                          onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Hủy bỏ
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Tên Sản Phẩm *
                            </label>
                            <input
                              type="text"
                              required
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="Ví dụ: Biến tần Hybrid SolaX 6kW"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:border-emerald-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Mã SKU *
                            </label>
                            <input
                              type="text"
                              required
                              value={formSku}
                              onChange={(e) => setFormSku(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Loại Thiết Bị (Danh Mục)
                            </label>
                            <select
                              value={formCategory}
                              onChange={(e) => {
                                const newCat = e.target.value;
                                setFormCategory(newCat);
                                const matchingBrand = brands.find(b => b.categoryId === newCat);
                                if (matchingBrand) {
                                  setFormBrand(matchingBrand.name);
                                }
                              }}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Thương Hiệu / Hãng
                            </label>
                            <input
                              type="text"
                              list="solar-brands-list"
                              value={formBrand}
                              onChange={(e) => setFormBrand(e.target.value)}
                              placeholder="Chọn hoặc gõ tên hãng mới..."
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                            <datalist id="solar-brands-list">
                              {brandsForFormCategory.map(b => (
                                <option key={b.id} value={b.name} />
                              ))}
                            </datalist>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Số Lượng Tồn Kho
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formStock}
                              onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md font-mono font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Đơn Vị Tính
                            </label>
                            <input
                              type="text"
                              value={formUnit}
                              onChange={(e) => setFormUnit(e.target.value)}
                              placeholder="tấm, bộ, máy..."
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Bảo Hành (Năm)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={formWarranty}
                              onChange={(e) => setFormWarranty(parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Xuất Xứ &amp; Giấy Tờ
                            </label>
                            <input
                              type="text"
                              value={formOrigin}
                              onChange={(e) => setFormOrigin(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Kiểu Hình Ảnh Minh Họa
                            </label>
                            <select
                              value={formSvgType}
                              onChange={(e) => setFormSvgType(e.target.value as Product['svgType'])}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            >
                              <option value="panel">Tấm Pin Solar</option>
                              <option value="inverter">Biến Tần Inverter</option>
                              <option value="battery">Pin Lưu Trữ Lithium</option>
                              <option value="streetlight">Đèn Đường Năng Lượng</option>
                            </select>
                          </div>
                        </div>

                        {/* Multi-Image Upload (File or URL) for Product */}
                        <MultiImageInput
                          images={formImages}
                          onChange={setFormImages}
                          label="Hình Ảnh Sản Phẩm (Thêm nhiều ảnh từ File máy tính / điện thoại hoặc Link)"
                          helperText="Bạn có thể chọn nhiều file ảnh cùng lúc từ máy hoặc dán nhiều đường dẫn link ảnh. Ảnh đầu tiên sẽ là ảnh đại diện chính."
                        />

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Mô Tả Ngắn
                          </label>
                          <input
                            type="text"
                            value={formShortDesc}
                            onChange={(e) => setFormShortDesc(e.target.value)}
                            placeholder="Tóm tắt công nghệ và tính năng chính..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Mô Tả Đầy Đủ Chi Tiết
                          </label>
                          <textarea
                            rows={3}
                            value={formFullDesc}
                            onChange={(e) => setFormFullDesc(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                          />
                        </div>

                        {/* Specs Table Editing */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-800">
                              Thông Số Kỹ Thuật Chi Tiết
                            </span>
                            <button
                              type="button"
                              onClick={handleAddSpecRow}
                              className="text-xs text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Thêm dòng thông số</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {formSpecs.map((spec, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Tên thông số (Vd: Công suất đỉnh)"
                                  value={spec.label}
                                  onChange={(e) => handleUpdateSpecRow(idx, 'label', e.target.value)}
                                  className="w-1/2 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                                />
                                <input
                                  type="text"
                                  placeholder="Giá trị (Vd: 580 Wp)"
                                  value={spec.value}
                                  onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                                  className="w-1/2 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecRow(idx)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>Lưu Sản Phẩm</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Products List View with Fast Stock Update & Search */
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Danh Sách Thiết Bị &amp; Tồn Kho Thực Tế
                          </h3>
                          <p className="text-xs text-slate-500">
                            Cập nhật nhanh số lượng tồn kho hoặc bấm Sửa để thêm nhiều hình ảnh cho sản phẩm:
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="relative w-56">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={adminProductSearch}
                              onChange={(e) => setAdminProductSearch(e.target.value)}
                              placeholder="Tìm tên SP, SKU, hãng..."
                              className="w-full pl-8 pr-7 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                            />
                            {adminProductSearch && (
                              <button
                                type="button"
                                onClick={() => setAdminProductSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-700 font-bold"
                              >
                                X
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={handleOpenAddNew}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Thêm Sản Phẩm Mới</span>
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4 font-bold">Mã SKU / Tên Thiết Bị</th>
                              <th className="py-3 px-3 font-bold">Loại Thiết Bị</th>
                              <th className="py-3 px-3 font-bold">Hãng</th>
                              <th className="py-3 px-3 font-bold text-center">Ảnh</th>
                              <th className="py-3 px-4 font-bold text-center">Số Lượng Kho</th>
                              <th className="py-3 px-3 font-bold">Trạng Thái</th>
                              <th className="py-3 px-4 font-bold text-right">Thao Tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {paginatedAdminProducts.map((p) => {
                                const catObj = categories.find(c => c.id === p.category);
                                const imgCount = Array.isArray(p.images) && p.images.length > 0
                                  ? p.images.length
                                  : p.imageUrl
                                  ? 1
                                  : 0;
                                return (
                                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3 px-4">
                                      <div className="font-mono text-[11px] font-bold text-emerald-700">
                                        {p.sku}
                                      </div>
                                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                                        {p.name}
                                      </div>
                                    </td>

                                    <td className="py-3 px-3 text-slate-600">
                                      {catObj ? catObj.shortLabel : p.category}
                                    </td>

                                    <td className="py-3 px-3 text-emerald-800 font-bold">
                                      {p.brand}
                                    </td>

                                    <td className="py-3 px-3 text-center">
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono">
                                        <ImageIcon className="w-3 h-3 text-emerald-600" />
                                        {imgCount}
                                      </span>
                                    </td>

                                    {/* Inline Stock adjustment */}
                                    <td className="py-3 px-4 text-center">
                                      <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
                                        <button
                                          type="button"
                                          onClick={() => updateProductStock(p.id, p.stock - 1)}
                                          className="w-6 h-6 rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
                                          title="Giảm 1"
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          value={p.stock}
                                          onChange={(e) => updateProductStock(p.id, parseInt(e.target.value) || 0)}
                                          className="w-14 text-center font-mono font-bold text-slate-900 text-xs bg-transparent focus:outline-hidden"
                                        />
                                        <span className="text-[10px] text-slate-400 pr-1">{p.unit}</span>
                                        <button
                                          type="button"
                                          onClick={() => updateProductStock(p.id, p.stock + 1)}
                                          className="w-6 h-6 rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
                                          title="Tăng 1"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </td>

                                    <td className="py-3 px-3">
                                      {p.stock > 10 ? (
                                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                                          Còn hàng
                                        </span>
                                      ) : p.stock > 0 ? (
                                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                                          Sắp hết
                                        </span>
                                      ) : (
                                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                                          Hết hàng
                                        </span>
                                      )}
                                    </td>

                                    <td className="py-3 px-4 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEdit(p)}
                                          className="px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-md transition-colors flex items-center gap-1"
                                          title="Chỉnh sửa thông tin & thêm nhiều ảnh"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                          <span>Sửa / Ảnh</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            deleteProduct(p.id, () => {
                                              showNotice(`Đã xóa sản phẩm "${p.name}"!`);
                                            });
                                          }}
                                          className="px-2 py-1 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 rounded-md transition-colors flex items-center gap-1"
                                          title="Xóa sản phẩm"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Xóa</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>

                      {filteredAdminProducts.length > ADMIN_PRODUCTS_PER_PAGE && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                          <span className="text-xs text-slate-600">
                            Trang sản phẩm <strong className="text-emerald-800">{safeAdminProductPage} / {totalAdminProductPages}</strong> (Hiển thị {(safeAdminProductPage - 1) * ADMIN_PRODUCTS_PER_PAGE + 1}–{Math.min(safeAdminProductPage * ADMIN_PRODUCTS_PER_PAGE, filteredAdminProducts.length)} / {filteredAdminProducts.length} sản phẩm)
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              disabled={safeAdminProductPage <= 1}
                              onClick={() => setAdminProductPage(p => Math.max(1, p - 1))}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 flex items-center gap-1"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span>Trang trước</span>
                            </button>
                            {getCompactPageItems(safeAdminProductPage, totalAdminProductPages).map((item) =>
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
                                  onClick={() => setAdminProductPage(item)}
                                  className={`w-7 h-7 rounded-lg text-xs font-bold ${
                                    safeAdminProductPage === item
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-white text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {item}
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              disabled={safeAdminProductPage >= totalAdminProductPages}
                              onClick={() => setAdminProductPage(p => Math.min(totalAdminProductPages, p + 1))}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 flex items-center gap-1"
                            >
                              <span>Trang sau</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PROJECTS MANAGEMENT */}
              {adminActiveTab === 'projects' && (
                <div>
                  {isAddingProject || editingProject ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                        <h4 className="text-sm font-bold text-slate-900">
                          {isAddingProject
                            ? 'Thêm Dự Án Tiêu Biểu Mới'
                            : `Chỉnh Sửa Dự Án: ${editingProject?.title}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(null);
                            setIsAddingProject(false);
                          }}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Hủy bỏ
                        </button>
                      </div>

                      <form onSubmit={handleSaveProjectModal} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Tên Dự Án *
                            </label>
                            <input
                              type="text"
                              required
                              value={projTitle}
                              onChange={(e) => setProjTitle(e.target.value)}
                              placeholder="VD: Hệ Thống Điện Mặt Trời Áp Mái 15kWp – Hóc Môn"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Phân Loại Dự Án
                            </label>
                            <select
                              value={projCategory}
                              onChange={(e) => setProjCategory(e.target.value as ProjectItem['category'])}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            >
                              <option value="residential">Hộ Gia Đình</option>
                              <option value="commercial">Nhà Xưởng &amp; C&amp;I</option>
                              <option value="hybrid">Lưu Trữ Hybrid</option>
                              <option value="lighting">Chiếu Sáng Năng Lượng</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Công Suất Lắp Đặt
                            </label>
                            <input
                              type="text"
                              value={projCapacity}
                              onChange={(e) => setProjCapacity(e.target.value)}
                              placeholder="VD: 15 kWp"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Địa Điểm
                            </label>
                            <input
                              type="text"
                              value={projLocation}
                              onChange={(e) => setProjLocation(e.target.value)}
                              placeholder="VD: Hóc Môn, TP.HCM"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Thời Gian Hoàn Thành
                            </label>
                            <input
                              type="text"
                              value={projDate}
                              onChange={(e) => setProjDate(e.target.value)}
                              placeholder="VD: Tháng 10/2026"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Hiệu Quả Sinh Điện / Tiết Kiệm
                            </label>
                            <input
                              type="text"
                              value={projSaving}
                              onChange={(e) => setProjSaving(e.target.value)}
                              placeholder="VD: Tiết kiệm ~6 triệu/tháng"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Mô Tả Chi Tiết Dự Án
                            </label>
                            <textarea
                              rows={3}
                              value={projDesc}
                              onChange={(e) => setProjDesc(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Thiết Bị Chính Sử Dụng (Mỗi thiết bị 1 dòng)
                            </label>
                            <textarea
                              rows={3}
                              value={projEquipmentText}
                              onChange={(e) => setProjEquipmentText(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>
                        </div>

                        <MultiImageInput
                          images={projImages}
                          onChange={setProjImages}
                          label="Hình Ảnh Thực Tế Dự Án (Tải nhiều file từ máy hoặc dán Link)"
                          helperText="Bạn có thể chọn nhiều ảnh công trình từ máy tính / điện thoại hoặc dán nhiều đường dẫn link ảnh."
                        />

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(null);
                              setIsAddingProject(false);
                            }}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>Lưu Dự Án</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Danh Sách Dự Án Tiêu Biểu Đã Thực Hiện ({projects.length})
                          </h3>
                          <p className="text-xs text-slate-500">
                            Thêm mới, chỉnh sửa nội dung, tải lên nhiều hình ảnh thực tế (bằng file hoặc link) hoặc xóa dự án:
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleOpenAddProjectModal}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Thêm Dự Án Mới</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {projects.map((proj) => {
                          const imgCount = Array.isArray(proj.images) && proj.images.length > 0
                            ? proj.images.length
                            : proj.imageUrl
                            ? 1
                            : 0;
                          return (
                            <div
                              key={proj.id}
                              className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-400 transition-colors"
                            >
                              <div className="flex items-start gap-3.5">
                                {((proj.images && proj.images[0]) || proj.imageUrl) ? (
                                  <img
                                    src={(proj.images && proj.images[0]) || proj.imageUrl}
                                    alt={proj.title}
                                    className="w-20 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-20 h-14 rounded-lg bg-emerald-900 text-emerald-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    Solar
                                  </div>
                                )}
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {proj.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-emerald-700">
                                      Công suất: {proj.capacity}
                                    </span>
                                    <span>·</span>
                                    <span>{proj.location}</span>
                                    <span>·</span>
                                    <span>{proj.completionDate}</span>
                                    <span>·</span>
                                    <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                                      <ImageIcon className="w-3 h-3" />
                                      {imgCount} ảnh
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProjectModal(proj)}
                                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Sửa / Thêm Ảnh</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteProject(proj.id, () => {
                                      showNotice(`Đã xóa dự án "${proj.title}"!`);
                                    });
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 rounded-md transition-colors flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Xóa</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: BLOG POSTS MANAGEMENT */}
              {adminActiveTab === 'blog' && (
                <div>
                  {(editingBlog || isAddingBlog) ? (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900">
                          {editingBlog
                            ? `Chỉnh Sửa Bài Viết: ${editingBlog.title}`
                            : 'Thêm Bài Viết Blog Mới'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBlog(null);
                            setIsAddingBlog(false);
                          }}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          &larr; Quay lại danh sách bài viết
                        </button>
                      </div>

                      <form onSubmit={handleSaveBlogModal} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Tiêu Đề Bài Viết *
                            </label>
                            <input
                              type="text"
                              required
                              value={blogTitle}
                              onChange={(e) => setBlogTitle(e.target.value)}
                              placeholder="VD: Kinh nghiệm chọn lắp điện mặt trời Hybrid..."
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Chuyên Mục *
                            </label>
                            <input
                              type="text"
                              required
                              value={blogCategory}
                              onChange={(e) => setBlogCategory(e.target.value)}
                              placeholder="VD: Kinh Nghiệm Điện Mặt Trời"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Tác Giả
                            </label>
                            <input
                              type="text"
                              value={blogAuthor}
                              onChange={(e) => setBlogAuthor(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Ngày Đăng
                            </label>
                            <input
                              type="text"
                              value={blogPublishedAt}
                              onChange={(e) => setBlogPublishedAt(e.target.value)}
                              placeholder="VD: 03/11/2026"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Thời Gian Đọc
                            </label>
                            <input
                              type="text"
                              value={blogReadTime}
                              onChange={(e) => setBlogReadTime(e.target.value)}
                              placeholder="VD: 5 phút đọc"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Tóm Tắt Ngắn (Hiển thị trên thẻ trượt ngang)
                          </label>
                          <textarea
                            rows={2}
                            value={blogSummary}
                            onChange={(e) => setBlogSummary(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Nội Dung Chi Tiết Bài Viết *
                          </label>
                          <textarea
                            rows={7}
                            required
                            value={blogContent}
                            onChange={(e) => setBlogContent(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Từ Khóa (Cách nhau bởi dấu phẩy)
                          </label>
                          <input
                            type="text"
                            value={blogTagsText}
                            onChange={(e) => setBlogTagsText(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                          />
                        </div>

                        <MultiImageInput
                          images={blogImages}
                          onChange={setBlogImages}
                          label="Hình Ảnh Bài Viết Blog (Tải nhiều ảnh từ máy hoặc dán Link)"
                          helperText="Bạn có thể tải ảnh từ máy tính / điện thoại hoặc dán đường dẫn link ảnh minh họa cho bài viết."
                        />

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBlog(null);
                              setIsAddingBlog(false);
                            }}
                            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>Lưu Bài Viết</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Danh Sách Bài Viết Blog ({blogPosts.length})
                          </h3>
                          <p className="text-xs text-slate-500">
                            Thêm bài viết mới, chỉnh sửa nội dung, cập nhật hình ảnh hoặc xóa bài viết trên thanh trượt Blog:
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleOpenAddBlogModal}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Thêm Bài Viết Mới</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {blogPosts.map((post) => {
                          const imgCount = Array.isArray(post.images) && post.images.length > 0
                            ? post.images.length
                            : post.imageUrl
                            ? 1
                            : 0;
                          return (
                            <div
                              key={post.id}
                              className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-400 transition-colors"
                            >
                              <div className="flex items-start gap-3.5">
                                {((post.images && post.images[0]) || post.imageUrl) ? (
                                  <img
                                    src={(post.images && post.images[0]) || post.imageUrl}
                                    alt={post.title}
                                    className="w-20 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-20 h-14 rounded-lg bg-emerald-950 text-emerald-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    Blog Solar
                                  </div>
                                )}
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {post.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-emerald-700">
                                      {post.category}
                                    </span>
                                    <span>·</span>
                                    <span>{post.publishedAt}</span>
                                    <span>·</span>
                                    <span>{post.readTime}</span>
                                    <span>·</span>
                                    <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                                      <ImageIcon className="w-3 h-3" />
                                      {imgCount} ảnh
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditBlogModal(post)}
                                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Sửa Bài</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteBlogPost(post.id, () => {
                                      showNotice(`Đã xóa bài viết "${post.title}"!`);
                                    });
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 rounded-md transition-colors flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Xóa</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CUSTOMER INQUIRIES */}
              {adminActiveTab === 'inquiries' && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Yêu Cầu Báo Giá &amp; Khảo Sát Từ Khách Hàng
                    </h3>
                    <p className="text-xs text-slate-500">
                      Danh sách khách hàng để lại thông tin trên website:
                    </p>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      Chưa có yêu cầu báo giá mới nào.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{inq.customerName}</span>
                              <span className="text-slate-300">·</span>
                              <a
                                href={`tel:${inq.phone}`}
                                className="font-mono font-bold text-emerald-700 text-xs hover:underline"
                              >
                                {inq.phone}
                              </a>
                              <span className="text-slate-300">·</span>
                              <span className="text-[11px] text-slate-400">{inq.createdAt}</span>
                            </div>

                            {inq.address && (
                              <div className="text-xs text-slate-600 mt-1">
                                <strong>Khu vực:</strong> {inq.address}
                              </div>
                            )}

                            {inq.productInterest && (
                              <div className="text-xs text-emerald-800 font-medium mt-0.5">
                                <strong>Quan tâm:</strong> {inq.productInterest}
                              </div>
                            )}

                            {inq.note && (
                              <div className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                                &ldquo;{inq.note}&rdquo;
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`https://zalo.me/${inq.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors"
                            >
                              Nhắn Zalo
                            </a>
                            <select
                              value={inq.status}
                              onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-slate-50 font-medium"
                            >
                              <option value="new">Mới nhận</option>
                              <option value="contacted">Đã liên hệ</option>
                              <option value="completed">Đã hoàn thành</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: COMPANY LEGAL INFO EDIT */}
              {adminActiveTab === 'company' && (
                <div className="max-w-2xl">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Cập Nhật Thông Tin Công Ty &amp; Kênh Liên Hệ
                    </h3>
                    <p className="text-xs text-slate-500">
                      Nội dung này được hiển thị công khai ở phần giới thiệu, liên hệ và footer:
                    </p>
                  </div>

                  {compSaved && (
                    <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Đã lưu thông tin công ty thành công!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveCompany} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tên Pháp Nhân Công Ty (Bất Biến Theo Giấy Phép)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={companyInfo.legalName}
                        className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-300 rounded-md text-slate-600 cursor-not-allowed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mã Số Thuế
                        </label>
                        <input
                          type="text"
                          disabled
                          value={companyInfo.taxCode}
                          className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-300 rounded-md text-slate-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Người Đại Diện Pháp Luật
                        </label>
                        <input
                          type="text"
                          disabled
                          value={companyInfo.representative}
                          className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-300 rounded-md text-slate-600 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Số Điện Thoại / Zalo Hotline
                        </label>
                        <input
                          type="text"
                          value={compHotline}
                          onChange={(e) => setCompHotline(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md font-mono font-bold text-emerald-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Liên Hệ
                        </label>
                        <input
                          type="email"
                          value={compEmail}
                          onChange={(e) => setCompEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tình Trạng Doanh Nghiệp
                        </label>
                        <input
                          type="text"
                          value={compStatus}
                          onChange={(e) => setCompStatus(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Địa Chỉ Văn Phòng Hoạt Động
                      </label>
                      <input
                        type="text"
                        value={compAddress}
                        onChange={(e) => setCompAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Địa Chỉ Kho Tổng (Hiển Thị Kèm Tọa Độ)
                      </label>
                      <input
                        type="text"
                        value={compWarehouseAddress}
                        onChange={(e) => setCompWarehouseAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Link Bản Đồ Google Maps Kho Tổng
                      </label>
                      <input
                        type="url"
                        value={compWarehouseMapUrl}
                        onChange={(e) => setCompWarehouseMapUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md font-mono text-emerald-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                    >
                      Lưu Thay Đổi Thông Tin
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: BACKUP & RESTORE */}
              {adminActiveTab === 'backup' && (
                <div className="max-w-4xl space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Database className="w-5 h-5 text-emerald-600" />
                        <span>Sao Lưu &amp; Khôi Phục Dữ Liệu Hệ Thống Chuẩn</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Quản lý toàn bộ cơ sở dữ liệu (Loại thiết bị, Hãng sản xuất, Sản phẩm, Dự án tiêu biểu, Thông tin công ty &amp; Yêu cầu báo giá) và đồng bộ trực tiếp lên đám mây cho tất cả các máy.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isSyncingCloud}
                      onClick={async () => {
                        const ok = await syncAllToCloud();
                        if (ok) {
                          showNotice('Đã đồng bộ toàn bộ dữ liệu hiện tại lên Web (Đám mây) thành công!');
                        } else {
                          showNotice('Có lỗi khi đồng bộ đám mây, vui lòng thử lại!');
                        }
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors shrink-0"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                      <span>
                        {isSyncingCloud ? 'Đang Đồng Bộ Lên Đám Mây...' : 'Đồng Bộ Tất Cả Lên Web Ngay'}
                      </span>
                    </button>
                  </div>

                  {/* SECTION 1: LIVE SYSTEM DATA SUMMARY */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        1. Thống Kê Dữ Liệu Đang Hoạt Động Trên Hệ Thống
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2.5 py-0.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Đồng bộ thời gian thực
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/70">
                        <div className="text-xl font-extrabold text-white">{categories.length}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Loại thiết bị</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/70">
                        <div className="text-xl font-extrabold text-amber-400">{brands.length}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Hãng sản xuất</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/70">
                        <div className="text-xl font-extrabold text-emerald-400">{products.length}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Sản phẩm</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/70">
                        <div className="text-xl font-extrabold text-sky-400">{projects.length}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Dự án tiêu biểu</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/70 col-span-2 sm:col-span-1">
                        <div className="text-xl font-extrabold text-purple-400">{inquiries.length}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Yêu cầu báo giá</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: EXPORT BACKUP */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          2. Sao Lưu Dữ Liệu Ra File (Backup)
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          Xuất toàn bộ dữ liệu hệ thống thành tệp chuẩn (.JSON)
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Bản sao lưu bao gồm đầy đủ: {categories.length} loại thiết bị, {brands.length} hãng sản xuất, {products.length} sản phẩm (kèm toàn bộ hình ảnh &amp; thông số kỹ thuật), {projects.length} dự án tiêu biểu và thông tin công ty.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleExport}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Tải File Sao Lưu (.JSON)</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyBackupJson}
                          className="px-3.5 py-2.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Check className={`w-4 h-4 ${copiedBackup ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{copiedBackup ? 'Đã Sao Chép Mã!' : 'Sao Chép Mã JSON'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: IMPORT & RESTORE WITH PREVIEW */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          3. Khôi Phục Dữ Liệu Từ Bản Sao Lưu (Restore)
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          Nhập dữ liệu từ tệp .JSON hoặc dán mã JSON đã lưu
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Hệ thống sẽ kiểm tra tính hợp lệ, hiển thị bảng xem trước số lượng mục và tự động đồng bộ lên đám mây cho tất cả các máy cùng cập nhật.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                          <Upload className="w-4 h-4" />
                          <span>Chọn File Sao Lưu (.JSON)</span>
                          <input
                            type="file"
                            accept=".json,application/json"
                            onChange={handleImport}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPasteJson((prev) => !prev)}
                          className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-colors"
                        >
                          {showPasteJson ? 'Đóng Khung Dán Mã' : 'Dán Mã JSON'}
                        </button>
                      </div>
                    </div>

                    {/* Optional Paste JSON Box */}
                    {showPasteJson && (
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                        <label className="block text-xs font-bold text-slate-700">
                          Dán nội dung mã JSON sao lưu vào ô bên dưới:
                        </label>
                        <textarea
                          rows={4}
                          value={pastedJsonText}
                          onChange={(e) => setPastedJsonText(e.target.value)}
                          placeholder='{"version": "3.0", "categories": [...], "brands": [...], "products": [...]}'
                          className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasteJson(false);
                              setPastedJsonText('');
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!pastedJsonText.trim()) {
                                showNotice('Vui lòng dán nội dung JSON trước khi kiểm tra!');
                                return;
                              }
                              parseAndPreviewBackup(pastedJsonText.trim(), 'Mã JSON dán trực tiếp');
                            }}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                          >
                            Kiểm Tra Nội Dung JSON
                          </button>
                        </div>
                      </div>
                    )}

                    {/* BACKUP PREVIEW & RESTORE CONFIRMATION PANEL */}
                    {backupPreview && (
                      <div className="p-4 sm:p-5 rounded-xl bg-white border-2 border-emerald-500 shadow-md space-y-4 animate-in fade-in duration-150">
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              <Check className="w-3.5 h-3.5" />
                              Tệp sao lưu hợp lệ — Sẵn sàng khôi phục
                            </span>
                            <h5 className="text-sm font-bold text-slate-900 mt-1.5">
                              Nguồn: {backupPreview.fileName}
                            </h5>
                            {backupPreview.exportedAt && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Thời gian tạo bản sao lưu:{' '}
                                {new Date(backupPreview.exportedAt).toLocaleString('vi-VN')}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setBackupPreview(null)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1"
                          >
                            Đóng
                          </button>
                        </div>

                        {/* Counts found in backup */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                            <div className="text-base font-extrabold text-slate-900">
                              {backupPreview.categoriesCount}
                            </div>
                            <div className="text-[11px] text-slate-500">Loại thiết bị</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                            <div className="text-base font-extrabold text-slate-900">
                              {backupPreview.brandsCount}
                            </div>
                            <div className="text-[11px] text-slate-500">Hãng sản xuất</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                            <div className="text-base font-extrabold text-emerald-600">
                              {backupPreview.productsCount}
                            </div>
                            <div className="text-[11px] text-slate-500">Sản phẩm</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                            <div className="text-base font-extrabold text-sky-600">
                              {backupPreview.projectsCount}
                            </div>
                            <div className="text-[11px] text-slate-500">Dự án tiêu biểu</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center col-span-2 sm:col-span-1">
                            <div className="text-base font-extrabold text-purple-600">
                              {backupPreview.inquiriesCount}
                            </div>
                            <div className="text-[11px] text-slate-500">Yêu cầu báo giá</div>
                          </div>
                        </div>

                        {/* Restore Mode Selector */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-800">
                            Chọn phương thức khôi phục dữ liệu:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setRestoreMode('replace')}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                restoreMode === 'replace'
                                  ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="text-xs font-bold text-slate-900">
                                Khôi phục chuẩn (Ghi đè toàn bộ)
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Đặt hệ thống giống 100% với tệp sao lưu này và đồng bộ cho mọi máy.
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRestoreMode('merge')}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                restoreMode === 'merge'
                                  ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="text-xs font-bold text-slate-900">
                                Gộp bổ sung (Giữ dữ liệu cũ + Thêm mới)
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Giữ nguyên các mục đang có và gộp thêm sản phẩm, hãng, dự án từ tệp.
                              </div>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setBackupPreview(null)}
                            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                          >
                            Hủy Bỏ
                          </button>
                          <button
                            type="button"
                            disabled={isSyncingCloud}
                            onClick={handleConfirmRestore}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                          >
                            <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                            <span>
                              {isSyncingCloud
                                ? 'Đang Khôi Phục & Đồng Bộ...'
                                : 'Xác Nhận Khôi Phục & Đồng Bộ Web'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: FACTORY RESET */}
                  <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                        4. Đặt Lại Dữ Liệu Mặc Định Ban Đầu
                      </span>
                      <h4 className="text-sm font-bold text-rose-900 mt-0.5">
                        Khôi phục về danh mục gốc của Đức Vinh Solar
                      </h4>
                      <p className="text-xs text-rose-700 mt-1">
                        Xóa các thay đổi thử nghiệm và đặt lại bộ danh mục Loại thiết bị, Hãng sản xuất, Sản phẩm và Dự án tiêu biểu mặc định ban đầu cho tất cả các máy.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isSyncingCloud}
                      onClick={() => {
                        resetToDefaults(() => {
                          setBackupPreview(null);
                          showNotice('Đã khôi phục dữ liệu mặc định ban đầu và đồng bộ lên web thành công!');
                        });
                      }}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                      <span>Đặt Lại Dữ Liệu Gốc</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Đức Vinh Solar Management v2.0 · MST: {companyInfo.taxCode}
          </span>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="px-3.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
