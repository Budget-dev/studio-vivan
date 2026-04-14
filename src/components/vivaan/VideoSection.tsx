
"use client";

import React from 'react';
import { cn } from "@/lib/utils";

export const VideoSection: React.FC = () => {
  const videoUrl = "https://vivanfa.sirv.com/Firefly%20Create%20a%20cinematic%205-second%20square%20(1-1)%20premium%20food%20advertisement%20set%20in%20a%20warm%2C%20rustic%20ki.mp4";
  
  // Exactly 3 videos as requested
  const videos = [
    { title: "Farm to Table", sub: "The Vivaan Journey" },
    { title: "Traditional Roots", sub: "Bilona Craftsmanship" },
    { title: "Pure Goodness", sub: "Gujarat's Finest" }
  ];

  return (
    <section className="py-10 md:py-24 bg-[#EBF5EE] border-t border-border/50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-headline text-3xl md:text-6xl font-extrabold text-primary leading-tight">
            Cook with Vivaan
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mt-4 md:mt-6 rounded-full"></div>
        </div>

        {/* Using the exact same container structure as NativeSection */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto no-scrollbar md:overflow-x-visible snap-x snap-mandatory gap-4 md:gap-6 -mx-5 px-5 md:mx-0 md:px-0 pb-8 md:pb-0">
          {videos.map((vid, i) => (
            <div 
              key={i} 
              className="relative min-w-[280px] md:min-w-0 aspect-[4/5.5] rounded-[20px] md:rounded-[24px] overflow-hidden group shadow-lg bg-white shrink-0 snap-center"
            >
              <video
                src={videoUrl}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                muted
                loop
                playsInline
                autoPlay
              />
              {/* Overlay matching NativeSection */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end md:justify-center text-center">
                <div className="space-y-2 md:space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[2px] text-white/90">{vid.sub}</div>
                  <h3 className="font-headline text-xl md:text-3xl font-bold text-white leading-tight">
                    {vid.title}
                  </h3>
                  
                  {/* Play Button Indicator */}
                  <div className="flex justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-xl border border-white/50 flex items-center justify-center text-white">
                      <i className="fa-solid fa-play ml-1"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Play Indicator */}
              <div className="absolute top-4 right-4 md:hidden">
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
