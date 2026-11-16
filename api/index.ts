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

function upsertById<T extends { id: string }>(items: T[], item: T, prependNew = false): T[] {
  const idx = items.findIndex((existing) => existing.id === item.id);
  if (idx >= 0) {
    const updated = [...items];
    updated[idx] = { ...updated[idx], ...item };
    return updated;
  }
  return prependNew ? [item, ...items] : [...items, item];
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

    // 3. GET /api/blob/media -> Serve private Vercel Blob media using `get(pathname, { access: 'private', storeId })`
    if (method === 'GET' && pathname === '/api/blob/media') {
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
      res.setHeader('Cache-Control', 'private, no-cache');
      res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return res.end(buffer);
    }

    // 4. POST /api/blob/upload -> Upload image file to private Vercel Blob Store `store_gzvmZDzXfVh8EDzC`
    if (method === 'POST' && pathname === '/api/blob/upload') {
      const body = await parseJsonBody(req);
      const dataUrl = typeof body.dataUrl === 'string' ? body.dataUrl : '';
      const rawFilename =
        typeof body.filename === 'string' ? body.filename : `image-${Date.now()}.jpg`;
      const safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '-');

      if (!dataUrl) {
        return sendJson(res, 400, { ok: false, error: 'Missing dataUrl' });
      }

      if (dataUrl.startsWith('data:')) {
        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1] || 'image/jpeg';
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
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
            storageMode: 'vercel-blob'
          });
        }
      }

      return sendJson(res, 200, {
        ok: true,
        storeName: STORE_NAME,
        url: dataUrl,
        storageMode: 'vercel-blob'
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
      const current = await readDatabaseState();
      clearDeletedId(current, item.id);
      current.categories = upsertById(current.categories, item, false);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/categories/')) {
      const id = decodeURIComponent(pathname.replace('/api/categories/', ''));
      const current = await readDatabaseState();
      recordDeletedId(current, id);
      current.categories = current.categories.filter((c) => c.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 8. Brands CRUD
    if (method === 'POST' && pathname === '/api/brands') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid brand' });
      const current = await readDatabaseState();
      clearDeletedId(current, item.id);
      current.brands = upsertById(current.brands, item, false);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/brands/')) {
      const id = decodeURIComponent(pathname.replace('/api/brands/', ''));
      const current = await readDatabaseState();
      recordDeletedId(current, id);
      current.brands = current.brands.filter((b) => b.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 9. Products CRUD
    if (method === 'POST' && pathname === '/api/products') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid product' });
      const current = await readDatabaseState();
      clearDeletedId(current, item.id);
      current.products = upsertById(current.products, item, true);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/products/')) {
      const id = decodeURIComponent(pathname.replace('/api/products/', ''));
      const current = await readDatabaseState();
      recordDeletedId(current, id);
      current.products = current.products.filter((p) => p.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 10. Projects CRUD
    if (method === 'POST' && pathname === '/api/projects') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid project' });
      const current = await readDatabaseState();
      clearDeletedId(current, item.id);
      current.projects = upsertById(current.projects, item, true);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/projects/')) {
      const id = decodeURIComponent(pathname.replace('/api/projects/', ''));
      const current = await readDatabaseState();
      recordDeletedId(current, id);
      current.projects = current.projects.filter((p) => p.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 11. Blog Posts CRUD
    if (method === 'POST' && pathname === '/api/blog-posts') {
      const item = await parseJsonBody(req);
      if (!item || !item.id) return sendJson(res, 400, { ok: false, error: 'Invalid blog post' });
      const current = await readDatabaseState();
      clearDeletedId(current, item.id);
      current.blogPosts = upsertById(current.blogPosts, item, true);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }
    if (method === 'DELETE' && pathname.startsWith('/api/blog-posts/')) {
      const id = decodeURIComponent(pathname.replace('/api/blog-posts/', ''));
      const current = await readDatabaseState();
      recordDeletedId(current, id);
      current.blogPosts = current.blogPosts.filter((b) => b.id !== id);
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 12. Company Info update
    if (method === 'POST' && pathname === '/api/company-info') {
      const info = await parseJsonBody(req);
      const current = await readDatabaseState();
      current.companyInfo = info;
      const saved = await writeDatabaseState(current);
      return sendJson(res, 200, { ok: true, updatedAt: saved.updatedAt });
    }

    // 13. Inquiries CRUD
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
