"use client";

import React, { useState, useEffect } from 'react';
import { generateLivePurchaseNotification } from '@/ai/flows/dynamic-live-purchase-notifications';

export const LiveNotification: React.FC = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const triggerNotif = async () => {
      try {
        const { message: aiMessage } = await generateLivePurchaseNotification({});
        setMessage(aiMessage);
        setShow(true);
        setTimeout(() => setShow(false), 5000);
      } catch (e) {
        // Fallback
        setMessage("Someone from Mumbai just purchased A2 Gir Ghee!");
        setShow(true);
        setTimeout(() => setShow(false), 5000);
      }
    };

    const interval = setInterval(triggerNotif, 15000);
    const initial = setTimeout(triggerNotif, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, []);

  return (
    <div className={`fixed bottom-24 left-6 z-[500] bg-white rounded-2xl border border-border p-3.5 flex items-center gap-4 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] ${show ? 'translate-x-0' : '-translate-x-[120%]'}`}>
      <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center text-xl shrink-0">
        😊
      </div>
      <div className="text-xs text-foreground font-medium leading-relaxed max-w-[220px]">
        {message}
      </div>
      <div className="w-2 h-2 rounded-full bg-secondary shrink-0 animate-ping"></div>
    </div>
  );
};
