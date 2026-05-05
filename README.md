# BlinkitClone — Frequently Bought Together Recommendation Engine

> A quick commerce MVP demonstrating a **Market Basket Analysis** recommendation system, built with a production-grade monorepo architecture using Next.js, NestJS, and Supabase.

---

## Overview

Quick commerce platforms live and die by basket size. Getting a user to add one more item per order — consistently — is the difference between breakeven and profitability at scale.

This project implements the **Frequently Bought Together** feature: when a user adds a product to their cart, the system immediately surfaces the top 3 items most commonly purchased alongside it, derived from analysis of 1,000 seeded orders using **Market Basket Analysis (MBA)**.

The goal was not to build a toy demo. It was to design a system where:
- The recommendation logic is isolated, testable, and replaceable
- The data layer is database-backed with a clean fallback strategy
- The architecture can evolve from MBA → Apriori → collaborative filtering without structural rewrites

---

## Live Demo

| Surface | URL |
|---|---|
| Web App | `https://your-deployment-url.vercel.app` |
| API | `https://your-api-url.railway.app` |
| API Health | `GET /health` |
| Products | `GET /products` |
| Recommendations | `GET /recommendations?item=Tea+Powder` |

---

## Key Features

| Feature | Description |
|---|---|
| **Product Listing** | 30 grocery products served from Supabase PostgreSQL |
| **Category UI** | Horizontal scroll carousels with Blinkit-style prev/next navigation |
| **Product Detail Page** | Full product view with unit selection and cross-sell carousels |
| **Frequently Bought Together** | Triggered on "Add to Cart" — surfaces top 3 co-purchased items with confidence scores |
| **Smart Modal Trigger** | Anti-spam cooldown (30s), high-confidence threshold filter — modal only fires when meaningful |
| **Supabase Integration** | Live PostgreSQL queries with graceful in-memory fallback if DB is unavailable |
| **Cart State** | Client-side observable store with real-time badge updates |

---

## Tech Stack

