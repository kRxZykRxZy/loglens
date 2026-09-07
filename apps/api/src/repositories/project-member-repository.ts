import { query } from '../database/query.js';
import type { ProjectMember, ProjectRole } from '../types/domain.js';

export async function addMember(
  projectId: string,
  userId: string,
  role: ProjectRole,
): Promise<void> {
  await query(
    'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3',
    [projectId, userId, role],
  );
}

export async function getRole(projectId: string, userId: string): Promise<ProjectRole | null> {
  const result = await query<{ role: ProjectRole }>(
    'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
    [projectId, userId],
  );
  return result.rows[0]?.role ?? null;
}

export async function removeMember(projectId: string, userId: string): Promise<void> {
  await query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [
    projectId,
    userId,
  ]);
}

export async function listMembers(projectId: string): Promise<ProjectMember[]> {
  const result = await query<ProjectMember>(
    'SELECT project_id AS "projectId", user_id AS "userId", role, created_at::text AS "createdAt" FROM project_members WHERE project_id = $1 ORDER BY created_at',
    [projectId],
  );
  return result.rows;
}
