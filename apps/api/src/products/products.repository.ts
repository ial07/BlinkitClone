import { Injectable } from '@nestjs/common';
import { Product } from '@blinkit/types';
import { SupabaseService } from '../supabase/supabase.service';
import { products as productSeed } from '../data/products';

@Injectable()
export class ProductsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(): Promise<Product[]> {
    // Supabase mode
    if (this.supabase.isConnected()) {
      const { data, error } = await this.supabase
        .getClient()!
        .from('products')
        .select('id, name, price, image_url')
        .order('name');

      if (error) {
        console.error('❌ Supabase products query error:', error.message);
        return this.fallbackFindAll();
      }

      return data as Product[];
    }

    // In-memory fallback
    return this.fallbackFindAll();
  }

  async findByName(name: string): Promise<Product | undefined> {
    if (this.supabase.isConnected()) {
      const { data, error } = await this.supabase
        .getClient()!
        .from('products')
        .select('id, name, price, image_url')
        .ilike('name', name)
        .single();

      if (error) return undefined;
      return data as Product;
    }

    return this.fallbackFindByName(name);
  }

  // ── In-memory fallbacks ──
  private fallbackFindAll(): Product[] {
    return productSeed;
  }

  private fallbackFindByName(name: string): Product | undefined {
    return productSeed.find(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );
  }
}
