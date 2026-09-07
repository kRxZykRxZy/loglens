# API conventions

Rules for the LogLens HTTP API surface. Consumers include the web app, the public SDK, and the CLI.

## Base

- All API routes live under `/api`.
- JSON in, JSON out. `Content-Type: application/json`.
- Successful collection responses use a stable key per resource type:

```json
{ "projects": [] }
```

- Successful mutation responses identify the resulting resource:

```json
{ "project": { "id": "..." } }
```

- 204 is used for deletions. No body.

## Errors

Every error uses the centralized handler and this envelope:

```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Human-readable message",
    "requestId": "04b2..."
  }
}
```

- `code` is a stable, uppercase, machine-readable identifier.
- `message` is user-safe: no SQL, stack traces, secrets, or internals.
- `requestId` is echoed in structured logs for correlation.
- Unexpected errors become `500 INTERNAL_ERROR` with `message` "Internal server error".
- Never leak passwords, tokens, or credentials in error bodies.

## Common codes

`UNAUTHENTICATED` · `FORBIDDEN` · `NOT_FOUND` · `INVALID_*` (per field) · `RATE_LIMITED` · `VALIDATION_FAILED` · `CONFLICT` · `TOO_MANY_REQUESTS` · `PAYLOAD_TOO_LARGE` · `INTERNAL_ERROR`

Use 401 for missing/invalid authentication, 403 for authenticated-but-not-authorized, 404 for unknown resources (never confirm resource existence to unauthorized callers of sensitive resources).

## Authentication

- Web and SDK sessions use `Authorization: Bearer <JWT>` verified by Supabase.
- Project/API-key authenticated ingestion uses a separate key header (`X-LogLens-Key`).
- Every project-scoped operation re-verifies ownership/membership server-side; never trust client-supplied project IDs alone.

## Pagination

- Collection endpoints accept `limit` (default 50, max 200) and `before`/`after` cursor fields.
- Responses include `hasMore` and a `nextCursor` when more results exist.
- Event-volume endpoints require bounded time ranges.

## Ingestion

- Single-event and batch (`POST /v1/ingest` with up to 100 events) endpoints are supported.
- Batch ingestion uses deterministic partial-failure: rejected events are returned with stable per-event error codes; accepted events are persisted atomically per event.
- Validation covers authentication, key validity, payload shape and size, severity, timestamp, metadata, and IDs/tags.

## Versioning

- Consumer-contract surface lives under a versioned prefix (`/v1`) as it stabilizes.
- Additive changes are backward compatible within a major version. Breaking changes increment the public version, not stack to the same path.

## Stability

- Field names are `snake_case` in JSON for language-portability (per Paddle/industry convention).
- New optional fields are additive. Deprecations are announced before removal.
