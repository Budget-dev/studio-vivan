"use client";

import React from 'react';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '@/types';
import { JarIcon, ComboIcon } from './JarIcon';
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
      className="bg-white rounded-[24px] overflow-hidden border border-[#E5E7EB] cursor-pointer transition-all duration-300 hover:shadow-xl group relative flex flex-col h-full"
    >
      {/* Top Section: Image & Overlays */}
      <div className="relative aspect-[4/5] bg-[#F9FAFB] p-4 flex items-center justify-center overflow-hidden">
        {/* Discount Circle */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-20 w-10 h-10 md:w-12 md:h-12 bg-[#0D3520] rounded-full flex flex-col items-center justify-center text-white shadow-lg">
            <span className="text-[10px] md:text-[12px] font-black leading-none">{discount}%</span>
            <span className="text-[7px] md:text-[8px] font-bold uppercase">OFF</span>
          </div>
        )}

        {/* Top Right Badges */}
        <div className="absolute top-3 right-0 z-20 flex flex-col items-end gap-1.5">
          {product.badges?.map((badge, i) => (
            <div key={i} className="bg-[#D4A017] text-white px-3 py-1 rounded-l-lg text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-md">
              {badge}
            </div>
          ))}
        </div>

        {/* Selling Fast Badge */}
        {product.statusBadge && (
          <div className="absolute bottom-4 left-3 z-20 bg-[#FDF2D0] border border-[#F5D110]/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
            <Zap className="w-3 h-3 text-[#D4A017] fill-current" />
            <span className="text-[9px] md:text-[11px] font-extrabold text-[#8B6E0F] uppercase tracking-tight">{product.statusBadge}</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onWish(product.id); }}
          className={cn(
            "absolute top-3 right-12 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-75",
            isInWishlist ? 'text-red-500' : 'text-primary/20 hover:text-red-400'
          )}
        >
          <Heart className={cn("w-5 h-5", isInWishlist && 'fill-current')} />
        </button>

        {/* Main Product Visual */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {getIcon()}
        </div>

        {/* Reflection/Shadow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
      </div>

      {/* Floating Add Button */}
      <div className="absolute right-4 -translate-y-1/2 z-30">
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
          className={cn(
            "h-10 md:h-12 px-4 md:px-6 rounded-xl flex items-center gap-2 font-black text-[11px] md:text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95",
            isInCart ? "bg-accent text-white" : "bg-[#1B5E3B] text-white hover:bg-[#0D3520]"
          )}
        >
          {isInCart ? 'ADDED' : 'ADD'} <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      {/* Info Section */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <div className="mt-2 space-y-1.5 mb-3">
          <h3 className="font-headline text-lg md:text-xl font-bold text-[#100C06] leading-tight line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-[#F5D110] fill-current" />
              <span className="text-xs font-bold text-[#100C06]">{product.rating || '4.9'}</span>
            </div>
            <span className="text-[11px] text-[#7A6848] font-medium">({product.reviewCount || '0'} reviews)</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base text-[#7A6848] line-through font-medium opacity-50">₹{product.mrpPrice?.toLocaleString('en-IN')}</span>
              <span className="text-xl md:text-2xl font-black text-[#100C06]">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          {product.soldCountLabel && (
            <div className="bg-[#FFF8E7] px-2 py-1 rounded-lg flex items-center gap-1 border border-[#F5D110]/20">
              <span className="text-xs">🔥</span>
              <span className="text-[10px] md:text-[11px] font-black text-[#8B6E0F]">{product.soldCountLabel}</span>
            </div>
          )}
        </div>

        {/* Best Price Bar */}
        <div className="mt-4 bg-[#EBF5EE] border border-primary/10 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
              <i className="fa-solid fa-tag text-[9px] text-primary"></i>
            </div>
            <span className="text-[9px] font-black text-primary uppercase tracking-tight">Best Price ₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[8px] font-bold text-primary/60 uppercase">with coupon</span>
        </div>
      </div>
    </div>
  );
};
