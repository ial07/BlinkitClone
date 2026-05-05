"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrders = void 0;
exports.formatPrice = formatPrice;
exports.generateId = generateId;
function formatPrice(price) {
    return "\u20B9".concat(price.toFixed(2));
}
function generateId() {
    return Math.random().toString(36).substring(2, 15);
}
var generate_orders_1 = require("./seed/generate-orders");
Object.defineProperty(exports, "generateOrders", { enumerable: true, get: function () { return generate_orders_1.generateOrders; } });
//# sourceMappingURL=index.js.map