
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
  onOpen: (id: string) => void;
  onAdd: (id: string) => void;
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
            className="object-contain"
            sizes="(max-width: 768px) 120px, 180px"
          />
        </div>
      );
    }
    
    if (product.cat === 'combo') return <ComboIcon className="scale-75 md:scale-80" />;
    return (
      <JarIcon 
        c1={product.pi % 2 === 0 ? '#D4EDE0' : '#EBF5EE'} 
        c2={product.pi % 2 === 0 ? '#1B5E3B' : '#0D3520'} 
        sub="" 
        idSuffix={product.id} 
        className="scale-75 md:scale-80" 
      />
    );
  };

  return (
    <div 
      onClick={() => onOpen(product.id)}
      className="bg-white rounded-[24px] overflow-hidden border border-[#E5E7EB] cursor-pointer transition-all duration-300 hover:shadow-xl group relative flex flex-col h-full max-w-[320px] mx-auto"
    >
      {/* Top Section: Image & Overlays */}
      <div className="relative aspect-[1/1] bg-[#F9FAFB] p-2 flex items-center justify-center">
        {/* Discount Pill (Top Left - Rounded Bottom) */}
        {discount > 0 && (
          <div className="absolute top-0 left-4 z-20 bg-primary text-white px-2.5 py-3 rounded-b-full flex flex-col items-center justify-center shadow-lg min-w-[38px] md:min-w-[42px]">
            <span className="text-[11px] md:text-[13px] font-black leading-none">{discount}%</span>
            <span className="text-[7px] md:text-[8px] font-black uppercase mt-0.5 tracking-tighter">OFF</span>
          </div>
        )}

        {/* Top Right Badges (Rounded Bottom Left) */}
        <div className="absolute top-0 right-0 z-20 flex flex-col items-end">
          {product.badges?.map((badge, i) => (
            <div key={i} className="bg-[#D4A017] text-white px-4 md:px-5 py-1.5 md:py-2 rounded-bl-[20px] md:rounded-bl-[24px] text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-md">
              {badge}
            </div>
          ))}
        </div>

        {/* Selling Fast Badge */}
        {product.statusBadge && (
          <div className="absolute bottom-4 left-3 z-20 bg-[#FDF2D0] border border-[#F5D110]/30 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Zap className="w-2.5 h-2.5 text-[#D4A017] fill-current" />
            <span className="text-[8px] md:text-[10px] font-black text-[#8B6E0F] uppercase tracking-tight">{product.statusBadge}</span>
          </div>
        )}

        {/* Main Product Visual */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
          {getIcon()}
        </div>

        {/* Floating Add Button */}
        <div className="absolute right-3 bottom-0 translate-y-1/2 z-[40]">
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
            className={cn(
              "h-8 md:h-10 px-4 md:px-6 rounded-xl flex items-center gap-2 font-black text-[9px] md:text-[11px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 border-none",
              isInCart ? "bg-accent text-white" : "bg-primary text-white hover:bg-secondary"
            )}
          >
            {isInCart ? 'ADDED' : 'ADD'} <ShoppingCart className="w-3 h-3 md:w-3.5 md:h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-4 bg-white flex flex-col flex-1 relative z-30">
        <div className="mt-1 space-y-1 mb-2">
          <h3 className="font-headline text-base md:text-xl font-bold text-[#100C06] leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-[#F5D110] fill-current" />
              <span className="text-[10px] font-black text-[#100C06]">{product.rating || '4.9'}</span>
            </div>
            <span className="text-[9px] md:text-[10px] text-[#7A6848] font-semibold">({product.reviewCount || '0'} reviews)</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] md:text-xs text-[#7A6848] line-through font-bold opacity-30">₹{product.mrpPrice?.toLocaleString('en-IN')}</span>
            <span className="text-lg md:text-xl font-black text-[#100C06]">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          
          {product.soldCountLabel && (
            <div className="bg-[#FFF8E7] px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-[#F5D110]/10 shrink-0">
              <span className="text-[10px]">🔥</span>
              <span className="text-[8px] md:text-[10px] font-black text-[#8B6E0F]">{product.soldCountLabel}</span>
            </div>
          )}
        </div>

        {/* Best Price Bar */}
        <div className="mt-3 bg-[#EBF5EE] border border-primary/5 rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs">
              <i className="fa-solid fa-tag text-[7px] text-primary"></i>
            </div>
            <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-tight">Best Price ₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[6px] md:text-[7px] font-black text-primary/40 uppercase tracking-widest">with coupon</span>
        </div>
      </div>
    </div>
  );
};
