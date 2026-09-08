import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingState } from '../../components/ui/Skeleton';
import { useToast } from '../notifications/ToastProvider';
import { getProject, setProjectArchived, type Project } from './project-service';

export function ProjectOverviewPage() {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getProject(projectId)
      .then(setProject)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load project'));
  }, [projectId]);

  async function toggleArchive() {
    if (!project) return;
    setBusy(true);
    try {
      const updated = await setProjectArchived(project.id, !project.archivedAt);
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
    } finally {
      setBusy(false);
    }
  }

  if (error) return <EmptyState title="Unable to load project" description={error} />;
  if (!project) return <LoadingState label="Loading project" />;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/projects" className="text-sm text-[var(--color-muted)] hover:underline">
              ← Projects
            </Link>
            <h1 className="mt-1 text-lg font-semibold">{project.name}</h1>
            {project.slug ? (
              <p className="text-sm text-[var(--color-muted)]">/{project.slug}</p>
            ) : null}
          </div>
          <div className="flex gap-2">
            {project.archivedAt ? (
              <Button type="button" onClick={toggleArchive} disabled={busy}>
                Restore
              </Button>
            ) : (
              <Button type="button" onClick={toggleArchive} disabled={busy} variant="ghost">
                Archive
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/projects/${project.id}/settings`)}
            >
              Settings
            </Button>
          </div>
        </div>

        <Card>
          <h2 className="font-semibold">Overview</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {project.description || 'No description yet.'}
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
