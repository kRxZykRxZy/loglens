import { AppError } from '../errors/app-error.js';
import { getRole } from '../repositories/project-member-repository.js';
import { findProject } from '../repositories/project-repository.js';
import type { ProjectRole } from '../types/domain.js';
import { canAdmin, canWrite, type Permission } from './permissions.js';

export async function effectiveRole(
  projectId: string,
  userId: string,
): Promise<ProjectRole | null> {
  const membershipRole = await getRole(projectId, userId);
  if (membershipRole) return membershipRole;
  const project = await findProject(projectId);
  if (project && project.userId === userId) return 'owner';
  return null;
}

export async function requirePermission(
  projectId: string,
  userId: string,
  permission: Permission,
): Promise<ProjectRole> {
  const role = await effectiveRole(projectId, userId);
  const allowed =
    permission === 'read'
      ? role !== null
      : permission === 'write'
        ? canWrite(role)
        : canAdmin(role);
  if (!allowed) {
    throw new AppError(403, 'You do not have permission to access this resource', 'FORBIDDEN');
  }
  return role ?? 'viewer';
}

export async function requireWrite(projectId: string, userId: string): Promise<ProjectRole> {
  return requirePermission(projectId, userId, 'write');
}

export async function requireAdmin(projectId: string, userId: string): Promise<ProjectRole> {
  return requirePermission(projectId, userId, 'admin');
}
