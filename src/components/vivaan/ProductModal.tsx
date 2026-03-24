"use client";

import React, { useState, useEffect } from 'react';
import { X, Star, Truck, RefreshCw, FlaskConical, Home, Plus, Minus, Share2 } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ComboIcon, JarIcon } from './JarIcon';
import { aiProductUsageAndRecipeIdeas, RecipeIdeasOutput } from '@/ai/flows/ai-product-usage-and-recipe-ideas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faLightbulb, faCertificate } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onBuyNow?: (p: Product, qty: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart, onBuyNow }) => {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [aiData, setAiData] = useState<RecipeIdeasOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (product) {
      setQty(1);
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

  if (!product || !isOpen) return null;

  const currentVar = product.vars.find(v => v.s === selectedSize) || product.vars[0];
  const price = currentVar.p;

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow({ ...product, price, vol: selectedSize }, qty);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-[24px] max-w-[1080px] w-full max-h-[calc(100vh-40px)] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 z-[20] w-10 h-10 bg-white/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center hover:bg-white transition-all">
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Left Side: Product Image */}
        <div className="md:w-[45%] bg-[#F5F5F5] flex flex-col items-center justify-center relative p-8 md:p-12 min-h-[300px]">
          <div className="relative w-full aspect-square flex items-center justify-center">
            <div className="transition-transform duration-500 hover:scale-105">
              {product.cat === 'combo' ? (
                <ComboIcon className="w-[320px] h-[320px] drop-shadow-2xl" />
              ) : (
                <JarIcon c1="#D4EDE0" c2="#1B5E3B" sub="" idSuffix="modal" className="w-[320px] h-[320px] drop-shadow-2xl" />
              )}
            </div>
          </div>
          <button className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center border border-border">
            <Plus className="w-4 h-4 text-primary" />
          </button>
        </div>

        {/* Right Side: Product Details */}
        <div className="md:w-[55%] p-6 md:p-10 overflow-y-auto bg-white">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              {product.name}
            </h2>
            <button className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground font-bold tracking-[1.5px] uppercase mb-4 leading-relaxed">
            MILK FROM GIR COWS OF GUJARAT | NUTRIENT DENSE & HEART-HEALTHY | BILONA-CHURNED | 70+ QUALITY CHECKS
          </p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-yellow-400/10 px-2 py-0.5 rounded text-yellow-600">
                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                <span className="text-xs font-black">{product.rat}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">({product.revs} reviews)</span>
            </div>
            
            <div className="text-right">
              <div className="font-headline text-4xl font-extrabold text-foreground">
                ₹{price.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                MRP (Incl. of all taxes)
              </p>
            </div>
          </div>

          {/* Featured Badge */}
          <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider mb-8">
            <FontAwesomeIcon icon={faCertificate} className="text-white/60" />
            Best Price with coupon
          </div>

          {/* Upsell / Testing Kit Mini Banner (Styled like the reference) */}
          <div className="bg-[#EAF6EF] border border-primary/10 rounded-xl p-4 flex items-center justify-between mb-10 group cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden border border-border">
                  <div className="scale-50 opacity-40"><JarIcon c1="#D4EDE0" c2="#1B5E3B" sub="" idSuffix="upsell" /></div>
               </div>
               <div>
                  <div className="bg-primary/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded inline-block uppercase tracking-wider mb-1">Test. Trust.</div>
                  <div className="text-xs font-black text-foreground">Ghee Adulteration Rapid Testing Kit</div>
                  <div className="text-sm font-bold text-primary">₹99</div>
               </div>
            </div>
            <Button variant="outline" className="h-9 px-4 rounded-full border-primary text-primary font-black text-[10px] uppercase hover:bg-primary hover:text-white transition-all">
              Add to cart
            </Button>
          </div>

          {/* Variant Selection Grid (Like the reference) */}
          <div className="mb-10">
            <h4 className="text-[11px] font-black text-foreground tracking-[2px] uppercase mb-4">Select Variant</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {product.vars.map((v) => (
                <button 
                  key={v.s}
                  onClick={() => setSelectedSize(v.s)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all text-center",
                    selectedSize === v.s 
                      ? "border-primary bg-primary/[0.03]" 
                      : "border-border hover:border-muted-foreground/30 bg-white"
                  )}
                >
                  <div className={cn(
                    "text-[10px] font-black uppercase tracking-wider mb-1",
                    selectedSize === v.s ? "text-primary" : "text-muted-foreground"
                  )}>{v.s}</div>
                  <div className="text-sm font-extrabold text-foreground">₹{v.p.toLocaleString('en-IN')}</div>
                  {selectedSize === v.s && (
                    <div className="w-full h-1 bg-primary mt-2 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-10">
            <div className="flex items-center bg-background border-2 border-border rounded-full h-14 overflow-hidden">
               <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-12 h-full hover:bg-muted/50 flex items-center justify-center transition-all"><Minus className="w-5 h-5" /></button>
               <span className="w-8 text-center text-lg font-black">{qty}</span>
               <button onClick={() => setQty(q => Math.min(99, q+1))} className="w-12 h-full hover:bg-muted/50 flex items-center justify-center transition-all"><Plus className="w-5 h-5" /></button>
            </div>
            <Button 
              onClick={() => { onAddToCart({ ...product, price, vol: selectedSize }, qty); onClose(); }}
              className="flex-1 h-14 bg-white border-2 border-foreground text-foreground hover:bg-foreground hover:text-white font-black uppercase tracking-widest rounded-full transition-all"
            >
              Add to Cart
            </Button>
            <Button 
              onClick={handleBuyNow}
              className="flex-[1.4] h-14 bg-primary text-white font-black uppercase tracking-widest rounded-full shadow-xl hover:translate-y-[-2px] transition-all"
            >
              Buy Now ✦
            </Button>
          </div>

          {/* Info Sections */}
          <div className="space-y-8">
            <section>
              <h4 className="text-[11px] font-black text-foreground tracking-[2px] uppercase mb-4">About This Product</h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{product.description}</p>
            </section>

            <div className="grid grid-cols-2 gap-4">
              {[
                { i: <Truck className="w-5 h-5" />, l: 'Free Delivery' },
                { i: <RefreshCw className="w-5 h-5" />, l: '30-Day Return' },
                { i: <FlaskConical className="w-5 h-5" />, l: 'Lab Tested' },
                { i: <Home className="w-5 h-5" />, l: 'Farm Direct' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-primary/[0.03] rounded-xl p-3 border border-primary/5">
                  <div className="text-primary">{item.i}</div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-wider leading-tight">{item.l}</div>
                </div>
              ))}
            </div>

            {loadingAi ? (
              <div className="space-y-4 animate-pulse pt-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ) : aiData && (
              <>
                <section className="pt-4 border-t border-border">
                  <h4 className="text-[11px] font-black text-foreground tracking-[2px] uppercase mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUtensils} className="text-primary" /> AI Recipe Ideas
                  </h4>
                  <div className="space-y-4">
                    {aiData.recipeIdeas.map((recipe, i) => (
                      <div key={i} className="bg-primary/[0.02] p-4 rounded-xl border border-primary/5">
                        <div className="text-xs font-black text-primary mb-1 uppercase tracking-wide">{recipe.title}</div>
                        <div className="text-[11px] text-muted-foreground leading-relaxed font-medium">{recipe.description}</div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="pt-4 border-t border-border">
                   <h4 className="text-[11px] font-black text-foreground tracking-[2px] uppercase mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLightbulb} className="text-primary" /> Usage Tips
                  </h4>
                  <ul className="space-y-3">
                    {aiData.usageTips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-[11px] text-muted-foreground font-medium">
                        <span className="text-primary">•</span>
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
    </div>
  );
};