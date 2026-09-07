import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import * as account from '../services/account-service.js';
import { extractBearerToken } from '../supabase/auth-verify.js';

function requireToken(req: { headers: { authorization?: string } }): string {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
  return token;
}

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email : '';
    if (!email) throw new AppError(400, 'Email is required', 'INVALID_EMAIL');
    const redirectTo = typeof req.body.redirectTo === 'string' ? req.body.redirectTo : undefined;
    await account.requestPasswordReset(email, redirectTo);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

export const resendConfirmation: RequestHandler = async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email : '';
    if (!email) throw new AppError(400, 'Email is required', 'INVALID_EMAIL');
    await account.resendConfirmation(email);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

export const exportAccount: RequestHandler = async (req, res, next) => {
  try {
    const data = await account.exportAccount(requireToken(req), req.ip);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="loglens-export-${new Date().toISOString().slice(0, 10)}.json"`,
    );
    res.type('application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (e) {
    next(e);
  }
};

export const deleteAccount: RequestHandler = async (req, res, next) => {
  try {
    await account.deleteAccount(requireToken(req), req.ip);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

export const revokeSessions: RequestHandler = async (req, res, next) => {
  try {
    res.json(await account.revokeAllSessions(requireToken(req), req.ip));
  } catch (e) {
    next(e);
  }
};

export const auditEvents: RequestHandler = async (req, res, next) => {
  try {
    res.json({ events: await account.listAccountAuditEvents(requireToken(req)) });
  } catch (e) {
    next(e);
  }
};
