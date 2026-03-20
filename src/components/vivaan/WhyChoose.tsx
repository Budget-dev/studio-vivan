"use client";

import React from 'react';
import { TreeDeciduous, ClipboardCheck, Tractor, UtensilsCrossed } from 'lucide-react';

const pillars = [
  {
    icon: <TreeDeciduous className="w-12 h-12 md:w-16 md:h-16 text-primary" />,
    title: "Native Sourcing",
    desc: "Highest quality raw material from native regions of Gujarat."
  },
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary w-12 h-12 md:w-16 md:h-16">
        <path d="M32 8V56M16 24C16 24 20 52 32 52C44 52 48 24 48 24M12 16H52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 16V8M40 16V8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    title: "Traditional Processing",
    desc: "Minimally processed using time-tested methods, made better. For maximum nutrition."
  },
  {
    icon: <ClipboardCheck className="w-12 h-12 md:w-16 md:h-16 text-primary" />,
    title: "Extensive Quality Checks",
    desc: "Everything goes through 70+ lab tests, to make sure that you get only what is best."
  },
  {
    icon: <Tractor className="w-12 h-12 md:w-16 md:h-16 text-primary" />,
    title: "Better Rural Lives",
    desc: "5000+ farmer families are empowered with every Vivaan product you buy."
  }
];

export const WhyChoose: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-border/50">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary">
            Why Choose Vivaan Farms?
          </h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {pillars.map((pillar, i) => (
            <div key={i} className="text-center flex flex-col items-center group">
              <div className="mb-8 transform transition-transform duration-500 group-hover:scale-110">
                {pillar.icon}
              </div>
              <h3 className="font-headline text-xl md:text-2xl font-bold text-primary mb-4">
                {pillar.title}
              </h3>
              <p className="text-sm md:text-base text-[#7A6848] leading-relaxed max-w-[240px] font-medium">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
