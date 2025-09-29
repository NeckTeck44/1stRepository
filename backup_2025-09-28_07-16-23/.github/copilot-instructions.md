# Copilot Instructions for Portfolio Alegria - Candidature Formation

## Project Overview

This is a full-stack TypeScript/React portfolio application with a custom Express backend. The client is built with Vite and React, using Radix UI and TanStack Query for UI and data fetching. The server exposes a minimal API for contact form submission and uses Zod for validation.

## Architecture

- **Client (`client/`)**: React SPA, entry at `src/App.tsx`. Routing via Wouter. UI components in `src/components/` and `src/components/ui/`. Pages in `src/pages/`. Shared logic in `src/lib/` and `src/shared/`.
- **Server (`server/`)**: Express app, entry at `server/index.ts`. Routes defined in `server/routes.ts`. Data storage logic in `server/storage.ts`. Vite is used for development tooling.
- **Shared Types**: Schemas for validation (Zod) in `client/src/shared/schema.ts` and imported in server routes.

## Developer Workflows

- **Start (dev mode):**
  - Run `npm start` from the root. This launches both client and server using TSX and Vite.
  - Client: `client/package.json` → `npm run dev` (Vite)
  - Server: `server/package.json` → `npm run dev` (TSX)
- **Build:**
  - Client: `npm run build` in `client/` (Vite)
  - Server: See custom build in `client/package.json` (uses esbuild for server bundling)
- **Database:**
  - Drizzle ORM is referenced; use `npm run db:push` in `client/` for migrations.
- **No tests are defined.**

## Key Patterns & Conventions

- **UI Components:** Use Radix UI primitives, extended in `src/components/ui/`. See `button.tsx` for style conventions.
- **Routing:** Wouter is used for SPA routing. See `App.tsx` and `Home.tsx` for examples.
- **API Calls:** Use `apiRequest` and `getQueryFn` from `src/lib/queryClient.ts` for all fetches. Always handle errors via `throwIfResNotOk`.
- **Theme:** Dark mode toggling in `Header.tsx` via localStorage and system preference.
- **Contact Form:** POST to `/api/contact` (see `server/routes.ts`). Validated with Zod schema from shared types.
- **Security:** Helmet and CORS are enabled in Express. CSP is relaxed in dev for Vite HMR.

## Integration Points

- **TanStack Query:** All data fetching should use QueryClientProvider and query functions from `src/lib/queryClient.ts`.
- **Drizzle ORM:** Used for server-side data storage (see `server/storage.ts`).
- **Vite:** Used for both client and server dev tooling.

## External Dependencies

- Radix UI, TanStack Query, Wouter, Zod, Drizzle ORM, Express, Helmet, CORS, Vite, ESBuild

## Troubleshooting

- If you see `Pre-transform error: Failed to load url ...client`, check that the client build output and static file serving are correctly configured in Vite and Express.
- For cross-component imports, use `@/` alias for `client/src/`.

---

**Edit this file to update agent instructions as the project evolves.**
