import { describe, it, expect } from 'vitest';
import { canAdmin, canWrite, hasPermission } from './permissions.js';
import { PROJECT_ROLES, type ProjectRole } from '../types/domain.js';

describe('permissions', () => {
  it('defines the full role set', () => {
    expect(PROJECT_ROLES).toEqual(['owner', 'admin', 'member', 'viewer']);
  });

  it('owner and admin can read, write, and admin', () => {
    for (const role of ['owner', 'admin'] as ProjectRole[]) {
      expect(hasPermission(role, 'read')).toBe(true);
      expect(hasPermission(role, 'write')).toBe(true);
      expect(canAdmin(role)).toBe(true);
    }
  });

  it('member can read and write but not admin', () => {
    expect(canWrite('member')).toBe(true);
    expect(canAdmin('member')).toBe(false);
  });

  it('viewer can only read', () => {
    expect(hasPermission('viewer', 'read')).toBe(true);
    expect(canWrite('viewer')).toBe(false);
    expect(canAdmin('viewer')).toBe(false);
  });

  it('null role denies everything', () => {
    expect(hasPermission(null, 'read')).toBe(false);
    expect(canWrite(null)).toBe(false);
    expect(canAdmin(null)).toBe(false);
  });
});
