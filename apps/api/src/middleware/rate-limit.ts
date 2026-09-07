import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();
const CLEANUP_INTERVAL_MS = 60_000;

let cleanupTimer: NodeJS.Timeout | undefined;

function sweepBuckets(now: number): void {
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < CLEANUP_INTERVAL_MS);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

function scheduleCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setTimeout(() => {
    cleanupTimer = undefined;
    sweepBuckets(Date.now());
    scheduleCleanup();
  }, CLEANUP_INTERVAL_MS);
  cleanupTimer.unref?.();
}

export function rateLimit(
  opts: { windowMs?: number; max?: number; keyPrefix?: string } = {},
): RequestHandler {
  const windowMs = opts.windowMs ?? 60_000;
  const max = opts.max ?? 120;
  const keyPrefix = opts.keyPrefix ?? 'rl';

  return (req, res, next) => {
    const key = `${keyPrefix}:${req.ip ?? 'unknown'}`;
    const now = Date.now();
    const bucket = buckets.get(key) ?? { timestamps: [] };
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
    buckets.set(key, bucket);
    scheduleCleanup();

    if (bucket.timestamps.length >= max) {
      res.set('Retry-After', String(Math.ceil(windowMs / 1000)));
      return next(new AppError(429, 'Too many requests, please try again later', 'RATE_LIMITED'));
    }
    bucket.timestamps.push(now);
    next();
  };
}

export function resetRateLimiters(): void {
  buckets.clear();
  if (cleanupTimer) {
    clearTimeout(cleanupTimer);
    cleanupTimer = undefined;
  }
}
