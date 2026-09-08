import type { Request, RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import {
  acceptMemberInvite,
  addProject,
  archiveProject,
  deleteMember,
  editProjectDescription,
  getProject,
  getProjectMembers,
  getProjects,
  inviteMemberByEmail,
  leaveProjectService,
  removeProject,
  renameProject,
  setMemberRole,
  transferOwnership,
} from '../services/project-service.js';
import { projectName, projectDescription, projectRole, uuid } from '../validators/project.js';
import { isEmail } from '@loglens/validation';

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

export const read: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    res.json({ project: await getProject(projectId, requireUserId(req)) });
  } catch (e) {
    next(e);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const userId = requireUserId(req);
    const body = req.body as Record<string, unknown>;
    let project = await getProject(projectId, userId);
    if (body.name !== undefined) {
      project = await renameProject(projectId, userId, projectName(body.name));
    }
    if (body.description !== undefined) {
      project = await editProjectDescription(
        projectId,
        userId,
        projectDescription(body.description) ?? null,
      );
    }
    res.json({ project });
  } catch (e) {
    next(e);
  }
};

export const setArchive: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const archived = Boolean(req.body?.archived);
    res.json({ project: await archiveProject(projectId, requireUserId(req), archived) });
  } catch (e) {
    next(e);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    await removeProject(uuid(req.params.projectId), requireUserId(req));
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

export const listMembers: RequestHandler = async (req, res, next) => {
  try {
    const members = await getProjectMembers(uuid(req.params.projectId), requireUserId(req));
    res.json({ members });
  } catch (e) {
    next(e);
  }
};

export const invite: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const role = projectRole(req.body?.role);
    const email = req.body?.email;
    if (typeof email !== 'string' || !isEmail(email)) {
      throw new AppError(400, 'A valid email is required', 'INVALID_EMAIL');
    }
    const members = await inviteMemberByEmail(projectId, requireUserId(req), email, role);
    res.json({ members });
  } catch (e) {
    next(e);
  }
};

export const acceptInvite: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const members = await acceptMemberInvite(projectId, requireUserId(req));
    res.json({ members });
  } catch (e) {
    next(e);
  }
};

export const leave: RequestHandler = async (req, res, next) => {
  try {
    await leaveProjectService(uuid(req.params.projectId), requireUserId(req));
    res.json({ left: true });
  } catch (e) {
    next(e);
  }
};

export const changeMemberRole: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const targetUserId = uuid(req.params.userId);
    const role = projectRole(req.body?.role);
    const members = await setMemberRole(projectId, requireUserId(req), targetUserId, role);
    res.json({ members });
  } catch (e) {
    next(e);
  }
};

export const removeMember: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const targetUserId = uuid(req.params.userId);
    const members = await deleteMember(projectId, requireUserId(req), targetUserId);
    res.json({ members });
  } catch (e) {
    next(e);
  }
};

export const transfer: RequestHandler = async (req, res, next) => {
  try {
    const projectId = uuid(req.params.projectId);
    const targetUserId = uuid(req.body?.userId);
    const members = await transferOwnership(projectId, requireUserId(req), targetUserId);
    res.json({ members });
  } catch (e) {
    next(e);
  }
};
