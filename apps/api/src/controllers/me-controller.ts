import type { Request, RequestHandler } from 'express';
import { findUserById } from '../repositories/user-repository.js';
export const me: RequestHandler = async (req, res, next) => {
  try {
    const user = await findUserById((req as Request & { userId?: string }).userId!);
    res.json({ user: user && { id: user.id, email: user.email, createdAt: user.created_at } });
  } catch (e) {
    next(e);
  }
};
