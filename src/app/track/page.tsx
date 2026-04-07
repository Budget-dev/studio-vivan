
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/vivaan/Header';
import { Footer } from '@/components/vivaan/Footer';
import { Ticker } from '@/components/vivaan/Ticker';
import { BottomNav } from '@/components/vivaan/BottomNav';
import { LoginModal } from '@/components/vivaan/LoginModal';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Package, Truck, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrackOrderPage() {
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'orders'), 
      where('userId', '==', user.uid),
      orderBy('orderDate', 'desc')
    );
  }, [db, user]);

  const { data: orders, isLoading: ordersLoading } = useCollection(ordersQuery);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-secondary" />;
      default: return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#100C06] pb-[68px] md:pb-0">
      <Ticker />
      <Header onOpenCart={() => router.push('/checkout')} cartCount={0} onFilter={() => {}} onSearch={() => {}} />

      <main className="max-w-[1000px] mx-auto px-5 py-10 md:py-20">
        <div className="mb-12">
          <h1 className="font-headline text-5xl font-extrabold text-primary">Track Your Package</h1>
          <p className="text-[#7A6848] font-medium mt-2">View real-time status of your farm-fresh deliveries.</p>
        </div>

        {isUserLoading || ordersLoading ? (
          <div className="space-y-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-white rounded-[32px]"></div>
            ))}
          </div>
        ) : !user ? (
          <div className="bg-white p-12 rounded-[40px] text-center border border-primary/5 shadow-xl">
             <Package className="w-16 h-16 text-primary/20 mx-auto mb-6" />
             <h2 className="text-2xl font-black mb-4">Please Login to track orders</h2>
             <button onClick={() => setIsLoginOpen(true)} className="h-14 px-10 bg-primary text-white rounded-full font-black uppercase tracking-widest">Login Now</button>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[32px] overflow-hidden border border-primary/5 shadow-xl group hover:shadow-2xl transition-all">
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#F9F6EF] rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Order ID: #{order.id.substring(0, 8).toUpperCase()}</div>
                      <div className="text-xl font-headline font-black text-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3">
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider",
                      order.status === 'Delivered' ? "bg-primary/10 text-primary" : "bg-orange-100 text-orange-700"
                    )}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold">{order.paymentMethod} · {order.paymentStatus}</div>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-4 border-t border-[#F9F6EF] flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px]">🌿</div>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[40px] text-center border border-primary/5 shadow-xl">
             <Package className="w-16 h-16 text-primary/20 mx-auto mb-6" />
             <h2 className="text-2xl font-black mb-4">No orders found yet</h2>
             <p className="text-muted-foreground font-medium mb-8">Start your wellness journey with our A2 Ghee.</p>
             <button onClick={() => router.push('/')} className="h-14 px-10 bg-primary text-white rounded-full font-black uppercase tracking-widest">Shop Products</button>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav activeTab="account" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} cartCount={0} />
      
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
