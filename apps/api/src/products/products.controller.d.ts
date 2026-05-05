import { Product } from '@blinkit/types';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<Product[]>;
}
//# sourceMappingURL=products.controller.d.ts.map