export const PROJECT_ROLES = ['owner', 'admin', 'member', 'viewer'] as const;
export type ProjectRole = (typeof PROJECT_ROLES)[number];

export type ProjectMember = {
  projectId: string;
  userId: string;
  role: ProjectRole;
  createdAt: string;
};

export type AuthEvent = {
  id: string;
  userId: string;
  event: string;
  ip?: string;
  createdAt: string;
};
