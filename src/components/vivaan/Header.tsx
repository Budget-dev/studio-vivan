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
  Info,
  Phone,
  ChevronRight,
  Sparkles
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
    { label: 'The Collection', sub: 'Explore Shop', onClick: () => { onFilter('all'); setMobileMenuOpen(false); } },
    { label: 'A2 Gir Ghee', sub: 'Vedic Purity', onClick: () => { onFilter('ghee'); setMobileMenuOpen(false); } },
    { label: 'Farm Sweets', sub: 'Traditional', onClick: () => { onFilter('sweets'); setMobileMenuOpen(false); } },
    { label: 'Wild Honey', sub: 'Raw & Pure', onClick: () => { onFilter('honey'); setMobileMenuOpen(false); } },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-[900] border-b border-primary/5 shadow-[0_2px_15px_-1px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-[70px] md:h-[110px] flex items-center justify-between">
        
        {/* Mobile Left */}
        <div className="md:hidden w-10 flex justify-start">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-primary/80 hover:bg-primary/5 rounded-full transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Logo Section */}
        <div className="flex-1 md:flex-initial flex justify-center md:justify-start h-full items-center">
          <Link href="/" className="flex items-center shrink-0 group relative py-2">
            <div className="hidden md:block w-48 h-24 relative transition-all duration-500 group-hover:scale-105">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="Vivaan Farms"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <div className="md:hidden w-32 h-10 relative">
              <Image 
                src="https://vivanfa.sirv.com/ChatGPT%20Image%20May%207%2C%202026%2C%2011_32_34%20PM.png"
                alt="vivaan farms"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Premium Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-10 2xl:gap-16 mx-12 h-full">
          {navItems.map((item) => (
            <button 
              key={item.label}
              onClick={item.onClick}
              className="group flex flex-col items-center relative py-2"
            >
              <span className="text-[9px] font-black text-[#7A6848]/40 uppercase tracking-[2px] mb-1 transition-all group-hover:text-primary/60">
                {item.sub}
              </span>
              <span className="font-headline text-2xl font-semibold italic text-primary/90 group-hover:text-primary transition-all tracking-tight relative">
                {item.label}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#D4A017] transition-all duration-500 group-hover:w-full opacity-60"></span>
              </span>
            </button>
          ))}
          
          <div className="w-px h-10 bg-primary/5 mx-2 hidden 2xl:block"></div>

          <Link href="/about" className="group flex flex-col items-center relative py-2">
            <span className="text-[9px] font-black text-[#7A6848]/40 uppercase tracking-[2px] mb-1">Our Heritage</span>
            <span className="font-headline text-2xl font-semibold italic text-primary/90 group-hover:text-primary transition-all tracking-tight">Legacy</span>
          </Link>

          <Link href="/contact" className="group flex flex-col items-center relative py-2">
            <span className="text-[9px] font-black text-[#7A6848]/40 uppercase tracking-[2px] mb-1">Support</span>
            <span className="font-headline text-2xl font-semibold italic text-primary/90 group-hover:text-primary transition-all tracking-tight">Contact</span>
          </Link>
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center justify-end gap-2 md:gap-4 w-10 md:w-auto">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center animate-in slide-in-from-right-4 duration-500">
                <Input 
                  autoFocus
                  className="w-[220px] md:w-[350px] h-12 rounded-full border-primary/10 pl-6 pr-12 text-sm bg-white shadow-xl"
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

          {/* User Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-11 h-11 flex items-center justify-center text-primary/70 hover:text-primary hover:bg-primary/5 rounded-full transition-all group">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[220px] shadow-2xl border-primary/5 font-body">
              {user ? (
                <>
                  <div className="px-4 py-4 border-b border-[#F9F6EF] mb-2 bg-[#F9F6EF]/30 rounded-t-xl">
                    <div className="text-[10px] font-black text-[#7A6848] uppercase tracking-widest mb-1">Authentic Member</div>
                    <div className="text-sm font-bold text-primary truncate">{user.displayName || 'Farmer'}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <DropdownMenuItem onClick={() => router.push('/track')} className="rounded-xl py-3 px-3 text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-primary/5">
                    <Package className="w-4 h-4 mr-3 text-primary/40" /> Order History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-3 px-3 text-xs font-black uppercase tracking-widest cursor-pointer text-destructive hover:bg-destructive/5">
                    <LogOut className="w-4 h-4 mr-3" /> Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => setLoginOpen(true)} className="rounded-xl py-3 px-3 text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-primary/5">
                  <User className="w-4 h-4 mr-3 text-primary/40" /> Sign In / Register
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart Section */}
          <button 
            onClick={onOpenCart} 
            className="group relative flex items-center bg-primary text-white h-11 md:h-12 px-4 md:px-6 rounded-full transition-all hover:bg-secondary hover:shadow-lg active:scale-95"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <div className="absolute -top-3 -right-3 bg-[#D4A017] text-white text-[9px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-primary shadow-sm">
                {cartCount}
              </div>
            </div>
            <span className="hidden lg:inline ml-3 text-[11px] font-black tracking-[2px] uppercase">
              Bag
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar - Enhanced */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[310px] sm:w-[380px] p-0 border-none bg-[#FDFBFA]">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col">
            <div className="p-8 bg-primary text-white relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-36 h-12 relative brightness-0 invert">
                   <Image 
                    src="https://vivanfa.sirv.com/ChatGPT%20Image%20May%207%2C%202026%2C%2011_32_34%20PM.png"
                    alt="vivaan farms"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>
              
              {user ? (
                <div className="relative z-10 text-left">
                  <div className="text-[10px] font-black uppercase tracking-[3px] text-white/40 mb-1">Authenticated Member</div>
                  <div className="text-2xl font-headline font-extrabold italic">{user.displayName || 'Farmer'}</div>
                </div>
              ) : (
                <div className="text-left">
                  <button 
                    onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
                    className="relative z-10 h-12 px-8 rounded-full bg-white text-primary text-[10px] font-black uppercase tracking-widest shadow-2xl"
                  >
                    Enter Purity Portal ✦
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-8">
              <div className="px-6 mb-10">
                <div className="text-[9px] font-black text-[#7A6848]/50 uppercase tracking-[4px] mb-6 px-4">Collections</div>
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <button 
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between py-4 px-5 rounded-2xl hover:bg-primary/5 transition-all group"
                    >
                      <div className="text-left">
                        <div className="text-[8px] font-black text-[#7A6848]/40 uppercase tracking-widest leading-none mb-1">{item.sub}</div>
                        <div className="text-xl font-headline font-bold italic text-primary group-hover:translate-x-1 transition-transform">{item.label}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-primary/20 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6">
                <div className="text-[9px] font-black text-[#7A6848]/50 uppercase tracking-[4px] mb-6 px-4">Heritage & Wisdom</div>
                <div className="space-y-2">
                  <Link 
                    href="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-5 py-4 px-5 rounded-2xl hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F9F6EF] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5 opacity-40" />
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-[#7A6848]/40 uppercase tracking-widest leading-none mb-1">Discover Purity</div>
                      <span className="text-xl font-headline font-bold italic text-primary">Legacy & Story</span>
                    </div>
                  </Link>
                  <Link 
                    href="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-5 py-4 px-5 rounded-2xl hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F9F6EF] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 opacity-40" />
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-[#7A6848]/40 uppercase tracking-widest leading-none mb-1">Reach Us</div>
                      <span className="text-xl font-headline font-bold italic text-primary">Purity Concierge</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border-t border-primary/5">
              <div className="bg-[#EBF5EE] p-5 rounded-[24px] text-center mb-6 border border-primary/5">
                <div className="text-[10px] font-black text-primary uppercase tracking-[3px] mb-1">Pure Promise</div>
                <div className="text-[11px] font-medium text-[#7A6848] italic">Gujarat Farm Direct Sourcing</div>
              </div>
              
              {user && (
                <button 
                  onClick={handleLogout}
                  className="w-full h-14 flex items-center justify-center gap-3 text-destructive font-black text-[10px] uppercase tracking-widest border-2 border-destructive/10 rounded-2xl hover:bg-destructive hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" /> End Session
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
