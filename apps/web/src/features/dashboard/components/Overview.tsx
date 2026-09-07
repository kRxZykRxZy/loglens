import { useDashboard } from '../hooks/useDashboard';
import { MetricCard } from './MetricCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/Skeleton';

export function Overview() {
  const { projects, loading, error } = useDashboard();

  if (loading) return <LoadingState label="Loading dashboard" />;
  if (error)
    return (
      <EmptyState title="Unable to load dashboard" description={error} />
    );
  if (projects === 0)
    return (
      <EmptyState
        title="No projects yet"
        description="Create a project to start sending events."
      />
    );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard label="Events" value={0} />
      <MetricCard label="Errors" value={0} />
      <MetricCard label="Projects" value={projects} />
    </div>
  );
}