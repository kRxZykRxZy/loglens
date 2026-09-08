import { randomUUID } from 'node:crypto';
import { requirePermission } from './authorize-service.js';
import { insertAuthEvent } from '../repositories/auth-audit-repository.js';
import {
  insertKey,
  listKeys,
  revokeKey,
  updateKeyName,
} from '../repositories/api-key-repository.js';
import { generateApiKey, hashApiKey } from '../utils/api-key.js';

export async function createApiKey(projectId: string, userId: string, name: string) {
  await requirePermission(projectId, userId, 'write');
  const { plaintext, hash, prefix } = generateApiKey();
  const key = await insertKey(randomUUID(), projectId, name.trim(), hash, prefix);
  await insertAuthEvent({ userId, event: 'project.api_key_created' });
  return { key, plaintext };
}

export async function listApiKeys(projectId: string, userId: string) {
  await requirePermission(projectId, userId, 'read');
  return listKeys(projectId);
}

export async function renameApiKey(projectId: string, userId: string, keyId: string, name: string) {
  await requirePermission(projectId, userId, 'write');
  return updateKeyName(projectId, keyId, name.trim());
}

export async function revokeApiKey(projectId: string, userId: string, keyId: string) {
  await requirePermission(projectId, userId, 'write');
  await revokeKey(projectId, keyId);
  await insertAuthEvent({ userId, event: 'project.api_key_revoked' });
}

export async function rotateApiKey(projectId: string, userId: string, keyId: string) {
  await requirePermission(projectId, userId, 'write');
  await revokeKey(projectId, keyId);
  const { plaintext, hash, prefix } = generateApiKey();
  const key = await insertKey(randomUUID(), projectId, 'rotated-key', hash, prefix);
  await insertAuthEvent({ userId, event: 'project.api_key_rotated' });
  return { key, plaintext };
}

export function hashKey(plaintext: string) {
  return hashApiKey(plaintext);
}
