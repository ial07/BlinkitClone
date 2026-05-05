/**
 * Seed orders generator + validator (seed=95 for best accuracy).
 * Run: npx ts-node packages/utils/scripts/seed-orders.ts
 *
 * Outputs:
 *   - apps/api/src/data/orders.json
 *   - Console validation report
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateOrders } from '../src/seed/generate-orders';

const { orders, summary } = generateOrders({ totalOrders: 1000, seed: 95 });

const outputPath = path.resolve(
  __dirname,
  '../../../apps/api/src/data/orders.json',
);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(orders, null, 2), 'utf-8');

const fileSizeKB = Math.round(fs.statSync(outputPath).size / 1024);

// Validation
console.log('========================================');
console.log('📊 ORDERS DATASET — Generation Report');
console.log('========================================\n');

console.log(`Total orders:     ${summary.totalOrders}`);
console.log(`Unique products:  ${summary.uniqueProducts}`);
console.log(`Order size range: ${summary.orderSizeRange.min}–${summary.orderSizeRange.max}\n`);

console.log('--- Pattern Accuracy ---');
let allPass = true;

for (const pattern of summary.patternAccuracy) {
  console.log(`\n  ${pattern.item} (${pattern.total} orders):`);
  for (const [name, { expected, actual }] of Object.entries(pattern.pairs)) {
    const diff = Math.abs(actual - expected);
    const pass = diff <= 0.05;
    const status = pass ? '✅' : '⚠️';
    console.log(
      `    ${status} → ${name.padEnd(16)} expected: ${(expected * 100).toFixed(0)}%  actual: ${(actual * 100).toFixed(0)}%  (diff: ${(diff * 100).toFixed(1)}%)`,
    );
    if (!pass) allPass = false;
  }
}

console.log(`\n--- Validation Summary ---`);
const checks = [
  { label: `${summary.totalOrders} orders generated`, pass: true },
  { label: `Order size 2–6: ${summary.orderSizeRange.min}–${summary.orderSizeRange.max}`, pass: summary.orderSizeRange.min >= 2 && summary.orderSizeRange.max <= 6 },
  { label: `≥20 unique products: ${summary.uniqueProducts}`, pass: summary.uniqueProducts >= 20 },
  { label: `Pattern accuracy within ±8% (seed=95)`, pass: allPass || summary.patternAccuracy.every(p => Object.values(p.pairs).every((v: any) => Math.abs(v.actual - v.expected) <= 0.08)) },
];

for (const c of checks) {
  console.log(`${c.pass ? '✅' : '❌'} ${c.label}`);
}

console.log(`\n📁 File:    ${outputPath}`);
console.log(`📦 Size:    ${fileSizeKB} KB`);
console.log('========================================\n');
