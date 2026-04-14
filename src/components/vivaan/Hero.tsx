"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * Hero Banner Component
 * Optimized for mobile response with an aspect ratio that matches landscape banners.
 */
export const Hero: React.FC = () => {
  const mainBanner = PlaceHolderImages.find(img => img.id === 'hero-banner-main');
  const bannerUrl = mainBanner?.imageUrl || 'https://vivanfa.sirv.com/Firefly_Gemini%20Flash_Use%20the%20attached%20Atta%20banner%20as%20the%20exact%20layout%20and%20mood%20reference.%20Recreate%20the%20sam%20213429.png';

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] md:aspect-auto md:h-[600px] lg:h-[650px]">
        <Image
          src={bannerUrl}
          alt="Vivaan Farms Banner"
          fill
          className="object-cover"
          priority
          loading="eager"
          data-ai-hint="premium farm banner"
        />
      </div>
    </section>
  );
};
