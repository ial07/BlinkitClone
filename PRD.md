# PRODUCT REQUIREMENT DOCUMENT

## 1. Objective

Build a minimal web application that demonstrates:

- Product listing
- Add to cart interaction
- “Frequently Bought Together” recommendation logic

Primary goal:

- Showcase data processing and recommendation logic using a mock dataset of 1,000 orders

---

## 2. Scope

### In Scope

- Product listing page
- Add to cart action
- Recommendation engine
- API endpoint for recommendations

### Out of Scope

- Authentication
- Payment integration
- Delivery system
- Real-time tracking
- Multi-warehouse logic

---

## 3. Target Users

- Recruiters
- Technical reviewers

---

## 4. User Flow

1. User opens the web app
2. User browses product list
3. User clicks “Add to Cart” on “Tea Powder”
4. System triggers recommendation logic
5. UI displays:
   - “Frequently Bought Together”
   - Top 3 related products

---

## 5. Core Feature

### Frequently Bought Together

Description:

- The system analyzes a dataset of 1,000 orders
- It finds items that frequently appear together with a selected product

Concept:

- Market Basket Analysis

---

## 6. Functional Requirements

### Input

- Product name (example: “Tea Powder”)

### Process

- Filter orders containing the selected product
- Count frequency of other items in those orders
- Sort by frequency (descending)
- Return top 3 items

### Output

```json
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

## 7. Non-Functional Requirements

- Response time under 200ms
- Handle 1,000 to 5,000 orders efficiently
- Stateless API
- Easy to deploy and scale

---

## 8. System Architecture

### Monorepo Structure

```
apps/
  web/        (Next.js frontend)
  api/        (NestJS backend)

packages/
  ui/         (shared UI components)
  types/      (shared TypeScript types)
  utils/      (shared utility functions)
```

---

### Architecture Pattern

Separation of Concern:

- Controller → handles HTTP requests
- Service → business logic (recommendation engine)
- Repository → data access layer

---

## 9. Tech Stack

### Frontend

- Next.js
- Tailwind CSS
- Optional: Zustand (state management)

### Backend

- NestJS
- TypeScript

### Database

- Supabase
  - PostgreSQL
  - Optional storage

---

## 10. Database Design

### products table

- id
- name
- price
- image_url

### orders table

- id
- items (JSON array of product names or IDs)

---

## 11. API Design

### GET /products

Returns product list

### GET /recommendations?item=Tea Powder

Response:

- Top 3 frequently bought together items

---

## 12. UI/UX Requirements

Design reference:

- Blinkit.com

### Layout Structure

Navbar:

- Logo
- Optional search bar

Main Section:

- Product grid
- Product card:
  - Image
  - Name
  - Price
  - “Add” button

Recommendation Section:

- Title: “Frequently Bought Together”
- Horizontal list of recommended items

---

## 13. Mock Data Strategy

- Generate 1,000 orders
- Use controlled patterns:
  - Tea Powder → Sugar, Milk
  - Coffee → Milk, Sugar

Storage options:

- Supabase database
- Static JSON seed file

---

## 14. Development Plan

### Phase 1

- Setup monorepo
- Setup NestJS backend
- Setup Next.js frontend

### Phase 2

- Implement product API
- Build product listing UI

### Phase 3

- Implement recommendation logic
- Create recommendation API endpoint

### Phase 4

- Integrate frontend with API
- Display recommendations dynamically

---

## 15. Testing Strategy

- Unit test for recommendation logic
- Test case:
  - Input: Tea Powder
  - Output: top 3 expected items

---

## 16. Deployment Strategy

- Dockerize:
  - Backend (NestJS)
  - Frontend (Next.js)

- Use:
  - Supabase for database
  - Single deployment environment (Sumopod-friendly)

---

## 17. Risks and Mitigation

Risk:

- Random dataset produces unrealistic recommendations

Mitigation:

- Use seeded patterns for predictable results

---

## 18. Enhancements (Optional)

### Level 1

- Add confidence score
- Add caching (in-memory or Redis)

### Level 2

- Implement:
  - Apriori algorithm

### Level 3

- Collaborative filtering
- Machine learning-based recommendations

---

## 19. Key Engineering Considerations

- Keep recommendation logic isolated in service layer
- Avoid recomputing results on every request
- Use caching for repeated queries
- Maintain shared types across monorepo
- Create reproducible seed scripts

---

## 20. Deliverables

- Monorepo project (GitHub)
- README:
  - Setup instructions
  - Seed data instructions
  - API usage

---
