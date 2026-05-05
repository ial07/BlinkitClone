import { Product } from '@blinkit/types';
import { SupabaseService } from '../supabase/supabase.service';
export declare class ProductsRepository {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findAll(): Promise<Product[]>;
    findByName(name: string): Promise<Product | undefined>;
    private fallbackFindAll;
    private fallbackFindByName;
}
//# sourceMappingURL=products.repository.d.ts.map