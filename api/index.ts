import { put, list, get } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

export interface BlobDatabaseState {
  version: string;
  storeName: string;
  storeId: string;
  updatedAt: string;
  categories: any[];
  brands: any[];
  products: any[];
  projects: any[];
  blogPosts: any[];
  inquiries: any[];
  companyInfo: any | null;
  deletedIds?: string[];
}

/**
 * Store Name: ducvinhsolar
 * Custom Environment Variable Prefix: DUCVINHSOLAR
 * Store ID: store_gzvmZDzXfVh8EDzC (DUCVINHSOLAR_STORE_ID)
 * Token: BLOB_READ_WRITE_TOKEN / DUCVINHSOLAR_READ_WRITE_TOKEN / Vercel OIDC
 */
const STORE_NAME = 'ducvinhsolar';
const DEFAULT_STORE_ID = 'store_gzvmZDzXfVh8EDzC';
const DEFAULT_SHARED_TOKEN =
  'vercel_blob_rw_gzvmZDzXfVh8EDzC_2lh1Lpl7XDndI9qyic11Fp8bDwFeCd';
const STATE_BLOB_PATH = `${STORE_NAME}/state.json`;
const LEGACY_STATE_BLOB_PATH = 'ducvinh-solar-db/state.json';

// Git-tracked snapshot file so any edits in AI Studio Preview are also carried into GitHub
const GIT_SNAPSHOT_FILE = path.join(process.cwd(), 'src', 'data', 'databaseSnapshot.json');
// Local fallback file in workspace root
const LOCAL_FALLBACK_FILE = path.join(process.cwd(), '.local-blob-db.json');
// Local gitignored token config file
const LOCAL_TOKEN_FILE = path.join(process.cwd(), '.blob-token.json');

let memoryCache: BlobDatabaseState | null = null;
let lastBlobFetchAt = 0;
let runtimeConfiguredToken = '';
const CACHE_TTL_MS = 2000;

// Serialize state mutations inside a single Node process so concurrent POSTs never clobber each other
let stateWriteQueue: Promise<unknown> = Promise.resolve();
function withStateWriteLock<T>(task: () => Promise<T>): Promise<T> {
  const run = stateWriteQueue.then(task, task);
  stateWriteQueue = run.catch(() => {});
  return run;
}

export function getStoreId(): string {
  return (
    (process.env.DUCVINHSOLAR_STORE_ID || '').trim() ||
    (process.env.BLOB_STORE_ID || '').trim() ||
    DEFAULT_STORE_ID
  );
}

function loadSavedLocalToken(): string {
  if (runtimeConfiguredToken) return runtimeConfiguredToken;
  try {
    if (fs.existsSync(LOCAL_TOKEN_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_TOKEN_FILE, 'utf-8'));
      if (parsed && typeof parsed.token === 'string' && parsed.token.trim()) {
        runtimeConfiguredToken = parsed.token.trim();
        return runtimeConfiguredToken;
      }
    }
  } catch {
    // ignore read error
  }
  return '';
}

function saveLocalToken(token: string) {
  runtimeConfiguredToken = token.trim();
  try {
    fs.writeFileSync(
      LOCAL_TOKEN_FILE,
      JSON.stringify(
        {
          storeId: getStoreId(),
          token: runtimeConfiguredToken,
          updatedAt: new Date().toISOString()
        },
        null,
        2
      ),
      'utf-8'
    );
  } catch (err) {
    console.warn('[Vercel Blob Config] Could not persist .blob-token.json:', err);
  }
}

export function getVercelBlobToken(): string {
  const explicitCandidates = [
    runtimeConfiguredToken,
    process.env.BLOB_READ_WRITE_TOKEN,
    process.env.DUCVINHSOLAR_READ_WRITE_TOKEN,
    process.env.DUCVINHSOLAR_BLOB_READ_WRITE_TOKEN,
    loadSavedLocalToken(),
    DEFAULT_SHARED_TOKEN
  ];

  for (const raw of explicitCandidates) {
    const token = (raw || '').trim();
    if (
      token &&
      token !== 'MY_BLOB_READ_WRITE_TOKEN' &&
      token !== 'MY_DUCVINHSOLAR_READ_WRITE_TOKEN'
    ) {
      return token;
    }
  }

  try {
    for (const [, val] of Object.entries(process.env)) {
      const cleanVal = (val || '').trim();
      if (cleanVal.startsWith('vercel_blob_rw_')) {
        return cleanVal;
      }
    }
  } catch {
    // ignore
  }

  return DEFAULT_SHARED_TOKEN;
}

