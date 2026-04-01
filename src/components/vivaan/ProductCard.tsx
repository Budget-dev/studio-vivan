
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
            sizes="(max-width: 768px) 160px, 240px"
          />
        </div>
      );
    }
    
    if (product.cat === 'combo') return <ComboIcon className="scale-90 md:scale-110" />;
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
      onClick={() => onOpen(product.id)}
      className="bg-white rounded-[32px] overflow-hidden border border-[#E5E7EB] cursor-pointer transition-all duration-300 hover:shadow-2xl group relative flex flex-col h-full"
    >
      {/* Top Section: Image & Overlays */}
      <div className="relative aspect-[4/5] bg-[#F9FAFB] p-4 flex items-center justify-center">
        {/* Discount Circle */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-20 w-12 h-12 bg-primary rounded-full flex flex-col items-center justify-center text-white shadow-lg">
            <span className="text-[11px] md:text-[13px] font-black leading-none">{discount}%</span>
            <span className="text-[7px] md:text-[8px] font-bold uppercase">OFF</span>
          </div>
        )}

        {/* Top Right Badges */}
        <div className="absolute top-4 right-0 z-20 flex flex-col items-end gap-1.5">
          {product.badges?.map((badge, i) => (
            <div key={i} className="bg-[#D4A017] text-white px-4 py-1.5 rounded-l-full text-[9px] md:text-[11px] font-black uppercase tracking-wider shadow-md">
              {badge}
            </div>
          ))}
        </div>

        {/* Selling Fast Badge */}
        {product.statusBadge && (
          <div className="absolute bottom-6 left-4 z-20 bg-[#FDF2D0] border border-[#F5D110]/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#D4A017] fill-current" />
            <span className="text-[10px] md:text-[12px] font-black text-[#8B6E0F] uppercase tracking-tight">{product.statusBadge}</span>
          </div>
        )}

        {/* Main Product Visual */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {getIcon()}
        </div>

        {/* Floating Add Button */}
        <div className="absolute right-4 bottom-0 translate-y-1/2 z-[40]">
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
            className={cn(
              "h-11 md:h-13 px-6 md:px-8 rounded-2xl flex items-center gap-3 font-black text-[11px] md:text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95",
              isInCart ? "bg-accent text-white" : "bg-primary text-white hover:bg-secondary"
            )}
          >
            {isInCart ? 'ADDED' : 'ADD'} <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 md:p-6 bg-white flex flex-col flex-1 relative z-30">
        <div className="mt-2 space-y-2 mb-4">
          <h3 className="font-headline text-xl md:text-3xl font-bold text-[#100C06] leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#F5D110] fill-current" />
              <span className="text-sm font-black text-[#100C06]">{product.rating || '4.9'}</span>
            </div>
            <span className="text-[11px] md:text-xs text-[#7A6848] font-semibold">({product.reviewCount || '0'} reviews)</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base text-[#7A6848] line-through font-bold opacity-40">₹{product.mrpPrice?.toLocaleString('en-IN')}</span>
            <span className="text-2xl md:text-3xl font-black text-[#100C06]">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          
          {product.soldCountLabel && (
            <div className="bg-[#FFF8E7] px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#F5D110]/20 shrink-0">
              <span className="text-sm">🔥</span>
              <span className="text-[10px] md:text-[12px] font-black text-[#8B6E0F]">{product.soldCountLabel}</span>
            </div>
          )}
        </div>

        {/* Best Price Bar */}
        <div className="mt-5 bg-[#EBF5EE] border border-primary/10 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
              <i className="fa-solid fa-tag text-[10px] text-primary"></i>
            </div>
            <span className="text-[10px] md:text-[12px] font-black text-primary uppercase tracking-tight">Best Price ₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[8px] md:text-[9px] font-black text-primary/50 uppercase tracking-widest">with coupon</span>
        </div>
      </div>
    </div>
  );
};
