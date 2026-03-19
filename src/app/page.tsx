"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/vivaan/Header';
import { Ticker } from '@/components/vivaan/Ticker';
import { Hero } from '@/components/vivaan/Hero';
import { TrustBar } from '@/components/vivaan/TrustBar';
import { ProductCard } from '@/components/vivaan/ProductCard';
import { FeaturedBanner } from '@/components/vivaan/FeaturedBanner';
import { Footer } from '@/components/vivaan/Footer';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { ProductModal } from '@/components/vivaan/ProductModal';
import { PaymentModal } from '@/components/vivaan/PaymentModal';
import { SuccessModal } from '@/components/vivaan/SuccessModal';
import { LiveNotification } from '@/components/vivaan/LiveNotification';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { PRODUCTS, TESTIMONIALS, CERTS } from '@/lib/data';
import { Category, Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { Star } from 'lucide-react';
import { naturalLanguageProductSearch } from '@/ai/flows/natural-language-product-search';

export default function VivaanFarms() {
  const [filter, setFilter] = useState<Category>('all');
  const [aiCategories, setAiCategories] = useState<Category[] | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const { cart, addToCart, updateQty, removeFromCart, subtotal, totalQty, clearCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setAiCategories(null);
      setFilter('all');
      return;
    }
    try {
      const res = await naturalLanguageProductSearch({ query });
      setAiCategories(res.categories as Category[]);
      const el = document.getElementById('products');
      el?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = useMemo(() => {
    if (aiCategories) {
      if (aiCategories.includes('all')) return PRODUCTS;
      return PRODUCTS.filter(p => aiCategories.includes(p.cat));
    }
    if (filter === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.cat === filter);
  }, [filter, aiCategories]);

  const handleCategoryFilter = (cat: Category) => {
    setAiCategories(null);
    setFilter(cat);
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

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] overflow-x-hidden pb-[68px] md:pb-0">
      <Ticker />
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={totalQty}
        onFilter={handleCategoryFilter}
        onSearch={handleSearch}
      />
      
      <main>
        <div className="bg-gradient-to-r from-[#1B3A20] via-[#0D3520] to-[#1B3A20] py-2.5 flex items-center justify-center font-bold text-white text-[11px] tracking-wide relative overflow-hidden promo-shine">
          <span className="bg-[#C49A2A]/25 border border-[#C49A2A]/50 text-[#F5D060] px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase mr-2">PURE15</span>
          15% OFF + FREE Delivery above ₹999
        </div>

        <Hero />
        
        <div className="bg-gradient-to-r from-[#C03030] via-[#A82020] to-[#C03030] py-2 flex items-center justify-center gap-2 text-[11px] font-bold text-white shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-white blink"></div>
          🔥 <strong>142 people</strong> bought farm-fresh goods in the last 24 hours
        </div>

        <TrustBar />

        <section className="py-12 md:py-20" id="products">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="text-center mb-8 md:mb-16 space-y-3">
              <div className="text-[9px] font-black text-[#7A6848] tracking-[2.5px] uppercase">BROWSE COLLECTION</div>
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold leading-none">Traditional Farm Purity</h2>
              <p className="text-sm md:text-base text-[#7A6848] max-w-lg mx-auto leading-relaxed font-medium px-4">
                Handcrafted A2 Ghee, Sun-dried Pickles, and Forest Honey.
              </p>
            </div>

            {/* Category Row - More Compact on Mobile */}
            <div className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide pb-6 -mx-5 px-5 md:justify-center md:pb-12">
              {[
                { key: 'all', lbl: 'All Goods', icon: '🌿' },
                { key: 'ghee', lbl: 'A2 Ghee', icon: '🧈' },
                { key: 'pickles', lbl: 'Pickles', icon: '🌶️' },
                { key: 'sweets', lbl: 'Sweets', icon: '🎁' },
                { key: 'honey', lbl: 'Honey', icon: '🍯' },
              ].map((c) => (
                <button 
                  key={c.key}
                  onClick={() => handleCategoryFilter(c.key as Category)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 md:px-5 md:py-2.5 rounded-full border-1.5 transition-all font-bold text-[10px] md:text-xs ${filter === c.key && !aiCategories ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-[#DDD0B5] text-[#7A6848] hover:border-primary/30'}`}
                >
                  <span className="text-xs md:text-sm">{c.icon}</span>
                  {c.lbl}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  isInWishlist={isInWishlist(p.id)}
                  isInCart={cart.some(c => c.id === p.id)}
                  onOpen={() => setSelectedProduct(p)}
                  onAdd={() => addToCart(p)}
                  onWish={() => toggleWishlist(p.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <FeaturedBanner onCta={() => handleCategoryFilter('combo')} />

        <section className="py-20 bg-[#F1EAD8]">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center space-y-4">
            <div className="text-[10px] font-black text-[#7A6848] tracking-[3px] uppercase">THE VIVAAN PROMISE</div>
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold leading-none">Purity You Can Taste</h2>
            <p className="text-[#7A6848] max-w-2xl mx-auto">From the Gir cows of Gujarat to sun-dried spices, we bring the true essence of Indian heritage to your table.</p>
          </div>
        </section>
      </main>

      <Footer />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); setIsPaymentOpen(true); }}
      />

      <ProductModal 
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={Math.max(0, subtotal - 200)}
        itemCount={totalQty}
        onSuccess={() => { setIsPaymentOpen(false); setIsSuccessOpen(true); }}
      />

      <SuccessModal 
        isOpen={isSuccessOpen}
        onClose={() => { setIsSuccessOpen(false); clearCart(); }}
        total={Math.max(0, subtotal - 200)}
      />

      <LiveNotification />

      <BottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cartCount={totalQty}
      />
    </div>
  );
}
