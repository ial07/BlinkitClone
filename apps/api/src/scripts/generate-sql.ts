import { products } from '../data/products';
import fs from 'fs';
import path from 'path';

const dir = __dirname;
const isWin = dir.startsWith('/');

// Load orders.json directly
const ordersPath = path.join(dir, '..', 'data', 'orders.json');
const ordersRaw = fs.readFileSync(ordersPath, 'utf-8');
const orders: { id: string; items: string[] }[] = JSON.parse(ordersRaw);

// ── Generate Product SQL ──
let productSql = '-- Seed: products\n\n';
productSql += 'TRUNCATE TABLE products CASCADE;\n\n';
productSql += 'INSERT INTO products (name, price, image_url) VALUES\n';

const productRows = products.map((p, i) => {
  const comma = i < products.length - 1 ? ',' : ';';
  const escapedName = p.name.replace(/'/g, "''");
  return `  ('${escapedName}', ${p.price}, '${p.image_url}')${comma}`;
});
productSql += productRows.join('\n') + '\n';

// Check if we're running from dist or src
let dbDir: string;
const distIndex = dir.indexOf('dist');
if (distIndex !== -1) {
  dbDir = path.resolve(path.join(dir.substring(0, distIndex), 'src', 'database'));
} else {
  dbDir = path.join(dir, '..', 'database');
}
fs.mkdirSync(dbDir, { recursive: true });

const productPath = path.join(dbDir, 'seed-products.sql');
fs.writeFileSync(productPath, productSql);
console.log(`✅ seed-products.sql (${products.length} products)`);

// ── Generate Order SQL ──
let orderSql = '-- Seed: orders\n\n';
orderSql += 'TRUNCATE TABLE orders CASCADE;\n\n';
orderSql += 'INSERT INTO orders (items) VALUES\n';

const orderRows = orders.map((o, i) => {
  const comma = i < orders.length - 1 ? ',' : ';';
  const items = o.items.map((item: string) => `'${item.replace(/'/g, "''")}'`).join(', ');
  return `  (ARRAY[${items}])${comma}`;
});
orderSql += orderRows.join('\n') + '\n';

const orderPath = path.join(dbDir, 'seed-orders.sql');
fs.writeFileSync(orderPath, orderSql);
console.log(`✅ seed-orders.sql (${orders.length} orders)`);

// Also update the src/database directory
const srcDbDir = path.join(dir, '..', 'database');
fs.mkdirSync(srcDbDir, { recursive: true });
fs.writeFileSync(path.join(srcDbDir, 'seed-products.sql'), productSql);
fs.writeFileSync(path.join(srcDbDir, 'seed-orders.sql'), orderSql);
console.log('✅ Also copied to src/database/');
