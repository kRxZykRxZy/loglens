import type { Request, RequestHandler } from 'express';
import { getProjects, addProject } from '../services/project-service.js';
import { AppError } from '../errors/app-error.js';
import { projectName } from '../validators/project.js';

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
    res
      .status(201)
      .json({ project: await addProject(requireUserId(req), projectName(req.body?.name)) });
  } catch (e) {
    next(e);
  }
};
