import type { ProjectRole } from '../types/domain.js';

export type Permission = 'read' | 'write' | 'admin';

const PERMISSION_BY_ROLE: Record<ProjectRole, readonly Permission[]> = {
  owner: ['read', 'write', 'admin'],
  admin: ['read', 'write', 'admin'],
  member: ['read', 'write'],
  viewer: ['read'],
};

export function hasPermission(role: ProjectRole | null, permission: Permission): boolean {
  if (!role) return false;
  return PERMISSION_BY_ROLE[role].includes(permission);
}

export function canWrite(role: ProjectRole | null): boolean {
  return hasPermission(role, 'write');
}

export function canAdmin(role: ProjectRole | null): boolean {
  return hasPermission(role, 'admin');
}
