# Deployment guide

How to deploy LogLens to production.

## Architecture

- **PostgreSQL + Auth + Storage**: Supabase (project-level credentials).
- **API**: a Node.js 20+/Express server serving `/api/*` and the built SPA under `/`. Deploy as a single process behind a load balancer.
- **Web**: built with Vite, output served by the API (no separate static host required). A separate static host works only if the API base URL is configured accordingly.

## Artifacts

```bash
pnpm install --frozen-lockfile
pnpm run validate
pnpm run build
```

Build output: `apps/api/dist` and `apps/web/dist`, plus built packages in `packages/*/dist`.

## Environment

Set (see `apps/api/.env.example`):

- `NODE_ENV=production`
- `DATABASE_URL` — Supabase Postgres **transaction-mode pooler** URI (port 6543).
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET=payloads`
- `CORS_ORIGIN` — your web app origin (or `*` only if the SPA is served from the same origin and CORS can be disabled).
- `BODY_LIMIT`, `LOG_LEVEL`, `PORT`

Any user- or project-specific secrets go in the platform secret store. Never bake them into images or commits.

## Schema

Run migrations as part of the release:

```bash
npm --workspace apps/api run migrate
```

The runner applies pending migrations idempotently. Run it once before starting new API instances.

## Database and service hardening

- Supabase RLS policies remain enabled; the API authenticates users via JWTs verified through the Supabase auth API with the service-role key.
- Use the Supabase transaction-mode pooler to keep connection counts bounded.
- Verify the `payloads` bucket is private and its policies restrict access to API-signed URLs.
- Enable SSL/TLS for all connections.

## Process runtime

- Run the API with a process manager (systemd, PM2) or on a managed platform (Fly.io, Render, Railway).
- Kill signals `SIGTERM`/`SIGINT` trigger graceful shutdown: stop accepting connections, drain in-flight requests, close the pool (10-second force timeout).
- Health checks for the load balancer: `/health/live` (process) and `/health/ready` (database reachable).

## Observability

- Structured JSON logs include `requestId`, `method`, `route`, `status`, `durationMs`, and module context. Ship to your log aggregator.
- Never log passwords, tokens, API keys, or authorization headers (enforced by convention in `apps/api/src/logger`).

## CI/CD

`.github/workflows/ci.yml` runs typecheck, lint, tests, build, and format check on every push/PR. Deployment can be triggered from the same workflow after the quality gate passes by adding a deployment job.

## Backup

- Supabase-managed backups cover Postgres. For data-export guarantees, run periodic logical backups (`pg_dump`) of production and verify restore.
- Storage payload blobs are covered by Supabase storage backups; verify bucket restore behavior before relying on a single copy.
- See `docs/data-retention.md` for retention job behavior.
