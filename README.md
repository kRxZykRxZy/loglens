# LogLens

Developer logging and monitoring platform with a modular TypeScript API and Vite/React dashboard.

## Architecture

- `apps/api` — Express API, split into config, controllers, middleware, routes, services, repositories, database, auth, validators, errors and utilities.
- `apps/web` — Vite + React + TypeScript dashboard, with shadcn-style local UI primitives and HeroUI integration.
- `/api/*` — programmatic API.
- `/` — production Vite frontend, served by the API when `apps/web/dist` exists.
- PostgreSQL — users, sessions, projects, API keys, events and event groups.

## Phase 1–3 foundation

Authentication uses bcrypt password hashes, SHA-256 session-token hashes and HTTP-only SameSite cookies. Authenticated project routes are separated from transport controllers and database repositories.

## Development

```bash
npm install
npm run dev:api
npm run dev:web
```

## Production

```bash
npm install
npm run build
npm start
```

The SDK remains a separate repository and communicates with `/api`, never directly with PostgreSQL.
