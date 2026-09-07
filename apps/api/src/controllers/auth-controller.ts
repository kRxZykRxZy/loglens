import type { RequestHandler } from 'express';
import { credentials } from '../validators/auth.js';
import * as auth from '../services/auth-service.js';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const c = credentials(req.body);
    const result = await auth.register(c.email, c.password);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const c = credentials(req.body);
    const result = await auth.login(c.email, c.password);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const logout: RequestHandler = async (_req, res, next) => {
  try {
    await auth.logout();
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
