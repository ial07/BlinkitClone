'use client';

import { useEffect, useState } from 'react';

const GROCERY_KITCHEN = [
  { id: 1, name: 'Vegetables &\nFruits', emoji: '🥦', bg: 'bg-[#E5F3F3]' },
  { id: 2, name: 'Atta, Rice &\nDal', emoji: '🌾', bg: 'bg-[#F2F3F5]' },
  { id: 3, name: 'Oil, Ghee &\nMasala', emoji: '🛢️', bg: 'bg-[#F9F0E5]' },
  { id: 4, name: 'Dairy, Bread &\nEggs', emoji: '🥚', bg: 'bg-[#E9F3F8]' },
  { id: 5, name: 'Bakery &\nBiscuits', emoji: '🥐', bg: 'bg-[#F2F6ED]' },
  { id: 6, name: 'Dry Fruits &\nCereals', emoji: '🥜', bg: 'bg-[#F6EFEA]' },
  { id: 7, name: 'Chicken, Meat &\nFish', emoji: '🥩', bg: 'bg-[#FCEAE9]' },
  { id: 8, name: 'Kitchenware &\nAppliances', emoji: '🍳', bg: 'bg-[#EBF1F4]' },
];

const SNACKS_DRINKS = [
  { id: 9, name: 'Chips &\nNamkeen', emoji: '🍿', bg: 'bg-[#EAF5F2]' },
  { id: 10, name: 'Sweets &\nChocolates', emoji: '🍫', bg: 'bg-[#F6F0E6]' },
  { id: 11, name: 'Drinks &\nJuices', emoji: '🥤', bg: 'bg-[#EAF3FA]' },
  { id: 12, name: 'Tea, Coffee &\nMilk Drinks', emoji: '☕', bg: 'bg-[#E6F3E6]' },
];

export function CategorySection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const renderCard = (cat: any, index: number) => (
    <div
      key={cat.id}
      className="group flex cursor-pointer flex-col items-center gap-3"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.4s ease-out, transform 0.4s ease-out`,
        transitionDelay: `${index * 25}ms`,
      }}
    >
      {/* Large Image Box */}
      <div
        className={`flex w-full aspect-square items-center justify-center rounded-[20px] ${cat.bg} transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1`}
      >
        <span className="text-6xl drop-shadow-md sm:text-7xl lg:text-[80px]">
          {cat.emoji}
        </span>
      </div>
      {/* Label */}
      <span className="w-full text-center text-[13px] font-bold leading-tight text-zinc-800 sm:text-[15px] whitespace-pre-line">
        {cat.name}
      </span>
    </div>
  );

  return (
    <section className="mx-auto mt-8 max-w-7xl px-4 sm:mt-10 pb-12">
      {/* Grocery & Kitchen Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-[22px] font-black text-zinc-900 sm:text-[26px]">
          Grocery & Kitchen
        </h2>
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {GROCERY_KITCHEN.map((cat, i) => renderCard(cat, i))}
        </div>
      </div>

      {/* Snacks & Drinks Section */}
      <div>
        <h2 className="mb-4 text-[22px] font-black text-zinc-900 sm:text-[26px]">
          Snacks & Drinks
        </h2>
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {SNACKS_DRINKS.map((cat, i) => renderCard(cat, i))}
        </div>
      </div>
    </section>
  );
}
