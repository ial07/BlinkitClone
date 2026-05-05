# Phase 3: Orders Dataset

## Objective
Generate 1,000 mock orders with realistic, seeded co-occurrence patterns for the recommendation engine.

---

## Scope
- Create a seed script that generates 1,000 orders
- Each order contains 2-6 product names
- Embed controlled co-occurrence patterns
- Output as JSON seed file and/or database insertable format

---

## Tasks

### 3.1 Define Co-occurrence Patterns
Controlled patterns (high frequency):
- Tea Powder → Sugar (78%), Milk (65%), Biscuits (52%)
- Coffee → Milk (72%), Sugar (68%), Cream (45%)
- Bread → Butter (75%), Jam (60%), Eggs (48%)
- Rice → Dal (70%), Oil (55%), Onions (50%)
- Maggi → Eggs (60%), Ketchup (50%), Cheese (40%)

### 3.2 Build Seed Script
- Create `packages/utils/src/seed/generate-orders.ts`
- Generate 1,000 orders following the patterns above
- Each order: `{ id, items: string[] }`
- Use deterministic random seed for reproducibility

### 3.3 Output Formats
- `apps/api/src/data/orders.json` — static JSON file
- Future: SQL insert script for Supabase (Phase 7)

### 3.4 Validate Dataset
- Verify Tea Powder + Sugar co-occurrence ≈ 78%
- Verify at least 15 unique products appear
- Verify order sizes range from 2-6 items

---

## Expected Output
- `orders.json` with 1,000 orders
- Seed script that can regenerate the data
- Validation output confirming pattern accuracy

---

## Acceptance Criteria
- [ ] 1,000 orders generated
- [ ] Orders contain 2-6 items each
- [ ] Co-occurrence patterns match defined percentages (±5%)
- [ ] Data is deterministic (same seed = same output)
- [ ] At least 20 unique products in dataset

---

## Out of Scope
- Real database insertion (Phase 7)
- Order API endpoints
- Order history UI
- Dynamic order generation at runtime
