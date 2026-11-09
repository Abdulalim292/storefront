# Dependency upgrades — design

Date: 2026-11-09
Status: awaiting approval
Branch: `chore/deps-2026-11`

## Intent

Bring `/home/alim/storefront` to the newest dependency versions that the
existing Next.js/ESLint toolchain actually supports, without changing product
behavior. Chosen approach: **A — installable set only, no forced peer deps**.

## Goals

- Upgrade every package that can move without breaking the lint/type toolchain.
- Keep `next build`, `eslint`, and `tsc --noEmit` green.
- Leave the two files with pre-existing local edits untouched:
  `components/admin/ProductPhotoManager.tsx`, `components/home/BrandLogo.tsx`.

## Non-goals

- No refactors, no UI/behavior changes, no new features.
- No dependency majors that the toolchain does not support (see Exclusions).
- No commit of the user's in-progress edits.

## Scope (targets)

| Package | From | To |
| --- | --- | --- |
| next | 16.4.2 | 16.4.5 |
| react / react-dom | 19.3.0 | 19.3.1 |
| lucide-react | 1.59.0 | 1.70.0 |
| tailwindcss | 4.3.3 | 4.3.5 |
| @tailwindcss/turbopack | 4.3.3 | 4.3.5 |
| eslint-config-next | 16.4.2 | 16.4.5 |
| @next/eslint-plugin-next | 16.4.2 | 16.4.5 |
| @types/node | 20.19.43 | 24.19.2 |

`@types/react` and `@types/react-dom` are already at the latest (19.3.0).

## Exclusions and why

- **typescript 7.0.2** — `typescript-eslint` 8.72 (via `eslint-config-next`)
  requires `typescript <6.1.0`. TS 7 breaks linting. Staying on 5.9.3.
- **eslint 10.14.0** — `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and
  `eslint-plugin-react` peer ranges stop at `^9`. Staying on 9.39.5.
- **@types/node 26** — targets Node 26; this machine runs Node 24. Using 24.x
  keeps types aligned with the runtime.

## How

1. Update `package.json` ranges to the target versions and run `npm install`
   (regenerates `package-lock.json`).
2. Consult version-specific docs only where a change requires code edits.
   For Next.js, `node_modules/next/dist/docs/` is authoritative (per
   `AGENTS.md`); Context7 is used pinned to the installed version for other
   packages.
3. Fix any fallout caused by the version bumps (most likely lucide icon
   renames and React/Next type changes).
4. Commit on `chore/deps-2026-11` as one focused commit (the design doc may be
   a separate commit).

## Verification

- `npm run build` — production build succeeds.
- `npx tsc --noEmit` — no type errors.
- `npm run lint` (`eslint`) — no errors.
- `npm install` produces no `ERESOLVE`/peer warnings that imply a forced tree.
- Optional smoke test: `next start` + Playwright load of `/` and one category
  page to confirm the app boots after the bump.

## Risks and rollback

- lucide-react 1.59 → 1.70 may rename icons; a grep of imports plus the build
  catches this.
- Patch releases of Next/React are low risk but may surface type changes.
- Rollback: `git switch main` (work stays isolated on the branch); the branch
  can be deleted without affecting `main`.
