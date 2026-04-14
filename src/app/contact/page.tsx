
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { useCart } from '@/hooks/use-cart';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const router = useRouter();
  const { cart, updateQty, removeFromCart, totalQty } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'home' || tab === 'shop') {
      router.push('/');
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <div className="sticky top-0 z-[900]">
        <Ticker />
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          cartCount={totalQty}
          onFilter={() => router.push('/')}
          onSearch={() => router.push('/')}
        />
      </div>

      <main className="py-12 md:py-24">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-[10px] font-black text-primary tracking-[3px] uppercase px-4 py-1.5 bg-primary/5 rounded-full">Contact Us</span>
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary leading-none">Reach the Farm.</h1>
                <p className="text-lg text-[#7A6848] font-medium leading-relaxed max-w-lg">
                  Whether you have questions about our Bilona Ghee or want to visit our Gujarat farm, we're here to help you on your purity journey.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: <Mail className="w-6 h-6" />, label: "Email Us", val: "care@vivaanfarms.com" },
                  { icon: <Phone className="w-6 h-6" />, label: "Call Us", val: "+91 98765 43210" },
                  { icon: <MapPin className="w-6 h-6" />, label: "Visit Farm", val: "Rajkot, Gujarat, India" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg border border-primary/5 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-[#7A6848] uppercase tracking-[2px] mb-1">{item.label}</div>
                      <div className="text-xl font-bold text-primary">{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-[#EBF5EE] rounded-[32px] border border-primary/10">
                <div className="flex items-center gap-4 mb-4">
                  <MessageSquare className="text-primary" />
                  <h3 className="font-headline text-2xl font-black text-primary">Live Support</h3>
                </div>
                <p className="text-sm text-[#7A6848] font-medium mb-6">Our farm desk is available Mon-Sat, 9am - 7pm IST.</p>
                <button className="h-12 px-8 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl">Chat on WhatsApp</button>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-primary/5">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Full Name</label>
                    <Input placeholder="Enter your name" className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Email Address</label>
                    <Input placeholder="name@example.com" className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Subject</label>
                  <Input placeholder="How can we help?" className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7A6848]">Your Message</label>
                  <Textarea placeholder="Tell us more about your inquiry..." className="min-h-[160px] rounded-2xl bg-[#F9F6EF] border-transparent font-bold p-5" />
                </div>
                <Button className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl flex items-center justify-center gap-3">
                  Send Message <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav activeTab="account" onTabChange={handleTabChange} cartCount={totalQty} />
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); router.push('/checkout'); }}
      />
    </div>
  );
}
