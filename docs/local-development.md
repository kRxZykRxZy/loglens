# Local development guide

How to run LogLens on a development machine.

## Prerequisites

- Node.js 20+
- pnpm 9+ (uses the repo's `pnpm` workspace protocol)
- A Supabase project (free tier works) — this is both the Postgres database and the auth provider

## Install

```bash
pnpm install
```

This also installs Husky hooks (`prepare`).

## Environment

Create local env files from the examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Fill in Supabase values:

- `apps/web/.env` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (public, safe in the browser).
- `apps/api/.env` — `DATABASE_URL` (Supabase pooler transaction-mode string), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and optionally `CORS_ORIGIN`, `BODY_LIMIT`, `LOG_LEVEL`, `PORT`.

Never commit `.env` files.

## Database migrations

Migrations are append-only SQL files under `apps/api/src/db/migrations` and are tracked via the `schema_migrations` table. Run them against local Postgres:

```bash
npm --workspace apps/api run migrate
```

The runner is idempotent — applying an already-applied migration is a no-op.

## Run

Two processes:

```bash
npm --workspace apps/api run dev     # API on http://localhost:3000, serves the app under /
npm --workspace apps/web run dev     # Vite dev server on http://localhost:5173
```

The API serves the built web app at `/`; during development you typically use the Vite server for HMR. Ensure `CORS_ORIGIN` matches the Vite origin.

## Verify

Liveness/readiness:

```bash
curl http://localhost:3000/health/live
curl http://localhost:3000/health/ready   # probes the database
```

Auth: register via the web UI's `/login` page (Supabase-hosted signup). Sessions are JWT Bearer tokens.

## Tests and quality

```bash
npm test                 # unit tests (Vitest)
npm run test:coverage    # with v8 coverage report to ./coverage
npm run typecheck
npm run lint
npm run build
npm run validate         # all of the above except tests
```

## Troubleshooting

- `Ready probe fails` — database credentials or pooler region are wrong; check `DATABASE_URL`.
- `401 on project calls` — no session in the browser; sign in, or token expired (Supabase session refresh).
- `Rename/add a Supabase column` — add a new migration; never edit an applied migration.
- Formatting or lint on commit — Husky + lint-staged run Prettier/ESLint; fix or `--no-verify` temporarily while iterating.
