import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUsers } from './src/db/users.ts';
import {
  getAllCatalogState,
  upsertCategoryInPostgres,
  deleteCategoryFromPostgres,
  upsertBrandInPostgres,
  deleteBrandFromPostgres,
  upsertProductInPostgres,
  deleteProductFromPostgres,
  upsertProjectInPostgres,
  deleteProjectFromPostgres,
  upsertBlogPostInPostgres,
  deleteBlogPostFromPostgres,
  upsertInquiryInPostgres,
  deleteInquiryFromPostgres,
  upsertCompanyInfoInPostgres,
  restoreAllStateInPostgres,
} from './src/db/repository.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // Authenticated user sync & listing endpoint (Cloud SQL + Firebase Auth integration)
  app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.user?.uid && req.user?.email) {
        await getOrCreateUser(req.user.uid, req.user.email);
      }
      const users = await getUsers();
      res.json(users);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      console.error('Failed to fetch users:', error);
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || '';
      if (!uid) {
        return res.status(400).json({ error: 'Missing user uid' });
      }
      const userRecord = await getOrCreateUser(uid, email);
      res.json(userRecord);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sync user';
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: message });
    }
  });

  // Public catalog state endpoint from PostgreSQL
  app.get('/api/state', async (_req, res) => {
    try {
      const state = await getAllCatalogState();
      res.json(state);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch state';
      console.error('Error in GET /api/state:', error);
      res.status(500).json({ error: message });
    }
  });

  // Public customer inquiry submission endpoint to PostgreSQL
  app.post('/api/inquiries', async (req, res) => {
    try {
      await upsertInquiryInPostgres(req.body);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to submit inquiry';
      console.error('Error in POST /api/inquiries:', error);
      res.status(500).json({ error: message });
    }
  });

  // Categories CRUD in PostgreSQL
  app.post('/api/categories', async (req, res) => {
    try {
      await upsertCategoryInPostgres(req.body);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save category';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      await deleteCategoryFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete category';
      res.status(500).json({ error: message });
    }
  });

  // Brands CRUD in PostgreSQL
  app.post('/api/brands', async (req, res) => {
    try {
      await upsertBrandInPostgres(req.body);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save brand';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/brands/:id', async (req, res) => {
    try {
      await deleteBrandFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete brand';
      res.status(500).json({ error: message });
    }
  });

  // Products CRUD in PostgreSQL
  app.post('/api/products', async (req, res) => {
    try {
      await upsertProductInPostgres(req.body);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save product';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      await deleteProductFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      res.status(500).json({ error: message });
    }
  });

  // Projects CRUD in PostgreSQL
  app.post('/api/projects', async (req, res) => {
    try {
      await upsertProjectInPostgres(req.body);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save project';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      await deleteProjectFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete project';
      res.status(500).json({ error: message });
    }
  });

  // Blog Posts CRUD in PostgreSQL
  app.post('/api/blog-posts', async (req, res) => {
    try {
      await upsertBlogPostInPostgres(req.body);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save blog post';
      res.status(500).json({ error: message });
    }
  });

  app.delete('/api/blog-posts/:id', async (req, res) => {
    try {
      await deleteBlogPostFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete blog post';
      res.status(500).json({ error: message });
    }
  });

  // Inquiries delete in PostgreSQL
  app.delete('/api/inquiries/:id', async (req, res) => {
    try {
      await deleteInquiryFromPostgres(req.params.id);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete inquiry';
      res.status(500).json({ error: message });
    }
  });

  // Company Info update in PostgreSQL
  app.post('/api/company-info', async (req, res) => {
    try {
      await upsertCompanyInfoInPostgres(req.body);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save company info';
      res.status(500).json({ error: message });
    }
  });

  // Bulk seed & backup restore in PostgreSQL
  app.post('/api/seed', async (req, res) => {
    try {
      await restoreAllStateInPostgres({ ...req.body, mode: 'merge' });
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to seed database';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/restore', async (req, res) => {
    try {
      await restoreAllStateInPostgres(req.body);
      res.json({ ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to restore database';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
