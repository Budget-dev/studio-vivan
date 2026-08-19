"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Plus, Heart } from 'lucide-react';
import { Product } from '@/types';
import { JarIcon, ComboIcon } from './JarIcon';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/use-wishlist';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart, onOpen, onAdd }) => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const price = Number(product.price) || 0;
  const mrpPrice = Number(product.mrpPrice) || price;
  const isWishlisted = isInWishlist(product.id);

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
            className="object-cover"
            sizes="(max-width: 768px) 150px, 220px"
          />
        </div>
      );
    }
    
    if (product.cat === 'combo') return <ComboIcon className="scale-[0.65]" />;
    return (
      <JarIcon 
        c1={product.pi % 2 === 0 ? '#D4EDE0' : '#EBF5EE'} 
        c2={product.pi % 2 === 0 ? '#1B5E3B' : '#0D3520'} 
        sub="" 
        idSuffix={product.id} 
        className="scale-[0.65]" 
      />
    );
  };

  return (
    <div 
      onClick={() => router.push(`/product/${product.id}`)}
      className="bg-white rounded-[20px] overflow-hidden border border-[#E5E7EB]/50 cursor-pointer transition-all duration-300 hover:shadow-lg group relative flex flex-col h-full w-full shadow-sm"
    >
      {/* 60% Image Area */}
      <div className="relative aspect-[5/4] bg-[#F9FAFB] flex items-center justify-center overflow-hidden">
        {discount > 0 && (
          <div className="absolute top-0 left-3 z-[30] bg-[#163A24] text-white px-1.5 py-2 rounded-b-lg shadow-sm">
            <span className="text-[10px] font-black leading-none">{discount}% OFF</span>
          </div>
        )}

        {/* Wishlist Toggle */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 z-[40] w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-primary shadow-sm hover:scale-110 active:scale-90 transition-all border-none"
        >
          <Heart className={cn("w-4 h-4 transition-colors", isWishlisted ? "fill-primary text-primary" : "text-primary/40")} />
        </button>

        <div className="relative z-10 w-full h-full">
          {getIcon()}
        </div>

        {/* Floating Add Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          className={cn(
            "absolute right-2 bottom-2 z-[40] w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 border-none",
            isInCart ? "bg-[#D4A94D] text-white" : "bg-[#163A24] text-white hover:bg-[#214F32]"
          )}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Info Section - Compact */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-body text-xs md:text-sm font-bold text-[#100C06] leading-tight line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-2.5 h-2.5 text-[#D4A94D] fill-current" />
            <span className="text-[9px] font-black text-[#100C06]">{product.rating || '4.9'}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-lg md:text-xl font-black text-[#163A24] no-underline leading-tight">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {mrpPrice > price && (
            <span className="text-[9px] text-[#7A6848] line-through decoration-1 opacity-70 font-bold">₹{mrpPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  );
};
