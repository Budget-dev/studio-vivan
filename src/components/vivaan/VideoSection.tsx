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
  const videoUrl = "https://cdn.shopify.com/videos/c/vp/8a895a0c0d5b48edad21523773790e4d/8a895a0c0d5b48edad21523773790e4d.HD-720p-1.6Mbps-51250342.mp4";
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
    <section className="py-10 md:py-20 bg-[#EBF5EE] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-primary mb-2">
            Cook with Vivaan
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 md:hidden -mx-5 px-5 pb-8">
          {videos.map((i) => (
            <div 
              key={i} 
              className="relative min-w-[160px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border-2 border-white shrink-0 snap-center"
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
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {videos.map((i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <div className="relative aspect-[9/16] rounded-[24px] overflow-hidden shadow-xl border-[3px] border-white group">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:flex justify-center gap-2.5 mt-10">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500 ease-out",
                    current === i 
                      ? "bg-primary w-8" 
                      : "bg-primary/20 hover:bg-primary/40 w-2"
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