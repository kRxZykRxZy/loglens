# @loglens/config

Central, environment-independent product configuration shared across API and web.

## Contents

- `PLANS` / `Plan` — supported plan identifiers (`free`, `pro`).
- `PLAN_LIMITS` — per-plan quotas (projects, events/month, retention days, members, alerts).
- `DEFAULT_PLAN` — plan assigned to new accounts.
- `EVENT_MAX_BYTES` — per-event payload cap for ingestion.
- `INGEST_BATCH_MAX` — max events per batch ingestion request.
- `DEFAULT_PAGE_SIZE` / `MAX_PAGE_SIZE` — pagination bounds.

Anything that varies per environment (URLs, credentials, limits tuned to a deployment) belongs in `apps/api/src/config/env.ts`, not here.
