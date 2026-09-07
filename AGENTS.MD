# AGENTS.MD — LogLens Engineering Rules

This file is the operating contract for humans and coding agents working in the LogLens repository.

## 1. Mission

Build LogLens into a reliable developer logging and monitoring platform without sacrificing modularity, security, performance, or maintainability.

The product consists of:

- a React/Vite web application served from `/`
- an Express/TypeScript API served under `/api/*`
- PostgreSQL persistence
- a separate public SDK repository consuming the API
- a future CLI/TUI consuming the API
- background workers for retention, grouping, alerts, and usage/billing work

## 2. Non-negotiable architecture rules

### Never recreate the monolith

Do not add a giant `server.ts`, `app.ts`, `auth.ts`, or `db.ts` containing unrelated responsibilities.

`index.ts` is process bootstrap only.

`app.ts` is application composition only.

Routes register endpoints.

Controllers translate HTTP to use cases.

Services implement business use cases.

Repositories own database persistence.

Validators validate external data.

Middleware handles cross-cutting HTTP concerns.

Utilities contain small reusable pure/general functions.

### Respect dependency direction

Preferred backend dependency direction:

```text
routes
  -> controllers
     -> services
        -> repositories
           -> database
```

Cross-cutting dependencies such as config, errors, types, logging, and utilities may be consumed where appropriate.

Repositories must not import controllers.

Services must not import Express route registration.

Frontend code must not import backend-only modules.

### Modular means meaningful

Do not create files merely to satisfy a file count. Every file must have a clear responsibility and a useful reason to exist.

Large domains should be decomposed into cohesive modules. A feature may contain types, validators, controller(s), service(s), repositories, serializers, hooks, components, tests, and documentation as required.

## 3. Current stack

### API

- Node.js 20+
- TypeScript
- Express 5
- PostgreSQL via `pg`
- bcryptjs for password hashing
- cookie package for HTTP cookie serialization/parsing

### Web

- Vite
- React
- TypeScript
- HeroUI
- shadcn/ui-style local primitives
- Lucide icons where useful

### Tooling

- ESLint 9+
- ESLint Flat Config
- TypeScript ESLint
- Prettier
- npm workspaces

## 4. Required validation before declaring work complete

Run:

```bash
pnpm install
pnpm run typecheck
pnpm run lint
pnpm run build
```

For a feature with tests, also run the relevant test command and the full suite before merging.

`npm run validate` is the aggregate quality gate once all dependencies are installed.

Never claim a build, test, or lint pass unless it was actually run.

## 5. ESLint rules

The repository uses `eslint.config.mjs` as the canonical Flat Config. Do not add legacy `.eslintrc`, `.eslintrc.js`, `.eslintrc.json`, or `.eslintignore` files.

When adding a new language/framework plugin:

1. Add it to the appropriate workspace/root dependencies.
2. Configure it in `eslint.config.mjs` using Flat Config.
3. Scope it to the smallest applicable file patterns.
4. Prefer errors for correctness/security issues and warnings for maintainability guidance.
5. Keep generated files excluded.

Do not disable lint rules inline unless there is a documented, local reason.

When using an eslint-disable comment, explain the reason in the same comment when practical.

## 6. TypeScript rules

- Keep `strict` mode enabled.
- Avoid `any`; if unavoidable, document why.
- Prefer explicit domain types over broad records.
- Use type-only imports where appropriate.
- Do not use unsafe casts to bypass architecture problems.
- Preserve `forceConsistentCasingInFileNames`.
- Keep server and browser types separated unless explicitly shared through `packages/shared`.

## 7. API conventions

API endpoints live under `/api`.

Use stable JSON responses.

Successful collection endpoints should have predictable collection keys where useful:

```json
{ "projects": [] }
```

Successful mutation endpoints should clearly identify the resulting resource:

```json
{ "project": { "id": "..." } }
```

Errors should use the centralized error handler and eventually follow:

```json
{
  "error": {
    "code": "SOME_STABLE_CODE",
    "message": "Human-readable message",
    "requestId": "request-id"
  }
}
```

Do not leak SQL errors, secrets, passwords, authentication headers, or internal stack traces to clients in production.

## 8. Authentication and authorization

Authentication and authorization are different concerns.

Authentication answers: who is this request from?

Authorization answers: may this identity access this resource?

Every project-scoped operation must perform server-side ownership or membership checks. Never trust project IDs supplied by a browser just because the user is authenticated.

Passwords must never be stored plaintext.

Session tokens must never be stored plaintext.

API keys must never be stored plaintext after creation.

Do not log secrets.

Do not add password or secret values to error messages.

## 9. Database rules

All production schema changes use append-only migrations.

Never rewrite a previously applied production migration to change its meaning.

Use parameterized SQL.

Transactions should be used when a business operation modifies multiple records and partial completion would be unsafe.

Indexes must be justified by actual access patterns.

Event-volume queries must be reviewed for pagination, index use, and time-range constraints.

Do not fetch unbounded event collections.

## 10. Event ingestion rules

Ingestion is an external trust boundary.

Every ingestion request must validate:

- authentication
- project/key validity
- payload shape
- payload size
- severity
- timestamp
- metadata
- IDs and tags

Ingestion code should remain independent from dashboard UI logic.

