# LogLens Architecture

## 1. Purpose

LogLens is a developer-first logging and observability platform. Applications send structured events to LogLens, while the web dashboard, CLI/TUI, alerts, and SDK consume the same public API.

The architecture is intentionally modular so ingestion, authentication, storage, analytics, UI, integrations, and billing can evolve independently without returning to a monolithic server.

## 2. Core principles

1. **API-first:** every product surface communicates through stable `/api/*` contracts.
2. **Modular by domain:** code is split by responsibility and feature rather than by one giant file.
3. **Database behind repositories:** services do not contain ad-hoc SQL scattered throughout controllers.
4. **Validation at boundaries:** HTTP payloads, query parameters, API keys, and environment variables are validated before entering business logic.
5. **Security by default:** passwords are hashed, session tokens are hashed at rest, cookies are HTTP-only, secrets are never logged, and project ownership is checked server-side.
6. **Frontend served at `/`:** the Vite/React application is the primary web surface; the backend owns `/api`.
7. **Observability:** LogLens must be able to observe itself through structured logs, request IDs, health checks, metrics, and error reporting.
8. **Incremental delivery:** each phase must leave the repository in a usable state and must add tests/docs for the functionality it introduces.

## 3. Repository layout

```text
loglens/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── database/
│   │   │   │   └── migrations/
│   │   │   ├── errors/
│   │   │   ├── middleware/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── validators/
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   └── ui/
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   ├── dashboard/
│       │   │   ├── projects/
│       │   │   ├── logs/
│       │   │   ├── errors/
│       │   │   ├── alerts/
│       │   │   └── settings/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── services/
│       │   ├── styles/
│       │   └── types/
│       └── package.json
├── packages/
│   ├── shared/
│   ├── api-client/
│   ├── validation/
│   └── config/
├── docs/
├── tests/
├── AGENTS.MD
├── ARCHITECTURE.md (this document; canonical filename is `architecture.md` on case-sensitive systems)
├── TODO.md (canonical filename is `todo.md`)
├── eslint.config.mjs
├── package.json
└── tsconfig.json
```

## 4. Backend architecture

### Bootstrap

`apps/api/src/index.ts` is the process entrypoint. It loads environment configuration, builds the Express application, starts the HTTP listener, and performs controlled shutdown.

`apps/api/src/app.ts` assembles middleware and routers. It must not contain business logic.

### Routes

Routes define HTTP shape and delegate immediately to controllers. A route file should never contain SQL or domain decisions.

Expected route domains:

```text
/api/health
/api/auth/*
/api/projects/*
/api/ingest
/api/events/*
/api/logs/*
/api/errors/*
/api/alerts/*
/api/api-keys/*
/api/settings/*
/api/billing/*
```

### Controllers

Controllers translate HTTP requests into application-service calls and application results into HTTP responses. They own status codes and response envelopes, not persistence logic.

### Services

Services implement use cases. Examples:

```text
AuthService
SessionService
ProjectService
ApiKeyService
IngestionService
EventService
EventGroupingService
DashboardService
AlertService
QuotaService
BillingService
```

Services may coordinate multiple repositories and may enforce domain invariants.

### Repositories

Repositories are the persistence boundary. Each aggregate gets its own repository module where appropriate. Repositories own SQL, result mapping, and database-specific details.

### Database

PostgreSQL is the source of truth.

Foundational entities:

- `users`
- `sessions`
- `projects`
- `api_keys`
- `events`
- `event_groups`

Future entities:

- `alerts`
- `alert_deliveries`
- `subscriptions`
- `usage_counters`
- `audit_logs`
- `project_members`
- `service_tokens`

Migrations are append-only. Never rewrite an already-applied production migration. New schema changes get a new migration number.

### Error handling

Use typed application errors for expected failures. The final error middleware maps these to stable JSON error envelopes such as:

```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found",
    "requestId": "..."
  }
}
```

Unexpected errors return a generic message and are logged with request context.

## 5. Authentication model

Browser authentication uses an opaque random session token stored in an HTTP-only cookie. Only a cryptographic hash of the session token is persisted.

Flow:

