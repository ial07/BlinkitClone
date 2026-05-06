import { Injectable } from '@nestjs/common';
import { Order, Product } from '@blinkit/types';
import { SupabaseService } from '../supabase/supabase.service';
import ordersData from '../data/orders.json';

@Injectable()
export class OrdersRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Order[]> {
    if (this.supabase.isConnected()) {
      const { data, error } = await this.supabase
        .getClient()!
        .from('orders')
        .select('id, items, created_at')
        .limit(10000);

      if (error) {
        console.error('❌ Supabase orders query error:', error.message);
        return this.fallbackFindAll();
      }

      if (data && data.length >= 10000) {
        console.warn(
          '⚠️  Orders query returned 10,000 rows (limit hit). ' +
          'Co-occurrence matrix may be incomplete. Consider pagination or a materialized view.',
        );
      }

      return (data || []) as Order[];
    }

    return this.fallbackFindAll();
  }

  async findByItem(itemName: string): Promise<Order[]> {
    if (this.supabase.isConnected()) {
      // Postgres array search is case-sensitive with @> or contains.
      // To be robust, we'll try to find the exact name from the product list first,
      // which is what seeded the database.
      const { data, error } = await this.supabase
        .getClient()!
        .from('orders')
        .select('id, items, created_at')
        .contains('items', [itemName])
        .limit(10000);

      if (error) {
        console.error('❌ Supabase orders query error:', error.message);
        return this.fallbackFindByItem(itemName);
      }

      // If no exact match, try fallback which is case-insensitive
      if (!data || data.length === 0) {
        return this.fallbackFindByItem(itemName);
      }

      return data as Order[];
    }

    return this.fallbackFindByItem(itemName);
  }

  // ── In-memory fallbacks ──
  private fallbackFindAll(): Order[] {
    return ordersData as Order[];
  }

  private fallbackFindByItem(itemName: string): Order[] {
    const lower = itemName.toLowerCase();
    return (ordersData as Order[]).filter((o) =>
      o.items.some((i) => i.toLowerCase() === lower),
    );
  }
}
