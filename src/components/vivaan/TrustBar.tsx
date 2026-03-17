import React from 'react';
import { Truck, FlaskConical, ShieldCheck, Heart, Star } from 'lucide-react';

const trustItems = [
  { ico: <Truck className="w-6 h-6 text-secondary" />, t: 'Free Delivery', s: 'Orders above ₹999' },
  { ico: <FlaskConical className="w-6 h-6 text-secondary" />, t: '70+ Lab Tests', s: 'NABL certified every batch' },
  { ico: <ShieldCheck className="w-6 h-6 text-secondary" />, t: '30-Day Returns', s: 'No questions asked' },
  { ico: <Heart className="w-6 h-6 text-secondary" />, t: 'Farm Direct', s: 'Zero middlemen, pure truth' },
  { ico: <Star className="w-6 h-6 text-secondary" />, t: '4.9 Rated', s: '12,000+ verified reviews' },
];

export const TrustBar: React.FC = () => {
  return (
    <div className="bg-white border-b border-border py-6 overflow-x-auto">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between min-w-[800px]">
        {trustItems.map((item, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 bg-[#D0EDDF]/50 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {item.ico}
              </div>
              <div>
                <div className="text-sm font-black text-foreground">{item.t}</div>
                <div className="text-[11px] text-[#7A6A52] mt-0.5 font-medium">{item.s}</div>
              </div>
            </div>
            {i < trustItems.length - 1 && <div className="w-px h-10 bg-border mx-4" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
