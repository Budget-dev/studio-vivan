
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Leaf,
  Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#163A24] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10 py-10 md:py-16">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center lg:text-left">
            <div className="hidden md:block">
              <Leaf className="w-16 h-16 text-[#80EBA8] fill-current opacity-80" />
            </div>
            <div>
              <h3 className="font-headline text-3xl md:text-4xl font-extrabold text-white">Get 10% Off Your First Harvest Order!</h3>
              <p className="text-white/60 text-sm md:text-base mt-2 font-medium">
                Subscribe to our newsletter and get exclusive offers, health tips, and farm updates.
              </p>
            </div>
          </div>
          <div className="w-full max-w-lg">
            <form className="flex gap-2">
              <Input 
                placeholder="Enter your email address" 
                className="h-12 md:h-14 bg-white border-transparent rounded-lg text-[#100C06] font-medium"
              />
              <Button className="h-12 md:h-14 px-8 bg-[#80EBA8] hover:bg-[#6ed997] text-[#163A24] font-black uppercase tracking-widest rounded-lg transition-all">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative brightness-0 invert">
                <Image 
                  src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                  alt="Vivaan Farms"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-headline text-2xl font-extrabold leading-none">VIVAAN</h4>
                <p className="text-[10px] font-black uppercase tracking-[2px] text-white/40">Farms Natural</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed font-medium">
              Your trusted source for 100% natural and healthy farm goods. Fuel your day, feel great, and make the world a purer place.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all text-white/80 border border-white/10">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-lg font-headline font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#products" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/#products" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-headline font-bold mb-6">Customer Service</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link href="/profile" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-headline font-bold mb-6">Categories</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><button onClick={() => window.location.href='/#products'} className="hover:text-white transition-colors">A2 Gir Cow Ghee</button></li>
              <li><button onClick={() => window.location.href='/#products'} className="hover:text-white transition-colors">Artisanal Sweets</button></li>
              <li><button onClick={() => window.location.href='/#products'} className="hover:text-white transition-colors">Wild Forest Honey</button></li>
              <li><button onClick={() => window.location.href='/#products'} className="hover:text-white transition-colors">Cold Pressed Oils</button></li>
              <li><button onClick={() => window.location.href='/#products'} className="hover:text-white transition-colors">Superfoods</button></li>
              <li><button onClick={() => window.location.href='/#products'} className="hover:text-white transition-colors">Gifting Combos</button></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-6">
            <h4 className="text-lg font-headline font-bold mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#80EBA8] transition-colors group-hover:bg-[#80EBA8] group-hover:text-[#163A24]">
                  <Phone size={18} />
                </div>
                <a href="tel:+919876543210" className="text-sm font-bold hover:text-[#80EBA8] transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#80EBA8] transition-colors group-hover:bg-[#80EBA8] group-hover:text-[#163A24]">
                  <Mail size={18} />
                </div>
                <a href="mailto:care@vivaanfarms.com" className="text-sm font-bold hover:text-[#80EBA8] transition-colors">care@vivaanfarms.com</a>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#80EBA8] transition-colors shrink-0 group-hover:bg-[#80EBA8] group-hover:text-[#163A24]">
                  <MapPin size={18} />
                </div>
                <span className="text-sm font-bold leading-relaxed">
                  Rajkot, Gujarat,<br />India 360001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0D2B1A] py-6">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-[2px]">
            © 2025 Vivaan Farms Natural Store. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-white/40">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="opacity-20">|</span>
            <Link href="/about" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
