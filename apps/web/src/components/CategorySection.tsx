'use client';

import { useEffect, useState } from 'react';

const CATEGORIES = [
  { id: 1, name: 'Groceries', emoji: '🌾', bg: 'bg-amber-50', emojiBg: 'bg-amber-100' },
  { id: 2, name: 'Vegetables', emoji: '🥕', bg: 'bg-orange-50', emojiBg: 'bg-orange-100' },
  { id: 3, name: 'Personal Care', emoji: '🧴', bg: 'bg-sky-50', emojiBg: 'bg-sky-100' },
  { id: 4, name: 'Household', emoji: '🧹', bg: 'bg-purple-50', emojiBg: 'bg-purple-100' },
  { id: 5, name: 'Home & Kitchen', emoji: '🏠', bg: 'bg-yellow-50', emojiBg: 'bg-yellow-100' },
  { id: 6, name: 'Dairy', emoji: '🥛', bg: 'bg-cyan-50', emojiBg: 'bg-cyan-100' },
  { id: 7, name: 'Snacks', emoji: '🍿', bg: 'bg-rose-50', emojiBg: 'bg-rose-100' },
  { id: 8, name: 'Beverages', emoji: '🧃', bg: 'bg-teal-50', emojiBg: 'bg-teal-100' },
  { id: 9, name: 'Baby Care', emoji: '👶', bg: 'bg-pink-50', emojiBg: 'bg-pink-100' },
  { id: 10, name: 'Pet Supplies', emoji: '🐕', bg: 'bg-lime-50', emojiBg: 'bg-lime-100' },
  { id: 11, name: 'Electronics', emoji: '🔌', bg: 'bg-indigo-50', emojiBg: 'bg-indigo-100' },
];

export function CategorySection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="mx-auto mt-6 max-w-7xl sm:mt-8">
      {/* Label "Categories" — kayak Blinkit asli */}
      <div className="mb-4 px-4">
        <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">Categories</h2>
      </div>

      {/* Horizontal Scroll — mirip Blinkit */}
      <div
        className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
        }}
      >
        {CATEGORIES.map((cat, index) => (
          <div
            key={cat.id}
            className="group flex cursor-pointer flex-col items-center gap-1.5 snap-start shrink-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.3s ease-out, transform 0.3s ease-out`,
              transitionDelay: `${index * 40}ms`,
            }}
          >
            {/* Circle icon — kayak Blinkit */}
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${cat.bg} transition-all duration-200 group-hover:shadow-md group-hover:scale-105 sm:h-20 sm:w-20`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full ${cat.emojiBg} text-xl shadow-sm sm:text-2xl`}
              >
                {cat.emoji}
              </span>
            </div>
            {/* Label — langsung di bawah icon, centered */}
            <span className="max-w-[72px] text-center text-[11px] font-semibold text-zinc-700 leading-tight sm:max-w-[80px] sm:text-xs">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
