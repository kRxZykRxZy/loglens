import crypto from 'node:crypto';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { parse, serialize } from 'cookie';
import { query } from './db.js';

const SESSION_COOKIE = 'loglens_session';
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS ?? 30);

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, response: Response): Promise<void> {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86400000);

  await query(
    'INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)',
    [uuid(), userId, hashToken(token), expiresAt],
  );

  response.append('Set-Cookie', serialize(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  }));
}

export async function destroySession(request: Request, response: Response): Promise<void> {
  const token = parse(request.headers.cookie ?? '')[SESSION_COOKIE];
  if (token) await query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
  response.append('Set-Cookie', serialize(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 }));
}

export async function getAuthenticatedUser(request: Request): Promise<{ id: string; email: string } | null> {
  const token = parse(request.headers.cookie ?? '')[SESSION_COOKIE];
  if (!token) return null;

  const result = await query<{ id: string; email: string }>(
    `SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
    [hashToken(token)],
  );

  return result.rows[0] ?? null;
}

export async function requireAuth(request: Request, response: Response, next: NextFunction): Promise<void> {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    response.status(401).json({ error: 'Authentication required' });
    return;
  }
  response.locals.user = user;
  next();
}
