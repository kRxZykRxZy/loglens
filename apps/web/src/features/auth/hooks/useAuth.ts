import { useEffect, useState } from 'react';
import { me } from '../../../services/auth-service';
import type { User } from '../../../types/auth';
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    me()
      .then((x) => setUser(x.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  return { user, loading };
}
