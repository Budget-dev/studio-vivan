"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { PaymentModal } from '@/components/vivaan/PaymentModal';
import { SuccessModal } from '@/components/vivaan/SuccessModal';
import { ComboIcon, JarIcon } from '@/components/vivaan/JarIcon';
import { Button } from '@/components/ui/button';
import { PRODUCTS } from '@/lib/data';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { aiProductUsageAndRecipeIdeas, RecipeIdeasOutput } from '@/ai/flows/ai-product-usage-and-recipe-ideas';
import { DynamicVideoGrid, type Frame } from '@/components/vivaan/DynamicVideoGrid';
import ScrollExpandMedia from '@/components/vivaan/ScrollExpandMedia';
import { Star, Truck, RefreshCw, FlaskConical, Home, Plus, Minus, Heart } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faLightbulb, faPepperHot, faCookieBite, faDroplet } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = PRODUCTS.find(p => p.id === Number(id));

  const { cart, addToCart, updateQty, removeFromCart, totalQty, clearCart, subtotal } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [aiData, setAiData] = useState<RecipeIdeasOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    if (product) {
      const defaultVar = product.vars.find(v => v.on) || product.vars[0];
      setSelectedSize(defaultVar.s);
      
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black">Product Not Found</h2>
          <Button onClick={() => router.push('/')} className="rounded-full">Go Back Home</Button>
        </div>
      </div>
    );
  }

  const currentVar = product.vars.find(v => v.s === selectedSize) || product.vars[0];
  const price = currentVar.p;

  const handleAddToCart = () => {
    addToCart({ ...product, price, vol: selectedSize }, qty);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, price, vol: selectedSize }, qty);
    setIsPaymentOpen(true);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'home' || tab === 'shop') {
      router.push('/');
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    }
  };

  const getProductIcon = () => {
    if (product.cat === 'combo') return <ComboIcon className="w-full h-full drop-shadow-2xl" />;
    if (product.cat === 'pickles') return <FontAwesomeIcon icon={faPepperHot} className="text-9xl text-primary/80" />;
    if (product.cat === 'sweets') return <FontAwesomeIcon icon={faCookieBite} className="text-9xl text-primary/80" />;
    if (product.cat === 'honey') return <FontAwesomeIcon icon={faDroplet} className="text-9xl text-primary/80" />;
    return <JarIcon c1="#D4EDE0" c2="#1B5E3B" sub="" idSuffix="detail" className="w-full h-full drop-shadow-2xl" />;
  };

  const videoUrl = "https://cdn.shopify.com/videos/c/vp/8a895a0c0d5b48edad21523773790e4d/8a895a0c0d5b48edad21523773790e4d.HD-720p-1.6Mbps-51250342.mp4";
  
  const videoFrames: Frame[] = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    video: videoUrl,
    defaultPos: { x: (i % 3) * 4, y: Math.floor(i / 3) * 4, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1.1,
    borderThickness: 0,
    borderSize: 100
  }));

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={totalQty}
        onFilter={() => router.push('/')}
        onSearch={() => router.push('/')}
      />

      <main className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="lg:w-[45%]">
            <div className="bg-white rounded-[40px] aspect-square flex items-center justify-center p-12 border border-[#DDD0B5] shadow-sm relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(27,94,59,0.05),transparent_60%)]"></div>
               <div className="relative z-10 transition-transform duration-700 group-hover:scale-105">
                 {getProductIcon()}
               </div>
               <button 
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md",
                  isInWishlist(product.id) ? "bg-red-50 text-red-500" : "bg-white/80 text-primary hover:bg-white"
                )}
               >
                 <Heart className={cn("w-6 h-6", isInWishlist(product.id) && "fill-current")} />
               </button>
            </div>
          </div>

          <div className="lg:w-[55%] space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                  {product.cat}
                </span>
                <div className="flex items-center bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-600">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  <span className="text-xs font-black">{product.rat}</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">({product.revs} reviews)</span>
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-foreground leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-[#7A6848] leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            <div className="flex items-end gap-6">
              <div className="font-headline text-6xl font-extrabold text-foreground">
                ₹{price.toLocaleString('en-IN')}
              </div>
              {product.mrp && product.mrp > price && (
                <div className="text-2xl text-[#B0A080] line-through mb-2">₹{product.mrp.toLocaleString('en-IN')}</div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-foreground tracking-[2px] uppercase">Select Pack Size</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.vars.map((v) => (
                  <button 
                    key={v.s}
                    onClick={() => setSelectedSize(v.s)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all",
                      selectedSize === v.s 
                        ? "border-primary bg-primary/[0.03] ring-4 ring-primary/5" 
                        : "border-[#DDD0B5] bg-white hover:border-primary/40"
                    )}
                  >
                    <div className={cn(
                      "text-[10px] font-black uppercase tracking-widest mb-1",
                      selectedSize === v.s ? "text-primary" : "text-[#7A6848]"
                    )}>{v.s}</div>
                    <div className="text-base font-black text-foreground">₹{v.p.toLocaleString('en-IN')}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-white border-2 border-[#DDD0B5] rounded-full h-16 overflow-hidden px-2">
                 <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-12 h-12 rounded-full hover:bg-primary/5 flex items-center justify-center transition-all"><Minus className="w-5 h-5" /></button>
                 <span className="w-12 text-center text-xl font-black">{qty}</span>
                 <button onClick={() => setQty(q => Math.min(99, q+1))} className="w-12 h-12 rounded-full hover:bg-primary/5 flex items-center justify-center transition-all"><Plus className="w-5 h-5" /></button>
              </div>
              <Button 
                onClick={handleAddToCart}
                className="flex-1 h-16 bg-white border-2 border-primary text-primary hover:bg-primary/5 font-black uppercase tracking-widest rounded-full transition-all text-sm"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="flex-[1.5] h-16 bg-primary text-white font-black uppercase tracking-widest rounded-full shadow-2xl hover:translate-y-[-2px] transition-all text-sm"
              >
                Buy Now ✦
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#DDD0B5]">
              {[
                { i: <Truck className="w-5 h-5" />, l: 'Free Delivery' },
                { i: <RefreshCw className="w-5 h-5" />, l: '30-Day Return' },
                { i: <FlaskConical className="w-5 h-5" />, l: 'Lab Tested' },
                { i: <Home className="w-5 h-5" />, l: 'Farm Direct' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-[#DDD0B5]/50">
                  <div className="text-primary">{item.i}</div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest text-center">{item.l}</div>
                </div>
              ))}
            </div>

            <div className="space-y-16 pt-10">
              <ScrollExpandMedia
                mediaType="video"
                mediaSrc={videoUrl}
                bgImageSrc="https://picsum.photos/seed/vivaanbg/1920/1080"
                title="Purity Unleashed"
                scrollToExpand="Scroll to See Purity"
                textBlend={false}
              >
                <div className="text-center py-10">
                  <h3 className="font-headline text-4xl md:text-6xl font-black text-primary">Farm to Kitchen Journey</h3>
                  <p className="text-[#7A6848] max-w-xl mx-auto mt-4 font-medium">Witness the sacred process of crafting our A2 Gir Ghee, from the grazing fields of Gujarat to your home.</p>
                </div>
              </ScrollExpandMedia>

              <section className="space-y-8">
                <div className="text-center space-y-2">
                  <h4 className="text-[11px] font-black text-primary tracking-[4px] uppercase flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                    Experience the Purity
                  </h4>
                  <h2 className="font-headline text-4xl md:text-5xl font-black">Visual Purity Grid</h2>
                </div>
                <DynamicVideoGrid frames={videoFrames} showFrames={false} />
              </section>

              {loadingAi ? (
                <div className="space-y-6 pt-4 animate-pulse">
                  <div className="h-4 bg-[#DDD0B5]/40 rounded w-3/4"></div>
                  <div className="h-32 bg-[#DDD0B5]/20 rounded-3xl"></div>
                </div>
              ) : aiData && (
                <>
                  <section className="space-y-6">
                    <h4 className="text-[11px] font-black text-foreground tracking-[3px] uppercase flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUtensils} className="text-primary text-xs" />
                      </div>
                      AI Recipe Ideas
                    </h4>
                    <div className="grid gap-4">
                      {aiData.recipeIdeas.map((recipe, i) => (
                        <div key={i} className="bg-white p-6 rounded-[28px] border border-[#DDD0B5] shadow-sm hover:shadow-md transition-all">
                          <div className="text-xs font-black text-primary mb-2 uppercase tracking-widest">{recipe.title}</div>
                          <div className="text-[13px] text-[#7A6848] leading-relaxed font-medium">{recipe.description}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h4 className="text-[11px] font-black text-foreground tracking-[3px] uppercase flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FontAwesomeIcon icon={faLightbulb} className="text-primary text-xs" />
                      </div>
                      Usage Tips
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiData.usageTips.map((tip, i) => (
                        <li key={i} className="flex gap-4 p-4 rounded-2xl bg-primary/5 text-[12px] text-primary font-bold border border-primary/10">
                          <span className="text-primary/40 mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav activeTab="shop" onTabChange={handleTabChange} cartCount={totalQty} />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); setIsPaymentOpen(true); }}
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
    </div>
  );
}
