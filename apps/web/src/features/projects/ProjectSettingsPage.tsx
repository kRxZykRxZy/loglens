import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Copy, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingState } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useToast } from '../notifications/ToastProvider';
import {
  createApiKey,
  deleteProject,
  getProject,
  inviteMember,
  leaveProject,
  listApiKeys,
  listMembers,
  removeMember,
  revokeApiKey,
  rotateApiKey,
  setProjectArchived,
  updateProject,
  type ApiKey,
  type Member,
  type Project,
} from './project-service';

const ROLES = ['admin', 'member', 'viewer'];

export function ProjectSettingsPage() {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  const [keyName, setKeyName] = useState('');
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProject(projectId);
        setProject(p);
        setName(p.name);
        setDescription(p.description ?? '');
        const [m, k] = await Promise.all([listMembers(projectId), listApiKeys(projectId)]);
        setMembers(m);
        setKeys(k);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load project');
      }
    }
    void load();
  }, [projectId]);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updated = await updateProject(projectId, { name, description });
      setProject(updated);
      toast({ message: 'Project updated.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to save project',
        type: 'error',
      });
    }
  }

  async function toggleArchive() {
    if (!project) return;
    try {
      const updated = await setProjectArchived(projectId, !project.archivedAt);
      setProject(updated);
      toast({
        message: updated.archivedAt ? 'Project archived.' : 'Project restored.',
        type: 'success',
      });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to update project',
        type: 'error',
      });
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    try {
      const m = await inviteMember(projectId, inviteEmail, inviteRole);
      setMembers(m);
      setInviteEmail('');
      toast({ message: 'Member invited.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to invite member',
        type: 'error',
      });
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!confirm(`Remove this member from the project?`)) return;
    try {
      await removeMember(projectId, userId);
      setMembers(await listMembers(projectId));
      toast({ message: 'Member removed.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to remove member',
        type: 'error',
      });
    }
  }

  async function handleLeave() {
    try {
      await leaveProject(projectId);
      toast({ message: 'Left project.', type: 'success' });
      navigate('/projects');
    } catch (err) {
      toast({ message: err instanceof Error ? err.message : 'Unable to leave', type: 'error' });
    }
  }

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { plaintext } = await createApiKey(projectId, keyName);
      setKeys(await listApiKeys(projectId));
      setRevealedKey(plaintext);
      setKeyName('');
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to create key',
        type: 'error',
      });
    }
  }

  async function handleRotateKey(keyId: string) {
    if (!confirm('Rotate this key? The old key will be revoked immediately.')) return;
    try {
      const { plaintext } = await rotateApiKey(projectId, keyId);
      setKeys(await listApiKeys(projectId));
      setRevealedKey(plaintext);
      toast({ message: 'Key rotated.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to rotate key',
        type: 'error',
      });
    }
  }

  async function handleRevokeKey(keyId: string, keyName: string) {
    if (!confirm(`Revoke key "${keyName}"? This cannot be undone.`)) return;
    try {
      await revokeApiKey(projectId, keyId);
      setKeys(await listApiKeys(projectId));
      toast({ message: 'Key revoked.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to revoke key',
        type: 'error',
      });
    }
  }

  async function copyKey(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ message: 'Copied to clipboard.', type: 'success' });
    } catch {
      toast({ message: 'Unable to copy.', type: 'error' });
    }
  }

  async function handleDeleteProject() {
    try {
      await deleteProject(projectId);
      toast({ message: 'Project deleted.', type: 'success' });
      navigate('/projects');
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to delete project',
        type: 'error',
      });
    }
  }

  if (error) return <EmptyState title="Unable to load project" description={error} />;
  if (!project) return <LoadingState label="Loading project" />;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Link
            to={`/projects/${project.id}`}
            className="text-sm text-[var(--color-muted)] hover:underline"
          >
            ← {project.name}
          </Link>
          <h1 className="mt-1 text-lg font-semibold">Project settings</h1>
        </div>

        <Card>
          <h2 className="font-semibold">General</h2>
          <form className="mt-4 space-y-3" onSubmit={saveSettings}>
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" onClick={toggleArchive} variant="ghost">
                {project.archivedAt ? 'Restore project' : 'Archive project'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="font-semibold">API keys</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Keys authenticate ingestion. Use them as <code>Authorization: Bearer ll_live_…</code>.
          </p>

          <form className="mt-4 flex items-end gap-2" onSubmit={handleCreateKey}>
            <div className="flex-1 space-y-1">
              <Label>New key name</Label>
              <Input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. production"
                maxLength={64}
                required
              />
            </div>
            <Button type="submit">
              <Plus size={16} className="mr-1 inline" /> Create key
            </Button>
          </form>

          {revealedKey ? (
            <div className="mt-4 space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm">
              <p className="font-medium text-amber-800">Your API key (shown once)</p>
              <p className="break-all font-mono text-amber-900">{revealedKey}</p>
              <p className="text-amber-700">
                Copy it now. For security it will not be shown again.
              </p>
              <Button type="button" variant="ghost" onClick={() => copyKey(revealedKey)}>
                <Copy size={14} className="mr-1 inline" /> Copy
              </Button>
            </div>
          ) : null}

          <ul className="mt-4 space-y-2">
            {keys?.map((key) => (
              <li
                key={key.id}
                className="flex items-center justify-between rounded-md border border-[var(--color-border)] p-3"
              >
                <div>
                  <p className="font-medium">{key.name}</p>
                  <p className="text-sm font-mono text-[var(--color-muted)]">
                    {key.prefix}… · created {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" onClick={() => handleRotateKey(key.id)}>
                    <RefreshCw size={14} className="mr-1 inline" /> Rotate
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRevokeKey(key.id, key.name)}
                  >
                    <Trash2 size={14} className="mr-1 inline" /> Revoke
                  </Button>
                </div>
              </li>
            ))}
            {keys && keys.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No keys yet.</p>
            ) : null}
          </ul>
        </Card>

        <Card>
          <h2 className="font-semibold">Members</h2>
          <form className="mt-4 flex items-end gap-2" onSubmit={handleInvite}>
            <div className="flex-1 space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-input-bg)] px-3 py-2"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">
              <Plus size={16} className="mr-1 inline" /> Invite
            </Button>
          </form>

          <ul className="mt-4 space-y-2">
            {members?.map((m) => (
              <li
                key={m.userId}
                className="flex items-center justify-between rounded-md border border-[var(--color-border)] p-3"
              >
                <div>
                  <p className="font-medium">{m.invitedEmail ?? m.userId}</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {m.role}
                    {m.status === 'pending' ? ' · pending' : ''}
                  </p>
                </div>
                {m.role !== 'owner' ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveMember(m.userId)}
                  >
                    Remove
                  </Button>
                ) : null}
              </li>
            ))}
            {members && members.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No members yet.</p>
            ) : null}
          </ul>

          <div className="mt-4">
            <Button type="button" variant="ghost" onClick={handleLeave}>
              Leave project
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-red-600">Danger zone</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Deleting a project is permanent and removes its events and keys.
          </p>
          <div className="mt-4 flex gap-2">
            {confirmDelete ? (
              <>
                <Button type="button" variant="danger" onClick={handleDeleteProject}>
                  <Trash2 size={14} className="mr-1 inline" /> Confirm delete
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" variant="danger" onClick={() => setConfirmDelete(true)}>
                Delete project
              </Button>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