export function getBlobAuthOptions(): { storeId: string; token?: string } {
  const storeId = getStoreId();
  const token = getVercelBlobToken();
  return token ? { storeId, token } : { storeId };
}

export function isVercelBlobConfigured(): boolean {
  return Boolean(
    getVercelBlobToken() ||
      process.env.DUCVINHSOLAR_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN
  );
}

/**
 * Writes a blob to private store `store_gzvmZDzXfVh8EDzC` (`ducvinhsolar`) using @vercel/blob `put()`.
 */
async function putPrivateBlob(
  pathname: string,
  body: string | Buffer,
  options: {
    addRandomSuffix: boolean;
    allowOverwrite?: boolean;
    contentType: string;
  }
) {
  const auth = getBlobAuthOptions();
  return await put(pathname, body, {
    access: 'private',
    storeId: auth.storeId,
    ...(auth.token ? { token: auth.token } : {}),
    addRandomSuffix: options.addRandomSuffix,
    allowOverwrite: options.allowOverwrite,
    contentType: options.contentType
  });
}

/**
 * Reads a private blob from `store_gzvmZDzXfVh8EDzC` (`ducvinhsolar`) using @vercel/blob `get()`.
 */
async function getPrivateBlobStream(urlOrPathname: string) {
  const auth = getBlobAuthOptions();
  return await get(urlOrPathname, {
    access: 'private',
    useCache: false,
    storeId: auth.storeId,
    ...(auth.token ? { token: auth.token } : {})
  });
}

async function getPrivateBlobText(urlOrPathname: string): Promise<string | null> {
  try {
    const result = await getPrivateBlobStream(urlOrPathname);
    if (!result || result.statusCode !== 200 || !result.stream) {
      return null;
    }
    return await new Response(result.stream).text();
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (!msg.includes('404') && !msg.includes('not exist')) {
      console.warn(`[Vercel Blob get(${urlOrPathname})] warning:`, msg);
    }
    return null;
  }
}

function createEmptyState(): BlobDatabaseState {
  return {
    version: '3.4-ducvinhsolar-private-blob',
    storeName: STORE_NAME,
    storeId: getStoreId(),
    updatedAt: '1970-01-01T00:00:00.000Z',
    categories: [],
    brands: [],
    products: [],
    projects: [],
    blogPosts: [],
    inquiries: [],
    companyInfo: null,
    deletedIds: []
  };
}

function normalizeState(raw: any): BlobDatabaseState {
  if (!raw || typeof raw !== 'object') {
    return createEmptyState();
  }
  const deletedSet = new Set<string>(
    Array.isArray(raw.deletedIds)
      ? raw.deletedIds.filter((id: any) => typeof id === 'string')
      : []
  );
  return {
    version:
      typeof raw.version === 'string' ? raw.version : '3.4-ducvinhsolar-private-blob',
    storeName: STORE_NAME,
    storeId: getStoreId(),
    updatedAt:
      typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
    categories: Array.isArray(raw.categories)
      ? raw.categories.filter((c: any) => c && !deletedSet.has(c.id))
      : [],
    brands: Array.isArray(raw.brands)
      ? raw.brands.filter((b: any) => b && !deletedSet.has(b.id))
      : [],
    products: Array.isArray(raw.products)
      ? raw.products.filter((p: any) => p && !deletedSet.has(p.id))
      : [],
    projects: Array.isArray(raw.projects)
      ? raw.projects.filter((p: any) => p && !deletedSet.has(p.id))
      : [],
    blogPosts: Array.isArray(raw.blogPosts)
      ? raw.blogPosts.filter((b: any) => b && !deletedSet.has(b.id))
      : [],
    inquiries: Array.isArray(raw.inquiries) ? raw.inquiries : [],
    companyInfo:
      raw.companyInfo && typeof raw.companyInfo === 'object' ? raw.companyInfo : null,
    deletedIds: Array.from(deletedSet)
  };
}

function hasValidContent(state: BlobDatabaseState | null | undefined): boolean {
  if (!state) return false;
  return state.categories.length > 0 || state.products.length > 0;
}

