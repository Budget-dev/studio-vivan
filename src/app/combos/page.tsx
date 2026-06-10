
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Combo } from '@/types';
import { Sparkles, ArrowRight, ShoppingCart, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CombosPage() {
  const router = useRouter();
  const db = useFirestore();
  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const combosRef = useMemoFirebase(() => {
    return query(
      collection(db, 'combos'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
  }, [db]);

  const { data: combos, isLoading } = useCollection<Combo>(combosRef);

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={totalQty}
        onFilter={() => router.push('/')}
        onSearch={() => router.push('/')}
      />

      <main className="py-12 md:py-24">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black text-primary tracking-[4px] uppercase bg-primary/5 px-4 py-2 rounded-full">Curated Collections</span>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary">Farm Fresh Combos</h1>
            <p className="text-[#7A6848] text-lg font-medium max-w-2xl mx-auto">
              Savor the ultimate purity. Our bundles are thoughtfully paired to bring you the best of Vivaan Farms at an exceptional value.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-white rounded-[40px] animate-pulse"></div>
              ))}
            </div>
          ) : combos && combos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              {combos.map((combo) => (
                <div key={combo.id} className="group relative bg-white rounded-[40px] overflow-hidden shadow-xl border border-primary/5 hover:shadow-2xl transition-all">
                  <div className="aspect-[16/11] relative overflow-hidden">
                    <Image 
                      src={combo.backgroundImage} 
                      alt={combo.title} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-6 left-6 bg-accent text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {combo.offerText}
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-12 space-y-6">
                    <div>
                      <div className="text-[10px] font-black text-primary uppercase tracking-[3px] mb-2">{combo.subtitle}</div>
                      <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-primary leading-tight">{combo.title}</h2>
                    </div>
                    
                    <p className="text-[#7A6848] text-sm md:text-base leading-relaxed font-medium line-clamp-3">
                      {combo.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-[#F9F6EF]">
                      <div className="flex flex-col">
                        <span className="text-xs text-[#7A6848] line-through font-bold">MRP ₹{combo.mrpPrice.toLocaleString('en-IN')}</span>
                        <span className="font-headline text-4xl font-black text-primary">₹{combo.price.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <button 
                        onClick={() => router.push('/')}
                        className="h-14 px-8 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-secondary transition-all flex items-center gap-2 group"
                      >
                        {combo.buttonText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-[40px] border-2 border-dashed border-primary/10">
              <Sparkles className="w-16 h-16 text-primary/20 mx-auto mb-6" />
              <h3 className="font-headline text-3xl font-extrabold text-primary">New Combos Harvested Soon</h3>
              <p className="text-[#7A6848] mt-2">We're handcrafting fresh bundles for you. Check back shortly!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav activeTab="shop" onTabChange={(t) => t === 'shop' ? null : router.push(t === 'home' ? '/' : `/${t}`)} cartCount={totalQty} />
      
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
