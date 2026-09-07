import { describe, it, expect, vi, beforeEach } from 'vitest';
import { effectiveRole, requirePermission } from './authorize-service.js';
import { AppError } from '../errors/app-error.js';
import * as memberRepo from '../repositories/project-member-repository.js';
import * as projectRepo from '../repositories/project-repository.js';

vi.mock('../repositories/project-member-repository.js', () => ({
  getRole: vi.fn(),
}));

vi.mock('../repositories/project-repository.js', () => ({
  findProject: vi.fn(),
}));

const getRole = vi.mocked(memberRepo.getRole);
const findProject = vi.mocked(projectRepo.findProject);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('effectiveRole', () => {
  it('uses the membership row when present', async () => {
    getRole.mockResolvedValue('member');
    expect(await effectiveRole('p1', 'u1')).toBe('member');
    expect(findProject).not.toHaveBeenCalled();
  });

  it('falls back to owner for the legacy project creator', async () => {
    getRole.mockResolvedValue(null);
    findProject.mockResolvedValue({ id: 'p1', userId: 'u1', name: 'p', createdAt: new Date() });
    expect(await effectiveRole('p1', 'u1')).toBe('owner');
  });

  it('returns null for a non-member with no ownership', async () => {
    getRole.mockResolvedValue(null);
    findProject.mockResolvedValue({ id: 'p1', userId: 'u2', name: 'p', createdAt: new Date() });
    expect(await effectiveRole('p1', 'u1')).toBeNull();
  });
});

describe('requirePermission', () => {
  it('throws FORBIDDEN for a non-member on read', async () => {
    getRole.mockResolvedValue(null);
    findProject.mockResolvedValue({ id: 'p1', userId: 'u2', name: 'p', createdAt: new Date() });
    await expect(requirePermission('p1', 'u1', 'read')).rejects.toMatchObject({
      code: 'FORBIDDEN',
      status: 403,
    });
  });

  it('throws FORBIDDEN when a viewer attempts write', async () => {
    getRole.mockResolvedValue('viewer');
    await expect(requirePermission('p1', 'u1', 'write')).rejects.toBeInstanceOf(AppError);
  });

  it('throws FORBIDDEN when a member attempts admin', async () => {
    getRole.mockResolvedValue('member');
    await expect(requirePermission('p1', 'u1', 'admin')).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });
  });

  it('allows an owner to admin', async () => {
    getRole.mockResolvedValue('owner');
    await expect(requirePermission('p1', 'u1', 'admin')).resolves.toBe('owner');
  });
});
