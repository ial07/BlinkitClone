import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsController } from '../recommendations.controller';
import { RecommendationsService } from '../recommendations.service';
import { BadRequestException } from '@nestjs/common';

describe('RecommendationsController', () => {
  let controller: RecommendationsController;
  let mockService: Partial<RecommendationsService>;

  beforeEach(async () => {
    mockService = {
      getRecommendations: jest.fn().mockImplementation(async (item: string) => {
        if (item.toLowerCase() === 'unknown') return [];
        return [
          { name: 'Sugar', score: 0.7 },
          { name: 'Milk', score: 0.5 },
          { name: 'Biscuits', score: 0.3 },
        ];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        { provide: RecommendationsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<RecommendationsController>(
      RecommendationsController,
    );
  });

  it('should return 200 with valid item parameter', async () => {
    const result = await controller.getRecommendations('Tea Powder');
    expect(result.item).toBe('Tea Powder');
    expect(result.recommendations).toHaveLength(3);
  });

  it('should return proper JSON structure', async () => {
    const result = await controller.getRecommendations('Tea Powder');
    expect(result).toHaveProperty('item');
    expect(result).toHaveProperty('recommendations');
    expect(result.recommendations[0]).toHaveProperty('name');
    expect(result.recommendations[0]).toHaveProperty('score');
  });

  it('should throw 400 without item parameter', async () => {
    await expect(
      controller.getRecommendations(undefined as unknown as string),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw 400 with empty item', async () => {
    await expect(controller.getRecommendations('  ')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return empty recommendations for unknown item', async () => {
    const result = await controller.getRecommendations('Unknown');
    expect(result.recommendations).toEqual([]);
  });
});
