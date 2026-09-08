import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { login, register } from '../../services/auth-service';
import { isSupabaseConfigured } from '../../lib/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-sm space-y-3 p-6">
        <p className="text-sm text-red-500">
          Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the web
          app environment.
        </p>
      </div>
    );
  }

  async function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement>,
    action: 'login' | 'register',
  ) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (action === 'login') {
        await login(email, password);
      } else {
        const { session } = await register(email, password);
        if (!session) {
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mx-auto max-w-sm space-y-3">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
        minLength={8}
      />
      <div className="flex gap-2">
        <Button type="button" disabled={submitting} onClick={(e) => handleSubmit(e, 'login')}>
          Sign in
        </Button>
        <Button type="button" disabled={submitting} onClick={(e) => handleSubmit(e, 'register')}>
          Register
        </Button>
      </div>
      <p className="text-sm">
        <Link to="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
