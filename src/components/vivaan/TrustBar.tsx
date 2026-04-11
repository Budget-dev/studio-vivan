import React from 'react';
import { Truck, ShieldCheck, Heart, Star } from 'lucide-react';

const trustItems = [
  { ico: <Truck className="w-5 h-5 md:w-6 md:h-6 text-secondary" />, t: 'Free Delivery', s: 'Orders above ₹999' },
  { ico: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-secondary" />, t: '30-Day Returns', s: 'No questions asked' },
  { ico: <Heart className="w-5 h-5 md:w-6 md:h-6 text-secondary" />, t: 'Farm Direct', s: 'Zero middlemen, pure truth' },
  { ico: <Star className="w-5 h-5 md:w-6 md:h-6 text-secondary" />, t: '4.9 Rated', s: '12,000+ verified reviews' },
];

export const TrustBar: React.FC = () => {
  return (
    <div className="bg-white border-b border-border py-6 md:py-8">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        {/* Mobile: 2x2 Grid | Desktop: Flex Row */}
        <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-y-8 gap-x-4">
          {trustItems.map((item, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3 md:gap-3.5 group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D0EDDF]/50 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {item.ico}
                </div>
                <div>
                  <div className="text-[12px] md:text-sm font-black text-foreground leading-tight">{item.t}</div>
                  <div className="text-[10px] md:text-[11px] text-[#7A6A52] mt-0.5 font-medium leading-tight">{item.s}</div>
                </div>
              </div>
              {/* Desktop Only Separator */}
              {i < trustItems.length - 1 && (
                <div className="hidden md:block w-px h-10 bg-border mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
