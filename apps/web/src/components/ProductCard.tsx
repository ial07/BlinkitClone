'use client';

import { useState, useEffect } from 'react';
import { Product } from '@blinkit/types';
import { cartStore } from '@/store/cart';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

function formatRupee(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [added, setAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Sync quantity from cart store
  useEffect(() => {
    setQuantity(cartStore.getQuantity(product.id));
    return cartStore.subscribe(() => {
      setQuantity(cartStore.getQuantity(product.id));
    });
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 300);
    onAdd(product);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.increment(product.id);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.decrement(product.id);
  };

  return (
    /* Fixed width — 160px mobile, 180px sm+ */
    <div className="group relative flex flex-col w-[160px] sm:w-[180px] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-lg cursor-pointer">

      {/* ── Image Zone ── */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#F8F8F8]">
        {/* Fallback initial */}
        <span className="absolute inset-0 flex items-center justify-center text-5xl font-black text-zinc-200 select-none">
          {product.name.charAt(0)}
        </span>

        {/* Product image */}
        {!imgFailed && (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="relative z-10 h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        )}

        {/* Delivery badge */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm px-1.5 py-0.5 shadow-sm">
          <svg
            width="9" height="9" viewBox="0 0 24 24" fill="none"
            stroke="#0C831F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-[9px] font-bold text-zinc-700 leading-none">8 MIN</span>
        </div>
      </div>

      {/* ── Content Zone ── */}
      <div className="flex flex-1 flex-col px-3 py-2.5">
        {/* Product name — max 2 lines, consistent height */}
        <h3
          className="mb-0.5 text-[13px] font-semibold leading-[1.35] text-zinc-800"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7em', /* reserve exactly 2 lines */
          }}
        >
          {product.name}
        </h3>

        {/* Subtext */}
        <p className="mb-3 text-[11px] text-zinc-400">1 unit</p>

        {/* ── Price + Button ── always at bottom */}
        <div className="mt-auto flex items-center justify-between gap-2">
          {/* Price */}
          <span className="text-[14px] font-bold leading-none text-zinc-900">
            {formatRupee(product.price)}
          </span>

          {/* Quantity toggle */}
          {quantity === 0 ? (
            <button
              id={`add-btn-${product.id}`}
              onClick={handleAddToCart}
              className={`flex h-8 w-[64px] shrink-0 items-center justify-center rounded-lg border-2 border-[#0C831F] bg-white text-xs font-bold text-[#0C831F] transition-all hover:bg-[#0C831F] hover:text-white active:scale-90 ${
                added ? 'animate-bounce-in' : ''
              }`}
            >
              ADD
            </button>
          ) : (
            <div className="flex h-8 w-[72px] shrink-0 animate-scale-in items-center overflow-hidden rounded-lg bg-[#0C831F]">
              <button
                onClick={handleDecrement}
                className="flex h-full flex-1 items-center justify-center text-sm font-bold text-white transition-colors hover:bg-[#0a6e19]"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[20px] text-center text-xs font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="flex h-full flex-1 items-center justify-center text-sm font-bold text-white transition-colors hover:bg-[#0a6e19]"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
