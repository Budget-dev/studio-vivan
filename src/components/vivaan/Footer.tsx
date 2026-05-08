
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white overflow-hidden relative">
      {/* Compact Certification Bar */}
      <div className="bg-white py-3 md:py-6 border-b border-[#F1EAD8]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-wrap justify-center items-center gap-4 md:gap-16 grayscale opacity-40">
           {['ISO 9001', 'FSSAI', 'FDA', 'NABL'].map((cert) => (
             <div key={cert} className="text-[8px] md:text-sm font-black text-primary tracking-[2px] md:tracking-[3px] uppercase">{cert}</div>
           ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-10 md:pt-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-20">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center p-2">
                  <Image src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png" alt="Logo" width={40} height={40} className="brightness-0 invert object-contain" />
                </div>
                <div>
                  <div className="font-headline text-xl md:text-3xl font-extrabold tracking-tight leading-none uppercase">Vivaan Farms</div>
                  <div className="text-[7px] md:text-[8px] font-black text-white/40 tracking-[3px] uppercase mt-0.5">Authentic Purity</div>
                </div>
              </div>
            </Link>
            <p className="text-[12px] text-white/50 leading-relaxed max-w-sm font-medium">
              Ancient Bilona Ghee from Gujarat's Gir heritage. 100% traceable farm direct goodness.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 md:w-11 md:h-11 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-all text-white/40 border border-white/10">
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:col-span-3">
            <div>
              <h4 className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[2px] md:tracking-[3px] mb-4">Shop</h4>
              <ul className="space-y-2 md:space-y-4 text-xs md:text-sm font-bold text-white/60">
                <li><Link href="/" className="hover:text-white transition-all">A2 Ghee</Link></li>
                <li><Link href="/" className="hover:text-white transition-all">Sweets</Link></li>
                <li><Link href="/" className="hover:text-white transition-all">Honey</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[2px] md:tracking-[3px] mb-4">Support</h4>
              <ul className="space-y-2 md:space-y-4 text-xs md:text-sm font-bold text-white/60">
                <li><Link href="/about" className="hover:text-white transition-all">Legacy</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-all">Contact</Link></li>
                <li><Link href="/track" className="hover:text-white transition-all">Track</Link></li>
              </ul>
            </div>
            <div className="col-span-2 pt-4 md:pt-0 border-t border-white/5 md:border-none">
              <h4 className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[2px] md:tracking-[3px] mb-4">Purity Desk</h4>
              <p className="text-[12px] text-white/50 font-medium leading-relaxed">
                care@vivaanfarms.com<br />
                +91 98765 43210
              </p>
              <div className="flex gap-2 mt-4">
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 text-[8px] font-black uppercase tracking-wider text-white/40">
                  <ShieldCheck className="w-3 h-3" /> SSL Secured
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-[9px] font-bold text-white/20 uppercase tracking-[2px]">
             © 2025 Vivaan Farms · Gujarat, India
           </div>
           <div className="flex gap-4 opacity-30 grayscale contrast-125">
             <img src="https://vivanfa.sirv.com/pay1.png" alt="Visa" className="h-3 md:h-4" />
             <img src="https://vivanfa.sirv.com/pay2.png" alt="Master" className="h-3 md:h-4" />
             <img src="https://vivanfa.sirv.com/pay3.png" alt="UPI" className="h-3 md:h-4" />
           </div>
        </div>
      </div>

      <div className="absolute bottom-[-50px] md:bottom-[-150px] left-1/2 -translate-x-1/2 text-[20vw] md:text-[30vw] font-headline font-black text-white/[0.03] pointer-events-none select-none uppercase tracking-tighter">
        VIVAAN
      </div>
    </footer>
  );
};
