"use client";

import React, { useState, useMemo } from 'react';
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
import { PRODUCTS, TESTIMONIALS, CERTS } from '@/lib/data';
import { Category, Product } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { Star } from 'lucide-react';
import { naturalLanguageProductSearch } from '@/ai/flows/natural-language-product-search';

export default function VivaanFarms() {
  const [filter, setFilter] = useState<Category>('all');
  const [aiCategories, setAiCategories] = useState<Category[] | null>(null);
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
      // Scroll to products
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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Ticker />
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={totalQty}
        onFilter={handleCategoryFilter}
        onSearch={handleSearch}
      />
      
      <main>
        <Hero />
        
        <div className="bg-destructive animate-shim-ruby py-3 flex items-center justify-center gap-3 text-sm font-black text-white">
          <div className="w-2 h-2 rounded-full bg-white blink"></div>
          🔥 <strong>127 people</strong> bought Gir Cow Ghee in the last 24 hours · <strong>Limited Stock</strong> — Order Now!
        </div>

        <TrustBar />

        <section className="py-20" id="products">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="text-center mb-16 space-y-4">
              <div className="text-[10px] font-black text-[#7A6A52] tracking-[3px] uppercase">Our Collection</div>
              <h2 className="font-headline text-5xl md:text-6xl font-extrabold leading-none">Handcrafted with<br />Ancient Bilona Method</h2>
              <p className="text-base text-[#7A6A52] max-w-lg mx-auto leading-relaxed font-medium">
                Every jar tells the story of our Gujarat farm, our Gir cows, and centuries of tradition.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center mb-12">
              {[
                { key: 'all', lbl: 'All Products', icon: '🌿' },
                { key: 'ghee', lbl: 'Ghee', icon: '🧈' },
                { key: 'oil', lbl: 'Oils', icon: '🫙' },
                { key: 'combo', lbl: 'Combos', icon: '🎁' },
                { key: 'superfoods', lbl: 'Superfoods', icon: '🌾' },
              ].map((c) => (
                <button 
                  key={c.key}
                  onClick={() => handleCategoryFilter(c.key as Category)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full border-2 transition-all font-bold text-sm ${filter === c.key && !aiCategories ? 'bg-[#EBF7F1] border-secondary text-primary shadow-xl scale-105' : 'bg-white border-border text-[#7A6A52] hover:border-secondary/50'}`}
                >
                  <span className="text-lg">{c.icon}</span>
                  {c.lbl}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        <section className="py-20 bg-[#F0EBE0]">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
             <div className="text-center mb-16 space-y-4">
              <div className="text-[10px] font-black text-[#7A6A52] tracking-[3px] uppercase">Why Choose Vivaan</div>
              <h2 className="font-headline text-5xl md:text-6xl font-extrabold leading-none">We Follow the<br />Ancient Way</h2>
              <p className="text-base text-[#7A6A52] max-w-lg mx-auto leading-relaxed font-medium">
                Because your family deserves nothing less than what our ancestors knew to be pure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { t: 'Native Sourcing', d: 'Highest quality raw materials from indigenous Gir cows of Gujarat — no crossbreeds, ever.', ico: '🐄' },
                { t: 'Bilona Process', d: 'Hand-churned curd, not centrifuged cream. The ancient technique that preserves all nutrition.', ico: '🧈' },
                { t: 'Quality Checks', d: '70+ NABL lab tests per batch — every jar is certified pure before it reaches your doorstep.', ico: '🔬' },
                { t: 'Better Rural Lives', d: '5,000+ farmer families empowered with every Vivaan product you buy. Your purchase matters.', ico: '🌾' },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-border rounded-[32px] p-8 text-center group hover:translate-y-[-4px] transition-all hover:shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#EBF7F1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="w-20 h-20 bg-[#D0EDDF]/50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border-2 border-secondary/10 relative z-10 group-hover:scale-110 transition-transform">
                    {item.ico}
                   </div>
                   <h3 className="text-lg font-black text-primary mb-3 relative z-10">{item.t}</h3>
                   <p className="text-[13px] text-[#7A6A52] leading-relaxed relative z-10">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center mb-16 space-y-4">
              <div className="text-[10px] font-black text-[#7A6A52] tracking-[3px] uppercase">How It's Made</div>
              <h2 className="font-headline text-5xl md:text-6xl font-extrabold leading-none">The Bilona Journey</h2>
              <p className="text-base text-[#7A6A52] max-w-lg mx-auto leading-relaxed font-medium">Four sacred steps between a Gir cow in Gujarat and the golden ghee in your kitchen.</p>
          </div>
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
             <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#D0EDDF] via-secondary to-[#D0EDDF] z-0"></div>
             {[
               { t: 'Collect A2 Milk', d: 'Fresh milk from indigenous Gir cows, collected twice daily at sunrise from our Gujarat farm.', n: 1 },
               { t: 'Culture into Curd', d: 'Milk is set overnight into dahi using natural probiotic cultures — no shortcuts, ever.', n: 2 },
               { t: 'Hand-Churn (Bilona)', d: 'Curd is hand-churned to separate butter — the ancient way that preserves A2 nutrients.', n: 3 },
               { t: 'Slow-Cook Ghee', d: 'Butter is gently simmered over low heat to yield pure, fragrant, golden ghee.', n: 4 },
             ].map((step) => (
               <div key={step.n} className="text-center relative z-10 px-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-3xl font-black mx-auto mb-6 shadow-xl ring-8 ring-secondary/5">
                    {step.n}
                  </div>
                  <h4 className="text-lg font-black text-foreground mb-3">{step.t}</h4>
                  <p className="text-sm text-[#7A6A52] leading-relaxed">{step.d}</p>
               </div>
             ))}
          </div>
        </section>

        <FeaturedBanner onCta={() => handleCategoryFilter('combo')} />

        <section className="py-20 bg-[#F0EBE0]">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <div className="text-center mb-16 space-y-4">
              <div className="text-[10px] font-black text-[#7A6A52] tracking-[3px] uppercase">Customer Love</div>
              <h2 className="font-headline text-5xl md:text-6xl font-extrabold leading-none">What Our Families Say</h2>
              <p className="text-base text-[#7A6A52] max-w-lg mx-auto leading-relaxed font-medium">Over 12,000 verified reviews from families who have made Vivaan their daily choice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-white border border-border rounded-[28px] p-8 shadow-sm hover:translate-y-[-4px] transition-all hover:shadow-2xl">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FEF8E6] to-[#F0EBE0] rounded-full flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {t.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black text-foreground">{t.name}</div>
                        <div className="text-[10px] text-[#7A6A52] font-semibold mt-0.5">{t.loc} · {t.time}</div>
                      </div>
                      <div className="flex shrink-0">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-[#E0A838] fill-current" />)}
                      </div>
                   </div>
                   <p className="text-[13.5px] text-[#7A6A52] leading-loose italic mb-4">{t.body}</p>
                   <div className="text-[10px] text-secondary font-black uppercase tracking-wider">🛒 {t.prod}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center mb-12">
              <div className="text-[10px] font-black text-[#7A6A52] tracking-[3px] uppercase mb-4">Certifications</div>
              <h2 className="font-headline text-5xl md:text-6xl font-extrabold leading-none">Trusted by Every Authority</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {CERTS.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-20 h-20 bg-gradient-to-br from-white to-[#F0EDE5] rounded-full flex items-center justify-center border-2 border-border shadow-md transition-all group-hover:translate-y-[-4px]">
                   <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="transition-all group-hover:scale-110">
                    <circle cx="18" cy="18" r="16" fill="none" stroke={c.color} strokeWidth="1.6" opacity=".3"/>
                    <circle cx="18" cy="18" r="12" fill="none" stroke={c.color} strokeWidth="1.4"/>
                    <path d="M14 18l3 3 5.5-6" stroke={c.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[10px] font-black text-[#7A6A52] tracking-wider text-center">{c.abbr}</span>
              </div>
            ))}
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
    </div>
  );
}
