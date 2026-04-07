
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { useCart } from '@/hooks/use-cart';
import { CheckCircle2, Award, Heart, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
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
      <Ticker />
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={totalQty}
        onFilter={() => router.push('/')}
        onSearch={() => router.push('/')}
      />

      <main>
        <section className="relative h-[400px] md:h-[500px] flex items-center overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/farmabout/1600/800" 
            alt="Vivaan Farms Gujarat" 
            fill 
            className="object-cover brightness-50"
            priority
          />
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full relative z-10 text-white">
            <div className="max-w-2xl">
              <span className="inline-block bg-primary text-white text-[10px] font-black tracking-[3px] uppercase px-4 py-1.5 rounded-full mb-6">Our Legacy</span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold leading-none mb-6">Traditional Wisdom,<br />Modern Purity.</h1>
              <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed">
                Born in the heart of Gujarat, Vivaan Farms is a tribute to the ancient Bilona method and the indigenous Gir cows that have nourished generations.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-headline text-4xl md:text-6xl font-extrabold leading-tight text-primary">The Bilona Method: A Lost Art Revived</h2>
                <div className="w-20 h-1 bg-primary"></div>
              </div>
              <p className="text-[#7A6848] text-lg leading-relaxed font-medium">
                Unlike commercial ghee made from heavy machinery and cream, our ghee is crafted using the ancient Vedic process. We boil whole A2 milk, set it to curd overnight, and then hand-churn that curd in the early morning hours to obtain pure butter.
              </p>
              <p className="text-[#7A6848] text-lg leading-relaxed font-medium">
                This butter is then slowly melted over a wood fire to produce the golden, granular nectar we call Vivaan Farms A2 Ghee. It's a labor of love that preserves the vital nutrients and the divine aroma that machine-made ghee simply cannot replicate.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { icon: <CheckCircle2 className="text-primary" />, text: "No Middlemen" },
                  { icon: <CheckCircle2 className="text-primary" />, text: "100% Traceable" },
                  { icon: <CheckCircle2 className="text-primary" />, text: "NABL Certified" },
                  { icon: <CheckCircle2 className="text-primary" />, text: "Gujarat Farm Direct" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-black uppercase tracking-wider">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src="https://picsum.photos/seed/churning/800/800" 
                alt="Bilona Churning Process" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#F1EAD8]">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center mb-16 space-y-4">
            <span className="text-[10px] font-black text-[#7A6848] tracking-[3px] uppercase">The Vivaan Pillars</span>
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold text-primary">Built on Truth</h2>
          </div>
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Award className="w-10 h-10 text-primary" />, 
                title: "Uncompromising Quality", 
                desc: "Every single batch undergoes 70+ rigorous tests in NABL-certified labs to ensure zero contamination." 
              },
              { 
                icon: <Heart className="w-10 h-10 text-primary" />, 
                title: "Ethical Sourcing", 
                desc: "We treat our cows like family. They graze freely, are fed organic fodder, and are never injected with hormones." 
              },
              { 
                icon: <ShieldCheck className="w-10 h-10 text-primary" />, 
                title: "Transparent Heritage", 
                desc: "We invite our customers to visit our farm in Gujarat. We have nothing to hide because we sell only what we consume." 
              },
            ].map((pillar, i) => (
              <div key={i} className="bg-white p-10 rounded-[32px] border border-[#DDD0B5] text-center space-y-6 hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-[#EBF5EE] rounded-2xl flex items-center justify-center mx-auto">
                  {pillar.icon}
                </div>
                <h3 className="font-headline text-2xl font-black text-primary">{pillar.title}</h3>
                <p className="text-[#7A6848] text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>
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
