
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Search, 
  ChevronDown, 
  User, 
  X, 
  LogOut, 
  Package, 
  ShieldCheck,
  Menu,
  Home,
  BookOpen,
  Info,
  ChevronRight,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useCollection, useFirestore, useMemoFirebase, useUser, useAuth } from '@/firebase';
import { collection } from 'firebase/firestore';
import { signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LoginModal } from './LoginModal';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
  onFilter: (cat: string) => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, cartCount, onFilter, onSearch }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories } = useCollection(categoriesRef);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleLogoClick = async () => {
    if (!user) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        await setDoc(doc(db, 'userProfiles', result.user.uid), {
          id: result.user.uid,
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: result.user.email?.toLowerCase().trim(),
          purityCoins: 500,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        toast({ title: "Quick Auth Success!", description: `Welcome, ${result.user.displayName}` });
      } catch (e: any) {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  const navItems = [
    { label: 'All Products', onClick: () => { onFilter('all'); setMobileMenuOpen(false); } },
    { label: 'A2 Ghee', onClick: () => { onFilter('ghee'); setMobileMenuOpen(false); } },
    { label: 'Sweets', onClick: () => { onFilter('sweets'); setMobileMenuOpen(false); } },
    { label: 'Honey', onClick: () => { onFilter('honey'); setMobileMenuOpen(false); } },
  ];

  return (
    <header className="bg-white sticky top-0 z-[900] border-b border-primary/5">
      <div className="max-w-[1500px] mx-auto px-4 md:px-10 h-[64px] md:h-[90px] flex items-center justify-between">
        
        {/* Left: Hamburger & Logo Area */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-primary/80 hover:bg-primary/5 rounded-full transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button onClick={handleLogoClick} className="flex items-center shrink-0 group relative text-left">
            {/* Desktop Logo Image */}
            <div className="hidden md:block w-32 h-32 relative transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                alt="Vivaan Farms"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            
            {/* Mobile Stylized Text Logo (Anveshan style) */}
            <div className="md:hidden flex flex-col items-start">
              <span className="font-headline text-3xl font-bold text-primary leading-none tracking-tight lowercase">vivaan</span>
              <span className="text-[8px] font-black text-primary/40 uppercase tracking-[3px] -mt-0.5 ml-0.5">farms</span>
            </div>

            {!user && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap shadow-xl border border-white/20">
                  Direct Google Login
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Center: Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-10 2xl:gap-14 mx-8">
          {navItems.map((item) => (
            <button 
              key={item.label}
              onClick={item.onClick}
              className="text-[13px] font-bold text-primary/80 hover:text-primary transition-all tracking-wide uppercase"
            >
              {item.label}
            </button>
          ))}

          <Link href="/about" className="text-[13px] font-bold text-primary/80 hover:text-primary transition-all tracking-wide uppercase">
            About Us
          </Link>

          <Link href="/contact" className="text-[13px] font-bold text-primary/80 hover:text-primary transition-all tracking-wide uppercase">
            Contact Us
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-5 shrink-0">
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center animate-in slide-in-from-right-4 duration-300">
                <Input 
                  autoFocus
                  className="w-[180px] md:w-[300px] h-10 rounded-full border-primary/10 pl-4 pr-10 text-sm"
                  placeholder="Search pure..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-3 text-primary/40 hover:text-primary">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="w-9 h-9 flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
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
                  <DropdownMenuItem onClick={() => setLoginOpen(true)} className="rounded-xl py-2.5 px-3 text-xs font-bold cursor-pointer">
                    <User className="w-4 h-4 mr-2 text-primary/40" /> Customer Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin/login')} className="rounded-xl py-2.5 px-3 text-xs font-bold cursor-pointer">
                    <ShieldCheck className="w-4 h-4 mr-2 text-primary/40" /> Admin Access
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={onOpenCart} className="group relative flex items-center justify-center w-9 h-9 md:w-auto md:px-2 text-primary/80 hover:text-primary transition-all">
            <ShoppingCart className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black rounded-full min-w-[15px] h-[15px] flex items-center justify-center border border-white">
              {cartCount}
            </div>
            <span className="hidden lg:inline ml-2 text-[13px] font-bold tracking-wide">CART</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-none bg-[#FDFBFA]">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col">
            <div className="p-8 bg-primary text-white relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white/5 pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Image 
                    src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
                    alt="Vivaan Farms"
                    width={40}
                    height={40}
                    className="brightness-0 invert object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="font-headline text-2xl font-bold tracking-tight lowercase">vivaan</div>
                  <div className="text-[8px] font-black text-white/40 uppercase tracking-[3px]">farms</div>
                </div>
              </div>
              
              {user ? (
                <div className="relative z-10 text-left">
                  <div className="text-sm font-bold opacity-60">Welcome,</div>
                  <div className="text-xl font-headline font-extrabold">{user.displayName || 'Farmer'}</div>
                </div>
              ) : (
                <div className="text-left">
                  <button 
                    onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
                    className="relative z-10 h-11 px-6 rounded-full bg-white text-primary text-xs font-black uppercase tracking-widest shadow-xl"
                  >
                    Sign In ✦
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              <div className="px-6 mb-8">
                <div className="text-[10px] font-black text-[#7A6848] uppercase tracking-[3px] mb-4 text-left">Store Collections</div>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <button 
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-primary/5 transition-all group"
                    >
                      <span className="text-sm font-bold text-primary/80 group-hover:text-primary">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-primary/20 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 mb-8">
                <div className="text-[10px] font-black text-[#7A6848] uppercase tracking-[3px] mb-4 text-left">Discovery</div>
                <div className="space-y-1">
                  <Link 
                    href="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-4 py-3.5 px-4 rounded-2xl hover:bg-primary/5 transition-all group"
                  >
                    <Info className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold text-primary/80 group-hover:text-primary">About Us</span>
                  </Link>
                  <Link 
                    href="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-4 py-3.5 px-4 rounded-2xl hover:bg-primary/5 transition-all group"
                  >
                    <Phone className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold text-primary/80 group-hover:text-primary">Contact Us</span>
                  </Link>
                  <Link 
                    href="/track" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-4 py-3.5 px-4 rounded-2xl hover:bg-primary/5 transition-all group"
                  >
                    <Package className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold text-primary/80 group-hover:text-primary">Track Order</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-primary/5">
              <div className="bg-[#EBF5EE] p-4 rounded-[20px] text-center mb-6">
                <div className="text-[10px] font-black text-primary uppercase tracking-[2px] mb-1">Pure Promise</div>
                <div className="text-xs font-medium text-[#7A6848]">Gujarat Farm Direct Purity</div>
              </div>
              
              {user && (
                <button 
                  onClick={handleLogout}
                  className="w-full h-12 flex items-center justify-center gap-2 text-destructive font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
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
