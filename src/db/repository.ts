import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import {
  categories,
  brands,
  products,
  projects,
  blogPosts,
  inquiries,
  companySettings,
} from './schema.ts';
import {
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_PROJECTS,
  INITIAL_BLOG_POSTS,
  INITIAL_COMPANY_INFO,
} from '../data/initialData.ts';
import type {
  CategoryItem,
  BrandItem,
  Product,
  ProjectItem,
  BlogPost,
  CustomerInquiry,
  CompanyInfo,
} from '../types/index.ts';

interface LocalDiskStore {
  categories: CategoryItem[];
  brands: BrandItem[];
  products: Product[];
  projects: ProjectItem[];
  blogPosts: BlogPost[];
  inquiries: CustomerInquiry[];
  companyInfo: CompanyInfo;
}

const isPostgresConfigured = (): boolean => Boolean(process.env.SQL_HOST);

const getLocalStorePath = (): string => {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'ducvinhsolar_db.json');
};

const readLocalDiskStore = (): LocalDiskStore => {
  const filePath = getLocalStorePath();
  if (!fs.existsSync(filePath)) {
    const initial: LocalDiskStore = {
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      products: INITIAL_PRODUCTS,
      projects: INITIAL_PROJECTS,
      blogPosts: INITIAL_BLOG_POSTS,
      inquiries: [],
      companyInfo: INITIAL_COMPANY_INFO,
    };
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : INITIAL_CATEGORIES,
      brands: Array.isArray(parsed.brands) && parsed.brands.length > 0 ? parsed.brands : INITIAL_BRANDS,
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
      projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : INITIAL_PROJECTS,
      blogPosts: Array.isArray(parsed.blogPosts) && parsed.blogPosts.length > 0 ? parsed.blogPosts : INITIAL_BLOG_POSTS,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      companyInfo: parsed.companyInfo ? { ...INITIAL_COMPANY_INFO, ...parsed.companyInfo } : INITIAL_COMPANY_INFO,
    };
  } catch {
    return {
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      products: INITIAL_PRODUCTS,
      projects: INITIAL_PROJECTS,
      blogPosts: INITIAL_BLOG_POSTS,
      inquiries: [],
      companyInfo: INITIAL_COMPANY_INFO,
    };
  }
};

const writeLocalDiskStore = (store: LocalDiskStore): void => {
  const filePath = getLocalStorePath();
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
};

