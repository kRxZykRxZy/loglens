export const tables = [
  'user_profiles',
  'projects',
  'api_keys',
  'events',
  'event_groups',
  'schema_migrations',
] as const;
export type TableName = (typeof tables)[number];
