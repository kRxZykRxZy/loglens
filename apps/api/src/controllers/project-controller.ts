import type { Request, RequestHandler } from 'express';
import { getProjects, addProject } from '../services/project-service.js';
import { AppError } from '../errors/app-error.js';

type AuthenticatedRequest = Request & { userId?: string };

function requireUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;
  if (!userId) throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
  return userId;
}

export const list: RequestHandler = async (req, res, next) => {
  try {
    res.json({ projects: await getProjects(requireUserId(req)) });
  } catch (e) {
    next(e);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    if (typeof req.body?.name !== 'string' || !req.body.name.trim())
      throw new AppError(400, 'Project name is required', 'INVALID_PROJECT');
    res.status(201).json({ project: await addProject(requireUserId(req), req.body.name) });
  } catch (e) {
    next(e);
  }
};
