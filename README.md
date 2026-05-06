# BlinkitClone — Frequently Bought Together Recommendation Engine

A quick commerce MVP demonstrating a Market Basket Analysis recommendation system, built with a production-grade monorepo architecture using Next.js, NestJS, and Supabase.

---

## Overview

Quick commerce platforms depend on basket size. Increasing average order value by even one item per transaction has direct impact on profitability.

This project implements a Frequently Bought Together system. When a user adds a product, the system returns the top 3 items most frequently purchased alongside it, derived from 1,000 seeded orders.

System design goals:

- Recommendation logic is isolated and testable
- Data layer supports database and fallback modes
- Architecture supports future upgrade to more advanced algorithms

---

## Live Demo

| Surface         | URL                                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Web App         | [https://blinkit-clone-web.vercel.app](https://blinkit-clone-web.vercel.app)                                               |
| API             | [https://linkitlone-ial073362-m4hm7zfo.leapcell.dev](https://linkitlone-ial073362-m4hm7zfo.leapcell.dev)                   |
| Health          | [GET](https://linkitlone-ial073362-m4hm7zfo.leapcell.dev/health) /health                                                   |
| Products        | [GET](https://linkitlone-ial073362-m4hm7zfo.leapcell.dev/products) /products                                               |
| Recommendations | [GET](https://linkitlone-ial073362-m4hm7zfo.leapcell.dev/recommendations?item=Tea+Powder) /recommendations?item=Tea+Powder |

---

## Key Features

- Product listing from Supabase
- Horizontal scroll UI with next and previous navigation
- Product detail page with recommendation
- Frequently Bought Together logic (top 3 items)
- Confidence-based filtering
- Supabase integration with fallback
- Lightweight cart state

---

## Tech Stack

Frontend:

- Next.js
- Tailwind CSS

Backend:

- NestJS
- TypeScript

Database:

- Supabase (PostgreSQL)

Architecture:

- Monorepo (Turborepo)
- Separation of Concern
- Shared packages

---

## Architecture Overview

apps/

- web
- api

packages/

- types
- utils

Flow:

User → Frontend → API → Service → Repository → Database

Key decision:

Recommendation logic only depends on Order[].
It does not depend on Supabase directly.

---

## Recommendation Logic

Approach: Market Basket Analysis

Steps:

1. Filter orders containing item
2. Count co-occurring items
3. Calculate score
4. Sort and return top 3

---

## Why Not Apriori algorithm

Apriori was not used because:

- Requires multiple passes over dataset
- High computational cost
- Not necessary for current dataset size

Decision:

Use frequency-based approach as baseline.
System is designed to allow replacement later.

---

## Performance

Complexity:

O(N × M)

- N = matching orders
- M = items per order

Result:

- ~3–8ms computation
- <200ms response

---

## Optimization

- In-memory caching
- Avoid recomputation
- Dataset reuse

---

## Scalability

Future approach:

- Precompute co-occurrence
- Use Redis cache
- Background jobs for updates

---

## Edge Case Handling

- Item not found → return empty
- Single-item orders ignored
- Duplicate items removed
- Case normalized
- DB failure → fallback to memory

---

## Setup Instructions

### Install

git clone <repo>
cd project
npm install

---

### Environment

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

---

### Run

npm run dev

---

### Access

- Web: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001](http://localhost:3001)

---

# Deployment (Leapcell + Vercel)

---

## Backend Deployment (Leapcell)

Platform: Leapcell

### Build Command

npm install &&
npm run build --workspace=@blinkit/types &&
npm.run build --workspace=@blinkit/utils &&
cd apps/api && npm run build

### Start Command

node apps/api/dist/main.js

---

### Environment Variables (Leapcell)

| Variable             | Value                                                                |
| -------------------- | -------------------------------------------------------------------- |
| PORT                 | 3001                                                                 |
| SUPABASE_URL         | [https://your-project.supabase.co](https://your-project.supabase.co) |
| SUPABASE_SERVICE_KEY | your-secret-key                                                      |
| CORS_ORIGIN          | https://your-web-url                                                 |

---

### Health Check

[https://your-api.leapcell.dev/health](https://your-api.leapcell.dev/health)

---

## Frontend Deployment (Vercel)

Platform: Vercel

### Settings

- Root Directory: project root
- Build Command:
  npx turbo build --filter=@blinkit/web
- Output Directory:
  apps/web/.next

---

### Environment Variables (Vercel)

| Variable            | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| NEXT_PUBLIC_API_URL | [https://your-api.leapcell.dev](https://your-api.leapcell.dev) |

---

## CORS Configuration (CRITICAL)

File: apps/api/src/main.ts

```ts
app.enableCors({
  origin: ['http://localhost:3000', 'https://your-vercel-url.vercel.app'],
  credentials: true,
});
```

Tanpa ini, frontend tidak bisa akses API.

---

## Verification

Check API:

- /health
- /products
- /recommendations

Check browser:

- No CORS error
- Data loaded successfully

---

## Project Structure

apps/

- api
- web

packages/

- types
- utils

---

## API

GET /products

GET /recommendations?item=Tea Powder

GET /health

---

## Trade-offs

- MBA for simplicity and speed
- No Apriori to avoid complexity
- No ML due to dataset size
- REST for simplicity

---

## Future Improvements

- Redis caching
- Apriori algorithm
- Background jobs
- ML recommendation

---

## Author Note

This project focuses on engineering decisions.

- Logic is isolated
- System is scalable
- Failures handled gracefully

Goal is not feature count, but system quality.

---

## License

MIT
