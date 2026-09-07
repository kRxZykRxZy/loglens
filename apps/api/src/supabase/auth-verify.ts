import { supabaseService } from '../supabase/clients.js';

export type SupabaseUser = {
  id: string;
  email?: string | null;
};

export async function verifyAccessToken(token: string): Promise<SupabaseUser | null> {
  const { data, error } = await supabaseService().auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email };
}

export function extractBearerToken(header?: string): string | null {
  if (!header) return null;
  const match = /^Bearer\s+([^\s]+)$/i.exec(header.trim());
  return match ? match[1] : null;
}