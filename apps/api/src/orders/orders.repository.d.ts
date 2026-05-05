import { Order } from '@blinkit/types';
import { SupabaseService } from '../supabase/supabase.service';
export declare class OrdersRepository {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    findAll(): Promise<Order[]>;
    findByItem(itemName: string): Promise<Order[]>;
    private fallbackFindAll;
    private fallbackFindByItem;
}
//# sourceMappingURL=orders.repository.d.ts.map