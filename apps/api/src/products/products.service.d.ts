import { Product } from '@blinkit/types';
import { ProductsRepository } from './products.repository';
export declare class ProductsService {
    private readonly repository;
    constructor(repository: ProductsRepository);
    findAll(): Promise<Product[]>;
}
//# sourceMappingURL=products.service.d.ts.map