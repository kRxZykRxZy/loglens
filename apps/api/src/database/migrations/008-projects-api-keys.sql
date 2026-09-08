ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';

ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS archived_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS projects_user_slug_idx ON projects(user_id, slug);

ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS last_used_at timestamptz;
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS revoked_at timestamptz;

ALTER TABLE project_members ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'removed'));
ALTER TABLE project_members ADD COLUMN IF NOT EXISTS invited_by uuid;
ALTER TABLE project_members ADD COLUMN IF NOT EXISTS invited_email text;