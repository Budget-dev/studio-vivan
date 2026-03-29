"use client";

import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { JarIcon, ComboIcon } from './JarIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  isInCart: boolean;
  onOpen: (id: string) => void;
  onAdd: (id: string) => void;
  onWish: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInWishlist, isInCart, onOpen, onAdd, onWish }) => {
  const getIcon = () => {
    if (product.cat === 'combo') return <ComboIcon className="scale-75 md:scale-110" />;
    if (product.cat === 'sweets') return <div className="text-5xl md:text-7xl group-hover:scale-110 transition-transform">🎁</div>;
    if (product.cat === 'honey') return <div className="text-5xl md:text-7xl group-hover:scale-110 transition-transform">🍯</div>;
    return <JarIcon c1={product.pi % 2 === 0 ? '#D4EDE0' : '#EBF5EE'} c2={product.pi % 2 === 0 ? '#1B5E3B' : '#0D3520'} sub="" idSuffix={product.id} className="scale-75 md:scale-100" />;
  };

  return (
    <div 
      onClick={() => onOpen(product.id)}
      className="bg-[#FDFAF4] rounded-[32px] overflow-hidden border border-[#DDD0B5] cursor-pointer transition-all duration-500 hover:shadow-2xl group relative"
    >
      <div className={`h-[180px] md:h-[260px] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#F8F1E4] to-[#EDE2CC]`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(27,94,59,0.15),transparent_60%)] pointer-events-none z-1"></div>
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.off && (
            <span className="bg-[#C03030] text-white px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black tracking-widest uppercase shadow-lg">
              {product.off} OFF
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-md text-primary px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black tracking-widest uppercase shadow-sm flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" /> BEST SELLER
          </span>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onWish(product.id); }}
          className={cn(
            "absolute top-3 right-3 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-none shadow-xl transition-all active:scale-75 backdrop-blur-md",
            isInWishlist ? 'bg-red-50 text-[#C03030]' : 'bg-white/90 text-primary hover:bg-white'
          )}
        >
          <Heart className={cn("w-4 h-4 md:w-5 md:h-5", isInWishlist && 'fill-current')} />
        </button>

        {/* Floating Top Rated Banner */}
        <div className="absolute top-0 right-0 left-0 flex justify-center z-10">
          <div className="bg-primary px-4 py-1.5 rounded-b-2xl shadow-xl">
            <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[3px]">TOP RATED</span>
          </div>
        </div>

        <div className="relative z-5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[-2deg]">
          {getIcon()}
        </div>

        {product.stock <= 10 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-5 z-10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
            <span className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-widest">HURRY! ONLY {product.stock} LEFT</span>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 relative">
        {/* Floating Add Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
          className={cn(
            "absolute -top-6 right-6 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 border-4 border-[#FDFAF4]",
            isInCart ? "bg-accent text-white" : "bg-primary text-white hover:bg-secondary"
          )}
        >
          <i className={cn("fa-solid text-lg", isInCart ? "fa-check" : "fa-cart-plus")}></i>
        </button>

        <h3 className="font-headline text-lg md:text-2xl font-extrabold text-primary leading-tight mb-1 truncate pr-12">{product.name}</h3>
        <p className="text-[10px] md:text-[12px] text-[#7A6848] font-black uppercase tracking-wider mb-3">{product.vol}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl md:text-3xl font-black text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs md:text-sm text-[#B0A080] line-through font-medium">₹{product.mrp.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Best Price Bar */}
        <div className="bg-[#EBF5EE] border border-primary/10 rounded-2xl p-3 flex items-center justify-between group/bar">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <i className="fa-solid fa-ticket text-[10px] text-primary"></i>
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-wider">Best Price</span>
          </div>
          <span className="text-[10px] md:text-[11px] font-black text-foreground">₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};
