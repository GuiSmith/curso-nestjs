# Repository Guidelines

## Project Structure & Module Organization

Application code lives in `src/`; `main.ts` bootstraps NestJS and `app.module.ts`
composes the application. Feature code is grouped under `src/modules/<feature>/`,
with controllers, services, DTOs, modules, and unit tests kept together. Shared
database access is provided by `src/prisma.service.ts`.
The Prisma schema is in `prisma/schema.prisma`. End-to-end tests and their Jest
configuration live in `test/`. Generated output goes to `dist/` and coverage reports
to `coverage/`; do not commit either directory.

## Build, Test, and Development Commands

- `npm install` installs dependencies.
- `make up` starts the PostgreSQL 18 container using values from `.env`.
- `npm run start:dev` runs the API in watch mode.
- `npm run build` compiles TypeScript into `dist/`.
- `npm run start:prod` runs the compiled application.
- `npm run lint` checks `src/**/*.ts` with Biome.
- `npm test` runs unit tests; `npm run test:e2e` runs the Supertest suite.
- `npm run test:cov` writes a Jest coverage report.

After changing the schema, run `npx prisma generate` and include intended migrations.

## Coding Style & Naming Conventions

Use two-space indentation, single quotes, trailing commas, and a 100-character line
width, as configured in `biome.json`. Biome rejects unused imports and warns on
explicit `any`; prefer typed DTOs and return values. Follow
NestJS file suffixes such as `*.controller.ts`, `*.service.ts`, `*.module.ts`, and
`*.dto.ts`. Use PascalCase for classes and DTOs, camelCase for methods and variables,
and lowercase feature directories. Keep validation decorators on request DTOs and
dependency injection through constructors.

## Testing Guidelines

Jest discovers colocated `*.spec.ts` tests under `src/`; name end-to-end tests
`*.e2e-spec.ts` under `test/`. Use `@nestjs/testing` for isolated modules and
Supertest for HTTP behavior. Cover changed controllers, services, validation rules,
and error paths. No threshold is enforced, but avoid reducing coverage.

## Commit & Pull Request Guidelines

History mixes short Portuguese summaries with Conventional Commit entries. Prefer
the clearer form, such as `feat(tasks): validate task priority` or
`fix(projects): return 404 for missing project`. Keep commits focused and imperative.
Pull requests should explain the change, list verification commands, link issues,
and call out schema, migration, environment, or API-contract changes.
Include request/response examples when endpoints change; screenshots are only needed
for rendered Swagger or other visual output.

## Security & Configuration

Keep `.env` local and never commit credentials. Document new environment variable
names without real secrets. Confirm database migrations and Docker configuration
before merging changes that affect persisted data.

## After-task
After you finish a task, recommend a commit message to be used
