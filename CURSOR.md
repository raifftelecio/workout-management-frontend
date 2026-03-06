# CURSOR.md

This file provides guidance to Cursor when working with code in this repository.

## Project Overview

**bootcamp-treinos-frontend** — fitness training web app. Next.js 16 (App Router), React 19, TypeScript. The backend API exposes an OpenAPI spec (e.g. at `/swagger.json`); authentication is handled via BetterAuth with Google OAuth.

## Commands

```bash
pnpm dev          # Start dev server (do NOT run this to verify changes)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
npx orval         # Regenerate API client from backend OpenAPI spec
npx shadcn@latest add <component>   # Install a shadcn/ui component
```

## Architecture

### Path Aliases

`@/*` maps to the project root (`./`). Example: `@/components/ui/button`, `@/app/_lib/auth-client`.

### App Structure

- `app/` — Next.js App Router pages and app-level code
  - `app/_lib/` — Internal app libraries
  - `app/_lib/api/fetch-generated/` — Orval-generated fetch functions (Server Components)
  - `app/_lib/auth-client.ts` — BetterAuth client instance (`authClient`)
  - `app/_lib/fetch.ts` — Custom fetch mutator used by Orval (prepends API URL, forwards cookies)
- `components/ui/` — shadcn/ui components (e.g. avatar, badge, button, card, input)
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### API Layer (Orval)

Orval is configured in `orval.config.ts`:

- **`fetch`** (active) — Generates fetch functions into `app/_lib/api/fetch-generated/index.ts`. Used in Server Components; mutator at `app/_lib/fetch.ts` forwards cookies via `next/headers`.
- **`rc`** (commented out) — Would generate TanStack Query hooks for Client Components.

Input is `${NEXT_PUBLIC_API_URL}/swagger.json` (see Environment Variables).

### Authentication

- BetterAuth client from `app/_lib/auth-client.ts` (`baseURL`: `NEXT_PUBLIC_API_URL`).
- No middleware — auth checks are done in each page.
- Client Components: `authClient.useSession()`; redirects must run inside `useEffect`, not during render.
- Protected pages redirect to `/auth` when the user is not logged in; `/auth` redirects to `/` when the user is already logged in.

### Styling

- Tailwind CSS v4; oklch color variables in `app/globals.css`.
- Use theme CSS variables only (e.g. `bg-primary`, `text-muted-foreground`, `bg-login-hero-bg`); no hardcoded Tailwind colors.
- Fonts: Geist Sans (`--font-geist-sans`), Geist Mono (`--font-geist-mono`) from `app/layout.tsx`.

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8081   # Backend API URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Frontend base URL
```

## Key Conventions

- Package manager: **pnpm**
- Date library: **dayjs** for date handling and formatting
- No comments in code
- kebab-case for file and folder names
- Never run `pnpm run dev` to verify changes
- Never use middleware for auth
- Use `Image` from `next/image` for images
- Use the shadcn/ui `Button` from `@/components/ui/button` for buttons (not native `<button>`)
