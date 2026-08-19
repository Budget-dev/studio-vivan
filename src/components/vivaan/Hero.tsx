"use client";

import React from 'react';
import Image from 'next/image';
import { ImageSlider } from './ImageSlider';

/**
 * Hero Banner Component
 * Optimized for Desktop (Slider) and Mobile (Static Image) as requested.
 */
export const Hero: React.FC = () => {
  const banners = [
    "https://vivanfa.sirv.com/ChatGPT%20Image%20Jul%2031%2C%202026%2C%2011_49_21%20PM.png",
    "https://vivanfa.sirv.com/ChatGPT%20Image%20Jul%2031%2C%202026%2C%2011_54_32%20PM.png",
    "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2012_03_41%20AM.png"
  ];

  return (
    <section className="w-full bg-[#F9F6EF] px-0">
      {/* Desktop Version: Uses the exact ImageSlider logic provided */}
      <div className="hidden md:block relative w-full aspect-[2.8/1] overflow-hidden shadow-sm">
        <ImageSlider images={banners} interval={5000} />
      </div>

      {/* Mobile Version: Maintained as a high-performance static banner */}
      <div className="md:hidden relative w-full aspect-[16/7] overflow-hidden shadow-sm">
        <Image
          src={banners[0]}
          alt="Vivaan Farms Banner"
          fill
          className="w-full h-full object-cover object-center"
          priority
          loading="eager"
          sizes="100vw"
        />
      </div>
    </section>
  );
};
