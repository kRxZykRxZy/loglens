export type ValidationResult = { ok: true; value: string } | { ok: false; error: string };

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isSeverityValue(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    (['debug', 'info', 'warn', 'error', 'fatal'] as readonly string[]).includes(value)
  );
}

export function isIsoTimestamp(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const t = Date.parse(value);
  return Number.isFinite(t) && new Date(t).toISOString() === value;
}

export function requireString(
  value: unknown,
  field: string,
  opts: { minLength?: number; maxLength?: number; trim?: boolean } = {},
): ValidationResult {
  if (typeof value !== 'string' || !value.trim()) {
    return { ok: false, error: `${field} is required` };
  }
  const trimmed = opts.trim === false ? value : value.trim();
  if (opts.minLength !== undefined && trimmed.length < opts.minLength) {
    return { ok: false, error: `${field} must be at least ${opts.minLength} characters` };
  }
  if (opts.maxLength !== undefined && trimmed.length > opts.maxLength) {
    return { ok: false, error: `${field} must be at most ${opts.maxLength} characters` };
  }
  return { ok: true, value: trimmed };
}

export function requireEmail(value: unknown, field = 'email'): ValidationResult {
  const result = requireString(value, field, { maxLength: 254, trim: true });
  if (!result.ok) return result;
  return isEmail(result.value)
    ? { ok: true, value: result.value.toLowerCase() }
    : { ok: false, error: `A valid ${field} is required` };
}

export function requirePassword(value: unknown, field = 'password'): ValidationResult {
  const result = requireString(value, field, { minLength: 8, maxLength: 1024, trim: false });
  if (!result.ok) return result;
  return /^.*[A-Za-z].*\d.*$|^.*\d.*[A-Za-z].*$/.test(result.value)
    ? { ok: true, value: result.value }
    : { ok: false, error: `${field} must contain letters and numbers` };
}

export function requireSeverity(value: unknown, field = 'severity'): ValidationResult {
  if (typeof value !== 'string' || !isSeverityValue(value)) {
    return { ok: false, error: `${field} must be one of debug, info, warn, error, fatal` };
  }
  return { ok: true, value: value };
}

export function requireEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
): ValidationResult {
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    return { ok: false, error: `${field} must be one of: ${allowed.join(', ')}` };
  }
  return { ok: true, value: value as T };
}
