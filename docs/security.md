# Sessions, passwords, and account lifecycle

How LogLens handles authentication state, passwords, and account data.

## Sessions

- Authentication is delegated to Supabase GoTrue. LogLens never stores session tokens; tokens are JWT bearer tokens verified server-side on every request via `auth.getUser`.
- **Session renewal/rotation**: Supabase issues short-lived access + refresh tokens. The web client refreshes automatically (`supabase.auth` auto-refresh) and on bootstrap (`getSession`/`refreshSession` in `hooks/useAuth`). Rotation is handled by GoTrue — each refresh rotates the refresh token, and a refresh token is single-use.
- **Expired session cleanup**: GoTrue tracks sessions server-side and removes expired sessions. `signOut` and password resets revoke the user's sessions.
- **Revoking sessions**: from the Sessions page, a user can revoke all sessions (`POST /auth/sessions/revoke` records the audit event; the client signs out locally). A password change by the user invalidates the GoTrue sessions as configured by Supabase.
- Sessions are HTTP-only in the sense that tokens live in the Supabase client storage, not in a cookie we control; we never accept tokens from URLs or query strings.

## Passwords

- Passwords are handled exclusively by Supabase Auth (GoTrue), which hashes with bcrypt. LogLens never stores plaintext or even a hash locally — those tables were dropped in migration 006.
- Strength validation happens client- and server-side before signup: minimum 8 characters, must contain letters and numbers.
- Reset flow: `POST /auth/forgot-password` triggers Supabase's `resetPasswordForEmail` with a redirect to `/reset-password`; the recovery token is exchanged by Supabase and the new password is set via `updateUser`.
- Registration rate-limit protects signup; password reset asks are rate-limited (`auth:forgot`) and do not disclose whether an email exists.

## Account lifecycle

- **Registration** creates the Supabase user and a `user_profiles` row (upserted on conflict).
- **Email verification** is handled by GoTrue confirmation emails; users can request a resend via `POST /auth/resend-confirmation`.
- **Export** (`GET /auth/export`) streams a JSON file containing the profile, projects, and events for all projects the user can access, and records an audit event.
- **Deletion** (`DELETE /auth/account`) deletes the Supabase user (admin API) and cascades local rows (`user_profiles`, `projects`, `events`, `memberships`, `auth_events`). After deletion the session is invalidated.
- **Audit events** (`auth_events` table, `GET /auth/events`) record register, login, logout, forgot-password, resend-confirmation, export, revoke-all-sessions, and deletion.

## Rate limiting

- `POST /auth/login`: 20/min per IP
- `POST /auth/register`: 10/min per IP
- `POST /auth/forgot-password` and `/auth/resend-confirmation`: 3/min per IP

429 responses carry `Retry-After` and use the stable `RATE_LIMITED` code.
