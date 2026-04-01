
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
            sizes="(max-width: 768px) 140px, 200px"
          />
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

  return (
    <div 
      onClick={() => onOpen(product.id)}
      className="bg-white rounded-[24px] overflow-hidden border border-[#E5E7EB] cursor-pointer transition-all duration-300 hover:shadow-xl group relative flex flex-col h-full"
    >
      {/* Top Section: Image & Overlays */}
      <div className="relative aspect-[1/1.1] bg-[#F9FAFB] p-3 flex items-center justify-center">
        {/* Discount Circle */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-20 w-10 h-10 bg-primary rounded-full flex flex-col items-center justify-center text-white shadow-lg">
            <span className="text-[10px] md:text-[12px] font-black leading-none">{discount}%</span>
            <span className="text-[6px] md:text-[7px] font-bold uppercase">OFF</span>
          </div>
        )}

        {/* Top Right Badges */}
        <div className="absolute top-3 right-0 z-20 flex flex-col items-end gap-1">
          {product.badges?.map((badge, i) => (
            <div key={i} className="bg-[#D4A017] text-white px-3 py-1 rounded-l-full text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-md">
              {badge}
            </div>
          ))}
        </div>

        {/* Selling Fast Badge */}
        {product.statusBadge && (
          <div className="absolute bottom-5 left-3 z-20 bg-[#FDF2D0] border border-[#F5D110]/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
            <Zap className="w-3 h-3 text-[#D4A017] fill-current" />
            <span className="text-[9px] md:text-[11px] font-black text-[#8B6E0F] uppercase tracking-tight">{product.statusBadge}</span>
          </div>
        )}

        {/* Main Product Visual */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {getIcon()}
        </div>

        {/* Floating Add Button */}
        <div className="absolute right-3 bottom-0 translate-y-1/2 z-[40]">
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
            className={cn(
              "h-9 md:h-11 px-5 md:px-7 rounded-xl flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95",
              isInCart ? "bg-accent text-white" : "bg-primary text-white hover:bg-secondary"
            )}
          >
            {isInCart ? 'ADDED' : 'ADD'} <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 md:p-5 bg-white flex flex-col flex-1 relative z-30">
        <div className="mt-1 space-y-1.5 mb-3">
          <h3 className="font-headline text-lg md:text-2xl font-bold text-[#100C06] leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#F5D110] fill-current" />
              <span className="text-xs font-black text-[#100C06]">{product.rating || '4.9'}</span>
            </div>
            <span className="text-[10px] md:text-xs text-[#7A6848] font-semibold">({product.reviewCount || '0'} reviews)</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-[#7A6848] line-through font-bold opacity-40">₹{product.mrpPrice?.toLocaleString('en-IN')}</span>
            <span className="text-xl md:text-2xl font-black text-[#100C06]">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          
          {product.soldCountLabel && (
            <div className="bg-[#FFF8E7] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#F5D110]/20 shrink-0">
              <span className="text-xs">🔥</span>
              <span className="text-[9px] md:text-[11px] font-black text-[#8B6E0F]">{product.soldCountLabel}</span>
            </div>
          )}
        </div>

        {/* Best Price Bar */}
        <div className="mt-4 bg-[#EBF5EE] border border-primary/10 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
              <i className="fa-solid fa-tag text-[9px] text-primary"></i>
            </div>
            <span className="text-[9px] md:text-[11px] font-black text-primary uppercase tracking-tight">Best Price ₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[7px] md:text-[8px] font-black text-primary/50 uppercase tracking-widest">with coupon</span>
        </div>
      </div>
    </div>
  );
};
