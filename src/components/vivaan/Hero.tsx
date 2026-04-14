
"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const Hero: React.FC = () => {
  const mainBanner = PlaceHolderImages.find(img => img.id === 'hero-banner-main');
  const bannerUrl = mainBanner?.imageUrl || 'https://vivanfa.sirv.com/Firefly_Gemini%20Flash_Use%20the%20attached%20Atta%20banner%20as%20the%20exact%20layout%20and%20mood%20reference.%20Recreate%20the%20sam%20213429.png';

  return (
    <section className="relative w-full border-b border-border/10">
      <div className="relative w-full h-[300px] md:h-[500px]">
        <Image
          src={bannerUrl}
          alt="Experience Pure Purity"
          fill
          className="object-cover brightness-[0.95]"
          priority
          loading="eager"
          data-ai-hint="premium farm banner"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full">
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black tracking-[2px] uppercase mb-3 md:mb-5">
                Authentic Bilona Method · Gujarat Direct
              </div>
              <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 md:mb-6">
                Nature's Finest <br /> <em className="italic text-accent">Pure Goodness</em>
              </h1>
              <div className="flex gap-2.5 md:gap-4">
                <Button className="h-10 md:h-12 px-6 md:px-10 rounded-full bg-primary text-white font-black uppercase tracking-widest hover:bg-secondary transition-all group border-none shadow-xl text-[9px] md:text-xs">
                  Shop Purity <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
