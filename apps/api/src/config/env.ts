const port = Number(process.env.PORT ?? 3000);

export const env = {
  port,
  databaseUrl: process.env.DATABASE_URL ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'payloads',
};