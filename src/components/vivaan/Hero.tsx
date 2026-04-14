
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * Hero Banner Component
 * Updated with specific positioning and dimensions requested by the user.
 * Fixed: Removed 'fill' prop to resolve conflict with manual width/height styles.
 */
export const Hero: React.FC = () => {
  const mainBanner = PlaceHolderImages.find(img => img.id === 'hero-banner-main');
  const bannerUrl = mainBanner?.imageUrl || 'https://vivanfa.sirv.com/Firefly_Gemini%20Flash_Use%20the%20attached%20Atta%20banner%20as%20the%20exact%20layout%20and%20mood%20reference.%20Recreate%20the%20sam%20213429.png';

  return (
    <section className="relative w-full overflow-hidden h-[300px] md:h-[500px]">
      <Image
        src={bannerUrl}
        alt="Vivaan Farms Banner"
        width={1920}
        height={1080}
        priority
        loading="eager"
        style={{
          position: 'absolute',
          height: '73%',
          width: '109%',
          inset: '0px',
          color: 'transparent'
        }}
        data-ai-hint="premium farm banner"
      />
    </section>
  );
};
