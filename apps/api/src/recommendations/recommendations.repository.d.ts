import { Order } from '@blinkit/types';
import { OrdersRepository } from '../orders/orders.repository';
export declare class RecommendationsRepository {
    private readonly ordersRepository;
    constructor(ordersRepository: OrdersRepository);
    getOrdersContaining(itemName: string): Promise<Order[]>;
}
//# sourceMappingURL=recommendations.repository.d.ts.map