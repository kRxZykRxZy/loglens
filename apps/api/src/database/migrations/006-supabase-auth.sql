ALTER TABLE users RENAME TO user_profiles;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS password_hash;
DROP TABLE IF EXISTS sessions;