import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

vi.mock('../supabase/auth-verify.js', () => ({
  extractBearerToken: vi.fn(),
  verifyAccessToken: vi.fn(),
}));

import { requireAuth } from '../middleware/require-auth.js';
import { extractBearerToken, verifyAccessToken } from '../supabase/auth-verify.js';

function mockRes() {
  const res = {} as Response;
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn();
  res.sendStatus = vi.fn();
  return res;
}

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects requests without a bearer token', async () => {
    vi.mocked(extractBearerToken).mockReturnValue(null);
    const next = vi.fn();
    await requireAuth({ headers: {} } as Request, mockRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0] as { status: number; code: string };
    expect(err.status).toBe(401);
    expect(err.code).toBe('UNAUTHENTICATED');
    expect(verifyAccessToken).not.toHaveBeenCalled();
  });

  it('rejects invalid or expired tokens', async () => {
    vi.mocked(extractBearerToken).mockReturnValue('abc.def.ghi');
    vi.mocked(verifyAccessToken).mockResolvedValue(null);
    const next = vi.fn();
    await requireAuth(
      { headers: { authorization: 'Bearer abc.def.ghi' } } as Request,
      mockRes(),
      next,
    );
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0] as { status: number; code: string };
    expect(err.status).toBe(401);
    expect(err.code).toBe('UNAUTHENTICATED');
  });

  it('attaches the user id and email for valid tokens', async () => {
    const req = { headers: { authorization: 'Bearer valid.token' } } as Request & {
      userId?: string;
      userEmail?: string | null;
    };
    vi.mocked(extractBearerToken).mockReturnValue('valid.token');
    vi.mocked(verifyAccessToken).mockResolvedValue({ id: 'user-1', email: 'dev@example.com' });
    const next = vi.fn();
    await requireAuth(req, mockRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeUndefined();
    expect(req.userId).toBe('user-1');
    expect(req.userEmail).toBe('dev@example.com');
  });
});