function readLocalDiskSnapshot(): BlobDatabaseState | null {
  const candidates = [LOCAL_FALLBACK_FILE, GIT_SNAPSHOT_FILE];
  let newest: BlobDatabaseState | null = null;

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const rawText = fs.readFileSync(filePath, 'utf-8');
        const parsed = normalizeState(JSON.parse(rawText));
        if (hasValidContent(parsed)) {
          if (
            !newest ||
            new Date(parsed.updatedAt).getTime() > new Date(newest.updatedAt).getTime()
          ) {
            newest = parsed;
          }
        }
      }
    } catch {
      // ignore read errors
    }
  }
  return newest;
}

function writeLocalDiskSnapshot(state: BlobDatabaseState) {
  const serialized = JSON.stringify(state, null, 2);
  try {
    fs.writeFileSync(LOCAL_FALLBACK_FILE, serialized, 'utf-8');
  } catch {
    // ignore on read-only serverless filesystem
  }
  try {
    const dir = path.dirname(GIT_SNAPSHOT_FILE);
    if (fs.existsSync(dir)) {
      fs.writeFileSync(GIT_SNAPSHOT_FILE, serialized, 'utf-8');
    }
  } catch {
    // ignore on read-only serverless filesystem
  }
}

function mergeById<T extends { id: string }>(
  baseItems: T[],
  newerItems: T[],
  deletedSet: Set<string>
): T[] {
  const map = new Map<string, T>();
  for (const item of baseItems) {
    if (item && item.id && !deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  }
  for (const item of newerItems) {
    if (item && item.id && !deletedSet.has(item.id)) {
      map.set(item.id, { ...(map.get(item.id) || ({} as T)), ...item });
    }
  }
  return Array.from(map.values());
}

async function readRemoteBlobState(): Promise<{
  state: BlobDatabaseState | null;
  blobExists: boolean;
  errorOccurred: boolean;
}> {
  try {
    // 1. Primary: Read directly by pathname using @vercel/blob `get(STATE_BLOB_PATH, { access: 'private', storeId })`
    const directText = await getPrivateBlobText(STATE_BLOB_PATH);
    if (directText) {
      const parsed = normalizeState(JSON.parse(directText));
      if (hasValidContent(parsed)) {
        return { state: parsed, blobExists: true, errorOccurred: false };
      }
    }

    // 2. Fallback: List blobs in `ducvinhsolar` store to check if state exists under prefix
    const auth = getBlobAuthOptions();
    const { blobs } = await list({
      prefix: STATE_BLOB_PATH,
      limit: 10,
      storeId: auth.storeId,
      ...(auth.token ? { token: auth.token } : {})
    });

    let allCandidates = [...blobs];
    if (allCandidates.length === 0) {
      const legacyList = await list({
        prefix: LEGACY_STATE_BLOB_PATH,
        limit: 5,
        storeId: auth.storeId,
        ...(auth.token ? { token: auth.token } : {})
      });
      allCandidates = [...legacyList.blobs];
    }

    if (allCandidates.length === 0) {
      return { state: null, blobExists: false, errorOccurred: false };
    }

    allCandidates.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    const exactBlob =
      allCandidates.find((b) => b.pathname === STATE_BLOB_PATH) || allCandidates[0];

    if (exactBlob) {
      const text =
        (await getPrivateBlobText(exactBlob.pathname)) ||
        (await getPrivateBlobText(exactBlob.url));
      if (text) {
        const parsed = normalizeState(JSON.parse(text));
        return { state: parsed, blobExists: true, errorOccurred: false };
      }
    }

    return { state: null, blobExists: true, errorOccurred: true };
  } catch (err) {
    console.error(`[Vercel Blob - ${STORE_NAME}] Error reading remote state:`, err);
    return { state: null, blobExists: true, errorOccurred: true };
  }
}

async function readDatabaseState(forceRefresh = false): Promise<BlobDatabaseState> {
  const now = Date.now();
  if (
    !forceRefresh &&
    memoryCache &&
    hasValidContent(memoryCache) &&
    now - lastBlobFetchAt < CACHE_TTL_MS
  ) {
    return memoryCache;
  }

  const diskSnapshot = readLocalDiskSnapshot();

  if (isVercelBlobConfigured()) {
    const { state: remoteState, blobExists, errorOccurred } = await readRemoteBlobState();

    // Vercel Blob `store_gzvmZDzXfVh8EDzC` is the single shared database between Preview and GitHub/Vercel!
    if (remoteState && hasValidContent(remoteState)) {
      memoryCache = remoteState;
      lastBlobFetchAt = now;
      writeLocalDiskSnapshot(remoteState);
      return remoteState;
    }

    // Only if the store is genuinely brand-new (0 blobs exist), initialize it once from the snapshot
    if (!blobExists && !errorOccurred && diskSnapshot && hasValidContent(diskSnapshot)) {
      try {
        await putPrivateBlob(STATE_BLOB_PATH, JSON.stringify(diskSnapshot), {
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json'
        });
      } catch (e) {
        console.warn('[Vercel Blob Initial Seed] Could not seed initial snapshot:', e);
      }
      memoryCache = diskSnapshot;
      lastBlobFetchAt = now;
      return diskSnapshot;
    }

    if (memoryCache && hasValidContent(memoryCache)) {
      return memoryCache;
    }
  }

  if (diskSnapshot && hasValidContent(diskSnapshot)) {
    memoryCache = diskSnapshot;
    lastBlobFetchAt = now;
    return diskSnapshot;
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
    storeId: getStoreId(),
    updatedAt: new Date().toISOString()
  });

  memoryCache = normalized;
  lastBlobFetchAt = Date.now();

  // Save to local snapshot as backup
  writeLocalDiskSnapshot(normalized);

  // Write directly to private Vercel Blob store `store_gzvmZDzXfVh8EDzC` (`ducvinhsolar/state.json`)
  await putPrivateBlob(STATE_BLOB_PATH, JSON.stringify(normalized), {
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });

  return normalized;
}

