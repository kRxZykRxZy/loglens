# LogLens

Developer logging and monitoring platform with a modular TypeScript API and Vite/React dashboard.

## Architecture

- `apps/api` — Express API, split into config, controllers, middleware, routes, services, repositories, database, auth, validators, errors and utilities.
- `apps/web` — Vite + React + TypeScript dashboard, with shadcn-style local UI primitives and HeroUI integration.
- `/api/*` — programmatic API.
- `/` — production Vite frontend, served by the API deployment.
- PostgreSQL — users, sessions, projects, API keys, events and event groups.

Read [`architecture.md`](./architecture.md) for the canonical system design and [`todo.md`](./todo.md) for the complete implementation roadmap. Agent/developer rules live in [`AGENTS.MD`](./AGENTS.MD).

## Phase 1–3 foundation

Authentication uses bcrypt password hashes, hashed opaque session tokens and HTTP-only SameSite cookies. Authenticated project routes are separated from transport controllers and database repositories.

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
