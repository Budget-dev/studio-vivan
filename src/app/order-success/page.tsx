
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Truck, ArrowRight, Coins } from 'lucide-react';

export default function OrderSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    // We clear the cart after successful navigation
    // but keep it for one render if needed. Real apps would use the DB order ID.
  }, []);

  const handleFinish = () => {
    clearCart();
    router.push('/track');
  };

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06]">
      <Header onOpenCart={() => {}} cartCount={0} onSearch={() => {}} onFilter={() => {}} />

      <main className="max-w-[1200px] mx-auto px-5 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-10 animate-bounce">
          <CheckCircle2 className="w-16 h-16" />
        </div>

        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary mb-6">Order Placed Successfully!</h1>
        <p className="text-xl text-[#7A6848] font-medium max-w-2xl mb-12">
          Thanks for ordering! You can check your order status on the <strong className="text-primary cursor-pointer hover:underline" onClick={handleFinish}>‘Track Your Package’</strong> page.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-16">
          <div className="bg-white p-8 rounded-[32px] border border-primary/5 shadow-xl">
            <Coins className="w-10 h-10 text-secondary mb-4 mx-auto" />
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Rewards Earned</div>
            <div className="text-3xl font-extrabold text-primary">540 Purity Coins</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Valid for next 90 days</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-primary/5 shadow-xl">
            <Truck className="w-10 h-10 text-secondary mb-4 mx-auto" />
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estimated Delivery</div>
            <div className="text-3xl font-extrabold text-primary">3-5 Days</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Gujarat Farm Direct Shipping</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Button onClick={handleFinish} className="h-16 px-12 bg-primary text-white rounded-full font-black uppercase tracking-[3px] shadow-xl">
            Track My Order <Truck className="w-5 h-5 ml-2" />
          </Button>
          <Button onClick={() => { clearCart(); router.push('/'); }} variant="outline" className="h-16 px-12 rounded-full font-black uppercase tracking-[3px] border-primary/20">
            Back to Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