const safeParseJsonArray = <T>(raw: string | null | undefined, fallback: T[] = []): T[] => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export async function getAllCatalogState() {
  if (!isPostgresConfigured()) {
    return readLocalDiskStore();
  }
  try {
    let catRows = await db.select().from(categories);
    if (catRows.length === 0) {
      await seedInitialPostgresData();
      catRows = await db.select().from(categories);
    }

    const [brandRows, productRows, projectRows, blogRows, inquiryRows, companyRows] =
      await Promise.all([
        db.select().from(brands),
        db.select().from(products),
        db.select().from(projects),
        db.select().from(blogPosts),
        db.select().from(inquiries),
        db.select().from(companySettings),
      ]);

    const mappedCategories: CategoryItem[] = catRows.map((r) => ({
      id: r.id,
      label: r.label,
      shortLabel: r.shortLabel,
      desc: r.desc,
      iconName: r.iconName as CategoryItem['iconName'],
    }));

    const mappedBrands: BrandItem[] = brandRows.map((r) => ({
      id: r.id,
      name: r.name,
      categoryId: r.categoryId,
      origin: r.origin,
    }));

    const mappedProducts: Product[] = productRows.map((r) => ({
      id: r.id,
      sku: r.sku,
      name: r.name,
      category: r.category,
      brand: r.brand,
      shortDesc: r.shortDesc,
      fullDesc: r.fullDesc,
      stock: r.stock,
      unit: r.unit,
      featured: r.featured,
      imageUrl: r.imageUrl || undefined,
      images: safeParseJsonArray<string>(r.imagesJson, r.imageUrl ? [r.imageUrl] : []),
      svgType: r.svgType as Product['svgType'],
      specs: safeParseJsonArray(r.specsJson, []),
      highlights: safeParseJsonArray<string>(r.highlightsJson, []),
      applications: safeParseJsonArray<string>(r.applicationsJson, []),
      warrantyYears: r.warrantyYears,
      origin: r.origin,
      status: r.status as Product['status'],
      updatedAt: r.updatedAt,
    }));

    const mappedProjects: ProjectItem[] = projectRows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category as ProjectItem['category'],
      capacity: r.capacity,
      location: r.location,
      completionDate: r.completionDate,
      estimatedSaving: r.estimatedSaving,
      description: r.description,
      keyEquipment: safeParseJsonArray<string>(r.keyEquipmentJson, []),
      imageUrl: r.imageUrl || undefined,
      images: safeParseJsonArray<string>(r.imagesJson, r.imageUrl ? [r.imageUrl] : []),
      svgType: r.svgType as ProjectItem['svgType'],
    }));

    const mappedBlogPosts: BlogPost[] = blogRows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      author: r.author,
      publishedAt: r.publishedAt,
      readTime: r.readTime,
      summary: r.summary,
      content: r.content,
      tags: safeParseJsonArray<string>(r.tagsJson, []),
      imageUrl: r.imageUrl || undefined,
      images: safeParseJsonArray<string>(r.imagesJson, r.imageUrl ? [r.imageUrl] : []),
    }));

    const mappedInquiries: CustomerInquiry[] = inquiryRows.map((r) => ({
      id: r.id,
      customerName: r.customerName,
      phone: r.phone,
      address: r.address || undefined,
      productInterest: r.productInterest || undefined,
      note: r.note || undefined,
      createdAt: r.createdAt,
      status: r.status as CustomerInquiry['status'],
    }));

    const compRow = companyRows[0];
    const mappedCompanyInfo: CompanyInfo = compRow
      ? {
          legalName: compRow.legalName,
          tradeName: compRow.tradeName,
          taxCode: compRow.taxCode,
          taxAddress: compRow.taxAddress,
          officeAddress: compRow.officeAddress,
          warehouseAddress: compRow.warehouseAddress,
          warehouseMapUrl: compRow.warehouseMapUrl,
          status: compRow.status,
          representative: compRow.representative,
          affiliatedUnits: safeParseJsonArray<string>(
            compRow.affiliatedUnitsJson,
            INITIAL_COMPANY_INFO.affiliatedUnits
          ),
          hotlineZalo: compRow.hotlineZalo,
          email: compRow.email,
          workingHours: compRow.workingHours,
          aboutText: compRow.aboutText,
        }
      : INITIAL_COMPANY_INFO;

    return {
      categories: mappedCategories,
      brands: mappedBrands,
      products: mappedProducts,
      projects: mappedProjects,
      blogPosts: mappedBlogPosts,
      inquiries: mappedInquiries,
      companyInfo: mappedCompanyInfo,
    };
  } catch (error) {
    console.error('Database query failed in getAllCatalogState:', error);
    throw new Error('Failed to load catalog data from PostgreSQL.', { cause: error });
  }
}

