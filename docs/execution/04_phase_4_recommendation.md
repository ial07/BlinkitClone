# Phase 4: Recommendation Engine

## Objective
Implement the frequency-based "Frequently Bought Together" recommendation logic and expose it via `GET /recommendations?item=<name>`.

---

## Scope
- Recommendation service with co-occurrence counting
- API endpoint: `GET /recommendations?item=Tea Powder`
- Response: top 3 items with confidence scores
- Controller → Service → Repository pattern

---

## Tasks

### 4.1 Recommendation Repository
- Create `recommendations/recommendations.repository.ts`
- Load orders from `orders.json`
- Provide method to get all orders containing a given item

### 4.2 Recommendation Service
- Create `recommendations/recommendations.service.ts`
- Implement `getRecommendations(itemName: string)`
- Logic:
  1. Filter orders containing `itemName`
  2. Count co-occurrence of every other item
  3. Calculate score: `count / totalOrdersWithItem`
  4. Sort descending by score
  5. Return top 3

### 4.3 Recommendation Controller
- Create `recommendations/recommendations.controller.ts`
- `GET /recommendations?item=<name>`
- Validate `item` query parameter
- Return `RecommendationResponse` type from `@blinkit/types`

### 4.4 Shared Types
- Add `RecommendationResponse` to `@blinkit/types`:
  ```typescript
  interface RecommendationResponse {
    item: string;
    recommendations: Array<{
      name: string;
      score: number;
    }>;
  }
  ```

---

## Expected Output
```json
GET /recommendations?item=Tea Powder

{
  "item": "Tea Powder",
  "recommendations": [
    { "name": "Sugar", "score": 0.78 },
    { "name": "Milk", "score": 0.65 },
    { "name": "Biscuits", "score": 0.52 }
  ]
}
```

---

## Acceptance Criteria
- [ ] `GET /recommendations?item=Tea Powder` returns top 3 items
- [ ] Scores are between 0 and 1
- [ ] Results sorted descending by score
- [ ] Response time < 200ms
- [ ] Returns empty array for unknown items
- [ ] Uses shared `RecommendationResponse` type

---

## Out of Scope
- Frontend integration (Phase 5)
- Caching (Phase 8)
- Apriori or ML-based algorithms
- Pagination of results
- Multiple item input
