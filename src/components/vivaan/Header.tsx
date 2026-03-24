"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Category } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faSearch, faHeart } from '@fortawesome/free-solid-svg-icons';

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
    <header className="bg-white sticky top-0 z-[900] border-b border-primary/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-[80px] md:h-[110px] flex items-center justify-between gap-4 md:gap-8 relative">
        {/* Logo Section */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="w-20 h-20 md:w-32 md:h-32 relative flex items-center justify-center transition-transform duration-300 hover:scale-105 shrink-0">
            <Image 
              src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
              alt="Vivaan Farms Logo"
              width={128}
              height={128}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          <Link href="/" className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider text-primary/70 hover:text-primary hover:bg-primary/5 transition-all">Home</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider text-primary/70 hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-1.5">
                Shop <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-3 min-w-[200px] bg-white border-primary/10 shadow-2xl">
              <DropdownMenuItem onClick={() => onFilter('ghee')} className="rounded-xl py-2.5 px-3.5 text-xs font-bold hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors">🧈 A2 Gir Cow Ghee</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('pickles')} className="rounded-xl py-2.5 px-3.5 text-xs font-bold hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors">🌶️ Handmade Pickles</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('sweets')} className="rounded-xl py-2.5 px-3.5 text-xs font-bold hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors">🎁 Artisanal Sweets</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter('honey')} className="rounded-xl py-2.5 px-3.5 text-xs font-bold hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors">🍯 Forest Honey</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about" className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider text-primary/70 hover:text-primary hover:bg-primary/5 transition-all">Our Story</Link>
          <Link href="/blog" className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider text-primary/70 hover:text-primary hover:bg-primary/5 transition-all">Blog</Link>
        </nav>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-[380px] mx-auto relative">
          <Input 
            className="w-full h-10 bg-primary/[0.03] border-primary/10 rounded-full pl-5 pr-12 text-sm text-primary placeholder:text-primary/30 focus-visible:bg-white focus-visible:border-primary/40 focus-visible:ring-0 transition-all font-medium"
            placeholder="Search farm purity..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-primary/5 rounded-full flex items-center justify-center hover:bg-primary/10 transition-all">
            <FontAwesomeIcon icon={faSearch} className="text-[10px] text-primary" />
          </button>
        </form>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="w-9 h-9 md:w-11 md:h-11 bg-primary/[0.03] border border-primary/10 rounded-full flex items-center justify-center hover:bg-primary/5 transition-all group relative">
            <FontAwesomeIcon icon={faSearch} className="md:hidden text-xs text-primary" />
            <FontAwesomeIcon icon={faHeart} className="hidden md:block text-xs text-primary group-hover:text-red-500 transition-colors" />
          </button>
          
          <div className="relative group">
            <Button 
              onClick={onOpenCart}
              className="bg-primary text-white hover:bg-secondary transition-all rounded-full px-4 md:px-6 h-9 md:h-11 text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2.5 whitespace-nowrap border-none"
            >
              <FontAwesomeIcon icon={faCartShopping} className="text-[10px] md:text-sm" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-primary rounded-full min-w-[16px] h-4 md:min-w-[20px] md:h-5 flex items-center justify-center text-[8px] md:text-[10px] font-black px-1">
                {cartCount}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};