export async function seedInitialPostgresData() {
  if (!isPostgresConfigured()) {
    readLocalDiskStore();
    return;
  }
  try {
    for (const c of INITIAL_CATEGORIES) {
      await db
        .insert(categories)
        .values({
          id: c.id,
          label: c.label,
          shortLabel: c.shortLabel,
          desc: c.desc,
          iconName: c.iconName,
        })
        .onConflictDoNothing();
    }

    for (const b of INITIAL_BRANDS) {
      await db
        .insert(brands)
        .values({
          id: b.id,
          name: b.name,
          categoryId: b.categoryId,
          origin: b.origin || 'Chính hãng',
        })
        .onConflictDoNothing();
    }

    for (const p of INITIAL_PRODUCTS) {
      await db
        .insert(products)
        .values({
          id: p.id,
          sku: p.sku,
          name: p.name,
          category: p.category,
          brand: p.brand,
          shortDesc: p.shortDesc,
          fullDesc: p.fullDesc,
          stock: p.stock,
          unit: p.unit,
          featured: Boolean(p.featured),
          imageUrl: p.imageUrl || null,
          imagesJson: JSON.stringify(p.images || (p.imageUrl ? [p.imageUrl] : [])),
          svgType: p.svgType,
          specsJson: JSON.stringify(p.specs || []),
          highlightsJson: JSON.stringify(p.highlights || []),
          applicationsJson: JSON.stringify(p.applications || []),
          warrantyYears: p.warrantyYears,
          origin: p.origin,
          status: p.status,
          updatedAt: p.updatedAt,
        })
        .onConflictDoNothing();
    }

    for (const prj of INITIAL_PROJECTS) {
      await db
        .insert(projects)
        .values({
          id: prj.id,
          title: prj.title,
          category: prj.category,
          capacity: prj.capacity,
          location: prj.location,
          completionDate: prj.completionDate,
          estimatedSaving: prj.estimatedSaving,
          description: prj.description,
          keyEquipmentJson: JSON.stringify(prj.keyEquipment || []),
          imageUrl: prj.imageUrl || null,
          imagesJson: JSON.stringify(prj.images || (prj.imageUrl ? [prj.imageUrl] : [])),
          svgType: prj.svgType,
        })
        .onConflictDoNothing();
    }

    for (const post of INITIAL_BLOG_POSTS) {
      await db
        .insert(blogPosts)
        .values({
          id: post.id,
          title: post.title,
          category: post.category,
          author: post.author,
          publishedAt: post.publishedAt,
          readTime: post.readTime,
          summary: post.summary,
          content: post.content,
          tagsJson: JSON.stringify(post.tags || []),
          imageUrl: post.imageUrl || null,
          imagesJson: JSON.stringify(post.images || (post.imageUrl ? [post.imageUrl] : [])),
        })
        .onConflictDoNothing();
    }

    await db
      .insert(companySettings)
      .values({
        id: 'companyInfo',
        legalName: INITIAL_COMPANY_INFO.legalName,
        tradeName: INITIAL_COMPANY_INFO.tradeName,
        taxCode: INITIAL_COMPANY_INFO.taxCode,
        taxAddress: INITIAL_COMPANY_INFO.taxAddress,
        officeAddress: INITIAL_COMPANY_INFO.officeAddress,
        warehouseAddress: INITIAL_COMPANY_INFO.warehouseAddress,
        warehouseMapUrl: INITIAL_COMPANY_INFO.warehouseMapUrl,
        status: INITIAL_COMPANY_INFO.status,
        representative: INITIAL_COMPANY_INFO.representative,
        affiliatedUnitsJson: JSON.stringify(INITIAL_COMPANY_INFO.affiliatedUnits || []),
        hotlineZalo: INITIAL_COMPANY_INFO.hotlineZalo,
        email: INITIAL_COMPANY_INFO.email,
        workingHours: INITIAL_COMPANY_INFO.workingHours,
        aboutText: INITIAL_COMPANY_INFO.aboutText,
      })
      .onConflictDoNothing();
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw new Error('Failed to seed initial PostgreSQL data.', { cause: error });
  }
}

export async function upsertCategoryInPostgres(item: CategoryItem) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.categories.findIndex((c) => c.id === item.id);
    if (idx >= 0) store.categories[idx] = item;
    else store.categories.push(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db
      .insert(categories)
      .values({
        id: item.id,
        label: item.label,
        shortLabel: item.shortLabel,
        desc: item.desc,
        iconName: item.iconName,
      })
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          label: item.label,
          shortLabel: item.shortLabel,
          desc: item.desc,
          iconName: item.iconName,
        },
      });
  } catch (error) {
    console.error('Failed to upsert category in PostgreSQL:', error);
    throw new Error('Failed to save category.', { cause: error });
  }
}

