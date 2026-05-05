import { Order } from '@blinkit/types';
interface GenerateOrdersOptions {
    totalOrders: number;
    seed?: number;
}
interface PatternAccuracyEntry {
    item: string;
    total: number;
    pairs: Record<string, {
        expected: number;
        actual: number;
    }>;
}
interface GenerationSummary {
    totalOrders: number;
    uniqueProducts: number;
    patternAccuracy: PatternAccuracyEntry[];
    orderSizeRange: {
        min: number;
        max: number;
    };
}
export declare function generateOrders(options?: GenerateOrdersOptions): {
    orders: Order[];
    summary: GenerationSummary;
};
export {};
//# sourceMappingURL=generate-orders.d.ts.map