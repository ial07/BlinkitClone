# Phase 7: Supabase Integration

## Objective
Migrate from in-memory/JSON data to Supabase PostgreSQL for products and orders storage.

---

## Scope
- Supabase project setup
- Create `products` and `orders` tables
- Seed data via SQL scripts
- Update repository layer to query Supabase
- Environment variable configuration

---

## Tasks

### 7.1 Database Schema
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  items TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.2 Seed Scripts
- Create `apps/api/src/database/seed-products.sql`
- Create `apps/api/src/database/seed-orders.sql`
- Generate from existing JSON data

### 7.3 Supabase Client Setup
- Install `@supabase/supabase-js` in `apps/api`
- Create Supabase client module in NestJS
- Configure via environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`

### 7.4 Update Repositories
- `products.repository.ts` → query Supabase instead of in-memory
- `recommendations.repository.ts` → query orders from Supabase
- Keep in-memory fallback for local development

### 7.5 Environment Setup
- Create `.env.example` with required variables
- Add `.env` to `.gitignore`

---

## Expected Output
- Products and orders stored in Supabase PostgreSQL
- API reads from database instead of JSON
- Seed scripts for reproducible data

---

## Acceptance Criteria
- [ ] Tables created in Supabase
- [ ] Seed data inserted successfully
- [ ] `GET /products` returns data from Supabase
- [ ] `GET /recommendations` works with database orders
- [ ] Environment variables documented
- [ ] In-memory fallback works without Supabase

---

## Out of Scope
- Row-level security policies
- Supabase Auth integration
- Supabase Storage for images
- Real-time subscriptions
- Database migrations tooling
