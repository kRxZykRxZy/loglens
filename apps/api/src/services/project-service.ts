import { randomUUID } from 'node:crypto';
import type { Plan } from '@loglens/config';
import { PLAN_LIMITS } from '@loglens/config';
import { AppError } from '../errors/app-error.js';
import { requireAdmin, requirePermission, requireWrite } from './authorize-service.js';
import { insertAuthEvent } from '../repositories/auth-audit-repository.js';
import { getPlan } from '../repositories/user-repository.js';
import {
  countUserProjects,
  createProject,
  deleteProject,
  findProject,
  listProjects,
  setArchived,
  slugExists,
  updateProject,
} from '../repositories/project-repository.js';
import {
  acceptInvite,
  addMember,
  addPendingMember,
  getRole,
  leaveProject,
  listMembers,
  removeMember,
} from '../repositories/project-member-repository.js';
import { findByEmail } from '../repositories/user-repository.js';
import { makeUniqueSlug, slugify } from '../utils/slug.js';
import type { ProjectRole } from '../types/domain.js';

export const getProjects = (userId: string) => listProjects(userId);

export async function getProject(projectId: string, userId: string) {
  await requirePermission(projectId, userId, 'read');
  const project = await findProject(projectId);
  if (!project) throw new AppError(404, 'Project not found', 'PROJECT_NOT_FOUND');
  return project;
}

export async function addProject(userId: string, name: string) {
  const plan = (await getPlan(userId)) as Plan;
  const limit = PLAN_LIMITS[plan].projects;
  const owned = await countUserProjects(userId);
  if (owned >= limit) {
    throw new AppError(
      403,
      `Plan limit reached: max ${limit} projects on the ${plan} plan`,
      'PROJECT_LIMIT_REACHED',
    );
  }
  const base = slugify(name);
  let slug = base;
  if (await slugExists(userId, slug)) {
    const taken = new Set(
      (await listProjects(userId)).map((p) => p.slug).filter((s): s is string => Boolean(s)),
    );
    slug = makeUniqueSlug(base, taken);
  }
  return createProject(randomUUID(), userId, name.trim(), slug, null);
}

export async function renameProject(projectId: string, userId: string, name: string) {
  await requireWrite(projectId, userId);
  const updated = await updateProject(projectId, { name: name.trim() });
  if (!updated) throw new AppError(404, 'Project not found', 'PROJECT_NOT_FOUND');
  return updated;
}

export async function editProjectDescription(
  projectId: string,
  userId: string,
  description: string | null,
) {
  await requireWrite(projectId, userId);
  const updated = await updateProject(projectId, { description });
  if (!updated) throw new AppError(404, 'Project not found', 'PROJECT_NOT_FOUND');
  return updated;
}

export async function archiveProject(projectId: string, userId: string, archived: boolean) {
  await requireWrite(projectId, userId);
  await setArchived(projectId, archived);
  return findProject(projectId);
}

export async function removeProject(projectId: string, userId: string) {
  await requireAdmin(projectId, userId);
  await deleteProject(projectId);
  await insertAuthEvent({ userId, event: 'project.deleted' });
}

export async function getProjectMembers(projectId: string, userId: string) {
  await requirePermission(projectId, userId, 'read');
  return listMembers(projectId);
}

export async function inviteMemberByEmail(
  projectId: string,
  userId: string,
  email: string,
  role: ProjectRole,
) {
  await requireAdmin(projectId, userId);
  if (role === 'owner') {
    throw new AppError(400, 'Cannot assign owner via invite', 'INVALID_ROLE');
  }
  const target = await findByEmail(email);
  if (!target) {
    throw new AppError(404, 'No account found for that email', 'USER_NOT_FOUND');
  }
  if (target.id === userId) {
    throw new AppError(400, 'You are already a member', 'ALREADY_MEMBER');
  }
  await addPendingMember(projectId, target.id, role, target.email ?? email);
  await insertAuthEvent({ userId, event: 'project.member_invited' });
  return listMembers(projectId);
}

export async function acceptMemberInvite(projectId: string, userId: string) {
  await acceptInvite(projectId, userId);
  return listMembers(projectId);
}

export async function leaveProjectService(projectId: string, userId: string) {
  const role = await getRole(projectId, userId);
  if (role === 'owner') {
    throw new AppError(400, 'Owners must transfer ownership before leaving', 'OWNER_CANNOT_LEAVE');
  }
  await leaveProject(projectId, userId);
  await insertAuthEvent({ userId, event: 'project.left' });
}

export async function setMemberRole(
  projectId: string,
  userId: string,
  targetUserId: string,
  role: ProjectRole,
) {
  await requireAdmin(projectId, userId);
  if (targetUserId === userId) {
    throw new AppError(400, 'You cannot change your own role', 'INVALID_ROLE_CHANGE');
  }
  if (role === 'owner') {
    throw new AppError(400, 'Transfer ownership instead of assigning owner', 'INVALID_ROLE');
  }
  await addMember(projectId, targetUserId, role, 'active');
  return listMembers(projectId);
}

export async function deleteMember(projectId: string, userId: string, targetUserId: string) {
  const role = await requireAdmin(projectId, userId);
  if (targetUserId === userId) {
    throw new AppError(400, 'You cannot remove yourself', 'INVALID_REMOVAL');
  }
  const targetRole = await getRole(projectId, targetUserId);
  if (targetRole === 'owner') {
    throw new AppError(400, 'Cannot remove the project owner', 'INVALID_REMOVAL');
  }
  if (role === 'admin' && targetRole === 'admin') {
    throw new AppError(403, 'Admins cannot remove other admins', 'FORBIDDEN');
  }
  await removeMember(projectId, targetUserId);
  await insertAuthEvent({ userId, event: 'project.member_removed' });
  return listMembers(projectId);
}

export async function transferOwnership(projectId: string, userId: string, targetUserId: string) {
  const role = await requireAdmin(projectId, userId);
  if (role !== 'owner') {
    throw new AppError(403, 'Only the owner can transfer ownership', 'FORBIDDEN');
  }
  const targetRole = await getRole(projectId, targetUserId);
  if (!targetRole) {
    throw new AppError(400, 'Target user must be a member first', 'NOT_A_MEMBER');
  }
  await addMember(projectId, targetUserId, 'owner', 'active');
  await addMember(projectId, userId, 'admin', 'active');
  await insertAuthEvent({ userId, event: 'project.ownership_transferred' });
  return listMembers(projectId);
}
