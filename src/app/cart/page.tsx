
"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, ChevronLeft, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQty, removeFromCart, totalQty, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'VIVAAN10') {
      setAppliedDiscount(Math.round(subtotal * 0.1));
    } else {
      alert("Invalid coupon code");
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] text-[#100C06]">
        <Ticker />
        <Header onOpenCart={() => {}} cartCount={0} onFilter={() => {}} onSearch={() => {}} />
        <main className="max-w-[1400px] mx-auto px-5 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
            <ShoppingBag className="w-10 h-10 text-primary/20" />
          </div>
          <h1 className="font-headline text-5xl font-extrabold text-primary mb-6">Your cart is empty</h1>
          <p className="text-[#7A6848] text-lg max-w-md mb-12">Looks like you haven't added any farm-fresh goodness yet.</p>
          <Button 
            onClick={() => router.push('/')}
            className="h-16 px-12 bg-primary text-white rounded-full font-black uppercase tracking-[3px] shadow-xl hover:bg-secondary transition-all"
          >
            Start Shopping
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFA] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header onOpenCart={() => {}} cartCount={totalQty} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 md:py-16">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#7A6848] font-bold text-xs uppercase tracking-widest mb-10 hover:text-primary transition-all">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-0">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b border-[#EEE0BC] text-[10px] font-black uppercase tracking-[3px] text-[#7A6848]">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {cart.map((item) => (
              <div key={`${item.id}-${item.vol}`} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 py-8 border-b border-[#EEE0BC]/50 items-center relative group">
                <button 
                  onClick={() => removeFromCart(item.id, item.vol)}
                  className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[#7A6848]/40 hover:text-destructive transition-all md:opacity-0 group-hover:opacity-100 hidden md:flex"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="col-span-12 md:col-span-6 flex items-center gap-6">
                  <button 
                    onClick={() => removeFromCart(item.id, item.vol)}
                    className="md:hidden w-8 h-8 rounded-full border border-border flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-24 h-24 bg-[#F9F6EF] rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden p-2 border border-[#EEE0BC]/30 shadow-sm">
                    {item.imageUrls?.[0] ? (
                      <Image src={item.imageUrls[0]} alt={item.name} fill className="object-contain" />
                    ) : (
                      <span className="text-4xl">🧈</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-headline text-xl md:text-2xl font-bold text-primary leading-tight truncate">{item.name}</h3>
                    <p className="text-[10px] font-black text-[#7A6848] uppercase tracking-widest mt-1.5">{item.vol} jar</p>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-2 text-left md:text-center">
                  <div className="md:hidden text-[9px] font-black uppercase text-[#7A6848]/50 mb-1">Price</div>
                  <div className="text-base font-bold no-underline font-sans">₹{item.price.toLocaleString('en-IN')}</div>
                </div>

                <div className="col-span-6 md:col-span-2 flex justify-end md:justify-center">
                  <div className="flex items-center bg-white border border-[#EEE0BC] rounded-full h-10 px-1 shrink-0 shadow-sm">
                    <button onClick={() => updateQty(item.id, item.vol, -1)} className="w-8 h-8 rounded-full hover:bg-[#F9F6EF] flex items-center justify-center transition-all"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="w-8 text-center text-xs font-black font-sans">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.vol, 1)} className="w-8 h-8 rounded-full hover:bg-[#F9F6EF] flex items-center justify-center transition-all"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-2 text-right">
                  <div className="md:hidden text-[9px] font-black uppercase text-[#7A6848]/50 mb-1">Subtotal</div>
                  <div className="text-lg md:text-xl font-black text-primary font-sans no-underline leading-tight">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}

            <div className="pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="w-full max-w-sm">
                <p className="text-[10px] font-black uppercase tracking-[2px] text-[#7A6848] mb-4">Have a coupon? Enter your code.</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                    <Input 
                      placeholder="Coupon code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-12 pl-11 rounded-xl bg-white border-[#EEE0BC] font-bold text-sm focus-visible:ring-primary" 
                    />
                  </div>
                  <Button onClick={handleApplyCoupon} variant="outline" className="h-12 px-8 rounded-xl border-[#EEE0BC] font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">Apply</Button>
                </div>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="text-[11px] font-black uppercase tracking-[3px] text-[#7A6848] hover:text-primary transition-all border-b-2 border-transparent hover:border-primary pb-1"
              >
                Update Cart
              </button>
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-[#EEE0BC]/30 sticky top-32">
              <h2 className="font-headline text-3xl font-extrabold text-primary mb-10">Cart Totals</h2>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#7A6848]">Shipping (3-5 Business Days)</span>
                  <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">Free</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#7A6848]">Tax (GST Estimated)</span>
                  <span className="font-sans font-bold">₹0</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#7A6848]">Subtotal</span>
                  <span className="font-sans font-bold no-underline">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-bold text-primary">
                    <span>Discount</span>
                    <span className="font-sans no-underline">−₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="pt-6 border-t border-[#EEE0BC] flex justify-between items-center">
                  <span className="text-lg font-black uppercase tracking-tight">Total</span>
                  <span className="text-4xl font-black text-primary font-sans no-underline leading-tight">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button 
                onClick={() => router.push('/checkout')}
                className="w-full h-16 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[3px] shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 mb-6"
              >
                Proceed to Checkout
              </Button>

              <div className="text-center">
                <Link href="/" className="text-[10px] font-black uppercase tracking-[3px] text-[#7A6848] hover:text-primary transition-all flex items-center justify-center gap-2 group">
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav activeTab="cart" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} cartCount={totalQty} />
    </div>
  );
}
