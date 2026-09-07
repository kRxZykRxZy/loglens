# @loglens/validation

Dependency-free runtime validators shared between the API, web, and SDK consumers.

## Validators

- `requireString(value, field, opts)` — required string with min/max length and trimming.
- `requireEmail(value, field)` — RFC-style email shape, lowercased result.
- `requirePassword(value, field)` — min 8 chars, requires letters and numbers.
- `requireSeverity(value, field)` — one of `debug | info | warn | error | fatal`.
- `requireEnum(value, allowed, field)` — membership in a closed list.
- `isEmail`, `isSeverityValue`, `isIsoTimestamp` — boolean predicates.

## Result shape

Validators return a discriminated union for caller-friendly control flow:

```ts
type ValidationResult = { ok: true; value: string } | { ok: false; error: string };
```

API controllers translate `ok: false` into typed `AppError`s; browsers can render the message directly.
