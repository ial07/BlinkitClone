# Phase 9: Testing

## Objective
Write unit tests for the recommendation logic and integration tests for API endpoints.

---

## Scope
- Unit tests for recommendation service
- Integration tests for API endpoints
- Test data fixtures
- Test coverage report

---

## Tasks

### 9.1 Test Setup
- Configure Jest in NestJS (already included)
- Create test fixtures with known order data
- Setup test module with mocked dependencies

### 9.2 Recommendation Service Tests
```typescript
describe('RecommendationsService', () => {
  it('should return top 3 recommendations for Tea Powder');
  it('should return scores between 0 and 1');
  it('should sort results by score descending');
  it('should return empty array for unknown item');
  it('should not include the queried item in results');
  it('should handle items with less than 3 co-occurrences');
});
```

### 9.3 API Integration Tests
```typescript
describe('GET /recommendations', () => {
  it('should return 200 with valid item parameter');
  it('should return proper JSON structure');
  it('should return 400 without item parameter');
  it('should return empty recommendations for unknown item');
});

describe('GET /products', () => {
  it('should return 200 with product array');
  it('should return products with required fields');
});
```

### 9.4 Coverage Report
- Run `npm test -- --coverage`
- Target: >80% coverage on service layer
- Generate HTML report

---

## Expected Output
- All tests passing
- Coverage report generated
- Test fixtures documented

---

## Acceptance Criteria
- [ ] All recommendation service tests pass
- [ ] All API integration tests pass
- [ ] Coverage >80% on service layer
- [ ] Tests run via `turbo test`
- [ ] No flaky tests

---

## Out of Scope
- E2E tests (Cypress/Playwright)
- Frontend component tests
- Load/stress testing
- Visual regression testing
- CI pipeline integration
