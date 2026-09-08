import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingState } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useToast } from '../notifications/ToastProvider';
import { createProject, listProjects, type Project } from './project-service';

export function ProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  async function load() {
    try {
      setProjects(await listProjects());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load projects');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await createProject(name);
      setName('');
      setCreating(false);
      toast({ message: 'Project created.', type: 'success' });
      void load();
    } catch (err) {
      setCreating(false);
      toast({
        message: err instanceof Error ? err.message : 'Unable to create project',
        type: 'error',
      });
    }
  }

  if (projects === null && !error) return <LoadingState label="Loading projects" />;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Projects</h1>
            <p className="text-sm text-[var(--color-muted)]">
              Projects collect events for your services.
            </p>
          </div>
          <form className="flex items-end gap-2" onSubmit={handleCreate}>
            <div className="space-y-1">
              <Label>New project</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                required
                maxLength={100}
                aria-label="Project name"
              />
            </div>
            <Button type="submit" disabled={creating || !name.trim()}>
              <Plus size={16} className="mr-1 inline" /> Create
            </Button>
          </form>
        </div>

        {error ? (
          <EmptyState title="Unable to load projects" description={error} />
        ) : projects && projects.length === 0 ? (
          <EmptyState title="No projects yet" description="Create a project to get started." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="h-full transition hover:border-[var(--color-accent)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.archivedAt ? (
                      <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs">
                        Archived
                      </span>
                    ) : null}
                  </div>
                  {project.description ? (
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{project.description}</p>
                  ) : null}
                  <p className="mt-3 text-xs text-[var(--color-muted)]">
                    {project.slug ? `/${project.slug}` : ''}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
