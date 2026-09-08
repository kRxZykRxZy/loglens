import type { Request, RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import {
  createApiKey,
  listApiKeys,
  renameApiKey,
  revokeApiKey,
  rotateApiKey,
} from '../services/api-key-service.js';
import { apiKeyName, uuid } from '../validators/project.js';

type AuthenticatedRequest = Request & { userId?: string };

function requireUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;
  if (!userId) throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
  return userId;
}

export const create: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const { key, plaintext } = await createApiKey(
      projectId,
      requireUserId(req),
      apiKeyName(req.body?.name),
    );
    res.status(201).json({ key, plaintext });
  } catch (e) {
    next(e);
  }
};

export const list: RequestHandler = async (req, res, next) => {
  try {
    const keys = await listApiKeys(uuid(req.params.projectId), requireUserId(req));
    res.json({ keys });
  } catch (e) {
    next(e);
  }
};

export const rename: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const keyId = uuid(req.params.keyId);
    const key = await renameApiKey(
      projectId,
      requireUserId(req),
      keyId,
      apiKeyName(req.body?.name),
    );
    res.json({ key });
  } catch (e) {
    next(e);
  }
};

export const revoke: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const keyId = uuid(req.params.keyId);
    await revokeApiKey(projectId, requireUserId(req), keyId);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

export const rotate: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const keyId = uuid(req.params.keyId);
    const { key, plaintext } = await rotateApiKey(projectId, requireUserId(req), keyId);
    res.json({ key, plaintext });
  } catch (e) {
    next(e);
  }
};
