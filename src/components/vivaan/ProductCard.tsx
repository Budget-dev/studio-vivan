"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { JarIcon, ComboIcon } from './JarIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPepperHot, faCookieBite, faDroplet, faStar, faArrowTrendUp, faCartShopping, faTicket } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  isInCart: boolean;
  onOpen: (id: number) => void;
  onAdd: (id: number) => void;
  onWish: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInWishlist, isInCart, onOpen, onAdd, onWish }) => {
  const router = useRouter();

  const getIcon = () => {
    if (product.cat === 'combo') return <ComboIcon className="scale-100 md:scale-125" />;
    if (product.cat === 'pickles') return <FontAwesomeIcon icon={faPepperHot} className="text-5xl md:text-8xl text-primary/80 group-hover:scale-110 transition-transform duration-500" />;
    if (product.cat === 'sweets') return <FontAwesomeIcon icon={faCookieBite} className="text-5xl md:text-8xl text-primary/80 group-hover:scale-110 transition-transform duration-500" />;
    if (product.cat === 'honey') return <FontAwesomeIcon icon={faDroplet} className="text-5xl md:text-8xl text-primary/80 group-hover:scale-110 transition-transform duration-500" />;
    return <JarIcon c1={product.pi % 2 === 0 ? '#D4EDE0' : '#EBF5EE'} c2={product.pi % 2 === 0 ? '#1B5E3B' : '#0D3520'} sub="" idSuffix={product.id.toString()} className="scale-80 md:scale-110" />;
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  // Calculate best price (simulating coupon logic)
  const bestPrice = Math.round(product.price * 0.7);

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-[24px] overflow-hidden border border-[#DDD0B5]/60 cursor-pointer transition-all duration-500 hover:shadow-2xl group relative"
    >
      {/* Image Container */}
      <div className="h-[180px] md:h-[280px] flex items-center justify-center relative overflow-hidden bg-[#F5F5F5]">
        {/* Discount Badge */}
        {product.off && (
          <div className="absolute top-0 left-3 md:left-4 w-10 md:w-12 h-14 md:h-16 bg-primary rounded-b-full flex flex-col items-center justify-center text-white z-20 shadow-lg">
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-80">Flat</span>
            <span className="text-[11px] md:text-[13px] font-black">{product.off}</span>
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-80">Off</span>
          </div>
        )}

        {/* Best Seller Badge */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-primary text-white text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 z-20 shadow-md">
          <FontAwesomeIcon icon={faStar} className="text-white scale-75 md:scale-100" />
          <span className="uppercase tracking-wider">Best Seller</span>
        </div>

        {/* Top Rated Floating Banner */}
        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-[#EEF9F0] text-primary text-[9px] md:text-[11px] font-black px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-xl flex items-center gap-1.5 md:gap-2 border border-primary/10 shadow-sm z-20">
          <FontAwesomeIcon icon={faArrowTrendUp} className="scale-75 md:scale-100" />
          <span>Top Rated Choice</span>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onWish(product.id); }}
          className={`absolute top-16 md:top-20 left-3 md:left-4 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all active:scale-75 backdrop-blur-md shadow-sm border border-black/5 ${isInWishlist ? 'bg-red-50 text-red-500' : 'bg-white/80 text-primary hover:bg-white'}`}
        >
          <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Product Visual */}
        <div className="relative z-10 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center w-full h-full p-6 md:p-8">
          {getIcon()}
        </div>

        {/* Stock Alert */}
        {product.stock <= 10 && (
          <div className="absolute bottom-0 left-0 right-0 bg-destructive/90 py-1 flex items-center justify-center gap-1.5 z-20">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white animate-pulse"></div>
            <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest leading-none">Hurry! Only {product.stock} items left</span>
          </div>
        )}
      </div>

      {/* Product Info Area */}
      <div className="p-3.5 md:p-6 pt-6 md:pt-8 relative">
        {/* ADD Button overlapping - Slim & Sleek Version */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
          className={cn(
            "absolute -top-6 md:-top-7 right-3 md:right-6 h-10 md:h-14 px-5 md:px-8 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 transition-all z-30 shadow-xl border-2 font-black uppercase tracking-widest text-[10px] md:text-sm",
            isInCart 
              ? "bg-white border-primary text-primary" 
              : "bg-primary border-primary text-white hover:bg-secondary hover:border-secondary"
          )}
        >
          <span>{isInCart ? 'Added' : 'Add'}</span>
          <FontAwesomeIcon icon={faCartShopping} className="text-[10px] md:text-base" />
        </button>

        {/* Title */}
        <h3 className="font-headline text-base md:text-2xl font-bold text-foreground leading-tight mb-2 md:mb-3 line-clamp-2">
          {product.name} — {product.vol}
        </h3>
        
        {/* Ratings */}
        <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
          <div className="flex items-center text-yellow-400">
            <FontAwesomeIcon icon={faStar} className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
          </div>
          <span className="text-xs md:text-sm font-black text-foreground/80">{product.rat}</span>
          <span className="text-[10px] md:text-xs font-medium text-muted-foreground">({product.revs} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 md:gap-2 mb-3 md:mb-4">
          <span className="text-xl md:text-3xl font-black text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-[10px] md:text-sm text-muted-foreground line-through decoration-destructive/40 decoration-2">₹{product.mrp.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Best Price Bar */}
        <div className="bg-[#EEF9F0] rounded-lg md:rounded-xl p-2 md:p-2.5 flex items-center justify-between border border-primary/5">
          <div className="flex items-center gap-1.5 md:gap-2">
            <FontAwesomeIcon icon={faTicket} className="text-primary text-[9px] md:text-xs" />
            <span className="text-[9px] md:text-[11px] font-bold text-primary">Best Price <span className="font-black">₹{bestPrice.toLocaleString('en-IN')}</span></span>
          </div>
          <span className="text-[8px] md:text-[9px] font-medium text-primary/60 uppercase tracking-tighter">with coupon</span>
        </div>
      </div>
    </div>
  );
};