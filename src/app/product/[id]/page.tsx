"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Star, 
  Truck, 
  RefreshCw, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  History,
  FlaskConical,
  ChefHat
} from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, limit, query, where } from 'firebase/firestore';
import { Product } from '@/types';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { useCart } from '@/hooks/use-cart';
import { JarIcon, ComboIcon } from '@/components/vivaan/JarIcon';
import { aiProductUsageAndRecipeIdeas, RecipeIdeasOutput } from '@/ai/flows/ai-product-usage-and-recipe-ideas';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/vivaan/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const productRef = useMemoFirebase(() => id ? doc(db, 'products', id as string) : null, [db, id]);
  const { data: dbProduct, isLoading: productLoading } = useDoc(productRef);
  
  // Related products query
  const relatedRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: allProducts } = useCollection(relatedRef);
  
  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [aiData, setAiData] = useState<RecipeIdeasOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Standardize product data
  const mapProductData = (p: any, index: number = 0): Product => {
    const basePrice = Number(p.basePrice) || 0;
    return {
      ...p,
      price: basePrice,
      mrpPrice: Number(p.mrpPrice) || basePrice,
      rat: Number(p.rating) || 4.9,
      revs: Number(p.reviewCount) || 120,
      sold: p.soldCountLabel || 'Hot',
      cat: (p.categoryId || 'ghee').toLowerCase(),
      vol: p.volumeValue ? `${p.volumeValue}${p.volumeUnit || ''}` : 'Standard',
      pi: index,
      vars: Array.isArray(p.vars) && p.vars.length > 0 
        ? p.vars 
        : [{ s: 'Standard', p: basePrice, on: true }]
    } as any;
  };

  // Transform main product
  const product = useMemo(() => {
    if (!dbProduct) return null;
    return mapProductData(dbProduct);
  }, [dbProduct]);

  // Transform and filter related products
  const relatedProducts = useMemo(() => {
    if (!allProducts || !product) return [];
    return allProducts
      .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
      .map((p, i) => mapProductData(p, i))
      .slice(0, 4);
  }, [allProducts, product]);

  useEffect(() => {
    if (product) {
      const defaultVar = product.vars.find((v: any) => v.on) || product.vars[0];
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

  if (productLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
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
    <div className="min-h-screen bg-[#FDFBFA] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={totalQty}
        onFilter={() => router.push('/')}
        onSearch={() => router.push('/')}
      />

      <main className="max-w-[1400px] mx-auto px-4 md:px-10 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-[#7A6848] uppercase tracking-widest mb-6 md:mb-10 overflow-x-auto whitespace-nowrap no-scrollbar">
          <span className="cursor-pointer hover:text-primary" onClick={() => router.push('/')}>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="cursor-pointer hover:text-primary uppercase">{product.cat}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary truncate">{product.name}</span>
        </div>

        {/* TOP SECTION: Visuals & Buy Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mb-20">
          {/* Gallery Area */}
          <div className="space-y-6">
            <div className="bg-[#F8F6F0] rounded-[32px] md:rounded-[48px] p-8 md:p-16 aspect-square flex items-center justify-center relative overflow-hidden group border border-[#EEE0BC]/30">
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
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
                  product.cat === 'combo' ? <ComboIcon className="scale-[1.8]" /> : <JarIcon c1="#D4EDE0" c2="#1B5E3B" sub="" idSuffix="page" className="scale-[2.2]" />
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={cn(
                  "w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-[#F8F6F0] flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer",
                  i === 0 ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                )}>
                   {product.imageUrls && product.imageUrls.length > i ? (
                     <div className="relative w-[80%] h-[80%]">
                       <Image src={product.imageUrls[i]} alt="Thumb" fill className="object-contain" />
                     </div>
                   ) : (
                     <div className="text-2xl">{i === 0 ? '🧈' : i === 1 ? '🌿' : i === 2 ? '🥛' : '🔬'}</div>
                   )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Pane */}
          <div className="flex flex-col">
            <div className="space-y-2 mb-4">
              <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-primary leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1">
                   {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-3.5 h-3.5", i < 4 ? "text-yellow-400 fill-current" : "text-border")} />)}
                 </div>
                 <span className="text-[11px] font-black text-[#7A6848] uppercase tracking-widest">{product.reviewCount} Verified Reviews</span>
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="font-headline text-5xl font-black">₹{displayPrice.toLocaleString('en-IN')}</span>
              {product.mrpPrice > displayPrice && (
                <div className="flex flex-col mb-1">
                  <span className="text-sm text-[#7A6848]/40 line-through font-bold">MRP ₹{product.mrpPrice.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest">You Save ₹{product.mrpPrice - displayPrice}</span>
                </div>
              )}
            </div>

            <div className="bg-[#EBF5EE] rounded-2xl p-4 mb-10 flex items-center gap-3 border border-primary/5">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">🪙</div>
              <div>
                <div className="text-xs font-black text-primary uppercase">Earn +{Math.round(displayPrice * 0.1)} Purity Coins</div>
                <div className="text-[10px] font-medium text-[#7A6848]">Redeem for extra discounts on your next farm haul.</div>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <div className="text-[10px] font-black text-[#7A6848] uppercase tracking-[3px] mb-4">Select Variant</div>
                <div className="flex flex-wrap gap-3">
                  {product.vars.map((v: any) => (
                    <button 
                      key={v.s}
                      onClick={() => setSelectedSize(v.s)}
                      className={cn(
                        "px-6 py-3 rounded-xl border-2 transition-all text-sm font-black",
                        selectedSize === v.s ? "border-primary bg-primary text-white" : "border-[#EEE0BC] bg-white text-[#7A6848] hover:border-primary/40"
                      )}
                    >
                      {v.s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center bg-[#F9F6EF] border-2 border-[#EEE0BC] rounded-xl h-14 overflow-hidden w-32 shrink-0">
                   <button onClick={() => setQty(q => Math.max(1, q-1))} className="flex-1 h-full hover:bg-primary/5 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                   <span className="w-8 text-center text-sm font-black">{qty}</span>
                   <button onClick={() => setQty(q => Math.min(99, q+1))} className="flex-1 h-full hover:bg-primary/5 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                </div>
                <Button 
                  onClick={() => { addToCart({ ...product, price: displayPrice, vol: selectedSize } as any, qty); setIsCartOpen(true); }}
                  className="flex-1 h-14 bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="flex-[1.2] h-14 bg-primary text-white rounded-xl font-black uppercase tracking-widest shadow-xl text-xs"
                >
                  Buy it Now ✦
                </Button>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-[#EEE0BC]/40">
               <div>
                 <h4 className="text-[11px] font-black text-primary uppercase tracking-[3px] mb-4">Product Story</h4>
                 <p className="text-sm text-[#7A6848] leading-relaxed font-medium">
                   {product.description || 'Sourced directly from our family-run farms in Gujarat, this product represents the pinnacle of traditional craftsmanship and natural purity.'}
                 </p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { i: <Truck className="w-5 h-5" />, l: 'Free Shipping' },
                   { i: <MessageSquare className="w-5 h-5" />, l: '24/7 Support' },
                   { i: <History className="w-5 h-5" />, l: '30 Day Return' },
                   { i: <ShieldCheck className="w-5 h-5" />, l: 'Lab Certified' },
                 ].map((item, i) => (
                   <div key={i} className="text-center">
                     <div className="text-primary mb-2 flex justify-center">{item.i}</div>
                     <div className="text-[9px] font-black uppercase tracking-tight text-[#7A6848] leading-tight">{item.l}</div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Storytelling Grid */}
        <div className="py-20 border-t border-[#EEE0BC]/30">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-6xl font-extrabold text-primary mb-4">The Purity Standard</h2>
            <div className="w-20 h-1 bg-primary/20 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-10">
            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden group col-span-1 lg:col-span-2">
               <Image src="https://picsum.photos/seed/farmvivaan/1200/800" alt="Farm Source" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
               <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-black uppercase tracking-[4px] mb-4 opacity-70">Native Sourcing</span>
                  <h3 className="font-headline text-3xl md:text-5xl font-extrabold mb-6 leading-tight">The Power of Gujarat's<br />Original Gir Heritage.</h3>
                  <p className="text-sm font-medium text-white/80 max-w-lg leading-relaxed">
                    We exclusively use A2 milk from indigenous Gir cows that graze freely in our native pastures, ensuring nutrition over mass-production costs.
                  </p>
               </div>
            </div>

            <div className="bg-[#F1EAD8] rounded-[40px] p-10 flex flex-col justify-center">
               <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary mb-8 shadow-sm">
                 <History className="w-8 h-8" />
               </div>
               <h3 className="font-headline text-3xl font-extrabold text-primary mb-6">Why Ancient Bilona Method?</h3>
               <ul className="space-y-4">
                 {['Slow wood-fired melting', 'Hand-churned morning butter', 'Nutrient preservation at 60°C', 'Divine granular texture'].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-black text-[#7A6848] uppercase tracking-wider">
                     <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {item}
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <div className="bg-white border-2 border-[#EEE0BC]/40 rounded-[40px] p-10">
              <FlaskConical className="w-10 h-10 text-primary mb-6" />
              <h4 className="font-headline text-2xl font-extrabold text-primary mb-4">Tested for 70+ Parameters</h4>
              <p className="text-[12px] text-[#7A6848] font-medium leading-relaxed">
                From pesticides to antibiotics, every single batch undergoes rigorous NABL-certified lab testing before reaching your kitchen.
              </p>
            </div>
            <div className="bg-white border-2 border-[#EEE0BC]/40 rounded-[40px] p-10">
              <ChefHat className="w-10 h-10 text-primary mb-6" />
              <h4 className="font-headline text-2xl font-extrabold text-primary mb-4">Versatile in Every Meal</h4>
              <p className="text-[12px] text-[#7A6848] font-medium leading-relaxed">
                Perfect for high-heat cooking, tempering dals, or simply drizzled over warm rotis. Its high smoke point makes it the safest cooking fat.
              </p>
            </div>
            <div className="bg-primary text-white rounded-[40px] p-10 relative overflow-hidden">
               <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
               <h4 className="font-headline text-2xl font-extrabold mb-6 relative z-1">Technical Specs</h4>
               <div className="space-y-6 relative z-1">
                 <div>
                   <div className="text-[9px] font-black uppercase tracking-[3px] text-white/40 mb-1">Shelf Life</div>
                   <div className="text-sm font-bold">Best Before 12 Months from MFD</div>
                 </div>
                 <div>
                   <div className="text-[9px] font-black uppercase tracking-[3px] text-white/40 mb-1">Storage</div>
                   <div className="text-sm font-bold">Keep in cool, dry place. No refrigeration needed.</div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Reviews & Related */}
        <div className="py-20 border-t border-[#EEE0BC]/30">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-20">
            <div className="md:w-1/3">
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-6">Customer Reviews</h2>
              <div className="bg-white p-8 rounded-[32px] border border-[#EEE0BC]/40 shadow-sm">
                <div className="text-center mb-8">
                  <div className="text-6xl font-headline font-black text-primary">4.9</div>
                  <div className="flex justify-center gap-1 my-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                  </div>
                  <div className="text-[10px] font-black text-[#7A6848] uppercase tracking-widest">Based on {product.reviewCount} reviews</div>
                </div>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold w-4">{star}★</span>
                      <div className="flex-1 h-1.5 bg-[#F9F6EF] rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: star === 5 ? '92%' : star === 4 ? '6%' : '1%' }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-[#7A6848] w-8 text-right">{star === 5 ? '92%' : star === 4 ? '6%' : '2%'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-2/3 space-y-8">
              {[
                { n: "Ananya Iyer", r: 5, t: "The aroma is divine!", d: "I've tried many A2 ghee brands, but Vivaan's granularity and aroma are truly traditional. Reminds me of my grandmother's kitchen." },
                { n: "Rajesh Kumar", r: 5, t: "Authentic Bilona Ghee", d: "You can tell the difference in quality. It's light on the stomach and tastes amazing with daily dal." },
                { n: "Meera Shah", r: 5, t: "Trusted Source", d: "Been using this for 6 months now. The consistency across batches is impressive. 100% recommended for kids." }
              ].map((rev, i) => (
                <div key={i} className="border-b border-[#EEE0BC]/40 pb-8 last:border-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F1EAD8] flex items-center justify-center font-black text-primary text-xs">{rev.n[0]}</div>
                      <div>
                        <div className="text-sm font-black text-primary">{rev.n}</div>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(rev.r)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 text-yellow-400 fill-current" />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-[#7A6848]/40 uppercase tracking-widest">2 Days Ago</span>
                  </div>
                  <h4 className="text-sm font-black text-primary mb-2">{rev.t}</h4>
                  <p className="text-xs text-[#7A6848] leading-relaxed">{rev.d}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full h-12 rounded-xl border-[#EEE0BC] font-black uppercase tracking-widest text-[10px] text-primary">Load More Reviews</Button>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div>
               <div className="flex items-center justify-between mb-10">
                 <h3 className="font-headline text-3xl md:text-5xl font-extrabold text-primary">You May Also Like</h3>
                 <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline" onClick={() => router.push('/')}>View Collection</button>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {relatedProducts.map((p) => (
                   <ProductCard 
                    key={p.id} 
                    product={p} 
                    isInCart={cart.some(c => c.id === p.id)} 
                    onOpen={() => router.push(`/product/${p.id}`)} 
                    onAdd={() => addToCart(p)} 
                   />
                 ))}
               </div>
            </div>
          )}
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