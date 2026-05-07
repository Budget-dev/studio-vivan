"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCcw, ArrowRight } from 'lucide-react';

export default function OrderFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06]">
      <Header onOpenCart={() => {}} cartCount={0} onSearch={() => {}} onFilter={() => {}} />

      <main className="max-w-[1200px] mx-auto px-5 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-10">
          <XCircle className="w-16 h-16" />
        </div>

        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary mb-6">Payment Failed</h1>
        <p className="text-xl text-[#7A6848] font-medium max-w-2xl mb-12">
          Oops! Something went wrong with your transaction. Don't worry, your cart is still safe. Please try again or use a different payment method.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Button onClick={() => router.push('/payment')} className="h-16 px-12 bg-primary text-white rounded-full font-black uppercase tracking-[3px] shadow-xl">
            Retry Payment <RefreshCcw className="w-5 h-5 ml-2" />
          </Button>
          <Button onClick={() => router.push('/contact')} variant="outline" className="h-16 px-12 rounded-full font-black uppercase tracking-[3px] border-primary/20">
            Contact Support
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