### Frontend — `apps/web`
- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4**
- **Plus Jakarta Sans** (closest match to Blinkit's proprietary Gilroy typeface)
- Custom observable cart store (no external state library)

### Backend — `apps/api`
- **NestJS** (modular, dependency-injected)
- **TypeScript** throughout
- Stateless REST API

### Database
- **Supabase** (hosted PostgreSQL)
- `products` table — 30 products
- `orders` table — 1,000 seeded orders with controlled co-occurrence patterns

### Infrastructure
- **Turborepo** monorepo with shared `packages/types`, `packages/utils`
- Separation of Concern: Controller → Service → Repository
- Environment-based Supabase toggle with in-memory fallback

---

## Architecture Overview

```
BlinkitClone/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
└── packages/
    ├── types/        # Shared TypeScript interfaces (Product, Order, Recommendation)
    ├── utils/        # Shared utilities (formatPrice, generateOrders seed)
    └── ui/           # Shared component stubs
```

### Request Flow

```
User (Browser)
  │
  ├─► GET /products          → ProductsController
  │                              └─► ProductsService
  │                                    └─► ProductsRepository → Supabase / in-memory fallback
  │
  └─► GET /recommendations?item=Tea+Powder
                             → RecommendationsController
                                 └─► RecommendationsService    ← business logic lives here
                                       └─► RecommendationsRepository
                                             └─► OrdersRepository → Supabase / in-memory fallback
```

**Key design decision:** The `RecommendationsService` only knows about an `Order[]` interface. It does not import from Supabase directly. This means the data source (DB, cache, file, mock) can be swapped without touching the recommendation logic.

---

## Recommendation Logic

### Approach: Market Basket Analysis

MBA is the right first choice here. It is:
- **Interpretable** — product managers can understand and tune it
- **Fast** — O(N×M) where N = matching orders, M = avg items per order
- **No training required** — works immediately on any dataset
- **Baseline before ML** — establishes a measurable accuracy floor

### Algorithm (Step-by-Step)

```
Input: item = "Tea Powder"

Step 1 — Filter
  Find all orders where items[] contains "Tea Powder"
  → e.g., 420 out of 1,000 orders

Step 2 — Count Co-occurrence
  For each of those 420 orders, tally every *other* item:
  { Sugar: 327, Milk: 274, Biscuits: 218, Coffee: 101, ... }

Step 3 — Compute Confidence Score
  score = co_occurrence_count / total_matching_orders
  Sugar → 327 / 420 = 0.78
  Milk  → 274 / 420 = 0.65
  Biscuits → 218 / 420 = 0.52

Step 4 — Rank and Return Top 3
  [
    { name: "Sugar",    score: 0.78 },
    { name: "Milk",     score: 0.65 },
    { name: "Biscuits", score: 0.52 }
  ]
```

### Seed Data Design

Orders are not random. They are generated with **controlled co-occurrence patterns** using a deterministic seed (Mulberry32 PRNG), ensuring:
- Tea Powder → Sugar (0.78), Milk (0.65), Biscuits (0.52)
- Coffee → Milk (0.72), Sugar (0.68), Cream (0.45)
- Bread → Butter (0.75), Jam (0.60), Eggs (0.48)
- Rice → Dal (0.70), Cooking Oil (0.55), Onions (0.50)

The same seed always produces the same dataset — making results reproducible and testable.

---

## Scalability Considerations

The current implementation is designed to be production-replaceable, not just demo-ready.

### At 10K orders (current design)
- In-process computation per request: ~5ms
- Supabase query with `@>` array containment operator
- Response time target: < 200ms ✓

### At 1M orders (next step)
```
Problem: Querying 1M orders on every recommendation request = unacceptable
Solution: Precompute co-occurrence matrix at write-time

Architecture upgrade:
  Order Created → Event Queue (BullMQ / SQS)
                    └─► Worker: update co_occurrence table
                                  └─► Cache invalidation (Redis)

GET /recommendations → Redis HIT (< 5ms) → return
                     → Redis MISS → query co_occurrence table → re-cache
```

### At 10M orders (ML-ready)
- Replace MBA with Apriori or FP-Growth on Spark/BigQuery
- Serve recommendations from a precomputed similarity table
- A/B test MBA vs ML side-by-side on click-through rate

### Database Indexing
```sql
-- Required index for current array containment query
CREATE INDEX idx_orders_items ON orders USING GIN (items);
```
Without this GIN index, PostgreSQL performs a full sequential scan on every recommendation request.

### API Caching Strategy
```
Layer 1: In-process Map<itemName, Recommendation[]> with TTL
Layer 2: Redis with 5-minute expiry
Layer 3: Supabase query (fallback only on cache miss)
```

---

## Edge Case Handling

| Scenario | Handling |
|---|---|
| Item not in any order | Returns `[]` — frontend renders nothing, no error thrown |
| Item in only 1 order | Score = 1.0 for all co-items, but dataset is sparse — low confidence threshold filter prevents misleading recommendations |
| Duplicate items in an order | `Set<string>` used during co-occurrence counting — duplicates ignored |
| Case mismatch (`"tea powder"` vs `"Tea Powder"`) | API falls back to in-memory search with `.toLowerCase()` comparison if Supabase returns 0 results |
| Supabase unreachable | `isConnected()` guard — falls back to `orders.json` without surfacing an error to the user |
| Modal spam | 30-second cooldown enforced client-side via `Date.now()` timestamp ref |

---

## Setup Instructions

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10
- A Supabase project (or skip — the app falls back to local data)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/BlinkitClone.git
cd BlinkitClone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

> If you skip this step, the app runs fully on local seed data — no Supabase required.

### 4. (Optional) Seed the database

Run the SQL script in your Supabase SQL editor:

```
apps/api/src/database/seed-orders.sql
```

### 5. Start development servers

```bash
npm run dev
```

This starts all packages in parallel via Turborepo:

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (NestJS) | http://localhost:3001 |

### 6. If ports are already in use

```bash
npm run kill-ports
npm run dev
```

---

## Project Structure

```
BlinkitClone/
│
├── apps/
│   ├── api/                        # NestJS Backend
│   │   └── src/
│   │       ├── products/           # Products module (Controller → Service → Repository)
│   │       ├── orders/             # Orders repository (Supabase + fallback)
│   │       ├── recommendations/    # MBA engine (Controller → Service → Repository)
│   │       ├── supabase/           # Supabase client module
│   │       ├── data/               # Seed data (orders.json, products.ts)
│   │       └── database/           # SQL migration & seed scripts
│   │
│   └── web/                        # Next.js Frontend
│       └── src/
│           ├── app/                # App Router pages (/, /product/[id])
│           ├── components/         # Navbar, Hero, CategorySection, ProductCarousel, ProductCard, RecommendationModal, Footer
│           ├── lib/                # API client (fetchProducts, fetchRecommendations)
│           └── store/              # Observable cart store
│
└── packages/
    ├── types/                      # Shared: Product, Order, Recommendation, RecommendationResponse
    ├── utils/                      # Shared: formatPrice, generateOrders (deterministic seed)
    └── ui/                         # Shared component stubs
```

---

## API Reference

### `GET /products`

Returns all 30 products from Supabase (or in-memory fallback).

```json
[
  { "id": "p001", "name": "Tea Powder", "price": 120, "image_url": "/products/tea-powder.webp" },
  ...
]
```

### `GET /recommendations?item=Tea+Powder`

Runs Market Basket Analysis for the given item.

```json
{
  "item": "Tea Powder",
  "recommendations": [
    { "name": "Sugar",    "score": 0.78 },
    { "name": "Milk",     "score": 0.65 },
    { "name": "Biscuits", "score": 0.52 }
  ]
}
```

**Error cases:**
- Missing `item` param → `400 Bad Request`
- Item not found in orders → `200 OK` with `recommendations: []`

### `GET /health`

```json
{ "status": "ok", "timestamp": "2026-05-05T16:00:00.000Z" }
```

---

## Future Improvements

### Short Term
- [ ] **Redis caching layer** — cache recommendation results with 5-minute TTL, keyed by item name
- [ ] **GIN index** on `orders.items` — required for production-scale Supabase queries
- [ ] **Confidence threshold config** — make the 0.5 score floor configurable via env

### Medium Term
- [ ] **Apriori algorithm** — replace co-occurrence counting with proper frequent itemset mining for more accurate lift scores
- [ ] **Real-time order ingestion** — BullMQ job queue to update co-occurrence matrix asynchronously when new orders are placed
- [ ] **Search functionality** — fuzzy search over product catalog

### Long Term
- [ ] **Collaborative filtering** — user-level personalization based on purchase history
- [ ] **ML pipeline** — train on real order data with A/B testing framework to compare models by click-through rate
- [ ] **Multi-warehouse routing** — pin recommendations to items available in the user's nearest dark store

---

## Author Note

This project was built as a focused engineering exercise to demonstrate production thinking on a constrained problem.

The emphasis was on **decision quality, not feature count**:

- Why MBA and not a simpler "customers also bought" query? Because MBA produces interpretable confidence scores that can be thresholded, audited, and eventually replaced by a better model without changing the API contract.
- Why a monorepo with shared types? Because at the first moment a mobile app or second frontend is needed, the types don't drift.
- Why a fallback to in-memory data? Because a recommendation system that goes dark when the database has a blip is worse than no recommendation system at all.

The architecture was designed so that the hard part — the recommendation logic — is behind an interface. Everything else is plumbing.

---

## License

MIT — built for demonstration purposes.
