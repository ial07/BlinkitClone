import { Product } from '@blinkit/types';
export interface CartItem {
    product: Product;
    quantity: number;
}
export declare const cartStore: {
    getItems(): CartItem[];
    getCount(): number;
    addItem(product: Product): void;
    increment(productId: string): void;
    decrement(productId: string): void;
    getQuantity(productId: string): number;
    clear(): void;
    subscribe(listener: () => void): () => void;
};
//# sourceMappingURL=cart.d.ts.map