import type { ErrorRequestHandler } from 'express';
import { AppError } from './app-error.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const e = err instanceof AppError ? err : new AppError(500, 'Internal server error');
  res.status(e.status).json({ error: e.message, code: e.code });
};
