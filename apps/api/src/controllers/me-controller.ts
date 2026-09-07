import type { Request, RequestHandler } from 'express';
import { findById } from '../repositories/user-repository.js';
import { safeUser } from '../utils/safe-user.js';
import { AppError } from '../errors/app-error.js';

type AuthenticatedRequest = Request & { userId?: string };

export const me: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    if (!userId) throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
    const profile = await findById(userId);
    if (!profile) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    res.json({ user: safeUser(profile) });
  } catch (e) {
    next(e);
  }
};
