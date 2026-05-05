# Phase 2: Products

## Objective
Implement the product data layer and API endpoint on the backend, and build the product listing UI on the frontend.

---

## Scope
- Define product seed data (20-30 grocery items)
- Implement `GET /products` endpoint in NestJS (Controller → Service → Repository)
- Build product listing grid UI in Next.js
- Product cards with image, name, price, and "Add" button

---

## Tasks

### 2.1 Define Product Data
- Create product seed data with 20-30 grocery items
- Each product: `id`, `name`, `price`, `image_url`
- Include items from PRD: Tea Powder, Sugar, Milk, Coffee, Biscuits, etc.

### 2.2 Backend: Product Module
- Create `products/` module in NestJS
- `products.controller.ts` — handles `GET /products`
- `products.service.ts` — returns product list
- `products.repository.ts` — data access (in-memory for now)
- Use `@blinkit/types` for Product interface

### 2.3 Frontend: Product Listing
- Create product listing page at `/` (home)
- Fetch products from `GET /products`
- Display in responsive grid layout
- Product card component with image, name, price, "Add" button

### 2.4 Add to Cart (Client-Side)
- Simple client-side cart state (Zustand or React context)
- "Add" button adds item to cart
- Cart counter in navbar
- No cart persistence required

---

## Expected Output
- `GET /products` returns JSON array of products
- Home page displays product grid
- "Add" button updates cart counter

---

## Acceptance Criteria
- [ ] `GET /products` returns valid JSON with 20+ products
- [ ] Product grid renders on homepage
- [ ] Each card shows image, name, price
- [ ] "Add" button increments cart counter
- [ ] Shared types used across frontend/backend

---

## Out of Scope
- Cart page / cart details view
- Product detail page
- Search functionality
- Category filtering
- Recommendation display
