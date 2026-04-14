"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Ticker } from '@/components/vivaan/Ticker';
import { Hero } from '@/components/vivaan/Hero';
import { TrustBar } from '@/components/vivaan/TrustBar';
import { ProductCard } from '@/components/vivaan/ProductCard';
import { FeaturedBanner } from '@/components/vivaan/FeaturedBanner';
import { VideoSection } from '@/components/vivaan/VideoSection';
import { WhyChoose } from '@/components/vivaan/WhyChoose';
import { NativeSection } from '@/components/vivaan/NativeSection';
import { Footer } from '@/components/vivaan/Footer';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { ProductModal } from '@/components/vivaan/ProductModal';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { SplashScreen } from '@/components/vivaan/SplashScreen';
import { Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { naturalLanguageProductSearch } from '@/ai/flows/natural-language-product-search';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';

export default function VivaanFarms() {
  const router = useRouter();
  const db = useFirestore();
  
  const productsQuery = useMemoFirebase(() => query(collection(db, 'products'), where('isLive', '==', true)), [db]);
  const { data: dbProducts, isLoading: productsLoading } = useCollection(productsQuery);

  const [filter, setFilter] = useState<string>('all');
  const [aiCategories, setAiCategories] = useState<string[] | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();

  // Hide splash screen after minimum duration and content loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!productsLoading) {
        setShowSplash(false);
      }
    }, 2500); 

    return () => clearTimeout(timer);
  }, [productsLoading]);

  // Ensure splash hides even if products fail to load or take too long
  useEffect(() => {
    const backupTimer = setTimeout(() => {
      setShowSplash(false);
    }, 6000); 
    return () => clearTimeout(backupTimer);
  }, []);

  const products = useMemo(() => {
    if (!dbProducts) return [];
    return dbProducts.map((p, i) => ({
      ...p,
      price: p.basePrice || 0,
      vol: p.volumeValue ? `${p.volumeValue} ${p.volumeUnit}` : 'Standard',
      pi: i,
      rating: p.rating || 4.9,
      reviewCount: p.reviewCount || 0,
      soldCountLabel: p.soldCountLabel || '',
      statusBadge: p.statusBadge || '',
      badges: p.badges || [],
      vars: p.variants || [{ s: 'Standard', p: p.basePrice || 0, on: true }]
    } as Product));
  }, [dbProducts]);

  const handleSearch = async (queryStr: string) => {
    if (!queryStr.trim()) {
      setAiCategories(null);
      setFilter('all');
      return;
    }
    try {
      const res = await naturalLanguageProductSearch({ query: queryStr });
      setAiCategories(res.categories);
      const el = document.getElementById('products');
      el?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = useMemo(() => {
    if (aiCategories) {
      if (aiCategories.includes('all')) return products;
      return products.filter(p => aiCategories.includes(p.cat));
    }
    if (filter === 'all') return products;
    return products.filter(p => p.cat === filter);
  }, [filter, aiCategories, products]);

  const handleCategoryFilter = (cat: string) => {
    setAiCategories(null);
    setFilter(cat);
    const el = document.getElementById('products');
    el?.scrollIntoView({ behavior: 'smooth' });
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
    }
  };

  const handleBuyNow = (p: Product, q: number) => {
    addToCart(p, q);
    setSelectedProduct(null);
    router.push('/checkout');
  };

  const CATEGORIES = [
    { id: 'all', label: 'All', ico: '🌿' },
    { id: 'ghee', label: 'A2 Ghee', ico: '🐄' },
    { id: 'sweets', label: 'Sweets', ico: '🎁' },
    { id: 'honey', label: 'Honey', ico: '🍯' },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999]"
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Ticker and Header (above scaling div) */}
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
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "min-h-screen bg-[#F9F6EF] text-[#100C06] overflow-x-hidden pb-[68px] md:pb-0"
        )}
      >
        <main>
          <div className="bg-[#1B3A20] py-2.5 flex items-center justify-center font-bold text-white text-[11px] tracking-wide relative overflow-hidden">
            <span className="bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase mr-2">PURE15</span>
            15% OFF + FREE Delivery above ₹999
          </div>

          <Hero />
          
          <TrustBar />

          <section className="py-8 md:py-20" id="products">
            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
              {/* Optimized Category Bar for Mobile */}
              <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto no-scrollbar px-2 w-full">
                <div className="flex gap-1.5 md:gap-4 items-center bg-white p-1 rounded-full border border-[#DDD0B5]/50 shadow-sm min-w-max md:min-w-0">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryFilter(cat.id)}
                      className={cn(
                        "flex items-center gap-1 md:gap-1.5 px-3 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-black transition-all whitespace-nowrap",
                        filter === cat.id 
                          ? "bg-primary text-white shadow-lg scale-105" 
                          : "text-[#7A6848] hover:bg-primary/5"
                      )}
                    >
                      <span className="text-xs md:text-base">{cat.ico}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center mb-6 md:mb-16 space-y-3">
                <div className="text-[9px] font-black text-[#7A6848] tracking-[2.5px] uppercase">TRADITIONAL COLLECTION</div>
                <h2 className="font-headline text-3xl md:text-6xl font-extrabold leading-none capitalize">
                  {filter === 'all' ? 'Pure Farm Purity' : `${filter} Collection`}
                </h2>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/50 rounded-[32px] aspect-[3/4] animate-pulse border-2 border-dashed border-[#DDD0B5]/30"></div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      isInCart={cart.some(c => c.id === p.id)}
                      onOpen={() => setSelectedProduct(p)}
                      onAdd={() => addToCart(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-[#7A6848] font-medium italic bg-white/50 rounded-[40px] border-2 border-dashed border-[#DDD0B5]">
                  No products found in this category.
                </div>
              )}
            </div>
          </section>

          <WhyChoose />
          <NativeSection />
          <FeaturedBanner onCta={() => handleCategoryFilter('all')} />
          <VideoSection />
        </main>

        <Footer />
      </motion.div>

      {/* Truly Fixed Components (Outside transforming containers) */}
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

      <ProductModal 
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
      />
    </>
  );
}
