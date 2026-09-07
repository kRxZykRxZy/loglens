import { query } from '../database/query.js';
import type { UserProfileRow } from '../types/user.js';

export async function findByEmail(email: string) {
  const r = await query<UserProfileRow>('select * from user_profiles where email=$1', [
    email.toLowerCase(),
  ]);
  return r.rows[0] ?? null;
}

export async function findById(id: string) {
  const r = await query<UserProfileRow>('select * from user_profiles where id=$1', [id]);
  return r.rows[0] ?? null;
}

export async function upsertProfile(userId: string, email: string) {
  const r = await query<UserProfileRow>(
    `insert into user_profiles(id,email) values($1,$2)
     on conflict(id) do update set email=excluded.email
     returning *`,
    [userId, email.toLowerCase()],
  );
  return r.rows[0];
}

export async function ensureProfile(userId: string, email: string) {
  const existing = await findById(userId);
  if (existing) return existing;
  return upsertProfile(userId, email);
}
