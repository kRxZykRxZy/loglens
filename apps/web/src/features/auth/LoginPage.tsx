import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
export function LoginPage() {
  const [email, setEmail] = useState('');
  return (
    <form className="mx-auto max-w-sm space-y-3">
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button type="submit">Sign in</Button>
    </form>
  );
}
