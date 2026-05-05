# Execution Plan Overview

## Project: Blinkit Clone — Frequently Bought Together MVP

### Vision
A minimal Blinkit-style web application showcasing a "Frequently Bought Together" recommendation system powered by 1,000 mock orders using Market Basket Analysis.

---

## Architecture Summary

```
BlinkitClone/
├── apps/
│   ├── web/          → Next.js 16+ (App Router, TypeScript, Tailwind)
│   └── api/          → NestJS (TypeScript, Controller-Service-Repository)
├── packages/
│   ├── types/        → Shared TypeScript types/interfaces
│   ├── utils/        → Shared utility functions
│   └── ui/           → Shared UI components
├── docs/
│   └── execution/    → This execution plan
├── turbo.json        → Turborepo pipeline config
├── package.json      → Root workspace config
└── tsconfig.json     → Root TypeScript config
```

---

## Phase Breakdown

| Phase | Name                     | Description                                      |
|-------|--------------------------|--------------------------------------------------|
| 1     | Setup                    | Monorepo, NestJS, Next.js, shared packages       |
| 2     | Products                 | Product API + Product listing UI                  |
| 3     | Orders Dataset           | Generate 1,000 mock orders with seeded patterns   |
| 4     | Recommendation           | Recommendation engine + API endpoint              |
| 5     | Frontend Integration     | Connect frontend to recommendation API            |
| 6     | UI Refinement            | Polish UI to Blinkit-style design                 |
| 7     | Supabase                 | Migrate from in-memory to Supabase PostgreSQL     |
| 8     | Optimization             | Caching, performance tuning                       |
| 9     | Testing                  | Unit tests for recommendation logic               |
| 10    | Deployment               | Dockerize and deployment prep                     |

---

## Execution Rules

1. **Sequential execution** — each phase completes before the next begins
2. **No scope creep** — only implement what's defined in each phase
3. **Independently runnable** — each phase produces a working state
4. **Type safety** — shared types across the monorepo at all times
5. **PRD compliance** — no features outside the PRD scope

---

## Out of Scope (Global)

- Authentication / Authorization
- Payment integration
- Delivery system
- Real-time tracking
- Multi-warehouse logic
- Mobile app
- SSR optimization beyond defaults
- CI/CD pipeline (Phase 10 is deployment prep only)
