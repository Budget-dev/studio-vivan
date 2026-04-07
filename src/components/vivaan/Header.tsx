
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, ChevronDown, User, X, LogOut, Package, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCollection, useFirestore, useMemoFirebase, useUser, useAuth } from '@/firebase';
import { collection } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { LoginModal } from './LoginModal';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
  onFilter: (cat: string) => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, cartCount, onFilter, onSearch }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories } = useCollection(categoriesRef);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setIsSearchOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
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

          <Link href="/blog" className="text-[13px] font-medium text-primary/80 hover:text-primary transition-colors">
            Journal
          </Link>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[200px] shadow-2xl border-primary/5">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-[#F9F6EF] mb-2">
                    <div className="text-xs font-black text-primary truncate">{user.displayName || 'Farmer'}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <DropdownMenuItem onClick={() => router.push('/track')} className="rounded-xl py-2.5 px-3 text-xs font-bold cursor-pointer">
                    <Package className="w-4 h-4 mr-2 text-primary/40" /> Track My Order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-2.5 px-3 text-xs font-bold cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setIsLoginOpen(true)} className="rounded-xl py-2.5 px-3 text-xs font-bold cursor-pointer">
                    <User className="w-4 h-4 mr-2 text-primary/40" /> Customer Login
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin/login')} className="rounded-xl py-2.5 px-3 text-xs font-bold cursor-pointer">
                    <ShieldCheck className="w-4 h-4 mr-2 text-primary/40" /> Admin Access
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

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
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </header>
  );
};
