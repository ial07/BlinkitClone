import { Injectable } from '@nestjs/common';
import { Recommendation } from '@blinkit/types';
import { RecommendationsRepository } from './recommendations.repository';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly repository: RecommendationsRepository,
  ) {}

  async getRecommendations(itemName: string): Promise<Recommendation[]> {
    const lowerInput = itemName.toLowerCase();
    const matchingOrders = await this.repository.getOrdersContaining(itemName);

    if (matchingOrders.length === 0) {
      return [];
    }

    // Count co-occurrence of every other item
    const cooccurrenceCount = new Map<string, number>();

    for (const order of matchingOrders) {
      for (const item of order.items) {
        if (item.toLowerCase() !== lowerInput) {
          cooccurrenceCount.set(
            item,
            (cooccurrenceCount.get(item) || 0) + 1,
          );
        }
      }
    }

    // Calculate score and sort
    const total = matchingOrders.length;
    const recommendations: Recommendation[] = [];

    for (const [name, count] of cooccurrenceCount) {
      recommendations.push({
        name,
        score: Math.round((count / total) * 100) / 100,
      });
    }

    // Sort descending by score, return top 3
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
}
