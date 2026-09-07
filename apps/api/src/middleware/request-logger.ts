import type { RequestHandler } from 'express';
import { logger } from '../logger/logger.js';

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = performance.now();
  const requestId = (req.headers['x-request-id'] as string | undefined) ?? '';
  res.on('finish', () => {
    const durationMs = Math.round(performance.now() - start);
    logger.info(`${req.method} ${req.originalUrl}`, {
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
    });
  });
  next();
};