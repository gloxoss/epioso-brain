# API Foundation Integration Dependencies

Section 03 added the NestJS API skeleton without changing root dependency files.

## Required Runtime Dependencies

Add these to `epioso-brain/package.json` before running `brain-api`:

```bash
npm install @nestjs/common @nestjs/core @nestjs/config reflect-metadata rxjs class-validator class-transformer
```

## Required Development Dependencies

The app project target uses `tsx` for local source execution:

```bash
npm install -D tsx @types/node
```

## Nx Targets Added Under `apps/brain-api`

No root scripts were changed. The new `apps/brain-api/project.json` defines:

- `nx dev brain-api` -> `tsx apps/brain-api/src/main.ts`
- `nx build brain-api` -> `tsc -p apps/brain-api/tsconfig.app.json`
- `nx type-check brain-api` -> `tsc -p apps/brain-api/tsconfig.app.json --noEmit`
- `nx lint brain-api` -> lints the Section 03-owned API files and intentionally leaves `apps/brain-api/src/common/prisma/**` to the database worker

## Local Environment Notes

The API defaults to:

- `BRAIN_HOST=127.0.0.1`
- `BRAIN_API_PORT=3333`
- `BRAIN_WEB_PORT=4200`
- `BRAIN_WEB_ORIGIN=http://127.0.0.1:4200` when no explicit origin is provided

`BRAIN_HOST` and `BRAIN_WEB_ORIGIN` are validated as local-only values. Public hostnames or non-local CORS origins fail bootstrap.

## Expected Health Route

After dependencies are integrated and the API is running:

```text
GET http://127.0.0.1:3333/api/v1/system/health
```
