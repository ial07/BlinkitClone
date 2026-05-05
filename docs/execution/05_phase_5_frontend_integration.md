# Phase 5: Frontend Integration

## Objective
Connect the Next.js frontend to the recommendation API and display "Frequently Bought Together" results when a user adds an item to cart.

---

## Scope
- Fetch recommendations from API when "Add" is clicked
- Display recommendation section below/beside the product grid
- Horizontal list of recommended product cards
- Link "Add" action to trigger recommendation fetch

---

## Tasks

### 5.1 API Client Setup
- Create API client utility in `apps/web/src/lib/api.ts`
- Functions: `fetchProducts()`, `fetchRecommendations(item: string)`
- Use `fetch` with proper error handling
- Base URL configurable via environment variable

### 5.2 Recommendation Trigger
- On "Add to Cart" click, trigger `fetchRecommendations(productName)`
- Store recommendation result in state
- Show loading indicator during fetch

### 5.3 Recommendation UI Component
- Create `RecommendationSection` component
- Title: "Frequently Bought Together"
- Horizontal scrollable list of recommended items
- Each item shows: name, score badge, "Add" button
- Animate section appearance

### 5.4 Integration Flow
1. User clicks "Add" on Tea Powder
2. Item added to cart
3. Recommendation API called with `item=Tea Powder`
4. "Frequently Bought Together" section appears
5. Shows Sugar, Milk, Biscuits with scores

---

## Expected Output
- Clicking "Add" shows recommendations below the product grid
- Recommendations update when different products are added
- Smooth transition/animation on recommendation appearance

---

## Acceptance Criteria
- [ ] "Add" triggers recommendation fetch
- [ ] Recommendation section renders with 3 items
- [ ] Scores are displayed on each recommended card
- [ ] Recommendations update per product
- [ ] Error state handled gracefully
- [ ] Loading state shown during API call

---

## Out of Scope
- Cart page / checkout
- Recommendation caching on frontend
- Offline support
- Pre-fetching recommendations
