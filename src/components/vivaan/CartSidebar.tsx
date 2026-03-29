"use client";

import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, Gift, ArrowRight } from 'lucide-react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JarIcon, ComboIcon } from './JarIcon';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (id: string, vol: string, delta: number) => void;
  onRemove: (id: string, vol: string) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cart, onUpdateQty, onRemove, onCheckout }) => {
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const coinsDiscount = cart.length > 0 ? 200 : 0;
  const total = Math.max(0, subtotal - discount - coinsDiscount);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'PURE15') {
      setDiscount(Math.round(subtotal * 0.15));
      setAppliedCoupon('PURE15');
    } else if (coupon.toUpperCase() === 'STAY20') {
      setDiscount(Math.round(subtotal * 0.20));
      setAppliedCoupon('STAY20');
    }
  };

  const getIcon = (item: CartItem) => {
    if (item.cat === 'combo') return <ComboIcon className="scale-[0.6]" />;
    if (item.cat === 'pickles') return <div className="text-3xl">🌶️</div>;
    if (item.cat === 'sweets') return <div className="text-3xl">🎁</div>;
    if (item.cat === 'honey') return <div className="text-3xl">🍯</div>;
    return <JarIcon c1="#D4EDE0" c2="#1B5E3B" sub="" idSuffix={`cart-${item.id}`} className="scale-[0.8]" />;
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" onClick={onClose}></div>}
      <div className={`fixed right-0 top-0 bottom-0 w-full md:max-w-[460px] bg-[#F9F6EF] z-[1001] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-[64px] md:h-[76px] bg-[#0D3520] flex items-center justify-between px-6 shrink-0 relative overflow-hidden">
          <div className="relative z-10">
            <div className="font-headline text-2xl font-extrabold text-white">My Cart</div>
            <div className="text-[10px] text-white/40 font-bold tracking-wider">{cart.length} items</div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex gap-2 mb-6">
            <Input 
              placeholder="🎁 Coupon Code" 
              className="bg-white border-[#DDD0B5] rounded-full h-12 text-sm font-medium pl-5"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <Button onClick={applyCoupon} className="h-12 bg-[#0D3520] hover:bg-[#1B5E3B] rounded-full px-6 font-bold text-white">Apply</Button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-[#FBF3DC] rounded-full flex items-center justify-center text-3xl mb-4">🛒</div>
              <h3 className="font-headline text-2xl font-bold text-foreground mb-2">Cart is Empty</h3>
              <p className="text-sm text-[#7A6848] max-w-[240px] leading-relaxed">Add some pure farm goods from Vivaan Farms to get started!</p>
              <Button onClick={onClose} className="mt-8 bg-primary text-white px-8 rounded-full">Explore Products →</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={`${item.id}-${item.vol}`} className="bg-white border border-[#DDD0B5] rounded-2xl p-4 flex gap-4 relative group shadow-sm">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#F8F2E5] to-[#EDE4CF] rounded-xl flex items-center justify-center shrink-0">
                    {getIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-headline text-base md:text-lg font-bold text-foreground truncate">{item.name}</h4>
                    <p className="text-[10px] text-[#7A6848] font-bold uppercase tracking-wider mb-2">{item.vol}</p>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                      <div className="flex items-center bg-[#F9F6EF] border border-[#DDD0B5] rounded-lg overflow-hidden h-8">
                        <button onClick={() => onUpdateQty(item.id, item.vol, -1)} className="w-8 h-full flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-8 text-center text-xs font-black">{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.id, item.vol, 1)} className="w-8 h-full flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id, item.vol)} className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-50 text-destructive/20 hover:text-destructive transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border-t border-[#DDD0B5] p-5 md:p-6 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <div className="space-y-2.5 mb-5">
            <div className="flex justify-between text-xs font-semibold text-[#7A6848]">
              <span>Subtotal</span>
              <span className="text-foreground font-black">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs font-bold text-secondary">
                <span>Discount ({appliedCoupon})</span>
                <span>−₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-bold text-[#7A6848]">
              <span>Purity Coins (−200 🪙)</span>
              <span className="text-primary">−₹200</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-secondary">
              <span>Delivery</span>
              <span className="uppercase">FREE 🚚</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t-2 border-[#F9F6EF] mb-5">
            <span className="text-base font-black uppercase tracking-tight">Total Payable</span>
            <span className="font-headline text-3xl md:text-4xl font-extrabold text-foreground">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <Button 
            disabled={cart.length === 0}
            onClick={onCheckout}
            className="w-full h-14 bg-gradient-to-br from-[#1B5E3B] to-[#0D3520] rounded-full text-sm font-black uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-2"
          >
            Checkout Securely <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
