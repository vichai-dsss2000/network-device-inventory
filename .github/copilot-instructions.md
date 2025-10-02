# Copilot Instructions for Network Device Inventory

## Project Overview
- **Purpose:** Web-based inventory and management for network devices (routers, switches, firewalls, etc.)
- **Stack:** Next.js (React), Node.js, TypeScript, NextAuth.js, (DB: to be determined)
- **Key Features:** Device CRUD, real-time status, search/filter, authentication, dashboard, reporting

## Architecture & Structure
- **Monorepo:** All code in `network-device-inventory/`
- **Frontend & Backend:** Uses Next.js app directory (`src/app/`) for both UI and API routes
- **Key Directories:**
  - `src/components/`: Reusable React components
  - `src/lib/`: Utility functions
  - `src/models/`: Data models (device, user, etc.)
  - `src/types/`: TypeScript types
  - `src/styles/`: Global styles (CSS Modules or Tailwind)
  - `public/`: Static assets
- **API:** RESTful endpoints under `/api/` (see README for routes)
- **Authentication:** NextAuth.js or JWT (see `.env.example` for secrets)

## Developer Workflow
- **Install:** `npm install` or `yarn install`
- **Env Setup:** Copy `.env.example` to `.env.local` and configure
- **Dev Server:** `npm run dev` (Next.js on http://localhost:3000)
- **Migrations:** `npm run migrate` (if DB is set up)
- **Testing:** `npm run test` (unit/integration)
- **Linting:** `npm run lint`
- **Type Checking:** `npm run type-check`

## Conventions & Patterns
- **TypeScript:** Use strict typing; types in `src/types/`
- **Component Structure:** Prefer functional components; colocate styles
- **API Handlers:** Place under `src/app/api/`; follow RESTful patterns
- **Models:** Define DB models in `src/models/`
- **Env Vars:** All secrets/config in `.env.local`
- **Naming:** Use kebab-case for files, PascalCase for components

## Integration Points
- **Database:** Connection string in `DATABASE_URL` (see `.env.example`)
- **Auth:** NextAuth.js config in `src/app/api/auth/`
- **Deployment:** Vercel or custom hosting (see README)

## Examples
- Device API: `GET /api/devices`, `POST /api/devices`
- Auth API: `POST /api/auth/login`, `GET /api/auth/session`
- Model: See `src/models/device.ts` (if present)

## Tips for AI Agents
- Always check `README.md` for up-to-date workflow and architecture
- Follow directory conventions for new code
- Use TypeScript types for all data structures
- Reference `.env.example` for required environment variables
- For new features, mirror existing CRUD/API patterns

---
If any conventions or workflows are unclear, ask for clarification or check for updates in the README.
