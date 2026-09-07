import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let anonClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

function requireConfig(url: string, key: string, role: string): void {
  if (!url || !key) {
    throw new Error(
      `Supabase ${role} client is not configured. Set SUPABASE_URL and the appropriate key.`,
    );
  }
}

export const supabaseAnon = (): SupabaseClient => {
  requireConfig(env.supabaseUrl, env.supabaseAnonKey, 'anon');
  anonClient ??= createClient(env.supabaseUrl, env.supabaseAnonKey);
  return anonClient;
};

export const supabaseService = (): SupabaseClient => {
  requireConfig(env.supabaseUrl, env.supabaseServiceRoleKey, 'service');
  serviceClient ??= createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return serviceClient;
};