# Dependency policy

Rules for adding, updating, and maintaining dependencies in the LogLens monorepo.

## Decision framework

Before adding any package, ask:

1. Is it solving a real problem?
2. Is the functionality small enough to implement locally?
3. Does it add security, bundle, or maintenance cost?
4. Is it compatible with the existing architecture?

Do not add duplicate libraries for the same job.

## Lockfile

- `pnpm-lock.yaml` at the repository root is the single source of truth and **must be committed**.
- Reinstate the lockfile with `pnpm install --frozen-lockfile`.
- Do not hand-edit the lockfile. Update it through pnpm only.
- Workspace-internal packages are referenced with the `workspace:*` protocol; they are never version-pinned in the manifest.

## Adding a dependency

```bash
pnpm --filter <workspace> add <pkg>
pnpm --filter <workspace> add -D <pkg>   # dev dependency
```

Always add through the workspace filter that owns the dependency. Root-only tooling (ESLint, Prettier, Vitest, Husky, lint-staged, commitlint) is a root `devDependency`.

## Upgrades

- Review dependency upgrades deliberately. Group related upgrades in a single `chore(deps):` commit.
- Renovate is configured (`renovate.json`) to open upgrade PRs automatically. Merge after `npm run validate` passes.
- Security-critical upgrades (auth, HTTP, database drivers) should be reviewed within one week of notification.

## Enforced checks

- Commit message convention: Conventional Commits via `@commitlint/config-conventional`.
- Pre-commit: `lint-staged` runs Prettier + ESLint on staged files.
- CI: `npm install --frozen-lockfile` + typecheck + lint + test + build + format check.
