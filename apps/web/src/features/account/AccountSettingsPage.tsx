import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useAuth } from '../auth/hooks/useAuth';
import { useToast } from '../notifications/ToastProvider';
import { supabase } from '../../lib/supabase';
import { deleteAccount, logout } from '../../services/auth-service';

export function AccountSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [deleteArmed, setDeleteArmed] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase is not configured');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword('');
      toast({ message: 'Password updated.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to update password',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function exportData() {
    try {
      if (!supabase) throw new Error('Supabase is not configured');
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch('/api/auth/export', {
        headers: { Authorization: `Bearer ${token ?? ''}` },
      });
      if (!response.ok) throw new Error('Export failed');
      const text = await response.text();
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `loglens-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast({ message: 'Export downloaded.', type: 'success' });
    } catch (err) {
      toast({ message: err instanceof Error ? err.message : 'Export failed', type: 'error' });
    }
  }

  async function handleDelete() {
    if (confirmEmail !== user?.email) {
      toast({ message: 'Type your email to confirm deletion.', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      await deleteAccount();
      await logout();
      toast({ message: 'Account deleted.', type: 'success' });
    } catch (err) {
      toast({
        message: err instanceof Error ? err.message : 'Unable to delete account',
        type: 'error',
      });
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8 p-6">
      <section className="space-y-3">
        <h1 className="text-lg font-semibold">Account settings</h1>
        <p className="text-sm">
          Signed in as <span className="font-medium">{user?.email}</span>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Change password</h2>
        <form className="space-y-3" onSubmit={changePassword}>
          <div className="space-y-1">
            <Label>New password</Label>
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={submitting}>
            Update password
          </Button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Export your data</h2>
        <p className="text-sm">Download a JSON copy of your profile, projects, and events.</p>
        <Button type="button" onClick={exportData}>
          Download export
        </Button>
      </section>

      <section className="space-y-3 border-t pt-4">
        <h2 className="text-base font-semibold text-red-600">Delete account</h2>
        <p className="text-sm">This permanently deletes your account, projects, and code events.</p>
        {deleteArmed ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Type your email to confirm</Label>
              <Input
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                type="email"
                autoComplete="off"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={handleDelete} disabled={submitting} variant="danger">
                Delete my account
              </Button>
              <Button type="button" onClick={() => setDeleteArmed(false)} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button type="button" onClick={() => setDeleteArmed(true)} variant="danger">
            Delete account
          </Button>
        )}
      </section>
    </div>
  );
}
