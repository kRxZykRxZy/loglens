import { query } from '../database/query.js';
import { transaction } from '../database/transaction.js';
import type { Project } from '../types/project.js';

type ProjectRow = {
  id: string;
  userId: string;
  name: string;
  slug: string | null;
  description: string | null;
  archivedAt: string | null;
  createdAt: Date;
};

function toProject(r: ProjectRow): Project {
  return r;
}

export async function listProjects(userId: string) {
  return (
    await query<ProjectRow>(
      `select distinct p.id, p.user_id as "userId", p.name, p.slug, p.description,
              p.archived_at::text as "archivedAt", p.created_at
       from projects p
       left join project_members m on m.project_id = p.id
       where p.user_id = $1 or m.user_id = $1
       order by p.created_at desc`,
      [userId],
    )
  ).rows.map(toProject);
}

export async function findProject(id: string): Promise<Project | null> {
  const result = await query<ProjectRow>(
    `select id, user_id as "userId", name, slug, description,
            archived_at::text as "archivedAt", created_at
     from projects where id = $1`,
    [id],
  );
  return result.rows[0] ? toProject(result.rows[0]) : null;
}

export async function findBySlug(userId: string, slug: string): Promise<Project | null> {
  const result = await query<ProjectRow>(
    `select id, user_id as "userId", name, slug, description,
            archived_at::text as "archivedAt", created_at
     from projects where user_id = $1 and slug = $2`,
    [userId, slug],
  );
  return result.rows[0] ? toProject(result.rows[0]) : null;
}

export async function createProject(
  id: string,
  userId: string,
  name: string,
  slug: string,
  description: string | null,
): Promise<Project> {
  return transaction(async (client) => {
    const project = await client.query(
      `insert into projects(id, user_id, name, slug, description)
       values($1,$2,$3,$4,$5)
       returning id, user_id as "userId", name, slug, description,
                 archived_at::text as "archivedAt", created_at`,
      [id, userId, name, slug, description],
    );
    await client.query(
      `insert into project_members(project_id, user_id, role, status)
       values($1,$2,$3,$4)`,
      [id, userId, 'owner', 'active'],
    );
    return toProject(project.rows[0]);
  });
}

export async function updateProject(
  id: string,
  fields: { name?: string; description?: string | null },
): Promise<Project | null> {
  const sets: string[] = [];
  const params: unknown[] = [id];
  if (fields.name !== undefined) {
    params.push(fields.name);
    sets.push(`name = $${params.length}`);
  }
  if (fields.description !== undefined) {
    params.push(fields.description);
    sets.push(`description = $${params.length}`);
  }
  if (sets.length === 0) return findProject(id);
  const result = await query<ProjectRow>(
    `update projects set ${sets.join(', ')} where id = $1
     returning id, user_id as "userId", name, slug, description,
               archived_at::text as "archivedAt", created_at`,
    params,
  );
  return result.rows[0] ? toProject(result.rows[0]) : null;
}

export async function setArchived(id: string, archived: boolean): Promise<void> {
  await query(
    'update projects set archived_at = case when $2 then now() else null end where id = $1',
    [id, archived],
  );
}

export async function deleteProject(id: string): Promise<void> {
  await query('delete from projects where id = $1', [id]);
}

export async function slugExists(userId: string, slug: string): Promise<boolean> {
  const result = await query<{ id: string }>(
    'select id from projects where user_id = $1 and slug = $2',
    [userId, slug],
  );
  return result.rows.length > 0;
}

export async function countUserProjects(userId: string): Promise<number> {
  const result = await query<{ count: string }>(
    'select count(*)::text as count from projects where user_id = $1',
    [userId],
  );
  return Number(result.rows[0]?.count ?? 0);
}
