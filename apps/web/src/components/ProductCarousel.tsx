'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Product } from '@blinkit/types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  onAdd: (product: Product) => void;
}

const SCROLL_AMOUNT = 800; // px per click — scroll ~4 cards at once

export function ProductCarousel({ title, products, onAdd }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isVisible, setIsVisible]           = useState(false);

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(syncScrollState, 80);
    return () => clearTimeout(t);
  }, [syncScrollState, products]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncScrollState, { passive: true });
    const ro = new ResizeObserver(syncScrollState);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', syncScrollState); ro.disconnect(); };
  }, [syncScrollState]);

  const scrollBy = useCallback((dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section
      className="mt-8 mx-auto max-w-7xl"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(10px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }}
    >
      {/* ── Section Header (title + see all only) ── */}
      <div className="mb-4 flex items-center justify-between gap-4 px-4 md:px-10 min-w-0">
        <h2 className="flex-1 min-w-0 truncate text-[18px] font-bold tracking-tight text-zinc-900">
          {title}
        </h2>
        <button className="shrink-0 text-sm font-semibold text-[#0C831F] transition-colors hover:text-[#0a6e19]">
          see all
        </button>
      </div>

      {/* ── Scroll Track with Blinkit-style floating nav buttons ── */}
      <div className="relative">

        {/* ── LEFT BUTTON — Blinkit style: small circle, left edge, vertically centered ── */}
        {canScrollLeft && (
          <button
            onClick={() => scrollBy('left')}
            aria-label="Scroll left"
            className="
              hidden md:flex
              absolute left-0 top-1/2 z-20 -translate-y-1/2
              h-10 w-10 items-center justify-center
              rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]
              border border-zinc-100
              text-zinc-600
              transition-all duration-150
              hover:shadow-[0_4px_12px_rgba(0,0,0,0.22)] hover:scale-105
              active:scale-95
            "
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* ── RIGHT BUTTON — Blinkit style: small circle, right edge, vertically centered ── */}
        {canScrollRight && (
          <button
            onClick={() => scrollBy('right')}
            aria-label="Scroll right"
            className="
              hidden md:flex
              absolute right-0 top-1/2 z-20 -translate-y-1/2
              h-10 w-10 items-center justify-center
              rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]
              border border-zinc-100
              text-zinc-600
              transition-all duration-150
              hover:shadow-[0_4px_12px_rgba(0,0,0,0.22)] hover:scale-105
              active:scale-95
            "
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}



        {/* ── Scrollable row ── */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 md:px-10 pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start shrink-0">
              <ProductCard product={product} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
