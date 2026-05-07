
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
        <div className="relative w-full aspect-square transition-transform duration-700 group-hover:scale-105">
          <Image 
            src={product.imageUrls[0]} 
            alt={product.name} 
            fill 
            className={cn(
              "object-contain transition-opacity duration-500",
              product.imageUrls.length > 1 ? "group-hover:opacity-0" : "opacity-100"
            )}
            sizes="(max-width: 768px) 150px, 220px"
          />
          
          {product.imageUrls.length > 1 && (
            <Image 
              src={product.imageUrls[1]} 
              alt={`${product.name} alternate`} 
              fill 
              className="object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 768px) 150px, 220px"
            />
          )}
        </div>
      );
    }
    
    if (product.cat === 'combo') return <ComboIcon className="scale-90 md:scale-100" />;
    return (
      <JarIcon 
        c1={product.pi % 2 === 0 ? '#D4EDE0' : '#EBF5EE'} 
        c2={product.pi % 2 === 0 ? '#1B5E3B' : '#0D3520'} 
        sub="" 
        idSuffix={product.id} 
        className="scale-90 md:scale-100" 
      />
    );
  };

  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleNavigate}
      className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border border-[#E5E7EB] cursor-pointer transition-all duration-300 hover:shadow-2xl group relative flex flex-col h-full w-full mx-auto shadow-sm transform-gpu translate-z-0"
    >
      {/* Top Section: Image Area */}
      <div className="relative aspect-[1/1] bg-[#F3F4F6]/50 p-3 md:p-4 flex items-center justify-center overflow-visible">
        {/* Discount Tag */}
        {discount > 0 && (
          <div className="absolute top-0 left-3 md:left-5 z-[30] bg-primary text-white px-2 md:px-3 py-3 md:py-5 rounded-b-full flex flex-col items-center justify-center shadow-lg min-w-[34px] md:min-w-[44px]">
            <span className="text-[11px] md:text-[14px] font-black leading-none">{discount}%</span>
            <span className="text-[7px] md:text-[9px] font-black uppercase mt-1 tracking-tighter">OFF</span>
          </div>
        )}

        {/* Top Badges - Optimized for iOS Hardware Acceleration */}
        <div className="absolute top-0 right-0 z-[30] pointer-events-none transform translate-z-0">
          {product.badges?.slice(0, 1).map((badge, i) => (
            <div key={i} className="bg-[#D4A017] text-white px-3 md:px-6 py-1.5 md:py-2.5 rounded-bl-[16px] md:rounded-bl-[28px] text-[8px] md:text-[11px] font-black uppercase tracking-widest shadow-md">
              {badge}
            </div>
          ))}
        </div>

        {/* Product Visual */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2 md:p-4">
          {getIcon()}
        </div>

        {/* Action Button - Floating */}
        <div className="absolute right-3 md:right-5 bottom-0 translate-y-1/2 z-[40]">
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className={cn(
              "h-9 md:h-12 px-4 md:px-8 rounded-xl md:rounded-2xl flex items-center gap-2 font-black text-[9px] md:text-[12px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 border-none whitespace-nowrap",
              isInCart ? "bg-accent text-white" : "bg-primary text-white hover:bg-secondary"
            )}
          >
            {isInCart ? 'ADD MORE' : 'ADD'} <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 md:p-6 bg-white flex flex-col flex-1 pt-6 md:pt-8">
        <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
          <h3 className="font-headline text-lg md:text-2xl font-bold text-[#100C06] leading-tight line-clamp-2 min-h-[2.2em]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 md:w-4 md:h-4 text-[#F5D110] fill-current" />
              <span className="text-[10px] md:text-[13px] font-black text-[#100C06]">{product.rating || '4.9'}</span>
            </div>
            <span className="text-[9px] md:text-[12px] text-[#7A6848] font-bold opacity-40">({product.reviewCount || 0})</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-auto gap-1">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-3xl font-black text-[#100C06] leading-none">₹{price.toLocaleString('en-IN')}</span>
            {mrpPrice > price && (
              <span className="text-[11px] md:text-sm text-[#7A6848] line-through font-bold opacity-30">₹{mrpPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          {product.soldCountLabel && (
            <div className="bg-[#FFF8E7] px-2 py-1 rounded-full flex items-center gap-1 border border-[#F5D110]/10 w-fit">
              <span className="text-[9px] md:text-[11px] font-black text-[#8B6E0F]">🔥 {product.soldCountLabel} sold</span>
            </div>
          )}
        </div>

        {/* Purity Indicator */}
        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
          <span className="text-[9px] md:text-[11px] font-black text-primary uppercase tracking-tight truncate flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            Best Price Guarantee
          </span>
          <i className="fa-solid fa-shield-check text-[10px] text-primary/30"></i>
        </div>
      </div>
    </div>
  );
};
