"use client";

import React, { useState, useEffect } from 'react';
import { generateLivePurchaseNotification } from '@/ai/flows/dynamic-live-purchase-notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

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
        setMessage("Someone from Mumbai just purchased A2 Gir Ghee!");
        setShow(true);
        setTimeout(() => setShow(false), 5000);
      }
    };

    const interval = setInterval(triggerNotif, 25000);
    const initial = setTimeout(triggerNotif, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, []);

  return (
    <div className={`fixed bottom-[84px] md:bottom-24 left-4 md:left-6 z-[500] bg-white rounded-2xl border border-[#DDD0B5] p-3 flex items-center gap-3.5 shadow-2xl transition-all duration-500 ease-out ${show ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0'}`}>
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
        <FontAwesomeIcon icon={faCircleCheck} className="text-primary text-sm" />
      </div>
      <div className="text-[11px] text-foreground font-semibold leading-tight max-w-[200px]">
        {message}
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 animate-ping"></div>
    </div>
  );
};