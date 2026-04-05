
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Smartphone, CreditCard, Landmark, Banknote, ChevronLeft } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const { totalQty, subtotal } = useCart();
  const [method, setMethod] = useState<'upi' | 'card' | 'net' | 'cod'>('upi');
  const [loading, setLoading] = useState(false);

  const total = Math.max(0, subtotal - 200);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/order-success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header onOpenCart={() => {}} cartCount={totalQty} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1200px] mx-auto px-5 py-10 md:py-20 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-primary font-bold text-sm mb-10 hover:gap-3 transition-all">
            <ChevronLeft className="w-4 h-4" /> Back to Checkout
          </button>

          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-primary/5">
            <div className="bg-primary p-10 text-white text-center relative overflow-hidden">
              <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
              <div className="text-[10px] font-black uppercase tracking-[4px] opacity-40 mb-4">Final Amount</div>
              <div className="font-headline text-7xl font-extrabold leading-none">₹{total.toLocaleString('en-IN')}</div>
            </div>

            <div className="p-10">
              <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[3px] mb-8">Select Payment Method</h2>
              
              <div className="grid grid-cols-1 gap-4 mb-10">
                {[
                  { id: 'upi', icon: <Smartphone />, title: 'UPI (Google Pay, PhonePe)', desc: 'Instant & Secure' },
                  { id: 'card', icon: <CreditCard />, title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { id: 'net', icon: <Landmark />, title: 'Net Banking', desc: 'All Indian Banks' },
                  { id: 'cod', icon: <Banknote />, title: 'Cash on Delivery', desc: 'Pay when your package arrives' },
                ].map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => setMethod(opt.id as any)}
                    className={`flex items-center gap-6 p-6 rounded-[24px] border-2 transition-all text-left ${method === opt.id ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border bg-white hover:border-primary/20'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${method === opt.id ? 'bg-primary text-white' : 'bg-[#F9F6EF] text-primary/40'}`}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className="text-base font-black text-foreground">{opt.title}</div>
                      <div className="text-xs text-muted-foreground font-bold">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {method === 'upi' && (
                <div className="mb-10 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Enter UPI ID</label>
                  <Input placeholder="e.g. name@okaxis" className="h-14 rounded-2xl border-2 focus-visible:ring-primary font-bold text-lg px-6" />
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mb-10 text-primary font-bold text-[11px] uppercase tracking-widest bg-primary/5 py-4 rounded-2xl border border-primary/10">
                <ShieldCheck className="w-5 h-5" /> 256-Bit SSL Encrypted Transaction
              </div>

              <Button 
                onClick={handlePay}
                disabled={loading}
                className="w-full h-18 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[3px] shadow-2xl transition-all hover:scale-[1.02]"
              >
                {loading ? '⏳ Processing Payment...' : `Confirm Payment →`}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
