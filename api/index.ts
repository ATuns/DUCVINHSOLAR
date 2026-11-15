import { put, list } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

export interface BlobDatabaseState {
  version: string;
  storeName: string;
  updatedAt: string;
  categories: any[];
  brands: any[];
  products: any[];
  projects: any[];
  blogPosts: any[];
  inquiries: any[];
  companyInfo: any | null;
}

/**
 * Store Name: ducvinhsolar
 * Custom Environment Variable Prefix: DUCVINHSOLAR
 * Vercel injects: DUCVINHSOLAR_READ_WRITE_TOKEN
 */
const STORE_NAME = 'ducvinhsolar';
const STATE_BLOB_PATH = `${STORE_NAME}/state.json`;
const LEGACY_STATE_BLOB_PATH = 'ducvinh-solar-db/state.json';
const LOCAL_FALLBACK_FILE = path.join(process.cwd(), '.local-blob-db.json');

let memoryCache: BlobDatabaseState | null = null;
let lastBlobFetchAt = 0;
const CACHE_TTL_MS = 3500;

// Default to 'private' because the user's `ducvinhsolar` store is configured with private access;
// automatically falls back to 'public' if connected to a public store.
let detectedStoreAccess: 'private' | 'public' = 'private';

export function getVercelBlobToken(): string {
  const candidates = [
    process.env.DUCVINHSOLAR_READ_WRITE_TOKEN,
    process.env.DUCVINHSOLAR_BLOB_READ_WRITE_TOKEN,
    process.env.BLOB_READ_WRITE_TOKEN
  ];
  for (const raw of candidates) {
    const token = (raw || '').trim();
    if (
      token &&
      token !== 'MY_BLOB_READ_WRITE_TOKEN' &&
      token !== 'MY_DUCVINHSOLAR_READ_WRITE_TOKEN'
    ) {
      return token;
    }
  }
  return '';
}

export function isVercelBlobConfigured(): boolean {
  return Boolean(getVercelBlobToken());
}

/**
 * Helper that writes to Vercel Blob with automatic private/public store access detection.
 */
async function putBlobWithAutoAccess(
  pathname: string,
  body: string | Buffer,
  options: {
    addRandomSuffix: boolean;
    allowOverwrite?: boolean;
    contentType: string;
    cacheControlMaxAge?: number;
    token: string;
  }
) {
  try {
    return await put(pathname, body, {
      ...options,
      access: detectedStoreAccess
    });
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (msg.includes('Cannot use public access on a private store')) {
      detectedStoreAccess = 'private';
      return await put(pathname, body, {
        ...options,
        access: 'private'
      });
    }
    if (msg.includes('Cannot use private access on a public store')) {
      detectedStoreAccess = 'public';
      return await put(pathname, body, {
        ...options,
        access: 'public'
      });
    }
    throw err;
  }
}

/**
 * Fetches a blob URL supporting both private stores (Bearer token) and public stores.
 */
async function fetchBlobUrl(url: string, blobToken: string, noStore = true): Promise<Response> {
  const targetUrl = noStore ? `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}` : url;
  // For private Vercel Blob stores, Authorization: Bearer <token> is required
  const res = await fetch(targetUrl, {
    headers: blobToken ? { Authorization: `Bearer ${blobToken}` } : undefined,
    cache: noStore ? 'no-store' : 'default'
  });
  if (res.ok) return res;

  // Fallback without Authorization header in case of public CDN URL
  return fetch(targetUrl, {
    cache: noStore ? 'no-store' : 'default'
  });
}

function createEmptyState(): BlobDatabaseState {
  return {
    version: '3.2-ducvinhsolar-blob',
    storeName: STORE_NAME,
    updatedAt: new Date().toISOString(),
    categories: [],
    brands: [],
    products: [],
    projects: [],
    blogPosts: [],
    inquiries: [],
    companyInfo: null
  };
}

function normalizeState(raw: any): BlobDatabaseState {
  if (!raw || typeof raw !== 'object') {
    return createEmptyState();
  }
  return {
    version: typeof raw.version === 'string' ? raw.version : '3.2-ducvinhsolar-blob',
    storeName: STORE_NAME,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    brands: Array.isArray(raw.brands) ? raw.brands : [],
    products: Array.isArray(raw.products) ? raw.products : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    blogPosts: Array.isArray(raw.blogPosts) ? raw.blogPosts : [],
    inquiries: Array.isArray(raw.inquiries) ? raw.inquiries : [],
    companyInfo: raw.companyInfo && typeof raw.companyInfo === 'object' ? raw.companyInfo : null
  };
}