export async function deleteCategoryFromPostgres(id: string) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.categories = store.categories.filter((c) => c.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(categories).where(eq(categories.id, id));
  } catch (error) {
    console.error('Failed to delete category in PostgreSQL:', error);
    throw new Error('Failed to delete category.', { cause: error });
  }
}

export async function upsertBrandInPostgres(item: BrandItem) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.brands.findIndex((b) => b.id === item.id);
    if (idx >= 0) store.brands[idx] = item;
    else store.brands.push(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db
      .insert(brands)
      .values({
        id: item.id,
        name: item.name,
        categoryId: item.categoryId,
        origin: item.origin || 'Chính hãng',
      })
      .onConflictDoUpdate({
        target: brands.id,
        set: {
          name: item.name,
          categoryId: item.categoryId,
          origin: item.origin || 'Chính hãng',
        },
      });
  } catch (error) {
    console.error('Failed to upsert brand in PostgreSQL:', error);
    throw new Error('Failed to save brand.', { cause: error });
  }
}

export async function deleteBrandFromPostgres(id: string) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.brands = store.brands.filter((b) => b.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(brands).where(eq(brands.id, id));
  } catch (error) {
    console.error('Failed to delete brand in PostgreSQL:', error);
    throw new Error('Failed to delete brand.', { cause: error });
  }
}

export async function upsertProductInPostgres(item: Product) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.products.findIndex((p) => p.id === item.id);
    if (idx >= 0) store.products[idx] = item;
    else store.products.unshift(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    const imgs = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.imageUrl
      ? [item.imageUrl]
      : [];
    await db
      .insert(products)
      .values({
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        brand: item.brand,
        shortDesc: item.shortDesc,
        fullDesc: item.fullDesc,
        stock: item.stock,
        unit: item.unit,
        featured: Boolean(item.featured),
        imageUrl: imgs[0] || item.imageUrl || null,
        imagesJson: JSON.stringify(imgs),
        svgType: item.svgType,
        specsJson: JSON.stringify(item.specs || []),
        highlightsJson: JSON.stringify(item.highlights || []),
        applicationsJson: JSON.stringify(item.applications || []),
        warrantyYears: item.warrantyYears,
        origin: item.origin,
        status: item.status,
        updatedAt: item.updatedAt,
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          sku: item.sku,
          name: item.name,
          category: item.category,
          brand: item.brand,
          shortDesc: item.shortDesc,
          fullDesc: item.fullDesc,
          stock: item.stock,
          unit: item.unit,
          featured: Boolean(item.featured),
          imageUrl: imgs[0] || item.imageUrl || null,
          imagesJson: JSON.stringify(imgs),
          svgType: item.svgType,
          specsJson: JSON.stringify(item.specs || []),
          highlightsJson: JSON.stringify(item.highlights || []),
          applicationsJson: JSON.stringify(item.applications || []),
          warrantyYears: item.warrantyYears,
          origin: item.origin,
          status: item.status,
          updatedAt: item.updatedAt,
        },
      });
  } catch (error) {
    console.error('Failed to upsert product in PostgreSQL:', error);
    throw new Error('Failed to save product.', { cause: error });
  }
}

export async function deleteProductFromPostgres(id: string) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.products = store.products.filter((p) => p.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(products).where(eq(products.id, id));
  } catch (error) {
    console.error('Failed to delete product in PostgreSQL:', error);
    throw new Error('Failed to delete product.', { cause: error });
  }
}

export async function upsertProjectInPostgres(item: ProjectItem) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.projects.findIndex((p) => p.id === item.id);
    if (idx >= 0) store.projects[idx] = item;
    else store.projects.unshift(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    const imgs = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.imageUrl
      ? [item.imageUrl]
      : [];
    await db
      .insert(projects)
      .values({
        id: item.id,
        title: item.title,
        category: item.category,
        capacity: item.capacity,
        location: item.location,
        completionDate: item.completionDate,
        estimatedSaving: item.estimatedSaving,
        description: item.description,
        keyEquipmentJson: JSON.stringify(item.keyEquipment || []),
        imageUrl: imgs[0] || item.imageUrl || null,
        imagesJson: JSON.stringify(imgs),
        svgType: item.svgType,
      })
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          title: item.title,
          category: item.category,
          capacity: item.capacity,
          location: item.location,
          completionDate: item.completionDate,
          estimatedSaving: item.estimatedSaving,
          description: item.description,
          keyEquipmentJson: JSON.stringify(item.keyEquipment || []),
          imageUrl: imgs[0] || item.imageUrl || null,
          imagesJson: JSON.stringify(imgs),
          svgType: item.svgType,
        },
      });
  } catch (error) {
    console.error('Failed to upsert project in PostgreSQL:', error);
    throw new Error('Failed to save project.', { cause: error });
  }
}

