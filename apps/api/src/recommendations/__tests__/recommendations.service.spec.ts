import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from '../recommendations.service';
import { RecommendationsRepository } from '../recommendations.repository';

/**
 * Deterministic fixture: 10 orders all containing "Tea Powder".
 * Expected co-occurrence counts (out of 10 orders):
 *   Sugar    → 7  → score 0.70
 *   Milk     → 6  → score 0.60
 *   Biscuits → 5  → score 0.50
 */
const TEA_ORDERS = [
  { id: '1',  items: ['Tea Powder', 'Sugar', 'Milk'] },
  { id: '2',  items: ['Tea Powder', 'Sugar', 'Biscuits'] },
  { id: '3',  items: ['Tea Powder', 'Milk', 'Biscuits'] },
  { id: '4',  items: ['Tea Powder', 'Sugar', 'Milk', 'Biscuits'] },
  { id: '5',  items: ['Tea Powder', 'Sugar'] },
  { id: '6',  items: ['Tea Powder', 'Sugar', 'Milk'] },
  { id: '7',  items: ['Tea Powder', 'Biscuits'] },
  { id: '8',  items: ['Tea Powder', 'Sugar', 'Milk'] },
  { id: '9',  items: ['Tea Powder', 'Milk'] },
  { id: '10', items: ['Tea Powder', 'Sugar', 'Biscuits'] },
];

/** Fixture for sparse-data test: item that appears in only 1 order */
const SINGLE_ORDER = [{ id: '11', items: ['Single', 'Sugar'] }];

/**
 * All orders seen by getAllOrders (used to build the co-occurrence matrix at startup).
 * We include both Tea Powder orders and the Single order.
 */
const ALL_ORDERS = [...TEA_ORDERS, ...SINGLE_ORDER];

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let mockRepo: jest.Mocked<Pick<RecommendationsRepository, 'getAllOrders' | 'getOrdersContaining'>>;

  beforeEach(async () => {
    mockRepo = {
      /**
       * Called once at startup by onModuleInit() → buildCooccurrenceMatrix().
       * Must return the full dataset so the matrix is populated correctly.
       */
      getAllOrders: jest.fn().mockResolvedValue(ALL_ORDERS),

      /**
       * Called by computeOnTheFly() — only triggered for items NOT in the matrix.
       * Under normal test conditions this should not be hit for our fixture items.
       */
      getOrdersContaining: jest.fn().mockImplementation(async (item: string) => {
        const lower = item.toLowerCase();
        if (lower === 'unknown') return [];
        if (lower === 'tea powder') return TEA_ORDERS;
        if (lower === 'single') return SINGLE_ORDER;
        return [];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: RecommendationsRepository, useValue: mockRepo },
      ],
    }).compile();

    // Trigger OnModuleInit to build the co-occurrence matrix
    service = module.get<RecommendationsService>(RecommendationsService);
    await service.onModuleInit();
  });

  // ── Core MBA behaviour ────────────────────────────────────────────────────

  it('should return top 3 recommendations for Tea Powder', async () => {
    const result = await service.getRecommendations('Tea Powder');
    expect(result).toHaveLength(3);
    // Sugar appears in 7 of 10 orders → score = 0.70 → rank 1
    expect(result[0].name).toBe('sugar');
    expect(result[0].score).toBe(0.7);
  });

  it('should return scores strictly between 0 and 1 (inclusive)', async () => {
    const result = await service.getRecommendations('Tea Powder');
    for (const rec of result) {
      expect(rec.score).toBeGreaterThanOrEqual(0);
      expect(rec.score).toBeLessThanOrEqual(1);
    }
  });

  it('should sort results by score descending', async () => {
    const result = await service.getRecommendations('Tea Powder');
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
    }
  });

  it('should return empty array for an unknown item', async () => {
    const result = await service.getRecommendations('Unknown');
    expect(result).toEqual([]);
  });

  it('should NOT include the queried item itself in results', async () => {
    const result = await service.getRecommendations('Tea Powder');
    const names = result.map((r) => r.name.toLowerCase());
    expect(names).not.toContain('tea powder');
  });

  it('should handle items with fewer than 3 unique co-occurrences gracefully', async () => {
    // "Single" appears in only 1 order with only 1 other item (Sugar)
    const result = await service.getRecommendations('Single');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(3);
    expect(result[0].name).toBe('sugar');
  });

  // ── Cache behaviour ───────────────────────────────────────────────────────

  it('should serve the second call from cache (getAllOrders not called again)', async () => {
    await service.getRecommendations('Tea Powder');
    const callsBefore = (mockRepo.getAllOrders as jest.Mock).mock.calls.length;
    await service.getRecommendations('Tea Powder');
    expect((mockRepo.getAllOrders as jest.Mock).mock.calls.length).toBe(callsBefore);
  });

  it('should return the same result on cache hit as on first computation', async () => {
    const first  = await service.getRecommendations('Tea Powder');
    const second = await service.getRecommendations('Tea Powder');
    expect(second).toEqual(first);
  });

  it('should clear cache and return fresh result after invalidateCache()', async () => {
    await service.getRecommendations('Tea Powder'); // populates cache
    service.invalidateCache('Tea Powder');
    const afterInvalidation = await service.getRecommendations('Tea Powder');
    expect(afterInvalidation).toHaveLength(3);     // still resolves correctly
  });
});
