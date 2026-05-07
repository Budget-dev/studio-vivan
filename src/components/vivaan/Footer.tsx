
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

const CERTS = [
  { abbr: 'ISO 9001:2015', src: 'https://vivanfa.sirv.com/cert1.png' },
  { abbr: 'FSSAI Certified', src: 'https://vivanfa.sirv.com/cert2.png' },
  { abbr: 'FDA Registered', src: 'https://vivanfa.sirv.com/cert3.png' },
  { abbr: 'NABL Tested', src: 'https://vivanfa.sirv.com/cert4.png' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white overflow-hidden relative">
      {/* Certification Bar */}
      <div className="bg-white py-6 border-b border-[#F1EAD8]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-wrap justify-center items-center gap-6 md:gap-16 grayscale opacity-40">
           {['ISO 9001', 'ISO 22000', 'FSSAI', 'FDA', 'GMP', 'NABL', 'HACCP'].map((cert) => (
             <div key={cert} className="text-[10px] md:text-sm font-black text-primary tracking-[3px] uppercase">{cert}</div>
           ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-20">
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center p-2.5">
                  <Image src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png" alt="Logo" width={40} height={40} className="brightness-0 invert object-contain" />
                </div>
                <div>
                  <div className="font-headline text-3xl font-extrabold tracking-tight leading-none uppercase">Vivaan Farms</div>
                  <div className="text-[8px] font-black text-white/40 tracking-[4px] uppercase mt-1">Authentic Purity</div>
                </div>
              </div>
            </Link>
            <p className="text-[13px] text-white/50 leading-loose max-w-sm font-medium">
              We bring the ancient Bilona method A2 Ghee and pure farm goods from the native grasslands of Gujarat directly to your kitchen. 100% traceable, 0% compromise.
            </p>
            <div className="space-y-4">
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[3px]">Join our Farm Journey</div>
              <div className="flex max-w-sm">
                <input type="email" placeholder="Enter Email" className="bg-white/5 border border-white/10 h-12 flex-1 px-5 rounded-l-xl text-sm focus:outline-none focus:bg-white/10 transition-all" />
                <button className="bg-white text-primary h-12 px-6 rounded-r-xl font-black text-xs uppercase tracking-widest hover:bg-[#F1EAD8] transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-11 h-11 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-all text-white/40 border border-white/10">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 lg:col-span-3">
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[3px] mb-6">Collections</h4>
                <ul className="space-y-4 text-sm font-bold text-white/60">
                  <li><Link href="/" className="hover:text-white transition-all">A2 Gir Ghee</Link></li>
                  <li><Link href="/" className="hover:text-white transition-all">Artisanal Sweets</Link></li>
                  <li><Link href="/" className="hover:text-white transition-all">Wild Forest Honey</Link></li>
                  <li><Link href="/" className="hover:text-white transition-all">Native Combos</Link></li>
                </ul>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[3px] mb-6">Company</h4>
                <ul className="space-y-4 text-sm font-bold text-white/60">
                  <li><Link href="/about" className="hover:text-white transition-all">Our Legacy</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-all">Purity Lab Reports</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-all">Contact Farm</Link></li>
                  <li><Link href="/track" className="hover:text-white transition-all">Track My Order</Link></li>
                </ul>
              </div>
            </div>
            <div className="space-y-8 col-span-2">
              <div>
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[3px] mb-6">Purity Support</h4>
                <p className="text-[13px] text-white/50 mb-6 font-medium leading-relaxed">
                  Have questions about our Bilona process? Reach our farm desk.<br />
                  <strong className="text-white">care@vivaanfarms.com</strong><br />
                  <strong className="text-white">+91 98765 43210</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
                    <CreditCard className="w-3.5 h-3.5" /> Safe Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-[10px] font-bold text-white/20 uppercase tracking-[2px]">
             © 2025 Vivaan Farms · Crafted in Gujarat, India
           </div>
           <div className="flex gap-6 opacity-30 grayscale contrast-125">
             <img src="https://vivanfa.sirv.com/pay1.png" alt="Visa" className="h-4" />
             <img src="https://vivanfa.sirv.com/pay2.png" alt="Master" className="h-4" />
             <img src="https://vivanfa.sirv.com/pay3.png" alt="UPI" className="h-4" />
           </div>
        </div>
      </div>

      <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 text-[30vw] font-headline font-black text-white/5 pointer-events-none select-none uppercase tracking-tighter">
        VIVAAN
      </div>
    </footer>
  );
};
