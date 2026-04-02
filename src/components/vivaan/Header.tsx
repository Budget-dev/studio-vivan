
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Search, ChevronDown, User, X } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
  onFilter: (cat: string) => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, cartCount, onFilter, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories } = useCollection(categoriesRef);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setIsSearchOpen(false);
  };

  const navItems = [
    { label: 'All Products', onClick: () => onFilter('all') },
    { label: 'A2 Ghee', onClick: () => onFilter('ghee') },
    { label: 'Sweets', onClick: () => onFilter('sweets') },
    { label: 'Honey', onClick: () => onFilter('honey') },
  ];

  return (
    <header className="bg-white sticky top-0 z-[900] border-b border-primary/5">
      <div className="max-w-[1500px] mx-auto px-5 lg:px-10 h-[70px] md:h-[90px] flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <Image 
              src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
              alt="Vivaan Farms"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Center: Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 mx-4">
          {navItems.map((item) => (
            <button 
              key={item.label}
              onClick={item.onClick}
              className="text-[13px] font-medium text-primary/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[13px] font-medium text-primary/80 hover:text-primary flex items-center gap-1 transition-colors">
                Shop <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl p-2 min-w-[180px] shadow-xl border-primary/5">
              {categories?.map((cat) => (
                <DropdownMenuItem 
                  key={cat.id} 
                  onClick={() => onFilter(cat.name.toLowerCase())}
                  className="rounded-lg py-2 px-3 text-xs font-medium cursor-pointer capitalize"
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="text-[13px] font-bold text-[#1B5E3B] hover:opacity-80 transition-opacity whitespace-nowrap">
            Vivaan Health Partner
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[13px] font-medium text-primary/80 hover:text-primary flex items-center gap-1 transition-colors">
                Blogs <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl p-2 min-w-[180px] shadow-xl border-primary/5">
              <DropdownMenuItem asChild className="rounded-lg py-2 px-3 text-xs font-medium cursor-pointer">
                <Link href="/blog">Our Journal</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg py-2 px-3 text-xs font-medium cursor-pointer">
                <Link href="/about">Purity Story</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          {/* Search Toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center animate-in slide-in-from-right-4 duration-300">
                <Input 
                  autoFocus
                  className="w-[200px] md:w-[300px] h-10 rounded-full border-primary/10 pl-4 pr-10 text-sm"
                  placeholder="Search pure products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 text-primary/40 hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Account */}
          <Link href="/admin/login" className="w-10 h-10 hidden md:flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
            <User className="w-5 h-5" />
          </Link>

          {/* Cart Button */}
          <button 
            onClick={onOpenCart}
            className="group relative flex items-center justify-center w-10 h-10 md:w-auto md:px-2 text-primary/80 hover:text-primary transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 md:right-0 bg-primary text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-white">
              {cartCount}
            </div>
            <span className="hidden lg:inline ml-2 text-[13px] font-medium">Cart</span>
          </button>

          {/* Mobile Menu Button (Optional) */}
          <button className="xl:hidden w-10 h-10 flex items-center justify-center text-primary/80">
            <div className="w-5 flex flex-col gap-1">
              <span className="w-full h-0.5 bg-current rounded-full"></span>
              <span className="w-full h-0.5 bg-current rounded-full"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
