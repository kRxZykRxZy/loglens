# @loglens/shared

Types shared between the API, web, and SDK consumers. Interop-only.

## Contents

- `contracts.ts` — HTTP-boundary types: `HealthResponse`, `ProjectSummary`, `AuthUser`, `ErrorEnvelope`.
- `severity.ts` — the severity union (`debug | info | warn | error | fatal`) and related constants.

Nothing in this package may import server-only or browser-only code. Keep it to pure types and constants. Runtime validation shared across consumers lives in `@loglens/validation`.
