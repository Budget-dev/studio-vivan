"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Smartphone, CreditCard, Landmark, Banknote, ChevronLeft, Lock } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/actions/payment-actions';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const { cart, totalQty, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const total = Math.max(0, subtotal - 200);

  const handleRazorpayPayment = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Please sign in to complete your purchase." });
      router.push('/login?returnTo=/payment');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order on Server
      const res = await createRazorpayOrder(total);
      
      if (!res.success || !res.order) {
        throw new Error(res.error || 'Order creation failed');
      }

      const order = res.order;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Vivaan Farms",
        description: "Farm-Direct Purity Purchase",
        image: "https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment on Server
          const verificationRes = await verifyRazorpayPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verificationRes.success) {
            // 4. Save Order to Firestore
            const orderData = {
              userId: user.uid,
              userEmail: user.email,
              items: cart,
              totalAmount: total,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              status: 'Pending',
              paymentStatus: 'Paid',
              paymentMethod: 'Razorpay',
              orderDate: new Date().toISOString(),
              createdAt: serverTimestamp(),
            };

            await setDoc(doc(db, 'orders', response.razorpay_order_id), orderData);
            
            toast({ title: "Payment Successful", description: "Your order has been placed." });
            clearCart();
            router.push('/order-success');
          } else {
            toast({ variant: "destructive", title: "Verification Failed", description: "Could not verify your payment securely." });
            router.push('/order-failed');
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: "#1B5E3B",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment Error:', error);
      toast({ variant: "destructive", title: "Payment Error", description: error.message || "An unexpected error occurred." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
              <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[3px] mb-8">Secure Payment Gateway</h2>
              
              <div className="bg-[#FDFBFA] border-2 border-primary/10 rounded-[24px] p-8 mb-10">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-foreground">Encrypted Transaction</div>
                    <div className="text-xs text-muted-foreground font-medium">Your data is secured with 256-bit SSL encryption. We use Razorpay for processing payments.</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Items ({totalQty})</span>
                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-secondary">
                    <span className="font-bold">Purity Coins Applied</span>
                    <span className="font-black">−₹200</span>
                  </div>
                  <div className="pt-4 border-t border-primary/5 flex justify-between items-center">
                    <span className="text-base font-black uppercase">Payable Total</span>
                    <span className="text-2xl font-black text-primary">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-10 text-primary font-bold text-[11px] uppercase tracking-widest bg-primary/5 py-4 rounded-2xl border border-primary/10">
                <ShieldCheck className="w-5 h-5" /> RBI Approved Payment Gateway
              </div>

              <Button 
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full h-18 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[3px] shadow-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                {loading ? '⏳ Initializing Secure Checkout...' : `Pay ₹${total.toLocaleString('en-IN')} Now →`}
              </Button>

              <div className="mt-8 flex justify-center gap-6 opacity-30 grayscale contrast-125">
                <img src="https://vivanfa.sirv.com/pay1.png" alt="Visa" className="h-4" />
                <img src="https://vivanfa.sirv.com/pay2.png" alt="Master" className="h-4" />
                <img src="https://vivanfa.sirv.com/pay3.png" alt="UPI" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav activeTab="cart" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} cartCount={totalQty} />
    </div>
  );
}
