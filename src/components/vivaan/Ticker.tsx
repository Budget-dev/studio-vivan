import React from 'react';
import { Truck } from 'lucide-react';

/**
 * Ticker component redesigned to match the reference image.
 * Features a static bar with left-aligned delivery info and right-aligned quality pillars.
 */
export const Ticker: React.FC = () => {
  return (
    <div className="bg-[#0D3520] h-10 flex items-center justify-center text-[10px] md:text-[11px] font-bold text-white/90 tracking-wide overflow-hidden relative z-[950] border-b border-white/5 px-4 md:px-10">
      <div className="max-w-[1600px] w-full flex items-center justify-between">
        {/* Left Aligned - Delivery Info */}
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-white/60" />
          <span className="uppercase tracking-widest hidden sm:inline">Free delivery on orders over ₹999</span>
          <span className="uppercase tracking-widest sm:hidden">Free delivery ₹999+</span>
        </div>

        {/* Right Aligned - Quality Pillars */}
        <div className="hidden md:flex items-center gap-6 text-white/60 font-black uppercase tracking-[2px]">
          <span>100% Organic</span>
          <span className="text-white/20">|</span>
          <span>Lab Tested</span>
          <span className="text-white/20">|</span>
          <span>Farm Direct</span>
        </div>
      </div>
    </div>
  );
};
