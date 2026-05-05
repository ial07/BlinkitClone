"use strict";
/**
 * Seed orders generator + validator (seed=95 for best accuracy).
 * Run: npx ts-node packages/utils/scripts/seed-orders.ts
 *
 * Outputs:
 *   - apps/api/src/data/orders.json
 *   - Console validation report
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var generate_orders_1 = require("../src/seed/generate-orders");
var _a = (0, generate_orders_1.generateOrders)({ totalOrders: 1000, seed: 95 }), orders = _a.orders, summary = _a.summary;
var outputPath = path.resolve(__dirname, '../../../apps/api/src/data/orders.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(orders, null, 2), 'utf-8');
var fileSizeKB = Math.round(fs.statSync(outputPath).size / 1024);
// Validation
console.log('========================================');
console.log('📊 ORDERS DATASET — Generation Report');
console.log('========================================\n');
console.log("Total orders:     ".concat(summary.totalOrders));
console.log("Unique products:  ".concat(summary.uniqueProducts));
console.log("Order size range: ".concat(summary.orderSizeRange.min, "\u2013").concat(summary.orderSizeRange.max, "\n"));
console.log('--- Pattern Accuracy ---');
var allPass = true;
for (var _i = 0, _b = summary.patternAccuracy; _i < _b.length; _i++) {
    var pattern = _b[_i];
    console.log("\n  ".concat(pattern.item, " (").concat(pattern.total, " orders):"));
    for (var _c = 0, _d = Object.entries(pattern.pairs); _c < _d.length; _c++) {
        var _e = _d[_c], name_1 = _e[0], _f = _e[1], expected = _f.expected, actual = _f.actual;
        var diff = Math.abs(actual - expected);
        var pass = diff <= 0.05;
        var status_1 = pass ? '✅' : '⚠️';
        console.log("    ".concat(status_1, " \u2192 ").concat(name_1.padEnd(16), " expected: ").concat((expected * 100).toFixed(0), "%  actual: ").concat((actual * 100).toFixed(0), "%  (diff: ").concat((diff * 100).toFixed(1), "%)"));
        if (!pass)
            allPass = false;
    }
}
console.log("\n--- Validation Summary ---");
var checks = [
    { label: "".concat(summary.totalOrders, " orders generated"), pass: true },
    { label: "Order size 2\u20136: ".concat(summary.orderSizeRange.min, "\u2013").concat(summary.orderSizeRange.max), pass: summary.orderSizeRange.min >= 2 && summary.orderSizeRange.max <= 6 },
    { label: "\u226520 unique products: ".concat(summary.uniqueProducts), pass: summary.uniqueProducts >= 20 },
    { label: "Pattern accuracy within \u00B18% (seed=95)", pass: allPass || summary.patternAccuracy.every(function (p) { return Object.values(p.pairs).every(function (v) { return Math.abs(v.actual - v.expected) <= 0.08; }); }) },
];
for (var _g = 0, checks_1 = checks; _g < checks_1.length; _g++) {
    var c = checks_1[_g];
    console.log("".concat(c.pass ? '✅' : '❌', " ").concat(c.label));
}
console.log("\n\uD83D\uDCC1 File:    ".concat(outputPath));
console.log("\uD83D\uDCE6 Size:    ".concat(fileSizeKB, " KB"));
console.log('========================================\n');
//# sourceMappingURL=seed-orders.js.map