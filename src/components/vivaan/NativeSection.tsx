
"use client";

import React from 'react';
import Image from 'next/image';

const NATIVE_CARDS = [
  {
    title: "Native Gujarat Geographies",
    subtitle: "Ideal Sourcing Regions",
    desc: "We map every ingredient to its native soil in Gujarat for maximum nutrient density.",
    image: "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2010_06_35%20AM.png"
  },
  {
    title: "Purity over Profits",
    subtitle: "Nutrition-First Philosophy",
    desc: "We don't focus on high-yield farming. We focus on soul-nourishing flavor and tradition.",
    image: "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2010_06_40%20AM.png"
  },
  {
    title: "Zero Middlemen Supply",
    subtitle: "Goodness, Directly Delivered",
    desc: "Only the purest Gir cow milk and hand-picked seeds make it from our farm to you.",
    image: "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2010_06_44%20AM.png"
  },
  {
    title: "Heritage A2 Breeding",
    subtitle: "Ethical Gir Cow Sourcing",
    desc: "Pure A2 Gir milk is the foundation of our Bilona ghee, sourced from freely grazing cows.",
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
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end md:justify-center text-center">
                <div className="space-y-2 md:space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[2px] text-white/90">{card.subtitle}</div>
                  <h3 className="font-headline text-lg md:text-3xl font-bold text-white leading-tight">
                    {card.title}
                  </h3>
                  <p className="hidden md:block text-white/80 text-sm leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
