import type { RequestHandler } from 'express';
import { credentials } from '../validators/auth.js';
import * as auth from '../services/auth-service.js';
import { sessionCookie, clearSession, readSession } from '../auth/cookies.js';
import { revoke } from '../services/session-service.js';
export const register: RequestHandler = async (req, res, next) => {
  try {
    const c = credentials(req.body);
    const out = await auth.register(c.email, c.password);
    res.setHeader('Set-Cookie', sessionCookie(out.token));
    res.status(201).json({ user: out.user });
  } catch (e) {
    next(e);
  }
};
export const login: RequestHandler = async (req, res, next) => {
  try {
    const c = credentials(req.body);
    const out = await auth.login(c.email, c.password);
    res.setHeader('Set-Cookie', sessionCookie(out.token));
    res.json({ user: out.user });
  } catch (e) {
    next(e);
  }
};
export const logout: RequestHandler = async (req, res, next) => {
  try {
    const t = readSession(req.headers.cookie);
    if (t) await revoke(t);
    res.setHeader('Set-Cookie', clearSession());
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
