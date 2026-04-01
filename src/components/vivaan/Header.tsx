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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
  onFilter: (cat: string) => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, cartCount, onFilter, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories } = useCollection(categoriesRef);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <header className="bg-white sticky top-0 z-[900] border-b border-primary/10">
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
          <Link href="/" className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-primary/5 transition-all">Home</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-1">
                Shop <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-3 min-w-[200px] bg-white border-primary/10">
              {categories && categories.length > 0 ? categories.map((cat) => (
                <DropdownMenuItem 
                  key={cat.id} 
                  onClick={() => onFilter(cat.name.toLowerCase())} 
                  className="rounded-xl py-2.5 px-3.5 text-xs font-semibold hover:bg-primary/5 hover:text-primary cursor-pointer capitalize"
                >
                  {cat.name}
                </DropdownMenuItem>
              )) : (
                <DropdownMenuItem className="text-[10px] text-muted-foreground italic">Add categories in admin</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/about" className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-primary/5 transition-all">Our Story</Link>
          <Link href="/blog" className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-primary/5 transition-all">Blog</Link>
        </nav>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-[420px] mx-auto relative">
          <Input 
            className="w-full h-11 bg-primary/[0.03] border-primary/10 rounded-full pl-5 pr-12 text-sm text-primary placeholder:text-primary/30 focus-visible:bg-white focus-visible:border-primary/40 focus-visible:ring-0 transition-all"
            placeholder="Search ghee, sweets, honey..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center hover:bg-primary/10 transition-all">
            <Search className="w-4 h-4 text-primary" />
          </button>
        </form>

        <div className="flex items-center gap-2 md:gap-2.5">
          <button className="w-10 h-10 md:w-12 md:h-12 bg-primary/[0.03] border border-primary/10 rounded-full flex items-center justify-center hover:bg-primary/5 transition-all group relative">
            <Search className="md:hidden w-4 h-4 text-primary" />
            <Heart className="hidden md:block w-4 h-4 text-primary group-hover:fill-primary group-hover:text-primary transition-all" />
          </button>
          
          <div className="relative group">
            <Button 
              onClick={onOpenCart}
              className="bg-primary text-white hover:bg-secondary transition-all rounded-full px-3.5 md:px-5 h-10 md:h-12 text-[10px] md:text-xs font-extrabold shadow-xl flex items-center gap-2 whitespace-nowrap"
            >
              <i className="fa-solid fa-shopping-cart text-[14px]"></i>
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-primary rounded-full min-w-[16px] h-4 md:min-w-[20px] md:h-5 flex items-center justify-center text-[8px] md:text-[10px] font-black">
                {cartCount}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
