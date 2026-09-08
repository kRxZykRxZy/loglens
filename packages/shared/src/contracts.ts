export type HealthResponse = { ok: boolean; service: string };
export type ProjectSummary = {
  id: string;
  name: string;
  slug: string | null;
  archivedAt: string | null;
  createdAt: string;
};
export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';
export type ProjectMemberSummary = { userId: string; email?: string | null; role: ProjectRole };
export type ApiKeySummary = { id: string; name: string; prefix: string; createdAt: string };
export type AuthUser = { id: string; email: string; createdAt?: string };
export type ErrorEnvelope = { error: string; code?: string };
