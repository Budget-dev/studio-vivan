
"use client";

import React from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, Zap } from 'lucide-react';
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
  const discount = product.mrpPrice && product.mrpPrice > product.price 
    ? Math.round(((product.mrpPrice - product.price) / product.mrpPrice) * 100)
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

  return (
    <div 
      onClick={() => onOpen(product)}
      className="bg-white rounded-[20px] md:rounded-[32px] overflow-hidden border border-[#E5E7EB] cursor-pointer transition-all duration-300 hover:shadow-2xl group relative flex flex-col h-full w-full mx-auto shadow-sm"
    >
      {/* Top Section: Image Area */}
      <div className="relative aspect-[1/1] bg-[#F3F4F6]/50 p-2 md:p-4 flex items-center justify-center">
        {/* Discount Tag */}
        {discount > 0 && (
          <div className="absolute top-0 left-2 md:left-5 z-20 bg-primary text-white px-1.5 md:px-3 py-2 md:py-4 rounded-b-full flex flex-col items-center justify-center shadow-lg min-w-[30px] md:min-w-[44px]">
            <span className="text-[10px] md:text-[14px] font-black leading-none">{discount}%</span>
            <span className="text-[6px] md:text-[9px] font-black uppercase mt-0.5 tracking-tighter">OFF</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-0 right-0 z-20 flex flex-col items-end">
          {product.badges?.slice(0, 1).map((badge, i) => (
            <div key={i} className="bg-[#D4A017] text-white px-2 md:px-6 py-1 md:py-2.5 rounded-bl-[12px] md:rounded-bl-[28px] text-[7px] md:text-[11px] font-black uppercase tracking-widest shadow-md">
              {badge}
            </div>
          ))}
        </div>

        {/* Product Visual */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-1 md:p-2">
          {getIcon()}
        </div>

        {/* Mobile Action Button */}
        <div className="absolute right-2 md:right-5 bottom-0 translate-y-1/2 z-[40]">
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            className={cn(
              "h-8 md:h-12 px-3 md:px-8 rounded-lg md:rounded-2xl flex items-center gap-1.5 md:gap-2 font-black text-[8px] md:text-[12px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 border-none whitespace-nowrap",
              isInCart ? "bg-accent text-white" : "bg-primary text-white hover:bg-secondary"
            )}
          >
            {isInCart ? 'ADD MORE' : 'ADD TO CART'} <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-6 bg-white flex flex-col flex-1">
        <div className="mt-1 space-y-0.5 md:space-y-1.5 mb-2 md:mb-4">
          <h3 className="font-headline text-base md:text-2xl font-bold text-[#100C06] leading-tight line-clamp-2 min-h-[2.2em]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-2.5 md:w-3.5 md:h-3.5 text-[#F5D110] fill-current" />
            <span className="text-[9px] md:text-[12px] font-black text-[#100C06]">{product.rating || '4.9'}</span>
            <span className="text-[8px] md:text-[11px] text-[#7A6848] font-semibold opacity-60">({product.reviewCount})</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-auto gap-1">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-base md:text-3xl font-black text-[#100C06] leading-none">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrpPrice && (
              <span className="text-[9px] md:text-sm text-[#7A6848] line-through font-bold opacity-30">₹{product.mrpPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          {product.soldCountLabel && (
            <div className="bg-[#FFF8E7] px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-[#F5D110]/10 w-fit">
              <span className="text-[8px] md:text-[11px] font-black text-[#8B6E0F]">🔥 {product.soldCountLabel} sold</span>
            </div>
          )}
        </div>

        {/* Mobile Coupon Hint */}
        <div className="mt-3 md:mt-5 bg-[#EBF5EE] border border-primary/5 rounded-lg md:rounded-xl p-1.5 md:p-3 flex items-center justify-between">
          <span className="text-[8px] md:text-[11px] font-black text-primary uppercase tracking-tight truncate">
            Best Price ₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}
          </span>
          <i className="fa-solid fa-tag text-[7px] md:text-[8px] text-primary/40"></i>
        </div>
      </div>
    </div>
  );
};
