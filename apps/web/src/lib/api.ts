import { ApiClient, ApiClientError } from '@loglens/api-client';
import { supabase } from './supabase';

export { ApiClientError as ApiError };

const client = new ApiClient({
  baseUrl: '/api',
  getToken: async () => (await supabase?.auth.getSession())?.data.session?.access_token,
});

export const api = <T>(path: string, init: RequestInit = {}): Promise<T> =>
  client.request<T>(path, init);
