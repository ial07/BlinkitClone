export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export { generateOrders } from './seed/generate-orders';
