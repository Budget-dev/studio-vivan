
"use client";

import React from 'react';
import { TreeDeciduous, ShieldCheck, Home, History, Sparkles, Heart } from 'lucide-react';

const pillars = [
  {
    icon: <TreeDeciduous className="w-10 h-10 md:w-16 md:h-16 text-primary" />,
    title: "Sourced from Gujarat",
    desc: "Highest quality raw materials directly from native regions of Gujarat."
  },
  {
    icon: <History className="w-10 h-10 md:w-16 md:h-16 text-primary" />,
    title: "Vedic Bilona Method",
    desc: "Ancient slow-churning process that preserves vital nutrients and aroma."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 md:w-16 md:h-16 text-primary" />,
    title: "100% Pure & Natural",
    desc: "Zero preservatives, artificial colors, or chemical additives. Just nature."
  },
  {
    icon: <Heart className="w-10 h-10 md:w-16 md:h-16 text-primary" />,
    title: "Traceable Farm-to-Fork",
    desc: "Single-origin goodness from our family-run farms directly to your doorstep."
  }
];

export const WhyChoose: React.FC = () => {
  return (
    <section className="py-10 md:py-24 bg-white border-t border-border/50">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-10 md:mb-24">
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-primary">
            Why Discerning Families Choose Vivaan Farms
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
