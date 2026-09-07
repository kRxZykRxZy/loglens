import { query } from '../database/query.js';

export async function getProjectIdsForUser(userId: string): Promise<string[]> {
  const result = await query<{ project_id: string }>(
    `select distinct p.id as project_id
     from projects p
     left join project_members m on m.project_id = p.id
     where p.user_id = $1 or m.user_id = $1`,
    [userId],
  );
  return result.rows.map((r) => r.project_id);
}

export async function getProjectIdsAndNames(
  userId: string,
): Promise<{ id: string; name: string }[]> {
  const result = await query<{ id: string; name: string }>(
    `select distinct p.id, p.name
     from projects p
     left join project_members m on m.project_id = p.id
     where p.user_id = $1 or m.user_id = $1
     order by p.name`,
    [userId],
  );
  return result.rows;
}
