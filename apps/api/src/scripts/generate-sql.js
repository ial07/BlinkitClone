"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var products_1 = require("../data/products");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dir = __dirname;
var isWin = dir.startsWith('/');
// Load orders.json directly
var ordersPath = path_1.default.join(dir, '..', 'data', 'orders.json');
var ordersRaw = fs_1.default.readFileSync(ordersPath, 'utf-8');
var orders = JSON.parse(ordersRaw);
// ── Generate Product SQL ──
var productSql = '-- Seed: products\n\n';
productSql += 'TRUNCATE TABLE products CASCADE;\n\n';
productSql += 'INSERT INTO products (name, price, image_url) VALUES\n';
var productRows = products_1.products.map(function (p, i) {
    var comma = i < products_1.products.length - 1 ? ',' : ';';
    var escapedName = p.name.replace(/'/g, "''");
    return "  ('".concat(escapedName, "', ").concat(p.price, ", '").concat(p.image_url, "')").concat(comma);
});
productSql += productRows.join('\n') + '\n';
// Check if we're running from dist or src
var dbDir;
var distIndex = dir.indexOf('dist');
if (distIndex !== -1) {
    dbDir = path_1.default.resolve(path_1.default.join(dir.substring(0, distIndex), 'src', 'database'));
}
else {
    dbDir = path_1.default.join(dir, '..', 'database');
}
fs_1.default.mkdirSync(dbDir, { recursive: true });
var productPath = path_1.default.join(dbDir, 'seed-products.sql');
fs_1.default.writeFileSync(productPath, productSql);
console.log("\u2705 seed-products.sql (".concat(products_1.products.length, " products)"));
// ── Generate Order SQL ──
var orderSql = '-- Seed: orders\n\n';
orderSql += 'TRUNCATE TABLE orders CASCADE;\n\n';
orderSql += 'INSERT INTO orders (items) VALUES\n';
var orderRows = orders.map(function (o, i) {
    var comma = i < orders.length - 1 ? ',' : ';';
    var items = o.items.map(function (item) { return "'".concat(item.replace(/'/g, "''"), "'"); }).join(', ');
    return "  (ARRAY[".concat(items, "])").concat(comma);
});
orderSql += orderRows.join('\n') + '\n';
var orderPath = path_1.default.join(dbDir, 'seed-orders.sql');
fs_1.default.writeFileSync(orderPath, orderSql);
console.log("\u2705 seed-orders.sql (".concat(orders.length, " orders)"));
// Also update the src/database directory
var srcDbDir = path_1.default.join(dir, '..', 'database');
fs_1.default.mkdirSync(srcDbDir, { recursive: true });
fs_1.default.writeFileSync(path_1.default.join(srcDbDir, 'seed-products.sql'), productSql);
fs_1.default.writeFileSync(path_1.default.join(srcDbDir, 'seed-orders.sql'), orderSql);
console.log('✅ Also copied to src/database/');
//# sourceMappingURL=generate-sql.js.map