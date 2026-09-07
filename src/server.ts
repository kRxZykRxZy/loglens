import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v4 as uuid } from 'uuid';
import { initializeDatabase, query } from './db.js';
import { createSession, destroySession, getAuthenticatedUser, hashPassword, requireAuth, verifyPassword } from './auth.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'loglens' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');
    if (!email || !email.includes('@') || password.length < 8) {
      res.status(400).json({ error: 'Valid email and password of at least 8 characters are required' });
      return;
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const userId = uuid();
    await query('INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)', [userId, email, await hashPassword(password)]);
    await createSession(userId, res);
    res.status(201).json({ user: { id: userId, email } });
  } catch {
    res.status(500).json({ error: 'Unable to create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');
    const result = await query<{ id: string; email: string; password_hash: string }>('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    await createSession(user.id, res);
    res.json({ user: { id: user.id, email: user.email } });
  } catch {
    res.status(500).json({ error: 'Unable to sign in' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    await destroySession(req, res);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Unable to sign out' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ user });
});

app.get('/api/projects', requireAuth, async (_req, res) => {
  const user = res.locals.user as { id: string };
  const result = await query('SELECT id, name, slug, created_at FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [user.id]);
  res.json({ projects: result.rows });
});

app.post('/api/projects', requireAuth, async (req, res) => {
  try {
    const user = res.locals.user as { id: string };
    const name = String(req.body?.name ?? '').trim();
    if (!name || name.length > 100) {
      res.status(400).json({ error: 'Project name is required and must be under 100 characters' });
      return;
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || `project-${Date.now()}`;
    const projectId = uuid();
    await query('INSERT INTO projects (id, user_id, name, slug) VALUES ($1, $2, $3, $4)', [projectId, user.id, name, slug]);
    res.status(201).json({ project: { id: projectId, name, slug } });
  } catch {
    res.status(500).json({ error: 'Unable to create project' });
  }
});

app.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LogLens</title></head><body><main><h1>LogLens</h1><p>Developer logging, without the noise.</p><p>API: <code>/api</code></p></main></body></html>`);
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

initializeDatabase()
  .then(() => app.listen(port, () => console.log(`LogLens listening on :${port}`)))
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
