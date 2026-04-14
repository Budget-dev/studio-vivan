
"use client";

import React from 'react';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
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
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[calc(68px+env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-xl border-t border-primary/10 flex items-start pt-2 px-2 z-[1100] pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex flex-col items-center gap-1 transition-all active:scale-90 pt-1",
            activeTab === tab.id ? "text-primary" : "text-primary/40"
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
          <span className="text-[9px] font-bold uppercase tracking-tight">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
