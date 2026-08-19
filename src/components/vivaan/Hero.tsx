"use client";

import React from 'react';
import Image from 'next/image';
import { ImageSlider } from './ImageSlider';

/**
 * Hero Banner Component
 * Updated: Uses a Framer Motion ImageSlider for desktop and a single banner for mobile.
 */
export const Hero: React.FC = () => {
  const banners = [
    "https://vivanfa.sirv.com/ChatGPT%20Image%20Jul%2031%2C%202026%2C%2011_49_21%20PM.png",
    "https://vivanfa.sirv.com/ChatGPT%20Image%20Jul%2031%2C%202026%2C%2011_54_32%20PM.png",
    "https://vivanfa.sirv.com/ChatGPT%20Image%20Aug%201%2C%202026%2C%2012_03_41%20AM.png"
  ];

  return (
    <section className="w-full bg-[#F9F6EF] px-0">
      {/* Desktop Version: Full Motion Slider */}
      <div className="hidden md:block relative w-full aspect-[2.8/1] overflow-hidden shadow-sm">
        <ImageSlider images={banners} interval={6000} />
      </div>

      {/* Mobile Version: Single Static Banner for Performance */}
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