export async function deleteProjectFromPostgres(id: string) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.projects = store.projects.filter((p) => p.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(projects).where(eq(projects.id, id));
  } catch (error) {
    console.error('Failed to delete project in PostgreSQL:', error);
    throw new Error('Failed to delete project.', { cause: error });
  }
}

export async function upsertBlogPostInPostgres(item: BlogPost) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.blogPosts.findIndex((b) => b.id === item.id);
    if (idx >= 0) store.blogPosts[idx] = item;
    else store.blogPosts.unshift(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    const imgs = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : item.imageUrl
      ? [item.imageUrl]
      : [];
    await db
      .insert(blogPosts)
      .values({
        id: item.id,
        title: item.title,
        category: item.category,
        author: item.author,
        publishedAt: item.publishedAt,
        readTime: item.readTime,
        summary: item.summary,
        content: item.content,
        tagsJson: JSON.stringify(item.tags || []),
        imageUrl: imgs[0] || item.imageUrl || null,
        imagesJson: JSON.stringify(imgs),
      })
      .onConflictDoUpdate({
        target: blogPosts.id,
        set: {
          title: item.title,
          category: item.category,
          author: item.author,
          publishedAt: item.publishedAt,
          readTime: item.readTime,
          summary: item.summary,
          content: item.content,
          tagsJson: JSON.stringify(item.tags || []),
          imageUrl: imgs[0] || item.imageUrl || null,
          imagesJson: JSON.stringify(imgs),
        },
      });
  } catch (error) {
    console.error('Failed to upsert blog post in PostgreSQL:', error);
    throw new Error('Failed to save blog post.', { cause: error });
  }
}

export async function deleteBlogPostFromPostgres(id: string) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.blogPosts = store.blogPosts.filter((b) => b.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  } catch (error) {
    console.error('Failed to delete blog post in PostgreSQL:', error);
    throw new Error('Failed to delete blog post.', { cause: error });
  }
}

export async function upsertInquiryInPostgres(item: CustomerInquiry) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.inquiries.findIndex((i) => i.id === item.id);
    if (idx >= 0) store.inquiries[idx] = item;
    else store.inquiries.unshift(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db
      .insert(inquiries)
      .values({
        id: item.id,
        customerName: item.customerName,
        phone: item.phone,
        address: item.address || '',
        productInterest: item.productInterest || '',
        note: item.note || '',
        createdAt: item.createdAt,
        status: item.status,
      })
      .onConflictDoUpdate({
        target: inquiries.id,
        set: {
          customerName: item.customerName,
          phone: item.phone,
          address: item.address || '',
          productInterest: item.productInterest || '',
          note: item.note || '',
          createdAt: item.createdAt,
          status: item.status,
        },
      });
  } catch (error) {
    console.error('Failed to upsert inquiry in PostgreSQL:', error);
    throw new Error('Failed to save customer inquiry.', { cause: error });
  }
}

export async function deleteInquiryFromPostgres(id: string) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.inquiries = store.inquiries.filter((i) => i.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(inquiries).where(eq(inquiries.id, id));
  } catch (error) {
    console.error('Failed to delete inquiry in PostgreSQL:', error);
    throw new Error('Failed to delete customer inquiry.', { cause: error });
  }
}

