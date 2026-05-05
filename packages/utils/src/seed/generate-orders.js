"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrders = generateOrders;
/**
 * Deterministic seeded PRNG (Mulberry32).
 * Same seed always produces the same sequence.
 */
function mulberry32(seed) {
    var s = seed | 0;
    return function () {
        s = (s + 0x6d2b79f5) | 0;
        var t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
var ALL_PRODUCTS = [
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
var PATTERNS = [
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
function pickRandom(arr, rand) {
    return arr[Math.floor(rand() * arr.length)];
}
var CANONICAL_SEED = 42;
function generateOrders(options) {
    if (options === void 0) { options = { totalOrders: 1000, seed: CANONICAL_SEED }; }
    var totalOrders = options.totalOrders, _a = options.seed, seed = _a === void 0 ? CANONICAL_SEED : _a;
    var rand = mulberry32(seed);
    var orders = [];
    // Strategy: Each pattern gets exactly ordersPerPattern orders.
    // Each order ALWAYS contains the anchor item.
    // Each pair is independently included via its probability.
    // Then we add 1-3 random filler items from non-anchor, non-pair products.
    // Total items = 1 (anchor) + (selected pairs) + (1-3 fillers) → ensures 2-6.
    var ordersPerPattern = Math.floor(totalOrders / PATTERNS.length);
    var orderId = 0;
    for (var _i = 0, PATTERNS_1 = PATTERNS; _i < PATTERNS_1.length; _i++) {
        var pattern = PATTERNS_1[_i];
        var _loop_1 = function (i) {
            orderId++;
            // Always include anchor
            var items = new Set();
            items.add(pattern.anchor);
            // Apply pair probabilities
            for (var _b = 0, _c = pattern.pairs; _b < _c.length; _b++) {
                var pair = _c[_b];
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
            var pairNames = new Set(pattern.pairs.map(function (p) { return p.name; }));
            pairNames.add(pattern.anchor);
            var fillPool = ALL_PRODUCTS.filter(function (p) { return !pairNames.has(p); });
            var fillerCount = Math.floor(rand() * 3); // 0, 1, or 2
            var shuffled = __spreadArray([], fillPool, true).sort(function () { return rand() - 0.5; });
            for (var fi = 0; fi < Math.min(fillerCount, shuffled.length); fi++) {
                items.add(shuffled[fi]);
            }
            var finalItems = Array.from(items).sort();
            orders.push({
                id: "order-".concat(String(orderId).padStart(4, '0')),
                items: finalItems,
            });
        };
        for (var i = 0; i < ordersPerPattern; i++) {
            _loop_1(i);
        }
    }
    var _loop_2 = function () {
        orderId++;
        var itemCount = 2 + Math.floor(rand() * 5); // 2-6 items
        var items = new Set();
        for (var i = 0; i < itemCount; i++) {
            items.add(pickRandom(ALL_PRODUCTS, rand));
        }
        var finalItems = Array.from(items);
        if (finalItems.length < 2) {
            var extras = ALL_PRODUCTS.filter(function (p) { return !items.has(p); });
            if (extras.length > 0)
                finalItems.push(pickRandom(extras, rand));
        }
        orders.push({
            id: "order-".concat(String(orderId).padStart(4, '0')),
            items: finalItems,
        });
    };
    // Fill remaining with random 2-6 items
    while (orders.length < totalOrders) {
        _loop_2();
    }
    // Calculate pattern accuracy — count only among the exact pattern-generated orders
    var patternAccuracy = PATTERNS.map(function (pattern, pi) {
        // The pattern-generated orders are contiguous blocks of `ordersPerPattern`
        var start = pi * ordersPerPattern;
        var end = start + ordersPerPattern;
        var patternOrders = orders.slice(start, end);
        var total = patternOrders.length;
        var pairs = {};
        var _loop_3 = function (pair) {
            var count = patternOrders.filter(function (o) { return o.items.includes(pair.name); }).length;
            pairs[pair.name] = {
                expected: pair.probability,
                actual: total > 0 ? Math.round((count / total) * 100) / 100 : 0,
            };
        };
        for (var _i = 0, _a = pattern.pairs; _i < _a.length; _i++) {
            var pair = _a[_i];
            _loop_3(pair);
        }
        return { item: pattern.anchor, total: total, pairs: pairs };
    });
    // Count unique products
    var productSet = new Set();
    orders.forEach(function (o) { return o.items.forEach(function (i) { return productSet.add(i); }); });
    // Order size range
    var sizes = orders.map(function (o) { return o.items.length; });
    var summary = {
        totalOrders: orders.length,
        uniqueProducts: productSet.size,
        patternAccuracy: patternAccuracy,
        orderSizeRange: {
            min: Math.min.apply(Math, sizes),
            max: Math.max.apply(Math, sizes),
        },
    };
    return { orders: orders, summary: summary };
}
// CLI runner — always uses CANONICAL_SEED for reproducibility
if (require.main === module) {
    var _a = generateOrders({ totalOrders: 1000, seed: CANONICAL_SEED }), orders = _a.orders, summary = _a.summary;
    console.log(JSON.stringify({ orders: orders, summary: summary }, null, 2));
}
//# sourceMappingURL=generate-orders.js.map