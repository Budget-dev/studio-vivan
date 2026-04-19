
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, ShieldCheck, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary pt-12 md:pt-20 relative overflow-hidden text-white/50">
      <div className="absolute top-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_68%)] pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-16 pb-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <Link href="/" className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center grayscale brightness-200 contrast-100 opacity-90 transition-transform hover:scale-105">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="Vivaan Farms Logo"
                width={128}
                height={128}
                className="object-contain"
              />
            </Link>
          </div>
          <p className="text-xs md:text-sm leading-loose mb-6 md:mb-8 max-w-sm">
            Bringing the purest A2 Gir Cow Ghee from the heart of Gujarat to 50,000+ families across India. Ancient methods, modern trust.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <button key={i} className="w-10 h-10 md:w-11 md:h-11 bg-white/10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-white">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Compact Layout for Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 col-span-1 lg:col-span-3">
          <div>
            <h4 className="text-[10px] md:text-[11px] font-black text-white/50 tracking-[2px] uppercase mb-5 md:mb-8">Shop</h4>
            <ul className="space-y-3 md:space-y-4 text-[12px] md:text-[13.5px] font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">A2 Ghee</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Sweets</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Honey</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Combos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] md:text-[11px] font-black text-white/50 tracking-[2px] uppercase mb-5 md:mb-8">Company</h4>
            <ul className="space-y-3 md:space-y-4 text-[12px] md:text-[13.5px] font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 mt-4 md:mt-0">
            <h4 className="text-[10px] md:text-[11px] font-black text-white/50 tracking-[2px] uppercase mb-5 md:mb-8">Support</h4>
            <ul className="space-y-3 md:space-y-4 text-[12px] md:text-[13.5px] font-medium">
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><button className="hover:text-white transition-colors text-left">Shipping Policy</button></li>
              <li><button className="hover:text-white transition-colors text-left">Refunds</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-6 md:py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[10px] md:text-[11px] text-white/30 tracking-wider text-center md:text-left">
          © 2025 Vivaan Farm Technologies Pvt. Ltd. · Gujarat, India
        </div>
        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-white/40">
            <ShieldCheck className="w-3 h-3" /> SSL Secured
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-white/40">
            <CreditCard className="w-3 h-3" /> Secure Pay
          </div>
        </div>
      </div>
    </footer>
  );
};
