
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
import { CheckCircle2, Award, Heart, ShieldCheck, History, Sprout } from 'lucide-react';

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
      <div className="sticky top-0 z-[900]">
        <Ticker />
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          cartCount={totalQty}
          onFilter={() => router.push('/')}
          onSearch={() => router.push('/')}
        />
      </div>

      <main>
        <section className="relative h-[400px] md:h-[500px] flex items-center overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/farmabout/1600/800" 
            alt="Vivaan Farms Gujarat Heritage" 
            fill 
            className="object-cover brightness-50"
            priority
          />
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full relative z-10 text-white">
            <div className="max-w-2xl">
              <span className="inline-block bg-primary text-white text-[10px] font-black tracking-[3px] uppercase px-4 py-1.5 rounded-full mb-6">Our Gujarat Heritage</span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold leading-none mb-6">Traditional Bilona Ghee,<br />Crafted with Integrity.</h1>
              <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed">
                At Vivaan Farms, we don't just sell organic food; we revive the ancient Vedic traditions of our ancestors. From the Gir cows of Gujarat to your kitchen, purity is our only priority.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-headline text-4xl md:text-6xl font-extrabold leading-tight text-primary">The Vedic Bilona Method: A Lost Art Reborn</h2>
                <div className="w-20 h-1 bg-primary"></div>
              </div>
              <p className="text-[#7A6848] text-lg leading-relaxed font-medium">
                Mainstream commercial ghee is often a product of machines and heavy processing. At Vivaan Farms, we follow the authentic **Vedic Bilona Process**. We boil pure A2 milk from indigenous Gir cows, set it to curd overnight, and then hand-churn that curd in the early morning hours to obtain traditional butter.
              </p>
              <p className="text-[#7A6848] text-lg leading-relaxed font-medium">
                This butter is then slowly melted over a wood fire (Chulha), resulting in the golden, granular nectar that has been a staple of Indian wellness for centuries. This labor-intensive process preserves vital fat-soluble vitamins and the divine aroma that industrial methods simply cannot match.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { icon: <History className="text-primary" />, text: "Ancestral Recipes" },
                  { icon: <Sprout className="text-primary" />, text: "100% Chemical Free" },
                  { icon: <ShieldCheck className="text-primary" />, text: "Direct Farm Source" },
                  { icon: <Award className="text-primary" />, text: "NABL Lab Tested" },
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
                alt="Traditional Bilona Churning Process for A2 Ghee" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#F1EAD8]">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center mb-16 space-y-4">
            <span className="text-[10px] font-black text-[#7A6848] tracking-[3px] uppercase">The Pillars of Purity</span>
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold text-primary">Rooted in Earth, Driven by Truth</h2>
          </div>
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Award className="w-10 h-10 text-primary" />, 
                title: "Ethical Gir Cow Farming", 
                desc: "Our cows are treated as family. They graze freely on organic pastures, are never injected with hormones, and are milked only after the calves have had their fill." 
              },
              { 
                icon: <Heart className="w-10 h-10 text-primary" />, 
                title: "Single-Source Integrity", 
                desc: "Every jar of Vivaan Ghee or Honey is traceable to a single origin. We never mix batches, ensuring the same consistent quality and purity in every purchase." 
              },
              { 
                icon: <ShieldCheck className="w-10 h-10 text-primary" />, 
                title: "Traditional Slow Cooking", 
                desc: "We prioritize nutrition over yield. By slow-cooking our ghee over wood fires, we ensure that the natural enzymes and antioxidants remain intact for your health." 
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
