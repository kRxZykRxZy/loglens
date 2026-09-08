import { query } from '../database/query.js';
import type { ProjectMember, ProjectRole } from '../types/domain.js';

export async function addMember(
  projectId: string,
  userId: string,
  role: ProjectRole,
  status: 'active' | 'pending' = 'active',
): Promise<void> {
  await query(
    `INSERT INTO project_members (project_id, user_id, role, status)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3, status = $4`,
    [projectId, userId, role, status],
  );
}

export async function getRole(projectId: string, userId: string): Promise<ProjectRole | null> {
  const result = await query<{ role: ProjectRole }>(
    'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
    [projectId, userId],
  );
  return result.rows[0]?.role ?? null;
}

export async function getStatus(projectId: string, userId: string): Promise<string | null> {
  const result = await query<{ status: string }>(
    'SELECT status FROM project_members WHERE project_id = $1 AND user_id = $2',
    [projectId, userId],
  );
  return result.rows[0]?.status ?? null;
}

export async function setStatus(
  projectId: string,
  userId: string,
  status: 'active' | 'pending',
): Promise<void> {
  await query('UPDATE project_members SET status = $3 WHERE project_id = $1 AND user_id = $2', [
    projectId,
    userId,
    status,
  ]);
}

export async function addPendingMember(
  projectId: string,
  userId: string,
  role: ProjectRole,
  invitedEmail: string,
): Promise<void> {
  await query(
    `INSERT INTO project_members (project_id, user_id, role, status, invited_email)
     VALUES ($1, $2, $3, 'pending', $4)
     ON CONFLICT (project_id, user_id)
     DO UPDATE SET role = $3, status = 'pending', invited_email = $4`,
    [projectId, userId, role, invitedEmail],
  );
}

export async function acceptInvite(projectId: string, userId: string): Promise<void> {
  await query(
    "UPDATE project_members SET status = 'active' WHERE project_id = $1 AND user_id = $2 AND status = 'pending'",
    [projectId, userId],
  );
}

export async function leaveProject(projectId: string, userId: string): Promise<void> {
  await query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [
    projectId,
    userId,
  ]);
}

export async function removeMember(projectId: string, userId: string): Promise<void> {
  await query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [
    projectId,
    userId,
  ]);
}

export async function listMembers(projectId: string): Promise<ProjectMember[]> {
  const result = await query<ProjectMember>(
    `SELECT project_id AS "projectId", user_id AS "userId", role, status,
            created_at::text AS "createdAt"
     FROM project_members WHERE project_id = $1 ORDER BY created_at`,
    [projectId],
  );
  return result.rows;
}
