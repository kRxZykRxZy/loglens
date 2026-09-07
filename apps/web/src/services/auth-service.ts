import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import type { AuthResponse, User } from '../types/auth';

export async function login(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.session) throw new Error('Login did not return a session');
  return { session: data.session };
}

export async function register(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { session: data.session };
}

export async function logout() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function me() {
  return api<AuthResponse>('/auth/me');
}

export function toUser(user: { id: string; email?: string | null }): User {
  return { id: user.id, email: user.email ?? '' };
}

export function onAuthChange(
  callback: (user: User | null) => void,
): { unsubscribe: () => void } {
  if (!supabase) return { unsubscribe: () => {} };
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toUser(session.user) : null);
  });
  return { unsubscribe: () => subscription.unsubscribe() };
}