async function readDatabaseState(forceRefresh = false): Promise<BlobDatabaseState> {
  const now = Date.now();
  if (!forceRefresh && memoryCache && now - lastBlobFetchAt < CACHE_TTL_MS) {
    return memoryCache;
  }

  const blobToken = getVercelBlobToken();
  if (blobToken) {
    try {
      const { blobs } = await list({
        prefix: STATE_BLOB_PATH,
        limit: 5,
        token: blobToken
      });
      let exactBlob =
        blobs.find((b) => b.pathname === STATE_BLOB_PATH) || blobs[0];

      if (!exactBlob) {
        const legacyList = await list({
          prefix: LEGACY_STATE_BLOB_PATH,
          limit: 2,
          token: blobToken
        });
        exactBlob =
          legacyList.blobs.find((b) => b.pathname === LEGACY_STATE_BLOB_PATH) ||
          legacyList.blobs[0];
      }

      if (exactBlob && exactBlob.url) {
        if (exactBlob.url.includes('.private.blob.vercel-storage.com')) {
          detectedStoreAccess = 'private';
        }
        const res = await fetchBlobUrl(exactBlob.url, blobToken, true);
        if (res.ok) {
          const parsed = await res.json();
          memoryCache = normalizeState(parsed);
          lastBlobFetchAt = now;
          return memoryCache;
        }
      }
    } catch (err) {
      console.error(`[Vercel Blob - ${STORE_NAME}] Error reading state.json:`, err);
      if (memoryCache) return memoryCache;
    }
  }

  // Fallback to local file storage when running in preview without DUCVINHSOLAR_READ_WRITE_TOKEN
  try {
    if (fs.existsSync(LOCAL_FALLBACK_FILE)) {
      const rawText = fs.readFileSync(LOCAL_FALLBACK_FILE, 'utf-8');
      const parsed = JSON.parse(rawText);
      memoryCache = normalizeState(parsed);
      lastBlobFetchAt = now;
      return memoryCache;
    }
  } catch (err) {
    console.warn('[Local Blob Fallback] Could not read local state file:', err);
  }

  if (!memoryCache) {
    memoryCache = createEmptyState();
    lastBlobFetchAt = now;
  }
  return memoryCache;
}

async function writeDatabaseState(nextState: BlobDatabaseState): Promise<BlobDatabaseState> {
  const normalized = normalizeState({
    ...nextState,
    storeName: STORE_NAME,
    updatedAt: new Date().toISOString()
  });

  memoryCache = normalized;
  lastBlobFetchAt = Date.now();

  const blobToken = getVercelBlobToken();
  if (blobToken) {
    await putBlobWithAutoAccess(STATE_BLOB_PATH, JSON.stringify(normalized), {
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 0,
      token: blobToken
    });
    return normalized;
  }

  // Persist to local fallback file when running in preview environment
  try {
    fs.writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(normalized, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Local Blob Fallback] Could not write local state file:', err);
  }

  return normalized;
}

function upsertById<T extends { id: string }>(items: T[], item: T, prependNew = false): T[] {
  const idx = items.findIndex((existing) => existing.id === item.id);
  if (idx >= 0) {
    const updated = [...items];
    updated[idx] = { ...updated[idx], ...item };
    return updated;
  }
  return prependNew ? [item, ...items] : [...items, item];
}

function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of existing) {
    if (item && item.id) map.set(item.id, item);
  }
  for (const item of incoming) {
    if (item && item.id) map.set(item.id, item);
  }
  return Array.from(map.values());
}

async function parseJsonBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk.toString();
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res: any, statusCode: number, payload: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(payload));
}

