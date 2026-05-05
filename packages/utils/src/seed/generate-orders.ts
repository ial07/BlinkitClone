import { Order } from '@blinkit/types';

/**
 * Deterministic seeded PRNG (Mulberry32).
 * Same seed always produces the same sequence.
 */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ALL_PRODUCTS = [
  'Tea Powder',
  'Sugar',
  'Milk',
  'Coffee',
  'Biscuits',
  'Bread',
  'Butter',
  'Jam',
  'Eggs',
  'Rice',
  'Dal',
  'Cooking Oil',
  'Onions',
  'Potatoes',
  'Maggi Noodles',
  'Ketchup',
  'Cheese',
  'Cream',
  'Salt',
  'Cooking Soda',
  'Turmeric Powder',
  'Chili Powder',
  'Coriander Powder',
  'Cumin Seeds',
  'Mixed Fruit Jam',
  'Peanut Butter',
  'Honey',
  'Coconut Oil',
  'Green Tea',
  'Corn Flakes',
];

interface CoOccurrencePattern {
  anchor: string;
  pairs: Array<{ name: string; probability: number }>;
}

const PATTERNS: CoOccurrencePattern[] = [
  {
    anchor: 'Tea Powder',
    pairs: [
      { name: 'Sugar', probability: 0.78 },
      { name: 'Milk', probability: 0.65 },
      { name: 'Biscuits', probability: 0.52 },
    ],
  },
  {
    anchor: 'Coffee',
    pairs: [
      { name: 'Milk', probability: 0.72 },
      { name: 'Sugar', probability: 0.68 },
      { name: 'Cream', probability: 0.45 },
    ],
  },
  {
    anchor: 'Bread',
    pairs: [
      { name: 'Butter', probability: 0.75 },
      { name: 'Jam', probability: 0.60 },
      { name: 'Eggs', probability: 0.48 },
    ],
  },
  {
    anchor: 'Rice',
    pairs: [
      { name: 'Dal', probability: 0.70 },
      { name: 'Cooking Oil', probability: 0.55 },
      { name: 'Onions', probability: 0.50 },
    ],
  },
  {
    anchor: 'Maggi Noodles',
    pairs: [
      { name: 'Eggs', probability: 0.60 },
      { name: 'Ketchup', probability: 0.50 },
      { name: 'Cheese', probability: 0.40 },
    ],
  },
];

function pickRandom<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

interface GenerateOrdersOptions {
  totalOrders: number;
  seed?: number;
}

interface PatternAccuracyEntry {
  item: string;
  total: number;
  pairs: Record<string, { expected: number; actual: number }>;
}

interface GenerationSummary {
  totalOrders: number;
  uniqueProducts: number;
  patternAccuracy: PatternAccuracyEntry[];
  orderSizeRange: { min: number; max: number };
}

const CANONICAL_SEED = 42;

export function generateOrders(
  options: GenerateOrdersOptions = { totalOrders: 1000, seed: CANONICAL_SEED },
): { orders: Order[]; summary: GenerationSummary } {
  const { totalOrders, seed = CANONICAL_SEED } = options;
  const rand = mulberry32(seed);
  const orders: Order[] = [];

  // Strategy: Each pattern gets exactly ordersPerPattern orders.
  // Each order ALWAYS contains the anchor item.
  // Each pair is independently included via its probability.
  // Then we add 1-3 random filler items from non-anchor, non-pair products.
  // Total items = 1 (anchor) + (selected pairs) + (1-3 fillers) → ensures 2-6.

  const ordersPerPattern = Math.floor(totalOrders / PATTERNS.length);
  let orderId = 0;

  for (const pattern of PATTERNS) {
    for (let i = 0; i < ordersPerPattern; i++) {
      orderId++;

      // Always include anchor
      const items = new Set<string>();
      items.add(pattern.anchor);

      // Apply pair probabilities
      for (const pair of pattern.pairs) {
        if (rand() < pair.probability) {
          items.add(pair.name);
        }
      }

      // If only the anchor was selected (no pairs hit), force the first pair
      if (items.size === 1 && pattern.pairs.length > 0) {
        items.add(pattern.pairs[0].name);
      }

      // Add 0-2 filler items from products NOT in the anchor/pairs set
      // Total will be between 2-6
      const pairNames = new Set(pattern.pairs.map((p) => p.name));
      pairNames.add(pattern.anchor);
      const fillPool = ALL_PRODUCTS.filter((p) => !pairNames.has(p));

      const fillerCount = Math.floor(rand() * 3); // 0, 1, or 2
      const shuffled = [...fillPool].sort(() => rand() - 0.5);
      for (let fi = 0; fi < Math.min(fillerCount, shuffled.length); fi++) {
        items.add(shuffled[fi]);
      }

      const finalItems = Array.from(items).sort();
      orders.push({
        id: `order-${String(orderId).padStart(4, '0')}`,
        items: finalItems,
      });
    }
  }

  // Fill remaining with random 2-6 items
  while (orders.length < totalOrders) {
    orderId++;
    const itemCount = 2 + Math.floor(rand() * 5); // 2-6 items
    const items = new Set<string>();
    for (let i = 0; i < itemCount; i++) {
      items.add(pickRandom(ALL_PRODUCTS, rand));
    }
    const finalItems = Array.from(items);
    if (finalItems.length < 2) {
      const extras = ALL_PRODUCTS.filter((p) => !items.has(p));
      if (extras.length > 0) finalItems.push(pickRandom(extras, rand));
    }
    orders.push({
      id: `order-${String(orderId).padStart(4, '0')}`,
      items: finalItems,
    });
  }

  // Calculate pattern accuracy — count only among the exact pattern-generated orders
  const patternAccuracy: PatternAccuracyEntry[] = PATTERNS.map((pattern, pi) => {
    // The pattern-generated orders are contiguous blocks of `ordersPerPattern`
    const start = pi * ordersPerPattern;
    const end = start + ordersPerPattern;
    const patternOrders = orders.slice(start, end);
    const total = patternOrders.length;

    const pairs: Record<string, { expected: number; actual: number }> = {};
    for (const pair of pattern.pairs) {
      const count = patternOrders.filter((o) => o.items.includes(pair.name)).length;
      pairs[pair.name] = {
        expected: pair.probability,
        actual: total > 0 ? Math.round((count / total) * 100) / 100 : 0,
      };
    }
    return { item: pattern.anchor, total, pairs };
  });

  // Count unique products
  const productSet = new Set<string>();
  orders.forEach((o) => o.items.forEach((i) => productSet.add(i)));

  // Order size range
  const sizes = orders.map((o) => o.items.length);

  const summary: GenerationSummary = {
    totalOrders: orders.length,
    uniqueProducts: productSet.size,
    patternAccuracy,
    orderSizeRange: {
      min: Math.min(...sizes),
      max: Math.max(...sizes),
    },
  };

  return { orders, summary };
}

// CLI runner — always uses CANONICAL_SEED for reproducibility
if (require.main === module) {
  const { orders, summary } = generateOrders({ totalOrders: 1000, seed: CANONICAL_SEED });
  console.log(JSON.stringify({ orders, summary }, null, 2));
}
