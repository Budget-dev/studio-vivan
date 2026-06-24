"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface FeaturedBannerProps {
  onCta?: () => void;
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ onCta }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-0 md:px-10 mb-8 md:mb-20">
      <div 
        className="relative w-full h-[320px] md:h-[540px] rounded-none md:rounded-[40px] overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0">
          <Image 
            src="https://picsum.photos/seed/vivaan-harvest/1600/600" 
            alt="Pure Farm Harvest" 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/30 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
        </div>

        <div className="relative h-full z-10 flex flex-col justify-center px-6 md:px-20 text-white">
          <div className="max-w-2xl space-y-3 md:space-y-6">
            <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[3px]">
              Direct from Gujarat
            </span>
            
            <h2 className="font-headline text-3xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-lg">
              The Purest Harvest of the Season
            </h2>
            
            <div className="flex items-baseline gap-4">
              <span className="font-headline text-2xl md:text-5xl font-black text-white">
                Authentic Bilona Ghee
              </span>
            </div>

            <div className="pt-4 md:pt-8">
              <Button 
                onClick={onCta}
                className="h-10 md:h-16 px-8 md:px-12 rounded-full bg-white text-primary font-black uppercase tracking-widest shadow-xl hover:bg-[#F9F6EF] transition-all text-[10px] md:text-sm flex items-center gap-3 group"
              >
                Shop Collection
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};