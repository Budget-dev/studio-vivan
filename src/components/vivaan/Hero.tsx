
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const Hero: React.FC = () => {
  const mainBanner = PlaceHolderImages.find(img => img.id === 'hero-banner-main');
  const bannerUrl = mainBanner?.imageUrl || 'https://vivanfa.sirv.com/Firefly_Gemini%20Flash_Use%20the%20attached%20Atta%20banner%20as%20the%20exact%20layout%20and%20mood%20reference.%20Recreate%20the%20sam%20213429.png';

  return (
    <section className="relative w-full border-b border-border/10 overflow-hidden">
      <div className="relative w-full h-[400px] md:h-[650px]">
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
