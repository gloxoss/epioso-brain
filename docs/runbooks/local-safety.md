# Local Safety Runbook

EPIOSO Brain is an internal local dashboard. It can eventually inspect projects,
Git state, sessions, generated assets, and adapter responses. Treat every scan and
adapter result as sensitive.

## Default Posture

- Run only on localhost by default.
- Keep `BRAIN_HOST=127.0.0.1` unless exposure is explicitly reviewed.
- Store real values only in `.env`, never in `.env.example`, README files, tests, or reports.
- Do not add public deploy files such as `vercel.json`, `netlify.toml`, `render.yaml`,
  `wrangler.toml`, or hosted CI deployment workflows.

## Workspace Boundaries

- The Brain lives in `D:/Users/zakio/Desktop/Work/Epioso/epioso-brain`.
- Do not modify `D:/Users/zakio/Desktop/Work/Epioso/epioso-web` from Brain foundation work.
- Do not modify folders under `D:/Users/zakio/Desktop/Work/Epioso/external-projects`.
- Generated scans and reports belong in ignored local folders such as `scans/`,
  `scan-results/`, or `reports/generated/`.

## Approval Required

Require explicit user approval before any action that:

- Changes local or remote Git state.
- Deletes, moves, or overwrites files outside a generated local output folder.
- Calls paid APIs.
- Sends webhooks, social messages, emails, or Telegram messages.
- Writes to external databases or production systems.
- Deploys anything.

## Secret Handling

- Never render `.env`, tokens, passwords, private keys, or credentials in UI or generated reports.
- Redact credentials from Git remotes, command logs, adapter responses, and audit metadata.
- Ignore common generated and high-noise folders during scans: `node_modules`, `.next`, `out`,
  `dist`, `build`, `.git`, `.venv`, cache folders, and archive files unless explicitly selected.

## Local Data

Use ignored folders for local state:

- `local-data/` for SQLite or service data.
- `local-object-storage/` for private local object storage.
- `generated-assets/` for generated media and creative outputs.
- `scans/` and `scan-results/` for scanner output.

These folders must stay local and must not be committed.
