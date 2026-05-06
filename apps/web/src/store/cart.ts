import { Product } from '@blinkit/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

let cartItems: CartItem[] = [];
let listeners: Array<() => void> = [];

export const cartStore = {
  getItems(): CartItem[] {
    return [...cartItems];
  },

  getCount(): number {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotal(): number {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  },

  addItem(product: Product): void {
    const existing = cartItems.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems = [...cartItems, { product, quantity: 1 }];
    }
    listeners.forEach((fn) => fn());
  },

  increment(productId: string): void {
    const item = cartItems.find((i) => i.product.id === productId);
    if (item) {
      item.quantity += 1;
      listeners.forEach((fn) => fn());
    }
  },

  decrement(productId: string): void {
    const idx = cartItems.findIndex((i) => i.product.id === productId);
    if (idx === -1) return;
    if (cartItems[idx].quantity <= 1) {
      cartItems = cartItems.filter((i) => i.product.id !== productId);
    } else {
      cartItems[idx].quantity -= 1;
    }
    listeners.forEach((fn) => fn());
  },

  getQuantity(productId: string): number {
    const item = cartItems.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  },

  clear(): void {
    cartItems = [];
    listeners.forEach((fn) => fn());
  },

  subscribe(listener: () => void): () => void {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};
