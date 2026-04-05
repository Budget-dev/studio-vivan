
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Coins, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalQty, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center p-10">
        <ShoppingBag className="w-20 h-20 text-primary/20 mb-6" />
        <h1 className="font-headline text-3xl font-extrabold text-primary mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push('/')} className="bg-primary text-white rounded-full px-10">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header onOpenCart={() => router.push('/')} cartCount={totalQty} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1200px] mx-auto px-5 py-10 md:py-20">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-primary font-bold text-sm mb-10 hover:gap-3 transition-all">
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary">Review Your Order</h1>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.vol}`} className="bg-white border border-primary/5 rounded-[24px] p-6 flex gap-6 shadow-sm hover:shadow-md transition-all">
                  <div className="w-20 h-20 bg-[#F9F6EF] rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
                    {item.imageUrls?.[0] ? (
                      <Image src={item.imageUrls[0]} alt={item.name} fill className="object-contain" />
                    ) : (
                      <span className="text-3xl">🧈</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline text-xl font-bold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{item.vol}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-bold text-muted-foreground">Qty: {item.qty}</span>
                      <span className="text-lg font-black">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-primary/5 sticky top-32">
              <h2 className="font-headline text-2xl font-extrabold mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Subtotal ({totalQty} items)</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-secondary">
                  <span className="font-bold flex items-center gap-2"><Coins className="w-4 h-4" /> Purity Coins Applied</span>
                  <span className="font-black">−₹200</span>
                </div>
                <div className="flex justify-between text-sm text-secondary">
                  <span className="font-bold">Delivery Fee</span>
                  <span className="font-black uppercase">FREE</span>
                </div>
                <div className="pt-4 border-t-2 border-[#F9F6EF] flex justify-between items-center">
                  <span className="text-lg font-black uppercase tracking-tight">Total</span>
                  <span className="font-headline text-4xl font-extrabold">₹{Math.max(0, subtotal - 200).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-8">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Rewards Earned</div>
                <div className="text-sm font-bold text-primary flex items-center gap-2">
                  <Coins className="w-4 h-4" /> +{Math.round(subtotal * 0.1)} Purity Coins
                </div>
              </div>

              <Button 
                onClick={() => router.push('/payment')}
                className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[2px] shadow-xl flex items-center justify-center gap-3"
              >
                Proceed to Payment <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav activeTab="cart" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} cartCount={totalQty} />
    </div>
  );
}
