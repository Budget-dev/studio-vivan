"use client";

import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { JarIcon, ComboIcon } from './JarIcon';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  isInCart: boolean;
  onOpen: (id: number) => void;
  onAdd: (id: number) => void;
  onWish: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInWishlist, isInCart, onOpen, onAdd, onWish }) => {
  const getIcon = () => {
    if (product.cat === 'combo') return <ComboIcon className="scale-75 md:scale-110" />;
    if (product.cat === 'pickles') return <div className="text-5xl md:text-7xl group-hover:scale-110 transition-transform">🌶️</div>;
    if (product.cat === 'sweets') return <div className="text-5xl md:text-7xl group-hover:scale-110 transition-transform">🎁</div>;
    if (product.cat === 'honey') return <div className="text-5xl md:text-7xl group-hover:scale-110 transition-transform">🍯</div>;
    return <JarIcon c1={product.pi % 2 === 0 ? '#D4EDE0' : '#EBF5EE'} c2={product.pi % 2 === 0 ? '#1B5E3B' : '#0D3520'} sub="" idSuffix={product.id.toString()} className="scale-75 md:scale-100" />;
  };

  return (
    <div 
      onClick={() => onOpen(product.id)}
      className="bg-[#FDFAF4] rounded-2xl md:rounded-3xl overflow-hidden border border-[#DDD0B5] cursor-pointer transition-all duration-300 hover:shadow-xl group relative"
    >
      <div className={`h-[150px] md:h-[220px] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#F8F1E4] to-[#EDE2CC]`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(27,94,59,0.1),transparent_60%)] pointer-events-none z-1"></div>
        
        <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex flex-col gap-1">
          {product.badges.map((b, i) => (
            <span key={i} className="bg-primary text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-[7px] md:text-[8px] font-black tracking-wider uppercase">
              {b}
            </span>
          ))}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onWish(product.id); }}
          className={`absolute top-2 right-2 md:top-3 md:right-3 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-none shadow-lg transition-all active:scale-75 backdrop-blur-md ${isInWishlist ? 'bg-red-50 text-[#C03030]' : 'bg-white/90 text-primary'}`}
        >
          <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        <div className="relative z-5 transition-transform duration-500 group-active:scale-110">
          {getIcon()}
        </div>

        {product.stock <= 10 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 md:p-4 z-10 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive blink"></div>
            <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-wider">Only {product.stock} left!</span>
          </div>
        )}
      </div>

      <div className="p-3 md:p-5">
        <h3 className="font-headline text-sm md:text-xl font-bold text-foreground leading-tight mb-1 truncate">{product.name}</h3>
        <p className="text-[9px] md:text-[11px] text-[#7A6848] font-bold mb-2 md:mb-3">{product.vol}</p>
        
        <div className="flex items-center gap-1.5 mb-2.5 md:mb-4">
          <span className="text-base md:text-2xl font-black text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-[8px] md:text-xs text-[#B0A080] line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
          )}
        </div>

        <Button 
          onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
          className={`w-full rounded-xl h-9 md:h-11 text-[9px] md:text-xs font-black tracking-wider uppercase transition-all ${isInCart ? 'bg-primary/10 text-primary' : 'bg-primary text-white hover:bg-secondary'}`}
        >
          {isInCart ? '✓ Added' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};
