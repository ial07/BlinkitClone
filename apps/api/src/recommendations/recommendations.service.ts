import { Injectable, OnModuleInit } from '@nestjs/common';
import { Recommendation } from '@blinkit/types';
import { RecommendationsRepository } from './recommendations.repository';

interface CooccurrenceMatrix {
  [itemName: string]: { name: string; score: number }[];
}

@Injectable()
export class RecommendationsService implements OnModuleInit {
  private cooccurrenceMatrix: CooccurrenceMatrix = {};
  private cache = new Map<string, { data: Recommendation[]; ttl: number }>();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes default

  constructor(private readonly repository: RecommendationsRepository) {}

  async onModuleInit() {
    console.log('🔁 Precomputing co-occurrence matrix...');
    const start = performance.now();
    await this.buildCooccurrenceMatrix();
    const elapsed = Math.round(performance.now() - start);
    const itemCount = Object.keys(this.cooccurrenceMatrix).length;
    console.log(`✅ Co-occurrence matrix built: ${itemCount} items in ${elapsed}ms`);
  }

  async getRecommendations(itemName: string): Promise<Recommendation[]> {
    const key = itemName.toLowerCase().trim();

    // 1. Check cache first
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.ttl) {
      console.log(`⚡ [CACHE HIT]  "${key}"`);
      return cached.data;
    }
    console.log(`🔍 [CACHE MISS] "${key}"`);


    let result: Recommendation[];

    // 2. Check precomputed matrix
    if (this.cooccurrenceMatrix[key]) {
      result = this.cooccurrenceMatrix[key];
    } else {
      // 3. Fallback: compute on the fly
      result = await this.computeOnTheFly(itemName);
    }

    // 4. Store in cache
    this.cache.set(key, {
      data: result,
      ttl: Date.now() + this.CACHE_TTL_MS,
    });

    return result;
  }

  /**
   * Invalidate a single cached item (e.g. when data changes)
   */
  invalidateCache(itemName?: string) {
    if (itemName) {
      this.cache.delete(itemName.toLowerCase().trim());
      console.log(`🗑️ Cache invalidated for: ${itemName}`);
    } else {
      this.cache.clear();
      console.log('🗑️ Entire recommendation cache cleared');
    }
  }

  /**
   * Rebuild co-occurrence matrix and clear cache
   */
  async rebuildMatrix() {
    this.cache.clear();
    await this.buildCooccurrenceMatrix();
  }

  // ── Private helpers ──

  private async buildCooccurrenceMatrix() {
    const orders = await this.repository.getAllOrders();
    const matrix: CooccurrenceMatrix = {};
    const itemSet = new Set<string>();

    // Collect all unique items
    for (const order of orders) {
      for (const item of order.items) {
        itemSet.add(item.toLowerCase().trim());
      }
    }

    // Build co-occurrence map per item
    for (const item of itemSet) {
      const matchingOrders = orders.filter((o) =>
        o.items.some((i) => i.toLowerCase().trim() === item),
      );

      if (matchingOrders.length === 0) {
        matrix[item] = [];
        continue;
      }

      const cooccurrenceCount = new Map<string, number>();

      for (const order of matchingOrders) {
        for (const other of order.items) {
          const otherLower = other.toLowerCase().trim();
          if (otherLower !== item) {
            cooccurrenceCount.set(
              otherLower,
              (cooccurrenceCount.get(otherLower) || 0) + 1,
            );
          }
        }
      }

      const total = matchingOrders.length;
      const recommendations: { name: string; score: number }[] = [];

      for (const [name, count] of cooccurrenceCount) {
        recommendations.push({
          name,
          score: Math.round((count / total) * 100) / 100,
        });
      }

      matrix[item] = recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    }

    this.cooccurrenceMatrix = matrix;
  }

  private async computeOnTheFly(itemName: string): Promise<Recommendation[]> {
    const lowerInput = itemName.toLowerCase().trim();
    const matchingOrders = await this.repository.getOrdersContaining(itemName);

    if (matchingOrders.length === 0) return [];

    const cooccurrenceCount = new Map<string, number>();

    for (const order of matchingOrders) {
      for (const item of order.items) {
        const normalized = item.toLowerCase().trim();
        if (normalized !== lowerInput) {
          cooccurrenceCount.set(
            normalized,
            (cooccurrenceCount.get(normalized) || 0) + 1,
          );
        }
      }
    }

    const total = matchingOrders.length;
    const recommendations: Recommendation[] = [];

    for (const [name, count] of cooccurrenceCount) {
      recommendations.push({
        name,
        score: Math.round((count / total) * 100) / 100,
      });
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
}