export default async function apiHandler(req: any, res: any) {
  try {
    const method = (req.method || 'GET').toUpperCase();
    const rawUrl = req.originalUrl || req.url || '/api/state';
    const urlObj = new URL(rawUrl, 'http://localhost');
    const pathname = urlObj.pathname.startsWith('/api')
      ? urlObj.pathname
      : `/api${urlObj.pathname.startsWith('/') ? '' : '/'}${urlObj.pathname}`;

    // 1. GET /api/state -> Return full database state from Vercel Blob store `ducvinhsolar`
    if (method === 'GET' && pathname === '/api/state') {
      const state = await readDatabaseState();
      return sendJson(res, 200, {
        ok: true,
        storeName: STORE_NAME,
        envPrefix: 'DUCVINHSOLAR',
        storeAccess: detectedStoreAccess,
        storageEngine: 'vercel-blob',
        storageMode: isVercelBlobConfigured() ? 'vercel-blob' : 'local-fallback',
        updatedAt: state.updatedAt,
        categories: state.categories,
        brands: state.brands,
        products: state.products,
        projects: state.projects,
        blogPosts: state.blogPosts,
        inquiries: state.inquiries,
        companyInfo: state.companyInfo
      });
    }

    // 2. GET /api/blob/media -> Stream private Vercel Blob images securely to the browser
    if (method === 'GET' && pathname === '/api/blob/media') {
      const blobUrl = urlObj.searchParams.get('url') || '';
      if (!blobUrl || !blobUrl.includes('blob.vercel-storage.com')) {
        return sendJson(res, 400, { ok: false, error: 'Invalid blob media URL' });
      }
      const blobToken = getVercelBlobToken();
      const upstream = await fetchBlobUrl(blobUrl, blobToken, false);
      if (!upstream.ok) {
        return sendJson(res, upstream.status, { ok: false, error: 'Failed to load blob media' });
      }
      const contentType = upstream.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await upstream.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.end(buffer);
    }

    // 3. POST /api/blob/upload -> Upload image file directly to Vercel Blob Store `ducvinhsolar`
    if (method === 'POST' && pathname === '/api/blob/upload') {
      const body = await parseJsonBody(req);
      const dataUrl = typeof body.dataUrl === 'string' ? body.dataUrl : '';
      const rawFilename = typeof body.filename === 'string' ? body.filename : `image-${Date.now()}.jpg`;
      const safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '-');

      if (!dataUrl) {
        return sendJson(res, 400, { ok: false, error: 'Missing dataUrl' });
      }

      const blobToken = getVercelBlobToken();
      if (blobToken && dataUrl.startsWith('data:')) {
        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1] || 'image/jpeg';
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const blobPath = `${STORE_NAME}/media/${Date.now()}-${safeFilename}`;

          const uploaded = await putBlobWithAutoAccess(blobPath, buffer, {
            addRandomSuffix: true,
            contentType,
            token: blobToken
          });

          // If the store is private, serve the image via our authenticated /api/blob/media proxy route
          const isPrivateBlob =
            detectedStoreAccess === 'private' ||
            uploaded.url.includes('.private.blob.vercel-storage.com');
          const browserUrl = isPrivateBlob
            ? `/api/blob/media?url=${encodeURIComponent(uploaded.url)}`
            : uploaded.url;

          return sendJson(res, 200, {
            ok: true,
            storeName: STORE_NAME,
            storeAccess: detectedStoreAccess,
            url: browserUrl,
            rawBlobUrl: uploaded.url,
            pathname: uploaded.pathname,
            storageMode: 'vercel-blob'
          });
        }
      }

      return sendJson(res, 200, {
        ok: true,
        storeName: STORE_NAME,
        url: dataUrl,
        storageMode: 'local-fallback'
      });
    }

    // 4. POST /api/seed -> Seed initial data only if database is currently empty
    if (method === 'POST' && pathname === '/api/seed') {
      const current = await readDatabaseState();
      const isEmpty =
        current.categories.length === 0 &&
        current.brands.length === 0 &&
        current.products.length === 0;

      if (!isEmpty) {
        return sendJson(res, 200, { ok: true, seeded: false, state: current });
      }

      const body = await parseJsonBody(req);
      const nextState = await writeDatabaseState({
        version: '3.2-ducvinhsolar-blob',
        storeName: STORE_NAME,
        updatedAt: new Date().toISOString(),
        categories: Array.isArray(body.categories) ? body.categories : [],
        brands: Array.isArray(body.brands) ? body.brands : [],
        products: Array.isArray(body.products) ? body.products : [],
        projects: Array.isArray(body.projects) ? body.projects : [],
        blogPosts: Array.isArray(body.blogPosts) ? body.blogPosts : [],
        inquiries: Array.isArray(body.inquiries) ? body.inquiries : [],
        companyInfo: body.companyInfo || null
      });

      return sendJson(res, 200, { ok: true, seeded: true, state: nextState });
    }

    // 5. POST /api/restore -> Full replace or merge sync to Vercel Blob `ducvinhsolar`
    if (method === 'POST' && pathname === '/api/restore') {
      const body = await parseJsonBody(req);
      const mode = body.mode === 'merge' ? 'merge' : 'replace';
      const current = await readDatabaseState();

      const nextState: BlobDatabaseState =
        mode === 'replace'
          ? {
              version: '3.2-ducvinhsolar-blob',
              storeName: STORE_NAME,
              updatedAt: new Date().toISOString(),
              categories: Array.isArray(body.categories) ? body.categories : current.categories,
              brands: Array.isArray(body.brands) ? body.brands : current.brands,
              products: Array.isArray(body.products) ? body.products : current.products,
              projects: Array.isArray(body.projects) ? body.projects : current.projects,
              blogPosts: Array.isArray(body.blogPosts) ? body.blogPosts : current.blogPosts,
              inquiries: Array.isArray(body.inquiries) ? body.inquiries : current.inquiries,
              companyInfo: body.companyInfo !== undefined ? body.companyInfo : current.companyInfo
            }
          : {
              version: '3.2-ducvinhsolar-blob',
              storeName: STORE_NAME,
              updatedAt: new Date().toISOString(),
              categories: Array.isArray(body.categories)
                ? mergeById(current.categories, body.categories)
                : current.categories,
              brands: Array.isArray(body.brands)
                ? mergeById(current.brands, body.brands)
                : current.brands,
              products: Array.isArray(body.products)
                ? mergeById(current.products, body.products)
                : current.products,
              projects: Array.isArray(body.projects)
                ? mergeById(current.projects, body.projects)
                : current.projects,
              blogPosts: Array.isArray(body.blogPosts)
                ? mergeById(current.blogPosts, body.blogPosts)
                : current.blogPosts,
              inquiries: Array.isArray(body.inquiries)
                ? mergeById(current.inquiries, body.inquiries)
                : current.inquiries,
              companyInfo: body.companyInfo || current.companyInfo
            };

      const saved = await writeDatabaseState(nextState);
      return sendJson(res, 200, {
        ok: true,
        mode,
        storeName: STORE_NAME,
        storeAccess: detectedStoreAccess,
        updatedAt: saved.updatedAt,
        storageMode: isVercelBlobConfigured() ? 'vercel-blob' : 'local-fallback'
      });
    }

    // 6. Categories CRUD
    if (method === 'POST' && pathname === '/api/categories') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid category' });
      const current = await readDatabaseState();
      current.categories = upsertById(current.categories, item, false);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/categories/')) {
      const id = decodeURIComponent(pathname.replace('/api/categories/', ''));
      const current = await readDatabaseState();
      current.categories = current.categories.filter((c) => c.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 7. Brands CRUD
    if (method === 'POST' && pathname === '/api/brands') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid brand' });
      const current = await readDatabaseState();
      current.brands = upsertById(current.brands, item, false);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/brands/')) {
      const id = decodeURIComponent(pathname.replace('/api/brands/', ''));
      const current = await readDatabaseState();
      current.brands = current.brands.filter((b) => b.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 8. Products CRUD
    if (method === 'POST' && pathname === '/api/products') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid product' });
      const current = await readDatabaseState();
      current.products = upsertById(current.products, item, true);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/products/')) {
      const id = decodeURIComponent(pathname.replace('/api/products/', ''));
      const current = await readDatabaseState();
      current.products = current.products.filter((p) => p.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 9. Projects CRUD
    if (method === 'POST' && pathname === '/api/projects') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid project' });
      const current = await readDatabaseState();
      current.projects = upsertById(current.projects, item, true);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/projects/')) {
      const id = decodeURIComponent(pathname.replace('/api/projects/', ''));
      const current = await readDatabaseState();
      current.projects = current.projects.filter((p) => p.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 10. Blog Posts CRUD
    if (method === 'POST' && pathname === '/api/blog-posts') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid blog post' });
      const current = await readDatabaseState();
      current.blogPosts = upsertById(current.blogPosts, item, true);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/blog-posts/')) {
      const id = decodeURIComponent(pathname.replace('/api/blog-posts/', ''));
      const current = await readDatabaseState();
      current.blogPosts = current.blogPosts.filter((b) => b.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 11. Company Info update
    if (method === 'POST' && pathname === '/api/company-info') {
      const info = await parseJsonBody(req);
      const current = await readDatabaseState();
      current.companyInfo = info;
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 12. Inquiries CRUD
    if (method === 'POST' && pathname === '/api/inquiries') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid inquiry' });
      const current = await readDatabaseState();
      current.inquiries = upsertById(current.inquiries, item, true);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    return sendJson(res, 404, { ok: false, error: `Unknown endpoint: ${method} ${pathname}` });
  } catch (error: any) {
    console.error(`[Vercel Blob API Error - ${STORE_NAME}]:`, error);
    return sendJson(res, 500, {
      ok: false,
      error: error?.message || 'Internal Server Error'
    });
  }
}
