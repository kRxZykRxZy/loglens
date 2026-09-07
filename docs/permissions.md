# Permissions and authorization

LogLens permission model for project-scoped resources.

## Identity and roles

- Every request carries a Supabase session; the API verifies the access token with the Supabase Auth API (`requireAuth`).
- A project-scoped operation resolves the caller's role through `project_members`.
- The project creator is recorded as `owner` at creation time (implicitly, via the membership row). Non-member callers are denied.
- Legacy projects without a membership row fall back to `owner` when `projects.user_id` matches, so authorization never breaks existing data.

Roles: `owner` → `admin` → `member` → `viewer`.

## Permission matrix

| Role   | Read | Write | Admin | Notes                       |
| ------ | ---- | ----- | ----- | --------------------------- |
| owner  | yes  | yes   | yes   | Can transfer/delete/project |
| admin  | yes  | yes   | yes   | Full manage, no transfer    |
| member | yes  | yes   | no    | Can ingest and create       |
| viewer | yes  | no    | no    | Read-only                   |
| (none) | no   | no    | no    | Not a member                |

## Enforcement

- `requireAuth` (middleware) is applied at the router level for user-scoped endpoints.
- Project-scoped handlers call `requireRead` / `requireWrite` / `requireAdmin` from `services/authorize-service.ts`, which resolve the effective role and throw `403 FORBIDDEN` on mismatch.
- The service layer re-checks ownership/membership even when the controller already has the caller ID — never trust a project ID from the browser alone.
- Member operations (invite, role change, removal) require `admin`. Project deletion/transfer require `owner` (Phase 4 hardens these).

## Testing

Project-scoped endpoints have authorization tests asserting:

- non-members get `403`,
- `viewer` cannot write,
- `member` cannot admin,
- `owner` can do everything.

These live alongside the endpoint tests in `apps/api/src/**/*.test.ts`.