```text
Browser
  -> POST /api/auth/login
  -> AuthService verifies password
  -> SessionService creates random token
  -> SessionRepository stores token hash
  -> Set-Cookie: loglens_session=...
```

Authenticated requests resolve the cookie to a session and user before protected controllers run.

API-key authentication is separate from browser sessions. Project ingestion keys use a dedicated prefix and are stored hashed, never as plaintext.

## 6. Ingestion pipeline

The planned ingestion path is:

```text
Client / SDK
  -> API key extraction
  -> request ID
  -> payload validation
  -> project lookup
  -> quota / rate limit checks
  -> normalization
  -> event persistence
  -> grouping / indexing hooks
  -> response
```

The ingestion endpoint must be optimized for small JSON payloads, predictable latency, and bulk-event support later.

Event records should support:

- severity
- message
- timestamp
- project
- environment
- service
- source
- request ID
- trace/correlation ID
- stack trace
- metadata JSON
- tags
- grouping fingerprint

## 7. Error grouping

Events with error-level severity should be eligible for grouping. The grouping layer should generate a deterministic fingerprint from normalized error information instead of requiring the entire raw message to match.

A future grouping pipeline may normalize:

- UUIDs
- numeric IDs
- timestamps
- memory addresses
- paths
- request identifiers
- line numbers

Grouping must retain the raw event while associating it with a reusable error group.

## 8. Frontend architecture

The web application is Vite + React + TypeScript and is served from `/`.

HeroUI is used for higher-level application components where appropriate. shadcn/ui-style local primitives are used for composable primitives and consistent styling. Avoid duplicating component implementations across features.

Frontend responsibilities:

- route/page composition
- server-state fetching
- form state and validation
- dashboard visualization
- project selection
- log exploration
- error inspection
- alert configuration
- account/settings UI

Feature modules should expose a small public surface. Avoid cross-feature imports into internal implementation files.

## 9. Web/API boundary

Development:

```text
Vite :5173
  -> /api proxy
     -> Express :3000
```

Production:

```text
Browser
  -> Express
     ├── /api/* -> API routers
     └── / -> built Vite assets / SPA fallback
```

The frontend must never import backend-only modules. The backend must never import UI modules.

## 10. Shared packages

`packages/shared` contains transport/domain types safe to share between browser and server.

`packages/validation` contains reusable request/data schemas that do not depend on Node-only APIs.

`packages/api-client` contains typed API client functionality suitable for the web application and future CLI/SDK integration.

`packages/config` contains cross-app build/runtime-safe configuration constants, not secret values.

## 11. SDK architecture

The separate `loglens-sdk` repository is a consumer of LogLens APIs. It must never connect directly to PostgreSQL.

Target developer experience:

```ts
import { authenticateUser, logEvent } from 'loglens-sdk';
```

The SDK should eventually support:

- authentication
- API-key configuration
- single event logging
- batch logging
- automatic retries with backoff
- environment/service defaults
- request correlation IDs
- typed responses
- graceful shutdown / flush

## 12. CLI/TUI architecture

The CLI/TUI is another API consumer, not a second backend.

Commands planned:

```text
loglens login
loglens logout
loglens projects
loglens project create
loglens keys
loglens logs
loglens logs search
loglens watch
loglens errors
loglens errors show
loglens alerts
loglens config
```

The `watch` command should use a streaming transport when available and fall back to polling when streaming is unavailable.

## 13. Quotas and billing

Initial product targets:

| Plan | Projects | Events/month | Retention | Alerts |
|---|---:|---:|---:|---|
| Free | 1 | 10,000 | 3 days | Limited |
| Pro | 10 | 500,000 | 30 days | Yes |

Quota checks should be server-side and should not depend on UI state. Billing state should come from the payment provider and be cached locally for resilient authorization checks.

## 14. Alerts

Initial alert types:

- error spike
- high error rate
- new error group
- no events received
- quota threshold

Delivery targets should begin with email and webhook. The design should allow later expansion to Slack, Discord, Microsoft Teams, PagerDuty, and similar destinations without rewriting alert rules.

## 15. Security requirements

