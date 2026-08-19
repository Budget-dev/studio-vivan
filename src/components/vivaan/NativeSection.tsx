
"use client";

import React from 'react';
import Image from 'next/image';

const NATIVE_CARDS = [
  {
    title: "Native Gujarat Geographies",
    image: "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2010_06_35%20AM.png"
  },
  {
    title: "Purity over Profits",
    image: "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2010_06_40%20AM.png"
  },
  {
    title: "Zero Middlemen Supply",
    image: "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2010_06_44%20AM.png"
  },
  {
    title: "Heritage A2 Breeding",
    image: "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2010_06_49%20AM.png"
  }
];

export const NativeSection: React.FC = () => {
  return (
    <section className="py-8 md:py-24 bg-[#F9F6EF] border-t border-border/50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="font-headline text-3xl md:text-6xl font-extrabold text-primary leading-tight">
            Single-Origin Ingredients. No Compromises.
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mt-4 md:mt-6 rounded-full"></div>
        </div>

        <div className="flex md:grid md:grid-cols-4 overflow-x-auto no-scrollbar md:overflow-x-visible snap-x snap-mandatory gap-4 md:gap-6 -mx-5 px-5 md:mx-0 md:px-0 pb-4 md:pb-0">
          {NATIVE_CARDS.map((card, i) => (
            <div 
              key={i} 
              className="relative min-w-[240px] md:min-w-0 aspect-[4/5] rounded-[20px] md:rounded-[24px] overflow-hidden group shadow-lg bg-white shrink-0 snap-center"
            >
              <Image 
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 240px, 450px"
              />
              {/* Subtle hover overlay for depth without obscuring image text */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
