import { env } from '../config/env.js';
import { supabaseService } from '../supabase/clients.js';

const bucket = () => env.supabaseStorageBucket;

export async function uploadJson(prefix: string, id: string, body: string) {
  const storage = supabaseService().storage.from(bucket());
  const { error } = await storage.upload(`${prefix}/${id}.json`, body, {
    contentType: 'application/json',
    upsert: true,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return `${prefix}/${id}.json`;
}

export async function signedUrl(path: string, expiresInSeconds = 3600) {
  const storage = supabaseService().storage.from(bucket());
  const { data, error } = await storage.createSignedUrl(path, expiresInSeconds);
  if (error) throw new Error(`Storage signed URL failed: ${error.message}`);
  return data.signedUrl;
}

export async function remove(path: string) {
  const storage = supabaseService().storage.from(bucket());
  const { error } = await storage.remove([path]);
  if (error) throw new Error(`Storage removal failed: ${error.message}`);
}