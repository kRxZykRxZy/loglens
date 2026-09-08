import { query } from '../database/query.js';
import type { ApiKey } from '../types/api-key.js';

type KeyRow = {
  id: string;
  projectId: string;
  name: string;
  prefix: string;
  createdAt: string;
};

function toKey(r: KeyRow): ApiKey {
  return r;
}

export async function insertKey(
  id: string,
  projectId: string,
  name: string,
  hash: string,
  prefix: string,
): Promise<ApiKey> {
  const result = await query<KeyRow>(
    `insert into api_keys(id,project_id,name,key_hash,key_prefix)
     values($1,$2,$3,$4,$5)
     returning id, project_id as "projectId", name, key_prefix as prefix, created_at::text as "createdAt"`,
    [id, projectId, name, hash, prefix],
  );
  return toKey(result.rows[0]);
}

export async function listKeys(projectId: string): Promise<ApiKey[]> {
  const result = await query<KeyRow>(
    `select id, project_id as "projectId", name, key_prefix as prefix, created_at::text as "createdAt"
     from api_keys where project_id = $1 and revoked_at is null order by created_at desc`,
    [projectId],
  );
  return result.rows.map(toKey);
}

export async function updateKeyName(
  projectId: string,
  keyId: string,
  name: string,
): Promise<ApiKey | null> {
  const result = await query<KeyRow>(
    `update api_keys set name = $3
     where project_id = $1 and id = $2 and revoked_at is null
     returning id, project_id as "projectId", name, key_prefix as prefix, created_at::text as "createdAt"`,
    [projectId, keyId, name],
  );
  return result.rows[0] ? toKey(result.rows[0]) : null;
}

export async function revokeKey(projectId: string, keyId: string): Promise<void> {
  await query(
    `update api_keys set revoked_at = now() where project_id = $1 and id = $2 and revoked_at is null`,
    [projectId, keyId],
  );
}

export async function findKey(hash: string): Promise<(ApiKey & { keyPrefix: string }) | null> {
  const result = await query<ApiKey & { keyPrefix: string }>(
    `select id, project_id as "projectId", name, key_prefix as prefix, key_prefix as "keyPrefix", created_at::text as "createdAt"
     from api_keys where key_hash = $1 and revoked_at is null`,
    [hash],
  );
  return result.rows[0] ?? null;
}

export async function touchLastUsed(keyId: string): Promise<void> {
  await query('update api_keys set last_used_at = now() where id = $1', [keyId]);
}