function normalizeItemImages<T extends Record<string, any>>(item: T): T {
  if (!item || typeof item !== 'object') return item;
  if (Array.isArray(item.images)) {
    const cleanImages = item.images.filter(
      (img: any) => typeof img === 'string' && img.trim().length > 0
    );
    return {
      ...item,
      images: cleanImages,
      imageUrl: cleanImages[0] || ''
    };
  }
  return item;
}

function upsertById<T extends { id: string }>(items: T[], item: T, prependNew = false): T[] {
  const normalizedItem = normalizeItemImages(item as Record<string, any>) as T;
  const idx = items.findIndex((existing) => existing.id === normalizedItem.id);
  if (idx >= 0) {
    const updated = [...items];
    const merged: any = { ...updated[idx], ...normalizedItem };
    const normalizedImages = (normalizedItem as Record<string, any>).images;
    if (Array.isArray(normalizedImages)) {
      merged.images = normalizedImages;
      merged.imageUrl = normalizedImages[0] || undefined;
    }
    updated[idx] = merged;
    return updated;
  }
  return prependNew ? [normalizedItem, ...items] : [...items, normalizedItem];
}

function recordDeletedId(state: BlobDatabaseState, id: string) {
  const set = new Set<string>(state.deletedIds || []);
  set.add(id);
  state.deletedIds = Array.from(set);
}

function clearDeletedId(state: BlobDatabaseState, id: string) {
  if (!Array.isArray(state.deletedIds)) return;
  state.deletedIds = state.deletedIds.filter((existing) => existing !== id);
}

async function readRawBodyBuffer(req: any): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (req.body instanceof Uint8Array) {
    return Buffer.from(req.body);
  }
  if (typeof req.body === 'string') {
    return Buffer.from(req.body, 'utf-8');
  }
  if (req.readableEnded) {
    return Buffer.alloc(0);
  }
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: any) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => {
      resolve(chunks.length > 0 ? Buffer.concat(chunks) : Buffer.alloc(0));
    });
    req.on('error', () => resolve(Buffer.alloc(0)));
  });
}

