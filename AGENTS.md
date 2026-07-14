# Attenex — Agent Guide

## Repository structure

Bun v1 monorepo with hoisted linker (`bunfig.toml`). Workspaces: `apps/*`, `packages/*`.

| Package                  | Path                      | Entry                                | Notes                                |
| ------------------------ | ------------------------- | ------------------------------------ | ------------------------------------ |
| `@attenex/expo`          | `apps/expo/`              | `src/index.ts` → `expo-router/entry` | React Native 0.85 + Expo SDK 56      |
| `@attenex/api`           | `apps/api/`               | `src/server.ts`                      | Express 5 + Socket.IO + Drizzle ORM  |
| `@attenex/api-contracts` | `packages/api-contracts/` | `src/index.ts`                       | Valibot schemas shared by expo & api |

## Commands (run from root)

| Command                | Action                                                   |
| ---------------------- | -------------------------------------------------------- |
| `bun install`          | Install all workspace deps                               |
| `bun run lint`         | ESLint across all apps                                   |
| `bun run typecheck`    | `tsc --noEmit` for all apps + packages                   |
| `bun run test`         | Jest across all apps (expo: `jest --watchAll`)           |
| `bun run format`       | Prettier write on `*.{ts,tsx,js,json,md}`                |
| `bun run format:check` | Prettier check only                                      |
| `bun run android`      | `expo run:android` via `@attenex/expo`                   |
| `bun run dev`          | Nodemon for `@attenex/api`                               |
| `bun run lint-staged`  | Run lint-staged manually (auto-runs on commit via Husky) |

Order: `lint → typecheck → test` before committing. Husky runs lint-staged pre-commit.

## Expo-specific

- **Dev builds only** (Nitro native modules, no Expo Go). Use `bun run android` / `bun run ios`.
- **Babel**: `react-native-reanimated/plugin` must be last in plugin list.
- **Path aliases** in `tsconfig.json` (e.g. `@/` → `src/`, `@shared/` → `src/shared/`).
- **State**: TanStack Query (server/offline) + Zustand + MMKV (local). Auth token in `expo-secure-store`.
- **Styling**: `react-native-unistyles` (`src/unistyles.ts` configures themes + breakpoints).
- **ESLint**: `eslint-config-expo` flat config (`eslint.config.js`). Unused vars are errors; prefix with `_` to suppress.
- **Production ESLint rules**: import ordering (auto-fixable), inline-style ban, color-literal ban, promise hygiene, React Compiler validation, accessibility (a11y). Run `bun run --filter='./apps/expo' lint -- --fix` to auto-fix import order and other fixable issues.
- **Snapshots**: update with `bun run --filter='./apps/expo' test:update:snapshot`.
- **E2E**: Detox (`bun run --filter='./apps/expo' e2e:debug`).
- **LogBox** suppressed at root (`LogBox.ignoreAllLogs(true)`).
- **Metro** configures inline requires for TTI and `keep_classnames` for Reanimated.
- **Custom Expo plugins** in `plugins/` (Android manifest & MainApplication patches).
- **Secrets**: place in `personal/secrets/` (gitignored). Referenced in `app.config.ts`.

## API-specific

- **CommonJS** project. Dev: `bun run dev` (nodemon + ts-node). Prod: `pm2-runtime start`.
- **Lint**: `eslint` with TypeScript + Node rules in `eslint.config.js`. Config files are gitignored from linting.
- **Database**: PostgreSQL via Drizzle ORM. Schema: `src/config/database_setup.ts`.
- Commands: `db:generate`, `db:migrate`, `db:push`, `db:studio` (via drizzle-kit).
- Path aliases via `tsconfig.json` + `tsc-alias` for build.
- `_moduleAliases` in `package.json` for runtime (used by `module-alias`).

## Shared contracts (`packages/api-contracts`)

- Valibot schemas for request/response validation. `typecheck` via `tsc --noEmit`.
- Both apps depend on `@attenex/api-contracts: *`.

## Conventions

- **Prettier**: `semi: true`, `singleQuote: false`, `trailingComma: "all"`, `printWidth: 100`, `endOfLine: "lf"`.
- **VSCode**: auto-fix and organize imports on save.
- **Patches**: `react-native-nitro-fetch@1.5.0` patched in `patches/`.
- Private repo; no CI workflows yet.

## Gotchas

- `trustedDependencies` listed in both `apps/expo/package.json` and `apps/api/package.json` — needed for native module installs.
- API has `strict: false` in tsconfig; expo and api-contracts have `strict: true`.
- Expo TypeScript 6.0.3; API TypeScript 5.9.3.
- GraphQL/Apollo dependencies exist but are unused (commented out).
