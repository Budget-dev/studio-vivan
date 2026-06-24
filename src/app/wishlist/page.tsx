
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { CartSidebar } from '@/components/vivaan/CartSidebar';
import { ProductCard } from '@/components/vivaan/ProductCard';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Product } from '@/types';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const { cart, addToCart, updateQty, removeFromCart, totalQty } = useCart();
  const { wishlist } = useWishlist();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: dbProducts, isLoading: productsLoading } = useCollection(productsRef);

  const wishlistedProducts = useMemo(() => {
    if (!dbProducts) return [];
    return dbProducts
      .filter(p => wishlist.includes(p.id))
      .map((p, i) => ({
        ...p,
        cat: (p.categoryId || 'uncategorized').toLowerCase(),
        price: Number(p.basePrice) || 0,
        mrpPrice: Number(p.mrpPrice) || Number(p.basePrice) || 0,
        vol: p.volumeValue ? `${p.volumeValue}${p.volumeUnit || ''}` : 'Standard',
        pi: i,
        rating: Number(p.rating) || 4.9,
        vars: Array.isArray(p.vars) && p.vars.length > 0 ? p.vars : [{ s: 'Standard', p: Number(p.basePrice) || 0, on: true }]
      } as Product));
  }, [dbProducts, wishlist]);

  const handleTabChange = (tab: string) => {
    if (tab === 'home' || tab === 'shop') {
      router.push('/');
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'account') {
      router.push('/track');
    } else if (tab === 'wishlist') {
      router.push('/wishlist');
    }
  };

  const handleAddAction = (p: Product) => {
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    addToCart(p);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <div className="sticky top-0 z-[900]">
        <Ticker />
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          cartCount={totalQty}
          onFilter={() => router.push('/')}
          onSearch={() => router.push('/')}
        />
      </div>

      <main className="py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="mb-12">
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary">Your Wishlist</h1>
            <p className="text-[#7A6848] font-medium mt-2">Saved pure farm products for your next harvest.</p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-[20px] aspect-[4/5] animate-pulse border border-[#E5E7EB]/50"></div>
              ))}
            </div>
          ) : wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {wishlistedProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  isInCart={cart.some(c => c.id === p.id)}
                  onOpen={() => router.push(`/product/${p.id}`)}
                  onAdd={() => handleAddAction(p)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[40px] text-center border border-primary/5 shadow-xl flex flex-col items-center">
              <Heart className="w-16 h-16 text-primary/10 mb-6" />
              <h2 className="text-2xl font-black mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto">
                Explore our traditional A2 Ghee and handcrafted farm goods to start your purity collection.
              </p>
              <Button 
                onClick={() => router.push('/')} 
                className="h-14 px-10 bg-primary text-white rounded-full font-black uppercase tracking-widest flex items-center gap-2"
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav activeTab="wishlist" onTabChange={handleTabChange} cartCount={totalQty} />
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); router.push('/checkout'); }}
      />
    </div>
  );
}
