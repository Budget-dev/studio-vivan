
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingCart, 
  Search, 
  User, 
  X, 
  LogOut, 
  Package, 
  Menu,
  ChevronDown,
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
  const pathname = usePathname();
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

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'ghee', label: 'A2 Gir Ghee' },
    { id: 'sweets', label: 'Farm Sweets' },
    { id: 'honey', label: 'Wild Honey' },
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/#products', onClick: () => {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } },
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white sticky top-0 z-[900] border-b border-[#F1EAD8] shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 h-[56px] md:h-[68px] flex items-center justify-between relative">
        
        {/* Mobile Left Menu */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Logo (Left) */}
        <div className={cn("flex items-center transition-opacity duration-300", isSearchOpen ? "md:opacity-100 opacity-0" : "opacity-100")}>
          <Link href="/" className="flex items-center shrink-0 group py-1">
            <div className="hidden md:block w-28 h-7 relative transition-all duration-500 group-hover:scale-105">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="Vivaan Farms"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <div className="md:hidden w-24 h-6 relative">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="Vivaan Farms"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links (Center) - Hidden when search is active */}
        <nav className={cn(
          "hidden lg:flex items-center gap-6 transition-all duration-300",
          isSearchOpen ? "opacity-0 pointer-events-none translate-y-[-10px]" : "opacity-100 translate-y-0"
        )}>
          {navLinks.slice(0, 2).map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link 
                key={link.label} 
                href={link.href} 
                onClick={link.onClick}
                className={cn(
                  "relative py-1 text-[11px] font-black uppercase tracking-[2px] transition-colors hover:text-primary",
                  isActive ? "text-primary after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-primary" : "text-[#7A6848]"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 py-1 text-[11px] font-black uppercase tracking-[2px] text-[#7A6848] hover:text-primary outline-none">
                Categories <ChevronDown className="w-3 h-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl p-2 min-w-[180px] shadow-2xl border-[#F1EAD8] font-body mt-2">
              {categories.map((cat) => (
                <DropdownMenuItem 
                  key={cat.id} 
                  onClick={() => { onFilter(cat.id); router.push('/#products'); }}
                  className="rounded-lg py-2.5 px-4 text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-primary/5"
                >
                  {cat.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.slice(2).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.label} 
                href={link.href}
                className={cn(
                  "relative py-1 text-[11px] font-black uppercase tracking-[2px] transition-colors hover:text-primary",
                  isActive ? "text-primary after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1.5px] after:bg-primary" : "text-[#7A6848]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Overlay (Absolute centered-right) */}
        {isSearchOpen && (
          <div className="absolute inset-x-4 md:left-[160px] md:right-32 lg:left-[300px] lg:right-40 flex items-center animate-in fade-in zoom-in-95 duration-300">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input 
                autoFocus
                className="w-full h-9 rounded-full border-primary/20 pl-5 pr-10 text-sm bg-white shadow-lg focus-visible:ring-primary focus-visible:border-primary"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setSearchOpen(false)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Utility Icons (Right) */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Search Toggle Button */}
          {!isSearchOpen && (
            <button 
              onClick={() => setSearchOpen(true)} 
              className="p-2 text-primary/70 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          )}

          {/* User & Cart - Stay visible on desktop, hidden on mobile during search */}
          <div className={cn("flex items-center gap-1 md:gap-2 transition-opacity duration-300", isSearchOpen ? "md:opacity-100 opacity-0 pointer-events-none md:pointer-events-auto" : "opacity-100")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-primary/70 hover:text-primary hover:bg-primary/5 rounded-full">
                  <User className="w-4.5 h-4.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[200px] shadow-2xl border-[#F1EAD8]">
                {user ? (
                  <>
                    <div className="px-3 py-3 border-b border-[#F9F6EF] mb-1">
                      <div className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Logged in as</div>
                      <div className="text-xs font-bold truncate">{user.displayName || user.email}</div>
                    </div>
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-lg py-2.5 px-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-primary/5">
                      <User className="w-3.5 h-3.5 mr-2" /> My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/track')} className="rounded-lg py-2.5 px-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-primary/5">
                      <Package className="w-3.5 h-3.5 mr-2" /> My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg py-2.5 px-3 text-[10px] font-black uppercase tracking-widest cursor-pointer text-destructive">
                      <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => setLoginOpen(true)} className="rounded-lg py-2.5 px-3 text-[10px] font-black uppercase tracking-widest cursor-pointer">
                    <User className="w-3.5 h-3.5 mr-2" /> Login / Register
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              onClick={onOpenCart} 
              className="p-2 text-primary/70 hover:text-primary hover:bg-primary/5 rounded-full relative"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[7px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] p-0 border-none bg-white">
          <div className="h-full flex flex-col p-6">
            <div className="mb-10 w-32 h-8 relative">
               <Image src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png" alt="Vivaan" fill className="object-contain" />
            </div>

            <nav className="space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  onClick={() => { setMobileMenuOpen(false); if(link.onClick) link.onClick(); }}
                  className="block text-lg font-headline font-bold text-primary hover:translate-x-1 transition-transform"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-6 border-t border-primary/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#AFA18B] mb-4">Categories</p>
                {categories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => { onFilter(cat.id); setMobileMenuOpen(false); router.push('/#products'); }}
                    className="block w-full text-left py-2 text-primary/80 font-bold"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
              {user ? (
                 <button onClick={handleLogout} className="text-xs font-black uppercase tracking-widest text-destructive">Logout</button>
              ) : (
                 <button onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }} className="text-xs font-black uppercase tracking-widest text-primary">Login Now</button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
};
