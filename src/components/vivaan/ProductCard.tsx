"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { JarIcon, ComboIcon } from './JarIcon';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart, onOpen, onAdd }) => {
  const router = useRouter();
  
  // Ensure we have numbers to work with
  const price = Number(product.price) || 0;
  const mrpPrice = Number(product.mrpPrice) || price;

  const discount = mrpPrice > price 
    ? Math.round(((mrpPrice - price) / mrpPrice) * 100)
    : 0;

  const getIcon = () => {
    if (product.imageUrls && product.imageUrls.length > 0) {
      return (
        <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
          <Image 
            src={product.imageUrls[0]} 
            alt={product.name} 
            fill 
            className={cn(
              "object-cover transition-opacity duration-500",
              product.imageUrls.length > 1 ? "group-hover:opacity-0" : "opacity-100"
            )}
            sizes="(max-width: 768px) 150px, 220px"
          />
          
          {product.imageUrls.length > 1 && (
            <Image 
              src={product.imageUrls[1]} 
              alt={`${product.name} alternate`} 
              fill 
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 768px) 150px, 220px"
            />
          )}
        </div>
      );
    }
    
    if (product.cat === 'combo') return <ComboIcon className="scale-75 md:scale-90" />;
    return (
      <JarIcon 
        c1={product.pi % 2 === 0 ? '#D4EDE0' : '#EBF5EE'} 
        c2={product.pi % 2 === 0 ? '#1B5E3B' : '#0D3520'} 
        sub="" 
        idSuffix={product.id} 
        className="scale-75 md:scale-90" 
      />
    );
  };

  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleNavigate}
      className="bg-white rounded-[20px] md:rounded-[28px] overflow-hidden border border-[#E5E7EB] cursor-pointer transition-all duration-300 hover:shadow-xl group relative flex flex-col h-full w-full mx-auto shadow-sm transform-gpu translate-z-0"
    >
      {/* Top Section: Image Area */}
      <div className="relative aspect-[1/1] bg-[#F9FAFB] p-0 flex items-center justify-center overflow-hidden">
        {/* Discount Tag - Smaller & Cleaner */}
        {discount > 0 && (
          <div className="absolute top-0 left-2 md:left-4 z-[30] bg-primary text-white px-1.5 md:px-2 py-2 md:py-3.5 rounded-b-full flex flex-col items-center justify-center shadow-lg min-w-[28px] md:min-w-[36px]">
            <span className="text-[9px] md:text-[11px] font-black leading-none">{discount}%</span>
            <span className="text-[6px] md:text-[7px] font-black uppercase mt-0.5 tracking-tighter">OFF</span>
          </div>
        )}

        {/* Top Badges - Refined */}
        <div className="absolute top-0 right-0 z-[30] pointer-events-none transform-gpu translate-z-0">
          {product.badges?.slice(0, 1).map((badge, i) => (
            <div key={i} className="bg-[#D4A017] text-white px-2 md:px-4 py-1 md:py-1.5 rounded-bl-[12px] md:rounded-bl-[20px] text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-sm">
              {badge}
            </div>
          ))}
        </div>

        {/* Product Visual */}
        <div className="relative z-10 w-full h-full">
          {getIcon()}
        </div>

        {/* Action Button - Scaled down */}
        <div className="absolute right-2 md:right-4 bottom-2 z-[40]">
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className={cn(
              "h-8 md:h-10 px-3 md:px-5 rounded-lg md:rounded-xl flex items-center gap-1.5 font-black text-[8px] md:text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 border-none whitespace-nowrap",
              isInCart ? "bg-accent text-white" : "bg-primary text-white hover:bg-secondary"
            )}
          >
            {isInCart ? 'ADD MORE' : 'ADD'} <ShoppingCart className="w-3 md:w-3.5" />
          </button>
        </div>
      </div>

      {/* Info Section - Tighter Padding */}
      <div className="p-3 md:p-4 bg-white flex flex-col flex-1 pt-4 md:pt-6">
        <div className="space-y-0.5 md:space-y-1 mb-2 md:mb-3">
          <h3 className="font-headline text-sm md:text-lg font-bold text-[#100C06] leading-tight line-clamp-2 min-h-[2.4em]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 md:w-3 text-[#F5D110] fill-current" />
              <span className="text-[9px] md:text-[11px] font-black text-[#100C06]">{product.rating || '4.9'}</span>
            </div>
            <span className="text-[8px] md:text-[10px] text-[#7A6848] font-bold opacity-30">({product.reviewCount || 0})</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-auto gap-0.5">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-lg md:text-xl font-black text-[#100C06] leading-none">₹{price.toLocaleString('en-IN')}</span>
            {mrpPrice > price && (
              <span className="text-[9px] md:text-[11px] text-[#7A6848] line-through font-bold opacity-25">₹{mrpPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          {product.soldCountLabel && (
            <div className="bg-[#FFF8E7] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-[#F5D110]/10 w-fit">
              <span className="text-[8px] md:text-[9px] font-black text-[#8B6E0F]">🔥 {product.soldCountLabel} sold</span>
            </div>
          )}
        </div>

        {/* Purity Indicator - Ultra-Compact */}
        <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
          <span className="text-[7px] md:text-[9px] font-black text-primary uppercase tracking-tight truncate flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
            Best Price Guarantee
          </span>
          <i className="fa-solid fa-shield-check text-[8px] text-primary/20"></i>
        </div>
      </div>
    </div>
  );
};
