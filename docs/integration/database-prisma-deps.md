# Database and Prisma Integration Notes

Section 04 adds the local data foundation files, but package integration is intentionally pending because this batch must not edit `package.json` or lockfiles.

## Required Dependencies

Install these when manifest edits are allowed:

```bash
npm install @prisma/client
npm install --save-dev prisma tsx @types/node
```

The Prisma module under `apps/brain-api/src/common/prisma` also expects the future API app to provide NestJS dependencies:

```bash
npm install @nestjs/common @nestjs/config @nestjs/core @nestjs/platform-express
```

## Suggested Scripts

Add scripts similar to these when package edits are in scope:

```json
{
  "db:format": "prisma format",
  "db:validate": "prisma validate",
  "db:generate": "prisma generate",
  "db:migrate:dev": "prisma migrate dev",
  "db:seed": "prisma db seed",
  "data:up": "docker compose -f docker/docker-compose.yml up -d",
  "data:down": "docker compose -f docker/docker-compose.yml down"
}
```

For `prisma db seed`, add this package-level Prisma seed hook:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

When project manifest edits are in scope, include `apps/brain-api/src/common/prisma` in the `brain-api` lint target and align API/web default ports with `.env.example` (`4000` and `3100`).

## Local Service Commands

Copy `.env.example` to a private `.env` before running services if you want Docker Compose to read the same placeholders:

```bash
docker compose -f docker/docker-compose.yml up -d
docker compose -f docker/docker-compose.yml ps
docker compose -f docker/docker-compose.yml down
```

Postgres binds to `127.0.0.1:5432`; Redis binds to `127.0.0.1:6379`. Both use named Docker volumes and safe local placeholder credentials.

## Verification Once Dependencies Exist

```bash
npm run db:format
npm run db:validate
npm run db:generate
npm run db:migrate:dev
npm run db:seed
```

Do not point `DATABASE_URL` at any external or production database for this local Brain foundation.
