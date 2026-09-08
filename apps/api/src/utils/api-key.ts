import { createHash, randomBytes } from 'node:crypto';

export type GeneratedApiKey = { plaintext: string; hash: string; prefix: string };

const KEY_PREFIX = 'll_live';
const PREFIX_CHARS = 16;

export function generateApiKey(): GeneratedApiKey {
  const id = randomBytes(12).toString('hex');
  const secret = randomBytes(24).toString('hex');
  const plaintext = `${KEY_PREFIX}_${id}_${secret}`;
  return {
    plaintext,
    hash: hashApiKey(plaintext),
    prefix: plaintext.slice(0, PREFIX_CHARS),
  };
}

export function hashApiKey(plaintext: string): string {
  return createHash('sha256').update(plaintext, 'utf8').digest('hex');
}
