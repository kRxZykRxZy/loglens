import type { UserRow } from '../types/user.js';
export const safeUser = (u: UserRow) => ({ id: u.id, email: u.email, createdAt: u.created_at });
