"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * Hero Banner Component
 * Updated: Removed desktop rounding and padding to match the edge-to-edge mobile look.
 * Strictly focused on desktop adjustments as requested.
 */
export const Hero: React.FC = () => {
  const mainBanner = PlaceHolderImages.find(img => img.id === 'hero-banner-main');
  const bannerUrl = mainBanner?.imageUrl || 'https://vivanfa.sirv.com/ChatGPT%20Image%20Jul%2031%2C%202026%2C%2011_49_21%20PM.png';

  return (
    <section className="w-full bg-[#F9F6EF] px-0">
      <div className="relative w-full aspect-[16/7] md:aspect-[2.8/1] overflow-hidden shadow-sm">
        <Image
          src={bannerUrl}
          alt="Vivaan Farms Banner"
          width={1600}
          height={570}
          className="w-full h-full object-cover object-center"
          priority
          loading="eager"
          sizes="100vw"
        />
      </div>
    </section>
  );
};
