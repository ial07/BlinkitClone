# Phase 1: Setup

## Objective
Initialize the monorepo structure with Turborepo, scaffold Next.js (App Router) and NestJS applications, and create shared packages.

---

## Scope
- Root monorepo configuration (npm workspaces + Turborepo)
- Next.js app scaffold (`apps/web`)
- NestJS app scaffold (`apps/api`)
- Shared packages: `packages/types`, `packages/utils`, `packages/ui`
- Root and per-package TypeScript configuration
- Verify both apps run independently with `turbo dev`

---

## Tasks

### 1.1 Initialize Root Monorepo
- Create root `package.json` with npm workspaces
- Install Turborepo as dev dependency
- Create `turbo.json` with `dev`, `build`, `lint` pipelines
- Create root `tsconfig.json` as base config

### 1.2 Scaffold Next.js Frontend
- Use `npx create-next-app` with App Router, TypeScript, Tailwind, ESLint
- Place in `apps/web/`
- Configure to run on port 3000

### 1.3 Scaffold NestJS Backend
- Use `npx @nestjs/cli new` to scaffold NestJS
- Place in `apps/api/`
- Configure to run on port 3001
- Enable CORS for localhost:3000

### 1.4 Create Shared Packages
- `packages/types/` — shared TypeScript interfaces (Product, Order, Recommendation)
- `packages/utils/` — shared utility functions (placeholder)
- `packages/ui/` — shared UI components (placeholder)
- Each with its own `package.json` and `tsconfig.json`

### 1.5 Verify Setup
- Run `turbo dev` — both apps start
- Next.js serves on http://localhost:3000
- NestJS serves on http://localhost:3001
- Shared packages importable from both apps

---

## Expected Output
- Working monorepo with two running applications
- Shared packages with initial type definitions
- Single `turbo dev` command starts everything

---

## Acceptance Criteria
- [ ] `npm install` succeeds at root
- [ ] `turbo dev` starts both apps without errors
- [ ] Next.js default page renders at localhost:3000
- [ ] NestJS health endpoint responds at localhost:3001
- [ ] `@blinkit/types` importable from both apps
- [ ] TypeScript compiles without errors

---

## Out of Scope
- Product data / API endpoints
- UI components beyond default scaffolding
- Database setup
- Environment variables for Supabase
- Any business logic
