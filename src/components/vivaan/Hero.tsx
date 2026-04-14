
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * Hero Banner Component
 * Fixed responsiveness: Changed width to 100% and removed absolute positioning constraints 
 * that caused image hiding on smaller screens. Used aspect ratio for perfect fitting.
 */
export const Hero: React.FC = () => {
  const mainBanner = PlaceHolderImages.find(img => img.id === 'hero-banner-main');
  const bannerUrl = mainBanner?.imageUrl || 'https://vivanfa.sirv.com/Firefly_Gemini%20Flash_Use%20the%20attached%20Atta%20banner%20as%20the%20exact%20layout%20and%20mood%20reference.%20Recreate%20the%20sam%20213429.png';

  return (
    <section className="w-full bg-[#F9F6EF] px-0 md:px-10 md:pt-6">
      <div className="relative w-full aspect-[16/8] md:aspect-[3/1] overflow-hidden md:rounded-[40px] shadow-sm">
        <Image
          src={bannerUrl}
          alt="Vivaan Farms Banner"
          fill
          className="object-cover object-center"
          priority
          loading="eager"
          sizes="100vw"
        />
      </div>
    </section>
  );
};
