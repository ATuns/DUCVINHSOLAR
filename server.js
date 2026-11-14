var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server.ts
import express from "express";
import fs2 from "fs";
import path2 from "path";
import { fileURLToPath } from "url";

// src/lib/firebase-admin.ts
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "smooth-codex-mbcxw",
  appId: "1:592050043983:web:e5712e0b4e96d4348cbe3a",
  apiKey: "AIzaSyCrClzl9PTjKVIdD9vCf91yd-IpWnb3Z9Y",
  authDomain: "smooth-codex-mbcxw.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-cvinhsolarnnglng-e02c12a5-986c-4662-b71f-5a25ae3eabbf",
  storageBucket: "smooth-codex-mbcxw.firebasestorage.app",
  messagingSenderId: "592050043983",
  measurementId: "",
  oAuthClientId: "592050043983-butscj5kn19tfd6uchurhvru00lrjjk0.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// src/lib/firebase-admin.ts
if (!getApps().length) {
  initializeApp({
    projectId: firebase_applet_config_default.projectId
  });
}
var adminAuth = getAuth();

// src/middleware/auth.ts
var requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogPosts: () => blogPosts,
  brands: () => brands,
  brandsRelations: () => brandsRelations,
  categories: () => categories,
  categoriesRelations: () => categoriesRelations,
  companySettings: () => companySettings,
  inquiries: () => inquiries,
  products: () => products,
  projects: () => projects,
  users: () => users
});
import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var categories = pgTable("categories", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  shortLabel: text("short_label").notNull(),
  desc: text("desc").notNull(),
  iconName: text("icon_name").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var brands = pgTable("brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: text("category_id").notNull(),
  origin: text("origin").default("Ch\xEDnh h\xE3ng").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  brand: text("brand").notNull(),
  shortDesc: text("short_desc").notNull(),
  fullDesc: text("full_desc").notNull(),
  stock: integer("stock").default(0).notNull(),
  unit: text("unit").default("T\u1EA5m").notNull(),
  featured: boolean("featured").default(false).notNull(),
  imageUrl: text("image_url"),
  imagesJson: text("images_json").default("[]").notNull(),
  svgType: text("svg_type").default("panel").notNull(),
  specsJson: text("specs_json").default("[]").notNull(),
  highlightsJson: text("highlights_json").default("[]").notNull(),
  applicationsJson: text("applications_json").default("[]").notNull(),
  warrantyYears: integer("warranty_years").default(5).notNull(),
  origin: text("origin").default("Ch\xEDnh h\xE3ng").notNull(),
  status: text("status").default("in-stock").notNull(),
  updatedAt: text("updated_at").notNull()
});
var projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  capacity: text("capacity").notNull(),
  location: text("location").notNull(),
  completionDate: text("completion_date").notNull(),
  estimatedSaving: text("estimated_saving").notNull(),
  description: text("description").notNull(),
  keyEquipmentJson: text("key_equipment_json").default("[]").notNull(),
  imageUrl: text("image_url"),
  imagesJson: text("images_json").default("[]").notNull(),
  svgType: text("svg_type").default("rooftop").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  publishedAt: text("published_at").notNull(),
  readTime: text("read_time").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  tagsJson: text("tags_json").default("[]").notNull(),
  imageUrl: text("image_url"),
  imagesJson: text("images_json").default("[]").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").default(""),
  productInterest: text("product_interest").default(""),
  note: text("note").default(""),
  createdAt: text("created_at").notNull(),
  status: text("status").default("new").notNull()
});
var companySettings = pgTable("company_settings", {
  id: text("id").primaryKey(),
  legalName: text("legal_name").notNull(),
  tradeName: text("trade_name").notNull(),
  taxCode: text("tax_code").notNull(),
  taxAddress: text("tax_address").notNull(),
  officeAddress: text("office_address").notNull(),
  warehouseAddress: text("warehouse_address").notNull(),
  warehouseMapUrl: text("warehouse_map_url").notNull(),
  status: text("status").notNull(),
  representative: text("representative").notNull(),
  affiliatedUnitsJson: text("affiliated_units_json").default("[]").notNull(),
  hotlineZalo: text("hotline_zalo").notNull(),
  email: text("email").notNull(),
  workingHours: text("working_hours").notNull(),
  aboutText: text("about_text").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var categoriesRelations = relations(categories, ({ many }) => ({
  brands: many(brands)
}));
var brandsRelations = relations(brands, ({ one }) => ({
  category: one(categories, {
    fields: [brands.categoryId],
    references: [categories.id]
  })
}));

// src/db/index.ts
var createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15e3
    });
    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};
var pool = createPool();
var db = drizzle(pool, { schema: schema_exports });

