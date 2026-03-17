"use client";

import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, Gift } from 'lucide-react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JarIcon, ComboIcon, OilIcon } from './JarIcon';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (id: number, vol: string, delta: number) => void;
  onRemove: (id: number, vol: string) => void;
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
    } else {
      alert('Invalid coupon code. Try PURE15 or STAY20');
    }
  };

  const getIcon = (item: CartItem) => {
    if (item.cat === 'combo') return <ComboIcon className="scale-75" />;
    if (item.cat === 'oil') return <OilIcon c1="#D8F0D0" c2="#68A850" lbl="" idSuffix={`cart-${item.id}`} />;
    return <JarIcon c1="#F8E878" c2="#D4A030" sub="" idSuffix={`cart-${item.id}`} />;
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" onClick={onClose}></div>}
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-[460px] bg-white z-[1001] shadow-[-20px_0_60px_rgba(0,0,0,0.16)] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-[76px] bg-primary flex items-center justify-between px-6 shrink-0">
          <div>
            <div className="font-headline text-2xl font-extrabold text-white">My Cart</div>
            <div className="text-[11px] text-white/40 font-bold mt-0.5 tracking-wider">{cart.length} items · Vivaan Farms</div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="flex gap-2 mb-6">
            <Input 
              placeholder="🎁 Coupon (PURE15 or STAY20)" 
              className="bg-white border-border rounded-2xl h-12 text-sm font-medium"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <Button onClick={applyCoupon} className="h-12 bg-primary hover:bg-secondary rounded-2xl px-6 font-bold">Apply</Button>
          </div>

          {appliedCoupon && (
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-center gap-3 mb-6">
              <span className="text-2xl">🎉</span>
              <div>
                <div className="text-xs font-black text-secondary">Applied {appliedCoupon} successfully!</div>
                <div className="text-[10px] text-muted-foreground font-medium">Extra savings added to your order</div>
              </div>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-headline text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h3>
              <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">Add some pure Vivaan Farms A2 Ghee to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, i) => (
                <div key={`${item.id}-${item.vol}`} className="bg-card border border-border rounded-2xl p-4 flex gap-4 relative group">
                  <div className="w-[72px] h-[72px] bg-gradient-to-br from-[#FAF2E8] to-[#EEE4D0] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {getIcon(item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-headline text-lg font-bold text-foreground truncate">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">{item.vol}</p>
                    <div className="flex items-center justify-between">
                      <div className="font-headline text-xl font-extrabold text-foreground">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                      <div className="flex items-center bg-muted/50 border border-border rounded-xl overflow-hidden h-9">
                        <button onClick={() => onUpdateQty(item.id, item.vol, -1)} className="w-9 h-full hover:bg-border/50 flex items-center justify-center transition-all"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-8 text-center text-xs font-black">{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.id, item.vol, 1)} className="w-9 h-full hover:bg-border/50 flex items-center justify-center transition-all"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id, item.vol)} className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-50 text-destructive/30 hover:text-destructive transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border-t border-border p-6 shrink-0">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm font-medium text-secondary">
                <span>Discount ({appliedCoupon})</span>
                <span className="font-bold">−₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span>Coins (−200 🪙)</span>
              <span className="text-[#5A3C0A] font-bold">−₹200</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-secondary">
              <span>Delivery</span>
              <span className="font-black">FREE 🚚</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t-2 border-border mb-6">
            <span className="text-lg font-black text-foreground">Total Payable</span>
            <span className="font-headline text-4xl font-extrabold text-foreground">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <Button 
            disabled={cart.length === 0}
            onClick={onCheckout}
            className="w-full h-14 bg-gradient-to-br from-secondary to-primary rounded-2xl text-base font-black uppercase tracking-widest forest-sh transition-all hover:translate-y-[-2px] hover:shadow-forest-sh"
          >
            Proceed to Checkout →
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            SSL Encrypted · Powered by Razorpay
          </div>
        </div>
      </div>
    </>
  );
};
