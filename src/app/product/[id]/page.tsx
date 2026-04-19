
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  X, 
  Star, 
  Truck, 
  RefreshCw, 
  FlaskConical, 
  Home, 
  Plus, 
  Minus, 
  ChevronLeft,
  ShoppingBag,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Banknote
} from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Product } from '@/types';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { useCart } from '@/hooks/use-cart';
import { ComboIcon, JarIcon } from '@/components/vivaan/JarIcon';
import { aiProductUsageAndRecipeIdeas, RecipeIdeasOutput } from '@/ai/flows/ai-product-usage-and-recipe-ideas';
import HoneyLoader from '@/components/vivaan/HoneyLoader';
import { Button } from '@/components/ui/button';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const productRef = useMemoFirebase(() => id ? doc(db, 'products', id as string) : null, [db, id]);
  const { data: dbProduct, isLoading: productLoading } = useDoc(productRef);
  
  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [aiData, setAiData] = useState<RecipeIdeasOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showHoneyLoader, setShowHoneyLoader] = useState(false);

  // Transform DB product to app type
  const product = useMemo(() => {
    if (!dbProduct) return null;
    return {
      ...dbProduct,
      price: Number(dbProduct.basePrice) || 0,
      mrp: Number(dbProduct.mrpPrice) || Number(dbProduct.basePrice) || 0,
      off: dbProduct.statusBadge || 'BEST PRICE',
      rat: Number(dbProduct.rating) || 4.9,
      revs: Number(dbProduct.reviewCount) || 0,
      sold: dbProduct.soldCountLabel || 'Hot',
      cat: (dbProduct.categoryId || 'ghee').toLowerCase(),
      vol: dbProduct.volumeValue ? `${dbProduct.volumeValue}${dbProduct.volumeUnit || ''}` : 'Standard',
      vars: Array.isArray(dbProduct.vars) && dbProduct.vars.length > 0 ? dbProduct.vars : [{ s: 'Standard', p: Number(dbProduct.basePrice) || 0, on: true }]
    } as any;
  }, [dbProduct]);

  useEffect(() => {
    if (product) {
      const defaultVar = product.vars.find((v: any) => v.on) || product.vars[0];
      setSelectedSize(defaultVar.s);
      
      if (product.cat === 'honey') {
        setShowHoneyLoader(true);
        setTimeout(() => setShowHoneyLoader(false), 2000);
      }

      const fetchAi = async () => {
        setLoadingAi(true);
        try {
          const res = await aiProductUsageAndRecipeIdeas({
            name: product.name,
            description: product.description || product.name,
            category: product.cat,
            volume: product.vol
          });
          setAiData(res);
        } catch (e) {
          console.error("AI fetch failed", e);
        } finally {
          setLoadingAi(false);
        }
      };
      fetchAi();
    }
  }, [product]);

  if (productLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product && !productLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="font-headline text-4xl font-extrabold text-primary mb-4">Product Not Found</h1>
        <Button onClick={() => router.push('/')} className="bg-primary text-white rounded-full">Back to Farm</Button>
      </div>
    );
  }

  const currentVar = product.vars.find((v: any) => v.s === selectedSize) || product.vars[0];
  const displayPrice = currentVar.p;

  const handleBuyNow = () => {
    addToCart({ ...product, price: displayPrice, vol: selectedSize } as any, qty);
    router.push('/checkout');
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

      {showHoneyLoader && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <HoneyLoader />
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-5 py-6 md:py-12">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-primary font-bold text-sm mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </button>

        <div className="bg-white rounded-[32px] md:rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-primary/5">
          {/* Visual Section */}
          <div className="lg:w-1/2 bg-gradient-to-br from-[#FAF4E6] to-[#EEE0BC] p-8 md:p-20 flex flex-col items-center justify-center relative min-h-[400px]">
            <div className="absolute top-[-30px] right-[-30px] w-48 md:w-80 h-48 md:h-80 rounded-full bg-[radial-gradient(circle,rgba(27,94,59,0.1),transparent_70%)] pointer-events-none"></div>
            
            <div className="bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-16 shadow-2xl relative group overflow-hidden max-w-[440px] w-full aspect-square flex items-center justify-center border border-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(255,255,255,0.5),transparent_60%)] pointer-events-none"></div>
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105 group-hover:rotate-[-2deg]">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={product.imageUrls[0]} 
                      alt={product.name} 
                      fill 
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                ) : (
                  <>
                    {product.cat === 'combo' ? (
                      <ComboIcon className="scale-[1.8]" />
                    ) : (
                      <JarIcon c1="#D4EDE0" c2="#1B5E3B" sub="" idSuffix="page" className="scale-[2.2]" />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Floating Certs */}
            <div className="mt-12 flex gap-4 overflow-x-auto no-scrollbar max-w-full px-4">
              {['100% Pure', 'NABL Tested', 'Bilona Method', 'Gir Cow A2'].map((tag, i) => (
                <div key={i} className="shrink-0 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-primary">
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 md:p-16 lg:p-20 overflow-y-auto bg-white">
            <div className="inline-flex items-center gap-2 bg-destructive/5 border border-destructive/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"></div>
              <span className="text-[11px] font-bold text-destructive">Limited Stock · Harvested Recently</span>
            </div>

            <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-primary leading-[1.05] mb-4">{product.name}</h1>
            <p className="text-xs md:text-sm text-muted-foreground font-black tracking-[3px] uppercase mb-8">{selectedSize} · GUJARAT FARM DIRECT</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-primary/5 px-4 py-3 rounded-2xl border border-primary/10">
                <span className="font-headline text-3xl font-extrabold text-primary">{product.rat}</span>
                <div className="flex flex-col">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rat) ? 'text-primary fill-current' : 'text-border'}`} />)}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{product.revs}+ reviews</span>
                </div>
              </div>
              <div className="bg-[#FFF8E7] px-4 py-3 rounded-2xl border border-[#F5D110]/20">
                <div className="text-xs font-black text-[#8B6E0F]">🔥 Hot Product</div>
                <div className="text-[10px] font-bold text-[#8B6E0F]/60">{product.sold} sold</div>
              </div>
            </div>

            <div className="bg-[#0D3520] rounded-3xl p-8 mb-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white/5 pointer-events-none"></div>
              <div className="font-headline text-6xl md:text-7xl font-extrabold mb-2 relative z-1">₹{displayPrice.toLocaleString('en-IN')}</div>
              <div className="flex items-center gap-4 relative z-1 mb-6">
                {product.mrp > displayPrice && <span className="text-lg text-white/30 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>}
                <span className="bg-white/20 text-white border border-white/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{product.off}</span>
              </div>
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-xs font-black text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> CODE: PURE15
                </div>
                <span className="text-[11px] md:text-xs text-white/60 font-medium">Get extra 15% off at checkout!</span>
              </div>
            </div>

            <div className="mb-10">
               <div className="text-[11px] font-black text-muted-foreground tracking-[3px] uppercase mb-5">Select Packaging</div>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.vars.map((v: any) => (
                    <button 
                      key={v.s}
                      onClick={() => setSelectedSize(v.s)}
                      className={`py-4 px-4 rounded-2xl border-2 transition-all text-center ${selectedSize === v.s ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border bg-white hover:border-primary/20'}`}
                    >
                      <div className="text-base font-black text-foreground">{v.s}</div>
                      <div className="text-xs text-muted-foreground font-bold mt-1">₹{v.p.toLocaleString('en-IN')}</div>
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center bg-[#F9F6EF] border-2 border-[#DDD0B5] rounded-full h-16 overflow-hidden sm:w-40">
                 <button onClick={() => setQty(q => Math.max(1, q-1))} className="flex-1 h-full hover:bg-primary/5 flex items-center justify-center transition-all"><Minus className="w-5 h-5" /></button>
                 <span className="w-10 text-center text-xl font-black">{qty}</span>
                 <button onClick={() => setQty(q => Math.min(99, q+1))} className="flex-1 h-full hover:bg-primary/5 flex items-center justify-center transition-all"><Plus className="w-5 h-5" /></button>
              </div>
              <Button 
                onClick={() => { addToCart({ ...product, price: displayPrice, vol: selectedSize } as any, qty); setIsCartOpen(true); }}
                className="flex-1 h-16 bg-foreground hover:bg-primary text-white font-black uppercase tracking-[2px] rounded-full transition-all text-sm"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="flex-[1.2] h-16 bg-primary text-white font-black uppercase tracking-[2px] rounded-full shadow-2xl hover:translate-y-[-2px] transition-all text-sm"
              >
                Buy Now ✦
              </Button>
            </div>

            <div className="space-y-8">
              <div className="bg-[#F9F6EF] rounded-[32px] p-8 border border-primary/5">
                <h4 className="text-[11px] font-black text-primary tracking-[3px] uppercase mb-5">Why it's Pure</h4>
                <p className="text-sm md:text-base text-[#7A6848] leading-relaxed font-medium">{product.description || 'Our farm-direct goods are crafted using ancient traditions, ensuring every drop is packed with nature\'s goodness and traditional wisdom.'}</p>
              </div>

              {loadingAi ? (
                <div className="space-y-4 animate-pulse p-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : aiData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-primary/5 rounded-[32px] p-8">
                    <h4 className="text-[11px] font-black text-primary tracking-[3px] uppercase mb-6 flex items-center gap-2">
                      <span className="text-lg">👩‍🍳</span> AI Recipe Ideas
                    </h4>
                    <div className="space-y-5">
                      {aiData.recipeIdeas.map((recipe, i) => (
                        <div key={i} className="group">
                          <div className="text-sm font-black text-secondary mb-1 group-hover:text-primary transition-colors">{recipe.title}</div>
                          <div className="text-[11px] text-muted-foreground italic leading-relaxed">{recipe.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border-2 border-primary/5 rounded-[32px] p-8">
                     <h4 className="text-[11px] font-black text-primary tracking-[3px] uppercase mb-6 flex items-center gap-2">
                      <span className="text-lg">💡</span> Pro Usage Tips
                    </h4>
                    <ul className="space-y-4">
                      {aiData.usageTips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-[11px] font-medium text-[#7A6848]">
                          <span className="text-primary mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { i: <Truck />, l: 'Free Shipping' },
                  { i: <RefreshCw />, l: 'Easy Returns' },
                  { i: <FlaskConical />, l: 'Lab Certified' },
                  { i: <Home />, l: 'Farm Direct' },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-primary/5 rounded-2xl p-5 text-center shadow-sm">
                    <div className="text-primary mb-2 flex justify-center">{item.i}</div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{item.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav activeTab="shop" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} cartCount={totalQty} />
      
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
