"use client";

import React from 'react';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, cartCount }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: Grid },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-white/95 backdrop-blur-xl border-t border-[#D2C3A5]/50 flex items-start pt-2 px-2 z-[1000]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex flex-col items-center gap-1 transition-all active:scale-90",
            activeTab === tab.id ? "text-primary" : "text-[#B0A080]"
          )}
        >
          <div className={cn(
            "w-[44px] h-[30px] flex items-center justify-center rounded-[14px] transition-all relative",
            activeTab === tab.id && "bg-primary/10"
          )}>
            <tab.icon className={cn("w-5 h-5", activeTab === tab.id && "stroke-primary")} />
            {tab.badge && tab.badge > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[17px] h-[17px] bg-destructive text-white rounded-full text-[9px] font-black flex items-center justify-center px-1 border-2 border-white animate-in zoom-in-0">
                {tab.badge}
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
