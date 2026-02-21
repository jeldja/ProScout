# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

College Basketball Scouting Dashboard — a full-stack web app for NCAA-to-NBA player archetype predictions. Monorepo with two top-level directories:

- **`Frontend/`** — React 18 + TypeScript + Vite + Tailwind CSS v4
- **`Backend/`** — Flask (managed by a separate team — do not modify)

## Frontend

### Commands (run from `Frontend/`)

- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript check + production build
- `npm run preview` — Preview the production build locally

### Architecture

- **`src/App.tsx`** — Root component with React Router and shared layout (header/nav)
- **`src/pages/`** — Route-level page components (one file per route)
- **`src/components/`** — Reusable React components. `components/ui/` contains shadcn/ui primitives (Radix UI-based); don't edit these directly
- **`src/services/api.ts`** — Generic fetch client for the Flask backend. Base URL configured via `VITE_API_BASE_URL` env var (defaults to `http://localhost:5000/api`)
- **`src/services/playerService.ts`** — Player-specific API calls. Currently uses mock data (`USE_MOCK = true`); flip to `false` when backend endpoints are ready
- **`src/types/`** — Shared TypeScript interfaces (e.g. `Player`, `NCAAStats`)
- **`src/data/`** — Static/mock data used until backend is connected
- **`src/styles/`** — Global CSS: Tailwind config, theme variables (CSS custom properties), fonts
- **`src/hooks/`** — Custom React hooks (add new hooks here)

### Key Conventions

- Path alias `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`)
- UI primitives are from shadcn/ui — use existing components from `components/ui/` before adding new dependencies
- Charting uses `recharts`
- Styling is Tailwind CSS v4 utility classes; theme tokens are CSS variables in `src/styles/theme.css`

## Backend Integration

The frontend talks to the Flask backend via `src/services/api.ts`. To connect a new endpoint:
1. Add the TypeScript types to `src/types/`
2. Create or extend a service file in `src/services/`
3. Set `VITE_API_BASE_URL` in `.env` (see `.env.example`)
