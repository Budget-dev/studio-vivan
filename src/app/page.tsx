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
      setActiveTab('home'); // Reset so nav highlight works correctly when closing
    } else if (tab === 'shop') {
      const el = document.getElementById('products');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveTab('home');
    }
    // Handle other tabs as needed for specific mobile pages
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
        {/* Promo Strip - High-end replacement for the blinking banner */}
        <div className="bg-gradient-to-r from-[#1B3A20] via-[#0D3520] to-[#1B3A20] py-2.5 flex items-center justify-center font-bold text-white text-[11px] tracking-wide relative overflow-hidden promo-shine">
          <span className="bg-[#C49A2A]/25 border border-[#C49A2A]/50 text-[#F5D060] px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase mr-2">PURE15</span>
          15% OFF + FREE Delivery above ₹999
        </div>

        <Hero />
        
        {/* Urgency Bar - Refined style */}
        <div className="bg-gradient-to-r from-[#C03030] via-[#A82020] to-[#C03030] py-2 flex items-center justify-center gap-2 text-[11px] font-bold text-white shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-white blink"></div>
          🔥 <strong>127 people</strong> bought Gir Cow Ghee in the last 24 hours
        </div>

        <TrustBar />

        {/* Social Proof Strip */}
        <div className="mx-4 md:mx-auto max-w-[1400px] mt-4 bg-white border border-[#DDD0B5] rounded-2xl p-3 flex items-center gap-3 shadow-sm md:hidden">
           <div className="flex -space-x-2.5">
              {['😊','👩','🧔','👴'].map((emoji, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-[#FBF3DC] to-[#F1EAD8] flex items-center justify-center text-sm">
                  {emoji}
                </div>
              ))}
           </div>
           <div className="text-[11px] leading-tight">
              <strong>50,000+ families</strong> trust Vivaan Farms · ⭐ 4.9 on 12k+ reviews
           </div>
        </div>

        <section className="py-12 md:py-20" id="products">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="text-center mb-10 md:mb-16 space-y-3">
              <div className="text-[9px] font-black text-[#7A6848] tracking-[2.5px] uppercase">BROWSE COLLECTION</div>
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold leading-none">Ancient Bilona Method</h2>
              <p className="text-sm md:text-base text-[#7A6848] max-w-lg mx-auto leading-relaxed font-medium px-4">
                Handcrafted from our Gujarat farm to your doorstep.
              </p>
            </div>

            {/* Category Row - App style for mobile */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-6 -mx-5 px-5 md:justify-center md:pb-12">
              {[
                { key: 'all', lbl: 'All Products', icon: '🌿' },
                { key: 'ghee', lbl: 'A2 Ghee', icon: '🧈' },
                { key: 'oil', lbl: 'Desi Oils', icon: '🫙' },
                { key: 'combo', lbl: 'Combos', icon: '🎁' },
                { key: 'superfoods', lbl: 'Super', icon: '🌾' },
              ].map((c) => (
                <button 
                  key={c.key}
                  onClick={() => handleCategoryFilter(c.key as Category)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full border-1.5 transition-all font-bold text-xs ${filter === c.key && !aiCategories ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-[#DDD0B5] text-[#7A6848] hover:border-primary/30'}`}
                >
                  <span className="text-sm">{c.icon}</span>
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

        {/* Stats Strip */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 mb-12">
          <div className="grid grid-cols-3 gap-px bg-[#DDD0B5] border border-[#DDD0B5] rounded-2xl overflow-hidden">
            <div className="bg-white py-4 text-center">
              <div className="font-headline text-2xl font-extrabold text-primary">50K+</div>
              <div className="text-[9px] font-bold text-[#7A6848] uppercase tracking-wider">Happy Families</div>
            </div>
            <div className="bg-white py-4 text-center">
              <div className="font-headline text-2xl font-extrabold text-primary">70+</div>
              <div className="text-[9px] font-bold text-[#7A6848] uppercase tracking-wider">Lab Tests</div>
            </div>
            <div className="bg-white py-4 text-center">
              <div className="font-headline text-2xl font-extrabold text-primary">100%</div>
              <div className="text-[9px] font-bold text-[#7A6848] uppercase tracking-wider">Farm Direct</div>
            </div>
          </div>
        </div>

        <FeaturedBanner onCta={() => handleCategoryFilter('combo')} />

        <section className="py-20 bg-[#F1EAD8]">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="text-center mb-16 space-y-4">
              <div className="text-[10px] font-black text-[#7A6848] tracking-[3px] uppercase">WHY VIVAAN FARMS</div>
              <h2 className="font-headline text-5xl md:text-6xl font-extrabold leading-none">The Purest Ghee<br />Families Deserve</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { t: 'Indigenous Gir Cows', d: 'Never commercial dairy — only native A2 cows.', ico: '🐄' },
                { t: 'Ancient Bilona', d: 'Hand-churned from curd, never centrifuged.', ico: '🧈' },
                { t: 'NABL Certified', d: '70+ quality tests every single batch.', ico: '🔬' },
                { t: 'Gujarat Farm Direct', d: 'Zero middlemen. Pure truth.', ico: '🏡' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-[#DDD0B5] rounded-[24px] p-8 text-center group hover:translate-y-[-4px] transition-all hover:shadow-2xl">
                   <div className="w-16 h-16 bg-[#EBF5EE] rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                    {item.ico}
                   </div>
                   <h3 className="text-lg font-black text-primary mb-3">{item.t}</h3>
                   <p className="text-[13px] text-[#7A6848] leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-headline text-5xl md:text-6xl font-extrabold leading-none">What Our Families Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-[#FDFAF4] border border-[#DDD0B5] rounded-[24px] p-8 relative">
                   <div className="absolute top-6 right-8 text-4xl text-primary/10 font-serif">❝</div>
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FBF3DC] to-[#F1EAD8] rounded-full flex items-center justify-center text-2xl shrink-0">
                        {t.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black text-foreground">{t.name}</div>
                        <div className="text-[10px] text-[#7A6848] font-semibold mt-0.5">{t.loc}</div>
                      </div>
                   </div>
                   <p className="text-[13.5px] text-[#7A6848] leading-relaxed italic mb-4">"{t.body}"</p>
                   <div className="text-[10px] text-primary font-black uppercase tracking-wider flex items-center gap-2">🛒 {t.prod}</div>
                </div>
              ))}
            </div>
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

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cartCount={totalQty}
      />
    </div>
  );
}
