"use client";

import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export const VideoSection: React.FC = () => {
  const videoUrl = "https://vivanfa.sirv.com/Firefly%20Create%20a%20cinematic%205-second%20square%20(1-1)%20premium%20food%20advertisement%20set%20in%20a%20warm%2C%20rustic%20ki.mp4";
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const videos = [0, 1, 2, 3, 4, 5];

  return (
    <section className="py-12 md:py-24 bg-[#EBF5EE] border-t border-border/50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-headline text-3xl md:text-6xl font-extrabold text-primary leading-tight">
            Cook with Vivaan
          </h2>
          <div className="w-24 h-1 bg-primary/20 mx-auto mt-4 md:mt-6 rounded-full"></div>
        </div>

        {/* Horizontal Scroll Layout for Mobile - Smaller Cards like Native Section */}
        <div className="flex md:hidden overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 -mx-5 px-5 pb-8">
          {videos.map((i) => (
            <div 
              key={i} 
              className="relative min-w-[160px] aspect-square rounded-[20px] overflow-hidden group shadow-lg bg-white shrink-0 snap-center border-2 border-white"
            >
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3 left-3">
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-[8px]">
                  <i className="fa-solid fa-play ml-0.5"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Carousel remains standard size */}
        <div className="hidden md:block">
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-6">
              {videos.map((i) => (
                <CarouselItem key={i} className="pl-6 md:basis-1/3 lg:basis-1/4">
                  <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-xl border-[6px] border-white group">
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-xl border border-white/50 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                          <i className="fa-solid fa-play text-xl ml-1"></i>
                       </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:flex justify-center gap-3 mt-12">
              {Array.from({ length: Math.ceil(videos.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i * 3)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500 ease-out",
                    current >= i * 3 && current < (i + 1) * 3
                      ? "bg-primary w-10" 
                      : "bg-primary/10 hover:bg-primary/30 w-3"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
