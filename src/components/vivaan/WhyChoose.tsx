"use client";

import React from 'react';
import { TreeDeciduous, ShieldCheck, Home, UtensilsCrossed } from 'lucide-react';

const pillars = [
  {
    icon: <TreeDeciduous className="w-10 h-10 md:w-16 md:h-16 text-primary" />,
    title: "Native Sourcing",
    desc: "Highest quality raw material from native regions of Gujarat."
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary w-10 h-10 md:w-16 md:h-16">
        <path d="M32 8V56M16 24C16 24 20 52 32 52C44 52 48 24 48 24M12 16H52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 16V8M40 16V8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    title: "Bilona Method",
    desc: "Ancient Vedic process that preserves vital nutrients and authentic aroma."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 md:w-16 md:h-16 text-primary" />,
    title: "Pure & Natural",
    desc: "100% free from preservatives, artificial colors or chemical additives."
  },
  {
    icon: <Home className="w-10 h-10 md:w-16 md:h-16 text-primary" />,
    title: "Direct from Farm",
    desc: "100% traceable, single-origin goodness from our Gujarat farm to you."
  }
];

export const WhyChoose: React.FC = () => {
  return (
    <section className="py-10 md:py-24 bg-white border-t border-border/50">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-10 md:mb-24">
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-primary">
            Why Choose Vivaan Farms?
          </h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto mt-3 md:mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((pillar, i) => (
            <div key={i} className="text-center flex flex-col items-center group">
              <div className="mb-4 md:mb-8 transform transition-transform duration-500 group-hover:scale-110">
                {pillar.icon}
              </div>
              <h3 className="font-headline text-base md:text-2xl font-bold text-primary mb-2 md:mb-4">
                {pillar.title}
              </h3>
              <p className="text-[10px] md:text-base text-[#7A6848] leading-relaxed max-w-[240px] font-medium">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
