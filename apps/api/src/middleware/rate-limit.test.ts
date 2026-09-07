import { describe, it, expect, vi, afterEach } from 'vitest';
import { rateLimit, resetRateLimiters } from './rate-limit.js';
import type { NextFunction, Request, Response } from 'express';

function fakeReq(): Partial<Request> {
  return { ip: '203.0.113.7' };
}

function fakeRes() {
  const res: Partial<Response> = { set: vi.fn(() => res as Response) } as Response;
  return res;
}

afterEach(() => {
  resetRateLimiters();
});

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const next = vi.fn();
    const handler = rateLimit({ windowMs: 60_000, max: 3, keyPrefix: 'test-allow' });
    for (let i = 0; i < 3; i++) {
      handler(fakeReq() as Request, fakeRes(), next as unknown as NextFunction);
    }
    expect(next).toHaveBeenCalledTimes(3);
    expect(next).not.toHaveBeenCalledWith(expect.anything());
  });

  it('rejects requests over the limit with RATE_LIMITED', () => {
    const next = vi.fn();
    const handler = rateLimit({ windowMs: 60_000, max: 2, keyPrefix: 'test-reject' });
    handler(fakeReq() as Request, fakeRes(), next as unknown as NextFunction);
    handler(fakeReq() as Request, fakeRes(), next as unknown as NextFunction);
    handler(fakeReq() as Request, fakeRes(), next as unknown as NextFunction);
    expect(next).toHaveBeenCalledTimes(3);
    const error = next.mock.calls[2][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(429);
    expect(error.code).toBe('RATE_LIMITED');
  });

  it('separates buckets by key prefix', () => {
    const next = vi.fn();
    const a = rateLimit({ windowMs: 60_000, max: 1, keyPrefix: 'test-multi-a' });
    const b = rateLimit({ windowMs: 60_000, max: 1, keyPrefix: 'test-multi-b' });
    a(fakeReq() as Request, fakeRes(), next as unknown as NextFunction);
    b(fakeReq() as Request, fakeRes(), next as unknown as NextFunction);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next.mock.calls[0][0]).toBeUndefined();
    expect(next.mock.calls[1][0]).toBeUndefined();
  });
});
