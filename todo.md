# LogLens — Master TODO

This is the canonical implementation checklist for the entire LogLens product. A checked item means the repository already contains the implementation or documented foundation and it has been intentionally accounted for. An unchecked item still requires implementation, verification, testing, or production hardening.

Status legend:

- [x] Done / implemented in repository
- [ ] Todo / not complete
- [~] Planned foundation exists, but production-grade completion remains

## Product definition

- [x] Define LogLens as a developer logging/monitoring platform.
- [x] Define `/` as the web application entry point.
- [x] Define `/api/*` as the backend API boundary.
- [x] Define a separate `loglens-sdk` repository as an API consumer.
- [x] Define Free and Pro product tiers.
- [ ] Validate pricing with real users.
- [ ] Write final product positioning and launch copy.
- [ ] Define target customer personas.
- [ ] Define launch success metrics.

---

# Phase 1 — Foundation

## Repository and workspace

- [x] Convert repository toward an npm workspace monorepo.
- [x] Create `apps/api` workspace.
- [x] Create `apps/web` workspace.
- [x] Reserve `packages/*` for reusable modules.
- [x] Remove the original monolithic backend entrypoint.
- [x] Remove the original monolithic auth module.
- [x] Remove the original monolithic database module.
- [ ] Add `packages/shared`.
- [ ] Add `packages/api-client`.
- [ ] Add `packages/validation`.
- [ ] Add `packages/config`.
- [ ] Add package-level README files.
- [ ] Add dependency policy/documentation.

## Backend foundation

- [x] Express application bootstrap.
- [x] Dedicated process entrypoint.
- [x] Dedicated application factory.
- [x] API router.
- [x] Health route.
- [x] Request ID middleware.
- [x] Not-found middleware.
- [x] Centralized error middleware.
- [x] Environment configuration module.
- [ ] Centralized application logger.
- [ ] Request logging middleware.
- [ ] Readiness endpoint.
- [ ] Liveness endpoint.
- [ ] Graceful shutdown.
- [ ] Signal handling for SIGTERM/SIGINT.
- [ ] Database startup dependency checks.
- [ ] Production static SPA serving from `/`.
- [ ] API-only fallback behavior for `/api/*`.
- [ ] Compression strategy.
- [ ] Security headers.
- [ ] CORS policy.
- [ ] Request body limits by route type.

## Frontend foundation

- [x] Vite application.
- [x] React + TypeScript.
- [x] React entrypoint.
- [x] Initial app shell.
- [x] Shared layout components.
- [x] Reusable UI primitives.
- [x] HeroUI dependency.
- [x] shadcn-style local primitives.
- [x] Global CSS foundation.
- [ ] Add proper routing.
- [ ] Add route guards.
- [ ] Add global error boundary.
- [ ] Add loading/skeleton system.
- [ ] Add toast/notification system.
- [ ] Add accessible keyboard navigation.
- [ ] Add responsive mobile navigation.
- [ ] Add light/dark theme handling.
- [ ] Add persistent user preference handling.
- [ ] Add empty-state system.
- [ ] Add standardized frontend API errors.

## Tooling

- [x] ESLint 9+.
- [x] ESLint Flat Config.
- [x] TypeScript ESLint integration.
- [x] React Hooks lint rules.
- [x] React Refresh lint rule.
- [x] Prettier configuration.
- [x] Formatting ignore file.
- [x] Root `lint` script.
- [x] Root `lint:fix` script.
- [x] Root `validate` command foundation.
- [ ] Add test runner.
- [ ] Add coverage reporting.
- [ ] Add pre-commit checks.
- [ ] Add commit message conventions.
- [ ] Add GitHub Actions CI.
- [ ] Add dependency update automation.
- [ ] Add lockfile policy and committed package lock.

## Documentation

- [x] Architecture document.
- [x] Agent/developer instructions.
- [x] Master TODO.
- [ ] Add API conventions document.
- [ ] Add frontend conventions document.
- [ ] Add local-development guide.
- [ ] Add deployment guide.

---

# Phase 2 — Database

## PostgreSQL infrastructure

- [x] PostgreSQL pool abstraction.
- [x] Query abstraction.
- [x] Transaction abstraction.
- [x] Migration directory.
- [x] Core migration.
- [x] Project migration.
- [x] API-key migration.
- [x] Event migration foundation.
- [x] Event-group migration foundation.
- [ ] Migration metadata table.
- [ ] Idempotent migration runner.
- [ ] Migration CLI command.
- [ ] Migration locking.
- [ ] Migration failure reporting.
- [ ] Production migration procedure.
- [ ] Test database bootstrap.
- [ ] Database reset command for development.

