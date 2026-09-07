# LogLens

Developer logging and monitoring platform with a modular TypeScript API and Vite/React dashboard.

## Architecture

- `apps/api` — Express API, split into config, controllers, middleware, routes, services, repositories, database, auth, validators, errors and utilities.
- `apps/web` — Vite + React + TypeScript dashboard, with shadcn-style local UI primitives and HeroUI integration.
- `/api/*` — programmatic API.
- `/` — production Vite frontend, served by the API deployment.
- PostgreSQL — Supabase-managed PostgreSQL for user profiles, projects, API keys, events and event groups.
- Supabase — managed Auth (identities + JWTs), Postgres (persistence) and Storage (large event payloads and attachments).

Read [`architecture.md`](./architecture.md) for the canonical system design and [`todo.md`](./todo.md) for the complete implementation roadmap. Agent/developer rules live in [`AGENTS.MD`](./AGENTS.MD).

## Phase 1–3 foundation

Authentication is handled by Supabase Auth. Users authenticate by email/password and receive a Supabase session; the browser stores the Supabase tokens and the API verifies them via the Supabase service-role client on every protected request (`/api/auth/me`, `/api/projects/*`). Local LogLens user profiles are keyed by the Supabase Auth user id.

## Supabase setup

Copy `/api/.env.example` values into a local `.env` (API) and `apps/web/.env.example` values into `apps/web/.env` (web). The web app uses the public anon key; the API uses the service-role key for verification and storage:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` — the Supabase Postgres pooler (transaction mode) connection string

Create the Storage bucket named in `SUPABASE_STORAGE_BUCKET` (default `payloads`) in the Supabase dashboard.

## Development

```bash
npm install
npm run dev:api
npm run dev:web
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run lint:fix
npm run format:check
npm run format:write
npm test
npm run validate
```

ESLint is version 9+ using the Flat Config file `eslint.config.mjs`. Do not add legacy `.eslintrc*` or `.eslintignore` configuration.

## Production

```bash
npm install
npm run build
npm start
```

The SDK remains a separate repository and communicates with `/api`, never directly with PostgreSQL.
