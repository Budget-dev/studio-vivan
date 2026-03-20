"use client";

import React from 'react';

export const VideoSection: React.FC = () => {
  const videoUrl = "https://cdn.shopify.com/videos/c/vp/8a895a0c0d5b48edad21523773790e4d/8a895a0c0d5b48edad21523773790e4d.HD-720p-1.6Mbps-51250342.mp4";

  return (
    <section className="py-16 md:py-24 bg-[#EBF5EE]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-2">
            Cook with Vivaan
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="relative aspect-[9/16] rounded-2xl md:rounded-[32px] overflow-hidden shadow-xl border-4 border-white group"
            >
              <video
                src={videoUrl}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
