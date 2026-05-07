
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
  const bannerUrl = mainBanner?.imageUrl || 'https://vivanfa.sirv.com/Firefly_Gemini%20Flash_Use%20the%20attached%20Atta%20banner%20as%20the%20exact%20layout%20and%20mood%20reference.%20Recreate%20the%20sam%20213429.png';

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
