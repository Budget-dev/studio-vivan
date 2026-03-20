"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const Hero: React.FC = () => {
  const banners = PlaceHolderImages.filter(img => img.id.startsWith('hero-banner'));

  return (
    <section className="relative w-full border-b border-border/10">
      <Carousel 
        opts={{ loop: true }} 
        className="w-full h-[220px] md:h-[350px] overflow-hidden"
      >
        <CarouselContent className="h-full ml-0">
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id} className="relative h-full pl-0">
              <div className="relative w-full h-[220px] md:h-[350px]">
                <Image
                  src={banner.imageUrl}
                  alt={banner.description}
                  fill
                  className="object-cover brightness-[0.85]"
                  data-ai-hint={banner.imageHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center">
                  <div className="max-w-[1400px] mx-auto px-5 md:px-10 w-full">
                    <div className="max-w-2xl text-left">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black tracking-[2px] uppercase mb-3 md:mb-5">
                        Authentic Bilona Method · Gujarat Farm Direct
                      </div>
                      <h1 className="font-headline text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 md:mb-6">
                        {index === 0 && <>The Gold Standard of <span className="italic text-white/90 underline decoration-primary underline-offset-8">A2 Ghee</span></>}
                        {index === 1 && <>Directly From Our <span className="italic text-white/90 underline decoration-primary underline-offset-8">Gujarat Farm</span></>}
                        {index === 2 && <>Traditional Wisdom, <span className="italic text-white/90 underline decoration-primary underline-offset-8">Modern Purity</span></>}
                      </h1>
                      <div className="flex gap-2.5 md:gap-4">
                        <Button className="h-9 md:h-11 px-5 md:px-8 rounded-full bg-primary text-white font-black uppercase tracking-widest hover:bg-secondary transition-all group border-none shadow-xl text-[9px] md:text-xs">
                          Shop Now <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="h-9 md:h-11 px-5 md:px-8 rounded-full bg-white/5 border-white/30 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm text-[9px] md:text-xs">
                          Our Story
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 right-4 hidden md:flex gap-2 z-20">
          <CarouselPrevious className="relative translate-y-0 left-0 bg-white/10 border-white/20 text-white hover:bg-white/30 w-8 h-8 rounded-full backdrop-blur-md" />
          <CarouselNext className="relative translate-y-0 right-0 bg-white/10 border-white/20 text-white hover:bg-white/30 w-8 h-8 rounded-full backdrop-blur-md" />
        </div>
      </Carousel>
    </section>
  );
};
