import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import type { ProjectSummary } from '@loglens/shared';

type Summary = {
  projects: number;
  loading: boolean;
  error: string | null;
};

export function useDashboard(): Summary {
  const [projects, setProjects] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ projects: ProjectSummary[] }>('/projects')
      .then((res) => {
        if (cancelled) return;
        setProjects(res.projects.length);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load dashboard');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading, error };
}
