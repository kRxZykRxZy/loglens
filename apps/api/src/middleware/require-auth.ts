import type { Request, RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import { extractBearerToken, verifyAccessToken } from '../supabase/auth-verify.js';

export type AuthenticatedRequest = Request & {
  userId?: string;
  userEmail?: string | null;
};

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
    const user = await verifyAccessToken(token);
    if (!user) throw new AppError(401, 'Invalid or expired session', 'UNAUTHENTICATED');
    const authed = req as AuthenticatedRequest;
    authed.userId = user.id;
    authed.userEmail = user.email ?? null;
    next();
  } catch (e) {
    next(e);
  }
};
