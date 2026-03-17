"use client";

import React from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, ShieldCheck, CheckCircle, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary pt-20 relative overflow-hidden text-white/50">
      <div className="absolute top-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(232,176,64,0.07),transparent_68%)] pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 pb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 relative flex items-center justify-center grayscale brightness-200 contrast-100 opacity-90">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="Vivaan Farms Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-headline text-3xl font-extrabold text-white tracking-[5px]">VIVAAN</div>
              <div className="text-[9px] font-semibold tracking-[2.5px] uppercase mt-0.5">Pure Farm Goods · Gujarat</div>
            </div>
          </div>
          <p className="text-sm leading-loose mb-8 max-w-sm">
            Bringing the purest A2 Gir Cow Ghee from the heart of Gujarat to 50,000+ families across India. Ancient methods, modern trust.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <button key={i} className="w-11 h-11 bg-white/10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-white">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-black text-white/50 tracking-[2.5px] uppercase mb-8">Shop</h4>
          <ul className="space-y-4 text-[13.5px] font-medium">
            <li><button className="hover:text-white transition-colors">A2 Gir Cow Ghee</button></li>
            <li><button className="hover:text-white transition-colors">Buffalo Ghee</button></li>
            <li><button className="hover:text-white transition-colors">Cold Press Oils</button></li>
            <li><button className="hover:text-white transition-colors">Combo Packs</button></li>
            <li><button className="hover:text-white transition-colors">Superfoods</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-black text-white/50 tracking-[2.5px] uppercase mb-8">Company</h4>
          <ul className="space-y-4 text-[13.5px] font-medium">
            <li><button className="hover:text-white transition-colors">Our Story</button></li>
            <li><button className="hover:text-white transition-colors">Our Farm</button></li>
            <li><button className="hover:text-white transition-colors">Blog</button></li>
            <li><button className="hover:text-white transition-colors">Farmer Partners</button></li>
            <li><button className="hover:text-white transition-colors">Contact Us</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-black text-white/50 tracking-[2.5px] uppercase mb-8">Policies</h4>
          <ul className="space-y-4 text-[13.5px] font-medium">
            <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
            <li><button className="hover:text-white transition-colors">Refund Policy</button></li>
            <li><button className="hover:text-white transition-colors">Shipping Policy</button></li>
            <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
            <li><button className="hover:text-white transition-colors">Track Order</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[11px] text-white/30 tracking-wider text-center md:text-left">
          © 2025 Vivaan Farm Technologies Pvt. Ltd. · Gujarat, India · CIN: U01000GJ2018PTC101234
        </div>
        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-[10px] font-bold text-white/40">
            <ShieldCheck className="w-3 h-3" /> SSL Secured
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-[10px] font-bold text-white/40">
            <CheckCircle className="w-3 h-3" /> RBI Approved
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-[10px] font-bold text-white/40">
            <CreditCard className="w-3 h-3" /> Razorpay
          </div>
        </div>
      </div>
    </footer>
  );
};