export async function upsertCompanyInfoInPostgres(info: CompanyInfo) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.companyInfo = info;
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db
      .insert(companySettings)
      .values({
        id: 'companyInfo',
        legalName: info.legalName,
        tradeName: info.tradeName,
        taxCode: info.taxCode,
        taxAddress: info.taxAddress,
        officeAddress: info.officeAddress,
        warehouseAddress: info.warehouseAddress,
        warehouseMapUrl: info.warehouseMapUrl,
        status: info.status,
        representative: info.representative,
        affiliatedUnitsJson: JSON.stringify(info.affiliatedUnits || []),
        hotlineZalo: info.hotlineZalo,
        email: info.email,
        workingHours: info.workingHours,
        aboutText: info.aboutText,
      })
      .onConflictDoUpdate({
        target: companySettings.id,
        set: {
          legalName: info.legalName,
          tradeName: info.tradeName,
          taxCode: info.taxCode,
          taxAddress: info.taxAddress,
          officeAddress: info.officeAddress,
          warehouseAddress: info.warehouseAddress,
          warehouseMapUrl: info.warehouseMapUrl,
          status: info.status,
          representative: info.representative,
          affiliatedUnitsJson: JSON.stringify(info.affiliatedUnits || []),
          hotlineZalo: info.hotlineZalo,
          email: info.email,
          workingHours: info.workingHours,
          aboutText: info.aboutText,
        },
      });
  } catch (error) {
    console.error('Failed to upsert company info in PostgreSQL:', error);
    throw new Error('Failed to update company settings.', { cause: error });
  }
}

export async function restoreAllStateInPostgres(payload: {
  mode?: 'replace' | 'merge';
  categories?: CategoryItem[];
  brands?: BrandItem[];
  products?: Product[];
  projects?: ProjectItem[];
  blogPosts?: BlogPost[];
  inquiries?: CustomerInquiry[];
  companyInfo?: CompanyInfo;
}) {
  if (!isPostgresConfigured()) {
    const current = readLocalDiskStore();
    const next: LocalDiskStore = {
      categories: Array.isArray(payload.categories) ? payload.categories : current.categories,
      brands: Array.isArray(payload.brands) ? payload.brands : current.brands,
      products: Array.isArray(payload.products) ? payload.products : current.products,
      projects: Array.isArray(payload.projects) ? payload.projects : current.projects,
      blogPosts: Array.isArray(payload.blogPosts) ? payload.blogPosts : current.blogPosts,
      inquiries: Array.isArray(payload.inquiries) ? payload.inquiries : current.inquiries,
      companyInfo: payload.companyInfo ? { ...current.companyInfo, ...payload.companyInfo } : current.companyInfo,
    };
    writeLocalDiskStore(next);
    return;
  }
  try {
    if (payload.mode === 'replace') {
      await db.delete(categories);
      await db.delete(brands);
      await db.delete(products);
      await db.delete(projects);
      await db.delete(blogPosts);
      await db.delete(inquiries);
    }

    if (Array.isArray(payload.categories)) {
      for (const c of payload.categories) {
        await upsertCategoryInPostgres(c);
      }
    }
    if (Array.isArray(payload.brands)) {
      for (const b of payload.brands) {
        await upsertBrandInPostgres(b);
      }
    }
    if (Array.isArray(payload.products)) {
      for (const p of payload.products) {
        await upsertProductInPostgres(p);
      }
    }
    if (Array.isArray(payload.projects)) {
      for (const pr of payload.projects) {
        await upsertProjectInPostgres(pr);
      }
    }
    if (Array.isArray(payload.blogPosts)) {
      for (const bp of payload.blogPosts) {
        await upsertBlogPostInPostgres(bp);
      }
    }
    if (Array.isArray(payload.inquiries)) {
      for (const inq of payload.inquiries) {
        await upsertInquiryInPostgres(inq);
      }
    }
    if (payload.companyInfo) {
      await upsertCompanyInfoInPostgres(payload.companyInfo);
    }
  } catch (error) {
    console.error('Failed to restore state in PostgreSQL:', error);
    throw new Error('Failed to restore full state in database.', { cause: error });
  }
}
