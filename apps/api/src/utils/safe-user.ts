import type { AuthUser } from '@loglens/shared';
import type { UserRow } from '../types/user.js';
export const safeUser = (u: UserRow): AuthUser => ({
  id: u.id,
  email: u.email,
  createdAt: u.created_at.toISOString(),
});
