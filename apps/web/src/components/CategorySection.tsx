'use client';

import { useEffect, useState } from 'react';

const CATEGORIES = [
  { id: 1, name: 'Paan Corner', emoji: '🍃' },
  { id: 2, name: 'Dairy, Bread & Eggs', emoji: '🥚' },
  { id: 3, name: 'Fruits & Vegetables', emoji: '🍎' },
  { id: 4, name: 'Cold Drinks & Juices', emoji: '🥤' },
  { id: 5, name: 'Snacks & Munchies', emoji: '🍿' },
  { id: 6, name: 'Breakfast & Instant Food', emoji: '🥣' },
  { id: 7, name: 'Sweet Tooth', emoji: '🍫' },
  { id: 8, name: 'Bakery & Biscuits', emoji: '🥐' },
  { id: 9, name: 'Tea, Coffee & Milk Drinks', emoji: '☕' },
  { id: 10, name: 'Atta, Rice & Dal', emoji: '🍚' },
  { id: 11, name: 'Masala, Oil & More', emoji: '🌶️' },
  { id: 12, name: 'Sauces & Spreads', emoji: '🍯' },
  { id: 13, name: 'Chicken, Meat & Fish', emoji: '🥩' },
  { id: 14, name: 'Organic & Healthy Living', emoji: '🥗' },
  { id: 15, name: 'Baby Care', emoji: '👶' },
  { id: 16, name: 'Pharma & Wellness', emoji: '💊' },
  { id: 17, name: 'Cleaning Essentials', emoji: '🧼' },
  { id: 18, name: 'Home & Office', emoji: '🏠' },
  { id: 19, name: 'Personal Care', emoji: '🧴' },
  { id: 20, name: 'Pet Care', emoji: '🐕' },
];

export function CategorySection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 sm:mt-6">
      {/* Grid — matching Blinkit native grid layout */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
        {CATEGORIES.map((cat, index) => (
          <div
            key={cat.id}
            className="group flex cursor-pointer flex-col items-center gap-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.3s ease-out, transform 0.3s ease-out`,
              transitionDelay: `${index * 15}ms`,
            }}
          >
            {/* Rounded Box icon */}
            <div
              className="flex w-full aspect-[4/5] max-w-[80px] items-center justify-center rounded-[14px] bg-[#EEF2F5] transition-all duration-200 group-hover:shadow-sm group-hover:-translate-y-0.5"
            >
              <span className="text-3xl drop-shadow-sm sm:text-4xl">
                {cat.emoji}
              </span>
            </div>
            {/* Label — di bawah icon */}
            <span className="w-full text-center text-[10px] font-semibold leading-[1.25] text-zinc-700 sm:text-[11px]">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