## Schema hardening

- [x] Users table.
- [x] Sessions table.
- [x] Projects table.
- [x] API keys table.
- [x] Events table foundation.
- [x] Event groups table foundation.
- [ ] Alerts table.
- [ ] Alert deliveries table.
- [ ] Project members table.
- [ ] Usage counters table.
- [ ] Subscriptions table.
- [ ] Audit log table.
- [ ] Service/API token table where required.
- [ ] Foreign-key review.
- [ ] Unique constraint review.
- [ ] Check-constraint review.
- [ ] Index review with realistic query patterns.
- [ ] Retention/partitioning strategy for high-volume events.
- [ ] JSON metadata size limits.
- [ ] Database statement timeout policy.
- [ ] Connection pool sizing policy.

## Repositories

- [x] User repository.
- [x] Session repository.
- [x] Project repository.
- [x] API-key repository foundation.
- [x] Event repository foundation.
- [x] Event-group repository foundation.
- [ ] Alert repository.
- [ ] Alert delivery repository.
- [ ] Usage repository.
- [ ] Billing repository.
- [ ] Audit repository.
- [ ] Membership repository.

## Data lifecycle

- [ ] Event retention worker.
- [ ] Session expiration cleanup.
- [ ] API-key revocation semantics.
- [ ] Orphaned data cleanup.
- [ ] Database backup procedure.
- [ ] Restore test procedure.
- [ ] Disaster recovery runbook.

---

# Phase 3 — Authentication and Accounts

## API

- [x] Registration endpoint.
- [x] Login endpoint.
- [x] Logout endpoint.
- [x] Current-user endpoint.
- [x] Password hashing.
- [x] Password verification.
- [x] Random session token generation.
- [x] Session token hashing at rest.
- [x] HTTP-only cookie.
- [x] SameSite cookie policy.
- [x] Secure cookie in production.
- [x] Session expiry support.
- [x] Authentication middleware.
- [ ] Session renewal/rotation policy.
- [ ] Delete expired sessions.
- [ ] Login attempt rate limiting.
- [ ] Registration abuse protection.
- [ ] Email normalization rules.
- [ ] Password strength validation.
- [ ] Password reset flow.
- [ ] Email verification flow.
- [ ] Account deletion flow.
- [ ] Account export flow.
- [ ] Session management page.
- [ ] Revoke all sessions.
- [ ] Authentication audit events.

## Authorization

- [x] Authenticated-user context.
- [ ] Role model.
- [ ] Project ownership checks.
- [ ] Project membership checks.
- [ ] Organization/team model if required.
- [ ] Permission matrix.
- [ ] Authorization tests for every project-scoped endpoint.

## Frontend

- [~] Authentication UI foundation.
- [ ] Login page polished.
- [ ] Registration page.
- [ ] Session bootstrap hook.
- [ ] Logout action.
- [ ] Auth loading state.
- [ ] Authenticated route guard.
- [ ] Forgot password page.
- [ ] Reset password page.
- [ ] Verify email page.
- [ ] Account settings page.
- [ ] Sessions/security page.

---

# Phase 4 — Projects and API Keys

## Projects

- [x] Project listing foundation.
- [x] Project creation foundation.
- [ ] Project read endpoint.
- [ ] Project update endpoint.
- [ ] Project deletion endpoint.
- [ ] Slug collision handling.
- [ ] Project limits by plan.
- [ ] Project ownership enforcement.
- [ ] Project member invitations.
- [ ] Member roles.
- [ ] Member removal.
- [ ] Project transfer ownership.
- [ ] Project archive state.

## API keys

- [ ] Generate `ll_live_...` keys.
- [ ] Hash API keys at rest.
- [ ] Show plaintext only at creation time.
- [ ] Prefix display for identification.
- [ ] Key listing.
- [ ] Key revocation.
- [ ] Key rotation.
- [ ] Last-used timestamp.
- [ ] Key scopes if required.
- [ ] Key creation audit event.
- [ ] Key revocation audit event.

## Frontend

