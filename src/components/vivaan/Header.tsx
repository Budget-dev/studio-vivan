"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Category } from '@/types';

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
  onFilter: (cat: Category) => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, cartCount, onFilter, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <header className="bg-[#0D3520] sticky top-0 z-[900] shadow-2xl">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-[64px] md:h-[72px] flex items-center justify-between gap-4 md:gap-8 relative overflow-hidden">
        <div className="absolute top-[-40px] right-20 w-[130px] h-[130px] rounded-full bg-[radial-gradient(circle,rgba(196,154,42,0.25)_0%,transparent_70%)] pointer-events-none hidden md:block"></div>
        
        <a href="/" className="flex items-center gap-2.5 md:gap-3 shrink-0">
          <div className="w-10 h-10 md:w-14 md:h-14 relative flex items-center justify-center transition-transform duration-300 hover:rotate-[-8deg] hover:scale-110 shrink-0">
            <Image 
              src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
              alt="Vivaan Farms Logo"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="font-headline text-xl md:text-3xl font-extrabold text-white tracking-[3px] md:tracking-[5px] leading-none">VIVAAN</div>
            <div className="text-[7px] md:text-[9px] text-white/40 font-semibold tracking-[2px] md:tracking-[3px] uppercase mt-0.5">PURE FARM GOODS</div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5 ml-2.5">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-4 py-2 rounded-full text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all">Home</button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 rounded-full text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1">
                Shop <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-3 min-w-[200px]">
              <DropdownMenuItem onClick={() => onFilter('ghee')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-background hover:text-secondary cursor-pointer">🧈 A2 Gir Cow Ghee</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('ghee')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-background hover:text-secondary cursor-pointer">🐃 Buffalo Ghee</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('oil')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-background hover:text-secondary cursor-pointer">🫙 Cold Press Oils</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('combo')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-background hover:text-secondary cursor-pointer">🎁 Combo Packs</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="px-4 py-2 rounded-full text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all">Our Story</button>
        </nav>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-[420px] mx-auto relative">
          <Input 
            className="w-full h-11 bg-white/10 border-white/20 rounded-full pl-5 pr-12 text-sm text-white placeholder:text-white/40 focus-visible:bg-white/20 focus-visible:border-white/40 focus-visible:ring-0 transition-all"
            placeholder="Search ghee, oils, combos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/25 transition-all">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="flex items-center gap-2 md:gap-2.5">
          <button className="w-9 h-9 md:w-11 md:h-11 bg-white/10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all group relative">
            <Search className="md:hidden w-4 h-4 text-white" />
            <Heart className="hidden md:block w-4 h-4 text-white group-hover:fill-white transition-all" />
          </button>
          
          <div className="relative group">
            <Button 
              onClick={onOpenCart}
              className="bg-gradient-to-br from-[#F5D060] to-[#C49A2A] text-[#100C06] hover:translate-y-[-1px] transition-all rounded-full px-3.5 md:px-5 h-9 md:h-11 text-[10px] md:text-xs font-extrabold shadow-[0_3px_12px_rgba(196,154,42,0.4)] flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-[#C03030] text-white rounded-full min-w-[16px] h-4 md:min-w-[20px] md:h-5 flex items-center justify-center text-[8px] md:text-[10px] font-black border-2 border-[#0D3520]">
                {cartCount}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
