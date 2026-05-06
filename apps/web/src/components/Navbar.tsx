'use client';

import { useEffect, useState } from 'react';
import { cartStore } from '@/store/cart';
import { CartDrawer } from './CartDrawer';

export function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setCartCount(cartStore.getCount());
    setCartTotal(cartStore.getTotal());
    return cartStore.subscribe(() => {
      setCartCount(cartStore.getCount());
      setCartTotal(cartStore.getTotal());
      setAnimKey((k) => k + 1); // trigger badge animation
    });
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-zinc-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:h-20 sm:flex-row sm:items-center sm:gap-6 lg:gap-8 sm:py-0">
          
          {/* Top Row on Mobile: Location + Profile / Desktop: Logo + Location */}
          <div className="flex items-center justify-between sm:w-auto">
            
            {/* Logo (Hidden on Mobile) */}
            <div className="hidden shrink-0 items-center sm:flex sm:border-r-2 sm:border-zinc-50 sm:pr-8">
              <div className="text-3xl font-black tracking-tighter sm:text-[34px]">
                <span className="text-[#F8CB46]">blink</span><span className="text-[#0C831F]">it</span>
              </div>
            </div>

            {/* Location (Visible on both) */}
            <div className="flex shrink-0 flex-col justify-center sm:ml-8 cursor-pointer group">
              <div className="text-[15px] sm:text-[18px] font-black text-zinc-900 tracking-tight">
                Delivery in 18 minutes
              </div>
              <div className="flex items-center gap-1 text-[13px] text-zinc-500">
                <span className="truncate max-w-[200px] sm:max-w-[250px]">157, Jodhpur Gardens, Jodhpur Park, Kolkata, West Bengal 700...</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 sm:text-zinc-400 group-hover:text-zinc-800 transition-colors">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Profile Icon (Mobile Only) */}
            <div className="shrink-0 sm:hidden">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-zinc-900 hover:bg-zinc-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5"/>
                  <path d="M20 21a8 8 0 0 0-16 0"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-1 items-center order-last sm:order-none">
            <div className="flex h-12 w-full items-center rounded-xl bg-[#F8F8F8] px-4 transition-all focus-within:shadow-md focus-within:bg-white focus-within:ring-1 focus-within:ring-zinc-200 sm:h-[46px] border border-zinc-200 sm:border-transparent focus-within:border-zinc-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-900 sm:text-zinc-500 mr-2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder='Search "bread"'
                className="w-full bg-transparent px-1 py-2 text-[15px] sm:text-[14px] text-zinc-800 outline-none placeholder:text-zinc-400"
                disabled
              />
            </div>
          </div>

          {/* Right Section (Login + Cart - Desktop Only) */}
          <div className="hidden shrink-0 items-center gap-6 sm:flex sm:ml-2">
            {/* Login text */}
            <button className="text-[15px] text-zinc-700 hover:text-zinc-900">
              Login
            </button>

            {/* Desktop Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-[46px] min-w-[100px] items-center justify-center gap-2 rounded-[10px] bg-[#0C831F] px-3 text-white transition-all hover:bg-[#0a6e19] active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="8" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              
              {cartCount > 0 ? (
                <div key={`desk-text-${animKey}`} className="flex flex-col items-start leading-[1.1] animate-scale-in">
                  <span className="text-[11px] font-bold tracking-wide">{cartCount} items</span>
                  <span className="text-[13px] font-bold tracking-wide">₹{cartTotal}</span>
                </div>
              ) : (
                <span className="text-sm font-bold tracking-wide">My Cart</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Floating Mobile Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex w-full items-center justify-between rounded-lg bg-[#0C831F] px-4 py-3 text-white shadow-lg transition-colors hover:bg-[#0a6e19] active:scale-95"
          >
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="8" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <div key={`mob-float-${animKey}`} className="flex flex-col items-start leading-tight animate-scale-in">
                <span className="text-[13px] font-bold">{cartCount} items</span>
                <span className="text-[15px] font-bold">₹ {cartTotal}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[15px] font-bold">
              View Cart
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </button>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
