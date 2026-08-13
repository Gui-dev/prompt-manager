# AGENTS.md

Next.js 16 (App Router) + React 19 + TypeScript app. Package manager is **pnpm** (pinned 10.28.0 in `packageManager`) — never use npm/yarn.

## Commands

```bash
pnpm dev                # Next dev
pnpm build / pnpm start
pnpm lint               # biome check (all files)
pnpm format             # biome format --write (only formatting)
pnpm typecheck          # tsc --noEmit
pnpm test               # vitest run --passWithNoTests
pnpm test:watch         # vitest
pnpm db:generate        # prisma generate (uses pnpm dlx)
pnpm db:migrate         # prisma migrate dev
pnpm db:studio          # prisma studio
```

Verification order expected by CI is `lint → typecheck → test`. Run all three after changes. If `pnpm lint` reports import-order errors, use `pnpm exec biome check --write` — plain `pnpm format` won't fix the `organizeImports` rule.

## Style (Biome, diverges from defaults)

- Single quotes, **no semicolons**, trailing commas (es5), line width 100
- `assist.source.organizeImports = "on"` — imports must be sorted (Biome sorts)
- Tailwind classes must be sorted (`nursery.useSortedClasses` is an error) — see `src/components/ui/button.tsx`
- pre-commit (lefthook) runs `biome check` on staged JS/TS/JSX/TSX/JSON files

## Testing

- Config: `vitest.config.mts` (deliberately `.mts`, not `.ts`, since `package.json` has no `"type": "module"` — do not rename, do not add `"type": "module"`)
- jsdom + `globals: true` → `describe`/`it`/`expect`/`vi` need **no imports**; `src/vitest-env.d.ts` provides the global types
- jest-dom matchers (`toBeInTheDocument`, etc.) auto-loaded via `src/test/setup.ts`
- Place tests as `*.test.tsx` next to the component (e.g. `src/components/ui/button.test.tsx`)
- Use `@testing-library/react` + `@testing-library/user-event`

## Prisma 7 (biggest gotcha)

- Generated TS client lives in `src/generated/prisma/` and is **gitignored** — run `pnpm db:generate` after a fresh clone and after any schema change, or imports fail
- Generator is `prisma-client` (Prisma 7), not `prisma-client-js`; schema `datasource` has **no `url`** — it comes from `process.env.DATABASE_URL` via `prisma.config.ts` (loads `dotenv/config`)
- Client uses the pg driver adapter: see `src/lib/prisma.ts` (`PrismaPg` + `PrismaClient({ adapter })`) — keep this pattern
- Prisma CLI scripts run through `pnpm dlx prisma *` (no local `prisma` binary)
- `DATABASE_URL` must exist in `.env` (gitignored), e.g. `postgresql://root:root@localhost:5432/prompt`
- Local Postgres via `docker compose up -d` (bitnami/postgresql, port 5432, root/root, db `prompt`)

## Architecture

- Path alias `@/*` → `src/*` (use it; Vite/Vitest alias mirrors `tsconfig` paths)
- UI built on shadcn "base-vega" style → shadcn/ui components wrapping **@base-ui/react** primitives + lucide icons; new UI components go in `src/components/ui/` using `cn()` from `@/lib/utils` and `class-variance-authority`
- Repo-local Prisma v7 reference skills vendored under `.claude/skills/prisma-*` / `.agents/skills/prisma-*` (mirrored copies, locked in `skills-lock.json`) — consult them for Prisma CLI/client work