import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { supabase } from '../../lib/supabase';
import { useToast } from '../notifications/ToastProvider';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError('This link has expired or is invalid. Request a new reset link.');
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase is not configured');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ message: 'Password updated.', type: 'success' });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-lg font-semibold">Choose a new password</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="space-y-1">
          <Label>New password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={8}
          />
        </div>
        <div className="space-y-1">
          <Label>Confirm password</Label>
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            minLength={8}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          Update password
        </Button>
      </form>
    </div>
  );
}
