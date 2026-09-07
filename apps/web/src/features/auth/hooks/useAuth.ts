import { useEffect, useState } from 'react';
import { onAuthChange } from '../../../services/auth-service';
import type { User } from '../../../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { unsubscribe } = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}