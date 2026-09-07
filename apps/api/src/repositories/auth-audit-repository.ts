import { query } from '../database/query.js';
import type { AuthEvent } from '../types/domain.js';

type AuthEventInput = { userId: string; event: string; ip?: string };

export async function insertAuthEvent(input: AuthEventInput): Promise<void> {
  await query(
    'INSERT INTO auth_events (id, user_id, event, ip) VALUES (gen_random_uuid(), $1, $2, $3::inet)',
    [input.userId, input.event, input.ip ?? null],
  );
}

export async function listAuthEvents(userId: string, limit = 50): Promise<AuthEvent[]> {
  const result = await query<AuthEvent>(
    'SELECT id, user_id, event, ip, created_at::text AS created_at FROM auth_events WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit],
  );
  return result.rows;
}
