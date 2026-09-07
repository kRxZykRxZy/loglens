import type { AuthUser } from '@loglens/shared';
import type { UserProfileRow } from '../types/user.js';

export const safeUser = (u: UserProfileRow): AuthUser => ({
  id: u.id,
  email: u.email,
  createdAt: u.created_at.toISOString(),
});