// src/db/users.ts
async function getOrCreateUser(uid, email) {
  try {
    const result = await db.insert(users).values({
      uid,
      email
    }).onConflictDoUpdate({
      target: users.uid,
      set: {
        email
      }
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Database user upsert failed:", error);
    throw new Error("Failed to synchronize user record.", { cause: error });
  }
}
async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

// src/db/repository.ts
import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";

// src/data/initialData.ts
var INITIAL_CATEGORIES = [
  {
    id: "solar-panels",
    label: "T\u1EA5m Pin M\u1EB7t Tr\u1EDDi",
    shortLabel: "T\u1EA5m Pin",
    desc: "Longi, Jinko, Canadian, JA...",
    iconName: "Sun"
  },
  {
    id: "inverters",
    label: "Bi\u1EBFn T\u1EA7n Inverter",
    shortLabel: "Bi\u1EBFn T\u1EA7n",
    desc: "SolaX, Deye, Solis, Sungrow...",
    iconName: "Cpu"
  },
  {
    id: "energy-storage",
    label: "Pin L\u01B0u Tr\u1EEF ESS",
    shortLabel: "L\u01B0u Tr\u1EEF",
    desc: "SolaX, Deye, Dyness, LiFePO4...",
    iconName: "BatteryCharging"
  },
  {
    id: "solar-lights",
    label: "\u0110\xE8n N\u0103ng L\u01B0\u1EE3ng",
    shortLabel: "\u0110\xE8n Solar",
    desc: "\u0110\xE8n \u0111\u01B0\u1EDDng li\u1EC1n th\u1EC3, \u0111\xE8n pha...",
    iconName: "Lightbulb"
  }
];
var INITIAL_BRANDS = [
  // Tấm Pin Mặt Trời
  { id: "br-longi", name: "Longi", categoryId: "solar-panels", origin: "Tier 1 Th\u1EBF Gi\u1EDBi" },
  { id: "br-jinko", name: "Jinko Solar", categoryId: "solar-panels", origin: "Tier 1 Th\u1EBF Gi\u1EDBi" },
  { id: "br-canadian", name: "Canadian Solar", categoryId: "solar-panels", origin: "Tier 1 Th\u1EBF Gi\u1EDBi" },
  { id: "br-jasolar", name: "JA Solar", categoryId: "solar-panels", origin: "Tier 1 Th\u1EBF Gi\u1EDBi" },
  // Biến Tần Inverter
  { id: "br-inv-solax", name: "SolaX", categoryId: "inverters", origin: "Ch\xEDnh H\xE3ng Qu\u1ED1c T\u1EBF" },
  { id: "br-inv-deye", name: "Deye", categoryId: "inverters", origin: "Ch\xEDnh H\xE3ng" },
  { id: "br-inv-solis", name: "Solis", categoryId: "inverters", origin: "Ch\xEDnh H\xE3ng" },
  { id: "br-inv-sungrow", name: "Sungrow", categoryId: "inverters", origin: "Tier 1 Th\u1EBF Gi\u1EDBi" },
  // Pin Lưu Trữ ESS
  { id: "br-ess-solax", name: "SolaX", categoryId: "energy-storage", origin: "Ch\xEDnh H\xE3ng" },
  { id: "br-ess-deye", name: "Deye", categoryId: "energy-storage", origin: "Ch\xEDnh H\xE3ng" },
  { id: "br-ess-dyness", name: "Dyness", categoryId: "energy-storage", origin: "Ch\xEDnh H\xE3ng" },
  { id: "br-ess-dvs", name: "\u0110\u1EE9c Vinh ESS", categoryId: "energy-storage", origin: "\u0110\u1EE9c Vinh Solar" },
  // Đèn Năng Lượng
  { id: "br-lgt-dvs", name: "\u0110\u1EE9c Vinh Lighting", categoryId: "solar-lights", origin: "\u0110\u1EE9c Vinh Solar" },
  { id: "br-lgt-jd", name: "Jindian Solar", categoryId: "solar-lights", origin: "Ch\xEDnh H\xE3ng" }
];
var INITIAL_COMPANY_INFO = {
  legalName: "C\xD4NG TY TR\xC1CH NHI\u1EC6M H\u1EEEU H\u1EA0N D\u1ECACH V\u1EE4 VI\u1EC4N TH\xD4NG \u0110\u1EE8C VINH",
  tradeName: "\u0110\u1EE9c Vinh Solar",
  taxCode: "0311193770",
  taxAddress: "137 \u0110\u01B0\u1EDDng Th\u1EDBi Tam Th\xF4n 9, X\xE3 \u0110\xF4ng Th\u1EA1nh, TP H\u1ED3 Ch\xED Minh, Vi\u1EC7t Nam",
  officeAddress: "137 \u0110\u01B0\u1EDDng Th\u1EDBi Tam Th\xF4n 9, X\xE3 \u0110\xF4ng Th\u1EA1nh, Th\xE0nh ph\u1ED1 H\u1ED3 Ch\xED Minh, Vi\u1EC7t Nam",
  warehouseAddress: `137 \u0110\u01B0\u1EDDng Th\u1EDBi Tam Th\xF4n 9, X\xE3 \u0110\xF4ng Th\u1EA1nh, H\xF3c M\xF4n, TP. H\u1ED3 Ch\xED Minh (10\xB053'08.1"N 106\xB036'15.1"E)`,
  warehouseMapUrl: "https://www.google.com/maps/place/10%C2%B053'08.1%22N+106%C2%B036'15.1%22E/@10.8855743,106.6035469,277m/data=!3m2!1e3!4b1!4m13!1m8!3m7!1s0x3174d5ef3c8d7f03:0x85dc86670aef7a4!2zMTM3IMSQLiBUaOG7m2kgVGFtIFRow7RuIDksIMSQw7RuZyBUaOG6oW5oLCBI4buTIENow60gTWluaCA3MDAwMDAsIFZp4buHdCBOYW0!3b1!8m2!3d10.8962963!4d106.6152702!16s%2Fg%2F11nm9lgw6_!3m3!8m2!3d10.885573!4d106.604192?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D",
  status: "\u0110ang ho\u1EA1t \u0111\u1ED9ng",
  representative: "NGUY\u1EC4N QUANG VINH",
  affiliatedUnits: [
    "CHI NH\xC1NH C\xD4NG TY TR\xC1CH NHI\u1EC6M H\u1EEEU H\u1EA0N D\u1ECACH V\u1EE4 VI\u1EC4N TH\xD4NG \u0110\u1EE8C VINH",
    "H\u1ED9 kinh doanh Nguy\u1EC5n Quang Vinh Solar"
  ],
  hotlineZalo: "0938288876",
  email: "ducvinhsolar@gmail.com",
  workingHours: "07:30 - 18:30 (T\u1EA5t c\u1EA3 c\xE1c ng\xE0y trong tu\u1EA7n)",
  aboutText: "\u0110\u1EE9c Vinh Solar t\u1EF1 h\xE0o l\xE0 \u0111\u01A1n v\u1ECB uy t\xEDn h\xE0ng \u0111\u1EA7u t\u1EA1i TP. H\u1ED3 Ch\xED Minh chuy\xEAn t\u01B0 v\u1EA5n, thi\u1EBFt k\u1EBF, ph\xE2n ph\u1ED1i v\xE0 thi c\xF4ng c\xE1c h\u1EC7 th\u1ED1ng \u0111i\u1EC7n n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi d\xE2n d\u1EE5ng, th\u01B0\u01A1ng m\u1EA1i v\xE0 thi\u1EBFt b\u1ECB ti\u1EBFt ki\u1EC7m \u0111i\u1EC7n n\u0103ng c\xF4ng ngh\u1EC7 cao. V\u1EDBi \u0111\u1ED9i ng\u0169 k\u1EF9 s\u01B0 gi\xE0u kinh nghi\u1EC7m, ch\xFAng t\xF4i cam k\u1EBFt mang l\u1EA1i gi\u1EA3i ph\xE1p n\u0103ng l\u01B0\u1EE3ng xanh b\u1EC1n v\u1EEFng, t\u1ED1i \u01B0u chi ph\xED ti\u1EC1n \u0111i\u1EC7n t\u1ED1i \u0111a cho gia \u0111\xECnh v\xE0 doanh nghi\u1EC7p."
};
var INITIAL_PRODUCTS = [
  // ================= TẤM PIN MẶT TRỜI (solar-panels) =================
  {
    id: "prod-01",
    sku: "DVS-PN-LONGI-580",
    name: "T\u1EA5m Pin N\u0103ng L\u01B0\u1EE3ng M\u1EB7t Tr\u1EDDi Longi Hi-MO 6 Explorer 580W",
    category: "solar-panels",
    brand: "Longi",
    shortDesc: "C\xF4ng ngh\u1EC7 t\u1EBF b\xE0o HPBC N-Type th\u1EBF h\u1EC7 m\u1EDBi, hi\u1EC7u su\u1EA5t chuy\u1EC3n \u0111\u1ED5i quang n\u0103ng \u0111\u1EA1t 22.5%, ch\u1ED1ng suy hao c\u1EF1c t\u1ED1t.",
    fullDesc: "T\u1EA5m pin Longi Hi-MO 6 Explorer 580W l\xE0 d\xF2ng pin cao c\u1EA5p \u1EE9ng d\u1EE5ng t\u1EBF b\xE0o quang \u0111i\u1EC7n hi\u1EC7u su\u1EA5t cao HPBC th\u1EBF h\u1EC7 m\u1EDBi c\u1EE7a Longi. B\u1EC1 m\u1EB7t kh\xF4ng c\xF3 \u0111\u01B0\u1EDDng h\xE0n m\u1EB7t tr\u01B0\u1EDBc gi\xFAp t\u1ED1i \u0111a h\xF3a kh\u1EA3 n\u0103ng h\u1EA5p th\u1EE5 \xE1nh s\xE1ng m\u1EB7t tr\u1EDDi, th\u1EA9m m\u1EF9 tuy\u1EC7t \u0111\u1EB9p cho m\xE1i nh\xE0 v\xE0 nh\xE0 x\u01B0\u1EDFng, v\u1EADn h\xE0nh b\u1EC1n b\u1EC9 ngay c\u1EA3 trong \u0111i\u1EC1u ki\u1EC7n nhi\u1EC7t \u0111\u1ED9 cao v\xE0 b\u1EE9c x\u1EA1 y\u1EBFu.",
    stock: 280,
    unit: "t\u1EA5m",
    featured: true,
    svgType: "panel",
    origin: "Ch\xEDnh h\xE3ng Longi (\u0110\u1EA7y \u0111\u1EE7 CO/CQ)",
    warrantyYears: 15,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t \u0111\u1EC9nh (Pmax)", value: "580 Wp" },
      { label: "Hi\u1EC7u su\u1EA5t quang n\u0103ng", value: "22.5%" },
      { label: "C\xF4ng ngh\u1EC7 cell", value: "Monocrystalline HPBC N-Type" },
      { label: "\u0110i\u1EC7n \xE1p h\u1EDF m\u1EA1ch (Voc)", value: "51.80 V" },
      { label: "D\xF2ng \u0111i\u1EC7n ng\u1EAFn m\u1EA1ch (Isc)", value: "14.28 A" },
      { label: "\u0110i\u1EC7n \xE1p \u0111i\u1EC3m c\u1EF1c \u0111\u1EA1i (Vmp)", value: "43.60 V" },
      { label: "D\xF2ng \u0111i\u1EC3m c\u1EF1c \u0111\u1EA1i (Imp)", value: "13.31 A" },
      { label: "K\xEDch th\u01B0\u1EDBc", value: "2278 x 1134 x 35 mm" },
      { label: "Tr\u1ECDng l\u01B0\u1EE3ng", value: "27.5 kg" },
      { label: "Chu\u1EA9n kh\xE1ng n\u01B0\u1EDBc/b\u1EE5i", value: "H\u1ED9p \u0111\u1EA5u n\u1ED1i IP68, 3 diode bypass" },
      { label: "B\u1EA3o h\xE0nh v\u1EADt l\xFD", value: "15 n\u0103m" },
      { label: "B\u1EA3o h\xE0nh hi\u1EC7u su\u1EA5t tuy\u1EBFn t\xEDnh", value: "25 n\u0103m (\u2265 88.9%)" }
    ],
    highlights: [
      "C\xF4ng ngh\u1EC7 HPBC \u0111\u1ED9c quy\u1EC1n n\xE2ng hi\u1EC7u su\u1EA5t t\u1EBF b\xE0o l\xEAn tr\xEAn 25%",
      "H\u1EC7 s\u1ED1 suy hao nhi\u1EC7t \u0111\u1ED9 th\u1EA5p ch\u1EC9 -0.29%/\xB0C gi\xFAp sinh \u0111i\u1EC7n v\u01B0\u1EE3t tr\u1ED9i m\xF9a h\xE8",
      "Khung nh\xF4m h\u1EE3p kim Anodized si\xEAu b\u1EC1n, ch\u1ECBu t\u1EA3i gi\xF3 2400Pa v\xE0 t\u1EA3i tuy\u1EBFt 5400Pa",
      "\u0110\u1EA7y \u0111\u1EE7 ch\u1EE9ng ch\u1EC9 TUV, CE, IEC 61215/61730 cho d\u1EF1 \xE1n h\xF2a l\u01B0\u1EDBi v\xE0 \u0111\u1ED9c l\u1EADp"
    ],
    applications: [
      "H\u1EC7 th\u1ED1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi \xE1p m\xE1i h\u1ED9 gia \u0111\xECnh v\xE0 bi\u1EC7t th\u1EF1 cao c\u1EA5p",
      "H\u1EC7 th\u1ED1ng \u0111i\u1EC7n n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi nh\xE0 x\u01B0\u1EDFng, nh\xE0 m\xE1y, kho b\xE3i",
      "Trang tr\u1EA1i n\xF4ng nghi\u1EC7p k\u1EBFt h\u1EE3p \u0111i\u1EC7n m\u1EB7t tr\u1EDDi (Agrivoltaics)"
    ]
  },
  {
    id: "prod-02",
    sku: "DVS-PN-JINKO-620",
    name: "T\u1EA5m Pin N\u0103ng L\u01B0\u1EE3ng M\u1EB7t Tr\u1EDDi Jinko Tiger Neo N-Type 620W (2 M\u1EB7t K\xEDnh)",
    category: "solar-panels",
    brand: "Jinko Solar",
    shortDesc: "D\xF2ng pin 2 m\u1EB7t k\xEDnh (Bifacial) c\xF4ng ngh\u1EC7 TOPCon N-Type, gia t\u0103ng s\u1EA3n l\u01B0\u1EE3ng \u0111i\u1EC7n th\xEAm 10% - 25% t\u1EEB m\u1EB7t l\u01B0ng.",
    fullDesc: "Jinko Tiger Neo 620W \u1EE9ng d\u1EE5ng c\xF4ng ngh\u1EC7 N-Type TOPCon d\u1EABn \u0111\u1EA7u th\u1EBF gi\u1EDBi. C\u1EA5u tr\xFAc hai m\u1EB7t k\xEDnh c\u01B0\u1EDDng l\u1EF1c k\xE9p ch\u1ED1ng ch\u1ECBu th\u1EDDi ti\u1EBFt kh\u1EAFc nghi\u1EC7t, ch\u1ED1ng hi\u1EC7n t\u01B0\u1EE3ng PID v\xE0 LID tri\u1EC7t \u0111\u1EC3. T\u1EA5m pin h\u1EA5p th\u1EE5 c\u1EA3 \xE1nh s\xE1ng ph\u1EA3n x\u1EA1 t\u1EEB m\xE1i t\xF4n, s\xE0n b\xEA t\xF4ng ho\u1EB7c m\u1EB7t \u0111\u1EA5t gi\xFAp t\u0103ng t\u1ED5ng s\u1EA3n l\u01B0\u1EE3ng \u0111i\u1EC7n ph\xE1t ra h\xE0ng ng\xE0y.",
    stock: 160,
    unit: "t\u1EA5m",
    featured: true,
    svgType: "panel",
    origin: "Ch\xEDnh h\xE3ng Jinko Solar",
    warrantyYears: 15,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t \u0111\u1EC9nh (Pmax)", value: "620 Wp" },
      { label: "Hi\u1EC7u su\u1EA5t module", value: "23.0%" },
      { label: "H\u1EC7 s\u1ED1 2 m\u1EB7t (Bifaciality)", value: "80% \xB1 5%" },
      { label: "C\xF4ng ngh\u1EC7 cell", value: "N-Type TOPCon 16BB" },
      { label: "\u0110i\u1EC7n \xE1p c\u1EF1c \u0111\u1EA1i (Vmp)", value: "45.85 V" },
      { label: "D\xF2ng \u0111i\u1EC7n c\u1EF1c \u0111\u1EA1i (Imp)", value: "13.53 A" },
      { label: "C\u1EA5u t\u1EA1o k\xEDnh", value: "K\xEDnh k\xE9p c\u01B0\u1EDDng l\u1EF1c 2.0mm + 2.0mm ch\u1ED1ng ph\u1EA3n x\u1EA1" },
      { label: "K\xEDch th\u01B0\u1EDBc", value: "2382 x 1134 x 30 mm" },
      { label: "Tr\u1ECDng l\u01B0\u1EE3ng", value: "32.0 kg" },
      { label: "B\u1EA3o h\xE0nh hi\u1EC7u su\u1EA5t", value: "30 n\u0103m b\u1EA3o h\xE0nh hi\u1EC7u su\u1EA5t tuy\u1EBFn t\xEDnh" }
    ],
    highlights: [
      "T\u0103ng th\xEAm 15% - 25% s\u1EA3n l\u01B0\u1EE3ng \u0111i\u1EC7n nh\u1EDD c\xF4ng ngh\u1EC7 thu quang 2 m\u1EB7t",
      "\u0110\u1ED9 suy hao n\u0103m \u0111\u1EA7u ti\xEAn c\u1EF1c th\u1EA5p d\u01B0\u1EDBi 1.0%, m\u1ED7i n\u0103m sau ch\u1EC9 0.4%",
      "Ch\u1ED1ng ch\xE1y Class A v\xE0 kh\u1EA3 n\u0103ng ch\u1ED1ng \u0103n m\xF2n s\u01B0\u01A1ng mu\u1ED1i v\u01B0\u1EE3t tr\u1ED9i"
    ],
    applications: [
      "Nh\xE0 x\u01B0\u1EDFng c\xF4ng nghi\u1EC7p, kho logistic di\u1EC7n t\xEDch m\xE1i l\u1EDBn",
      "H\u1EC7 th\u1ED1ng khung gi\xE0n solar tr\xEAn s\xE2n th\u01B0\u1EE3ng, b\xE3i \u0111\u1ED7 xe Solar Carport",
      "D\u1EF1 \xE1n \u0111i\u1EC7n m\u1EB7t tr\u1EDDi m\u1EB7t \u0111\u1EA5t (Ground-mounted)"
    ]
  },
  {
    id: "prod-03",
    sku: "DVS-PN-CANADIAN-575",
    name: "T\u1EA5m Pin N\u0103ng L\u01B0\u1EE3ng M\u1EB7t Tr\u1EDDi Canadian Solar TOPHiKu6 575W",
    category: "solar-panels",
    brand: "Canadian Solar",
    shortDesc: "M\xF4-\u0111un TOPCon N-type hi\u1EC7u su\u1EA5t cao, gi\u1EA3m chi ph\xED LCOE v\xE0 t\u0103ng hi\u1EC7u qu\u1EA3 ho\xE0n v\u1ED1n \u0111\u1EA7u t\u01B0 d\u1EF1 \xE1n.",
    fullDesc: "Canadian Solar TOPHiKu6 575W l\xE0 gi\u1EA3i ph\xE1p l\xFD t\u01B0\u1EDFng cho c\xE1c c\xF4ng tr\xECnh \xE1p m\xE1i d\xE2n d\u1EE5ng v\xE0 th\u01B0\u01A1ng m\u1EA1i c\u1EA7n m\u1EADt \u0111\u1ED9 c\xF4ng su\u1EA5t cao tr\xEAn di\u1EC7n t\xEDch m\xE1i c\xF3 h\u1EA1n. S\u1EED d\u1EE5ng c\xF4ng ngh\u1EC7 chia n\u1EEDa t\u1EBF b\xE0o (Half-cell) gi\xFAp gi\u1EA3m thi\u1EC3u t\u1ED1i \u0111a t\u1ED5n hao do b\xF3ng r\xE2m che khu\u1EA5t m\u1ED9t ph\u1EA7n.",
    stock: 210,
    unit: "t\u1EA5m",
    featured: false,
    svgType: "panel",
    origin: "Canadian Solar Ch\xEDnh H\xE3ng",
    warrantyYears: 12,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t \u0111\u1EC9nh (Pmax)", value: "575 Wp" },
      { label: "Hi\u1EC7u su\u1EA5t quang n\u0103ng", value: "22.3%" },
      { label: "\u0110i\u1EC7n \xE1p h\u1EDF m\u1EA1ch (Voc)", value: "51.4 V" },
      { label: "D\xF2ng ng\u1EAFn m\u1EA1ch (Isc)", value: "14.15 A" },
      { label: "K\xEDch th\u01B0\u1EDBc", value: "2278 x 1134 x 30 mm" },
      { label: "Tr\u1ECDng l\u01B0\u1EE3ng", value: "27.6 kg" },
      { label: "Ti\xEAu chu\u1EA9n b\u1EA3o v\u1EC7", value: "IP68" },
      { label: "B\u1EA3o h\xE0nh v\u1EADt l\xFD", value: "12 n\u0103m" },
      { label: "B\u1EA3o h\xE0nh c\xF4ng su\u1EA5t", value: "30 n\u0103m" }
    ],
    highlights: [
      "C\xF4ng ngh\u1EC7 Half-cell h\u1EA1n ch\u1EBF \u0111i\u1EC3m n\xF3ng (hot-spot) t\u1ED1i \u0111a",
      "\u0110\u1ED9 b\u1EC1n c\u01A1 h\u1ECDc v\u01B0\u1EE3t chu\u1EA9n qu\u1ED1c t\u1EBF, khung nh\xF4m anode h\xF3a",
      "T\u1ED1i \u01B0u h\xF3a s\u1EA3n l\u01B0\u1EE3ng \u0111i\u1EC7n ngay c\u1EA3 khi tr\u1EDDi nhi\u1EC1u m\xE2y"
    ],
    applications: [
      "M\xE1i nh\xE0 ph\u1ED1, bi\u1EC7t th\u1EF1, v\u0103n ph\xF2ng c\xF4ng ty",
      "Nh\xE0 m\xE1y ch\u1EBF bi\u1EBFn, x\u01B0\u1EDFng gia c\xF4ng c\u01A1 kh\xED"
    ]
  },
  {
    id: "prod-13",
    sku: "DVS-PN-JASOLAR-590",
    name: "T\u1EA5m Pin N\u0103ng L\u01B0\u1EE3ng M\u1EB7t Tr\u1EDDi JA Solar DeepBlue 4.0 Pro 590W N-Type",
    category: "solar-panels",
    brand: "JA Solar",
    shortDesc: "D\xF2ng pin DeepBlue 4.0 Pro s\u1EED d\u1EE5ng cell Bycium+ hi\u1EC7u su\u1EA5t 22.8%, v\u1EADn h\xE0nh c\u1EF1c k\u1EF3 \u1ED5n \u0111\u1ECBnh t\u1EA1i kh\xED h\u1EADu nhi\u1EC7t \u0111\u1EDBi.",
    fullDesc: "JA Solar DeepBlue 4.0 Pro 590W t\xEDch h\u1EE3p c\xF4ng ngh\u1EC7 \u0111\xF3ng g\xF3i m\u1EADt \u0111\u1ED9 cao v\xE0 t\u1EBF b\xE0o quang \u0111i\u1EC7n N-Type Bycium+ ti\xEAn ti\u1EBFn, gi\u1EA3m thi\u1EC3u suy hao quang h\u1ECDc v\xE0 \u0111i\u1EC7n tr\u1EDF n\u1ED9i, th\xEDch h\u1EE3p cho c\u1EA3 m\xE1i t\xF4n c\xF4ng nghi\u1EC7p v\xE0 d\xE2n d\u1EE5ng.",
    stock: 190,
    unit: "t\u1EA5m",
    featured: false,
    svgType: "panel",
    origin: "JA Solar Ch\xEDnh H\xE3ng",
    warrantyYears: 12,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t \u0111\u1EC9nh (Pmax)", value: "590 Wp" },
      { label: "Hi\u1EC7u su\u1EA5t quang n\u0103ng", value: "22.8%" },
      { label: "C\xF4ng ngh\u1EC7 cell", value: "N-Type Bycium+ 16BB Half-cell" },
      { label: "\u0110i\u1EC7n \xE1p h\u1EDF m\u1EA1ch (Voc)", value: "51.95 V" },
      { label: "K\xEDch th\u01B0\u1EDBc", value: "2278 x 1134 x 30 mm" },
      { label: "Chu\u1EA9n b\u1EA3o v\u1EC7", value: "IP68" }
    ],
    highlights: [
      "T\u1EBF b\xE0o N-type Bycium+ tu\u1ED5i th\u1ECD cao, kh\xF4ng suy hao LID",
      "Kh\u1EA3 n\u0103ng ph\xE1t \u0111i\u1EC7n bu\u1ED5i s\xE1ng s\u1EDBm v\xE0 chi\u1EC1u mu\u1ED9n v\u01B0\u1EE3t tr\u1ED9i",
      "Kh\xE1ng mu\u1ED1i bi\u1EC3n v\xE0 amoniac \u0111\u1EA1t chu\u1EA9n IEC"
    ],
    applications: [
      "\u0110i\u1EC7n m\u1EB7t tr\u1EDDi m\xE1i nh\xE0 d\xE2n d\u1EE5ng v\xE0 th\u01B0\u01A1ng m\u1EA1i",
      "Tr\u1EA1m n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi v\xF9ng ven bi\u1EC3n"
    ]
  },
  // ================= BIẾN TẦN INVERTER (inverters) =================
  {
    id: "prod-14",
    sku: "DVS-INV-SOLAX-6KW-HYB",
    name: "Bi\u1EBFn T\u1EA7n Inverter Hybrid SolaX X1-Hybrid G4 6kW 1 Pha Cao C\u1EA5p",
    category: "inverters",
    brand: "SolaX",
    shortDesc: "Th\u01B0\u01A1ng hi\u1EC7u Inverter Hybrid cao c\u1EA5p chu\u1EA9n ch\xE2u \xC2u, ch\u1ECBu qu\xE1 t\u1EA3i 150% PV, chuy\u1EC3n m\u1EA1ch UPS d\u01B0\u1EDBi 10ms.",
    fullDesc: "SolaX X1-Hybrid G4 6kW l\xE0 d\xF2ng bi\u1EBFn t\u1EA7n l\u01B0u tr\u1EEF th\u1EBF h\u1EC7 th\u1EE9 4 n\u1ED5i ti\u1EBFng to\xE0n c\u1EA7u c\u1EE7a SolaX Power. Thi\u1EBFt b\u1ECB cho ph\xE9p l\u1EAFp v\u01B0\u1EE3t c\xF4ng su\u1EA5t gi\xE0n pin l\xEAn t\u1EDBi 150%, s\u1EA1c x\u1EA3 nhanh v\xE0 t\xEDch h\u1EE3p qu\u1EA3n l\xFD t\u1EA3i th\xF4ng minh, ho\u1EA1t \u0111\u1ED9ng b\u1EC1n b\u1EC9 trong m\u1ECDi \u0111i\u1EC1u ki\u1EC7n th\u1EDDi ti\u1EBFt.",
    stock: 18,
    unit: "b\u1ED9",
    featured: true,
    svgType: "inverter",
    origin: "SolaX Power Ch\xEDnh H\xE3ng",
    warrantyYears: 5,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t AC \u0111\u1ECBnh m\u1EE9c", value: "6000 W (6 kW)" },
      { label: "C\xF4ng su\u1EA5t PV t\u1ED1i \u0111a", value: "9000 Wp (150% Oversizing)" },
      { label: "S\u1ED1 MPPT", value: "2 MPPT \u0111\u1ED9c l\u1EADp" },
      { label: "Hi\u1EC7u su\u1EA5t c\u1EF1c \u0111\u1EA1i", value: "97.8%" },
      { label: "Th\u1EDDi gian chuy\u1EC3n m\u1EA1ch EPS", value: "< 10 ms" },
      { label: "Chu\u1EA9n b\u1EA3o v\u1EC7", value: "IP65 l\u1EAFp \u0111\u1EB7t trong nh\xE0 & ngo\xE0i tr\u1EDDi" },
      { label: "Gi\xE1m s\xE1t th\xF4ng minh", value: "SolaX Cloud (WiFi / LAN / 4G)" }
    ],
    highlights: [
      "H\u1ED7 tr\u1EE3 l\u1EAFp v\u01B0\u1EE3t c\xF4ng su\u1EA5t t\u1EA5m pin l\xEAn \u0111\u1EBFn 150% v\xE0 qu\xE1 t\u1EA3i ng\xF5 ra EPS 120%",
      "Thi\u1EBFt k\u1EBF t\u1EA3n nhi\u1EC7t nh\xF4m \u0111\xFAc nguy\xEAn kh\u1ED1i kh\xF4ng qu\u1EA1t \u1ED3n",
      "T\u01B0\u01A1ng th\xEDch ho\xE0n h\u1EA3o v\u1EDBi h\u1EC7 sinh th\xE1i pin l\u01B0u tr\u1EEF SolaX Triple Power"
    ],
    applications: [
      "Bi\u1EC7t th\u1EF1, nh\xE0 ph\u1ED1 cao c\u1EA5p c\u1EA7n \u0111\u1ED9 \u1ED5n \u0111\u1ECBnh v\xE0 \xEAm \xE1i tuy\u1EC7t \u0111\u1ED1i",
      "V\u0103n ph\xF2ng c\xF4ng ty, ph\xF2ng kh\xE1m t\u01B0 nh\xE2n"
    ]
  },
  {
    id: "prod-15",
    sku: "DVS-INV-SOLAX-15KW-3P",
    name: "Bi\u1EBFn T\u1EA7n Inverter Hybrid SolaX X3-Ultra 15kW 3 Pha L\u01B0u Tr\u1EEF C\xF4ng Su\u1EA5t L\u1EDBn",
    category: "inverters",
    brand: "SolaX",
    shortDesc: "D\xF2ng Hybrid 3 pha flagship c\u1EE7a SolaX, h\u1ED7 tr\u1EE3 200% c\xF4ng su\u1EA5t PV \u0111\u1EA7u v\xE0o v\xE0 2 c\u1ED5ng k\u1EBFt n\u1ED1i pin l\u01B0u tr\u1EEF \u0111\u1ED9c l\u1EADp.",
    fullDesc: "SolaX X3-Ultra 15kW mang \u0111\u1EBFn c\xF4ng ngh\u1EC7 qu\u1EA3n l\xFD n\u0103ng l\u01B0\u1EE3ng AI th\xF4ng minh, h\u1ED7 tr\u1EE3 t\u1EA3i l\u1EC7ch pha 100%, t\xEDch h\u1EE3p ch\u1ED1ng h\u1ED3 quang \u0111i\u1EC7n AFCI v\xE0 ch\u1ED1ng s\xE9t Type II c\u1EA3 hai ph\xEDa AC/DC.",
    stock: 9,
    unit: "b\u1ED9",
    featured: false,
    svgType: "inverter",
    origin: "SolaX Power Ch\xEDnh H\xE3ng",
    warrantyYears: 5,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t AC \u0111\u1ECBnh m\u1EE9c", value: "15.000 W (3 Pha 380V)" },
      { label: "C\xF4ng su\u1EA5t PV c\u1EF1c \u0111\u1EA1i", value: "30.000 Wp" },
      { label: "S\u1ED1 MPPT", value: "3 MPPT (2 chu\u1ED7i/MPPT)" },
      { label: "Hi\u1EC7u su\u1EA5t t\u1ED1i \u0111a", value: "98.0%" },
      { label: "C\u1EA5p b\u1EA3o v\u1EC7", value: "IP66" }
    ],
    highlights: [
      "Cho ph\xE9p \u0111\u1EA5u n\u1ED1i 2 c\u1EE5m pin l\u01B0u tr\u1EEF \u0111\u1ED9c l\u1EADp t\u0103ng g\u1EA5p \u0111\xF4i dung l\u01B0\u1EE3ng",
      "Chuy\u1EC3n m\u1EA1ch d\u1EF1 ph\xF2ng si\xEAu t\u1ED1c < 4ms kh\xF4ng l\xE0m gi\xE1n \u0111o\u1EA1n thi\u1EBFt b\u1ECB CNTT",
      "H\u1ED7 tr\u1EE3 k\u1EBFt n\u1ED1i tr\u1EA1m s\u1EA1c xe \u0111i\u1EC7n EV Charger th\xF4ng minh"
    ],
    applications: [
      "Bi\u1EC7t th\u1EF1 l\u1EDBn, t\xF2a nh\xE0 v\u0103n ph\xF2ng, showroom s\u1EED d\u1EE5ng \u0111i\u1EC7n 3 pha",
      "C\u01A1 s\u1EDF s\u1EA3n xu\u1EA5t kinh doanh c\u1EA7n ngu\u1ED3n \u0111i\u1EC7n d\u1EF1 ph\xF2ng c\xF4ng su\u1EA5t cao"
    ]
  },
  {
    id: "prod-04",
    sku: "DVS-INV-DEYE-5KW",
    name: "Bi\u1EBFn T\u1EA7n Inverter Hybrid Deye 5kW 1 Pha L\u01B0u Tr\u1EEF Th\xF4ng Minh (SUN-5K-SG04LP1)",
    category: "inverters",
    brand: "Deye",
    shortDesc: "Bi\u1EBFn t\u1EA7n Hybrid th\xF4ng minh h\xE0ng \u0111\u1EA7u, h\u1ED7 tr\u1EE3 pin l\u01B0u tr\u1EEF 48V, ch\u1EA1y h\xF2a l\u01B0\u1EDBi, \u0111\u1ED9c l\u1EADp v\xE0 b\xE1m t\u1EA3i kh\xF4ng ph\xE1t l\u01B0\u1EDBi.",
    fullDesc: "Inverter Hybrid Deye 5kW l\xE0 d\xF2ng bi\u1EBFn t\u1EA7n \u0111a n\u0103ng \u0111\u01B0\u1EE3c \u01B0a chu\u1ED9ng nh\u1EA5t hi\u1EC7n nay cho c\xE1c h\u1EC7 th\u1ED1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi gia \u0111\xECnh. Thi\u1EBFt b\u1ECB t\xEDch h\u1EE3p m\xE0n h\xECnh c\u1EA3m \u1EE9ng LCD m\xE0u tr\u1EF1c quan, cho ph\xE9p k\u1EBFt n\u1ED1i m\xE1y ph\xE1t \u0111i\u1EC7n, c\xE0i \u0111\u1EB7t th\u1EDDi gian n\u1EA1p/x\u1EA3 pin theo gi\u1EDD cao \u0111i\u1EC3m - th\u1EA5p \u0111i\u1EC3m c\u1EE7a EVN \u0111\u1EC3 ti\u1EBFt ki\u1EC7m t\u1ED1i \u0111a h\xF3a \u0111\u01A1n ti\u1EC1n \u0111i\u1EC7n.",
    stock: 22,
    unit: "b\u1ED9",
    featured: true,
    svgType: "inverter",
    origin: "Deye Ch\xEDnh H\xE3ng",
    warrantyYears: 5,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t AC danh \u0111\u1ECBnh", value: "5000 W" },
      { label: "C\xF4ng su\u1EA5t ng\xF5 v\xE0o PV t\u1ED1i \u0111a", value: "6500 W" },
      { label: "S\u1ED1 l\u01B0\u1EE3ng MPPT", value: "2 MPPT \u0111\u1ED9c l\u1EADp" },
      { label: "D\u1EA3i \u0111i\u1EC7n \xE1p MPPT", value: "125V - 425V DC" },
      { label: "\u0110i\u1EC7n \xE1p \u1EAFc quy / pin l\u01B0u tr\u1EEF", value: "40V - 60V (Chu\u1EA9n 48V/51.2V)" },
      { label: "D\xF2ng s\u1EA1c / x\u1EA3 t\u1ED1i \u0111a", value: "120A" },
      { label: "Th\u1EDDi gian chuy\u1EC3n m\u1EA1ch UPS", value: "< 4ms (Kh\xF4ng lo m\u1EA5t ngu\u1ED3n)" },
      { label: "Hi\u1EC7u su\u1EA5t c\u1EF1c \u0111\u1EA1i", value: "97.6%" },
      { label: "Giao ti\u1EBFp & Gi\xE1m s\xE1t", value: "WiFi / GPRS / RS485 / CAN qua App di \u0111\u1ED9ng" },
      { label: "C\u1EA5p \u0111\u1ED9 b\u1EA3o v\u1EC7", value: "IP65 ngo\xE0i tr\u1EDDi" }
    ],
    highlights: [
      "T\u1EF1 \u0111\u1ED9ng chuy\u1EC3n \u0111\u1ED5i sang ngu\u1ED3n d\u1EF1 ph\xF2ng si\xEAu nhanh < 4ms khi c\xFAp \u0111i\u1EC7n",
      "M\xE0n h\xECnh c\u1EA3m \u1EE9ng LCD tr\u1EF1c quan d\u1EC5 thao t\xE1c c\xE0i \u0111\u1EB7t c\xE1c th\xF4ng s\u1ED1",
      "H\u1ED7 tr\u1EE3 h\xF2a l\u01B0\u1EDBi b\xE1m t\u1EA3i Zero-Export kh\xF4ng lo ph\xE1t ng\u01B0\u1EE3c \u0111i\u1EC7n l\xEAn l\u01B0\u1EDBi",
      "Kh\u1EA3 n\u0103ng gh\xE9p song song l\xEAn \u0111\u1EBFn 16 m\xE1y \u0111\u1EC3 n\xE2ng c\xF4ng su\u1EA5t"
    ],
    applications: [
      "H\u1EC7 th\u1ED1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi c\xF3 l\u01B0u tr\u1EEF cho bi\u1EC7t th\u1EF1, nh\xE0 ph\u1ED1",
      "C\u01A1 s\u1EDF kinh doanh, v\u0103n ph\xF2ng c\u1EA7n duy tr\xEC \u0111i\u1EC7n li\xEAn t\u1EE5c 24/7"
    ]
  },
  {
    id: "prod-05",
    sku: "DVS-INV-DEYE-12KW-3P",
    name: "Bi\u1EBFn T\u1EA7n Inverter Hybrid Deye 12kW 3 Pha Cao C\u1EA5p (SUN-12K-SG04LP3)",
    category: "inverters",
    brand: "Deye",
    shortDesc: "Bi\u1EBFn t\u1EA7n Hybrid 3 pha \u0111i\u1EC7n \xE1p th\u1EA5p (48V), c\xF4ng su\u1EA5t 12kW, h\u1ED7 tr\u1EE3 t\u1EA3i m\u1EA5t c\xE2n b\u1EB1ng 100% t\u1EEBng pha.",
    fullDesc: "Bi\u1EBFn t\u1EA7n Hybrid 3 pha Deye 12kW l\xE0 gi\u1EA3i ph\xE1p t\u1ED1i \u01B0u cho bi\u1EC7t th\u1EF1 l\u1EDBn, nh\xE0 h\xE0ng, kh\xE1ch s\u1EA1n v\xE0 c\xE1c x\u01B0\u1EDFng s\u1EA3n xu\u1EA5t s\u1EED d\u1EE5ng \u0111i\u1EC7n 3 pha. Kh\u1EA3 n\u0103ng xu\u1EA5t t\u1EA3i kh\xF4ng c\xE2n b\u1EB1ng 100% gi\xFAp c\xE1c pha ho\u1EA1t \u0111\u1ED9ng \u0111\u1ED9c l\u1EADp kh\xF4ng b\u1ECB ngh\u1EBDn khi nhu c\u1EA7u s\u1EED d\u1EE5ng gi\u1EEFa c\xE1c pha ch\xEAnh l\u1EC7ch.",
    stock: 12,
    unit: "b\u1ED9",
    featured: true,
    svgType: "inverter",
    origin: "Deye Ch\xEDnh H\xE3ng",
    warrantyYears: 5,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t AC danh \u0111\u1ECBnh", value: "12000 W (3 Pha 380V/400V)" },
      { label: "C\xF4ng su\u1EA5t ng\xF5 v\xE0o PV t\u1ED1i \u0111a", value: "15600 W" },
      { label: "D\u1EA3i \u0111i\u1EC7n \xE1p pin l\u01B0u tr\u1EEF", value: "40V - 60V (An to\xE0n cho ng\u01B0\u1EDDi d\xF9ng)" },
      { label: "D\xF2ng s\u1EA1c / x\u1EA3 t\u1ED1i \u0111a", value: "240A" },
      { label: "T\u1EA3i kh\xF4ng c\xE2n b\u1EB1ng", value: "H\u1ED7 tr\u1EE3 100% t\u1EA3i l\u1EC7ch pha" },
      { label: "Hi\u1EC7u su\u1EA5t t\u1ED1i \u0111a", value: "97.6%" },
      { label: "Chu\u1EA9n b\u1EA3o v\u1EC7", value: "IP65" },
      { label: "K\xEDch th\u01B0\u1EDBc", value: "422 x 699 x 279 mm" }
    ],
    highlights: [
      "S\u1EED d\u1EE5ng pin l\u01B0u tr\u1EEF an to\xE0n 48V kh\xF4ng c\u1EA7n pin \u0111i\u1EC7n \xE1p cao \u0111\u1EAFt \u0111\u1ECF",
      "B\u1EA3o v\u1EC7 \u0111\u1EA7y \u0111\u1EE7: qu\xE1 \xE1p, qu\xE1 d\xF2ng, ch\u1ED1ng \u0111\u1EA3o d\xF2ng, ph\xE1t hi\u1EC7n s\u1EF1 c\u1ED1 h\u1ED3 quang AFCI",
      "Gi\xE1m s\xE1t t\u1EEB xa qua \u0111i\u1EC7n tho\u1EA1i th\xF4ng minh m\u1ECDi l\xFAc m\u1ECDi n\u01A1i"
    ],
    applications: [
      "Bi\u1EC7t th\u1EF1 s\xE2n v\u01B0\u1EDDn, trang tr\u1EA1i, khu ngh\u1EC9 d\u01B0\u1EE1ng sinh th\xE1i",
      "T\xF2a nh\xE0 v\u0103n ph\xF2ng, ph\xF2ng kh\xE1m, nh\xE0 thu\u1ED1c d\xF9ng \u0111i\u1EC7n 3 pha"
    ]
  },
  {
    id: "prod-16",
    sku: "DVS-INV-SOLIS-5KW-HYB",
    name: "Bi\u1EBFn T\u1EA7n Inverter Hybrid Solis S6-EH1P5K-L-PRO 5kW 1 Pha Th\u1EBF H\u1EC7 M\u1EDBi",
    category: "inverters",
    brand: "Solis",
    shortDesc: "D\xF2ng Hybrid S6 Pro m\u1EDBi nh\u1EA5t c\u1EE7a Solis h\u1ED7 tr\u1EE3 d\xF2ng s\u1EA1c x\u1EA3 135A, k\u1EBFt n\u1ED1i m\xE1y ph\xE1t \u0111i\u1EC7n v\xE0 gh\xE9p song song 6 m\xE1y.",
    fullDesc: "Solis S6-EH1P5K-L-PRO \u0111\u01B0\u1EE3c thi\u1EBFt k\u1EBF chuy\xEAn bi\u1EC7t cho h\u1EC7 th\u1ED1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi l\u01B0u tr\u1EEF h\u1ED9 gia \u0111\xECnh. H\u1ED7 tr\u1EE3 d\xF2ng \u0111i\u1EC7n \u0111\u1EA7u v\xE0o MPPT l\xEAn \u0111\u1EBFn 16A, t\u01B0\u01A1ng th\xEDch v\u1EDBi m\u1ECDi lo\u1EA1i t\u1EA5m pin c\xF4ng su\u1EA5t l\u1EDBn 580W - 650W hi\u1EC7n nay.",
    stock: 25,
    unit: "b\u1ED9",
    featured: true,
    svgType: "inverter",
    origin: "Solis Ch\xEDnh H\xE3ng",
    warrantyYears: 5,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t AC \u0111\u1ECBnh m\u1EE9c", value: "5000 W" },
      { label: "C\xF4ng su\u1EA5t PV t\u1ED1i \u0111a", value: "8000 W" },
      { label: "D\xF2ng ng\u1EAFn m\u1EA1ch MPPT t\u1ED1i \u0111a", value: "16A / 2 MPPT" },
      { label: "D\xF2ng s\u1EA1c / x\u1EA3 pin t\u1ED1i \u0111a", value: "135 A" },
      { label: "Th\u1EDDi gian chuy\u1EC3n m\u1EA1ch UPS", value: "< 4 ms" },
      { label: "C\u1EA5p b\u1EA3o v\u1EC7", value: "IP66 ch\u1ED1ng b\u1EE5i n\u01B0\u1EDBc cao c\u1EA5p" }
    ],
    highlights: [
      "Ch\u1ECBu qu\xE1 t\u1EA3i d\u1EF1 ph\xF2ng l\xEAn t\u1EDBi 200% trong 10 gi\xE2y cho c\xE1c thi\u1EBFt b\u1ECB \u0111\u1EC1 d\xF2ng l\u1EDBn",
      "T\u01B0\u01A1ng th\xEDch r\u1ED9ng r\xE3i v\u1EDBi c\xE1c h\xE3ng pin l\u01B0u tr\u1EEF Pylontech, Dyness, SolaX, Deye",
      "Qu\u1EA3n l\xFD th\xF4ng minh tr\xEAn \u1EE9ng d\u1EE5ng SolisCloud ti\u1EBFng Vi\u1EC7t"
    ],
    applications: [
      "Nh\xE0 ph\u1ED1, bi\u1EC7t th\u1EF1, c\u1EEDa h\xE0ng kinh doanh d\u1ECBch v\u1EE5",
      "Khu v\u1EF1c \u0111i\u1EC7n l\u01B0\u1EDBi y\u1EBFu ho\u1EB7c hay c\u1EAFt \u0111i\u1EC7n \u0111\u1ED9t xu\u1EA5t"
    ]
  },
  {
    id: "prod-17",
    sku: "DVS-INV-SOLIS-20KW-3P",
    name: "Bi\u1EBFn T\u1EA7n H\xF2a L\u01B0\u1EDBi 3 Pha Solis S5-GC20K 20kW Hi\u1EC7u Su\u1EA5t Cao",
    category: "inverters",
    brand: "Solis",
    shortDesc: "Bi\u1EBFn t\u1EA7n h\xF2a l\u01B0\u1EDBi 3 pha nh\u1ECF g\u1ECDn, hi\u1EC7u su\u1EA5t 98.7%, t\xEDch h\u1EE3p b\xE1m t\u1EA3i Zero Export cho h\u1ED9 kinh doanh & v\u0103n ph\xF2ng.",
    fullDesc: "Solis S5-GC20K thu\u1ED9c d\xF2ng bi\u1EBFn t\u1EA7n h\xF2a l\u01B0\u1EDBi th\u1EBF h\u1EC7 th\u1EE9 5 c\u1EE7a Ginlong Solis, thi\u1EBFt k\u1EBF d\u1EA3i \u0111i\u1EC7n \xE1p MPPT r\u1ED9ng, kh\u1EDFi \u0111\u1ED9ng s\u1EDBm t\u1EEB 180V gi\xFAp thu ho\u1EA1ch t\u1ED1i \u0111a \xE1nh n\u1EAFng m\u1EB7t tr\u1EDDi t\u1EEB s\xE1ng s\u1EDBm t\u1EDBi chi\u1EC1u mu\u1ED9n.",
    stock: 15,
    unit: "b\u1ED9",
    featured: false,
    svgType: "inverter",
    origin: "Solis Ch\xEDnh H\xE3ng",
    warrantyYears: 5,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t \u0111\u1EA7u ra \u0111\u1ECBnh m\u1EE9c", value: "20.000 W (20 kW 3 Pha)" },
      { label: "Hi\u1EC7u su\u1EA5t t\u1ED1i \u0111a", value: "98.7%" },
      { label: "S\u1ED1 l\u01B0\u1EE3ng MPPT", value: "2 MPPT (4 chu\u1ED7i PV)" },
      { label: "\u0110i\u1EC7n \xE1p kh\u1EDFi \u0111\u1ED9ng", value: "180 V DC" },
      { label: "Chu\u1EA9n b\u1EA3o v\u1EC7", value: "IP66" }
    ],
    highlights: [
      "Hi\u1EC7u su\u1EA5t chuy\u1EC3n \u0111\u1ED5i 98.7% gi\u1EA3m thi\u1EC3u t\u1ED1i \u0111a t\u1ED5n hao nhi\u1EC7t",
      "H\u1ED7 tr\u1EE3 gi\xE1m s\xE1t t\u1EEBng chu\u1ED7i PV v\xE0 ch\u1ED1ng ph\xE1t ng\u01B0\u1EE3c l\u01B0\u1EDBi th\xF4ng minh",
      "\u0110\u1ED9 b\u1EC1n cao, v\u1EADn h\xE0nh \u1ED5n \u0111\u1ECBnh tr\xEAn 15 n\u0103m"
    ],
    applications: [
      "V\u0103n ph\xF2ng c\xF4ng ty, kh\xE1ch s\u1EA1n, x\u01B0\u1EDFng may, qu\xE1n c\xE0 ph\xEA l\u1EDBn",
      "H\u1ED9 gia \u0111\xECnh s\u1EED d\u1EE5ng \u0111i\u1EC7n 3 pha kinh doanh"
    ]
  },
  {
    id: "prod-06",
    sku: "DVS-INV-SUNGROW-50K",
    name: "Bi\u1EBFn T\u1EA7n H\xF2a L\u01B0\u1EDBi C\xF4ng Nghi\u1EC7p Sungrow 50kW (SG50CX-P2)",
    category: "inverters",
    brand: "Sungrow",
    shortDesc: "Bi\u1EBFn t\u1EA7n h\xF2a l\u01B0\u1EDBi chu\u1ED7i th\u1EBF h\u1EC7 m\u1EDBi cho m\xE1i nh\xE0 x\u01B0\u1EDFng c\xF4ng nghi\u1EC7p, 5 MPPT hi\u1EC7u su\u1EA5t 98.5%.",
    fullDesc: "Sungrow SG50CX-P2 l\xE0 bi\u1EC3u t\u01B0\u1EE3ng c\u1EE7a s\u1EF1 b\u1EC1n b\u1EC9 trong ng\xE0nh \u0111i\u1EC7n m\u1EB7t tr\u1EDDi c\xF4ng nghi\u1EC7p. Thi\u1EBFt b\u1ECB ch\u1ECBu \u0111\u01B0\u1EE3c nhi\u1EC7t \u0111\u1ED9 cao, m\xF4i tr\u01B0\u1EDDng b\u1EE5i b\u1EB7m nh\xE0 m\xE1y, t\u1ED1i \u01B0u h\xF3a s\u1EA3n l\u01B0\u1EE3ng \u0111i\u1EC7n tr\xEAn di\u1EC7n t\xEDch m\xE1i l\u1EDBn v\u1EDBi 5 b\u1ED9 theo d\xF5i \u0111i\u1EC3m c\xF4ng su\u1EA5t c\u1EF1c \u0111\u1EA1i (MPPT).",
    stock: 6,
    unit: "m\xE1y",
    featured: false,
    svgType: "inverter",
    origin: "Sungrow Ch\xEDnh H\xE3ng",
    warrantyYears: 5,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t danh \u0111\u1ECBnh", value: "50.000 W (50 kW)" },
      { label: "Hi\u1EC7u su\u1EA5t t\u1ED1i \u0111a", value: "98.5%" },
      { label: "S\u1ED1 k\xEAnh MPPT", value: "5 MPPT v\u1EDBi 2 chu\u1ED7i/MPPT" },
      { label: "\u0110i\u1EC7n \xE1p \u0111\u1EA7u v\xE0o t\u1ED1i \u0111a", value: "1100 V" },
      { label: "C\u1EA5p b\u1EA3o v\u1EC7", value: "IP66 v\xE0 C5 ch\u1ED1ng \u0103n m\xF2n" }
    ],
    highlights: [
      "T\xEDch h\u1EE3p t\xEDnh n\u0103ng ng\u1EAFt m\u1EA1ch AFCI th\xF4ng minh ch\u1ED1ng ch\xE1y n\u1ED5",
      "L\xE0m m\xE1t qu\u1EA1t th\xF4ng minh t\u0103ng tu\u1ED5i th\u1ECD linh ki\u1EC7n",
      "Qu\u1EA3n tr\u1ECB n\u0103ng l\u01B0\u1EE3ng th\xF4ng minh tr\xEAn n\u1EC1n t\u1EA3ng iSolarCloud"
    ],
    applications: [
      "Nh\xE0 m\xE1y s\u1EA3n xu\u1EA5t, khu c\xF4ng nghi\u1EC7p, kho logistic",
      "B\xE3i \u0111\u1ED7 xe n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi doanh nghi\u1EC7p"
    ]
  },
  // ================= PIN LƯU TRỮ ESS (energy-storage) =================
  {
    id: "prod-18",
    sku: "DVS-ESS-SOLAX-5.8KWH",
    name: "Pin L\u01B0u Tr\u1EEF Lithium SolaX Triple Power T-BAT H 5.8kWh Cao C\u1EA5p",
    category: "energy-storage",
    brand: "SolaX",
    shortDesc: "Pin l\u01B0u tr\u1EEF LiFePO4 ch\xEDnh h\xE3ng SolaX, kh\u1EA3 n\u0103ng gh\xE9p n\u1ED1i linh ho\u1EA1t, \u0111\u1ED9 s\xE2u x\u1EA3 90% v\xE0 h\u01A1n 6000 chu k\u1EF3 s\u1EA1c x\u1EA3.",
    fullDesc: "SolaX Triple Power 5.8kWh l\xE0 d\xF2ng pin l\u01B0u tr\u1EEF \u0111\u1ED3ng b\u1ED9 cao c\u1EA5p nh\u1EA5t khi k\u1EBFt h\u1EE3p c\xF9ng bi\u1EBFn t\u1EA7n SolaX Hybrid. Thi\u1EBFt k\u1EBF chu\u1EA9n IP65 ch\u1ED1ng b\u1EE5i n\u01B0\u1EDBc, h\u1EC7 th\u1ED1ng s\u01B0\u1EDFi \u1EA5m v\xE0 ki\u1EC3m so\xE1t nhi\u1EC7t \u0111\u1ED9 th\xF4ng minh gi\xFAp pin ho\u1EA1t \u0111\u1ED9ng an to\xE0n tuy\u1EC7t \u0111\u1ED1i.",
    stock: 16,
    unit: "b\u1ED9",
    featured: true,
    svgType: "battery",
    origin: "SolaX Power Ch\xEDnh H\xE3ng",
    warrantyYears: 10,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "Dung l\u01B0\u1EE3ng danh \u0111\u1ECBnh", value: "5.8 kWh" },
      { label: "C\xF4ng ngh\u1EC7 cell", value: "Lithium LiFePO4 an to\xE0n tuy\u1EC7t \u0111\u1ED1i" },
      { label: "\u0110\u1ED9 s\xE2u x\u1EA3 (DoD)", value: "90%" },
      { label: "Tu\u1ED5i th\u1ECD chu k\u1EF3", value: "> 6000 chu k\u1EF3" },
      { label: "C\u1EA5p b\u1EA3o v\u1EC7", value: "IP65" },
      { label: "B\u1EA3o h\xE0nh ch\xEDnh h\xE3ng", value: "10 n\u0103m" }
    ],
    highlights: [
      "\u0110\u1ED3ng b\u1ED9 100% giao th\u1EE9c BMS v\u1EDBi bi\u1EBFn t\u1EA7n SolaX qua SolaX Cloud",
      "Thi\u1EBFt k\u1EBF d\u1EA1ng module x\u1EBFp ch\u1ED3ng kh\xF4ng c\u1EA7n d\xE2y c\xE1p r\u01B0\u1EDDm r\xE0",
      "Hi\u1EC7u su\u1EA5t n\u1EA1p x\u1EA3 kh\u1EE9 h\u1ED3i \u0111\u1EA1t tr\xEAn 95%"
    ],
    applications: [
      "H\u1EC7 th\u1ED1ng l\u01B0u tr\u1EEF n\u0103ng l\u01B0\u1EE3ng cao c\u1EA5p cho bi\u1EC7t th\u1EF1 v\xE0 v\u0103n ph\xF2ng",
      " Ngu\u1ED3n \u0111i\u1EC7n d\u1EF1 ph\xF2ng UPS c\xF4ng su\u1EA5t l\u1EDBn"
    ]
  },
  {
    id: "prod-19",
    sku: "DVS-ESS-DEYE-SE-G5.1",
    name: "Pin L\u01B0u Tr\u1EEF Lithium Deye SE-G5.1 Pro-B 5.12kWh 51.2V 100Ah",
    category: "energy-storage",
    brand: "Deye",
    shortDesc: "Pin l\u01B0u tr\u1EEF \u0111\u1ED3ng b\u1ED9 ch\xEDnh h\xE3ng Deye, t\u1EF1 \u0111\u1ED9ng nh\u1EADn di\u1EC7n giao ti\u1EBFp CAN v\u1EDBi Inverter Deye, b\u1EA3o h\xE0nh 10 n\u0103m.",
    fullDesc: "Deye SE-G5.1 Pro-B s\u1EED d\u1EE5ng cell pin LiFePO4 kh\xF4ng ch\u1EE9a coban, tu\u1ED5i th\u1ECD d\xE0i v\xE0 \u0111\u1ED9 an to\xE0n cao. H\u1ED7 tr\u1EE3 k\u1EBFt n\u1ED1i song song t\u1ED1i \u0111a 64 c\u1EE5m pin m\xE0 kh\xF4ng c\u1EA7n b\u1ED9 \u0111i\u1EC1u khi\u1EC3n trung t\xE2m b\xEAn ngo\xE0i.",
    stock: 20,
    unit: "b\u1ED9",
    featured: true,
    svgType: "battery",
    origin: "Deye Ch\xEDnh H\xE3ng",
    warrantyYears: 10,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "Dung l\u01B0\u1EE3ng danh \u0111\u1ECBnh", value: "5.12 kWh (51.2V - 100Ah)" },
      { label: "D\xF2ng s\u1EA1c/x\u1EA3 t\u1ED1i \u0111a", value: "100A li\xEAn t\u1EE5c" },
      { label: "Tu\u1ED5i th\u1ECD chu k\u1EF3", value: "\u2265 6000 chu k\u1EF3 (t\u1EA1i 25\xB0C, 90% DoD)" },
      { label: "C\u1ED5ng giao ti\u1EBFp", value: "CAN2.0 / RS485" },
      { label: "Tr\u1ECDng l\u01B0\u1EE3ng", value: "44 kg" }
    ],
    highlights: [
      "C\u1EAFm l\xE0 ch\u1EA1y (Plug & Play) t\u1EF1 nh\u1EADn c\u1EA5u h\xECnh v\u1EDBi bi\u1EBFn t\u1EA7n Deye",
      "H\u1ED7 tr\u1EE3 l\u1EAFp \u0111\u1EB7t treo t\u01B0\u1EDDng, \u0111\u1EB7t s\xE0n ho\u1EB7c l\u1EAFp t\u1EE7 Rack 19 inch",
      "T\xEDch h\u1EE3p BMS th\xF4ng minh gi\xE1m s\xE1t t\u1EEBng cell pin qua \u0111i\u1EC7n tho\u1EA1i"
    ],
    applications: [
      "H\u1EC7 th\u1ED1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi Hybrid gia \u0111\xECnh v\xE0 c\u1EEDa h\xE0ng",
      "L\u01B0u tr\u1EEF \u0111i\u1EC7n gi\u1EDD th\u1EA5p \u0111i\u1EC3m d\xF9ng cho gi\u1EDD cao \u0111i\u1EC3m"
    ]
  },
  {
    id: "prod-07",
    sku: "DVS-ESS-DYNESS-5KWH",
    name: "Pin L\u01B0u Tr\u1EEF Lithium LiFePO4 Dyness Powerbox F 5.12kWh 51.2V",
    category: "energy-storage",
    brand: "Dyness",
    shortDesc: "Cell pin Lithium Iron Phosphate an to\xE0n nh\u1EA5t hi\u1EC7n nay, tu\u1ED5i th\u1ECD tr\xEAn 6000 chu k\u1EF3 n\u1EA1p x\u1EA3 (tr\xEAn 15 n\u0103m).",
    fullDesc: "Pin l\u01B0u tr\u1EEF Dyness Powerbox F-5.12 \u0111\u01B0\u1EE3c s\u1EA3n xu\u1EA5t v\u1EDBi cell pin LiFePO4 cao c\u1EA5p, \u0111\u1EA3m b\u1EA3o an to\xE0n tuy\u1EC7t \u0111\u1ED1i ch\u1ED1ng ch\xE1y n\u1ED5. Thi\u1EBFt k\u1EBF d\u1EA1ng module g\u1EAFn t\u01B0\u1EDDng ho\u1EB7c \u0111\u1EB7t s\xE0n tinh t\u1EBF, t\u01B0\u01A1ng th\xEDch ho\xE0n h\u1EA3o v\u1EDBi c\xE1c d\xF2ng Inverter Hybrid ph\u1ED5 bi\u1EBFn nh\u01B0 Deye, SolaX, Solis, Growatt.",
    stock: 28,
    unit: "b\u1ED9",
    featured: true,
    svgType: "battery",
    origin: "Dyness Ch\xEDnh H\xE3ng",
    warrantyYears: 10,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "Dung l\u01B0\u1EE3ng danh \u0111\u1ECBnh", value: "5.12 kWh" },
      { label: "\u0110i\u1EC7n \xE1p danh \u0111\u1ECBnh", value: "51.2 V (100Ah)" },
      { label: "\u0110\u1ED9 s\xE2u x\u1EA3 DoD", value: "90%" },
      { label: "Tu\u1ED5i th\u1ECD chu k\u1EF3", value: "\u2265 6000 chu k\u1EF3 (t\u1EA1i 25\xB0C, 0.5C)" },
      { label: "D\xF2ng s\u1EA1c / x\u1EA3 li\xEAn t\u1EE5c", value: "50A (Khuy\u1EBFn ngh\u1ECB), 100A (T\u1ED1i \u0111a)" },
      { label: "H\u1EC7 th\u1ED1ng qu\u1EA3n l\xFD", value: "BMS th\xF4ng minh b\u1EA3o v\u1EC7 \u0111a t\u1EA7ng" },
      { label: "Kh\u1EA3 n\u0103ng m\u1EDF r\u1ED9ng", value: "Gh\xE9p song song t\u1ED1i \u0111a 32 b\u1ED9 (163.8 kWh)" },
      { label: "Chu\u1EA9n an to\xE0n", value: "UN38.3, CE, IEC62619" }
    ],
    highlights: [
      "Cell pin LiFePO4 th\u1EBF h\u1EC7 m\u1EDBi kh\xF4ng sinh nhi\u1EC7t nguy hi\u1EC3m",
      "M\xE0n h\xECnh LED ch\u1EC9 b\xE1o tr\u1EA1ng th\xE1i SOC v\xE0 dung l\u01B0\u1EE3ng pin tr\u1EF1c quan",
      "T\u1EF1 \u0111\u1ED9ng \u0111\u1ED3ng b\u1ED9 giao ti\u1EBFp CAN/RS485 v\u1EDBi bi\u1EBFn t\u1EA7n Hybrid"
    ],
    applications: [
      "L\u01B0u tr\u1EEF \u0111i\u1EC7n m\u1EB7t tr\u1EDDi ban ng\xE0y \u0111\u1EC3 s\u1EED d\u1EE5ng v\xE0o ban \u0111\xEAm",
      "H\u1EC7 th\u1ED1ng c\u1EA5p \u0111i\u1EC7n d\u1EF1 ph\xF2ng khi m\u1EA5t \u0111i\u1EC7n l\u01B0\u1EDBi cho camera, t\u1EE7 l\u1EA1nh, thi\u1EBFt b\u1ECB chi\u1EBFu s\xE1ng"
    ]
  },
  {
    id: "prod-08",
    sku: "DVS-ESS-WALL-10KWH",
    name: "B\u1ED9 Pin L\u01B0u Tr\u1EEF Treo T\u01B0\u1EDDng Th\xF4ng Minh \u0110\u1EE9c Vinh Solar ESS 10.24kWh",
    category: "energy-storage",
    brand: "\u0110\u1EE9c Vinh ESS",
    shortDesc: "Pin l\u01B0u tr\u1EEF lithium d\u1EA1ng m\u1ECFng treo t\u01B0\u1EDDng cao c\u1EA5p, dung l\u01B0\u1EE3ng kh\u1EE7ng 10.24kWh, thi\u1EBFt k\u1EBF th\u1EA9m m\u1EF9 cho c\u0103n h\u1ED9.",
    fullDesc: "\u0110\u1EE9c Vinh Solar ESS 10.24kWh l\xE0 gi\u1EA3i ph\xE1p l\u01B0u tr\u1EEF \u0111i\u1EC7n cao c\u1EA5p d\xE0nh ri\xEAng cho c\xE1c h\u1ED9 gia \u0111\xECnh v\xE0 v\u0103n ph\xF2ng mu\u1ED1n t\u1EF1 ch\u1EE7 ngu\u1ED3n \u0111i\u1EC7n m\xE0 kh\xF4ng t\u1ED1n di\u1EC7n t\xEDch s\xE0n. V\u1ECF kim lo\u1EA1i s\u01A1n t\u0129nh \u0111i\u1EC7n ch\u1ED1ng x\u01B0\u1EDBc, t\u1EA3n nhi\u1EC7t t\u1EF1 nhi\xEAn \xEAm \xE1i kh\xF4ng ti\u1EBFng \u1ED3n.",
    stock: 14,
    unit: "b\u1ED9",
    featured: true,
    svgType: "battery",
    origin: "L\u1EAFp r\xE1p ti\xEAu chu\u1EA9n \u0110\u1EE9c Vinh Solar",
    warrantyYears: 10,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "Dung l\u01B0\u1EE3ng danh \u0111\u1ECBnh", value: "10.24 kWh" },
      { label: "\u0110i\u1EC7n \xE1p ho\u1EA1t \u0111\u1ED9ng", value: "44.8V - 58.4V (51.2V danh \u0111\u1ECBnh)" },
      { label: "Dung l\u01B0\u1EE3ng Ah", value: "200 Ah" },
      { label: "D\xF2ng x\u1EA3 li\xEAn t\u1EE5c", value: "100A (X\u1EA3 \u0111\u1EC9nh 150A trong 10s)" },
      { label: "C\u1EA5p b\u1EA3o v\u1EC7", value: "IP55" },
      { label: "Tr\u1ECDng l\u01B0\u1EE3ng", value: "88 kg" },
      { label: "K\xEDch th\u01B0\u1EDBc", value: "720 x 550 x 200 mm" }
    ],
    highlights: [
      "Dung l\u01B0\u1EE3ng l\u1EDBn 10kWh \u0111\u1EE7 v\u1EADn h\xE0nh \u0111i\u1EC1u h\xF2a v\xE0 thi\u1EBFt b\u1ECB gia \u0111\xECnh qua \u0111\xEAm",
      "Thi\u1EBFt k\u1EBF si\xEAu m\u1ECFng treo t\u01B0\u1EDDng th\u1EA9m m\u1EF9 nh\u01B0 m\u1ED9t m\xF3n \u0111\u1ED3 n\u1ED9i th\u1EA5t",
      "T\xEDch h\u1EE3p c\u1EA7u dao Aptomat DC ch\u1ED1ng ch\u1EADp ch\xE1y chuy\xEAn d\u1EE5ng"
    ],
    applications: [
      "Bi\u1EC7t th\u1EF1, nh\xE0 ph\u1ED1 hi\u1EC7n \u0111\u1EA1i, c\u0103n h\u1ED9 cao c\u1EA5p",
      "Tr\u1EA1m vi\u1EC5n th\xF4ng, ph\xF2ng server nh\u1ECF c\u1EA7n UPS th\u1EDDi gian d\xE0i"
    ]
  },
  // ================= ĐÈN NĂNG LƯỢNG MẶT TRỜI (solar-lights) =================
  {
    id: "prod-11",
    sku: "DVS-LGT-STREET-400W",
    name: "\u0110\xE8n \u0110\u01B0\u1EDDng N\u0103ng L\u01B0\u1EE3ng M\u1EB7t Tr\u1EDDi Li\u1EC1n Th\u1EC3 Cao C\u1EA5p 400W IP67 \u0110\u1EE9c Vinh",
    category: "solar-lights",
    brand: "\u0110\u1EE9c Vinh Lighting",
    shortDesc: "\u0110\xE8n \u0111\u01B0\u1EDDng solar th\xF4ng minh t\xEDch h\u1EE3p t\u1EA5m pin, pin Lithium LiFePO4 v\xE0 c\u1EA3m bi\u1EBFn radar t\u1EF1 \u0111\u1ED9ng ph\xE1t s\xE1ng.",
    fullDesc: "\u0110\xE8n \u0111\u01B0\u1EDDng n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi li\u1EC1n th\u1EC3 400W c\u1EE7a \u0110\u1EE9c Vinh Solar l\xE0 l\u1EF1a ch\u1ECDn s\u1ED1 1 cho c\xE1c c\xF4ng tr\xECnh chi\u1EBFu s\xE1ng \u0111\u01B0\u1EDDng ph\u1ED1 n\xF4ng th\xF4n m\u1EDBi, khu d\xE2n c\u01B0, \u0111\u01B0\u1EDDng n\u1ED9i b\u1ED9 nh\xE0 m\xE1y m\xE0 kh\xF4ng c\u1EA7n t\u1ED1n chi ph\xED k\xE9o d\xE2y \u0111i\u1EC7n hay ti\u1EC1n \u0111i\u1EC7n h\xE0ng th\xE1ng.",
    stock: 140,
    unit: "b\u1ED9",
    featured: true,
    svgType: "streetlight",
    origin: "\u0110\u1EE9c Vinh Solar OEM",
    warrantyYears: 3,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t b\xF3ng LED", value: "400 W (Chip LED Bridgelux M\u1EF9 si\xEAu s\xE1ng)" },
      { label: "Quang th\xF4ng (Lumen)", value: "6500 lm" },
      { label: "T\u1EA5m pin n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi", value: "Mono 6V/40W t\xEDch h\u1EE3p m\u1EB7t sau" },
      { label: "Pin l\u01B0u tr\u1EEF", value: "Lithium LiFePO4 3.2V 36000mAh" },
      { label: "Th\u1EDDi gian s\u1EA1c \u0111\u1EA7y", value: "4 - 6 gi\u1EDD n\u1EAFng ti\xEAu chu\u1EA9n" },
      { label: "Th\u1EDDi gian chi\u1EBFu s\xE1ng", value: "12 - 16 gi\u1EDD li\xEAn t\u1EE5c (s\xE1ng c\u1EA3 \u0111\xEAm)" },
      { label: "C\u1EA3m bi\u1EBFn", value: "C\u1EA3m bi\u1EBFn chuy\u1EC3n \u0111\u1ED9ng Radar + C\u1EA3m bi\u1EBFn \xE1nh s\xE1ng" },
      { label: "Ch\u1EC9 s\u1ED1 b\u1EA3o v\u1EC7", value: "IP67 ch\u1ED1ng n\u01B0\u1EDBc m\u01B0a v\xE0 b\u1EE5i tuy\u1EC7t \u0111\u1ED1i" }
    ],
    highlights: [
      "Kh\xF4ng t\u1ED1n 1 \u0111\u1ED3ng ti\u1EC1n \u0111i\u1EC7n trong su\u1ED1t v\xF2ng \u0111\u1EDDi s\u1EA3n ph\u1EA9m",
      "Th\xE2n \u0111\xE8n nh\xF4m \u0111\xFAc nguy\xEAn kh\u1ED1i t\u1EA3n nhi\u1EC7t tuy\u1EC7t v\u1EDDi ch\u1ED1ng oxy h\xF3a",
      "K\xE8m remote \u0111i\u1EC1u khi\u1EC3n t\u1EEB xa h\u1EB9n gi\u1EDD v\xE0 t\u0103ng gi\u1EA3m \u0111\u1ED9 s\xE1ng"
    ],
    applications: [
      "Chi\u1EBFu s\xE1ng \u0111\u01B0\u1EDDng giao th\xF4ng n\xF4ng th\xF4n m\u1EDBi, \u0111\u01B0\u1EDDng li\xEAn \u1EA5p, li\xEAn th\xF4n",
      "\u0110\u01B0\u1EDDng n\u1ED9i b\u1ED9 nh\xE0 m\xE1y, khu c\xF4ng nghi\u1EC7p, kho b\xE3i ngo\xE0i tr\u1EDDi",
      "Khu ngh\u1EC9 d\u01B0\u1EE1ng, homestay, bi\u1EC7t th\u1EF1 s\xE2n v\u01B0\u1EDDn"
    ]
  },
  {
    id: "prod-20",
    sku: "DVS-LGT-JD-300W",
    name: "\u0110\xE8n Pha N\u0103ng L\u01B0\u1EE3ng M\u1EB7t Tr\u1EDDi Jindian JD-8300L 300W T\u1EA5m Pin R\u1EDDi",
    category: "solar-lights",
    brand: "Jindian Solar",
    shortDesc: "\u0110\xE8n pha n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi t\u1EA5m pin r\u1EDDi k\xEDch th\u01B0\u1EDBc l\u1EDBn, v\u1ECF nh\xF4m \u0111\xFAc, b\xE1o dung l\u01B0\u1EE3ng pin tr\xEAn m\u1EB7t \u0111\xE8n.",
    fullDesc: "\u0110\xE8n pha Jindian 300W JD-8300L v\u1EDBi t\u1EA5m pin r\u1EDDi d\xE2y d\xE0i 5m cho ph\xE9p l\u1EAFp \u0111\u1EB7t \u0111\xE8n \u1EDF trong nh\xE0 x\u01B0\u1EDFng, m\xE1i hi\xEAn, s\xE2n v\u01B0\u1EDDn trong khi t\u1EA5m pin \u0111\u1EB7t tr\xEAn m\xE1i \u0111\xF3n n\u1EAFng t\u1ED1i \u0111a.",
    stock: 85,
    unit: "b\u1ED9",
    featured: false,
    svgType: "streetlight",
    origin: "Jindian Ch\xEDnh H\xE3ng",
    warrantyYears: 2,
    status: "in-stock",
    updatedAt: "2026-11-03",
    specs: [
      { label: "C\xF4ng su\u1EA5t chi\u1EBFu s\xE1ng", value: "300 W (Di\u1EC7n t\xEDch s\xE1ng ~300m\xB2)" },
      { label: "Pin l\u01B0u tr\u1EEF", value: "Lithium LiFePO4 40.000mAh" },
      { label: "T\u1EA5m pin r\u1EDDi", value: "Polycrystalline 6V / 45W" },
      { label: "Th\u1EDDi gian chi\u1EBFu s\xE1ng", value: "12 - 15 gi\u1EDD li\xEAn t\u1EE5c" },
      { label: "Chu\u1EA9n ch\u1ED1ng n\u01B0\u1EDBc", value: "IP67" }
    ],
    highlights: [
      "D\xE2y n\u1ED1i d\xE0i 5m linh ho\u1EA1t l\u1EAFp \u0111\xE8n trong nh\xE0 ho\u1EB7c d\u01B0\u1EDBi m\xE1i hi\xEAn",
      "K\xEDnh c\u01B0\u1EDDng l\u1EF1c ch\u1ED1ng va \u0111\u1EADp, khung nh\xF4m t\u1EA3n nhi\u1EC7t r\xE3nh s\xE2u",
      "T\u1EF1 \u0111\u1ED9ng b\u1EADt khi tr\u1EDDi t\u1ED1i, t\u1EF1 \u0111\u1ED9ng t\u1EAFt v\xE0 s\u1EA1c khi tr\u1EDDi s\xE1ng"
    ],
    applications: [
      "Chi\u1EBFu s\xE1ng s\xE2n v\u01B0\u1EDDn, kho b\xE3i, chu\u1ED3ng tr\u1EA1i, nh\xE0 x\u01B0\u1EDFng",
      "\u0110\xE8n b\u1EA3o v\u1EC7 an ninh ban \u0111\xEAm cho gia \u0111\xECnh"
    ]
  }
];
var INITIAL_PROJECTS = [
  {
    id: "proj-01",
    title: "H\u1EC7 Th\u1ED1ng \u0110i\u1EC7n M\u1EB7t Tr\u1EDDi \xC1p M\xE1i 15kWp Gia \u0110\xECnh Bi\u1EC7t Th\u1EF1 H\xF3c M\xF4n",
    category: "residential",
    capacity: "15 kWp",
    location: "\u0110\xF4ng Th\u1EA1nh, Huy\u1EC7n H\xF3c M\xF4n, TP. H\u1ED3 Ch\xED Minh",
    completionDate: "Th\xE1ng 08/2026",
    estimatedSaving: "Gi\u1EA3m 75% h\xF3a \u0111\u01A1n ti\u1EC1n \u0111i\u1EC7n (Ti\u1EBFt ki\u1EC7m ~4.2 tri\u1EC7u VN\u0110/th\xE1ng)",
    description: "Thi c\xF4ng tr\u1ECDn g\xF3i h\u1EC7 th\u1ED1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi h\xF2a l\u01B0\u1EDBi c\xF3 l\u01B0u tr\u1EEF Hybrid cho gia \u0111\xECnh s\u1EED d\u1EE5ng nhi\u1EC1u m\xE1y l\u1EA1nh v\xE0 thi\u1EBFt b\u1ECB \u0111i\u1EC7n gia d\u1EE5ng. H\u1EC7 th\u1ED1ng ho\u1EA1t \u0111\u1ED9ng ho\xE0n to\xE0n t\u1EF1 \u0111\u1ED9ng, c\u1EA5p \u0111i\u1EC7n li\xEAn t\u1EE5c khi c\xF3 s\u1EF1 c\u1ED1 c\xFAp \u0111i\u1EC7n l\u01B0\u1EDBi.",
    keyEquipment: [
      "26 t\u1EA5m pin Longi Hi-MO 6 580W",
      "01 Inverter Hybrid Deye 12kW 3 Pha",
      "02 Pin l\u01B0u tr\u1EEF Lithium Dyness 5.12kWh (T\u1ED5ng 10.24kWh)",
      "H\u1EC7 th\u1ED1ng khung gi\xE0n nh\xF4m Anode chuy\xEAn d\u1EE5ng ch\u1ED1ng \u0103n m\xF2n"
    ],
    svgType: "rooftop"
  },
  {
    id: "proj-02",
    title: "D\u1EF1 \xC1n \u0110i\u1EC7n M\u1EB7t Tr\u1EDDi & Thi\u1EBFt B\u1ECB Ti\u1EBFt Ki\u1EC7m \u0110i\u1EC7n Nh\xE0 X\u01B0\u1EDFng Bao B\xEC 120kWp",
    category: "commercial",
    capacity: "120 kWp + Ti\u1EBFt ki\u1EC7m \u0111i\u1EC7n 18%",
    location: "KCN Nh\u1ECB Xu\xE2n, H\xF3c M\xF4n, TP. H\u1ED3 Ch\xED Minh",
    completionDate: "Th\xE1ng 05/2026",
    estimatedSaving: "Ti\u1EBFt ki\u1EC7m ~38 tri\u1EC7u VN\u0110 ti\u1EC1n \u0111i\u1EC7n/th\xE1ng, ho\xE0n v\u1ED1n ch\u1EC9 sau 3.8 n\u0103m",
    description: "K\u1EBFt h\u1EE3p gi\u1EA3i ph\xE1p l\u1EAFp \u0111\u1EB7t t\u1EA5m pin quang \u0111i\u1EC7n \xE1p m\xE1i t\xF4n nh\xE0 x\u01B0\u1EDFng 120kWp c\xF9ng b\u1ED9 t\u1ED1i \u01B0u h\xF3a n\u0103ng l\u01B0\u1EE3ng PowerSaver Pro 50kVA cho h\u1EC7 th\u1ED1ng \u0111\u1ED9ng c\u01A1 k\xE9o v\xE0 m\xE1y th\u1ED5i m\xE0ng bao b\xEC.",
    keyEquipment: [
      "200 t\u1EA5m pin Jinko Tiger Neo N-Type 600W",
      "02 Bi\u1EBFn t\u1EA7n h\xF2a l\u01B0\u1EDBi Sungrow 50kW",
      "02 B\u1ED9 ti\u1EBFt ki\u1EC7m \u0111i\u1EC7n PowerSaver Pro 50kVA",
      "T\u1EE7 \u0111i\u1EC7n \u0111\xF3ng c\u1EAFt b\u1EA3o v\u1EC7 ATS v\xE0 ch\u1ED1ng s\xE9t lan truy\u1EC1n Type II"
    ],
    svgType: "factory"
  },
  {
    id: "proj-03",
    title: "H\u1EC7 Th\u1ED1ng \u0110i\u1EC7n M\u1EB7t Tr\u1EDDi Hybrid \u0110\u1ED9c L\u1EADp Cho Khu Ngh\u1EC9 D\u01B0\u1EE1ng Sinh Th\xE1i",
    category: "hybrid",
    capacity: "30 kWp + 40kWh L\u01B0u Tr\u1EEF",
    location: "C\u1EE7 Chi, TP. H\u1ED3 Ch\xED Minh",
    completionDate: "Th\xE1ng 03/2026",
    estimatedSaving: "T\u1EF1 ch\u1EE7 95% nhu c\u1EA7u \u0111i\u1EC7n n\u0103ng to\xE0n b\u1ED9 khu ngh\u1EC9 d\u01B0\u1EE1ng",
    description: "Cung c\u1EA5p n\u0103ng l\u01B0\u1EE3ng xanh li\xEAn t\u1EE5c ph\u1EE5c v\u1EE5 chi\u1EBFu s\xE1ng c\u1EA3nh quan, h\u1EC7 th\u1ED1ng t\u01B0\u1EDBi c\xE2y t\u1EF1 \u0111\u1ED9ng, h\u1ED3 b\u01A1i v\xE0 khu nh\xE0 h\xE0ng homestay v\u1EDBi \u0111\u1ED9 tin c\u1EADy tuy\u1EC7t \u0111\u1ED1i.",
    keyEquipment: [
      "50 t\u1EA5m pin Canadian Solar 575W",
      "02 Inverter Hybrid SolaX X3-Ultra 15kW song song",
      "04 Kh\u1ED1i pin l\u01B0u tr\u1EEF lithium treo t\u01B0\u1EDDng 10kWh",
      "H\u1EC7 th\u1ED1ng gi\xE1m s\xE1t \u0111i\u1EC1u khi\u1EC3n t\u1EEB xa qua 4G"
    ],
    svgType: "villa"
  },
  {
    id: "proj-04",
    title: "C\xF4ng Tr\xECnh L\u1EAFp \u0110\u1EB7t 150 B\u1ED9 \u0110\xE8n \u0110\u01B0\u1EDDng N\u0103ng L\u01B0\u1EE3ng M\u1EB7t Tr\u1EDDi N\xF4ng Th\xF4n M\u1EDBi",
    category: "lighting",
    capacity: "150 B\u1ED9 \u0110\xE8n 400W IP67",
    location: "Tuy\u1EBFn \u0111\u01B0\u1EDDng li\xEAn \u1EA5p X\xE3 Th\u1EDBi Tam Th\xF4n & \u0110\xF4ng Th\u1EA1nh, H\xF3c M\xF4n",
    completionDate: "Th\xE1ng 09/2026",
    estimatedSaving: "0 \u0111\u1ED3ng ti\u1EC1n \u0111i\u1EC7n h\xE0ng th\xE1ng, an to\xE0n chi\u1EBFu s\xE1ng 100% c\xE1c tuy\u1EBFn \u0111\u01B0\u1EDDng",
    description: "D\u1EF1 \xE1n th\u1EAFp s\xE1ng \u0111\u01B0\u1EDDng qu\xEA ph\u1ED1i h\u1EE3p c\xF9ng ch\xEDnh quy\u1EC1n \u0111\u1ECBa ph\u01B0\u01A1ng, mang \xE1nh s\xE1ng v\u0103n minh v\xE0 an to\xE0n giao th\xF4ng cho b\xE0 con nh\xE2n d\xE2n m\xE0 kh\xF4ng t\u1ED1n chi ph\xED k\xE9o d\xE2y \u0111i\u1EC7n ph\u1EE9c t\u1EA1p.",
    keyEquipment: [
      "150 b\u1ED9 \u0111\xE8n \u0111\u01B0\u1EDDng n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi li\u1EC1n th\u1EC3 \u0110\u1EE9c Vinh 400W",
      "Tr\u1EE5 \u0111\xE8n th\xE9p m\u1EA1 k\u1EBDm nh\xFAng n\xF3ng cao 6 m\xE9t",
      "B\u1EA3o h\xE0nh ch\xEDnh h\xE3ng 3 n\u0103m t\u1EADn n\u01A1i"
    ],
    svgType: "street"
  }
];
var INITIAL_BLOG_POSTS = [
  {
    id: "blog-01",
    title: "Kinh Nghi\u1EC7m Ch\u1ECDn L\u1EAFp \u0110i\u1EC7n M\u1EB7t Tr\u1EDDi C\xF3 L\u01B0u Tr\u1EEF (Hybrid) Cho H\u1ED9 Gia \u0110\xECnh N\u0103m 2026",
    category: "Kinh Nghi\u1EC7m \u0110i\u1EC7n M\u1EB7t Tr\u1EDDi",
    author: "K\u1EF9 S\u01B0 \u0110\u1EE9c Vinh Solar",
    publishedAt: "02/11/2026",
    readTime: "5 ph\xFAt \u0111\u1ECDc",
    summary: "H\u01B0\u1EDBng d\u1EABn chi ti\u1EBFt c\xE1ch t\xEDnh to\xE1n c\xF4ng su\u1EA5t t\u1EA5m pin v\xE0 dung l\u01B0\u1EE3ng pin l\u01B0u tr\u1EEF Lithium (5kWh - 15kWh) gi\xFAp gia \u0111\xECnh c\u1EAFt gi\u1EA3m 70-90% ti\u1EC1n \u0111i\u1EC7n b\u1EADc thang cao v\xE0 kh\xF4ng lo c\xFAp \u0111i\u1EC7n.",
    content: `H\u1EC7 th\u1ED1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi Hybrid (h\xF2a l\u01B0\u1EDBi c\xF3 l\u01B0u tr\u1EEF) \u0111ang tr\u1EDF th\xE0nh l\u1EF1a ch\u1ECDn h\xE0ng \u0111\u1EA7u c\u1EE7a c\xE1c h\u1ED9 gia \u0111\xECnh v\xE0 bi\u1EC7t th\u1EF1 t\u1EA1i TP. H\u1ED3 Ch\xED Minh c\u0169ng nh\u01B0 c\xE1c t\u1EC9nh ph\xEDa Nam nh\u1EDD kh\u1EA3 n\u0103ng v\u1EADn h\xE0nh th\xF4ng minh c\u1EA3 ng\xE0y l\u1EABn \u0111\xEAm.

1. Khi n\xE0o gia \u0111\xECnh n\xEAn l\u1EAFp h\u1EC7 th\u1ED1ng Hybrid thay v\xEC H\xF2a l\u01B0\u1EDBi b\xE1m t\u1EA3i th\xF4ng th\u01B0\u1EDDng?
- Gia \u0111\xECnh c\xF3 h\xF3a \u0111\u01A1n ti\u1EC1n \u0111i\u1EC7n t\u1EEB 2.500.000\u0111 - 10.000.000\u0111/th\xE1ng v\xE0 s\u1EED d\u1EE5ng nhi\u1EC1u thi\u1EBFt b\u1ECB v\xE0o bu\u1ED5i t\u1ED1i (m\xE1y l\u1EA1nh, b\u1EBFp t\u1EEB, b\xECnh n\u01B0\u1EDBc n\xF3ng).
- Khu v\u1EF1c c\u1EA7n ngu\u1ED3n \u0111i\u1EC7n d\u1EF1 ph\xF2ng li\xEAn t\u1EE5c cho camera an ninh, wifi, c\u1EEDa cu\u1ED1n, t\u1EE7 l\u1EA1nh, h\u1ED3 c\xE1 Koi ho\u1EB7c thi\u1EBFt b\u1ECB y t\u1EBF gia \u0111\xECnh khi l\u01B0\u1EDBi \u0111i\u1EC7n g\u1EB7p s\u1EF1 c\u1ED1.

2. C\u1EA5u h\xECnh v\xE0ng \u0111\u01B0\u1EE3c l\u1EAFp \u0111\u1EB7t nhi\u1EC1u nh\u1EA5t t\u1EA1i \u0110\u1EE9c Vinh Solar:
- G\xF3i 6kWp + L\u01B0u tr\u1EEF 5.12kWh: Ph\xF9 h\u1EE3p gia \u0111\xECnh d\xF9ng 2-3 tri\u1EC7u ti\u1EC1n \u0111i\u1EC7n/th\xE1ng. G\u1ED3m 10-11 t\u1EA5m pin N-Type 580W, 01 bi\u1EBFn t\u1EA7n Hybrid 6kW (Deye / SolaX / Luxpower) v\xE0 01 pack pin Lithium LiFePO4 5.12kWh.
- G\xF3i 10kWp - 12kWp + L\u01B0u tr\u1EEF 10.24kWh - 15kWh: Ph\xF9 h\u1EE3p nh\xE0 ph\u1ED1 l\u1EDBn, bi\u1EC7t th\u1EF1 d\xF9ng 4-8 tri\u1EC7u ti\u1EC1n \u0111i\u1EC7n/th\xE1ng, cho ph\xE9p ch\u1EA1y c\u1EA3 \u0111i\u1EC1u h\xF2a inverter ban \u0111\xEAm b\u1EB1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi t\xEDch tr\u1EEF.

3. L\u01B0u \xFD k\u1EF9 thu\u1EADt quan tr\u1ECDng khi ch\u1ECDn thi\u1EBFt b\u1ECB:
- \u01AFu ti\xEAn t\u1EA5m pin c\xF4ng ngh\u1EC7 N-Type TOPCon (Longi, Jinko, Canadian, AE Solar) c\xF3 hi\u1EC7u su\u1EA5t >22.5%, gi\u1EA3m suy hao hi\u1EC7u su\u1EA5t theo th\u1EDDi gian.
- Ch\u1EC9 s\u1EED d\u1EE5ng pin l\u01B0u tr\u1EEF cell LiFePO4 chu\u1EA9n Grade A c\xF3 giao ti\u1EBFp CAN/RS485 \u0111\u1ED3ng b\u1ED9 tr\u1EF1c ti\u1EBFp v\u1EDBi Inverter \u0111\u1EC3 b\u1EA3o v\u1EC7 tu\u1ED5i th\u1ECD tr\xEAn 6.000 chu k\u1EF3 s\u1EA1c x\u1EA3 (t\u01B0\u01A1ng \u0111\u01B0\u01A1ng 12-15 n\u0103m).`,
    tags: ["\u0110i\u1EC7n m\u1EB7t tr\u1EDDi Hybrid", "Pin l\u01B0u tr\u1EEF Lithium", "Ti\u1EBFt ki\u1EC7m \u0111i\u1EC7n gia \u0111\xECnh"]
  },
  {
    id: "blog-02",
    title: "So S\xE1nh Bi\u1EBFn T\u1EA7n Hybrid Deye, SolaX V\xE0 Luxpower: N\xEAn Ch\u1ECDn H\xE3ng N\xE0o?",
    category: "K\u1EF9 Thu\u1EADt & L\u1EAFp \u0110\u1EB7t",
    author: "Ph\xF2ng K\u1EF9 Thu\u1EADt \u0110\u1EE9c Vinh Solar",
    publishedAt: "28/10/2026",
    readTime: "6 ph\xFAt \u0111\u1ECDc",
    summary: "\u0110\xE1nh gi\xE1 kh\xE1ch quan \u01B0u nh\u01B0\u1EE3c \u0111i\u1EC3m th\u1EF1c t\u1EBF c\u1EE7a 3 d\xF2ng Inverter Hybrid ph\u1ED5 bi\u1EBFn nh\u1EA5t th\u1ECB tr\u01B0\u1EDDng v\u1EC1 \u0111\u1ED9 b\u1EC1n, kh\u1EA3 n\u0103ng ch\u1ECBu t\u1EA3i l\u1EC7ch pha v\xE0 ch\u1EBF \u0111\u1ED9 b\u1EA3o h\xE0nh ch\xEDnh h\xE3ng.",
    content: `Trong ph\xE2n kh\xFAc bi\u1EBFn t\u1EA7n Hybrid d\xE2n d\u1EE5ng v\xE0 th\u01B0\u01A1ng m\u1EA1i v\u1EEBa, Deye, SolaX v\xE0 Luxpower l\xE0 3 th\u01B0\u01A1ng hi\u1EC7u \u0111\u01B0\u1EE3c kh\xE1ch h\xE0ng t\u1EA1i Kho T\u1ED5ng \u0110\u1EE9c Vinh Solar quan t\xE2m nhi\u1EC1u nh\u1EA5t. D\u01B0\u1EDBi \u0111\xE2y l\xE0 g\xF3c nh\xECn k\u1EF9 thu\u1EADt th\u1EF1c t\u1EBF sau h\xE0ng tr\u0103m c\xF4ng tr\xECnh:

1. Bi\u1EBFn t\u1EA7n Hybrid Deye (1 Pha & 3 Pha \xC1p Th\u1EA5p / \xC1p Cao):
- \u01AFu \u0111i\u1EC3m n\u1ED5i b\u1EADt: T\u1EA3n nhi\u1EC7t nh\xF4m \u0111\xFAc d\xE0y d\u1EB7n, d\xF2ng s\u1EA1c x\u1EA3 \u1EAFc quy l\u1EDBn, \u0111\u1EB7c bi\u1EC7t d\xF2ng 3 pha 10kW - 50kW h\u1ED7 tr\u1EE3 ch\u1EA1y l\u1EC7ch pha 100% (m\u1ED7i pha c\xF3 th\u1EC3 g\xE1nh t\u1EDBi 50% c\xF4ng su\u1EA5t \u0111\u1ECBnh m\u1EE9c), c\u1EF1c k\u1EF3 ph\xF9 h\u1EE3p v\u1EDBi th\xF3i quen d\xF9ng \u0111i\u1EC7n l\u1EC7ch pha t\u1EA1i Vi\u1EC7t Nam.
- T\u01B0\u01A1ng th\xEDch: K\u1EBFt n\u1ED1i m\u01B0\u1EE3t m\xE0 v\u1EDBi h\u1EA7u h\u1EBFt c\xE1c h\xE3ng pin Lithium tr\xEAn th\u1ECB tr\u01B0\u1EDDng (Dyness, Pylontech, SolaX, Gigabox...).

2. Bi\u1EBFn t\u1EA7n SolaX Power (X1-Hybrid & X3-Ultra):
- \u01AFu \u0111i\u1EC3m n\u1ED5i b\u1EADt: Th\u01B0\u01A1ng hi\u1EC7u cao c\u1EA5p chu\u1EA9n ch\xE2u \xC2u/\xDAc, thi\u1EBFt k\u1EBF t\u1ED1i gi\u1EA3n sang tr\u1ECDng, hi\u1EC7u su\u1EA5t chuy\u1EC3n \u0111\u1ED5i c\u1EF1c cao (l\xEAn t\u1EDBi 98.5%), v\u1EADn h\xE0nh si\xEAu \xEAm kh\xF4ng ti\u1EBFng \u1ED3n qu\u1EA1t l\u1EDBn.
- Ph\xF9 h\u1EE3p: Bi\u1EC7t th\u1EF1 cao c\u1EA5p, v\u0103n ph\xF2ng c\xF4ng ty y\xEAu c\u1EA7u \u0111\u1ED9 \u1ED5n \u0111\u1ECBnh tuy\u1EC7t \u0111\u1ED1i v\xE0 h\u1EC7 sinh th\xE1i \u0111\u1ED3ng b\u1ED9 SolaX Triple Power.

3. Bi\u1EBFn t\u1EA7n Luxpower (SNA & LXP):
- \u01AFu \u0111i\u1EC3m n\u1ED5i b\u1EADt: Ph\u1EA7n m\u1EC1m gi\xE1m s\xE1t ti\u1EBFng Vi\u1EC7t c\u1EF1c k\u1EF3 tr\u1EF1c quan, c\xE0i \u0111\u1EB7t linh ho\u1EA1t nhi\u1EC1u ch\u1EBF \u0111\u1ED9 s\u1EA1c x\u1EA3 theo khung gi\u1EDD cao \u0111i\u1EC3m/th\u1EA5p \u0111i\u1EC3m, chi ph\xED \u0111\u1EA7u t\u01B0 r\u1EA5t h\u1EE3p l\xFD.
- Ph\xF9 h\u1EE3p: H\u1ED9 gia \u0111\xECnh mu\u1ED1n t\u1ED1i \u01B0u chi ph\xED \u0111\u1EA7u t\u01B0 ban \u0111\u1EA7u nh\u01B0ng v\u1EABn \u0111\u1EA7y \u0111\u1EE7 t\xEDnh n\u0103ng l\u01B0u tr\u1EEF v\xE0 ch\u1EA1y \u0111\u1ED9c l\u1EADp khi m\u1EA5t \u0111i\u1EC7n.`,
    tags: ["Inverter Deye", "Inverter SolaX", "Luxpower", "So s\xE1nh bi\u1EBFn t\u1EA7n"]
  },
  {
    id: "blog-03",
    title: "Gi\u1EA3i Ph\xE1p Gi\u1EA3m Chi Ph\xED Ti\u1EC1n \u0110i\u1EC7n Gi\u1EDD Cao \u0110i\u1EC3m Cho Nh\xE0 X\u01B0\u1EDFng & Kho L\u1EA1nh",
    category: "Gi\u1EA3i Ph\xE1p Ti\u1EBFt Ki\u1EC7m \u0110i\u1EC7n",
    author: "K\u1EF9 S\u01B0 \u0110\u1EE9c Vinh Solar",
    publishedAt: "20/10/2026",
    readTime: "5 ph\xFAt \u0111\u1ECDc",
    summary: "B\xE0i to\xE1n k\u1EBFt h\u1EE3p \u0111i\u1EC7n m\u1EB7t tr\u1EDDi \xE1p m\xE1i nh\xE0 x\u01B0\u1EDFng C&I c\xF9ng h\u1EC7 th\u1ED1ng l\u01B0u tr\u1EEF BESS gi\xFAp doanh nghi\u1EC7p c\u1EAFt \u0111\u1EC9nh ph\u1EE5 t\u1EA3i gi\u1EDD cao \u0111i\u1EC3m v\xE0 ho\xE0n v\u1ED1n ch\u1EC9 sau 3 - 3.8 n\u0103m.",
    content: `\u0110\u1ED1i v\u1EDBi c\xE1c nh\xE0 x\u01B0\u1EDFng s\u1EA3n xu\u1EA5t nh\u1EF1a, bao b\xEC, c\u01A1 kh\xED, may m\u1EB7c v\xE0 kho l\u1EA1nh b\u1EA3o qu\u1EA3n, chi ph\xED ti\u1EC1n \u0111i\u1EC7n gi\u1EDD cao \u0111i\u1EC3m (9h30 - 11h30 v\xE0 17h00 - 20h00) chi\u1EBFm t\u1EF7 tr\u1ECDng r\u1EA5t l\u1EDBn trong gi\xE1 th\xE0nh s\u1EA3n xu\u1EA5t.

1. T\u1EADn d\u1EE5ng m\xE1i t\xF4n nh\xE0 x\u01B0\u1EDFng l\xE0m "nh\xE0 m\xE1y ph\xE1t \u0111i\u1EC7n" t\u1EA1i ch\u1ED7:
- Khung gi\u1EDD n\u1EAFng \u0111\u1EC9nh \u0111i\u1EC3m t\u1EEB 9h00 - 15h00 tr\xF9ng kh\u1EDBp ho\xE0n to\xE0n v\u1EDBi ca s\u1EA3n xu\u1EA5t ban ng\xE0y v\xE0 khung gi\u1EDD cao \u0111i\u1EC3m tr\u01B0a c\u1EE7a bi\u1EC3u gi\xE1 \u0111i\u1EC7n s\u1EA3n xu\u1EA5t/kinh doanh.
- M\u1ED7i 100kWp \u0111i\u1EC7n m\u1EB7t tr\u1EDDi \xE1p m\xE1i nh\xE0 x\u01B0\u1EDFng t\u1EA1i khu v\u1EF1c TP.HCM, B\xECnh D\u01B0\u01A1ng, Long An, \u0110\u1ED3ng Nai t\u1EA1o ra trung b\xECnh 12.000 - 13.500 kWh/th\xE1ng, gi\xFAp doanh nghi\u1EC7p ti\u1EBFt ki\u1EC7m ngay 35 - 45 tri\u1EC7u \u0111\u1ED3ng m\u1ED7i th\xE1ng.

2. K\u1EBFt h\u1EE3p BESS (L\u01B0u tr\u1EEF n\u0103ng l\u01B0\u1EE3ng th\u01B0\u01A1ng m\u1EA1i) \u0111\u1EC3 x\xF3a khung gi\u1EDD cao \u0111i\u1EC3m chi\u1EC1u t\u1ED1i:
- H\u1EC7 th\u1ED1ng Inverter Hybrid c\xF4ng nghi\u1EC7p k\u1EBFt h\u1EE3p t\u1EE7 pin l\u01B0u tr\u1EEF \xE1p cao (HV Battery) cho ph\xE9p n\u1EA1p \u0111i\u1EC7n m\u1EB7t tr\u1EDDi d\u01B0 th\u1EEBa ho\u1EB7c \u0111i\u1EC7n gi\u1EDD th\u1EA5p \u0111i\u1EC3m ban \u0111\xEAm, sau \u0111\xF3 x\u1EA3 ra c\u1EA5p cho nh\xE0 m\xE1y v\xE0o khung gi\u1EDD cao \u0111i\u1EC3m chi\u1EC1u (17h00 - 20h00).
- \u0110\u1ED3ng th\u1EDDi, l\u1EDBp t\u1EA5m pin m\u1EB7t tr\u1EDDi che ph\u1EE7 tr\xEAn m\xE1i gi\xFAp gi\u1EA3m nhi\u1EC7t \u0111\u1ED9 nh\xE0 x\u01B0\u1EDFng t\u1EEB 4 - 6 \u0111\u1ED9 C, gi\u1EA3m t\u1EA3i \u0111\xE1ng k\u1EC3 cho h\u1EC7 th\u1ED1ng th\xF4ng gi\xF3 v\xE0 m\xE1y l\xE0m m\xE1t.`,
    tags: ["\u0110i\u1EC7n m\u1EB7t tr\u1EDDi nh\xE0 x\u01B0\u1EDFng", "Ti\u1EBFt ki\u1EC7m \u0111i\u1EC7n c\xF4ng nghi\u1EC7p", "BESS"]
  },
  {
    id: "blog-04",
    title: "Ti\xEAu Chu\u1EA9n K\u1EF9 Thu\u1EADt Khi Thi C\xF4ng Khung Gi\xE0n Nh\xF4m & Ch\u1ED1ng Th\u1EA5m M\xE1i T\xF4n, M\xE1i Ng\xF3i",
    category: "K\u1EF9 Thu\u1EADt & L\u1EAFp \u0110\u1EB7t",
    author: "\u0110\u1ED9i Thi C\xF4ng \u0110\u1EE9c Vinh Solar",
    publishedAt: "12/10/2026",
    readTime: "4 ph\xFAt \u0111\u1ECDc",
    summary: "Quy tr\xECnh 5 b\u01B0\u1EDBc l\u1EAFp \u0111\u1EB7t khung ray nh\xF4m Anode AL6005-T5, k\u1EB9p bi\xEAn, k\u1EB9p gi\u1EEFa v\xE0 x\u1EED l\xFD ch\u1ED1ng d\u1ED9t tuy\u1EC7t \u0111\u1ED1i gi\xFAp h\u1EC7 th\u1ED1ng b\u1EC1n v\u1EEFng tr\xEAn 25 n\u0103m tr\u01B0\u1EDBc gi\xF4ng b\xE3o.",
    content: `M\u1ED9t h\u1EC7 th\u1ED1ng \u0111i\u1EC7n m\u1EB7t tr\u1EDDi c\xF3 tu\u1ED5i th\u1ECD t\u1EA5m pin l\xEAn t\u1EDBi 25 - 30 n\u0103m, v\xEC v\u1EADy ch\u1EA5t l\u01B0\u1EE3ng v\u1EADt t\u01B0 ph\u1EE5 ki\u1EC7n c\u01A1 kh\xED v\xE0 k\u1EF9 thu\u1EADt thi c\xF4ng tr\xEAn m\xE1i \u0111\xF3ng vai tr\xF2 quy\u1EBFt \u0111\u1ECBnh \u0111\u1EBFn s\u1EF1 an to\xE0n l\xE2u d\xE0i c\u1EE7a ng\xF4i nh\xE0.

1. Tuy\u1EC7t \u0111\u1ED1i s\u1EED d\u1EE5ng h\u1EC7 thanh ray nh\xF4m h\u1EE3p kim AL6005-T5 Anode h\xF3a:
- Kh\xF4ng s\u1EED d\u1EE5ng s\u1EAFt h\u1ED9p m\u1EA1 k\u1EBDm m\u1ECFng d\u1EC5 r\u1EC9 s\xE9t sau v\xE0i m\xF9a m\u01B0a n\u1EAFng.
- Thanh ray nh\xF4m chuy\xEAn d\u1EE5ng Solar c\xF9ng ph\u1EE5 ki\u1EC7n bulong Inox 304 ch\u1ED1ng \u0103n m\xF2n ho\xE0n to\xE0n, ch\u1ECBu \u0111\u01B0\u1EE3c s\u1EE9c gi\xF3 gi\u1EADt c\u1EA5p 12.

2. K\u1EF9 thu\u1EADt ch\u1ED1ng th\u1EA5m m\xE1i t\xF4n v\xE0 m\xE1i ng\xF3i t\u1EA1i \u0110\u1EE9c Vinh Solar:
- \u0110\u1ED1i v\u1EDBi m\xE1i t\xF4n: S\u1EED d\u1EE5ng ch\xE2n \u0111\u1EE1 ch\u1EEF L chuy\xEAn d\u1EE5ng c\xF3 \u0111\u1EC7m cao su EPDM ch\u1ECBu nhi\u1EC7t l\xE3o h\xF3a cao, b\u1EAFn v\xEDt v\xE0o \u0111\xFAng s\xF3ng d\u01B0\u01A1ng x\xE0 g\u1ED3 k\u1EBFt h\u1EE3p keo ch\u1ED1ng th\u1EA5m chuy\xEAn d\u1EE5ng ngo\xE0i tr\u1EDDi.
- \u0110\u1ED1i v\u1EDBi m\xE1i ng\xF3i / m\xE1i b\xEA t\xF4ng: S\u1EED d\u1EE5ng m\xF3c ng\xF3i Inox 304 lu\u1ED3n d\u01B0\u1EDBi vi\xEAn ng\xF3i, kh\xF4ng khoan th\u1EE7ng m\u1EB7t ng\xF3i, \u0111\u1EA3m b\u1EA3o th\u1EA9m m\u1EF9 v\xE0 kh\xF4ng g\xE2y n\u1EE9t v\u1EE1 ng\xF3i khi gi\xE3n n\u1EDF nhi\u1EC7t.

3. H\u1EC7 th\u1ED1ng t\u1EE7 \u0111i\u1EC7n DC/AC v\xE0 ti\u1EBFp \u0111\u1ECBa ch\u1ED1ng s\xE9t:
- M\u1ECDi c\xF4ng tr\xECnh \u0111\u1EC1u ph\u1EA3i c\xF3 c\u1ECDc ti\u1EBFp \u0111\u1ECBa \u0111\u1ED3ng chu\u1EA9n \u0111i\u1EC7n tr\u1EDF \u0111\u1EA5t quy \u0111\u1ECBnh, k\u1EBFt h\u1EE3p CB DC, c\u1EA7u ch\xEC DC v\xE0 ch\u1ED1ng s\xE9t lan truy\u1EC1n SPD Type II cho c\u1EA3 ph\xEDa DC v\xE0 AC.`,
    tags: ["K\u1EF9 thu\u1EADt l\u1EAFp \u0111\u1EB7t", "Khung nh\xF4m Solar", "An to\xE0n \u0111i\u1EC7n m\u1EB7t tr\u1EDDi"]
  },
  {
    id: "blog-05",
    title: "C\xE1ch Ch\u1ECDn \u0110\xE8n N\u0103ng L\u01B0\u1EE3ng M\u1EB7t Tr\u1EDDi Ch\xEDnh H\xE3ng: Ph\xE2n Bi\u1EC7t C\xF4ng Su\u1EA5t Th\u1EF1c V\xE0 \u1EA2o",
    category: "Kinh Nghi\u1EC7m \u0110i\u1EC7n M\u1EB7t Tr\u1EDDi",
    author: "K\u1EF9 S\u01B0 \u0110\u1EE9c Vinh Solar",
    publishedAt: "05/10/2026",
    readTime: "4 ph\xFAt \u0111\u1ECDc",
    summary: "M\u1EB9o ki\u1EC3m tra k\xEDch th\u01B0\u1EDBc t\u1EA5m pin s\u1EA1c, dung l\u01B0\u1EE3ng pin l\u01B0u tr\u1EEF LiFePO4 b\xEAn trong v\xE0 chip LED gi\xFAp b\u1EA1n ch\u1ECDn mua \u0111\xE8n \u0111\u01B0\u1EDDng, \u0111\xE8n pha Solar s\xE1ng xuy\xEAn \u0111\xEAm kh\xF4ng b\u1ECB t\u1EAFt s\u1EDBm.",
    content: `Tr\xEAn th\u1ECB tr\u01B0\u1EDDng hi\u1EC7n nay c\xF3 r\u1EA5t nhi\u1EC1u lo\u1EA1i \u0111\xE8n n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi gi\xE1 r\u1EBB ghi c\xF4ng su\u1EA5t 500W, 1000W nh\u01B0ng ch\u1EC9 s\xE1ng \u0111\u01B0\u1EE3c 2-3 ti\u1EBFng \u0111\u1EA7u \u0111\xEAm l\xE0 m\u1EDD d\u1EA7n ho\u1EB7c t\u1EAFt h\u1EB3n. \u0110\u1EE9c Vinh Solar chia s\u1EBB 3 ti\xEAu ch\xED ki\u1EC3m tra th\u1EF1c t\u1EBF:

1. Ki\u1EC3m tra k\xEDch th\u01B0\u1EDBc t\u1EA5m pin n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi \u0111i k\xE8m:
- T\u1EA5m pin l\xE0 b\u1ED9 ph\u1EADn duy nh\u1EA5t thu n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi \u0111\u1EC3 n\u1EA1p v\xE0o \u0111\xE8n. M\u1ED9t b\u1ED9 \u0111\xE8n pha ho\u1EB7c \u0111\xE8n \u0111\u01B0\u1EDDng chu\u1EA9n s\xE1ng nguy\xEAn \u0111\xEAm (10-12 ti\u1EBFng) ph\u1EA3i c\xF3 t\u1EA5m pin Mono ho\u1EB7c Poly k\xEDch th\u01B0\u1EDBc \u0111\u1EE7 l\u1EDBn (t\u1ED1i thi\u1EC3u t\u1EEB 35W - 60W th\u1EF1c cho \u0111\xE8n c\xF4ng tr\xECnh).

2. Ki\u1EC3m tra dung l\u01B0\u1EE3ng v\xE0 lo\u1EA1i pin l\u01B0u tr\u1EEF b\xEAn trong th\xE2n \u0111\xE8n:
- \u0110\xE8n ch\xEDnh h\xE3ng t\u1EA1i Kho \u0110\u1EE9c Vinh Solar s\u1EED d\u1EE5ng pin Lithium S\u1EAFt Ph\u1ED1t Ph\xE1t (LiFePO4) m\u1EDBi 100% c\xF3 dung l\u01B0\u1EE3ng th\u1EF1c t\u1EEB 30.000mAh - 60.000mAh, tu\u1ED5i th\u1ECD 4-6 n\u0103m, kh\xF4ng ph\u1ED3ng r\u1ED9p.

3. Ch\u1EA5t li\u1EC7u v\u1ECF \u0111\xE8n v\xE0 ti\xEAu chu\u1EA9n ch\u1ED1ng n\u01B0\u1EDBc IP67:
- Ch\u1ECDn th\xE2n \u0111\xE8n b\u1EB1ng nh\xF4m \u0111\xFAc nguy\xEAn kh\u1ED1i c\xF3 r\xE3nh t\u1EA3n nhi\u1EC7t s\xE2u gi\xFAp chip LED SMD/COB kh\xF4ng b\u1ECB gi\u1EA3m \u0111\u1ED9 s\xE1ng (quang th\xF4ng) sau th\u1EDDi gian d\xE0i s\u1EED d\u1EE5ng ngo\xE0i m\u01B0a n\u1EAFng.`,
    tags: ["\u0110\xE8n n\u0103ng l\u01B0\u1EE3ng m\u1EB7t tr\u1EDDi", "\u0110\xE8n \u0111\u01B0\u1EDDng Solar", "M\u1EB9o ch\u1ECDn thi\u1EBFt b\u1ECB"]
  }
];

