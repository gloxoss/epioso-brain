# EPIOSO Brain

EPIOSO Brain is a local-only control plane for the EPIOSO workspace. It will read
project state, explain what changed, stage work for agents, and require approval
before any risky action.

This repository is separate from `epioso-web`. It has no public deploy config and
must not be uploaded to Hostinger or any public hosting target.

## Current Status

Section 01 foundation is in place:

- Nx-style TypeScript workspace
- Strict TypeScript configuration
- npm scripts for development, build, lint, type-check, test, format, and validate
- Local safety documentation and placeholder environment template
- Ignore rules for secrets, generated files, local data, scans, and asset outputs

Application code will be added in later sections.

## Quick Start

```bash
npm install
npm run validate
```

Useful commands:

```bash
npm run dev
npm run build
npm run lint
npm run type-check
npm run test
npm run format
npm run validate
```

## Workspace Layout

```text
epioso-brain/
  apps/
  packages/
    shared-types/
  docs/
    runbooks/
  scripts/
```

## Safety Rules

- Bind services to `127.0.0.1` unless a future section adds explicit opt-in exposure.
- Keep secrets in private `.env` files only. `.env.example` contains placeholders.
- Do not add public deployment configuration.
- Require approval before external writes, paid API calls, file deletes, Git pushes, or deployments.
- Keep generated scans, local databases, object storage, and generated assets out of Git.

Read [docs/runbooks/local-safety.md](docs/runbooks/local-safety.md) before adding adapters,
filesystem scanning, queue workers, or external integrations.