- [ ] Projects page.
- [ ] Project creation dialog/page.
- [ ] Project overview.
- [ ] Project settings.
- [ ] API-key management page.
- [ ] Create-key confirmation UX.
- [ ] Copy-to-clipboard UX.
- [ ] Secret disclosure warning.
- [ ] Key rotation confirmation.
- [ ] Project deletion safeguards.

---

# Phase 5 — Log Ingestion

## HTTP ingestion API

- [ ] `POST /api/ingest`.
- [ ] API-key authentication.
- [ ] API-key project resolution.
- [ ] Single-event payload validation.
- [ ] Bulk-event payload validation.
- [ ] Event size limits.
- [ ] Metadata type validation.
- [ ] Timestamp validation.
- [ ] Severity normalization.
- [ ] Environment normalization.
- [ ] Service/source normalization.
- [ ] Stack trace handling.
- [ ] Request ID handling.
- [ ] Correlation/trace ID handling.
- [ ] Tags support.
- [ ] Custom fingerprint support.
- [ ] Server-side ingestion timestamp.
- [ ] Idempotency key support.
- [ ] Bulk insert path.
- [ ] Ingestion response envelope.
- [ ] Partial failure semantics for bulk requests.
- [ ] Backpressure strategy.

## Reliability

- [ ] Per-key rate limit.
- [ ] Per-project rate limit.
- [ ] Per-account rate limit.
- [ ] Payload abuse protection.
- [ ] Quota enforcement.
- [ ] Retry-safe ingestion behavior.
- [ ] Database failure behavior.
- [ ] Temporary error responses.
- [ ] Observability for ingestion latency.
- [ ] Observability for ingestion failure rate.

## SDK integration

- [ ] Define SDK HTTP contract.
- [ ] Implement `authenticateUser` against the API.
- [ ] Implement `logEvent`.
- [ ] Implement bulk logging.
- [ ] Implement buffering.
- [ ] Implement flush behavior.
- [ ] Implement retry/backoff.
- [ ] Implement timeout handling.
- [ ] Implement API-key configuration.
- [ ] Implement default metadata.
- [ ] Implement environment defaults.
- [ ] Implement service defaults.
- [ ] Add SDK tests.
- [ ] Publish SDK documentation.

---

# Phase 6 — Dashboard

## Data/API

- [ ] Dashboard summary endpoint.
- [ ] Event-count aggregation.
- [ ] Error-count aggregation.
- [ ] Warning-count aggregation.
- [ ] Request-count aggregation where applicable.
- [ ] Time-series aggregation.
- [ ] Environment breakdown.
- [ ] Service breakdown.
- [ ] Top error groups.
- [ ] Recent events.
- [ ] Recent errors.
- [ ] Dashboard date ranges.
- [ ] Dashboard timezone handling.

## UI

- [ ] Main authenticated dashboard.
- [ ] Project selector.
- [ ] Time-range selector.
- [ ] Metric cards.
- [ ] Event trend chart.
- [ ] Error trend chart.
- [ ] Warning trend chart.
- [ ] Recent-event table.
- [ ] Top-errors table.
- [ ] Environment filter.
- [ ] Service filter.
- [ ] Loading states.
- [ ] Error states.
- [ ] Empty states.
- [ ] Responsive dashboard.

---

# Phase 7 — Log Explorer

## Query API

- [ ] Event listing endpoint.
- [ ] Cursor pagination.
- [ ] Severity filter.
- [ ] Environment filter.
- [ ] Service filter.
- [ ] Source filter.
- [ ] Time range filter.
- [ ] Full-text search.
- [ ] Request ID filter.
- [ ] Trace ID filter.
- [ ] Tag filtering.
- [ ] Error-group filtering.
- [ ] Sort direction.
- [ ] Stable ordering.
- [ ] Query validation.
- [ ] Query timeout.
- [ ] Query complexity controls.

## UI

- [ ] Log explorer page.
- [ ] Search bar.
- [ ] Filter builder.
- [ ] Severity controls.
- [ ] Environment controls.
- [ ] Service controls.
- [ ] Time controls.
- [ ] Pagination/infinite loading.
- [ ] Log event row.
- [ ] Event detail view.
- [ ] JSON metadata viewer.
- [ ] Stack trace viewer.
- [ ] Copy event JSON.
- [ ] Deep link to event.
- [ ] Keyboard shortcuts.
- [ ] Saved searches.
- [ ] Search URL state.

---

# Phase 8 — Error Groups and Alerts

## Error grouping

