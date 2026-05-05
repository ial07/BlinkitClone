'use client';

import { useEffect, useState } from 'react';
import { cartStore } from '@/store/cart';

export function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setCartCount(cartStore.getCount());
    return cartStore.subscribe(() => {
      setCartCount(cartStore.getCount());
      setAnimKey((k) => k + 1); // trigger badge animation
    });
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-100 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:gap-8">
        {/* Logo */}
        <div className="flex shrink-0 items-center border-r border-zinc-100 pr-6">
          <div className="text-3xl font-black tracking-tighter text-[#F8CB46]">
            blinkit
          </div>
          <div className="ml-1 text-xs font-bold text-zinc-800 self-end mb-1">
            clone
          </div>
        </div>

        {/* Location (Mock) */}
        <div className="hidden shrink-0 flex-col justify-center sm:flex w-48">
          <div className="text-[13px] font-extrabold text-zinc-900">
            Delivery in 8 minutes
          </div>
          <div className="truncate text-xs text-zinc-500">
            123 Mock Street, Fake City...
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="flex h-12 w-full max-w-2xl items-center rounded-xl bg-[#F8F8F8] px-4 transition-all focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#0C831F]/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-500"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder='Search "milk"'
              className="w-full bg-transparent px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
              disabled
            />
          </div>
        </div>

        {/* Cart Button */}
        <div className="shrink-0">
          <button className="relative flex h-12 items-center gap-2 rounded-xl bg-[#0C831F] px-4 text-sm font-bold text-white transition-all hover:bg-[#0a6e19] active:scale-95">
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
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span>{cartCount > 0 ? `${cartCount} Items` : 'My Cart'}</span>

            {/* Badge count indicator */}
            {cartCount > 0 && (
              <span
                key={animKey}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#F8CB46] text-[10px] font-bold text-zinc-900 animate-bounce-in shadow-sm"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
