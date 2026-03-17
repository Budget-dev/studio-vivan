"use client";

import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { JarIcon, ComboIcon, OilIcon } from './JarIcon';
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
    if (product.cat === 'combo') return <ComboIcon className="scale-110" />;
    if (product.cat === 'oil') return <OilIcon c1="#D8F0D0" c2="#68A850" lbl={product.name.toUpperCase()} idSuffix={product.id.toString()} />;
    return <JarIcon c1={product.pi % 2 === 0 ? '#F8E878' : '#FBE898'} c2={product.pi % 2 === 0 ? '#D4A030' : '#D0A030'} sub={product.name.toUpperCase()} idSuffix={product.id.toString()} />;
  };

  const gradientColors = [
    'from-[#FBF0E0] to-[#EDE0C0]',
    'from-[#F2EDD8] to-[#E8DFC0]',
    'from-[#FCF8EC] to-[#F0E8D2]',
    'from-[#F0F0F0] to-[#E0E0DC]',
    'from-[#EDF7EE] to-[#D8EDD8]',
    'from-[#F4ECD8] to-[#E8DEC0]'
  ];

  return (
    <div 
      onClick={() => onOpen(product.id)}
      className="bg-card rounded-3xl overflow-hidden border border-border cursor-pointer transition-all duration-300 hover:translate-y-[-6px] hover:shadow-2xl group relative"
    >
      <div className={`h-[220px] flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${gradientColors[product.pi % gradientColors.length]}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none z-1"></div>
        
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.badges.map((b, i) => (
            <span key={i} className="bg-primary text-white px-2.5 py-1 rounded-lg text-[8px] font-black tracking-wider uppercase">
              {b}
            </span>
          ))}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onWish(product.id); }}
          className={`absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center border-none shadow-lg transition-all active:scale-90 backdrop-blur-md ${isInWishlist ? 'bg-red-50 text-destructive' : 'bg-white/90 text-[#9A6818] hover:scale-110'}`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        <div className="relative z-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-2deg]">
          {getIcon()}
        </div>

        {product.stock <= 10 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8 z-10 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 blink"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-wider">Only {product.stock} left!</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-headline text-xl font-bold text-foreground leading-tight mb-1">{product.name}</h3>
        <p className="text-[11px] text-[#7A6A52] font-medium mb-3">{product.vol}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rat) ? 'text-[#E0A838] fill-current' : 'text-border'}`} />
            ))}
          </div>
          <span className="text-[11px] text-[#7A6A52] font-semibold">{product.rat} ({product.revs})</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-black text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp && product.mrp > product.price && (
            <>
              <span className="text-xs text-border line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">{product.off}</span>
            </>
          )}
        </div>

        <Button 
          onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
          className={`w-full rounded-2xl h-11 text-xs font-black tracking-wider uppercase transition-all ${isInCart ? 'bg-gradient-to-r from-secondary/80 to-secondary text-white' : 'bg-primary text-white hover:bg-secondary'}`}
        >
          {isInCart ? '✓ Added to Cart' : '+ Add to Cart'}
        </Button>
      </div>
    </div>
  );
};
