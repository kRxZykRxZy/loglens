import { useEffect, useState } from 'react';
import { onAuthChange, refreshSession } from '../../../services/auth-service';
import type { User } from '../../../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    refreshSession().then((u) => {
      if (active) {
        setUser(u);
        setLoading(false);
      }
    });
    const { unsubscribe } = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { user, loading };
}
