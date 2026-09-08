import { api } from '../../lib/api';

export type Project = {
  id: string;
  userId: string;
  name: string;
  slug: string | null;
  description: string | null;
  archivedAt: string | null;
  createdAt: string;
};

export type Member = {
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending';
  invitedEmail?: string;
  createdAt: string;
};

export type ApiKey = {
  id: string;
  projectId: string;
  name: string;
  prefix: string;
  createdAt: string;
};

export async function listProjects(): Promise<Project[]> {
  const data = await api<{ projects: Project[] }>('/projects');
  return data.projects;
}

export async function createProject(name: string): Promise<Project> {
  const data = await api<{ project: Project }>('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return data.project;
}

export async function getProject(projectId: string): Promise<Project> {
  const data = await api<{ project: Project }>(`/projects/${projectId}`);
  return data.project;
}

export async function updateProject(
  projectId: string,
  fields: { name?: string; description?: string | null },
): Promise<Project> {
  const data = await api<{ project: Project }>(`/projects/${projectId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  return data.project;
}

export async function setProjectArchived(projectId: string, archived: boolean): Promise<Project> {
  const data = await api<{ project: Project }>(`/projects/${projectId}/archive`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archived }),
  });
  return data.project;
}

export async function deleteProject(projectId: string): Promise<void> {
  await api<void>(`/projects/${projectId}`, { method: 'DELETE' });
}

export async function listMembers(projectId: string): Promise<Member[]> {
  const data = await api<{ members: Member[] }>(`/projects/${projectId}/members`);
  return data.members;
}

export async function inviteMember(
  projectId: string,
  email: string,
  role: string,
): Promise<Member[]> {
  const data = await api<{ members: Member[] }>(`/projects/${projectId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });
  return data.members;
}

export async function acceptInvite(projectId: string): Promise<Member[]> {
  const data = await api<{ members: Member[] }>(`/projects/${projectId}/members/accept`, {
    method: 'POST',
  });
  return data.members;
}

export async function leaveProject(projectId: string): Promise<void> {
  await api<void>(`/projects/${projectId}/leave`, { method: 'POST' });
}

export async function removeMember(projectId: string, userId: string): Promise<void> {
  await api<void>(`/projects/${projectId}/members/${userId}`, { method: 'DELETE' });
}

export async function listApiKeys(projectId: string): Promise<ApiKey[]> {
  const data = await api<{ keys: ApiKey[] }>(`/projects/${projectId}/keys`);
  return data.keys;
}

export async function createApiKey(
  projectId: string,
  name: string,
): Promise<{ key: ApiKey; plaintext: string }> {
  return api<{ key: ApiKey; plaintext: string }>(`/projects/${projectId}/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}

export async function revokeApiKey(projectId: string, keyId: string): Promise<void> {
  await api<void>(`/projects/${projectId}/keys/${keyId}`, { method: 'DELETE' });
}

export async function rotateApiKey(
  projectId: string,
  keyId: string,
): Promise<{ key: ApiKey; plaintext: string }> {
  return api<{ key: ApiKey; plaintext: string }>(`/projects/${projectId}/keys/${keyId}/rotate`, {
    method: 'POST',
  });
}
