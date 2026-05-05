import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from '../recommendations.service';
import { RecommendationsRepository } from '../recommendations.repository';

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let mockRepo: Partial<RecommendationsRepository>;

  beforeEach(async () => {
    // Mock data: 10 orders containing Tea Powder
    const teaOrders = [
      { id: '1', items: ['Tea Powder', 'Sugar', 'Milk'] },
      { id: '2', items: ['Tea Powder', 'Sugar', 'Biscuits'] },
      { id: '3', items: ['Tea Powder', 'Milk', 'Biscuits'] },
      { id: '4', items: ['Tea Powder', 'Sugar', 'Milk', 'Biscuits'] },
      { id: '5', items: ['Tea Powder', 'Sugar'] },
      { id: '6', items: ['Tea Powder', 'Sugar', 'Milk'] },
      { id: '7', items: ['Tea Powder', 'Biscuits'] },
      { id: '8', items: ['Tea Powder', 'Sugar', 'Milk'] },
      { id: '9', items: ['Tea Powder', 'Milk'] },
      { id: '10', items: ['Tea Powder', 'Sugar', 'Biscuits'] },
    ];

    mockRepo = {
      getOrdersContaining: jest.fn().mockImplementation(async (item: string) => {
        const lower = item.toLowerCase();
        if (lower === 'unknown') return [];
        if (lower === 'tea powder') return teaOrders;
        if (lower === 'single')
          return [{ id: '1', items: ['Single', 'Sugar'] }];
        // Generic: return orders containing the item
        return teaOrders.filter((o) =>
          o.items.some((i) => i.toLowerCase() === lower),
        );
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: RecommendationsRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
  });

  it('should return top 3 recommendations for Tea Powder', async () => {
    const result = await service.getRecommendations('Tea Powder');
    expect(result).toHaveLength(3);
    // Sugar appears in 7/10 orders
    expect(result[0].name).toBe('Sugar');
    expect(result[0].score).toBe(0.7);
  });

  it('should return scores between 0 and 1', async () => {
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

  it('should return empty array for unknown item', async () => {
    const result = await service.getRecommendations('Unknown');
    expect(result).toEqual([]);
  });

  it('should not include the queried item in results', async () => {
    const result = await service.getRecommendations('Tea Powder');
    for (const rec of result) {
      expect(rec.name).not.toBe('Tea Powder');
    }
  });

  it('should handle items with less than 3 co-occurrences', async () => {
    const result = await service.getRecommendations('Single');
    expect(result.length).toBeLessThanOrEqual(3);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
