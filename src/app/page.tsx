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
import { ArrowRight, Coins } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', ico: '🌿' },
  { id: 'ghee', label: 'A2 Ghee', ico: '🐄' },
  { id: 'sweets', label: 'Sweets', ico: '🎁' },
  { id: 'honey', label: 'Honey', ico: '🍯' },
];

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!productsLoading) {
        setShowSplash(false);
      }
    }, 2500); 
    return () => clearTimeout(timer);
  }, [productsLoading]);

  const products = useMemo(() => {
    if (!dbProducts) return [];
    return dbProducts.map((p, i) => ({
      ...p,
      cat: (p.categoryId || 'uncategorized').toLowerCase(),
      price: p.basePrice || 0,
      vol: p.volumeValue ? `${p.volumeValue} ${p.volumeUnit}` : 'Standard',
      pi: i,
      rating: p.rating || 4.9,
      reviewCount: p.reviewCount || 0,
      soldCountLabel: p.soldCountLabel || '',
      statusBadge: p.statusBadge || '',
      badges: p.badges || [],
      vars: p.vars || p.variants || [{ s: 'Standard', p: p.basePrice || 0, on: true }]
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

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter(p => p.cat === filter);
  }, [products, filter]);

  // Group products for "All" view categories
  const categoryGroups = useMemo(() => {
    if (filter !== 'all') return null;
    return CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
      ...cat,
      items: products.filter(p => p.cat === cat.id)
    })).filter(g => g.items.length > 0);
  }, [products, filter]);

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
          {/* Promo Bar */}
          <div className="bg-[#1B3A20] py-2.5 flex items-center justify-center font-bold text-white text-[11px] tracking-wide relative overflow-hidden">
            <span className="bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase mr-2">PURE15</span>
            15% OFF + FREE Delivery above ₹999
          </div>

          <Hero />
          
          {/* Welcome Section */}
          <div className="text-center py-10 md:py-16 px-5 bg-white border-b border-primary/5">
            <h2 className="font-headline text-3xl md:text-6xl font-extrabold text-primary mb-3 leading-tight">
              Welcome To Vivaan Farms!
            </h2>
            <p className="text-[#7A6848] text-sm md:text-xl font-medium tracking-wide uppercase">
              You're One Step Closer to Purity
            </p>
            <div className="w-20 h-1 bg-primary/10 mx-auto mt-6 rounded-full"></div>
          </div>

          <TrustBar />

          <section className="py-8 md:py-20" id="products">
            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
              {/* Responsive Category Scroller */}
              <div className="flex justify-center mb-10 md:mb-16 overflow-x-auto no-scrollbar px-2 w-full">
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

              {productsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/50 rounded-[32px] aspect-[3/4] animate-pulse border-2 border-dashed border-[#DDD0B5]/30"></div>
                  ))}
                </div>
              ) : filter === 'all' && categoryGroups ? (
                /* Grouped horizontal rows when "All" is selected */
                <div className="space-y-12 md:space-y-24">
                  {categoryGroups.map((group) => (
                    <div key={group.id} className="space-y-6 md:space-y-10">
                      <div className="flex items-end justify-between px-1">
                        <div>
                          <h3 className="font-headline text-3xl md:text-5xl font-extrabold text-primary">{group.label}</h3>
                          <div className="w-12 h-1 bg-primary/20 mt-2 rounded-full"></div>
                        </div>
                        <button 
                          onClick={() => handleCategoryFilter(group.id)}
                          className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5 hover:gap-3 transition-all"
                        >
                          See All Collection <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Horizontal Peek Scroll Container */}
                      <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 -mx-5 px-5 pb-6">
                        {group.items.map((p) => (
                          <div key={p.id} className="min-w-[82%] md:min-w-[300px] snap-center">
                            <ProductCard 
                              product={p} 
                              isInCart={cart.some(c => c.id === p.id)}
                              onOpen={() => setSelectedProduct(p)}
                              onAdd={() => addToCart(p)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Grid view when specific filter is selected */
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
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <div className="text-4xl mb-4">🍃</div>
                      <h3 className="font-headline text-2xl font-bold text-primary">No products found</h3>
                      <p className="text-muted-foreground mt-2">Try selecting a different category.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Reward Bar */}
          <div className="bg-[#0D3520] py-4 md:py-6 flex items-center justify-center text-white px-5 border-y border-white/5">
            <div className="flex items-center gap-3 md:gap-6 text-center">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <Coins className="text-yellow-400 w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <div className="font-headline text-lg md:text-3xl font-extrabold leading-tight">Get Upto 25% Off with Purity Coins! →</div>
                <p className="text-[9px] md:text-xs font-bold text-white/40 uppercase tracking-widest mt-0.5">Collect coins on every order and save big on your next haul</p>
              </div>
            </div>
          </div>

          <WhyChoose />
          <NativeSection />
          <FeaturedBanner onCta={() => handleCategoryFilter('all')} />
          <VideoSection />
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
