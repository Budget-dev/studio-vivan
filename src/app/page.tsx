"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Ticker } from '@/components/vivaan/Ticker';
import { Hero } from '@/components/vivaan/Hero';
import { TrustBar } from '@/components/vivaan/TrustBar';
import { ProductCard } from '@/components/vivaan/ProductCard';
import { FeaturedBanner } from '@/components/vivaan/FeaturedBanner';
import { WhyChoose } from '@/components/vivaan/WhyChoose';
import { NativeSection } from '@/components/vivaan/NativeSection';
import { Footer } from '@/components/vivaan/Footer';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { SplashScreen } from '@/components/vivaan/SplashScreen';
import { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { naturalLanguageProductSearch } from '@/ai/flows/natural-language-product-search';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', ico: '🌿' },
  { id: 'ghee', label: 'A2 Ghee', ico: '🐄' },
  { id: 'sweets', label: 'Sweets', ico: '🎁' },
  { id: 'honey', label: 'Honey', ico: '🍯' },
];

export default function VivaanFarms() {
  const router = useRouter();
  const db = useFirestore();
  
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: dbProducts, isLoading: productsLoading } = useCollection(productsRef);

  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();

  useEffect(() => {
    if (!productsLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [productsLoading]);

  const products = useMemo(() => {
    if (!dbProducts) return [];
    
    return dbProducts
      .filter(p => p.isLive !== false)
      .map((p, i) => {
        const catId = (p.categoryId || 'uncategorized').toLowerCase();
        const basePrice = Number(p.basePrice) || 0;
        
        return {
          ...p,
          cat: catId,
          price: basePrice,
          mrpPrice: Number(p.mrpPrice) || basePrice,
          vol: p.volumeValue ? `${p.volumeValue}${p.volumeUnit || ''}` : 'Standard',
          pi: i,
          rating: Number(p.rating) || 4.9,
          reviewCount: Number(p.reviewCount) || 0,
          soldCountLabel: p.soldCountLabel || 'Hot',
          statusBadge: p.statusBadge || '',
          badges: Array.isArray(p.badges) ? p.badges : [],
          vars: Array.isArray(p.vars) && p.vars.length > 0 
            ? p.vars 
            : [{ s: 'Standard', p: basePrice, on: true }]
        } as Product;
      });
  }, [dbProducts]);

  const handleSearch = async (queryStr: string) => {
    if (!queryStr.trim()) {
      setFilter('all');
      return;
    }
    try {
      const res = await naturalLanguageProductSearch({ query: queryStr });
      if (res.categories.length > 0) {
        setFilter(res.categories[0]);
      }
      const el = document.getElementById('products');
      el?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCategoryFilter = (cat: string) => {
    setFilter(cat);
    const el = document.getElementById('products');
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'cart') {
      setIsCartOpen(true);
      setActiveTab('home');
    } else if (tab === 'shop') {
      const el = document.getElementById('products');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveTab('home');
    } else if (tab === 'account') {
      router.push('/track');
    }
  };

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter(p => p.cat === filter);
  }, [products, filter]);

  const gheeProducts = useMemo(() => products.filter(p => p.cat === 'ghee').slice(0, 6), [products]);
  const sweetsProducts = useMemo(() => products.filter(p => p.cat === 'sweets').slice(0, 6), [products]);
  const honeyProducts = useMemo(() => products.filter(p => p.cat === 'honey').slice(0, 6), [products]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999]"
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("sticky top-0 z-[900] transition-opacity duration-500", showSplash ? "opacity-0" : "opacity-100")}>
        <Ticker />
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          cartCount={totalQty}
          onFilter={handleCategoryFilter}
          onSearch={handleSearch}
        />
      </div>
      
      <motion.div 
        animate={{ 
          opacity: showSplash ? 0 : 1,
          scale: showSplash ? 0.98 : 1
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "min-h-screen bg-[#F9F6EF] text-[#100C06] overflow-x-hidden pb-[68px] md:pb-0"
        )}
      >
        <main>
          <Hero />
          
          <div className="text-center py-5 md:py-12 px-5 bg-white border-b border-primary/5">
            <h2 className="font-headline text-3xl md:text-6xl font-extrabold text-primary mb-1 leading-tight">
              Welcome To Vivaan Farms!
            </h2>
            <p className="text-[#7A6848] text-[9px] md:text-lg font-medium tracking-wide uppercase">
              You're One Step Closer to Purity
            </p>
            <div className="w-10 h-0.5 bg-primary/10 mx-auto mt-3 rounded-full"></div>
          </div>

          <TrustBar />

          <section className="py-4 md:py-16" id="products">
            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
              <div className="flex justify-center mb-4 md:mb-12 overflow-x-auto no-scrollbar px-2 w-full">
                <div className="flex gap-1.5 md:gap-3 items-center bg-white p-1 md:p-1.5 rounded-full border border-[#DDD0B5]/50 shadow-sm w-fit max-w-full overflow-hidden transform-gpu translate-z-0">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryFilter(cat.id)}
                      className={cn(
                        "flex items-center gap-1 md:gap-2 px-3.5 md:px-7 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-black transition-all whitespace-nowrap",
                        filter === cat.id 
                          ? "bg-primary text-white shadow-lg scale-105" 
                          : "text-[#7A6848] hover:bg-primary/5"
                      )}
                    >
                      <span className="text-sm md:text-lg">{cat.ico}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/50 rounded-[32px] aspect-[3/4] animate-pulse border-2 border-dashed border-[#DDD0B5]/30"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                    {filteredProducts.map((p) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        isInCart={cart.some(c => c.id === p.id)}
                        onOpen={() => router.push(`/product/${p.id}`)}
                        onAdd={() => addToCart(p)}
                      />
                    ))}
                    {filteredProducts.length === 0 && !productsLoading && (
                      <div className="col-span-full py-16 text-center bg-white/50 rounded-[32px] border-2 border-dashed border-primary/10 mx-auto w-full max-w-2xl">
                        <div className="text-4xl mb-4">🍃</div>
                        <h3 className="font-headline text-2xl font-bold text-primary">Harvesting New Batches</h3>
                        <p className="text-muted-foreground mt-2 text-sm font-medium">No products found in this category yet. Check back soon!</p>
                      </div>
                    )}
                  </div>

                  {filteredProducts.length > 0 && (
                    <div className="mt-8 md:mt-16 flex justify-center">
                      <button 
                        onClick={() => handleCategoryFilter('all')}
                        className="h-12 md:h-16 px-8 md:px-14 rounded-full border-2 border-primary text-primary font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl flex items-center gap-3 group active:scale-95 text-xs md:text-base"
                      >
                        See All Products <Sparkles className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <div className="bg-[#0D3520] py-4 md:py-8 flex items-center justify-center text-white px-5 border-y border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex items-center gap-4 md:gap-8 text-center relative z-10">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20">
                <Coins className="text-yellow-400 w-5 h-5 md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <div className="font-headline text-lg md:text-4xl font-extrabold leading-tight">Get Upto 25% Off with Purity Coins! →</div>
                <p className="text-[8px] md:text-xs font-bold text-white/40 uppercase tracking-[2px] mt-1">Collect coins on every order and save big on your next haul</p>
              </div>
            </div>
          </div>

          <WhyChoose />

          <div className="space-y-12 md:space-y-28 py-10 md:py-28 bg-[#FDFBFA]">
            {/* A2 Ghee Peek Section */}
            {gheeProducts.length > 0 && (
              <section className="max-w-[1400px] mx-auto">
                <div className="px-5 md:px-10 flex items-end justify-between mb-4 md:mb-12 gap-4">
                  <div className="space-y-0.5 md:space-y-2">
                    <span className="text-[9px] font-black text-primary uppercase tracking-[2px]">Traditional Roots</span>
                    <h2 className="font-headline text-2xl md:text-6xl font-extrabold text-primary leading-none">A2 Gir Ghee</h2>
                  </div>
                </div>
                
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 px-5 md:grid md:grid-cols-4 md:px-10 md:gap-8">
                  {gheeProducts.map((p) => (
                    <div key={p.id} className="min-w-[72%] sm:min-w-[45%] md:min-w-0 snap-start">
                      <ProductCard product={p} isInCart={cart.some(c => c.id === p.id)} onOpen={() => router.push(`/product/${p.id}`)} onAdd={() => addToCart(p)} />
                    </div>
                  ))}
                </div>

                <div className="mt-4 md:mt-12 px-5 md:px-10 flex items-center justify-between">
                  <div className="flex-1 max-w-[100px] md:max-w-xs h-1 bg-[#F9F6EF] rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full shadow-[0_0_8px_rgba(27,94,59,0.2)]"></div>
                  </div>
                  <button 
                    onClick={() => handleCategoryFilter('ghee')}
                    className="h-8 md:h-12 px-5 md:px-8 rounded-full border-2 border-[#100C06]/5 hover:border-primary/20 text-[#100C06] font-black uppercase tracking-widest text-[8px] md:text-[11px] flex items-center gap-2 group transition-all"
                  >
                    See All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>
            )}

            {/* Farm Sweets Peek Section */}
            {sweetsProducts.length > 0 && (
              <section className="max-w-[1400px] mx-auto">
                <div className="px-5 md:px-10 flex items-end justify-between mb-4 md:mb-12 gap-4">
                  <div className="space-y-0.5 md:space-y-2">
                    <span className="text-[9px] font-black text-secondary uppercase tracking-[2px]">Artisanal Treats</span>
                    <h2 className="font-headline text-2xl md:text-6xl font-extrabold text-[#100C06] leading-none">Farm Sweets</h2>
                  </div>
                </div>
                
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 px-5 md:grid md:grid-cols-4 md:px-10 md:gap-8">
                  {sweetsProducts.map((p) => (
                    <div key={p.id} className="min-w-[72%] sm:min-w-[45%] md:min-w-0 snap-start">
                      <ProductCard product={p} isInCart={cart.some(c => c.id === p.id)} onOpen={() => router.push(`/product/${p.id}`)} onAdd={() => addToCart(p)} />
                    </div>
                  ))}
                </div>

                <div className="mt-4 md:mt-12 px-5 md:px-10 flex items-center justify-between">
                  <div className="flex-1 max-w-[100px] md:max-w-xs h-1 bg-[#F9F6EF] rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-secondary rounded-full"></div>
                  </div>
                  <button 
                    onClick={() => handleCategoryFilter('sweets')}
                    className="h-8 md:h-12 px-5 md:px-8 rounded-full border-2 border-[#100C06]/5 hover:border-secondary/20 text-[#100C06] font-black uppercase tracking-widest text-[8px] md:text-[11px] flex items-center gap-2 group transition-all"
                  >
                    See All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>
            )}

            {/* Forest Honey Peek Section */}
            {honeyProducts.length > 0 && (
              <section className="max-w-[1400px] mx-auto">
                <div className="px-5 md:px-10 flex items-end justify-between mb-4 md:mb-12 gap-4">
                  <div className="space-y-0.5 md:space-y-2">
                    <span className="text-[9px] font-black text-accent uppercase tracking-[2px]">Wild & Raw</span>
                    <h2 className="font-headline text-2xl md:text-6xl font-extrabold text-primary leading-none">Forest Honey</h2>
                  </div>
                </div>
                
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 px-5 md:grid md:grid-cols-4 md:px-10 md:gap-8">
                  {honeyProducts.map((p) => (
                    <div key={p.id} className="min-w-[72%] sm:min-w-[45%] md:min-w-0 snap-start">
                      <ProductCard product={p} isInCart={cart.some(c => c.id === p.id)} onOpen={() => router.push(`/product/${p.id}`)} onAdd={() => addToCart(p)} />
                    </div>
                  ))}
                </div>

                <div className="mt-4 md:mt-12 px-5 md:px-10 flex items-center justify-between">
                  <div className="flex-1 max-w-[100px] md:max-w-xs h-1 bg-[#F9F6EF] rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full"></div>
                  </div>
                  <button 
                    onClick={() => handleCategoryFilter('honey')}
                    className="h-8 md:h-12 px-5 md:px-8 rounded-full border-2 border-[#100C06]/5 hover:border-primary/20 text-[#100C06] font-black uppercase tracking-widest text-[8px] md:text-[11px] flex items-center gap-2 group transition-all"
                  >
                    See All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>
            )}
          </div>

          <NativeSection />
          <FeaturedBanner onCta={() => handleCategoryFilter('all')} />
        </main>

        <Footer />
      </motion.div>

      <BottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cartCount={totalQty}
      />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); router.push('/checkout'); }}
      />
    </>
  );
}
