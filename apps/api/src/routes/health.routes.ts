import { Router } from 'express';
import type { HealthResponse } from '@loglens/shared';
import { pool } from '../database/pool.js';

export const healthRoutes = Router();

healthRoutes.get('/health', (_req, res) => {
  const body: HealthResponse = { ok: true, service: 'loglens-api' };
  res.json(body);
});

healthRoutes.get('/health/ready', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, service: 'loglens-api', database: 'connected' });
  } catch {
    res.status(503).json({ ok: false, service: 'loglens-api', database: 'unavailable' });
  }
});
