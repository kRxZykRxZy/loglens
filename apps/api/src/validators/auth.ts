import { requireEmail, requirePassword } from '@loglens/validation';
import { AppError } from '../errors/app-error.js';

export function credentials(body: unknown) {
  const b = body as Record<string, unknown>;
  const email = requireEmail(b.email);
  if (!email.ok) throw new AppError(400, email.error, 'INVALID_EMAIL');
  const password = requirePassword(b.password);
  if (!password.ok) throw new AppError(400, password.error, 'INVALID_PASSWORD');
  return { email: email.value, password: password.value };
}
