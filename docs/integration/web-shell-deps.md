# Web Shell Dependency Requests

Section 02 source files are scaffolded, but the workspace root is not wired for a Next.js app yet. No dependencies or root manifests were edited in this batch.

## Required packages

Add runtime dependencies when package integration is allowed:

- `next@15`
- `react@19`
- `react-dom@19`

Add development dependencies when package integration is allowed:

- `@types/react`
- `@types/react-dom`
- `tailwindcss@4`
- `@tailwindcss/postcss`

## Required scripts and targets

Add an Nx project target for `apps/brain-web` when package integration is allowed:

- `dev`: `next dev apps/brain-web`
- `build`: `next build apps/brain-web`
- `lint`: `eslint apps/brain-web --max-warnings=0`
- `type-check`: `tsc -p apps/brain-web/tsconfig.json --noEmit`

The root `tsconfig.json` currently includes `packages/**/*.ts` only. Keep that unchanged until the web app has its own target, otherwise root type-checks will fail before Next and React are installed.

## UI contracts integration

`packages/ui-contracts/src/index.ts` now defines shared shell/navigation/UI state contracts. A later integration batch should add a path alias or package export for `@epioso-brain/ui-contracts` before importing it from `apps/brain-web`.

## Verification limit

The dashboard cannot be launched with `next dev` until the packages above and the web project target are added.
