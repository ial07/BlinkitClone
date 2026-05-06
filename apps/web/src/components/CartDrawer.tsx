'use client';

import { useEffect, useState } from 'react';
import { cartStore, CartItem } from '@/store/cart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) setIsRendered(true);
  }, [isOpen]);

  useEffect(() => {
    setItems(cartStore.getItems());
    setTotal(cartStore.getTotal());
    return cartStore.subscribe(() => {
      setItems(cartStore.getItems());
      setTotal(cartStore.getTotal());
    });
  }, []);

  const handleAnimationEnd = () => {
    if (!isOpen) setIsRendered(false);
  };

  if (!isRendered) return null;

  const handlingCharge = 2;
  const deliveryCharge = 0; // FREE
  const grandTotal = total > 0 ? total + handlingCharge + deliveryCharge : 0;
  const mockSavings = 95; // Mock value to match screenshot

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-[#F3F4F6] transition-transform duration-300 sm:w-[400px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onTransitionEnd={handleAnimationEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1 text-zinc-700 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <h2 className="text-[17px] font-bold text-zinc-900">My Cart</h2>
          </div>
          <button className="flex items-center gap-1 text-[13px] font-bold text-[#0C831F]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" x2="12" y1="2" y2="15"/>
            </svg>
            Share
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center bg-white p-6 text-center">
            <div className="mb-4 text-6xl">🛒</div>
            <h3 className="text-lg font-bold text-zinc-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-zinc-500">Let's add some items!</p>
            <button onClick={onClose} className="mt-6 rounded-lg bg-[#0C831F] px-6 py-3 font-bold text-white transition-colors hover:bg-[#0a6e19]">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4">
            {/* Savings Banner */}
            <div className="mb-3 flex items-center justify-between rounded-lg bg-[#E8F3FF] px-4 py-3">
              <span className="text-[13px] font-bold text-[#1D4ED8]">Your total savings</span>
              <span className="text-[13px] font-bold text-[#1D4ED8]">₹{mockSavings}</span>
            </div>

            {/* Delivery Banner */}
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF6F3]">
                <span className="text-xl">⏱️</span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-zinc-900">Delivery in 17 minutes</h3>
                <p className="text-[12px] text-zinc-500">Shipment of {items.length} items</p>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-4 flex flex-col rounded-xl bg-white shadow-sm overflow-hidden">
              {items.map((item, index) => (
                <div key={item.product.id} className={`flex items-start gap-3 p-4 ${index !== items.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                  {/* Image */}
                  <div className="h-[70px] w-[70px] shrink-0 rounded-lg border border-zinc-100 bg-white p-1">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-50 text-xl font-bold text-zinc-300">
                        {item.product.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-center min-h-[70px]">
                    <h4 className="text-[13px] font-medium leading-snug text-zinc-800 line-clamp-2">
                      {item.product.name}
                    </h4>
                    <span className="mt-1 text-[12px] text-zinc-500">1 unit</span>
                    <span className="mt-1 text-[14px] font-bold text-zinc-900">₹{item.product.price}</span>
                  </div>

                  {/* Increment/Decrement */}
                  <div className="flex h-9 shrink-0 items-center justify-between rounded-md bg-[#0C831F] px-1 text-white shadow-sm self-center">
                    <button
                      onClick={() => cartStore.decrement(item.product.id)}
                      className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-white/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                    </button>
                    <span className="w-6 text-center text-[13px] font-bold">{item.quantity}</span>
                    <button
                      onClick={() => cartStore.increment(item.product.id)}
                      className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-white/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="rounded-xl bg-white p-4 shadow-sm mb-6">
              <h3 className="mb-3 text-[14px] font-bold text-zinc-900">Bill details</h3>
              <div className="flex flex-col gap-2 text-[13px]">
                <div className="flex justify-between text-zinc-600">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                    Items total
                    <span className="ml-1 rounded bg-[#E8F3FF] px-1 text-[10px] font-bold text-[#1D4ED8]">Saved ₹{mockSavings}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-400 line-through">₹{total + mockSavings}</span>
                    <span className="font-medium text-zinc-800">₹{total}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-zinc-600">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Delivery charge
                  </div>
                  <span className="font-bold text-[#1D4ED8]">FREE</span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Handling charge
                  </div>
                  <span className="font-medium text-zinc-800">₹{handlingCharge}</span>
                </div>

                <div className="mt-2 flex justify-between border-t border-zinc-100 pt-3 text-[14px] font-bold text-zinc-900">
                  <span>Grand total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 z-10">
            <button className="flex w-full items-center justify-between rounded-xl bg-[#0C831F] px-4 py-3 text-white transition-colors hover:bg-[#0a6e19] active:scale-95">
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[15px] font-bold">₹{grandTotal}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">Total</span>
              </div>
              <div className="flex items-center gap-1 text-[15px] font-bold">
                Login to Proceed
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
