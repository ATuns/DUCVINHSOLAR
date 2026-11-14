import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  shortLabel: text('short_label').notNull(),
  desc: text('desc').notNull(),
  iconName: text('icon_name').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const brands = pgTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: text('category_id').notNull(),
  origin: text('origin').default('Chính hãng').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  sku: text('sku').notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  brand: text('brand').notNull(),
  shortDesc: text('short_desc').notNull(),
  fullDesc: text('full_desc').notNull(),
  stock: integer('stock').default(0).notNull(),
  unit: text('unit').default('Tấm').notNull(),
  featured: boolean('featured').default(false).notNull(),
  imageUrl: text('image_url'),
  imagesJson: text('images_json').default('[]').notNull(),
  svgType: text('svg_type').default('panel').notNull(),
  specsJson: text('specs_json').default('[]').notNull(),
  highlightsJson: text('highlights_json').default('[]').notNull(),
  applicationsJson: text('applications_json').default('[]').notNull(),
  warrantyYears: integer('warranty_years').default(5).notNull(),
  origin: text('origin').default('Chính hãng').notNull(),
  status: text('status').default('in-stock').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  capacity: text('capacity').notNull(),
  location: text('location').notNull(),
  completionDate: text('completion_date').notNull(),
  estimatedSaving: text('estimated_saving').notNull(),
  description: text('description').notNull(),
  keyEquipmentJson: text('key_equipment_json').default('[]').notNull(),
  imageUrl: text('image_url'),
  imagesJson: text('images_json').default('[]').notNull(),
  svgType: text('svg_type').default('rooftop').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  author: text('author').notNull(),
  publishedAt: text('published_at').notNull(),
  readTime: text('read_time').notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  tagsJson: text('tags_json').default('[]').notNull(),
  imageUrl: text('image_url'),
  imagesJson: text('images_json').default('[]').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').default(''),
  productInterest: text('product_interest').default(''),
  note: text('note').default(''),
  createdAt: text('created_at').notNull(),
  status: text('status').default('new').notNull(),
});

export const companySettings = pgTable('company_settings', {
  id: text('id').primaryKey(),
  legalName: text('legal_name').notNull(),
  tradeName: text('trade_name').notNull(),
  taxCode: text('tax_code').notNull(),
  taxAddress: text('tax_address').notNull(),
  officeAddress: text('office_address').notNull(),
  warehouseAddress: text('warehouse_address').notNull(),
  warehouseMapUrl: text('warehouse_map_url').notNull(),
  status: text('status').notNull(),
  representative: text('representative').notNull(),
  affiliatedUnitsJson: text('affiliated_units_json').default('[]').notNull(),
  hotlineZalo: text('hotline_zalo').notNull(),
  email: text('email').notNull(),
  workingHours: text('working_hours').notNull(),
  aboutText: text('about_text').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  brands: many(brands),
}));

export const brandsRelations = relations(brands, ({ one }) => ({
  category: one(categories, {
    fields: [brands.categoryId],
    references: [categories.id],
  }),
}));
