
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ShoppingBag, Coins, ChevronLeft, MapPin, Truck, Ticket, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, getDocs } from 'firebase/firestore';
import { UserProfile, UniversalCoupon } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const { cart, totalQty, subtotal } = useCart();
  
  // State for Discounts
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [useCoins, setUseCoins] = useState(false);
  
  // User Profile
  const userRef = useMemoFirebase(() => user ? doc(db, 'userProfiles', user.uid) : null, [db, user]);
  const { data: userProfile } = useDoc<UserProfile>(userRef);

  // Coupons Collection
  const couponsRef = useMemoFirebase(() => collection(db, 'universalCoupons'), [db]);
  const { data: universalCoupons } = useCollection<UniversalCoupon>(couponsRef);

  const [address, setAddress] = useState({
    name: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('vivaan_shipping');
    if (saved) setAddress(JSON.parse(saved));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  // Coupon Logic
  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const input = couponInput.toUpperCase().trim();
    
    // 1. Check Universal Coupons
    const universal = universalCoupons?.find(c => c.code === input && c.isActive && new Date(c.expiryDate) > new Date());
    if (universal) {
      setAppliedCoupon({ ...universal, target: 'all' });
      return;
    }

    // 2. Check Product-Specific Coupons
    const productMatch = cart.find(item => item.productCoupon === input);
    if (productMatch) {
      setAppliedCoupon({ 
        code: input, 
        type: 'flat', 
        value: 100, // Default product discount or dynamic if needed
        target: productMatch.id 
      });
      return;
    }

    alert("Invalid or expired coupon code.");
  };

  // Calculations
  const calculations = useMemo(() => {
    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.target === 'all') {
        couponDiscount = appliedCoupon.type === 'percentage' 
          ? (subtotal * appliedCoupon.value) / 100 
          : appliedCoupon.value;
      } else {
        const item = cart.find(i => i.id === appliedCoupon.target);
        if (item) couponDiscount = appliedCoupon.value;
      }
    }

    const coinsAvailable = userProfile?.purityCoins || 0;
    const coinsDiscount = useCoins ? Math.min(coinsAvailable, subtotal - couponDiscount) : 0;
    
    const finalTotal = Math.max(0, subtotal - couponDiscount - coinsDiscount);
    const earnedCoins = cart.reduce((acc, item) => acc + ((item.rewardCoins || 0) * item.qty), 0);

    return { couponDiscount, coinsDiscount, finalTotal, earnedCoins };
  }, [subtotal, appliedCoupon, useCoins, userProfile, cart]);

  const handleProceedToPayment = () => {
    if (!user) { router.push('/login?returnTo=/checkout'); return; }
    if (!address.name || !address.phone || !address.address || !address.pincode) {
      alert("Please fill in all required shipping fields."); return;
    }
    
    localStorage.setItem('vivaan_shipping', JSON.stringify(address));
    // Save checkout state for payment page
    localStorage.setItem('vivaan_checkout_state', JSON.stringify({
      appliedCoupon: appliedCoupon?.code || null,
      coinsRedeemed: useCoins ? calculations.coinsDiscount : 0,
      earnedCoins: calculations.earnedCoins,
      finalTotal: calculations.finalTotal
    }));
    
    router.push('/payment');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center p-10">
        <ShoppingBag className="w-20 h-20 text-primary/20 mb-6" />
        <h1 className="font-headline text-3xl font-extrabold text-primary mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push('/')} className="bg-primary text-white rounded-full px-10">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header onOpenCart={() => router.push('/')} cartCount={totalQty} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1400px] mx-auto px-5 py-10 md:py-20">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-primary font-bold text-sm mb-10 hover:gap-3 transition-all">
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white"><MapPin className="w-6 h-6" /></div>
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary">Shipping Address</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[32px] border border-primary/5 shadow-xl">
                <Input name="name" value={address.name} onChange={handleInputChange} placeholder="Full Name *" className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                <Input name="phone" value={address.phone} onChange={handleInputChange} placeholder="Phone Number *" className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                <Input name="address" value={address.address} onChange={handleInputChange} placeholder="Address *" className="md:col-span-2 h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                <Input name="city" value={address.city} onChange={handleInputChange} placeholder="City *" className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                <div className="grid grid-cols-2 gap-4">
                  <Input name="state" value={address.state} onChange={handleInputChange} placeholder="State" className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                  <Input name="pincode" value={address.pincode} onChange={handleInputChange} placeholder="Pincode *" className="h-14 rounded-2xl bg-[#F9F6EF] border-transparent font-bold" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white"><ShoppingBag className="w-6 h-6" /></div>
                <h2 className="font-headline text-3xl font-extrabold text-primary">Review Items</h2>
              </div>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.vol}`} className="bg-white border border-primary/5 rounded-[24px] p-6 flex gap-6 shadow-sm">
                    <div className="w-20 h-20 bg-[#F9F6EF] rounded-xl flex items-center justify-center shrink-0 relative">
                      {item.imageUrls?.[0] ? <Image src={item.imageUrls[0]} alt={item.name} fill className="object-contain" /> : <span className="text-3xl">🧈</span>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline text-xl font-bold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{item.vol} · {item.rewardCoins || 0} Coins Reward</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm font-bold text-muted-foreground">Qty: {item.qty}</span>
                        <span className="text-lg font-black">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-primary/5 sticky top-32">
              <h2 className="font-headline text-2xl font-extrabold mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8">
                {/* Coupon Input */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <Input 
                        placeholder="Coupon Code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="h-12 pl-11 rounded-xl bg-[#F9F6EF] border-transparent font-bold text-xs" 
                      />
                    </div>
                    <Button onClick={handleApplyCoupon} variant="outline" className="h-12 rounded-xl px-6 border-primary/20 font-black text-[10px] uppercase tracking-widest">Apply</Button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-xl border border-primary/10">
                      <span className="text-[10px] font-black text-primary uppercase">CODE: {appliedCoupon.code}</span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-[10px] text-destructive font-bold uppercase underline">Remove</button>
                    </div>
                  )}
                </div>

                {/* Coins Redemption */}
                {userProfile && userProfile.purityCoins > 0 && (
                  <div 
                    onClick={() => setUseCoins(!useCoins)}
                    className={cn(
                      "p-5 rounded-[24px] border-2 cursor-pointer transition-all flex items-center justify-between group",
                      useCoins ? "bg-primary text-white border-primary shadow-lg" : "bg-[#F9F6EF] border-transparent hover:border-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xl", useCoins ? "bg-white/20" : "bg-white")}>🪙</div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Purity Balance</div>
                        <div className="text-sm font-bold">{userProfile.purityCoins} Coins available</div>
                      </div>
                    </div>
                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", useCoins ? "border-white" : "border-primary/20")}>
                      {useCoins && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-6 border-t border-[#F9F6EF]">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {calculations.couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span className="font-bold">Coupon Savings</span>
                      <span className="font-black">−₹{calculations.couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {calculations.coinsDiscount > 0 && (
                    <div className="flex justify-between text-sm text-secondary">
                      <span className="font-bold">Coins Redeemed</span>
                      <span className="font-black">−₹{calculations.coinsDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-secondary">
                    <span className="font-bold">Shipping (NimbusPost)</span>
                    <span className="font-black">FREE</span>
                  </div>
                  <div className="pt-4 border-t-2 border-[#F9F6EF] flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-tight">Total</span>
                    <span className="font-headline text-4xl font-extrabold text-primary">₹{calculations.finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#EBF5EE] p-5 rounded-[24px] border border-primary/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🌱</div>
                <div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest">Earned Today</div>
                  <div className="text-base font-black text-primary">+{calculations.earnedCoins} Purity Coins</div>
                </div>
              </div>

              <Button 
                onClick={handleProceedToPayment}
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
