import type { Request, RequestHandler } from 'express';
import { findUserById } from '../repositories/user-repository.js';
import { safeUser } from '../utils/safe-user.js';
import { AppError } from '../errors/app-error.js';

export const me: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    if (!userId) throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
    const user = await findUserById(userId);
    if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    res.json({ user: safeUser(user) });
  } catch (e) {
    next(e);
  }
};
