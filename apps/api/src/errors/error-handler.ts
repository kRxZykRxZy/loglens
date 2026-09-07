import type { ErrorRequestHandler } from 'express';
import { AppError } from './app-error.js';
import { logger } from '../logger/logger.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const e = err instanceof AppError ? err : new AppError(500, 'Internal server error');
  const requestId = (req.headers['x-request-id'] as string | undefined) ?? '';
  if (e.status >= 500) {
    logger.error(e.message, {
      requestId,
      error: err instanceof Error ? err.stack : String(err),
      status: e.status,
      code: e.code,
    });
  }
  res.status(e.status).json({ error: e.message, code: e.code, requestId });
};
