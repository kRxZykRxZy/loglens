import { query } from '../database/query.js';
export async function createSession(id: string, userId: string, hash: string, expires: Date) {
  await query('insert into sessions(id,user_id,token_hash,expires_at) values($1,$2,$3,$4)', [
    id,
    userId,
    hash,
    expires,
  ]);
}
export async function findSession(hash: string) {
  const r = await query<{ user_id: string; expires_at: Date }>(
    'select user_id,expires_at from sessions where token_hash=$1',
    [hash],
  );
  return r.rows[0] ?? null;
}
export async function deleteSession(hash: string) {
  await query('delete from sessions where token_hash=$1', [hash]);
}