// src/db/repository.ts
var isPostgresConfigured = () => Boolean(process.env.SQL_HOST);
var getLocalStorePath = () => {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, "ducvinhsolar_db.json");
};
var readLocalDiskStore = () => {
  const filePath = getLocalStorePath();
  if (!fs.existsSync(filePath)) {
    const initial = {
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      products: INITIAL_PRODUCTS,
      projects: INITIAL_PROJECTS,
      blogPosts: INITIAL_BLOG_POSTS,
      inquiries: [],
      companyInfo: INITIAL_COMPANY_INFO
    };
    fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : INITIAL_CATEGORIES,
      brands: Array.isArray(parsed.brands) && parsed.brands.length > 0 ? parsed.brands : INITIAL_BRANDS,
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
      projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : INITIAL_PROJECTS,
      blogPosts: Array.isArray(parsed.blogPosts) && parsed.blogPosts.length > 0 ? parsed.blogPosts : INITIAL_BLOG_POSTS,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      companyInfo: parsed.companyInfo ? { ...INITIAL_COMPANY_INFO, ...parsed.companyInfo } : INITIAL_COMPANY_INFO
    };
  } catch {
    return {
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      products: INITIAL_PRODUCTS,
      projects: INITIAL_PROJECTS,
      blogPosts: INITIAL_BLOG_POSTS,
      inquiries: [],
      companyInfo: INITIAL_COMPANY_INFO
    };
  }
};
var writeLocalDiskStore = (store) => {
  const filePath = getLocalStorePath();
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2), "utf-8");
};
var safeParseJsonArray = (raw, fallback = []) => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};
async function getAllCatalogState() {
  if (!isPostgresConfigured()) {
    return readLocalDiskStore();
  }
  try {
    let catRows = await db.select().from(categories);
    if (catRows.length === 0) {
      await seedInitialPostgresData();
      catRows = await db.select().from(categories);
    }
    const [brandRows, productRows, projectRows, blogRows, inquiryRows, companyRows] = await Promise.all([
      db.select().from(brands),
      db.select().from(products),
      db.select().from(projects),
      db.select().from(blogPosts),
      db.select().from(inquiries),
      db.select().from(companySettings)
    ]);
    const mappedCategories = catRows.map((r) => ({
      id: r.id,
      label: r.label,
      shortLabel: r.shortLabel,
      desc: r.desc,
      iconName: r.iconName
    }));
    const mappedBrands = brandRows.map((r) => ({
      id: r.id,
      name: r.name,
      categoryId: r.categoryId,
      origin: r.origin
    }));
    const mappedProducts = productRows.map((r) => ({
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
      imageUrl: r.imageUrl || void 0,
      images: safeParseJsonArray(r.imagesJson, r.imageUrl ? [r.imageUrl] : []),
      svgType: r.svgType,
      specs: safeParseJsonArray(r.specsJson, []),
      highlights: safeParseJsonArray(r.highlightsJson, []),
      applications: safeParseJsonArray(r.applicationsJson, []),
      warrantyYears: r.warrantyYears,
      origin: r.origin,
      status: r.status,
      updatedAt: r.updatedAt
    }));
    const mappedProjects = projectRows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      capacity: r.capacity,
      location: r.location,
      completionDate: r.completionDate,
      estimatedSaving: r.estimatedSaving,
      description: r.description,
      keyEquipment: safeParseJsonArray(r.keyEquipmentJson, []),
      imageUrl: r.imageUrl || void 0,
      images: safeParseJsonArray(r.imagesJson, r.imageUrl ? [r.imageUrl] : []),
      svgType: r.svgType
    }));
    const mappedBlogPosts = blogRows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      author: r.author,
      publishedAt: r.publishedAt,
      readTime: r.readTime,
      summary: r.summary,
      content: r.content,
      tags: safeParseJsonArray(r.tagsJson, []),
      imageUrl: r.imageUrl || void 0,
      images: safeParseJsonArray(r.imagesJson, r.imageUrl ? [r.imageUrl] : [])
    }));
    const mappedInquiries = inquiryRows.map((r) => ({
      id: r.id,
      customerName: r.customerName,
      phone: r.phone,
      address: r.address || void 0,
      productInterest: r.productInterest || void 0,
      note: r.note || void 0,
      createdAt: r.createdAt,
      status: r.status
    }));
    const compRow = companyRows[0];
    const mappedCompanyInfo = compRow ? {
      legalName: compRow.legalName,
      tradeName: compRow.tradeName,
      taxCode: compRow.taxCode,
      taxAddress: compRow.taxAddress,
      officeAddress: compRow.officeAddress,
      warehouseAddress: compRow.warehouseAddress,
      warehouseMapUrl: compRow.warehouseMapUrl,
      status: compRow.status,
      representative: compRow.representative,
      affiliatedUnits: safeParseJsonArray(
        compRow.affiliatedUnitsJson,
        INITIAL_COMPANY_INFO.affiliatedUnits
      ),
      hotlineZalo: compRow.hotlineZalo,
      email: compRow.email,
      workingHours: compRow.workingHours,
      aboutText: compRow.aboutText
    } : INITIAL_COMPANY_INFO;
    return {
      categories: mappedCategories,
      brands: mappedBrands,
      products: mappedProducts,
      projects: mappedProjects,
      blogPosts: mappedBlogPosts,
      inquiries: mappedInquiries,
      companyInfo: mappedCompanyInfo
    };
  } catch (error) {
    console.error("Database query failed in getAllCatalogState:", error);
    throw new Error("Failed to load catalog data from PostgreSQL.", { cause: error });
  }
}
async function seedInitialPostgresData() {
  if (!isPostgresConfigured()) {
    readLocalDiskStore();
    return;
  }
  try {
    for (const c of INITIAL_CATEGORIES) {
      await db.insert(categories).values({
        id: c.id,
        label: c.label,
        shortLabel: c.shortLabel,
        desc: c.desc,
        iconName: c.iconName
      }).onConflictDoNothing();
    }
    for (const b of INITIAL_BRANDS) {
      await db.insert(brands).values({
        id: b.id,
        name: b.name,
        categoryId: b.categoryId,
        origin: b.origin || "Ch\xEDnh h\xE3ng"
      }).onConflictDoNothing();
    }
    for (const p of INITIAL_PRODUCTS) {
      await db.insert(products).values({
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
        updatedAt: p.updatedAt
      }).onConflictDoNothing();
    }
    for (const prj of INITIAL_PROJECTS) {
      await db.insert(projects).values({
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
        svgType: prj.svgType
      }).onConflictDoNothing();
    }
    for (const post of INITIAL_BLOG_POSTS) {
      await db.insert(blogPosts).values({
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
        imagesJson: JSON.stringify(post.images || (post.imageUrl ? [post.imageUrl] : []))
      }).onConflictDoNothing();
    }
    await db.insert(companySettings).values({
      id: "companyInfo",
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
      aboutText: INITIAL_COMPANY_INFO.aboutText
    }).onConflictDoNothing();
  } catch (error) {
    console.error("Database seeding failed:", error);
    throw new Error("Failed to seed initial PostgreSQL data.", { cause: error });
  }
}
async function upsertCategoryInPostgres(item) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.categories.findIndex((c) => c.id === item.id);
    if (idx >= 0) store.categories[idx] = item;
    else store.categories.push(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.insert(categories).values({
      id: item.id,
      label: item.label,
      shortLabel: item.shortLabel,
      desc: item.desc,
      iconName: item.iconName
    }).onConflictDoUpdate({
      target: categories.id,
      set: {
        label: item.label,
        shortLabel: item.shortLabel,
        desc: item.desc,
        iconName: item.iconName
      }
    });
  } catch (error) {
    console.error("Failed to upsert category in PostgreSQL:", error);
    throw new Error("Failed to save category.", { cause: error });
  }
}
async function deleteCategoryFromPostgres(id) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.categories = store.categories.filter((c) => c.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(categories).where(eq(categories.id, id));
  } catch (error) {
    console.error("Failed to delete category in PostgreSQL:", error);
    throw new Error("Failed to delete category.", { cause: error });
  }
}
async function upsertBrandInPostgres(item) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.brands.findIndex((b) => b.id === item.id);
    if (idx >= 0) store.brands[idx] = item;
    else store.brands.push(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.insert(brands).values({
      id: item.id,
      name: item.name,
      categoryId: item.categoryId,
      origin: item.origin || "Ch\xEDnh h\xE3ng"
    }).onConflictDoUpdate({
      target: brands.id,
      set: {
        name: item.name,
        categoryId: item.categoryId,
        origin: item.origin || "Ch\xEDnh h\xE3ng"
      }
    });
  } catch (error) {
    console.error("Failed to upsert brand in PostgreSQL:", error);
    throw new Error("Failed to save brand.", { cause: error });
  }
}
async function deleteBrandFromPostgres(id) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.brands = store.brands.filter((b) => b.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(brands).where(eq(brands.id, id));
  } catch (error) {
    console.error("Failed to delete brand in PostgreSQL:", error);
    throw new Error("Failed to delete brand.", { cause: error });
  }
}
async function upsertProductInPostgres(item) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.products.findIndex((p) => p.id === item.id);
    if (idx >= 0) store.products[idx] = item;
    else store.products.unshift(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    const imgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : item.imageUrl ? [item.imageUrl] : [];
    await db.insert(products).values({
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
      updatedAt: item.updatedAt
    }).onConflictDoUpdate({
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
        updatedAt: item.updatedAt
      }
    });
  } catch (error) {
    console.error("Failed to upsert product in PostgreSQL:", error);
    throw new Error("Failed to save product.", { cause: error });
  }
}
async function deleteProductFromPostgres(id) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.products = store.products.filter((p) => p.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(products).where(eq(products.id, id));
  } catch (error) {
    console.error("Failed to delete product in PostgreSQL:", error);
    throw new Error("Failed to delete product.", { cause: error });
  }
}
async function upsertProjectInPostgres(item) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.projects.findIndex((p) => p.id === item.id);
    if (idx >= 0) store.projects[idx] = item;
    else store.projects.unshift(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    const imgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : item.imageUrl ? [item.imageUrl] : [];
    await db.insert(projects).values({
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
      svgType: item.svgType
    }).onConflictDoUpdate({
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
        svgType: item.svgType
      }
    });
  } catch (error) {
    console.error("Failed to upsert project in PostgreSQL:", error);
    throw new Error("Failed to save project.", { cause: error });
  }
}
async function deleteProjectFromPostgres(id) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.projects = store.projects.filter((p) => p.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(projects).where(eq(projects.id, id));
  } catch (error) {
    console.error("Failed to delete project in PostgreSQL:", error);
    throw new Error("Failed to delete project.", { cause: error });
  }
}
async function upsertBlogPostInPostgres(item) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.blogPosts.findIndex((b) => b.id === item.id);
    if (idx >= 0) store.blogPosts[idx] = item;
    else store.blogPosts.unshift(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    const imgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : item.imageUrl ? [item.imageUrl] : [];
    await db.insert(blogPosts).values({
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
      imagesJson: JSON.stringify(imgs)
    }).onConflictDoUpdate({
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
        imagesJson: JSON.stringify(imgs)
      }
    });
  } catch (error) {
    console.error("Failed to upsert blog post in PostgreSQL:", error);
    throw new Error("Failed to save blog post.", { cause: error });
  }
}
async function deleteBlogPostFromPostgres(id) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.blogPosts = store.blogPosts.filter((b) => b.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  } catch (error) {
    console.error("Failed to delete blog post in PostgreSQL:", error);
    throw new Error("Failed to delete blog post.", { cause: error });
  }
}
async function upsertInquiryInPostgres(item) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    const idx = store.inquiries.findIndex((i) => i.id === item.id);
    if (idx >= 0) store.inquiries[idx] = item;
    else store.inquiries.unshift(item);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.insert(inquiries).values({
      id: item.id,
      customerName: item.customerName,
      phone: item.phone,
      address: item.address || "",
      productInterest: item.productInterest || "",
      note: item.note || "",
      createdAt: item.createdAt,
      status: item.status
    }).onConflictDoUpdate({
      target: inquiries.id,
      set: {
        customerName: item.customerName,
        phone: item.phone,
        address: item.address || "",
        productInterest: item.productInterest || "",
        note: item.note || "",
        createdAt: item.createdAt,
        status: item.status
      }
    });
  } catch (error) {
    console.error("Failed to upsert inquiry in PostgreSQL:", error);
    throw new Error("Failed to save customer inquiry.", { cause: error });
  }
}
async function deleteInquiryFromPostgres(id) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.inquiries = store.inquiries.filter((i) => i.id !== id);
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.delete(inquiries).where(eq(inquiries.id, id));
  } catch (error) {
    console.error("Failed to delete inquiry in PostgreSQL:", error);
    throw new Error("Failed to delete customer inquiry.", { cause: error });
  }
}
async function upsertCompanyInfoInPostgres(info) {
  if (!isPostgresConfigured()) {
    const store = readLocalDiskStore();
    store.companyInfo = info;
    writeLocalDiskStore(store);
    return;
  }
  try {
    await db.insert(companySettings).values({
      id: "companyInfo",
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
      aboutText: info.aboutText
    }).onConflictDoUpdate({
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
        aboutText: info.aboutText
      }
    });
  } catch (error) {
    console.error("Failed to upsert company info in PostgreSQL:", error);
    throw new Error("Failed to update company settings.", { cause: error });
  }
}
async function restoreAllStateInPostgres(payload) {
  if (!isPostgresConfigured()) {
    const current = readLocalDiskStore();
    const next = {
      categories: Array.isArray(payload.categories) ? payload.categories : current.categories,
      brands: Array.isArray(payload.brands) ? payload.brands : current.brands,
      products: Array.isArray(payload.products) ? payload.products : current.products,
      projects: Array.isArray(payload.projects) ? payload.projects : current.projects,
      blogPosts: Array.isArray(payload.blogPosts) ? payload.blogPosts : current.blogPosts,
      inquiries: Array.isArray(payload.inquiries) ? payload.inquiries : current.inquiries,
      companyInfo: payload.companyInfo ? { ...current.companyInfo, ...payload.companyInfo } : current.companyInfo
    };
    writeLocalDiskStore(next);
    return;
  }
  try {
    if (payload.mode === "replace") {
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
    console.error("Failed to restore state in PostgreSQL:", error);
    throw new Error("Failed to restore full state in database.", { cause: error });
  }
}

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  app.use(express.json({ limit: "25mb" }));
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      if (req.user?.uid && req.user?.email) {
        await getOrCreateUser(req.user.uid, req.user.email);
      }
      const users2 = await getUsers();
      res.json(users2);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch users";
      console.error("Failed to fetch users:", error);
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/users/sync", requireAuth, async (req, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || "";
      if (!uid) {
        return res.status(400).json({ error: "Missing user uid" });
      }
      const userRecord = await getOrCreateUser(uid, email);
      res.json(userRecord);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sync user";
      console.error("Failed to sync user:", error);
      res.status(500).json({ error: message });
    }
  });
  app.get("/api/state", async (_req, res) => {
    try {
      const state = await getAllCatalogState();
      res.json(state);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch state";
      console.error("Error in GET /api/state:", error);
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/inquiries", async (req, res) => {
    try {
      await upsertInquiryInPostgres(req.body);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit inquiry";
      console.error("Error in POST /api/inquiries:", error);
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/categories", async (req, res) => {
    try {
      await upsertCategoryInPostgres(req.body);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save category";
      res.status(500).json({ error: message });
    }
  });
  app.delete("/api/categories/:id", async (req, res) => {
    try {
      await deleteCategoryFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/brands", async (req, res) => {
    try {
      await upsertBrandInPostgres(req.body);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save brand";
      res.status(500).json({ error: message });
    }
  });
  app.delete("/api/brands/:id", async (req, res) => {
    try {
      await deleteBrandFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete brand";
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/products", async (req, res) => {
    try {
      await upsertProductInPostgres(req.body);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save product";
      res.status(500).json({ error: message });
    }
  });
  app.delete("/api/products/:id", async (req, res) => {
    try {
      await deleteProductFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete product";
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/projects", async (req, res) => {
    try {
      await upsertProjectInPostgres(req.body);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save project";
      res.status(500).json({ error: message });
    }
  });
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await deleteProjectFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete project";
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/blog-posts", async (req, res) => {
    try {
      await upsertBlogPostInPostgres(req.body);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save blog post";
      res.status(500).json({ error: message });
    }
  });
  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      await deleteBlogPostFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete blog post";
      res.status(500).json({ error: message });
    }
  });
  app.delete("/api/inquiries/:id", async (req, res) => {
    try {
      await deleteInquiryFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete inquiry";
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/company-info", async (req, res) => {
    try {
      await upsertCompanyInfoInPostgres(req.body);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save company info";
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/seed", async (req, res) => {
    try {
      await restoreAllStateInPostgres({ ...req.body, mode: "merge" });
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to seed database";
      res.status(500).json({ error: message });
    }
  });
  app.post("/api/restore", async (req, res) => {
    try {
      await restoreAllStateInPostgres(req.body);
      res.json({ ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to restore database";
      res.status(500).json({ error: message });
    }
  });
  const distPath = path2.join(__dirname, "dist");
  const isProd = process.env.NODE_ENV === "production" || __filename.endsWith(".js") && fs2.existsSync(path2.join(distPath, "index.html"));
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
