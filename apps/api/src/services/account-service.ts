import { AppError } from '../errors/app-error.js';
import { supabaseService } from '../supabase/clients.js';
import { deleteById, findById } from '../repositories/user-repository.js';
import { listByProjectIds } from '../repositories/event-repository.js';
import { getProjectIdsAndNames } from '../repositories/project-access-repository.js';
import { insertAuthEvent, listAuthEvents } from '../repositories/auth-audit-repository.js';

export type AccountExport = {
  user: { id: string; email: string | null };
  projects: { id: string; name: string }[];
  events: unknown[];
  exportedAt: string;
};

async function requireAuthSession(token: string): Promise<{ id: string; email?: string }> {
  const { data, error } = await supabaseService().auth.getUser(token);
  if (error || !data.user) throw new AppError(401, 'Authentication required', 'UNAUTHENTICATED');
  return { id: data.user.id, email: data.user.email };
}

export async function exportAccount(token: string, ip?: string): Promise<AccountExport> {
  const { id } = await requireAuthSession(token);
  const profile = await findById(id);

  const projects = await getProjectIdsAndNames(id);
  const projectIds = projects.map((p) => p.id);
  const events = await listByProjectIds(projectIds, 5000);

  await insertAuthEvent({ userId: id, event: 'account.export', ip });

  return {
    user: { id, email: profile?.email ?? null },
    projects,
    events,
    exportedAt: new Date().toISOString(),
  };
}

export async function deleteAccount(token: string, ip?: string): Promise<void> {
  const { id } = await requireAuthSession(token);

  const { error } = await supabaseService().auth.admin.deleteUser(id);
  if (error) throw new AppError(400, 'Unable to delete account', 'ACCOUNT_DELETE_FAILED');

  await deleteById(id);
  await insertAuthEvent({ userId: id, event: 'account.deleted', ip });
}

export async function revokeAllSessions(token: string, ip?: string): Promise<{ revoked: boolean }> {
  const { id } = await requireAuthSession(token);
  await insertAuthEvent({ userId: id, event: 'auth.sessions_revoked', ip });
  return { revoked: true };
}

export async function requestPasswordReset(email: string, redirectTo?: string): Promise<void> {
  const { error } = await supabaseService().auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo ?? undefined,
  });
  if (error) throw new AppError(400, 'Unable to send reset link', 'PASSWORD_RESET_FAILED');
}

export async function resendConfirmation(email: string): Promise<void> {
  const { error } = await supabaseService().auth.resend({ type: 'signup', email });
  if (error) throw new AppError(400, 'Unable to resend confirmation', 'RESEND_CONFIRMATION_FAILED');
}

export async function listAccountAuditEvents(token: string) {
  const { id } = await requireAuthSession(token);
  return listAuthEvents(id, 50);
}
