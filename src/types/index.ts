export type ProductCategory = string;

export type CategoryIconName =
  | 'Sun'
  | 'Cpu'
  | 'BatteryCharging'
  | 'Zap'
  | 'Lightbulb'
  | 'Package'
  | 'Wrench'
  | 'ShieldCheck';

export interface CategoryItem {
  id: string;
  label: string;
  shortLabel: string;
  desc: string;
  iconName: CategoryIconName;
}

export interface BrandItem {
  id: string;
  name: string;
  categoryId: string; // ID of CategoryItem this brand belongs to
  origin?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  brand: string;
  shortDesc: string;
  fullDesc: string;
  stock: number;
  unit: string;
  featured?: boolean;
  pinOrder?: number;
  imageUrl?: string;
  images?: string[];
  svgType: 'panel' | 'inverter' | 'battery' | 'optimizer' | 'streetlight' | 'custom';
  specs: ProductSpec[];
  highlights: string[];
  applications: string[];
  warrantyYears: number;
  origin: string;
  status: 'in-stock' | 'low-stock' | 'order-only';
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'residential' | 'commercial' | 'hybrid' | 'lighting' | 'saving';
  capacity: string;
  location: string;
  completionDate: string;
  estimatedSaving: string;
  description: string;
  keyEquipment: string[];
  imageUrl?: string;
  images?: string[];
  svgType: 'rooftop' | 'factory' | 'villa' | 'street' | 'saver';
}

export interface CompanyInfo {
  legalName: string;
  tradeName: string;
  taxCode: string;
  taxAddress: string;
  officeAddress: string;
  warehouseAddress: string;
  warehouseMapUrl: string;
  status: string;
  representative: string;
  affiliatedUnits: string[];
  hotlineZalo: string;
  email: string;
  workingHours: string;
  aboutText: string;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  productInterest?: string;
  note?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  summary: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  images?: string[];
}

