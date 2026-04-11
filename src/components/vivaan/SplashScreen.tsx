
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  // This component handles its own entrance, 
  // but visibility is controlled by the parent.
  // We'll keep it simple: it shows until the parent tells it to hide.
  
  return (
    <div className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Element */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1.2 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-[600px] h-[600px] rounded-full bg-white pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 md:w-44 md:h-44 relative mb-8 brightness-0 invert"
        >
          <Image 
            src="https://i.ibb.co/FqCKvSVb/Group-66-1-removebg-preview.png"
            alt="Vivaan Farms Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "10px" }}
          animate={{ opacity: 1, letterSpacing: "4px" }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="font-headline text-4xl md:text-6xl font-extrabold text-white mb-4 uppercase"
        >
          VIVAAN FARMS
        </motion.h1>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-0.5 bg-white/30 mb-4 rounded-full" />
          <p className="text-white/70 text-xs md:text-sm font-bold uppercase tracking-[3px]">
            Traditional Wisdom, Modern Purity
          </p>
        </motion.div>
      </div>

      {/* Loading Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-white/20 w-full"
      >
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        />
      </motion.div>
    </div>
  );
};
