import { supabase } from './supabase';

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

type ApiErrorBody = { error?: string; code?: string; message?: string };

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = (await supabase?.auth.getSession())?.data.session?.access_token;

  const mergedHeaders = new Headers(init.headers);
  if (token) mergedHeaders.set('Authorization', `Bearer ${token}`);

  const r = await fetch(`/api${path}`, {
    ...init,
    headers: mergedHeaders,
    credentials: 'include',
  });

  if (!r.ok) {
    const body: ApiErrorBody = await r.json().catch(() => ({}));
    throw new ApiError(r.status, body.error ?? body.message ?? 'Request failed', body.code);
  }
  return r.status === 204 ? (undefined as T) : r.json();
}