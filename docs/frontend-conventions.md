# Frontend conventions

Rules for the LogLens web app (`apps/web`).

## Organization

- Feature-oriented structure under `apps/web/src/features/<feature>`.
- Each feature may contain `components/`, `hooks/`, `services/`, `types/`, and `tests/`.
- Shared UI primitives live in `components/ui` (HeroUI + shadcn-style local primitives only — no third component library).
- Layout shell components live in `components/layout`.
- Cross-cutting libs (`api`, `supabase`, `theme`) live in `lib/`.

## Routing and state

- Routes are declared centrally in `app/router.tsx` using `react-router-dom` (data router).
- Protected routes wrap children with `ProtectedRoute`; auth-only pages use `PublicOnlyRoute`.
- Server state is fetched in feature hooks (e.g. `useDashboard`) rather than inside presentational components.
- Theme preference is persisted to `localStorage` under `loglens.theme` with `prefers-color-scheme` fallback.

## API access

- All HTTP calls go through `lib/api.ts`, which wraps `@loglens/api-client` with the Supabase session token.
- Feature code never calls `fetch` directly and never touches server-only modules.
- Errors surface as `ApiClientError` with stable `code`; the UI maps codes to messages via a shared helper.

## Components

- Prefer accessible semantic HTML. Interactive controls must be keyboard usable (native buttons/links, visible focus).
- Every view intentionally designs loading, empty, error, and success states.
- Use `LoadingState`/`Skeleton` for loading and `EmptyState` for empty views.
- Notifications go through the `ToastProvider` (`useToast`) — no ad-hoc alert boxes.
- Keep components small. Extract hooks and sub-components as complexity grows.

## Styling

- Theme-aware CSS custom properties in `styles/globals.css` (`--color-bg/fg/surface/muted/border/input-bg/accent`).
- Components reference the variables so dark/light theming stays centralized.

## Validation

- Shared runtime validators come from `@loglens/validation`; forms mirror server rules so errors match server semantics.

## Conventions

- TypeScript strict mode. Type-only imports where appropriate. No `any` without a documented reason.
- Tests for components and hooks use the repository's Vitest setup as it extends into the web workspace.
