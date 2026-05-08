
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
import { ShieldCheck, Lock, ChevronLeft } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/actions/payment-actions';
import { createShipment } from '@/actions/shipping-actions';
import { doc, setDoc, serverTimestamp, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const { cart, totalQty, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [checkoutState, setCheckoutState] = useState<any>(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem('vivaan_shipping');
    const savedState = localStorage.getItem('vivaan_checkout_state');
    
    if (savedAddress && savedState) {
      setShippingAddress(JSON.parse(savedAddress));
      setCheckoutState(JSON.parse(savedState));
    } else {
      router.push('/checkout');
    }
  }, [router]);

  const total = checkoutState?.finalTotal || subtotal;

  const handleRazorpayPayment = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Please sign in to complete your purchase." });
      router.push('/login?returnTo=/payment');
      return;
    }

    setLoading(true);

    try {
      const res = await createRazorpayOrder(total);
      if (!res.success || !res.order) throw new Error(res.error || 'Order creation failed');
      const order = res.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Vivaan Farms",
        description: "Farm-Direct Purity Purchase",
        image: "https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png",
        order_id: order.id,
        handler: async function (response: any) {
          const verificationRes = await verifyRazorpayPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verificationRes.success) {
            // 1. Create Shipping
            const shippingRes = await createShipment({
              orderId: response.razorpay_order_id,
              userEmail: user.email,
              items: cart,
              shippingAddress
            });

            // 2. Save Order to Firestore
            const orderData = {
              userId: user.uid,
              userEmail: user.email,
              items: cart,
              totalAmount: total,
              shippingAddress,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              status: 'Processing',
              paymentStatus: 'Paid',
              paymentMethod: 'Razorpay',
              orderDate: new Date().toISOString(),
              createdAt: serverTimestamp(),
              shipmentId: shippingRes.success ? shippingRes.shipmentId : null,
              trackingId: shippingRes.success ? shippingRes.trackingId : null,
              courierName: shippingRes.success ? shippingRes.courierName : null,
              coinsEarned: checkoutState.earnedCoins || 0,
              coinsRedeemed: checkoutState.coinsRedeemed || 0,
              couponApplied: checkoutState.appliedCoupon || null
            };

            await setDoc(doc(db, 'orders', response.razorpay_order_id), orderData);
            
            // 3. Update User Coins Ledger
            const userProfileRef = doc(db, 'userProfiles', user.uid);
            await setDoc(userProfileRef, {
              purityCoins: increment((checkoutState.earnedCoins || 0) - (checkoutState.coinsRedeemed || 0)),
              updatedAt: new Date().toISOString()
            }, { merge: true });

            toast({ title: "Payment Successful", description: "Coins credited and order processed!" });
            
            clearCart();
            localStorage.removeItem('vivaan_shipping');
            localStorage.removeItem('vivaan_checkout_state');
            
            if (shippingRes.success) {
              localStorage.setItem('vivaan_last_tracking', shippingRes.trackingId);
            }
            
            router.push('/order-success');
          } else {
            router.push('/order-failed');
          }
        },
        prefill: {
          name: user.displayName || shippingAddress.name,
          email: user.email || "",
          contact: shippingAddress.phone || "",
        },
        theme: { color: "#1B5E3B" },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment Error:', error);
      toast({ variant: "destructive", title: "Payment Error", description: error.message });
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
              <div className="text-[10px] font-black uppercase tracking-[4px] opacity-40 mb-4">Total Payable</div>
              <div className="font-headline text-7xl font-extrabold leading-none">₹{total.toLocaleString('en-IN')}</div>
            </div>

            <div className="p-10">
              <h2 className="text-[11px] font-black text-muted-foreground uppercase tracking-[3px] mb-8">Secure Payment Gateway</h2>
              
              <div className="bg-[#FDFBFA] border-2 border-primary/10 rounded-[24px] p-8 mb-10">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Items Total</span>
                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {checkoutState?.coinsRedeemed > 0 && (
                    <div className="flex justify-between text-sm text-secondary">
                      <span className="font-bold italic">Purity Coin Discount</span>
                      <span className="font-black">−₹{checkoutState.coinsRedeemed}</span>
                    </div>
                  )}
                  {checkoutState?.appliedCoupon && (
                    <div className="flex justify-between text-sm text-primary">
                      <span className="font-bold italic">Coupon Applied ({checkoutState.appliedCoupon})</span>
                      <span className="font-black">Applied</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-primary/5 flex justify-between items-center">
                    <span className="text-base font-black uppercase">Final Total</span>
                    <span className="text-2xl font-black text-primary">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-10 text-primary font-bold text-[11px] uppercase tracking-widest bg-primary/5 py-4 rounded-2xl border border-primary/10">
                <ShieldCheck className="w-5 h-5" /> Secured by Razorpay & NimbusPost
              </div>

              <Button 
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full h-18 bg-primary hover:bg-secondary text-white rounded-full font-black uppercase tracking-[3px] shadow-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 text-base"
              >
                {loading ? '⏳ Preparing Secure Checkout...' : `Pay ₹${total.toLocaleString('en-IN')} Now →`}
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
