"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ComboIcon } from './JarIcon';

interface FeaturedBannerProps {
  onCta: () => void;
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ onCta }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 mb-20">
      <div className="bg-gradient-to-br from-primary via-[#1A5C38] to-[#3AAA60] rounded-[40px] overflow-hidden relative group">
        <div className="absolute top-[-40px] right-[-40px] w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(232,176,64,0.18),transparent_68%)] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="p-10 md:p-20 flex flex-col md:grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="text-[10px] font-black text-white/50 tracking-[3px] uppercase mb-5">Limited Offer · Combo Pack</div>
            <h2 className="font-headline text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
              Desi + Gir<br /><em className="italic text-[#FDE88A] not-italic">Combo Deal</em>
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-10 max-w-sm font-light">
              Two legendary jars, double the goodness. Save ₹445 on our most-loved combo — both A2 Gir Cow Ghee and Desi Cow Ghee in one box.
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <Button 
                onClick={onCta}
                className="h-14 px-8 rounded-full bg-gradient-to-br from-[#FDE88A] to-[#F2C850] text-primary font-black uppercase tracking-widest gold-sh hover:translate-y-[-2px] transition-all"
              >
                Shop Combos →
              </Button>
              <div className="font-headline text-3xl font-extrabold text-[#FDE88A]">Save 19%</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative group-hover:scale-110 transition-transform duration-500">
               <div className="absolute inset-0 bg-black/20 blur-3xl rounded-full scale-125"></div>
               <ComboIcon className="w-[320px] h-[320px] relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
