import { AppError } from '../errors/app-error.js';
import { supabaseAnon } from '../supabase/clients.js';
import { ensureProfile, upsertProfile } from '../repositories/user-repository.js';
import { safeUser } from '../utils/safe-user.js';
import type { AuthUser } from '@loglens/shared';

type RegisterResult = { user: AuthUser };
type LoginResult = { user: AuthUser; session: { accessToken: string; refreshToken: string; expiresAt: string } };

export async function register(email: string, password: string): Promise<RegisterResult> {
  const { data, error } = await supabaseAnon().auth.signUp({ email, password });
  if (error) throw new AppError(400, error.message, 'REGISTRATION_FAILED');
  if (!data.user)
    throw new AppError(400, 'Registration did not return a user', 'REGISTRATION_FAILED');

  const profile = await upsertProfile(data.user.id, data.user.email ?? email);
  return { user: safeUser(profile) };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const { data, error } = await supabaseAnon().auth.signInWithPassword({ email, password });
  if (error) throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  if (!data.session)
    throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

const profile = await ensureProfile(data.user.id, data.user.email ?? email);
    return {
      user: safeUser(profile),
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: new Date((data.session.expires_at ?? 0) * 1000).toISOString(),
      },
    };
}

export async function logout() {
  // Server-side: tokens are self-contained and will expire on their own.
  // Client clears stored session. Revocation can be added later if needed.
}