- [ ] Define grouping fingerprint contract.
- [ ] Normalize volatile message values.
- [ ] Strip/normalize IDs.
- [ ] Normalize paths/line numbers.
- [ ] Include exception type where available.
- [ ] Include stack trace signal.
- [ ] Create event group on first match.
- [ ] Increment group counters.
- [ ] Track first seen.
- [ ] Track last seen.
- [ ] Track affected environments.
- [ ] Track affected services.
- [ ] Group detail endpoint.
- [ ] Group event listing.
- [ ] Group resolution status.
- [ ] Resolve/reopen group actions.

## Alerts

- [ ] Error spike alert rule.
- [ ] High error-rate alert rule.
- [ ] New error-group alert.
- [ ] No-events alert.
- [ ] Quota threshold alert.
- [ ] Alert rule CRUD.
- [ ] Alert enable/disable.
- [ ] Cooldowns.
- [ ] Deduplication.
- [ ] Evaluation worker.
- [ ] Delivery worker.
- [ ] Delivery retry policy.
- [ ] Delivery history.
- [ ] Email delivery.
- [ ] Webhook delivery.
- [ ] Webhook signing secret.
- [ ] Alert test-send endpoint.
- [ ] Alert audit trail.

## UI

- [ ] Errors page.
- [ ] Error group page.
- [ ] Group timeline.
- [ ] Resolve/reopen controls.
- [ ] Alerts page.
- [ ] Alert creation flow.
- [ ] Alert edit flow.
- [ ] Alert destination management.
- [ ] Delivery history.

---

# Phase 9 — CLI/TUI

## CLI core

- [ ] CLI package/repository structure.
- [ ] Config file support.
- [ ] Environment-variable configuration.
- [ ] Secure credential storage strategy.
- [ ] API client reuse.
- [ ] Consistent terminal error formatting.
- [ ] Exit code policy.
- [ ] Verbose/debug mode.

## Commands

- [ ] `loglens login`.
- [ ] `loglens logout`.
- [ ] `loglens projects`.
- [ ] `loglens project create`.
- [ ] `loglens project delete`.
- [ ] `loglens keys`.
- [ ] `loglens logs`.
- [ ] `loglens logs search`.
- [ ] `loglens logs show`.
- [ ] `loglens watch`.
- [ ] `loglens errors`.
- [ ] `loglens errors show`.
- [ ] `loglens alerts`.
- [ ] `loglens config`.

## TUI

- [ ] Interactive project selector.
- [ ] Live event stream.
- [ ] Keyboard navigation.
- [ ] Event detail pane.
- [ ] Error grouping view.
- [ ] Search/filter controls.
- [ ] Resize-safe layout.
- [ ] Color/theme abstraction.
- [ ] Terminal compatibility testing.
- [ ] Polling fallback if streaming unavailable.

---

# Phase 10 — Production, Billing, Monetization

## Plans and quotas

- [x] Initial Free plan definition.
- [x] Initial Pro plan definition.
- [ ] Server-side plan model.
- [ ] Usage counters.
- [ ] Monthly quota reset.
- [ ] Event quota enforcement.
- [ ] Project quota enforcement.
- [ ] Retention enforcement.
- [ ] Alert entitlement checks.
- [ ] Quota warning notifications.
- [ ] Upgrade prompts.

## Billing

- [ ] Select final payment provider.
- [ ] Product definition.
- [ ] Price definition.
- [ ] Checkout flow.
- [ ] Subscription creation.
- [ ] Subscription state synchronization.
- [ ] Webhook verification.
- [ ] Failed-payment handling.
- [ ] Cancellation handling.
- [ ] Grace period policy.
- [ ] Upgrade/downgrade handling.
- [ ] Billing portal.
- [ ] Invoice/history page.
- [ ] Billing audit events.

## Abuse prevention

- [ ] IP rate limiting.
- [ ] Account rate limiting.
- [ ] Ingestion throttling.
- [ ] Login protection.
- [ ] Registration protection.
- [ ] Suspicious activity controls.
- [ ] Payload size controls.
- [ ] Query abuse protection.
- [ ] Key abuse protection.
- [ ] Automated cleanup for abuse data.

## Retention and storage

- [ ] Free-tier retention worker.
- [ ] Pro-tier retention worker.
- [ ] Event deletion jobs.
- [ ] Error-group cleanup rules.
- [ ] Storage metrics.
- [ ] Storage cost model.
- [ ] Compression strategy if needed.
- [ ] Partitioning strategy if needed.
- [ ] Archival strategy if needed.

