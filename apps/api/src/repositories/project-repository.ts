import { query } from '../database/query.js';
import { transaction } from '../database/transaction.js';
import type { Project } from '../types/project.js';

export async function listProjects(userId: string) {
  return (
    await query(
      `select distinct p.id, p.name, p.created_at
       from projects p
       left join project_members m on m.project_id = p.id
       where p.user_id = $1 or m.user_id = $1
       order by p.created_at desc`,
      [userId],
    )
  ).rows;
}

export async function createProject(id: string, userId: string, name: string) {
  return transaction(async (client) => {
    const project = await client.query(
      'insert into projects(id,user_id,name) values($1,$2,$3) returning id,name,created_at',
      [id, userId, name],
    );
    await client.query('insert into project_members(project_id,user_id,role) values($1,$2,$3)', [
      id,
      userId,
      'owner',
    ]);
    return project.rows[0];
  });
}

export async function findProject(id: string) {
  return (
    await query<Project>(
      'select id, user_id as "userId", name, created_at as "createdAt" from projects where id = $1',
      [id],
    )
  ).rows[0];
}
