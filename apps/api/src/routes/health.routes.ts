import { Router } from 'express';
import type { HealthResponse } from '@loglens/shared';

export const healthRoutes = Router();

healthRoutes.get('/health', (_req, res) => {
  const body: HealthResponse = { ok: true, service: 'loglens-api' };
  res.json(body);
});
