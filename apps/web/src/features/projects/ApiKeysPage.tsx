import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Key } from 'lucide-react';
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
  listApiKeys,
  revokeApiKey,
  rotateApiKey,
  type ApiKey,
} from './project-service';

export function ApiKeysPage() {
  const { projectId = '' } = useParams();
  const { toast } = useToast();
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setKeys(await listApiKeys(projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load API keys');
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const { plaintext } = await createApiKey(projectId, name);
      setRevealedKey(plaintext);
      setName('');
      toast({ message: 'API key created. It will only be shown once.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to create API key',
        type: 'error',
      });
    } finally {
      setCreating(false);
      void load();
    }
  }

  async function copyKey() {
    if (!revealedKey) return;
    try {
      await navigator.clipboard.writeText(revealedKey);
      toast({ message: 'Copied to clipboard.', type: 'success' });
    } catch {
      toast({ message: 'Unable to copy to clipboard.', type: 'error' });
    }
  }

  async function handleRotate(keyId: string) {
    try {
      const { plaintext } = await rotateApiKey(projectId, keyId);
      setRevealedKey(plaintext);
      toast({ message: 'Key rotated. The new key is shown once.', type: 'success' });
      void load();
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to rotate key',
        type: 'error',
      });
    }
  }

  async function handleRevoke(keyId: string, keyName: string) {
    if (!window.confirm(`Revoke API key "${keyName}"? You cannot undo this.`)) return;
    try {
      await revokeApiKey(projectId, keyId);
      toast({ message: 'API key revoked.', type: 'success' });
      void load();
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to revoke key',
        type: 'error',
      });
    }
  }

  if (error) return <EmptyState title="Unable to load API keys" description={error} />;
  if (keys === null) return <LoadingState label="Loading API keys" />;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <Link
            to={`/projects/${projectId}`}
            className="text-sm text-[var(--color-muted)] hover:underline"
          >
            ← Back to project
          </Link>
          <h1 className="mt-1 text-lg font-semibold">API keys</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Keys are prefixed <code>ll_live</code> and used to authenticate event ingestion.
          </p>
        </div>

        <Card>
          <form className="flex gap-2" onSubmit={handleCreate}>
            <div className="flex-1 space-y-1">
              <Label>New key name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Production"
                required
                maxLength={64}
              />
            </div>
            <Button type="submit" disabled={creating} className="self-end">
              <Key size={16} className="mr-1 inline" /> Create key
            </Button>
          </form>
        </Card>

        {revealedKey ? (
          <Card className="border-[var(--color-accent)]">
            <p className="text-sm font-medium">
              Copy your new API key now — it cannot be shown again.
            </p>
            <code className="mt-2 block break-all rounded-md bg-[var(--color-surface)] p-3 text-sm">
              {revealedKey}
            </code>
            <Button type="button" variant="ghost" className="mt-3" onClick={copyKey}>
              Copy to clipboard
            </Button>
          </Card>
        ) : null}

        <div className="space-y-3">
          {keys.map((key) => (
            <Card key={key.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{key.name}</p>
                  <p className="font-mono text-xs text-[var(--color-muted)]">
                    {key.prefix}… · created {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => handleRotate(key.id)}>
                    Rotate
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRevoke(key.id, key.name)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {keys.length === 0 ? (
            <EmptyState title="No API keys" description="Create a key to start ingesting events." />
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
