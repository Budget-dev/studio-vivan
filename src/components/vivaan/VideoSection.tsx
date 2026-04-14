
"use client";

import React from 'react';
import { cn } from "@/lib/utils";

export const VideoSection: React.FC = () => {
  const videoUrl = "https://vivanfa.sirv.com/Firefly%20Create%20a%20cinematic%205-second%20square%20(1-1)%20premium%20food%20advertisement%20set%20in%20a%20warm%2C%20rustic%20ki.mp4";
  
  // Exactly 3 videos as requested
  const videos = [0, 1, 2];

  return (
    <section className="py-10 md:py-24 bg-[#EBF5EE] border-t border-border/50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="font-headline text-3xl md:text-6xl font-extrabold text-primary leading-tight">
            Cook with Vivaan
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mt-4 md:mt-6 rounded-full"></div>
        </div>

        {/* Compact horizontal scroll for mobile and desktop, matching Native Ingredients style */}
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:gap-8 pb-8 md:pb-0 px-1">
          {videos.map((i) => (
            <div 
              key={i} 
              className="relative min-w-[200px] md:flex-1 aspect-square rounded-[24px] md:rounded-[32px] overflow-hidden group shadow-xl bg-white shrink-0 snap-center border-4 border-white"
            >
              <video
                src={videoUrl}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/30 backdrop-blur-xl border border-white/50 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                    <i className="fa-solid fa-play text-lg md:text-xl ml-1"></i>
                 </div>
              </div>
              <div className="absolute bottom-4 left-4 block md:hidden">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-[10px]">
                  <i className="fa-solid fa-play ml-0.5"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
