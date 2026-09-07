import { pool } from './pool.js';
export async function query<T = unknown>(text: string, params: unknown[] = []) {
  return pool.query<T>(text, params);
}