## Operations

- [ ] Structured logs.
- [ ] Metrics.
- [ ] Tracing.
- [ ] Error tracking.
- [ ] Health monitoring.
- [ ] Readiness monitoring.
- [ ] Database monitoring.
- [ ] Queue/worker monitoring.
- [ ] Alerting.
- [ ] Uptime monitoring.
- [ ] Incident response runbook.
- [ ] Rollback procedure.
- [ ] Migration rollback policy.
- [ ] Backup monitoring.
- [ ] Restore drills.

## Deployment

- [ ] Production environment definition.
- [ ] Environment variable inventory.
- [ ] Secret management.
- [ ] Production build pipeline.
- [ ] API artifact build.
- [ ] Web artifact build.
- [ ] SPA serving from `/`.
- [ ] Database migration deployment step.
- [ ] Zero-downtime deployment strategy.
- [ ] Deployment health gate.
- [ ] Rollback automation.
- [ ] Staging environment.
- [ ] Production environment.

---

# Testing and quality gate

- [ ] Install CI dependencies reproducibly.
- [x] ESLint command exists.
- [ ] ESLint passes with zero errors.
- [ ] TypeScript passes for API.
- [ ] TypeScript passes for web.
- [ ] Build passes for API.
- [ ] Build passes for web.
- [ ] Unit test suite.
- [ ] Service test suite.
- [ ] Repository integration tests.
- [ ] Authentication integration tests.
- [ ] Project authorization tests.
- [ ] Ingestion integration tests.
- [ ] Event query tests.
- [ ] Error grouping tests.
- [ ] Alert evaluation tests.
- [ ] Billing webhook tests.
- [ ] Frontend component tests.
- [ ] End-to-end authentication flow.
- [ ] End-to-end project flow.
- [ ] End-to-end ingestion flow.
- [ ] End-to-end log explorer flow.
- [ ] End-to-end alert flow.
- [ ] CLI tests.
- [ ] Load tests for ingestion.
- [ ] Load tests for query endpoints.
- [ ] Security testing.
- [ ] Dependency vulnerability scan.
- [ ] Secret scanning.
- [ ] Accessibility audit.
- [ ] Browser compatibility testing.
- [ ] Mobile responsive testing.

---

# Documentation and launch

- [x] Architecture documentation.
- [x] Agent/developer rules.
- [x] Master TODO.
- [ ] README production rewrite.
- [ ] Quickstart.
- [ ] Environment reference.
- [ ] API reference.
- [ ] Ingestion reference.
- [ ] SDK documentation.
- [ ] CLI documentation.
- [ ] Alert documentation.
- [ ] Billing documentation.
- [ ] Security documentation.
- [ ] Data retention documentation.
- [ ] Privacy policy.
- [ ] Terms of service.
- [ ] Cookie policy if applicable.
- [ ] Status/incident page plan.
- [ ] Support workflow.
- [ ] Product changelog.
- [ ] Release process.

# Final launch checklist

- [ ] No monolithic legacy implementation remains.
- [ ] All production routes have validation.
- [ ] All project-scoped routes enforce authorization.
- [ ] Secrets are absent from source control.
- [ ] API keys are hashed at rest.
- [ ] Session tokens are hashed at rest.
- [ ] Passwords are securely hashed.
- [ ] Login and ingestion are rate limited.
- [ ] Database migrations are deterministic.
- [ ] Backups have been restore-tested.
- [ ] CI is green.
- [ ] Lint is green.
- [ ] Typecheck is green.
- [ ] Unit/integration/e2e suites are green.
- [ ] Production build is reproducible.
- [ ] Web is served from `/`.
- [ ] `/api/*` is stable and documented.
- [ ] SDK can send a real event successfully.
- [ ] Dashboard displays real events.
- [ ] Log explorer searches real events.
- [ ] Error grouping works on real events.
- [ ] Alerts can be delivered successfully.
- [ ] CLI/TUI can authenticate and inspect events.
- [ ] Quotas work server-side.
- [ ] Billing webhooks are verified.
- [ ] Retention jobs work.
- [ ] Monitoring is active.
- [ ] Incident response process exists.
- [ ] Launch documentation is complete.

---

# Definition of done

A feature is only considered done when implementation, validation, authorization, error handling, tests, documentation, and production behavior have been addressed. Do not check a box merely because a file or placeholder exists.