Batch ingestion must define deterministic partial-failure behavior.

Retries should not create silent duplicate events where idempotency is promised.

## 11. Frontend rules

Use feature-oriented organization under `apps/web/src/features`.

Shared UI components belong under `components/ui` or another clearly shared component location.

Do not copy/paste the same visual component into multiple features.

Keep API calls in services/API-client modules, not scattered through presentational components.

Prefer accessible semantic HTML.

Interactive controls must be keyboard usable.

Loading, empty, error, and success states should be intentionally designed.

Avoid giant React components. Extract hooks, view components, data adapters, and domain-specific widgets when complexity grows.

## 12. HeroUI + shadcn usage

HeroUI and shadcn-style primitives serve different purposes.

Use HeroUI for higher-level widgets and interaction patterns when it improves consistency.

Use shadcn-style local primitives for low-level composability and application-owned styling.

Do not introduce a third component library without an explicit architecture decision.

## 13. API client and SDK boundary

The separate SDK repository talks to `/api` only.

Never place PostgreSQL or server-only logic in the SDK.

The web application should use the same HTTP contract model as other consumers wherever practical.

Prefer shared transport types through `packages/shared` and reusable API-client functionality through `packages/api-client`.

## 14. Error handling

Expected errors should be represented by typed application errors.

Unexpected errors should be logged with a request ID and converted into a safe generic response.

Do not silently swallow errors.

Do not use empty `catch {}` blocks unless the failure is intentionally ignored and documented.

## 15. Logging and observability

Log useful operational information:

- request ID
- route
- method
- status
- duration
- service/module context
- safe error code

Never log:

- passwords
- session tokens
- API keys
- authorization headers
- payment secrets
- arbitrary sensitive metadata

Log structured data where possible so LogLens can eventually monitor LogLens.

## 16. Testing expectations

Every critical feature should have tests at the correct layer.

Pure transformations -> unit tests.

Services -> unit/service tests plus integration tests where persistence matters.

Repositories -> integration tests with PostgreSQL.

Routes -> API integration/contract tests.

Frontend interactions -> component tests.

Critical end-user journeys -> end-to-end tests.

Bug fixes should generally include regression coverage.

## 17. Documentation expectations

A feature that changes public behavior should update documentation.

Keep `todo.md` accurate.

Keep `architecture.md` accurate when boundaries or major technology decisions change.

Keep this file focused on rules and workflow rather than becoming another full architecture document.

## 18. Dependency policy

Before adding a package, ask:

1. Is it solving a real problem?
2. Is the functionality small enough to implement locally?
3. Does it add security, bundle, or maintenance cost?
4. Is it compatible with the existing architecture?

Do not add duplicate libraries for the same job.

Pin/lock dependencies through the repository's package manager workflow and review upgrades deliberately.

## 19. Security-sensitive changes

For auth, billing, API-key handling, permissions, webhooks, or data export/deletion:

- identify trust boundaries
- validate all inputs
- fail closed
- avoid leaking sensitive information
- add tests for unauthorized access
- add tests for invalid state
- update documentation

## 20. Performance expectations

Do not optimize prematurely, but do not knowingly introduce unbounded work into hot paths.

The ingestion endpoint is a hot path.

Event search is a hot path.

Dashboard aggregation can become expensive.

Prefer indexed, bounded, time-ranged queries and batch operations where appropriate.

## 21. Git workflow

Use focused commits.

Good examples:

```text
feat(auth): add session rotation
feat(ingest): add bulk event ingestion
fix(projects): enforce ownership on lookup
chore: update eslint flat config
```

Do not mix unrelated refactors into feature commits unless the refactor is required for correctness.

Whenever a `todo.md` checklist item is ticked off (`[x]`), immediately push the completed work to the remote GitHub repository (`origin`) before moving on to the next item. Use a focused commit that matches the completed item, then `git push`. Resume the next todo item only after the push succeeds.

## 22. PR / review checklist

Before merging, verify:

- [ ] Architecture boundaries remain intact.
- [ ] No secrets were committed.
- [ ] Input validation exists.
- [ ] Authorization exists where required.
- [ ] Errors are handled.
- [ ] Tests exist for critical behavior.
- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] Documentation/TODO updated.
- [ ] Deprecated or dead code removed.

## 23. How to work on a phase

For each phase:

1. Read `architecture.md`.
2. Read the matching section in `todo.md`.
3. Inspect existing modules before creating replacements.
4. Implement the domain in modular layers.
5. Add or update migrations if needed.
6. Add validation and authorization.
7. Add tests.
8. Update docs.
9. Run lint, typecheck, tests, and build.
10. Only then mark the checklist items complete.

## 24. What agents must not do

Agents must not:

- reintroduce a monolithic backend
- bypass repositories with scattered SQL
- put database code in React
- put browser-only code in the API
- store plaintext passwords, sessions, or API keys
- trust client-provided ownership
- disable ESLint globally to make code pass
- create fake placeholder files to satisfy a file-count target
- claim tests/builds passed when they were not run
- delete working functionality without replacing it
- silently change public API contracts
- commit `.env` secrets

## 25. Definition of done

The implementation is done when the behavior works, is tested, is documented, passes quality gates, respects security boundaries, and leaves the repository more modular rather than less modular.
