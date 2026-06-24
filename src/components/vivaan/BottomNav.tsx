"use client";

import React from 'react';
import { Home, Heart, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'account', label: 'Orders', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[1000] flex justify-center px-4 md:hidden pointer-events-none bottom-nav-element">
      <nav className="w-full max-w-[400px] h-[68px] bg-gradient-to-r from-[#102B1A] via-[#173823] to-[#102B1A] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center px-2 pointer-events-auto border border-white/10 backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || (tab.id === 'account' && activeTab === 'account');
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 relative flex items-center justify-center h-full transition-all active:scale-95"
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-y-2 inset-x-1 bg-white rounded-full z-0 shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className={cn(
                "relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors duration-300",
                isActive ? "text-[#163A24]" : "text-white/40"
              )}>
                <tab.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                {isActive && (
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    {tab.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
