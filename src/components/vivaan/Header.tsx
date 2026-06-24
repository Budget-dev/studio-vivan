"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Search, 
  User, 
  X, 
  LogOut, 
  Package, 
  Menu,
  ChevronRight,
  Sparkles,
  Phone,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUser, useAuth } from '@/firebase';
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
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const auth = useAuth();
  const { user } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navItems = [
    { label: 'Explore Collection', sub: 'The Collection', onClick: () => { onFilter('all'); setMobileMenuOpen(false); } },
    { label: 'A2 Gir Ghee', sub: 'Traditional', onClick: () => { onFilter('ghee'); setMobileMenuOpen(false); } },
    { label: 'Farm Sweets', sub: 'Handcrafted', onClick: () => { onFilter('sweets'); setMobileMenuOpen(false); } },
    { label: 'Wild Honey', sub: 'Raw', onClick: () => { onFilter('honey'); setMobileMenuOpen(false); } },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-[900] border-b border-[#F1EAD8] shadow-[0_2px_15px_-1px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-[70px] md:h-[110px] flex items-center justify-between">
        
        {/* Mobile Left Menu */}
        <div className="md:hidden w-10 flex justify-start">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-primary/80 hover:bg-primary/5 rounded-full transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Logo - Left Aligned */}
        <div className="flex-1 md:flex-initial flex justify-center md:justify-start h-full items-center">
          <Link href="/" className="flex items-center shrink-0 group relative py-2">
            <div className="hidden md:block w-44 h-20 relative transition-all duration-500 group-hover:scale-105">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="Vivaan Farms"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {/* Mobile Logo */}
            <div className="md:hidden w-32 h-10 relative">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="vivaan farms"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Centered Main Navigation (Desktop) */}
        <nav className="hidden xl:flex items-center gap-10 2xl:gap-14 mx-auto h-full">
          {navItems.map((item) => (
            <button 
              key={item.label}
              onClick={item.onClick}
              className="group flex flex-col items-center relative py-2"
            >
              <span className="text-[8px] font-black text-[#7A6848]/40 uppercase tracking-[2.5px] mb-1 transition-all group-hover:text-primary/60">
                {item.sub}
              </span>
              <span className="font-headline text-2xl font-semibold italic text-primary/80 group-hover:text-primary transition-all tracking-tight relative">
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary transition-all duration-500 group-hover:w-full opacity-30"></span>
              </span>
            </button>
          ))}
          
          <div className="w-[1px] h-6 bg-[#DDD0B5]/30 mx-2"></div>

          <Link href="/about" className="group flex flex-col items-center relative py-2">
            <span className="text-[8px] font-black text-[#7A6848]/40 uppercase tracking-[2.5px] mb-1">Legacy</span>
            <span className="font-headline text-2xl font-semibold italic text-primary/80 group-hover:text-primary transition-all tracking-tight">Our Story</span>
          </Link>
        </nav>

        {/* Utility Actions - Right Aligned */}
        <div className="flex items-center justify-end gap-2 md:gap-4 w-10 md:w-auto">
          {/* Search Action */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center animate-in slide-in-from-right-4 duration-500">
                <Input 
                  autoFocus
                  className="w-[220px] md:w-[350px] h-11 rounded-full border-primary/10 pl-6 pr-12 text-sm bg-white shadow-xl focus-visible:ring-primary/20"
                  placeholder="What are you looking for?"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-4 text-primary/40 hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)} 
                className="w-11 h-11 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-primary/5 rounded-full transition-all group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

          {/* User/Account Action */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-11 h-11 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-primary/5 rounded-full transition-all group">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[240px] shadow-2xl border-[#F1EAD8] font-body">
              {user ? (
                <>
                  <div className="px-4 py-4 border-b border-[#F9F6EF] mb-2 bg-[#F9F6EF]/40 rounded-t-xl">
                    <div className="text-[9px] font-black text-[#7A6848]/60 uppercase tracking-widest mb-1">Authentic Member</div>
                    <div className="text-sm font-bold text-primary truncate">{user.displayName || 'Farmer'}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <DropdownMenuItem onClick={() => router.push('/track')} className="rounded-xl py-3 px-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-primary/5">
                    <Package className="w-4 h-4 mr-3 text-primary/40" /> Order History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 px-3 text-[10px] font-black uppercase tracking-widest cursor-pointer text-destructive hover:bg-destructive/5">
                    <LogOut className="w-4 h-4 mr-3" /> Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => setLoginOpen(true)} className="rounded-xl py-3 px-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-primary/5">
                  <User className="w-4 h-4 mr-3 text-primary/40" /> Sign In / Register
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Premium Cart Button */}
          <button 
            onClick={onOpenCart} 
            className="group relative flex items-center bg-primary text-white h-11 md:h-13 px-4 md:px-7 rounded-full transition-all hover:bg-secondary hover:shadow-xl active:scale-95"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <div className="absolute -top-3.5 -right-3.5 bg-accent text-white text-[9px] font-black rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-primary shadow-sm">
                {cartCount}
              </div>
            </div>
            <span className="hidden lg:inline ml-3.5 text-[11px] font-black tracking-[2px] uppercase">
              Bag
            </span>
          </button>
        </div>
      </div>

      {/* Premium Luxury Mobile Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent 
          side="left" 
          className="w-[86vw] max-w-[320px] p-0 border-none bg-[#FCFBF8] shadow-[0_0_40px_rgba(0,0,0,0.08)] rounded-tr-[24px] rounded-br-[24px] z-[1000] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          
          <div className="h-full flex flex-col pt-safe">
            {/* Header with Centered Logo and Close */}
            <div className="relative h-[70px] flex items-center justify-center border-b border-[#F1EAD8]/40 px-6">
              <div className="w-32 h-10 relative">
                <Image 
                  src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                  alt="vivaan farms"
                  fill
                  className="object-contain"
                />
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
              {/* Collections Section */}
              <div className="space-y-8 mb-8">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[3px] text-[#AFA18B] mb-3">Collections</div>
                  <div className="space-y-5">
                    {navItems.map((item) => (
                      <button 
                        key={item.label}
                        onClick={item.onClick}
                        className="w-full flex items-center justify-between group py-1 active:bg-primary/[0.04] transition-all rounded-xl"
                      >
                        <span className="font-headline text-[24px] font-medium text-[#1F3D2B] transition-transform duration-300 group-active:translate-x-1">
                          {item.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#AFA18B]/30 group-active:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact & Legacy Section */}
                <div className="pt-8 border-t border-[#F1EAD8]/40">
                  <div className="text-[11px] font-black uppercase tracking-[3px] text-[#AFA18B] mb-3">Heritage & Care</div>
                  <div className="space-y-5">
                    <Link 
                      href="/about" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 group active:bg-primary/[0.04] transition-all rounded-xl py-1"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-[#1F3D2B]/40 transition-colors group-active:bg-primary group-active:text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-headline text-[24px] font-medium text-[#1F3D2B]">Our Legacy</span>
                    </Link>
                    <Link 
                      href="/contact" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 group active:bg-primary/[0.04] transition-all rounded-xl py-1"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-[#1F3D2B]/40 transition-colors group-active:bg-primary group-active:text-white">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-headline text-[24px] font-medium text-[#1F3D2B]">Support</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Area for Mobile Drawer */}
            <div className="p-6 bg-[#FCFBF8] border-t border-[#F1EAD8]/40 pb-safe-offset-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#AFA18B] uppercase tracking-wider mb-0.5">Welcome</span>
                    <span className="font-bold text-primary text-sm truncate max-w-[140px]">{user.displayName || 'Farmer'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive font-black text-[10px] uppercase tracking-widest"
                  >
                    Logout <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
                  className="w-full h-13 flex items-center justify-center bg-primary text-white font-black text-[10px] uppercase tracking-[2px] rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                  Enter Portal ✦
                </button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
};
