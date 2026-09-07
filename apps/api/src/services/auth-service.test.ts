import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../supabase/clients.js', () => ({
  supabaseAnon: vi.fn(),
}));

vi.mock('../repositories/user-repository.js', () => ({
  ensureProfile: vi.fn(),
  upsertProfile: vi.fn(),
}));

import { register, login, logout } from '../services/auth-service.js';
import { supabaseAnon } from '../supabase/clients.js';
import { ensureProfile, upsertProfile } from '../repositories/user-repository.js';
import type { UserProfileRow } from '../types/user.js';

const row: UserProfileRow = {
  id: 'auth-user-id',
  email: 'dev@example.com',
  created_at: new Date('2025-01-01T00:00:00Z'),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(upsertProfile).mockResolvedValue(row);
  vi.mocked(ensureProfile).mockResolvedValue(row);
});

describe('auth-service', () => {
  it('maps a successful signUp to a safe user profile', async () => {
    vi.mocked(supabaseAnon).mockReturnValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { user: { id: 'auth-user-id', email: 'dev@example.com' } },
          error: null,
        }),
      },
    } as never);

    const result = await register('Dev@Example.com', 'password123');
    expect(upsertProfile).toHaveBeenCalledWith('auth-user-id', 'dev@example.com');
    expect(result.user).toEqual({ id: 'auth-user-id', email: 'dev@example.com', createdAt: '2025-01-01T00:00:00.000Z' });
  });

  it('maps a supabase signUp error to an AppError', async () => {
    vi.mocked(supabaseAnon).mockReturnValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'User already registered' },
        }),
      },
    } as never);

    await expect(register('a@b.com', 'password123')).rejects.toMatchObject({
      status: 400,
      code: 'REGISTRATION_FAILED',
    });
  });

  it('maps an invalid login to an AppError', async () => {
    vi.mocked(supabaseAnon).mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials' },
        }),
      },
    } as never);

    await expect(login('a@b.com', 'wrongpass')).rejects.toMatchObject({
      status: 401,
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('returns a session alongside the profile for a successful login', async () => {
    vi.mocked(supabaseAnon).mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: {
            user: { id: 'auth-user-id', email: 'dev@example.com' },
            session: { access_token: 'at', refresh_token: 'rt', expires_at: 1760000000 },
          },
          error: null,
        }),
      },
    } as never);

    const result = await login('dev@example.com', 'password123');
    expect(ensureProfile).toHaveBeenCalledWith('auth-user-id', 'dev@example.com');
    expect(result.user.id).toBe('auth-user-id');
    expect(result.session.accessToken).toBe('at');
  });

  it('logout resolves without error (stateless)', async () => {
    await expect(logout()).resolves.toBeUndefined();
  });
});