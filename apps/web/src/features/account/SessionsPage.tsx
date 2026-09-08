import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../auth/hooks/useAuth';
import { useToast } from '../notifications/ToastProvider';
import { revokeAllSessions, logout } from '../../services/auth-service';
import { supabase } from '../../lib/supabase';

type SessionInfo = {
  current: boolean;
  email?: string;
  createdAt?: string;
  lastSignInAt?: string;
};

export function SessionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [revoked, setRevoked] = useState(false);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => {
      const s = data.session;
      setSession({
        current: true,
        email: s?.user?.email,
        createdAt: s?.user?.created_at ? new Date(s.user.created_at).toISOString() : undefined,
        lastSignInAt: s?.user?.last_sign_in_at ?? undefined,
      });
    });
  }, []);

  async function handleRevokeAll() {
    setRevoking(true);
    try {
      await revokeAllSessions();
      await logout();
      setRevoked(true);
      toast({ message: 'Signed out of all sessions.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to revoke sessions',
        type: 'error',
      });
      setRevoking(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-lg font-semibold">Sessions &amp; security</h1>
      <Card className="space-y-2 p-4">
        <p className="text-sm font-medium">Current session</p>
        <p className="text-sm">Signed in as {session?.email ?? user?.email}</p>
        {session?.createdAt && (
          <p className="text-xs text-muted">
            Started {new Date(session.createdAt).toLocaleString()}
          </p>
        )}
      </Card>
      <div className="space-y-3">
        <p className="text-sm">
          Revoking all sessions signs you out everywhere, including this device.
        </p>
        <Button
          type="button"
          onClick={handleRevokeAll}
          disabled={revoking || revoked}
          variant="danger"
        >
          Revoke all sessions
        </Button>
      </div>
      {revoked && (
        <p className="text-sm">You are signed out. Close this tab and sign in again elsewhere.</p>
      )}
    </div>
  );
}