- Passwords: bcrypt or another deliberately expensive password hashing scheme.
- Session tokens: random, high entropy, hashed at rest.
- Cookies: HTTP-only, Secure in production, SameSite=Lax unless an explicit cross-site requirement exists.
- API keys: hash at rest; expose plaintext only at creation time.
- SQL: parameterized queries only.
- Validation: all externally controlled input is validated.
- Authorization: every project-scoped operation checks ownership or membership.
- Logging: never log passwords, session tokens, API keys, or raw authentication headers.
- Errors: do not expose database errors or stack traces to untrusted clients in production.
- Headers: disable framework identification and add standard security headers as deployment matures.
- Rate limits: protect login, registration, ingestion, and expensive query endpoints.

## 16. Testing strategy

Testing is layered:

1. Unit tests for pure utilities and domain logic.
2. Service tests with repository mocks/fakes where practical.
3. Integration tests against a real PostgreSQL test database for persistence and auth.
4. API contract tests for route behavior and error envelopes.
5. Frontend component tests for important interaction flows.
6. End-to-end tests for registration, login, project creation, ingestion, log exploration, and alert configuration.
7. Load tests for ingestion and log-query paths before public scale.

Every bug fix should add a regression test when practical.

## 17. CI/CD architecture

CI should eventually run:

```text
install
  -> lint
  -> typecheck
  -> unit tests
  -> integration tests
  -> web build
  -> api build
  -> dependency/security checks
```

Deployment must build immutable artifacts and inject secrets through the runtime environment rather than committing `.env` files.

## 18. Operational requirements

Production needs:

- structured application logs
- request IDs
- health endpoint
- readiness check
- database connection monitoring
- graceful shutdown
- migration strategy
- backup strategy
- alerting on ingestion failures
- error tracking
- usage metrics
- uptime monitoring

## 19. Modularity rules

A file becomes suspicious when it simultaneously owns multiple architectural layers. In particular, do not create files that combine:

- routing + SQL
- UI + API transport
- authentication + password hashing + route registration
- database schema + runtime configuration
- billing + UI presentation

Prefer several cohesive modules over one giant file. The target is not file count for its own sake; every file should represent a meaningful boundary.

## 20. Phase progression

### Phase 1 — Foundation
Repository structure, Node/TypeScript, Vite/React frontend, Express API, shared contracts, build/dev tooling, linting, formatting, baseline UI shell.

### Phase 2 — Database
Migrations, PostgreSQL access layer, domain schema, indexes, repositories, transaction support, migration runner, test database strategy.

### Phase 3 — Authentication
Registration, login, logout, current-user lookup, session lifecycle, password security, validation, authorization middleware, account UI.

### Phase 4 — Projects and API keys
Project CRUD, ownership, slugging, API-key creation/revocation/rotation, masked secrets, project settings UI.

### Phase 5 — Ingestion
Single/bulk ingestion, schema validation, normalization, API-key auth, quotas, rate limiting, persistence, SDK support.

### Phase 6 — Dashboard
Project overview, event/error counts, charts, recent events, time ranges, environment/service filters.

### Phase 7 — Log explorer
Search, filters, sorting, pagination/cursors, event detail drawer/page, JSON metadata, stack trace rendering, deep links.

### Phase 8 — Errors and alerts
Error grouping, group pages, fingerprints, alert rules, alert evaluations, delivery workers, webhook/email integrations.

### Phase 9 — CLI/TUI
Authentication, projects, logs, errors, watch mode, config files, terminal UX, retries, API client reuse.

### Phase 10 — Production and monetization
Usage accounting, quotas, subscriptions, billing, abuse prevention, data retention, cleanup jobs, backups, CI/CD, observability, documentation, launch readiness.

## 21. Definition of done for a phase

A phase is not complete merely because source files exist. It is complete when:

- functionality is implemented
- public behavior is documented
- validation and error handling exist
- tests cover critical paths
- lint passes
- TypeScript passes
- builds pass
- database changes have migrations where needed
- security implications are reviewed
- TODO items are checked only when actually verified
- no obsolete monolithic implementation remains
