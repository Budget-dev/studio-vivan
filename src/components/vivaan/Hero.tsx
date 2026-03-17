"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Hero: React.FC = () => {
  return (
    <section className="bg-primary relative overflow-hidden min-h-[580px] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(232,176,64,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_20%_80%,rgba(42,122,80,0.2)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 flex flex-col md:grid md:grid-cols-2 gap-16 items-center w-full relative z-10">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 bg-[#E8B040]/15 border border-[#E8B040]/40 text-[#FDE88A] px-4 py-2 rounded-full text-[10px] font-extrabold tracking-[2.5px] uppercase mb-6 backdrop-blur-md">
            🌾 Bilona Method · Gujarat Since 2018
          </div>
          <h1 className="font-headline text-5xl lg:text-7xl font-extrabold text-white leading-[1] mb-5 tracking-tight">
            Pure <em className="italic text-[#FDE88A] not-italic">A2 Gir Cow</em><br />Ghee. No<br />Shortcuts.
          </h1>
          <p className="text-base lg:text-lg text-white/65 leading-relaxed mb-8 max-w-[440px] font-light">
            Hand-churned using the ancient Bilona method. Lab-tested 70+ times per batch. Direct from our Gujarat farm to your family's table.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="h-14 px-8 rounded-full bg-gradient-to-br from-[#FDE88A] to-[#F2C850] text-primary font-black uppercase tracking-wider gold-sh transition-all hover:translate-y-[-2px] hover:shadow-gold-sh group">
              Shop Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="h-14 px-8 rounded-full bg-white/10 border-white/25 text-white font-bold hover:bg-white/20 hover:border-white/40 transition-all">
              Our Story
            </Button>
          </div>

          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
            <div><div className="font-headline text-3xl font-extrabold text-white">50K+</div><div className="text-[11px] text-white/45 tracking-widest uppercase mt-0.5 font-bold">Families Trust Us</div></div>
            <div><div className="font-headline text-3xl font-extrabold text-white">70+</div><div className="text-[11px] text-white/45 tracking-widest uppercase mt-0.5 font-bold">Lab Tests / Batch</div></div>
            <div><div className="font-headline text-3xl font-extrabold text-white">4.9★</div><div className="text-[11px] text-white/45 tracking-widest uppercase mt-0.5 font-bold">12,000+ Reviews</div></div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center relative">
          <div className="absolute w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(232,176,64,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute w-[380px] h-[380px] rounded-full border border-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 spin-ring"></div>
          <div className="relative hero-float">
            <svg width="310" height="380" viewBox="0 0 310 380" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hj1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FBE898"/><stop offset="100%" stopColor="#D4A030"/></linearGradient>
                <linearGradient id="hj2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#E8B040"/><stop offset="100%" stopColor="#B87020"/></linearGradient>
              </defs>
              <ellipse cx="155" cy="358" rx="110" ry="20" fill="#000" opacity=".12"/>
              <rect x="50" y="108" width="210" height="240" rx="28" fill="url(#hj2)" />
              <rect x="58" y="114" width="194" height="228" rx="24" fill="url(#hj1)"/>
              <rect x="76" y="162" width="158" height="110" rx="16" fill="rgba(255,255,255,.58)"/>
              <text x="155" y="206" textAnchor="middle" fontSize="18" fontFamily="Georgia,serif" fill="#3A2808" fontWeight="bold">VIVAAN</text>
              <text x="155" y="228" textAnchor="middle" fontSize="13.5" fill="#6A4010">FARMS</text>
              <text x="155" y="247" textAnchor="middle" fontSize="12" fill="#8A5C18">A2 GIR COW GHEE</text>
              <text x="155" y="262" textAnchor="middle" fontSize="10" fill="#9A6A20">BILONA METHOD</text>
              <rect x="66" y="87" width="178" height="28" rx="10" fill="#B87020"/>
              <rect x="74" y="91" width="162" height="22" rx="8" fill="#D09030"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