async function parseJsonBody(req: any): Promise<any> {
  if (Buffer.isBuffer(req.body)) {
    const text = req.body.toString('utf-8').trim();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }
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
  if (req.readableEnded) {
    return {};
  }
  const buf = await readRawBodyBuffer(req);
  const raw = buf.toString('utf-8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function sanitizeUploadFilename(rawFilename: string, contentType: string): string {
  const extFromType: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
    'image/bmp': '.bmp'
  };
  const fallbackExt = extFromType[contentType.toLowerCase()] || '.jpg';
  const stripped = (rawFilename || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd');

  const dotIdx = stripped.lastIndexOf('.');
  const rawBase = dotIdx > 0 ? stripped.slice(0, dotIdx) : stripped;
  const rawExt = dotIdx > 0 ? stripped.slice(dotIdx).toLowerCase() : '';
  const safeBase =
    rawBase
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'product-img';
  const safeExt = /^\.[a-z0-9]{2,5}$/.test(rawExt) ? rawExt : fallbackExt;
  return `${safeBase}${safeExt}`;
}

function sendJson(res: any, statusCode: number, payload: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0');
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0');
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

    // 1. GET /api/state -> Return full database state from Vercel Blob store `store_gzvmZDzXfVh8EDzC`
    if (method === 'GET' && pathname === '/api/state') {
      const force = urlObj.searchParams.get('force') === '1';
      const state = await readDatabaseState(force);
      return sendJson(res, 200, {
        ok: true,
        storeName: STORE_NAME,
        storeId: getStoreId(),
        envPrefix: 'DUCVINHSOLAR',
        storeAccess: 'private',
        storageEngine: 'vercel-blob',
        storageMode: 'vercel-blob',
        blobConnected: true,
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

    // 2. POST /api/blob/config -> Update token if needed and sync state
    if (method === 'POST' && pathname === '/api/blob/config') {
      const body = await parseJsonBody(req);
      const rawToken = typeof body.token === 'string' ? body.token.trim() : '';
      if (!rawToken) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Vui lòng nhập mã Token (BLOB_READ_WRITE_TOKEN)'
        });
      }

      saveLocalToken(rawToken);
      const state = await readDatabaseState(true);
      return sendJson(res, 200, {
        ok: true,
        storeName: STORE_NAME,
        storeId: getStoreId(),
        blobConnected: true,
        storeAccess: 'private',
        updatedAt: state.updatedAt,
        state
      });
    }

    // 3. GET/HEAD /api/blob/media -> Serve private Vercel Blob media using `get(pathname, { access: 'private', storeId })`
    if ((method === 'GET' || method === 'HEAD') && pathname === '/api/blob/media') {
      const targetPathname = urlObj.searchParams.get('pathname') || '';
      const targetUrl = urlObj.searchParams.get('url') || '';
      const lookup = targetPathname || targetUrl;

      if (!lookup) {
        return sendJson(res, 400, { error: 'Missing pathname' });
      }

      const result = await getPrivateBlobStream(lookup);
      if (result === null || result.statusCode !== 200 || !result.stream) {
        res.statusCode = 404;
        return res.end('Not found');
      }

      const arrayBuf = await new Response(result.stream).arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      res.statusCode = 200;
      res.setHeader('Cache-Control', 'private, max-age=86400');
      res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
      res.setHeader('Content-Length', String(buffer.length));
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return method === 'HEAD' ? res.end() : res.end(buffer);
    }

    // 4. POST /api/blob/upload -> Upload image file (raw binary OR JSON dataUrl) to private Vercel Blob Store
    if (method === 'POST' && pathname === '/api/blob/upload') {
      const reqContentType = String(req.headers?.['content-type'] || '').toLowerCase();
      const isBinaryUpload =
        reqContentType.startsWith('image/') ||
        reqContentType.startsWith('application/octet-stream');

      let buffer: Buffer | null = null;
      let contentType = 'image/jpeg';
      let rawFilename = `image-${Date.now()}.jpg`;

      if (isBinaryUpload) {
        const rawBuf = await readRawBodyBuffer(req);
        if (!rawBuf || rawBuf.length === 0) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Dữ liệu ảnh trống. Vui lòng thử chọn lại ảnh.'
          });
        }
        buffer = rawBuf;
        const headerType = reqContentType.split(';')[0].trim();
        const queryType = (urlObj.searchParams.get('contentType') || '').trim().toLowerCase();
        contentType =
          headerType.startsWith('image/')
            ? headerType
            : queryType.startsWith('image/')
            ? queryType
            : 'image/jpeg';
        const headerName = String(req.headers?.['x-filename'] || '');
        const queryName = urlObj.searchParams.get('filename') || '';
        rawFilename = decodeURIComponent(queryName || headerName || rawFilename);
      } else {
        const body = await parseJsonBody(req);
        const dataUrl = typeof body.dataUrl === 'string' ? body.dataUrl.trim() : '';
        rawFilename =
          typeof body.filename === 'string' && body.filename.trim()
            ? body.filename.trim()
            : rawFilename;

        if (!dataUrl) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Thiếu dữ liệu ảnh (dataUrl) khi tải lên.'
          });
        }

        if (dataUrl.startsWith('data:')) {
          const matches = dataUrl.match(/^data:([^;,]+)(?:;[^,]*)?;base64,([\s\S]+)$/);
          if (!matches) {
            return sendJson(res, 400, {
              ok: false,
              error: 'Định dạng dữ liệu ảnh base64 không hợp lệ.'
            });
          }
          contentType =
            matches[1]?.trim() ||
            (typeof body.contentType === 'string' && body.contentType.trim()) ||
            'image/jpeg';
          const base64Data = matches[2].replace(/\s+/g, '');
          buffer = Buffer.from(base64Data, 'base64');
        } else if (/^https?:\/\//i.test(dataUrl)) {
          return sendJson(res, 200, {
            ok: true,
            storeName: STORE_NAME,
            url: dataUrl,
            storageMode: 'vercel-blob'
          });
        } else {
          return sendJson(res, 400, {
            ok: false,
            error: 'Dữ liệu ảnh không đúng định dạng.'
          });
        }
      }

      if (!buffer || buffer.length === 0) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Không giải mã được nội dung tệp ảnh.'
        });
      }

      if (buffer.length > 12 * 1024 * 1024) {
        return sendJson(res, 413, {
          ok: false,
          error: 'Ảnh quá lớn (vượt quá 12MB). Vui lòng chọn ảnh dung lượng nhỏ hơn.'
        });
      }

      const safeFilename = sanitizeUploadFilename(rawFilename, contentType);
      const blobPath = `${STORE_NAME}/media/${Date.now()}-${safeFilename}`;

      const uploaded = await putPrivateBlob(blobPath, buffer, {
        addRandomSuffix: true,
        contentType
      });

      const browserUrl = `/api/blob/media?pathname=${encodeURIComponent(uploaded.pathname)}`;

      return sendJson(res, 200, {
        ok: true,
        storeName: STORE_NAME,
        storeId: getStoreId(),
        storeAccess: 'private',
        url: browserUrl,
        rawBlobUrl: uploaded.url,
        pathname: uploaded.pathname,
        size: buffer.length,
        contentType,
        storageMode: 'vercel-blob'
      });
    }

    // 4b. POST /api/blob/import-url -> Validate & mirror Google Drive (or public URL) image into private Vercel Blob
    if (method === 'POST' && pathname === '/api/blob/import-url') {
      const body = await parseJsonBody(req);
      const rawUrl = typeof body.url === 'string' ? body.url.trim() : '';
      if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Đường dẫn ảnh không hợp lệ (cần bắt đầu bằng http:// hoặc https://).'
        });
      }

      // Basic SSRF protection: reject localhost / private network hosts
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(rawUrl);
      } catch {
        return sendJson(res, 400, { ok: false, error: 'Đường dẫn URL không đúng định dạng.' });
      }
      const host = parsedUrl.hostname.toLowerCase();
      if (
        host === 'localhost' ||
        host === '0.0.0.0' ||
        host === '::1' ||
        host.endsWith('.local') ||
        /^127\./.test(host) ||
        /^10\./.test(host) ||
        /^192\.168\./.test(host) ||
        /^169\.254\./.test(host) ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
      ) {
        return sendJson(res, 400, { ok: false, error: 'Không hỗ trợ đường dẫn mạng nội bộ.' });
      }

      // Detect Google Drive file ID if present
      let driveId: string | null = null;
      const mPath = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/i);
      const mLh3 = rawUrl.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{10,})/i);
      if (mPath?.[1]) driveId = mPath[1];
      else if (mLh3?.[1]) driveId = mLh3[1];
      else if (/drive\.google\.com|docs\.google\.com/i.test(rawUrl)) {
        const idParam = parsedUrl.searchParams.get('id');
        if (idParam && /^[a-zA-Z0-9_-]{10,}$/.test(idParam)) driveId = idParam;
      }

      const candidates = driveId
        ? [
            `https://lh3.googleusercontent.com/d/${driveId}=w1600`,
            `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`,
            `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`
          ]
        : [rawUrl];

      let fetchedBuffer: Buffer | null = null;
      let fetchedType = 'image/jpeg';
      let sawGoogleLogin = false;

      for (const candidateUrl of candidates) {
        try {
          const resp = await fetch(candidateUrl, {
            redirect: 'follow',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; DucVinhSolarBot/1.0)'
            }
          });
          const finalUrl = resp.url || '';
          const ct = (resp.headers.get('content-type') || '').toLowerCase();
          if (finalUrl.includes('accounts.google.com')) {
            sawGoogleLogin = true;
            continue;
          }
          if (!resp.ok) continue;
          if (!ct.startsWith('image/')) {
            if (driveId && ct.includes('text/html')) {
              sawGoogleLogin = true;
            }
            continue;
          }
          const arrBuf = await resp.arrayBuffer();
          const buf = Buffer.from(arrBuf);
          if (buf.length > 0 && buf.length <= 12 * 1024 * 1024) {
            fetchedBuffer = buf;
            fetchedType = ct.split(';')[0].trim() || 'image/jpeg';
            break;
          }
        } catch {
          // try next candidate
        }
      }

      if (!fetchedBuffer) {
        if (driveId && sawGoogleLogin) {
          return sendJson(res, 403, {
            ok: false,
            isPrivateDrive: true,
            error:
              'Ảnh Google Drive này đang ở chế độ Riêng tư (Hạn chế) nên máy khác và điện thoại sẽ KHÔNG thấy được. Hãy mở thư mục/ảnh trên Google Drive -> Chia sẻ -> chọn "Bất kỳ ai có đường liên kết" (Người xem) rồi dán lại link!'
          });
        }
        return sendJson(res, 400, {
          ok: false,
          error: driveId
            ? 'Không tải được ảnh từ link Google Drive này. Vui lòng kiểm tra file đã bật chia sẻ công khai ("Bất kỳ ai có đường liên kết") chưa.'
            : 'Không tải được ảnh hợp lệ từ đường dẫn này.'
        });
      }

      const baseName = driveId ? `gdrive-${driveId.slice(0, 16)}` : `imported-${Date.now()}`;
      const safeFilename = sanitizeUploadFilename(baseName, fetchedType);
      const blobPath = `${STORE_NAME}/media/${Date.now()}-${safeFilename}`;

      const uploaded = await putPrivateBlob(blobPath, fetchedBuffer, {
        addRandomSuffix: true,
        contentType: fetchedType
      });

      const browserUrl = `/api/blob/media?pathname=${encodeURIComponent(uploaded.pathname)}`;
      return sendJson(res, 200, {
        ok: true,
        url: browserUrl,
        pathname: uploaded.pathname,
        size: fetchedBuffer.length,
        contentType: fetchedType,
        importedFromDrive: Boolean(driveId)
      });
    }

    // 5. POST /api/seed -> Safe seed that NEVER overwrites an existing Vercel Blob store
    if (method === 'POST' && pathname === '/api/seed') {
      const current = await readDatabaseState(true);
      if (hasValidContent(current)) {
        return sendJson(res, 200, { ok: true, seeded: false, state: current });
      }

      const { blobExists, errorOccurred } = await readRemoteBlobState();
      if (blobExists || errorOccurred) {
        return sendJson(res, 200, { ok: true, seeded: false, state: current });
      }

      const body = await parseJsonBody(req);
      const nextState = await writeDatabaseState({
        version: '3.4-ducvinhsolar-private-blob',
        storeName: STORE_NAME,
        storeId: getStoreId(),
        updatedAt: new Date().toISOString(),
        categories: Array.isArray(body.categories) ? body.categories : [],
        brands: Array.isArray(body.brands) ? body.brands : [],
        products: Array.isArray(body.products) ? body.products : [],
        projects: Array.isArray(body.projects) ? body.projects : [],
        blogPosts: Array.isArray(body.blogPosts) ? body.blogPosts : [],
        inquiries: Array.isArray(body.inquiries) ? body.inquiries : [],
        companyInfo: body.companyInfo || null,
        deletedIds: []
      });

      return sendJson(res, 200, { ok: true, seeded: true, state: nextState });
    }

    // 6. POST /api/restore -> Full replace or merge sync to Vercel Blob `store_gzvmZDzXfVh8EDzC`
    if (method === 'POST' && pathname === '/api/restore') {
      const body = await parseJsonBody(req);
      const mode = body.mode === 'merge' ? 'merge' : 'replace';
      const current = await readDatabaseState(true);
      const emptyDeleted = new Set<string>();

      const nextState: BlobDatabaseState =
        mode === 'replace'
          ? {
              version: '3.4-ducvinhsolar-private-blob',
              storeName: STORE_NAME,
              storeId: getStoreId(),
              updatedAt: new Date().toISOString(),
              categories: Array.isArray(body.categories) ? body.categories : current.categories,
              brands: Array.isArray(body.brands) ? body.brands : current.brands,
              products: Array.isArray(body.products) ? body.products : current.products,
              projects: Array.isArray(body.projects) ? body.projects : current.projects,
              blogPosts: Array.isArray(body.blogPosts) ? body.blogPosts : current.blogPosts,
              inquiries: Array.isArray(body.inquiries) ? body.inquiries : current.inquiries,
              companyInfo: body.companyInfo !== undefined ? body.companyInfo : current.companyInfo,
              deletedIds: []
            }
          : {
              version: '3.4-ducvinhsolar-private-blob',
              storeName: STORE_NAME,
              storeId: getStoreId(),
              updatedAt: new Date().toISOString(),
              categories: Array.isArray(body.categories)
                ? mergeById(current.categories, body.categories, emptyDeleted)
                : current.categories,
              brands: Array.isArray(body.brands)
                ? mergeById(current.brands, body.brands, emptyDeleted)
                : current.brands,
              products: Array.isArray(body.products)
                ? mergeById(current.products, body.products, emptyDeleted)
                : current.products,
              projects: Array.isArray(body.projects)
                ? mergeById(current.projects, body.projects, emptyDeleted)
                : current.projects,
              blogPosts: Array.isArray(body.blogPosts)
                ? mergeById(current.blogPosts, body.blogPosts, emptyDeleted)
                : current.blogPosts,
              inquiries: Array.isArray(body.inquiries)
                ? mergeById(current.inquiries, body.inquiries, emptyDeleted)
                : current.inquiries,
              companyInfo: body.companyInfo || current.companyInfo,
              deletedIds: current.deletedIds || []
            };

      const saved = await writeDatabaseState(nextState);
      return sendJson(res, 200, {
        ok: true,
        mode,
        storeName: STORE_NAME,
        storeId: getStoreId(),
        storeAccess: 'private',
        updatedAt: saved.updatedAt,
        blobConnected: true,
        storageMode: 'vercel-blob'
      });
    }

    // 7. Categories CRUD
    if (method === 'POST' && pathname === '/api/categories') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid category' });
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        clearDeletedId(current, item.id);
        current.categories = upsertById(current.categories, item, false);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/categories/')) {
      const id = decodeURIComponent(pathname.replace('/api/categories/', ''));
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        recordDeletedId(current, id);
        current.categories = current.categories.filter((c) => c.id !== id);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 8. Brands CRUD
    if (method === 'POST' && pathname === '/api/brands') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid brand' });
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        clearDeletedId(current, item.id);
        current.brands = upsertById(current.brands, item, false);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/brands/')) {
      const id = decodeURIComponent(pathname.replace('/api/brands/', ''));
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        recordDeletedId(current, id);
        current.brands = current.brands.filter((b) => b.id !== id);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 9. Products CRUD
    if (method === 'POST' && pathname === '/api/products') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid product' });
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        clearDeletedId(current, item.id);
        current.products = upsertById(current.products, item, true);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/products/')) {
      const id = decodeURIComponent(pathname.replace('/api/products/', ''));
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        recordDeletedId(current, id);
        current.products = current.products.filter((p) => p.id !== id);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 10. Projects CRUD
    if (method === 'POST' && pathname === '/api/projects') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid project' });
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        clearDeletedId(current, item.id);
        current.projects = upsertById(current.projects, item, true);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/projects/')) {
      const id = decodeURIComponent(pathname.replace('/api/projects/', ''));
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        recordDeletedId(current, id);
        current.projects = current.projects.filter((p) => p.id !== id);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 11. Blog Posts CRUD
    if (method === 'POST' && pathname === '/api/blog-posts') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid blog post' });
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        clearDeletedId(current, item.id);
        current.blogPosts = upsertById(current.blogPosts, item, true);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/blog-posts/')) {
      const id = decodeURIComponent(pathname.replace('/api/blog-posts/', ''));
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        recordDeletedId(current, id);
        current.blogPosts = current.blogPosts.filter((b) => b.id !== id);
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 12. Company Info update
    if (method === 'POST' && pathname === '/api/company-info') {
      const info = await parseJsonBody(req);
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        current.companyInfo = info;
        return writeDatabaseState(current);
      });
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 13. Inquiries CRUD
    if (method === 'POST' && pathname === '/api/inquiries') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid inquiry' });
      const saved = await withStateWriteLock(async () => {
        const current = await readDatabaseState(true);
        current.inquiries = upsertById(current.inquiries, item, true);
        return writeDatabaseState(current);
      });
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
