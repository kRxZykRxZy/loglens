import { AppError } from '../errors/app-error.js';
export function credentials(body: unknown) {
  const b = body as Record<string, unknown>;
  if (typeof b.email !== 'string' || !b.email.includes('@'))
    throw new AppError(400, 'Valid email is required', 'INVALID_EMAIL');
  if (typeof b.password !== 'string' || b.password.length < 8)
    throw new AppError(400, 'Password must be at least 8 characters', 'INVALID_PASSWORD');
  return { email: b.email.trim().toLowerCase(), password: b.password };
}
