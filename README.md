# LogLens

LogLens is a simple developer logging and monitoring service.

## Current implementation

Phases 1-3 are implemented:

- One Node.js/TypeScript server.
- Web app at `/`.
- Programmatic API under `/api/*`.
- PostgreSQL persistence.
- Users, sessions, projects and API-key database foundations.
- Email/password registration and login.
- Secure, HTTP-only session cookies with hashed session tokens.
- Project creation/listing for authenticated users.

The Node.js SDK lives separately in [`kRxZykRxZy/loglens-sdk`](https://github.com/kRxZykRxZy/loglens-sdk). It is intended to provide a developer-facing API such as:

```ts
import { authenticateUser, logEvent } from 'loglens-sdk';
```

The SDK should communicate with this application's `/api` endpoints rather than containing server-side database logic.

## Environment

Set `PORT`, `DATABASE_URL`, and optionally `SESSION_TTL_DAYS`.

## Run

```bash
npm install
npm run dev
```

For production:

```bash
npm run build
npm start
```
