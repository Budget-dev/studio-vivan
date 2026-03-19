"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <header className="bg-white sticky top-0 z-[900] border-b border-[#DDD0B5]/30">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-[90px] md:h-[120px] flex items-center justify-between gap-4 md:gap-8 relative">
        {/* Logo Section */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="w-24 h-24 md:w-36 md:h-36 relative flex items-center justify-center transition-transform duration-300 hover:scale-105 shrink-0">
            <Image 
              src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
              alt="Vivaan Farms Logo"
              width={144}
              height={144}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5 ml-2.5">
          <Link href="/" className="px-4 py-2 rounded-full text-xs font-bold text-[#7A6848] hover:text-primary hover:bg-primary/5 transition-all">Home</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 rounded-full text-xs font-bold text-[#7A6848] hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-1">
                Shop <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-3 min-w-[200px] bg-white border-[#DDD0B5]">
              <DropdownMenuItem onClick={() => onFilter('ghee')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-primary/5 hover:text-primary cursor-pointer">🧈 A2 Gir Cow Ghee</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('pickles')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-primary/5 hover:text-primary cursor-pointer">🌶️ Handmade Pickles</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('sweets')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-primary/5 hover:text-primary cursor-pointer">🎁 Artisanal Sweets</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('honey')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-primary/5 hover:text-primary cursor-pointer">🍯 Forest Honey</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('oil')} className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-primary/5 hover:text-primary cursor-pointer">🫙 Cold Press Oils</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about" className="px-4 py-2 rounded-full text-xs font-bold text-[#7A6848] hover:text-primary hover:bg-primary/5 transition-all">Our Story</Link>
          <Link href="/blog" className="px-4 py-2 rounded-full text-xs font-bold text-[#7A6848] hover:text-primary hover:bg-primary/5 transition-all">Blog</Link>
        </nav>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-[420px] mx-auto relative">
          <Input 
            className="w-full h-11 bg-[#F9F6EF] border-[#DDD0B5] rounded-full pl-5 pr-12 text-sm text-[#100C06] placeholder:text-[#B0A080] focus-visible:bg-white focus-visible:border-primary/40 focus-visible:ring-0 transition-all"
            placeholder="Search ghee, pickles, sweets, honey..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center hover:bg-primary/10 transition-all">
            <Search className="w-4 h-4 text-primary" />
          </button>
        </form>

        <div className="flex items-center gap-2 md:gap-2.5">
          <button className="w-10 h-10 md:w-12 md:h-12 bg-[#F9F6EF] border border-[#DDD0B5]/50 rounded-full flex items-center justify-center hover:bg-primary/5 transition-all group relative">
            <Search className="md:hidden w-4 h-4 text-[#100C06]" />
            <Heart className="hidden md:block w-4 h-4 text-[#100C06] group-hover:fill-primary group-hover:text-primary transition-all" />
          </button>
          
          <div className="relative group">
            <Button 
              onClick={onOpenCart}
              className="bg-gradient-to-br from-[#F5D060] to-[#C49A2A] text-[#100C06] hover:translate-y-[-1px] transition-all rounded-full px-3.5 md:px-5 h-10 md:h-12 text-[10px] md:text-xs font-extrabold shadow-[0_3px_12px_rgba(196,154,42,0.4)] flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-primary text-white rounded-full min-w-[16px] h-4 md:min-w-[20px] md:h-5 flex items-center justify-center text-[8px] md:text-[10px] font-black border-2 border-white">
                {cartCount}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
